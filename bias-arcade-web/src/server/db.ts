import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Reuse a single PrismaClient instance across hot-reloads in development to
// avoid exhausting the database connection pool.
export const db =
  global.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}