import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession } from "@/lib/games/save-one-drop-one-song/sessionStore"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { updateUserStats } from "@/lib/collections/updateStats";

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
    const session = await getServerSession(authOptions);
    
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { searchParams } = new URL(request.url);
        const gameId = searchParams.get("gameId");
        if (!gameId) {
            return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
        }
    
        const body = (await request.json().catch(() => ({}))) as Partial<{
            score: number;
            streak: number;
        }>;
    
        const score = Number(body.score ?? 0);
        const streak = Number(body.streak ?? 0);
    
        await updateUserStats(session.user.id, { gameId: "save_one_drop_one_song", score, streak });
    
        await deleteSession(gameId);
        return NextResponse.json({ success: true });
}