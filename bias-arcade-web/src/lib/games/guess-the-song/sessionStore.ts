import { GameSettings, RoundTrack } from "./types"

type GameSession = {
    id: string;
    settings: GameSettings;
    variant: string;
    createdAt: number;
    updatedAt: number;
    pool: RoundTrack[];
    usedAnswers: Set<string>;
    recentlyUsedIds: string[];
    roundNumber: number;
    maxRounds: number;
}

const GAME_TTL_MS = 30 * 60 * 1000; // 30 minutes

declare global {
    var __guessTheSongSessions: Map<string, GameSession> | undefined;
}
const sessions = globalThis.__guessTheSongSessions ??= new Map<string, GameSession>();
globalThis.__guessTheSongSessions = sessions;

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
    const variant = crypto.randomUUID().slice(0, 8);
    const session: GameSession = {
        id,
        settings,
        variant: variant,
        createdAt: now,
        updatedAt: now,
        pool: [],
        usedAnswers: new Set(),
        recentlyUsedIds: [],
        roundNumber: 0,
        maxRounds: 0,
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
    return session;
}

export function deleteSession(gameId: string): void {
    sessions.delete(gameId);
}

export type { GameSession };