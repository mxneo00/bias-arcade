import { ArtistScope } from "../shared/scope";

export type RoundTrack = {
	id: string;
	name: string;
	artists: string[];
	uri: string;
	durationMs: number;
	previewUrl: string | null;
	albumImageUrl: string | null;
	albumName: string | null;
	externalUrl: string | null;
};

export type GameSettings = {
    market: string;
    seedGenres: string[];
    optionsCount: number;
	scope: ArtistScope;
	roundCap: number;
}

export type RoundPayload = {
    roundNumber: number;
    answer: RoundTrack;
    options: RoundTrack[];
}

export type CreateGameResponse = {
	gameId: string;
};