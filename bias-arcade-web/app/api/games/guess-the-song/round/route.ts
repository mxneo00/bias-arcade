import { NextRequest, NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";

const DEFAULT_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];
const DEFAULT_MARKET = "KR";
const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;
// How long fetched track pools stay cached before being refreshed.
const ROUND_CACHE_TTL_MS = 5 * 60 * 1000;
const ROUND_FETCH_POOL_LIMIT_MIN = 12;
const ROUND_FETCH_POOL_LIMIT_MAX = 40;
// Fallback limit used when Spotify rejects the larger pool size.
const SPOTIFY_LIMIT_RETRY_FALLBACK = 10;

type SpotifyArtist = {
	name: string;
};

type SpotifyImage = {
	url: string;
};

type SpotifyAlbum = {
	images?: SpotifyImage[];
};

type SpotifyTrack = {
	id: string;
	name: string;
	uri: string;
	duration_ms: number;
	preview_url: string | null;
	external_urls?: {
		spotify?: string;
	};
	artists: SpotifyArtist[];
	album?: SpotifyAlbum;
};

type SpotifyRecommendationsResponse = {
	tracks?: SpotifyTrack[];
};

type SpotifySearchResponse = {
	tracks?: {
		items?: SpotifyTrack[];
	};
};

type RoundTrack = {
	id: string;
	name: string;
	artists: string[];
	uri: string;
	durationMs: number;
	previewUrl: string | null;
	albumImageUrl: string | null;
	externalUrl: string | null;
};

type RoundTrackCacheEntry = {
	tracks: RoundTrack[];
	updatedAt: number;
};

// In-memory cache of track pools keyed by market + seed genres.
// Avoids hitting the Spotify API on every round request.
const roundTrackCache = new Map<string, RoundTrackCacheEntry>();

