import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/games/save-one-drop-one-song/sessionStore";
import { fetchTrackBatch } from "@/lib/games/save-one-drop-one-song/spotifySource";
import { dedupeTracks, shuffle } from "@/lib/games/save-one-drop-one-song/helpers";
import { GameRound, SongA, SongB } from "@/lib/games/save-one-drop-one-song/types";

const DEFAULT_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];

const MIN_POOL = 30;
const REFILL_BATCH = 50;
const MAX_REFILL_ATTEMPTS = 3;

function getFresh(session: {
  pool: (SongA | SongB)[];
  usedOptions: Set<string>;
}) {
  return session.pool.filter(
    (t) => !session.usedOptions.has(t.id)
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
    if (session.pool.length < MIN_POOL) {
      const batch = await fetchTrackBatch(request, {
        market: session.settings.market,
        seedGenres: session.settings.seedGenres,
        limit: REFILL_BATCH,
        defaultSeedGenres: DEFAULT_SEED_GENRES,
      });
    
      const poolIds = new Set(session.pool.map((t) => t.id));
      const toAdd = batch.filter(
        (t) => !poolIds.has(t.id) && !session.usedSongAIds.has(t.id) && !session.usedSongBIds.has(t.id)
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
        market: session.settings.market,
        seedGenres: session.settings.seedGenres,
        limit: REFILL_BATCH,
        defaultSeedGenres: DEFAULT_SEED_GENRES,
      });

      const poolIds = new Set(session.pool.map((t) => t.id));
      const toAdd = batch.filter(
        (t) => !poolIds.has(t.id) && !session.usedSongAIds.has(t.id) && !session.usedSongBIds.has(t.id)
      );

      session.pool = dedupeTracks([...session.pool, ...toAdd]);
      fresh = getFresh(session);
    }

    let candidates = fresh;
    let usedFallback = false;

    if (candidates.length < 2) {
      candidates = session.pool.filter(
        (t) =>
          !session.usedSongAIds.has(t.id) && !session.usedSongBIds.has(t.id)
      );
      usedFallback = true;
    }

    if (candidates.length < 2) {
      console.error(`Not enough candidates to create round for gameId: ${gameId}`);
      return NextResponse.json({ error: "Not enough songs available to create a round" }, { status: 500 });
    }

    const shuffled = shuffle(candidates);
    const [songA, songB] = shuffled;
    session.usedOptions.add(songA.id);
    session.usedOptions.add(songB.id);
    session.usedSongAIds.add(songA.id);
    session.usedSongBIds.add(songB.id);
    session.roundNumber += 1;

    const round: GameRound & { source?: string } = {
      roundNumber: session.roundNumber,
      songA,
      songB,
      source: usedFallback ? "fallback" : "pool",
    };
    return NextResponse.json(round);

  } catch (error) {    
    console.error("Error generating round:", error);
    return NextResponse.json({ error: "Failed to generate round" }, { status: 500 });
  }
}