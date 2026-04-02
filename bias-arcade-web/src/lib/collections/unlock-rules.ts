import { UnlockRule } from '../collections/types';

export const unlockRules: UnlockRule[] = [
    // Game Related Unlock Rules
    {
        id: "play_1st_game",
        description: "Play your first game",
        isMet: (stats) => stats.totalGamesPlayed >= 1,
    },
    {
        id:"play_guess_the_song",
        description: "Play the 'Guess the Song' game",
        isMet: (stats) => stats.gameHistory.some(game => game.gameId === "guess_the_song"),
    },
    {
        id: "play_save_one_drop_one",
        description: "Play the 'Save One, Drop One' game",
        isMet: (stats) => stats.gameHistory.some(game => game.gameId === "save_one_drop_one"),
    },
    // Score Related Unlock Rules
    {
        id: "score_100_points",
        description: "Score at least 100 points in a single game",
        isMet: (stats) => stats.gameHistory.some(game => game.score >= 100),
    },
    {
        id: "score_500_points",
        description: "Score at least 500 points in a single game",
        isMet: (stats) => stats.gameHistory.some(game => game.score >= 500),
    },
    {
        id: "score_1000_points",
        description: "Score at least 1000 points in a single game",
        isMet: (stats) => stats.gameHistory.some(game => game.score >= 1000),
    },
    // Streak Related Unlock Rules
    {
        id: "3_game_streak",
        description: "Achieve a 3-game winning streak",
        isMet: (stats) => stats.currentStreak >= 3,
    },
    {
        id: "5_game_streak",
        description: "Achieve a 5-game winning streak",
        isMet: (stats) => stats.currentStreak >= 5,
    },
    {
        id: "10_game_streak",
        description: "Achieve a 10-game winning streak",
        isMet: (stats) => stats.currentStreak >= 10,
    },
];