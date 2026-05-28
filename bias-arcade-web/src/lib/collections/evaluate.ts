import { badges } from "./badges";
import { unlockRules } from "./unlock-rules";
import { UserStats, CollectionItem } from "./types";

export function evaluateCollection(
    userStats: UserStats,
    claimedBadgeIds: string[] = []
): CollectionItem[] {
    return badges.map(badge => {
        const unlockRule = unlockRules.find(rule => rule.id === badge.id);

        if (!unlockRule) {
            throw new Error(`No unlock rule found for badge ID: ${badge.id}`);
        }

        const isUnlocked = unlockRule.isMet(userStats);
        const isClaimed = claimedBadgeIds.includes(badge.id);

        const status = isClaimed
            ? "claimed"
            : isUnlocked
                ? "unlocked"
                : "locked";

        return {
            badge: {
                ...badge,
                status,
            },
            unlockRule,
            dateUnlocked: isUnlocked ? new Date().toISOString() : null,
            dateClaimed: isClaimed ? new Date().toISOString() : null,
        };
    });
}