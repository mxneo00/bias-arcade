import { RoundTrack } from "./types";

export function dedupeTracks(tracks: RoundTrack[]): RoundTrack[] {
    return Array.from(new Map(tracks.map(track => [track.id, track])).values());
}

export function shuffle<T>(values: T[]): T[] {
    const array = [...values];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}