import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/games/guess-the-song/sessionStore";
import { fetchTrackBatch } from "@/lib/games/guess-the-song/spotifySource";
import { dedupeTracks, shuffle } from "@/lib/games/guess-the-song/helpers";
import { RoundPayload, RoundTrack } from "@/lib/games/guess-the-song/types";

const DEFAULT_SEED_GENRES = ["k-pop"];

const MIN_POOL = 30;
const REFILL_BATCH = 50;
const MAX_REFILL_ATTEMPTS = 3;

function getFresh(session: {
  pool: RoundTrack[];
  usedOptions: Set<string>;
  usedAnswers: Set<string>;
}) {
  return session.pool.filter(
    (t) => !session.usedOptions.has(t.id) && !session.usedAnswers.has(t.id)
  );
}

function getNotAnswerUsed(session: {
  pool: RoundTrack[];
  usedOptions: Set<string>;
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
    if (session.pool.length < MIN_POOL) {
      const batch = await fetchTrackBatch(request, {
        market: session.settings.market,
        seedGenres: session.settings.seedGenres,
        limit: REFILL_BATCH,
        defaultSeedGenres: DEFAULT_SEED_GENRES,
        variant: session.variant
      });

      const poolIds = new Set(session.pool.map((t) => t.id));
      const toAdd = batch.filter(
        (t) => !poolIds.has(t.id) && !session.usedAnswers.has(t.id)
      );

      session.pool = dedupeTracks([...session.pool, ...toAdd]);
    }

    const optionsCount = session.settings.optionsCount;

    let fresh = getFresh(session);

    for (
      let attempt = 0;
      attempt < MAX_REFILL_ATTEMPTS && fresh.length < optionsCount;
      attempt += 1
    ) {
      const batch = await fetchTrackBatch(request, {
        market: session.settings.market,
        seedGenres: session.settings.seedGenres,
        limit: REFILL_BATCH,
        defaultSeedGenres: DEFAULT_SEED_GENRES,
        variant: session.variant
      });

      const poolIds = new Set(session.pool.map((t) => t.id));
      const toAdd = batch.filter(
        (t) => !poolIds.has(t.id) && !session.usedAnswers.has(t.id)
      );

      session.pool = dedupeTracks([...session.pool, ...toAdd]);
      fresh = getFresh(session);
    }

    let candidates = fresh;
    let usedFallback = false;

    if (candidates.length < optionsCount) {
      candidates = getNotAnswerUsed(session);
      usedFallback = true;
    }

    if (candidates.length < optionsCount) {
      return NextResponse.json(
        { error: "Not enough tracks to generate a round" },
        { status: 503 }
      );
    }

    const shuffled = shuffle(candidates);
    const answer = shuffled[0];
    const distractors = shuffled.slice(1, optionsCount);

    session.roundNumber += 1;
    session.usedAnswers.add(answer.id);
    [answer, ...distractors].forEach((t) => session.usedOptions.add(t.id));

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

    if (message === "Spotify re-authorization required") {
      return NextResponse.json(
        {
          error: "Spotify connection expired. Please reconnect your Spotify account.",
          code: "SPOTIFY_REAUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}