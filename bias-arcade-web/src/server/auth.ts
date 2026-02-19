import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  // Fall back to a dev-only secret so the app starts without NEXTAUTH_SECRET set locally.
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "dev-fallback-auth-secret" : undefined),
  // Use JWTs for sessions so we don't need a database session table.
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        // Compare the plain-text password against the stored bcrypt hash.
        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // Expose the user's database ID on the session so it's accessible client-side.
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};