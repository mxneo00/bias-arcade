import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/games/guess-the-song/sessionStore";
import { fetchTrackBatch } from "@/lib/games/guess-the-song/spotifySource";
import { dedupeTracks, shuffle } from "@/lib/games/guess-the-song/helpers";
import { RoundPayload, RoundTrack } from "@/lib/games/guess-the-song/types";
import { fetchArtistTrackBatch } from "@/lib/games/guess-the-song/spotifySource";
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
  pool: RoundTrack[];
  recentlyUsedIds: string[];
  usedAnswers: Set<string>;
}) {
  const recent = new Set(session.recentlyUsedIds);
  return session.pool.filter(
    (t) => !recent.has(t.id) && !session.usedAnswers.has(t.id)
  );
}

function getNotAnswerUsed(session: {
  pool: RoundTrack[];
  recentlyUsedIds: string[];
  usedAnswers: Set<string>;
}) {
  return session.pool.filter((t) => !session.usedAnswers.has(t.id));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<{ gameId: string }>;
  const gameId = body.gameId?.trim();

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  const session = getSession(gameId);
  if (!session) {
    return NextResponse.json({ error: "Game session not found or expired" }, { status: 404 });
  }

  try {
    if (session.maxRounds > 0 && session.roundNumber >= session.maxRounds) {
      return NextResponse.json({ error: "Maximum rounds reached" }, { status: 400 });
    }
    const optionsCount = session.settings.optionsCount;
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
          (t) => !poolIds.has(t.id) && !session.usedAnswers.has(t.id)
        );

        session.pool = dedupeTracks([...session.pool, ...toAdd]);
        if (getFresh(session).length >= optionsCount) break;
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
            variant: `${session.variant}:${session.roundNumber}:prefill:${attempt}`,
        });
        const poolIds = new Set(session.pool.map((t) => t.id));
        const toAdd = batch.filter(
          (t) => !poolIds.has(t.id) && !session.usedAnswers.has(t.id)
        );
        session.pool = dedupeTracks([...session.pool, ...toAdd]);
        if (getFresh(session).length >= optionsCount) break;
      }
    }
    
    let fresh = getFresh(session);
    let usedFallback = false;

    if (fresh.length < optionsCount) {
      fresh = getNotAnswerUsed(session);
      usedFallback = true;
    }

    if (fresh.length < optionsCount) {
      return NextResponse.json(
        { error: "Not enough tracks to generate a round" },
        { status: 503 }
      );
    }

    const shuffled = shuffle(fresh);
    const answer = shuffled[0];
    const distractors = shuffled.slice(1, optionsCount);

    session.roundNumber += 1;
    session.usedAnswers.add(answer.id);
    
    session.recentlyUsedIds.push(answer.id, ...distractors.map((t) => t.id));
    if (session.recentlyUsedIds.length > USED_WINDOW) {
      session.recentlyUsedIds.splice(0, session.recentlyUsedIds.length - USED_WINDOW);
    }

    session.pool = session.pool.filter((t) => t.id !== answer.id);

    const payload: RoundPayload & { source?: string } = {
      roundNumber: session.roundNumber,
      answer,
      options: shuffle([answer, ...distractors]),
      source: usedFallback ? "fallback" : "fresh",
    };

    return NextResponse.json(payload);
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