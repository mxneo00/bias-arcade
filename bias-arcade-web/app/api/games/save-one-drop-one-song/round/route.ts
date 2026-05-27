import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/games/save-one-drop-one-song/sessionStore";
import { fetchArtistTrackBatch, fetchTrackBatch } from "@/lib/games/save-one-drop-one-song/spotifySource";
import { dedupeTracks, shuffle } from "@/lib/games/save-one-drop-one-song/helpers";
import { GameRound, SongA, SongB } from "@/lib/games/save-one-drop-one-song/types";
import { resolveCustomScope } from "@/lib/games/shared/artist-registry";

const DEFAULT_SEED_GENRES = [
    "k-pop", "k-rock", "korean-pop", "korean-rock", 
    "kpop", "kpop", "korean pop", "korean rock",
    "kpop boy group", "kpop girl group", "korean idol", "korean band",
    ];

const MIN_POOL = 60;
const REFILL_BATCH = 50;
const MAX_REFILL_ATTEMPTS = 3;
const USED_WINDOW = 60;

function getFresh(session: {
  pool: (SongA | SongB)[];
  recentlyUsedIds: string[];
}) {
  const recent = new Set(session.recentlyUsedIds);
  return session.pool.filter(
    (t) => !recent.has(t.id)
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<{ gameId: string }>;
  const gameId = body.gameId?.trim();

  if (!gameId) {
    console.warn("POST /game/round missing gameId");
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  const session = getSession(gameId);
  if (!session) {
    console.warn(`Session not found for gameId: ${gameId}`);
    return NextResponse.json({ error: "Game session not found or expired" }, { status: 404 });
  }

  try {
    if (session.maxRounds > 0 && session.roundNumber >= session.maxRounds) {
      return NextResponse.json({ error: "Maximum rounds reached" }, { status: 400 });
    }
    if (session.settings.scope.type === "all-kpop") {
      for (
        let attempt = 0;
        attempt < MAX_REFILL_ATTEMPTS && session.pool.length < MIN_POOL;
        attempt += 1
      ) {
        const batch = await fetchTrackBatch(request, {
          variant: `${session.variant}:${session.roundNumber}:prefill:${attempt}`,
          market: session.settings.market,
          seedGenres: session.settings.seedGenres,
          limit: REFILL_BATCH,
          defaultSeedGenres: DEFAULT_SEED_GENRES,
        });
      
        const poolIds = new Set(session.pool.map((t) => t.id));
        const toAdd = batch.filter(
          (t) => !poolIds.has(t.id)
        );

        session.pool = dedupeTracks([...session.pool, ...toAdd]);
      }

      let fresh = getFresh(session);
      for (
        let attempt = 0;
        attempt < MAX_REFILL_ATTEMPTS && fresh.length < 2;
        attempt += 1
      ) {
        const batch = await fetchTrackBatch(request, {
          variant: `${session.variant}:${session.roundNumber}:fresh:${attempt}`,
          market: session.settings.market,
          seedGenres: session.settings.seedGenres,
          limit: REFILL_BATCH,
          defaultSeedGenres: DEFAULT_SEED_GENRES,
        });

        const poolIds = new Set(session.pool.map((t) => t.id));
        const toAdd = batch.filter(
          (t) => !poolIds.has(t.id)
        );

        session.pool = dedupeTracks([...session.pool, ...toAdd]);
        fresh = getFresh(session);
      }
    } else if (session.settings.scope.type === "custom") {
      for (
        let attempt = 0;
        attempt < MAX_REFILL_ATTEMPTS && session.pool.length < MIN_POOL;
        attempt += 1
      ) {
        const { groupNames, memberIds } = resolveCustomScope(session.settings.scope.artistIds);
        const batch = await fetchArtistTrackBatch(request, {
            groupNames,
            memberIds,
            variant: `...`,
        });
        const poolIds = new Set(session.pool.map((t) => t.id));
        const toAdd = batch.filter(
          (t) => !poolIds.has(t.id)
        );
        session.pool = dedupeTracks([...session.pool, ...toAdd]);
        if (getFresh(session).length >= 2) break;
      }
    }

    const fresh = getFresh(session);
    let candidates = fresh;
    let usedFallback = false;

    if (candidates.length < 2) {
      candidates = session.pool;
      usedFallback = true;
    }

    if (candidates.length < 2) {
      console.error(`Not enough candidates to create round for gameId: ${gameId}`);
      return NextResponse.json({ error: "Not enough songs available to create a round" }, { status: 500 });
    }

    const shuffled = shuffle(candidates);
    const [songA, songB] = shuffled;
    session.pool = session.pool.filter(
      (t) => t.id !== songA.id && t.id !== songB.id
    );
    session.recentlyUsedIds.push(songA.id, songB.id);
    if (session.recentlyUsedIds.length > USED_WINDOW) {
      session.recentlyUsedIds.splice(0, session.recentlyUsedIds.length - USED_WINDOW);
    }
    session.roundNumber += 1;

    const round: GameRound & { source?: string } = {
      roundNumber: session.roundNumber,
      songA,
      songB,
      source: usedFallback ? "fallback" : "pool",
    };
    return NextResponse.json(round);
  } catch (error) {    
    const message = error instanceof Error ? error.message : "An unknown error occurred";

    const rateLimitMatch = message.match(/Spotify rate limited\. Please retry in (\d+) seconds\./);
    if (rateLimitMatch) {
      return NextResponse.json(
        {
          error: message,
          code: "SPOTIFY_RATE_LIMITED",
          retryAfterSeconds: Number.parseInt(rateLimitMatch[1], 10),
        },
        { status: 429 }
      );
    }

    if (message === "Spotify re-authorization required") {
      return NextResponse.json(
        {
          error: "Spotify connection expired. Please reconnect your Spotify account.",
          code: "SPOTIFY_REAUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    console.error("Error generating round:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}