import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { firebaseDb } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { evaluateCollection } from "@/lib/collections/evaluate";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const collectionDocRef = doc(firebaseDb, "users", session.user.id);
        const collectionSnap = await getDoc(collectionDocRef);

        if (!collectionSnap.exists()) {
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
        const evaluatedCollection = evaluateCollection(data.stats);

        return NextResponse.json({
            stats: data.stats,
            collectionItems: evaluatedCollection,
            claimedBadges: data.claimedBadges || [],
        });
    } catch (error) {
        console.error("Error fetching collection data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { badgeId } = await request.json();

        const collectionDocRef = doc(firebaseDb, "users", session.user.id);
        const collectionSnap = await getDoc(collectionDocRef);

        if (!collectionSnap.exists()) {
            return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        const data = collectionSnap.data();
        const claimedBadges = data.claimedBadges || [];

        if (claimedBadges.includes(badgeId)) {
            return NextResponse.json({ error: "Badge already claimed" }, { status: 400 });
        }

        claimedBadges.push(badgeId);
        
        await updateDoc(collectionDocRef, { 
            claimedBadges, 
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ message: "Badge claimed successfully" });
    } catch (error) {
        console.error("Error claiming badge:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}