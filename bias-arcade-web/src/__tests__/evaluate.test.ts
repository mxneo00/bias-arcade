import { evaluateCollection } from '@/lib/collections/evaluate';
import { UserStats } from '@/lib/collections/types';

const baseStats: UserStats = {
    totalGamesPlayed: 0,
    averageScore: 0,
    highestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    gameHistory: [],
};

describe('evaluateCollection', () => {
    it('returns a CollectionItem for every badge', () => {
        const items = evaluateCollection(baseStats);
        expect(items.length).toBeGreaterThan(0);
        items.forEach(item => {
            expect(item.badge).toBeDefined();
            expect(item.unlockRule).toBeDefined();
        });
    });

    it('marks badges as locked when conditions are not met', () => {
        const items = evaluateCollection(baseStats);
        items.forEach(item => {
            expect(item.badge.status).toBe('locked');
            expect(item.dateUnlocked).toBeNull();
            expect(item.dateClaimed).toBeNull();
        });
    });

    it('marks a badge as unlocked when its rule is met', () => {
        const stats: UserStats = { ...baseStats, totalGamesPlayed: 1 };
        const items = evaluateCollection(stats);
        const firstGame = items.find(i => i.badge.id === 'first_game')!;
        expect(firstGame.badge.status).toBe('unlocked');
        expect(firstGame.dateUnlocked).not.toBeNull();
    });

    it('marks a badge as claimed when it is in the claimed list', () => {
        const stats: UserStats = { ...baseStats, totalGamesPlayed: 1 };
        const items = evaluateCollection(stats, ['first_game']);
        const firstGame = items.find(i => i.badge.id === 'first_game')!;
        expect(firstGame.badge.status).toBe('claimed');
        expect(firstGame.dateClaimed).not.toBeNull();
    });

    it('claimed takes precedence over unlocked in the status', () => {
        const stats: UserStats = { ...baseStats, totalGamesPlayed: 5 };
        const items = evaluateCollection(stats, ['first_game']);
        const firstGame = items.find(i => i.badge.id === 'first_game')!;
        expect(firstGame.badge.status).toBe('claimed');
    });
});
