import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuth } from "firebase-admin/auth";

import { authOptions } from "@/server/auth";

type Payload = { displayName?: string };

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = (await request.json()) as Payload;
    const displayName = payload.displayName?.trim();

    if (!displayName) {
        return NextResponse.json({ error: "Display name is required." }, { status: 400 });
    }

    if (displayName.length > 50) {
        return NextResponse.json({ error: "Display name must be 50 characters or fewer." }, { status: 400 });
    }

    await getAuth().updateUser(session.user.id, { displayName });

    return NextResponse.json({ success: true });
}
