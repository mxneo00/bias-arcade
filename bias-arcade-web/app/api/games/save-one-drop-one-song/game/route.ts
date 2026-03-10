import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession } from "@/lib/games/save-one-drop-one-song/sessionStore"

const DEFAULT_MARKET = "KR";
const DEFAULT_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];

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
  }>;

    const market = body.market ?? DEFAULT_MARKET;
    const seedGenres = sanitizeSeedGenres(body.seedGenres);
    const session = await createSession({market, seedGenres, optionsCount: 2});
    return NextResponse.json({ gameId: session.id, settings: session.settings });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    if (!gameId) {
        console.warn("DELETE /game/round missing gameId");
        return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
    }

    await deleteSession(gameId);
    return NextResponse.json({ success: true });
}