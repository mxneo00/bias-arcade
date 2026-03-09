import { existsSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const SQLITE_URL_PREFIX = "file:";

const findProjectRoot = (startDir: string): string => {
  let currentDir = startDir;

  while (true) {
    const hasPackageJson = existsSync(path.join(currentDir, "package.json"));
    const hasPrismaSchema = existsSync(path.join(currentDir, "prisma", "schema.prisma"));

    if (hasPackageJson && hasPrismaSchema) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
};

const resolveDatasourceUrl = (): string | undefined => {
  const configuredUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!configuredUrl?.startsWith(SQLITE_URL_PREFIX)) {
    return configuredUrl;
  }

  const rawSqlitePath = configuredUrl.slice(SQLITE_URL_PREFIX.length);
  const queryIndex = rawSqlitePath.indexOf("?");
  const sqlitePath = queryIndex === -1 ? rawSqlitePath : rawSqlitePath.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : rawSqlitePath.slice(queryIndex);
  const isAbsoluteFilePath =
    sqlitePath.startsWith("/") ||
    sqlitePath.startsWith("\\") ||
    /^[a-zA-Z]:[\\/]/.test(sqlitePath);

  if (sqlitePath === ":memory:" || isAbsoluteFilePath) {
    return configuredUrl;
  }

  const projectRoot = findProjectRoot(process.cwd());
  const absoluteSqlitePath = path.resolve(projectRoot, sqlitePath).replace(/\\/g, "/");

  return `${SQLITE_URL_PREFIX}${absoluteSqlitePath}${query}`;
};

const datasourceUrl = resolveDatasourceUrl();

export const db =
  global.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}