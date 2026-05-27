import { NextRequest } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";
import { RoundTrack } from "./types"
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
	preview_url: string | null;
	external_urls?: { spotify?: string; };
	artists: SpotifyArtist[];
	album?: SpotifyAlbum;
};

type SpotifyRecommendationsResponse = { tracks?: SpotifyTrack[]; };
type SpotifySearchResponse = { tracks?: { items?: SpotifyTrack[]; }; };
type SpotifyArtistsResponse = { artists?: SpotifyArtistDetails[]; };

type CandidateTrack = RoundTrack & { artistIds: string[] };

type SpotifySimplifiedAlbum = { id: string; images: SpotifyImage[]; };
type SpotifyArtistAlbumsResponse = { items: SpotifySimplifiedAlbum[]; next: string | null; };
type SpotifyAlbumTracksResponse = { items: SpotifyTrack[]; next: string | null; };

const ALLOWED_SEED_GENRES = [
    "k-pop", "k-rock", "korean-pop", "korean-rock", 
    "kpop", "kpop", "korean pop", "korean rock",
    "kpop boy group", "kpop girl group", "korean idol", "korean band",
];

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
		durationMs: track.duration_ms,
		previewUrl: track.preview_url,
		albumImageUrl: track.album?.images?.[0]?.url ?? null,
		externalUrl: track.external_urls?.spotify ?? null,
	};
}

async function readBodySafe(response: Response) {
    try {
        return await response.clone().text();
    } catch {
        return "";
    }
}

function isInvalidLimitError(body: string) {
    return body.toLowerCase().includes("invalid limit");
}

