import { NextRequest } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";
import { SongA, SongB } from "./types";
import { dedupeTracks } from "./helpers";

type SpotifyArtist = { id?: string; name: string };
type SpotifyImage = { url: string };
type SpotifyAlbum = { images?: SpotifyImage[] };
type SpotifyArtistDetails = { id: string; genres?: string[] };

type SpotifyTrack = {
    id: string;
    name: string;
    uri: string;
    duration_ms: number;
    external_urls?: { spotify?: string; };
    artists: SpotifyArtist[];
    artistIds: string[];
    album?: SpotifyAlbum;
};

type SpotifyRecommendationsResponse = { tracks?: SpotifyTrack[]; };
type SpotifySearchResponse = { tracks?: { items?: SpotifyTrack[]; }; };
type SpotifyArtistsResponse = { artists?: SpotifyArtistDetails[]; };

type CandidateTrack = (SongA | SongB) & { artistIds: string[] };

const ALLOWED_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];
const KOREAN_GENRE_MARKERS = ["k-pop", "kpop", "korean pop", "k-rock", "krock", "korean rock"];

function sanitizeSeedGenres(seedGenres: string[], fallback: string[]): string[] {
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

function hasKoreanGenre(genres: string[]): boolean {
    return genres.some((genre) => {
        const normalized = genre.trim().toLowerCase();
        return KOREAN_GENRE_MARKERS.some((marker) => normalized.includes(marker));
    });
}

function normalizeTrack(track: SpotifyTrack): CandidateTrack | null {
    if (!track.id || !track.uri || !track.name || !track.artists?.length) {
        return null;
    }
    
    const artistIds = track.artists.map((artist) => artist.id).filter((id): id is string => Boolean(id));

	return {
		id: track.id,
		name: track.name,
		artists: track.artists.map((artist) => artist.name),
        artistIds,
		uri: track.uri,
		duration_ms: track.duration_ms,
        albumImageUrl: track.album?.images?.[0]?.url || null,
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

async function fetchArtistGenresMap(request: NextRequest, artistIds: string[]): Promise<Map<string, string[]>> {
    const map = new Map<string, string[]>();
    if (artistIds.length === 0) {
        return map;
    }

    const uniqueIds = Array.from(new Set(artistIds));
    const CHUNK_SIZE = 50;

    for (let index = 0; index < uniqueIds.length; index += CHUNK_SIZE) {
        const chunk = uniqueIds.slice(index, index + CHUNK_SIZE);
        const response = await spotifyFetch(request, `/artists?ids=${chunk.join(",")}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            continue;
        }

        const payload = (await response.json()) as SpotifyArtistsResponse;
        for (const artist of payload.artists ?? []) {
            if (!artist?.id) {
                continue;
            }

            map.set(artist.id, artist.genres ?? []);
        }
    }

    return map;
}

async function prioritizeKoreanTracks(
    request: NextRequest, 
    tracks: CandidateTrack[],
    requestedLimit: number
): Promise<CandidateTrack[]> {
    if (tracks.length === 0) {
        return [];
    }

    const artistGenresMap = await fetchArtistGenresMap(
        request,
        tracks.flatMap((track) => track.artistIds)
    );

    const matched: CandidateTrack[] = [];
    const unmatched: CandidateTrack[] = [];

    for (const track of tracks) {
        const candidateTrack: CandidateTrack = {
            id: track.id,
            name: track.name,
            artists: track.artists,
            artistIds: track.artistIds,
            uri: track.uri,
            duration_ms: track.duration_ms,
            albumImageUrl: track.albumImageUrl,
        };

        if (track.artistIds.length === 0) {
            unmatched.push(candidateTrack);
            continue;
        }

        const isMatch = track.artistIds.some((artistId) => {
            const genres = artistGenresMap.get(artistId);
            return genres ? hasKoreanGenre(genres) : false;
        });

        if (isMatch) {
            matched.push(candidateTrack);
        } else {
            unmatched.push(candidateTrack);
        }
    }

    const minimumTarget = Math.max(4, Math.ceil(requestedLimit * 0.5));
    if (matched.length >= minimumTarget) {
        return matched;
    }
    return [...matched, ...unmatched];
}

export async function fetchTrackBatch(
    request: NextRequest,
    args: { market: string; seedGenres: string[]; defaultSeedGenres: string[]; variant?: string, limit: number }
): Promise<CandidateTrack[]> {
    const { market, limit, variant } = args;
        const seedGenres = sanitizeSeedGenres(args.seedGenres, args.defaultSeedGenres);
        const defaultSeedGenres = sanitizeSeedGenres(args.defaultSeedGenres, ["k-pop", "k-rock"]);
    
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
            const tracks = (payload.tracks ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
            const prioritizedTracks = await prioritizeKoreanTracks(request, tracks, limit);
            return dedupeTracks(prioritizedTracks);
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
        const tracks = (searchPayload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
        const prioritizedTracks = await prioritizeKoreanTracks(request, tracks, limit);
        return dedupeTracks(prioritizedTracks);
}
