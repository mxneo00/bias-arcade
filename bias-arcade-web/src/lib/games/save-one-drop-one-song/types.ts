import { ArtistScope } from "../shared/scope";

export type SongA = {
    id: string;
    name: string;
    artists: string[];
    artistIds: string[];
    uri: string;
    duration_ms: number;
    //albumName: string;
    albumImageUrl: string | null;
}

export type SongB = {
    id: string;
    name: string;
    artists: string[];
    artistIds: string[];
    uri: string;
    duration_ms: number;
    //albumName: string;
    albumImageUrl: string | null;
}

export type GameSettings = {
    market: string;
    seedGenres: string[];
    optionsCount: number;
    scope: ArtistScope;
    roundCap: number;
}

export type GameRound = {
    roundNumber: number;
    songA: SongA;
    songB: SongB;
}

export type CreateGameResponse = {
    gameId: string;
    roundCap?: number;
};