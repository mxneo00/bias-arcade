import { dedupeTracks, shuffle } from '@/lib/games/guess-the-song/helpers';
import { RoundTrack } from '@/lib/games/guess-the-song/types';

const makeTrack = (id: string): RoundTrack => ({
    id,
    name: `Track ${id}`,
    artists: ['Artist'],
    uri: `spotify:track:${id}`,
    durationMs: 180000,
    previewUrl: null,
    albumImageUrl: null,
    albumName: null,
    externalUrl: null,
});

describe('dedupeTracks', () => {
    it('returns an empty array unchanged', () => {
        expect(dedupeTracks([])).toEqual([]);
    });

    it('returns tracks unchanged when there are no duplicates', () => {
        const tracks = [makeTrack('a'), makeTrack('b')];
        expect(dedupeTracks(tracks)).toEqual(tracks);
    });

    it('removes duplicate track ids, keeping the last occurrence', () => {
        const a1 = makeTrack('a');
        const a2 = { ...makeTrack('a'), name: 'Duplicate A' };
        const b = makeTrack('b');
        expect(dedupeTracks([a1, a2, b])).toEqual([a2, b]);
    });
});

describe('shuffle', () => {
    it('returns an array with the same elements', () => {
        const input = [1, 2, 3, 4, 5];
        const result = shuffle(input);
        expect(result).toHaveLength(input.length);
        expect([...result].sort()).toEqual([...input].sort());
    });

    it('does not mutate the original array', () => {
        const input = [1, 2, 3, 4, 5];
        const copy = [...input];
        shuffle(input);
        expect(input).toEqual(copy);
    });

    it('returns a new array reference', () => {
        const input = [1, 2, 3];
        expect(shuffle(input)).not.toBe(input);
    });
});
