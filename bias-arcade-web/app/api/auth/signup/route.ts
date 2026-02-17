import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { db } from "@/server/db";

type SignupPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SignupPayload;

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;
  const name = payload.name?.trim() || null;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}