import { SongA, SongB } from "./types";

export function dedupeTracks(songs: (SongA | SongB)[]): (SongA | SongB)[] {
    return Array.from(new Map(songs.map(song => [song.id, song])).values());
}

export function shuffle<T>(values: T[]): T[] {
    const array = [...values];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}