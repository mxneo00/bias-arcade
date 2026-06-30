import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

const defaultStats = {
    totalGamesPlayed: 0,
    averageScore: 0,
    highestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    gameHistory: [],
};

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const userDocRef = adminDb.collection("users").doc(session.user.id);
    const snap = await userDocRef.get();

    if (snap.exists) {
        await userDocRef.update({
            stats: defaultStats,
            claimedBadges: [],
            updatedAt: new Date().toISOString(),
        });
    } else {
        await userDocRef.set({
            stats: defaultStats,
            claimedBadges: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true });
}