function getRetryAfterSeconds(response: Response): number {
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

async function prioritizeKoreanGenreTracks(
    request: NextRequest,
    tracks: CandidateTrack[],
): Promise<RoundTrack[]> {
    if (tracks.length === 0) {
        return [];
    }

    const artistGenresMap = await fetchArtistGenresMap(
        request,
        tracks.flatMap((track) => track.artistIds)
    );

    const matched: RoundTrack[] = [];
    const unmatched: RoundTrack[] = [];

    for (const track of tracks) {
        const roundTrack: RoundTrack = {
            id: track.id,
            name: track.name,
            artists: track.artists,
            uri: track.uri,
            durationMs: track.durationMs,
            previewUrl: track.previewUrl,
            albumImageUrl: track.albumImageUrl,
            externalUrl: track.externalUrl,
        };

        if (track.artistIds.length === 0) {
            unmatched.push(roundTrack);
            continue;
        }

        const isMatch = track.artistIds.some((artistId) => {
            const genres = artistGenresMap.get(artistId) ?? [];
            return genres.some((genre) => ALLOWED_SEED_GENRES.includes(genre.trim().toLowerCase()));
        });

        if (isMatch) {
            matched.push(roundTrack);
        } else {
            unmatched.push(roundTrack);
        }
    }

    return [...matched, ...unmatched];
}

export async function fetchTrackBatch(
    request: NextRequest,
    args: { 
        market: string; 
        seedGenres: string[]; 
        defaultSeedGenres: string[]; 
        variant?: string, 
        limit: number}
): Promise<RoundTrack[]> {
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
        const tokens = [
            "kpop",
            "korean",
            "idol",
            "comeback",
            "boy group",
            "girl group",
            "new release",
        ];
        const tokenA = tokens[variantNum % tokens.length];
        const tokenB = tokens[(variantNum * 7) % tokens.length];
        return `${base} ${tokenA} ${tokenB}`;
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
        const offset = String(variantNum % 800);
        const sp = new URLSearchParams({
            q,
            type: "track",
            market,
            limit: String(lim),
            offset,
        });

        return spotifyFetch(request, `/search?${sp.toString()}`, {
            method: "GET",
            cache: "no-store",
        });
    };

    const doBroadSearch = async (lim: number) => {
        const sp = new URLSearchParams({
            q: "kpop korean idol",
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

    let usedGenres = seedGenres;
    let recommendations: CandidateTrack[] = [];
    let searchTracks: CandidateTrack[] = [];

    let response = await doRecs(seedGenres, limit);
    if (!response.ok && seedGenres.join(',') != defaultSeedGenres.join(',')) {
        response = await doRecs(defaultSeedGenres, limit);
        usedGenres = defaultSeedGenres;
    }

    if (!response.ok) {
        const body = await readBodySafe(response);
        if (response.status === 400 && isInvalidLimitError(body)) {
            response = await doRecs(usedGenres, LIMIT_RETRY_FALLBACK);
        } else if (response.status === 429) {
            const retryAfterSeconds = getRetryAfterSeconds(response);
            throw new Error(`Spotify rate limited. Please retry in ${retryAfterSeconds} seconds.`);
        }
    }

    if (response.ok) {
        const payload = (await response.json()) as SpotifyRecommendationsResponse;
        recommendations = (payload.tracks ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
        const prioritizedTracks = await prioritizeKoreanGenreTracks(request, recommendations);
        return dedupeTracks(prioritizedTracks);
    }

    // Fallback to search if recommendations fail
    let searchRes = await doSearch(usedGenres, limit);
    if (!searchRes.ok) {
        const body = await readBodySafe(searchRes);
        if (searchRes.status === 400 && isInvalidLimitError(body)) {
            searchRes = await doSearch(usedGenres, LIMIT_RETRY_FALLBACK);
        } else if (searchRes.status === 429) {
            const retryAfterSeconds = getRetryAfterSeconds(searchRes);
            throw new Error(`Spotify rate limited. Please retry in ${retryAfterSeconds} seconds.`);
        }
    }
    
    if (searchRes.ok) {
        const payload = (await searchRes.json()) as SpotifySearchResponse;
        searchTracks = (payload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
    }

    if (searchTracks.length === 0) {
        // As a last resort, do a broad search without genre seeds
        let broadSearchRes = await doBroadSearch(limit);
        if (!broadSearchRes.ok) {
            const body = await readBodySafe(broadSearchRes);
            if (broadSearchRes.status === 400 && isInvalidLimitError(body)) {
                broadSearchRes = await doBroadSearch(LIMIT_RETRY_FALLBACK);
            } else if (broadSearchRes.status === 429) {
                const retryAfterSeconds = getRetryAfterSeconds(broadSearchRes);
                throw new Error(`Spotify rate limited. Please retry in ${retryAfterSeconds} seconds.`);
            }
        }

        if (broadSearchRes.ok) {
            const payload = (await broadSearchRes.json()) as SpotifySearchResponse;
            searchTracks = (payload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
        }
    }

    const combined = [...recommendations, ...searchTracks];
    if (combined.length === 0) {
        const recBody = await readBodySafe(response);
        const searchBody = await readBodySafe(searchRes);
        const broadSearchBody = searchTracks.length === 0 ? await readBodySafe(await doBroadSearch(limit)) : "";
        throw new Error(`Failed to fetch tracks from Spotify. Recs response: ${recBody}, Search response: ${searchBody}, Broad search response: ${broadSearchBody}`);
    }
    const prioritizedTracks = await prioritizeKoreanGenreTracks(request, combined);
    return dedupeTracks(prioritizedTracks);
}

export async function fetchArtistTrackBatch(
    request: NextRequest,
    args: {
        groupLabels: string[];
        memberIds: string[];
        market: string;
        variant?: string;
    }
): Promise<RoundTrack[]> {
    const { groupLabels, memberIds, market, variant } = args;
    const variantNum = (variant ?? "").split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7) || 7;
    const searchOffset = (variantNum % 10) * 50; 

    const [groupResults, memberResults] = await Promise.all([
        Promise.all(
            groupLabels.map(async (label) => {
                const sp = new URLSearchParams({
                    q: `artist:${label}`,
                    type: "track",
                    market,
                    limit: "50",
                    offset: String(searchOffset),
                });
                const response = await spotifyFetch(request, `/search?${sp.toString()}`, {
                    method: "GET",
                    cache: "no-store",
                });
                if (!response.ok) {
                    console.warn(`[fetchArtistTrackBatch] Search failed for "${label}": ${response.status}`);
                    return [] as CandidateTrack[];
                }
                const payload = (await response.json()) as SpotifySearchResponse;
                return (payload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
            })
        ),
        Promise.all(
            memberIds.map(async (artistId) => {
                const response = await spotifyFetch(
                    request,
                    `/artists/${artistId}/top-tracks?market=${encodeURIComponent(market)}`,
                    { method: "GET", cache: "no-store" }
                );
                if (!response.ok) {
                    console.warn(`[fetchArtistTrackBatch] Top-tracks failed for ${artistId}: ${response.status}`);
                    return [] as CandidateTrack[];
                }
                const payload = (await response.json()) as { tracks: SpotifyTrack[] };
                return (payload.tracks ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
            })
        ),
    ]);

    return dedupeTracks([...groupResults.flat(), ...memberResults.flat()]);
}