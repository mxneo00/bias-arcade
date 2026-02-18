import { NextRequest, NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";

const DEFAULT_SEED_GENRES = ["k-pop", "k-rock", "korean-pop", "korean-rock"];
const DEFAULT_MARKET = "KR";
const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;

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

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const limit = parseLimit(searchParams.get("limit"));
	const market = parseMarket(searchParams.get("market"));
	const requestedSeedGenres = parseSeedGenres(searchParams.get("seedGenres"));

	try {
		let spotifyResponse = await fetchRecommendations(request, market, limit, requestedSeedGenres);
		let usedSeedGenres = requestedSeedGenres;

		if (!spotifyResponse.ok && requestedSeedGenres.join(",") !== DEFAULT_SEED_GENRES.join(",")) {
			spotifyResponse = await fetchRecommendations(request, market, limit, DEFAULT_SEED_GENRES);
			usedSeedGenres = DEFAULT_SEED_GENRES;
		}

		if (!spotifyResponse.ok) {
			const errorBody = await spotifyResponse.text();
			return NextResponse.json(
				{
					error: "Failed to fetch Spotify recommendations",
					details: errorBody,
				},
				{ status: spotifyResponse.status }
			);
		}

		const payload = (await spotifyResponse.json()) as SpotifyRecommendationsResponse;
		const tracks = (payload.tracks ?? [])
			.map(normalizeTrack)
			.filter((track): track is RoundTrack => track !== null);

		const uniqueTracks = Array.from(new Map(tracks.map((track) => [track.id, track])).values()).slice(0, limit);

		if (uniqueTracks.length === 0) {
			return NextResponse.json(
				{ error: "No tracks available for this round" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			tracks: uniqueTracks,
			market,
			seedGenres: usedSeedGenres,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

