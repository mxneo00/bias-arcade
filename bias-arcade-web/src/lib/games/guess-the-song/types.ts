export type RoundTrack = {
	id: string;
	name: string;
	artists: string[];
	uri: string;
	durationMs: number;
	previewUrl: string | null;
	albumImageUrl: string | null;
	externalUrl: string | null;
};

export type GameSettings = {
    market: string;
    seedGenres: string[];
    optionsCount: number;
}

export type RoundPayload = {
    roundNumber: number;
    answer: RoundTrack;
    options: RoundTrack[];
}