function parseLimit(rawLimit: string | null): number {
	const parsed = Number.parseInt(rawLimit ?? "", 10);

	if (Number.isNaN(parsed)) {
		return DEFAULT_LIMIT;
	}

	return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function parseMarket(rawMarket: string | null): string {
	if (!rawMarket) {
		return DEFAULT_MARKET;
	}

	const market = rawMarket.trim().toUpperCase();
	return market.length === 2 ? market : DEFAULT_MARKET;
}

function parseSeedGenres(rawSeedGenres: string | null): string[] {
	if (!rawSeedGenres) {
		return DEFAULT_SEED_GENRES;
	}

	const genres = rawSeedGenres
		.split(",")
		.map((genre) => genre.trim().toLowerCase())
		.filter(Boolean)
		.slice(0, 5);

	return genres.length > 0 ? genres : DEFAULT_SEED_GENRES;
}

// Strip incomplete tracks so every round entry has the required fields.
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

function createCacheKey(market: string, seedGenres: string[]): string {
	return `${market}:${seedGenres.join(",")}`;
}

function dedupeTracks(tracks: RoundTrack[]): RoundTrack[] {
	return Array.from(new Map(tracks.map((track) => [track.id, track])).values());
}

function shuffleTracks(tracks: RoundTrack[]): RoundTrack[] {
	const values = [...tracks];

	for (let index = values.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[values[index], values[swapIndex]] = [values[swapIndex], values[index]];
	}

	return values;
}

function getRoundTracksFromCache(cacheKey: string, limit: number): RoundTrack[] | null {
	const cached = roundTrackCache.get(cacheKey);

	if (!cached) {
		return null;
	}

	if (Date.now() - cached.updatedAt > ROUND_CACHE_TTL_MS) {
		roundTrackCache.delete(cacheKey);
		return null;
	}

	if (cached.tracks.length === 0) {
		return null;
	}

	return shuffleTracks(cached.tracks).slice(0, limit);
}

function setRoundTrackCache(cacheKey: string, tracks: RoundTrack[]) {
	roundTrackCache.set(cacheKey, {
		tracks: dedupeTracks(tracks),
		updatedAt: Date.now(),
	});
}

async function fetchRecommendations(
	request: NextRequest,
	market: string,
	limit: number,
	seedGenres: string[]
): Promise<Response> {
	const searchParams = new URLSearchParams({
		limit: String(limit),
		market,
		seed_genres: seedGenres.join(","),
	});

	return spotifyFetch(request, `/recommendations?${searchParams.toString()}`, {
		method: "GET",
		cache: "no-store",
	});
}

async function fetchSearchFallback(
	request: NextRequest,
	market: string,
	limit: number,
	seedGenres: string[]
): Promise<Response> {
	const query = seedGenres.length > 0 ? seedGenres.join(" ") : "k-pop";
	const searchParams = new URLSearchParams({
		q: query,
		type: "track",
		market,
		limit: String(limit),
	});

	return spotifyFetch(request, `/search?${searchParams.toString()}`, {
		method: "GET",
		cache: "no-store",
	});
}

async function readResponseBody(response: Response): Promise<string> {
	try {
		return await response.text();
	} catch {
		return "";
	}
}

function isInvalidLimitError(errorBody: string): boolean {
	return errorBody.toLowerCase().includes("invalid limit");
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const limit = parseLimit(searchParams.get("limit"));
	const market = parseMarket(searchParams.get("market"));
	const requestedSeedGenres = parseSeedGenres(searchParams.get("seedGenres"));
	const cacheKey = createCacheKey(market, requestedSeedGenres);
	const cachedTracks = getRoundTracksFromCache(cacheKey, limit);

	// Serve from cache when possible to avoid unnecessary Spotify API calls.
	if (cachedTracks) {
		return NextResponse.json({
			tracks: cachedTracks,
			market,
			seedGenres: requestedSeedGenres,
			source: "cache",
		});
	}

	try {
		// Fetch a larger pool of tracks so we can shuffle and dedupe before returning the round subset.
		const fetchPoolLimit = Math.min(
			Math.max(limit * 5, ROUND_FETCH_POOL_LIMIT_MIN),
			ROUND_FETCH_POOL_LIMIT_MAX
		);

		let spotifyResponse = await fetchRecommendations(request, market, fetchPoolLimit, requestedSeedGenres);
		let usedSeedGenres = requestedSeedGenres;

		// If the requested genres fail, retry with the default genres before giving up.
		if (!spotifyResponse.ok && requestedSeedGenres.join(",") !== DEFAULT_SEED_GENRES.join(",")) {
			spotifyResponse = await fetchRecommendations(request, market, fetchPoolLimit, DEFAULT_SEED_GENRES);
			usedSeedGenres = DEFAULT_SEED_GENRES;
		}

		let tracks: RoundTrack[] = [];

		if (!spotifyResponse.ok) {
			const recommendationErrorBody = await readResponseBody(spotifyResponse);

			if (spotifyResponse.status === 400 && isInvalidLimitError(recommendationErrorBody)) {
				spotifyResponse = await fetchRecommendations(request, market, SPOTIFY_LIMIT_RETRY_FALLBACK, usedSeedGenres);
			}
		}

		if (spotifyResponse.ok) {
			const payload = (await spotifyResponse.json()) as SpotifyRecommendationsResponse;
			tracks = (payload.tracks ?? [])
				.map(normalizeTrack)
				.filter((track): track is RoundTrack => track !== null);
		} else {
			const searchResponse = await fetchSearchFallback(request, market, fetchPoolLimit, usedSeedGenres);
			let resolvedSearchResponse = searchResponse;

			if (!searchResponse.ok) {
				const searchErrorBody = await readResponseBody(searchResponse);

				if (searchResponse.status === 400 && isInvalidLimitError(searchErrorBody)) {
					resolvedSearchResponse = await fetchSearchFallback(request, market, SPOTIFY_LIMIT_RETRY_FALLBACK, usedSeedGenres);
				}
			}

			if (!resolvedSearchResponse.ok) {
				const recommendationsError = await readResponseBody(spotifyResponse);
				const searchError = await readResponseBody(resolvedSearchResponse);

				return NextResponse.json(
					{
						error: "Failed to fetch Spotify recommendations",
						details: {
							recommendations: recommendationsError,
							searchFallback: searchError,
						},
					},
					{ status: resolvedSearchResponse.status }
				);
			}

			const searchPayload = (await resolvedSearchResponse.json()) as SpotifySearchResponse;
			tracks = (searchPayload.tracks?.items ?? [])
				.map(normalizeTrack)
				.filter((track): track is RoundTrack => track !== null);
		}

		const uniqueTracks = dedupeTracks(tracks);
		setRoundTrackCache(createCacheKey(market, usedSeedGenres), uniqueTracks);

		const roundTracks = shuffleTracks(uniqueTracks).slice(0, limit);

		if (roundTracks.length === 0) {
			return NextResponse.json(
				{ error: "No tracks available for this round" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			tracks: roundTracks,
			market,
			seedGenres: usedSeedGenres,
			source: "spotify",
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";

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

