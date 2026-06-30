import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuth } from "firebase-admin/auth";

import { authOptions } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const uid = session.user.id;

    await adminDb.collection("users").doc(uid).delete();
    await getAuth().deleteUser(uid);

    return NextResponse.json({ success: true });
}
