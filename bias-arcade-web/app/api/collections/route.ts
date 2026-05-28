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
                stats: {
                    totalGamesPlayed: 0,
                    averageScore: 0,
                    highestScore: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    gameHistory: [],
                },
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
            stats,
            collectionItems: evaluatedCollection,
            claimedBadges,
        });
    } catch (error) {
        console.error("Error fetching collection data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { badgeId } = await request.json();

        const collectionDocRef = adminDb.collection("users").doc(session.user.id);
        const collectionSnap = await collectionDocRef.get();

        if (!collectionSnap.exists) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        const data = collectionSnap.data();
        const claimedBadges = data?.claimedBadges || [];

        if (claimedBadges.includes(badgeId)) {
            return NextResponse.json({ error: "Badge already claimed" }, { status: 400 });
        }

        claimedBadges.push(badgeId);
        
        await collectionDocRef.update({ 
            claimedBadges, 
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ message: "Badge claimed successfully" });
    } catch (error) {
        console.error("Error claiming badge:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}