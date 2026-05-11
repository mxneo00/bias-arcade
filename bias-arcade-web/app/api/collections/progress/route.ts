import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { firebaseDb } from "../../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
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
                collectionItems: [],
                claimedBadges: [],
            });
        }

        const data = collectionSnap.data();
        const evaluatedCollection = evaluateCollection(data.stats);

        return NextResponse.json({
            collectionItems: evaluatedCollection,
            claimedBadges: data.claimedBadges || [],
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }
}
