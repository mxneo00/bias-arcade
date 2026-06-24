import { NextRequest } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";
import { RoundTrack } from "./types"
import { dedupeTracks } from "./helpers";
import { SpotifyTrack,
    SpotifySearchResponse,
    SpotifyArtistNameResponse,
    SpotifyArtistsResponse,
    ALLOWED_SEED_GENRES
} from "../shared/types";
import { isUnwantedTrack, sanitizeSeedGenres, readBodySafe, isInvalidLimitError, getRetryAfterSeconds } from "../shared/utility-functions";

type CandidateTrack = RoundTrack & { artistIds: string[] };

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
		albumName: track.album?.name ?? null,
		externalUrl: track.external_urls?.spotify ?? null,
	};
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
            albumName: track.albumName,
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

    const doSearch = async (genres: string[], lim: number, offset: number) => {
        const q = buildSearchQuery(genres);
        const sp = new URLSearchParams({
            q,
            type: "track",
            market,
            limit: String(lim),
            offset: String(offset),
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
    const offset = variantNum % 800;

    let usedGenres = seedGenres;
    let searchTracks: CandidateTrack[] = [];

    let searchRes = await doSearch(seedGenres, limit, offset);
    if (!searchRes.ok && seedGenres.join(',') !== defaultSeedGenres.join(',')) {
        searchRes = await doSearch(defaultSeedGenres, limit, offset);
        usedGenres = defaultSeedGenres;
    }

    if (!searchRes.ok) {
        const body = await readBodySafe(searchRes);
        if (searchRes.status === 400 && isInvalidLimitError(body)) {
            searchRes = await doSearch(usedGenres, LIMIT_RETRY_FALLBACK, offset);
        } else if (searchRes.status === 429) {
            const retryAfterSeconds = getRetryAfterSeconds(searchRes);
            throw new Error(`Spotify rate limited. Please retry in ${retryAfterSeconds} seconds.`);
        }
    }

    if (searchRes.ok) {
        const payload = (await searchRes.json()) as SpotifySearchResponse;
        searchTracks = (payload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
    }

    if (offset > 0 && searchTracks.length === 0) {
        const retryRes = await doSearch(usedGenres, limit, 0);
        if (retryRes.ok) {
            const payload = (await retryRes.json()) as SpotifySearchResponse;
            searchTracks = (payload.tracks?.items ?? []).map(normalizeTrack).filter(Boolean) as CandidateTrack[];
        }
    }

    if (searchTracks.length === 0) {
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

    if (searchTracks.length === 0) {
        const searchBody = await readBodySafe(searchRes);
        throw new Error(`Failed to fetch tracks from Spotify. Search response: ${searchBody}`);
    }

    const prioritizedTracks = await prioritizeKoreanGenreTracks(request, searchTracks);
    return dedupeTracks(prioritizedTracks);
}

export async function fetchArtistTrackBatch(
    request: NextRequest,
    args: {
        groupNames: string[];
        memberIds: string[];
        variant?: string;
    }
): Promise<RoundTrack[]> {  
    const { groupNames, memberIds, variant } = args;

    const variantNum = (variant ?? "").split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7) || 7;

    const memberNameMap = new Map<string, string>();
    if (memberIds.length > 0) {
        const CHUNK_SIZE = 50;
        for (let i = 0; i < memberIds.length; i += CHUNK_SIZE) {
            const chunk = memberIds.slice(i, i + CHUNK_SIZE);
            const res = await spotifyFetch(request, `/artists?ids=${chunk.join(",")}`, {
                method: "GET",
                cache: "no-store",
            });
            if (res.ok) {
                const payload = (await res.json()) as SpotifyArtistNameResponse;
                for (const artist of payload.artists ?? []) {
                    if (artist?.id && artist.name) {
                        memberNameMap.set(artist.id, artist.name);
                    }
                }
            } else {
                const body = await res.clone().text();
                console.warn(`[fetchArtistTrackBatch] Artist name lookup failed: ${res.status} ${body}`);
            }
        }
    }

    const allNames = [
        ...groupNames,
        ...memberIds.map(id => memberNameMap.get(id)).filter((n): n is string => Boolean(n)),
    ];

    if (allNames.length === 0) return [];

    const results = await Promise.all(
        allNames.map(async (name) => {
            const offset = variantNum % 800;
            const sp = new URLSearchParams({
                q: `artist:"${name}"`,
                type: "track",
                market: "KR",
                limit: "10",
                offset: String(offset),
            });
            const response = await spotifyFetch(request, `/search?${sp.toString()}`, {
                method: "GET",
                cache: "no-store",
            });
            if (!response.ok) {
                const body = await response.clone().text();
                console.warn(`[fetchArtistTrackBatch] Search failed for "${name}": ${response.status} ${body}`);
                return [] as CandidateTrack[];
            }
            let payload = (await response.json()) as SpotifySearchResponse;
            const nameLower = name.toLowerCase();

            // If offset overshot the catalog, retry from 0
            if (offset > 0 && (payload.tracks?.items ?? []).filter(t => t.artists.some(a => a.name.toLowerCase() === nameLower)).length === 0) {
                const sp0 = new URLSearchParams({
                    q: `artist:"${name}"`,
                    type: "track",
                    market: "KR",
                    limit: "10",
                    offset: "0",
                });
                const fallback = await spotifyFetch(request, `/search?${sp0.toString()}`, { method: "GET", cache: "no-store" });
                if (fallback.ok) payload = (await fallback.json()) as SpotifySearchResponse;
            }

            return (payload.tracks?.items ?? [])
                .filter((t) => t.artists.some((a) => a.name.toLowerCase() === nameLower))
                .filter((t) => !isUnwantedTrack(t.name))
                .map(normalizeTrack)
                .filter(Boolean) as CandidateTrack[];
        })
    );

    return dedupeTracks(results.flat());
}