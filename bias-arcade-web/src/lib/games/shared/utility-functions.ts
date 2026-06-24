import { ALLOWED_SEED_GENRES, UNWANTED_TRACK_PATTERNS } from "../shared/types";

export function isUnwantedTrack(name: string): boolean {
    return UNWANTED_TRACK_PATTERNS.some((pattern) => pattern.test(name));
}

export function sanitizeSeedGenres(seedGenres: string[], fallback: string[]): string[] {
    const allowed = new Set(ALLOWED_SEED_GENRES);
    const normalized = Array.from(
        new Set(seedGenres.map((genre) => genre.trim().toLowerCase()).filter((genre) => allowed.has(genre)))
    );

    if (normalized.length > 0) {
        return normalized;
    }

    const fallbackNormalized = Array.from(
        new Set(fallback.map((genre) => genre.trim().toLowerCase()).filter((genre) => allowed.has(genre)))
    );

    return fallbackNormalized.length > 0 ? fallbackNormalized : ["k-pop", "k-rock"];
}

export async function readBodySafe(response: Response) {
    try {
        return await response.clone().text();
    } catch {
        return "";
    }
}

export function isInvalidLimitError(body: string) {
    return body.toLowerCase().includes("invalid limit");
}

export function getRetryAfterSeconds(response: Response): number {
    const raw = response.headers.get("retry-after");
    if (!raw) {
        return 60;
    }

    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
    }

    return 60;
}