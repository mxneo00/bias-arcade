import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession } from "@/lib/games/guess-the-song/sessionStore"

const DEFAULT_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];
const DEFAULT_MARKET = "KR";

function sanitizeSeedGenres(seedGenres: string[] | undefined): string[] {
    const allowed = new Set(DEFAULT_SEED_GENRES);

    const normalized = Array.from(
        new Set(
            (seedGenres ?? [])
                .map((genre) => genre.trim().toLowerCase())
                .filter((genre) => allowed.has(genre))
        )
    );

    return normalized.length > 0 ? normalized : DEFAULT_SEED_GENRES;
}

export async function POST(request: NextRequest) {
    const body = (await request.json().catch(() => ({}))) as Partial<{
        market: string;
        seedGenres: string[];
        optionsCount: number;
  }>;

  const market = (body.market ?? DEFAULT_MARKET).toUpperCase();
    const seedGenres = sanitizeSeedGenres(body.seedGenres);
  const optionsCount = Math.min(Math.max(body.optionsCount ?? 4, 2), 10);

  const session = await createSession({market, seedGenres, optionsCount});
  return NextResponse.json({ gameId: session.id, settings: session.settings });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    if (!gameId) {
        return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
    }

    await deleteSession(gameId);
    return NextResponse.json({ success: true });
}