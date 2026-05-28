import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";
import { evaluateCollection } from "@/lib/collections/evaluate";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const collectionDocRef = adminDb.collection("users").doc(session.user.id);
        const collectionSnap = await collectionDocRef.get();

        if (!collectionSnap.exists) {
            return NextResponse.json({
                collectionItems: [],
                claimedBadges: [],
            });
        }

        const data = collectionSnap.data();
        const stats = data?.stats ?? {
            totalGamesPlayed: 0,
            averageScore: 0,
            highestScore: 0,
            currentStreak: 0,
            longestStreak: 0,
            gameHistory: [],
        };
        const claimedBadges = Array.isArray(data?.claimedBadges) ? data.claimedBadges : [];
        const evaluatedCollection = evaluateCollection(stats, claimedBadges);

        return NextResponse.json({
            collectionItems: evaluatedCollection,
            claimedBadges,
        });
    } catch (error) {
        console.error("Error fetching collection progress:", error);
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }
}
