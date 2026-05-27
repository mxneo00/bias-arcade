import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession } from "@/lib/games/save-one-drop-one-song/sessionStore"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { updateUserStats } from "@/lib/collections/updateStats";
import { fetchArtistDiscography } from "@/lib/games/save-one-drop-one-song/spotifySource";
import { computeRoundCap } from "@/lib/games/shared/round-cap";
import { ArtistScope } from "@/lib/games/shared/scope";

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

function sanitizeScope(raw: unknown): ArtistScope {
    if (!raw || typeof raw !== "object") return { type: "all-kpop" };
    const obj = raw as Record<string, unknown>;

    if (obj.type === "artist" || obj.type === "group") {
        const artistId = typeof obj.artistId === "string" ? obj.artistId : null;
        const label = typeof obj.label === "string" ? obj.label : null;

        if (artistId && label) {
            return { type: obj.type, artistId, label };
        }
    }
    if (obj.type === "group+solo") {
        const artistId = typeof obj.artistId === "string" ? obj.artistId : null;
        const label = typeof obj.label === "string" ? obj.label : null;
        const memberArtistIds = Array.isArray(obj.memberArtistIds)
            ? obj.memberArtistIds.filter((id): id is string => typeof id === "string")
            : null;

        if (artistId && label && memberArtistIds) {
            return { type: "group+solo", artistId, label, memberArtistIds };
        }
    }
    if (obj.type === "custom") {
        const artistIds = Array.isArray(obj.artistIds)
            ? obj.artistIds.filter((id): id is string => typeof id === "string" && id.length > 0)
            : null;
        const label = typeof obj.label === "string" ? obj.label : null;
        if (artistIds && artistIds.length > 0 && label) {
            return { type: "custom", artistIds, label };
        }
    }
    return { type: "all-kpop" };
}

export async function POST(request: NextRequest) {
    const body = (await request.json().catch(() => ({}))) as Partial<{
        market: string;
        seedGenres: string[];
        scope: unknown;
    }>;

    const market = (body.market ?? DEFAULT_MARKET).toUpperCase();
    const seedGenres = sanitizeSeedGenres(body.seedGenres);
    const scope = sanitizeScope(body.scope);

    const session = createSession({ market, seedGenres, optionsCount: 2, scope, roundCap: 0 });

    if (scope.type !== "all-kpop") {
        try {
            const artistIds = scope.type === "group+solo"
                ? [scope.artistId, ...scope.memberArtistIds]
                : [scope.artistId];

            const tracks = await fetchArtistDiscography(request, artistIds, market);
            const roundCap = computeRoundCap(tracks.length, 2);

            session.pool = tracks;
            session.maxRounds = roundCap;
            session.settings.roundCap = roundCap;
        } catch (error) {
            deleteSession(session.id);
            const message = error instanceof Error ? error.message : "Failed to fetch artist discography";
            const rateLimitMatch = message.match(/Spotify rate limited\. Please retry in (\d+) seconds\./);
            if (rateLimitMatch) {
                return NextResponse.json(
                    { error: message, code: "SPOTIFY_RATE_LIMITED", retryAfterSeconds: Number.parseInt(rateLimitMatch[1], 10) },
                    { status: 429 }
                );
            }
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    return NextResponse.json({ gameId: session.id, settings: session.settings, roundCap: session.maxRounds });
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