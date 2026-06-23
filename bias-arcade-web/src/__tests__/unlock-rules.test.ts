import { unlockRules } from '@/lib/collections/unlock-rules';
import { UserStats } from '@/lib/collections/types';

const baseStats: UserStats = {
    totalGamesPlayed: 0,
    averageScore: 0,
    highestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    gameHistory: [],
};

const rule = (id: string) => unlockRules.find(r => r.id === id)!;

describe('first_game unlock rule', () => {
    it('is not met with 0 games played', () => {
        expect(rule('first_game').isMet(baseStats)).toBe(false);
    });

    it('is met after 1 game', () => {
        expect(rule('first_game').isMet({ ...baseStats, totalGamesPlayed: 1 })).toBe(true);
    });
});

describe('guess_the_song unlock rule', () => {
    it('is not met without a guess_the_song game in history', () => {
        expect(rule('guess_the_song').isMet(baseStats)).toBe(false);
    });

    it('is met when a guess_the_song game appears in history', () => {
        const stats: UserStats = {
            ...baseStats,
            gameHistory: [{ gameId: 'guess_the_song', score: 50, dateAchieved: '', streak: 0 }],
        };
        expect(rule('guess_the_song').isMet(stats)).toBe(true);
    });
});

describe('score threshold unlock rules', () => {
    it.each([
        ['score_100_points', 99, false],
        ['score_100_points', 100, true],
        ['score_500_points', 499, false],
        ['score_500_points', 500, true],
        ['score_1000_points', 999, false],
        ['score_1000_points', 1000, true],
    ])('%s with score %d → %s', (id, score, expected) => {
        const stats: UserStats = {
            ...baseStats,
            gameHistory: [{ gameId: 'guess_the_song', score, dateAchieved: '', streak: 0 }],
        };
        expect(rule(id).isMet(stats)).toBe(expected);
    });
});

describe('streak unlock rules', () => {
    it.each([
        ['3_game_streak', 2, false],
        ['3_game_streak', 3, true],
        ['5_game_streak', 4, false],
        ['5_game_streak', 5, true],
        ['10_game_streak', 9, false],
        ['10_game_streak', 10, true],
    ])('%s with streak %d → %s', (id, streak, expected) => {
        expect(rule(id).isMet({ ...baseStats, currentStreak: streak })).toBe(expected);
    });
});
