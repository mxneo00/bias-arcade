import "server-only";
import { adminDb } from "@/server/firebase-admin";
import { UserStats, GameStats } from "./types";

type GameUpdateData = {
    gameId: string;
    score: number;
    streak: number;
};

const defaultStats: UserStats = {
    totalGamesPlayed: 0,
    averageScore: 0,
    highestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    gameHistory: [],
};

export async function updateUserStats(userId: string, gameData: GameUpdateData) {
    const userDocRef = adminDb.collection("users").doc(userId);
    const userSnap = await userDocRef.get();

    const data = userSnap.data();
    const stats: UserStats = data?.stats ?? defaultStats;

    const newGameStats: GameStats = {
        gameId: gameData.gameId,
        score: gameData.score,
        dateAchieved: new Date().toISOString(),
        streak: gameData.streak,
    };

    const nextHistory = [...stats.gameHistory, newGameStats];
    const totalGamesPlayed = stats.totalGamesPlayed + 1;
    const averageScore = (stats.averageScore * stats.totalGamesPlayed + gameData.score) / totalGamesPlayed;
    const highestScore = Math.max(stats.highestScore, gameData.score);
    const currentStreak = gameData.streak;
    const longestStreak = Math.max(stats.longestStreak, currentStreak);

    const nextStats: UserStats = {
        totalGamesPlayed,
        averageScore,
        highestScore,
        currentStreak,
        longestStreak,
        gameHistory: nextHistory,
    };

    if (userSnap.exists) {
        await userDocRef.update({ stats: nextStats, updatedAt: new Date().toISOString() });
        return;
    }

    await userDocRef.set({ stats: nextStats, claimedBadges: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}
