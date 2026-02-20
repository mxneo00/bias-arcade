import { NextRequest } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";
import { RoundTrack } from "./types"
import { dedupeTracks } from "./helpers";

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string };
type SpotifyAlbum = { images?: SpotifyImage[] };

type SpotifyTrack = {
	id: string;
	name: string;
	uri: string;
	duration_ms: number;
	preview_url: string | null;
	external_urls?: { spotify?: string; };
	artists: SpotifyArtist[];
	album?: SpotifyAlbum;
};

type SpotifyRecommendationsResponse = { tracks?: SpotifyTrack[]; };
type SpotifySearchResponse = { tracks?: { items?: SpotifyTrack[]; }; };

function normalizeTrack(track: SpotifyTrack): RoundTrack | null {
	if (!track.id || !track.uri || !track.name || !track.artists?.length) {
		return null;
	}

	return {
		id: track.id,
		name: track.name,
		artists: track.artists.map((artist) => artist.name),
		uri: track.uri,
		durationMs: track.duration_ms,
		previewUrl: track.preview_url,
		albumImageUrl: track.album?.images?.[0]?.url ?? null,
		externalUrl: track.external_urls?.spotify ?? null,
	};
}

async function readBodySafe(response: Response) {
    try {
        return await response.text();
    } catch {
        return "";
    }
}

function isInvalidLimitError(body: string) {
    return body.toLowerCase().includes("invalid limit");
}

export async function fetchTrackBatch(
    request: NextRequest,
    args: { market: string; seedGenres: string[]; limit: number; defaultSeedGenres: string[], variant?: string }
): Promise<RoundTrack[]> {
    const { market, seedGenres, limit, defaultSeedGenres, variant } = args;

    const variantNum = (variant ?? "").split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7) || 7;

    const rotateGenres = (genres: string[]) => {
        if (genres.length === 0) return genres;
        const shift = variantNum % genres.length;
        return [...genres.slice(shift), ...genres.slice(0, shift)];
    };

    const buildSearchQuery = (genres: string[]) => {
        const base = genres.length ? genres.join(" ") : "k-pop";
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const token = letters[variantNum % letters.length];
        return `${base} ${token}`;
    };

    const doRecs = async (genres: string[], lim: number) => {
        const sp = new URLSearchParams({
            limit: String(lim),
            market,
            seed_genres: rotateGenres(genres).join(","),
        });

        return spotifyFetch(request, `/recommendations?${sp.toString()}`, {
            method: "GET",
            cache: "no-store",
        });
    };

    const doSearch = async (genres: string[], lim: number) => {
        const q = buildSearchQuery(genres);
        const sp = new URLSearchParams({
            q,
            type: "track",
            market,
            limit: String(lim),
        });

        return spotifyFetch(request, `/search?${sp.toString()}`, {
            method: "GET",
            cache: "no-store",
        });
    };

    const LIMIT_RETRY_FALLBACK = 10;

    let response = await doRecs(seedGenres, limit);
    let usedGenres = seedGenres;

    if (!response.ok && seedGenres.join(',') != defaultSeedGenres.join(',')) {
        response = await doRecs(defaultSeedGenres, limit);
        usedGenres = defaultSeedGenres;
    }

    if (!response.ok) {
        const body = await readBodySafe(response);
        if (response.status === 400 && isInvalidLimitError(body)) {
            response = await doRecs(usedGenres, LIMIT_RETRY_FALLBACK);
        }
    }

    if (response.ok) {
        const payload = (await response.json()) as SpotifyRecommendationsResponse;
        const tracks = (payload.tracks ?? []).map(normalizeTrack).filter(Boolean) as RoundTrack[];
        return dedupeTracks(tracks);
    }

    // Fallback to search if recommendations fail
    let searchRes = await doSearch(usedGenres, limit);
    if (!searchRes.ok) {
        const body = await readBodySafe(searchRes);
        if (searchRes.status === 400 && isInvalidLimitError(body)) {
        searchRes = await doSearch(usedGenres, LIMIT_RETRY_FALLBACK);
        }
    }

    if (!searchRes.ok) {
        const recBody = await readBodySafe(response);
        const searchBody = await readBodySafe(searchRes);
        throw new Error(`Failed to fetch tracks. Recommendations response: ${recBody}, Search response: ${searchBody}`);
    }

    const searchPayload = (await searchRes.json()) as SpotifySearchResponse;
    const tracks = (searchPayload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as RoundTrack[];
    return dedupeTracks(tracks);
}