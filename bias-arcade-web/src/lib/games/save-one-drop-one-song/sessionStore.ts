import { GameSettings, SongA, SongB } from "./types";

type GameSession = {
    id: string;
    settings: GameSettings;
    variant: string;
    createdAt: number;
    updatedAt: number;
    pool: (SongA | SongB)[];
    usedSongAIds: Set<string>;
    usedSongBIds: Set<string>;
    roundNumber: number;
    usedOptions: Set<string>;
}

const GAME_TTL_MS = 30 * 60 * 1000; // 30 minutes

declare global {
    var __saveOneDropOneSongSessions: Map<string, GameSession> | undefined;
}

const sessions = globalThis.__saveOneDropOneSongSessions ??= new Map<string, GameSession>();
globalThis.__saveOneDropOneSongSessions = sessions;

function cleanUpSessions() {
    const now = Date.now();
    for (const [id, session] of sessions) {
        if (now - session.updatedAt > GAME_TTL_MS) {
            sessions.delete(id);
        }
    }
}

export function createSession(settings: GameSettings): GameSession {
    cleanUpSessions();

    const id = crypto.randomUUID();
    const now = Date.now();
    const session: GameSession = {
        id,
        settings,
        variant: "default",
        createdAt: now,
        updatedAt: now,
        pool: [],
        usedSongAIds: new Set(),
        usedSongBIds: new Set(),
        roundNumber: 0,
        usedOptions: new Set(),
    };
    sessions.set(id, session);
    return session;
}

export function getSession(gameId: string): GameSession | null {
    cleanUpSessions();
    const session = sessions.get(gameId);

    if (!session) {
        return null;
    }
    session.updatedAt = Date.now();
    return session ?? null;
}

export function deleteSession(gameId: string): void {
    sessions.delete(gameId);
}

export type { GameSession };