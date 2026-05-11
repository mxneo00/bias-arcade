export type UserCollectionDoc = {
    userId: string;
    stats: UserStats;
    claimedBadges: string[]; // Array of badge IDs that the user has claimed
    updatedAt: string; // ISO date string
}

export type Status = "locked" | "unlocked" | "claimed";

export type Badge = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: Status;
};

export type GameStats = {
    gameId: string;
    score: number;
    dateAchieved: string; // ISO date string
    streak: number;
};

export type UserStats = {
    totalGamesPlayed: number;
    averageScore: number;
    highestScore: number;
    currentStreak: number;
    longestStreak: number;
    gameHistory: GameStats[];
};

export type UnlockRule = {
    id: string;
    description: string;
    isMet: (stats: UserStats) => boolean;
};

export type CollectionItem = {
    badge: Badge;
    unlockRule: UnlockRule;
    dateUnlocked: string | null; // ISO date string or null if locked
    dateClaimed: string | null; // ISO date string or null if not claimed
};