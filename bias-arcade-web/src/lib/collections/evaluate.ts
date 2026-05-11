import { badges } from "./badges";
import { unlockRules } from "./unlock-rules";
import { UserStats, CollectionItem } from "./types";

export function evaluateCollection(userStats: UserStats): CollectionItem[] {
    return badges.map(badge => {
        const unlockRule = unlockRules.find(rule => rule.id === badge.id);

        if (!unlockRule) {
            throw new Error(`No unlock rule found for badge ID: ${badge.id}`);
        }

        const isUnlocked = unlockRule.isMet(userStats);

        return {
            badge: {
                ...badge,
                status: isUnlocked ? "unlocked" : "locked",
            },
            unlockRule,
            dateUnlocked: isUnlocked ? new Date().toISOString() : null,
            dateClaimed: null, 
        };
    });
}