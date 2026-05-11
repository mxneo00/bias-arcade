import { firebaseDb } from "../../../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { UserStats, GameStats } from "./types";

export async function updateUserStats(
    userId: string, 
    gameData: { gameId: string; score: number; streak: number }
) {
    const collectionDocRef = doc(firebaseDb, "users", userId);
    const collectionSnap = await getDoc(collectionDocRef);

    let stats: UserStats;

    if (collectionSnap.exists()) {
        stats = collectionSnap.data().stats;
    } else {
        stats = {
            totalGamesPlayed: 0,
            averageScore: 0,
            highestScore: 0,
            currentStreak: 0,
            longestStreak: 0,
            gameHistory: [],
        };
    }

    const newGameStats: GameStats = {
        gameId: gameData.gameId,
        score: gameData.score,
        dateAchieved: new Date().toISOString(),
        streak: gameData.streak,
    };

    stats.gameHistory.push(newGameStats);
    stats.totalGamesPlayed += 1;
    stats.averageScore = 
        (stats.averageScore * (stats.totalGamesPlayed - 1) + gameData.score) / stats.totalGamesPlayed;
    stats.highestScore = Math.max(stats.highestScore, gameData.score);
    stats.currentStreak = gameData.streak;
    stats.longestStreak = Math.max(stats.longestStreak, gameData.streak);

    const collectionData = collectionSnap.exists()
        ? { ...collectionSnap.data(), stats }
        : { userId, stats, claimedBadges: [], updatedAt: new Date().toISOString() };
    
    if (collectionSnap.exists()) {
        await updateDoc(collectionDocRef, { stats, updatedAt: new Date().toISOString() });
    } else {
        await setDoc(collectionDocRef, {
            userId,
            stats,
            claimedBadges: [],
            updatedAt: new Date().toISOString(),
        });
    }
}
