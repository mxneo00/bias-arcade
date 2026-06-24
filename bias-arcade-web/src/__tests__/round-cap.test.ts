import { computeRoundCap } from '@/lib/games/shared/round-cap';

describe('computeRoundCap', () => {
    it('returns 1 as minimum when pool is too small', () => {
        expect(computeRoundCap(1, 4)).toBe(1);
    });

    it('returns 1 when pool size is 0', () => {
        expect(computeRoundCap(0, 4)).toBe(1);
    });

    it('applies the 0.8 safety factor', () => {
        // floor(10 / 2 * 0.8) = floor(4) = 4
        expect(computeRoundCap(10, 2)).toBe(4);
    });

    it('floors fractional results', () => {
        // floor(5 / 2 * 0.8) = floor(2) = 2
        expect(computeRoundCap(5, 2)).toBe(2);
    });

    it('scales with larger pools', () => {
        // floor(100 / 4 * 0.8) = floor(20) = 20
        expect(computeRoundCap(100, 4)).toBe(20);
    });
});
