# Bias Arcade - Documentation

# Table of Contents

1. [Overview](#overview)
2. [Frameworks and Stack](#frameworks-and-stack)
3. [Application Architecture](#application-architecture)
4. [Project Structure](#project-structure)
5. [Frontend Documentation](#fontend-documentation)
6. [Backend Documentation](#backend-documentation)
7. [Core Game Logic](#core-game-logic)
8. [Setup and Run](#setup-and-run)
9. [Deployment](#deployment)
10. [Testing Coverage](#testing-coverage)
11. [Known Limitations and Next Improvements](#known-limitations-and-next-improvements)
12. [Future Development Plans](#future-development-plans)

---

## Overview

Bias Arcade is a K-pop music game web application for fans who want to either test their song knowledge or play other fun minigames similar to those they find as Youtube videos. Users connect a Premium Spotify account, choose a game mode, and play rounds where they either identify songs from short audio snippets (Guess the Song) or pick between two songs head-to-head (Save One Drop One Song). Completing games earns points, maintains streaksm and unlocks collectible badges tracked in a personal collection. 

The app is scoped to K-pop: all track retrieval contains genre-filtered Spotify API calls, and there is a hardcoded artist registery of 50+ groups and solo artists that powers the "Artist Select" mode.

---

## Frameworks and Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Authentication | NextAuth.js v4 (credentials provider) |
| Identity / Auth backend | Firebase Authentication |
| Database | Firebase Firestore (via Firebase Admin SDK) |
| Music source | Spotify Web API |
| In-browser playback | Spotify Web Playback SDK |
| Testing | Jest 30 |
| Linting | ESLint 9 + eslint-config-next |
| Fonts | Geist Sans / Geist Mono (next/font/google) |

There are no third-party UI component libraries. All styles are CSS modules.

---

## Application Architecture

The app follows Next.js App Router conventions with a clear split between UI and API routes.

**Authentication** uses a two-layer approach: 
NextAuth.js manages server-side session (JWT) and exposes a `useSession` hook to client components. NextAuth's credienditals provider validates email/password against Firebase Authentication. The resulting JWT is enhanced with the Firebase `uid` so server-side components can lookup documents by user ID.

**Spotify** is a separate integration from the app login. Users can connect Spotify through a dedicated OAuth flow at `/api/integrations/spotify/login`. Tokens are stored server-side in HTTP-only cookies (`spotify-access-token`, `spotify_refresh_token`). All Spotify API calls from Rout Handlers go through `spotifyFetch` in [src/lib/spotify/clients.ts](bias-arcade-web/src/lib/spotify/client.ts), which automatically refreshes the access token by calling the internal `/api/integrations/spotify/refresh` endpoint before each request. 

**Game sessions** are entirely server-side. When a game starts, the backend creates an in-memory session and returns a `gameId` to the client. Subsequent round requests reference that `gameId`, and the server draws tracks from the session's pool, refilling from Spotify as needed. No game state is stored in Firestore or cookies during gameplay - only the final score is persisted when a game ends via the `DELETE /api/games/.../game` endpoint.

**Firestore** holds user profile documents (`users/{uid}`) with aggregated `UserStats` (total games, average score, highest score, streaks, game history) and a `claimedBadges` array. Stats are updated server-side on every game completion via `updateUserStats`. 

**Badges/Collections** are evaluated entirely in memory at read time by comparing the user's `UserStats` against a set of `UnlockRule` functions defined in [src/lib/collections/unlock-rules.ts](bias-arcade-web/src/lib/collections/unlock-rules.ts). There is no separate Firestore document for badge unlock state - it is derived from stats on every page load.

---

## Project Structure

```
bias-arcade/
└── bias-arcade-web/              # Next.js application root
    ├── app/
    │   ├── layout.tsx            # Root layout — wraps all pages in AuthSessionProvider
    │   ├── globals.css
    │   ├── (site)/               # Route group for all public-facing pages
    │   │   ├── page.tsx          # Home / landing page
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── collection/page.tsx
    │   │   └── games/
    │   │       ├── page.tsx      # Game hub — lists available games
    │   │       ├── layout.tsx    # Games layout — wraps in SpotifyPlaybackProvider
    │   │       ├── guess-the-song/page.tsx
    │   │       └── save-one-drop-one-song/page.tsx
    │   └── api/
    │       ├── auth/
    │       │   ├── [...nextauth]/route.ts   # NextAuth handler
    │       │   ├── logout/route.ts
    │       │   └── signup/route.ts          # Creates Firebase user
    │       ├── games/
    │       │   ├── guess-the-song/
    │       │   │   ├── game/route.ts        # POST = create session, DELETE = end + save stats
    │       │   │   └── round/route.ts       # POST = generate next round
    │       │   └── save-one-drop-one-song/
    │       │       ├── game/route.ts
    │       │       └── round/route.ts
    │       ├── integrations/spotify/
    │       │   ├── login/route.ts           # Initiates OAuth redirect
    │       │   ├── callback/route.ts        # Handles OAuth callback, sets cookies
    │       │   ├── refresh/route.ts         # Refreshes access token via refresh_token cookie
    │       │   ├── disconnect/route.ts      # Clears Spotify cookies
    │       │   ├── status/route.ts          # Returns whether Spotify is connected
    │       │   ├── me/route.ts              # Proxies GET /v1/me
    │       │   └── player/
    │       │       ├── play/route.ts
    │       │       └── transfer/route.ts
    │       └── collections/
    │           ├── route.ts                 # GET = fetch user's collection + evaluated badges
    │           └── progress/route.ts        # POST = claim a badge
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── session-provider.tsx     # Wraps NextAuth SessionProvider
    │   │   │   └── sign-out-button.tsx
    │   │   ├── collections/
    │   │   │   ├── badge-card.tsx
    │   │   │   ├── badge-grid.tsx
    │   │   │   ├── collection-page-client.tsx
    │   │   │   └── progress-panel.tsx
    │   │   ├── game/
    │   │   │   ├── artist-mode-selector.tsx # Modal for picking an artist scope
    │   │   │   ├── game-play-button.tsx
    │   │   │   ├── guess-the-song-client.tsx
    │   │   │   ├── save-one-drop-one-song-client.tsx
    │   │   │   └── volume-slider.tsx
    │   │   └── layout/
    │   │       ├── games-spotify-wrapper.tsx
    │   │       └── site-header.tsx
    │   ├── features/spotify/
    │   │   └── SpotifyPlaybackProvider.tsx  # Spotify Web Playback SDK React context
    │   ├── lib/
    │   │   ├── collections/
    │   │   │   ├── badges.ts               # Badge definitions (id, name, description)
    │   │   │   ├── evaluate.ts             # Derives CollectionItem[] from UserStats
    │   │   │   ├── format.ts               # Display formatting helpers
    │   │   │   ├── types.ts                # Badge, UserStats, UnlockRule, etc.
    │   │   │   ├── unlock-rules.ts         # UnlockRule predicate functions
    │   │   │   └── updateStats.ts          # Server-only: writes UserStats to Firestore
    │   │   ├── games/
    │   │   │   ├── shared/
    │   │   │   │   ├── artist-registry.ts  # Hardcoded K-pop artist list with Spotify IDs
    │   │   │   │   ├── round-cap.ts        # computeRoundCap() formula
    │   │   │   │   ├── scope.ts            # ArtistScope union type + trackMatchesScope()
    │   │   │   │   ├── types.ts            # Shared Spotify response types + filter constants
    │   │   │   │   └── utility-functions.ts # isUnwantedTrack, sanitizeSeedGenres, etc.
    │   │   │   ├── guess-the-song/
    │   │   │   │   ├── helpers.ts          # dedupeTracks(), shuffle()
    │   │   │   │   ├── sessionStore.ts     # In-memory game session Map (globalThis)
    │   │   │   │   ├── spotifySource.ts    # fetchTrackBatch(), fetchArtistTrackBatch()
    │   │   │   │   └── types.ts            # RoundTrack, RoundPayload, GameSettings
    │   │   │   └── save-one-drop-one-song/
    │   │   │       ├── helpers.ts
    │   │   │       ├── sessionStore.ts
    │   │   │       ├── spotifySource.ts
    │   │   │       └── types.ts            # SongA, SongB, GameRound, GameSettings
    │   │   └── spotify/
    │   │       ├── client.ts               # spotifyFetch(), getSpotifyAccessToken()
    │   │       └── status.ts               # getSpotifyConnectionStatus()
    │   ├── server/
    │   │   ├── auth.ts                     # NextAuth authOptions (credentials provider)
    │   │   └── firebase-admin.ts           # Firestore Admin SDK initialization
    │   ├── types/
    │   │   └── next-auth.d.ts              # Extends Session type with user.id
    │   └── __tests__/                      # Jest test files
    ├── config/firebase.ts                  # Firebase client SDK initialization
    ├── middleware.ts                        # Dev-only: localhost → 127.0.0.1 redirect
    ├── jest.config.js
    ├── next.config.ts
    └── package.json
```

---

## Frontend Documentation

### Pages and Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page |
| `/login` | Login | Email/password sign-in form |
| `/signup` | Signup | Registration form (creates Firebase user) |
| `/games` | Games Hub | List all available games |
| `/games/guess-the-song` | Guess the Song | Main game page for GTS |
| `/games/save-one-drop-one-song` | Save One Drop One Song | Main game page for SODO |
| `/collection` | Collection | Badge grid and progress panel |
| `/profile` | Profile | User profile info |
| `/settings` | Settings | Account settings |


### Games Layout and Spotify Context

The `/games` layout ([app/(site)/games/layout.tsx](bias-arcade-web/app/games/layout.tsx)) wraps all game pages in `SpotifyPlaybackProvider`. This context loads the Spotify Web Playback SDK on mount, connects a virtual player device called "Bias Arcade Player", and exposes: 

- `isReady` - whether the SDK device is connected and Spotify has transferred playback to it
- `playSnippet(uri, startMs, lengthMs)` - plays a track for a fixed duration, then auto-pauses 
- `pauseSnippet()` - manual pause
- `activeTrackUri` / `isSnippetPlaying` - for showing which track is currently playing
- `player` - the raw SDK instance (used by the volume slider)

The provider fetches a fresh access token before each play request via `/app/integrations/spotify/refresh`.

### Game Client Components

Both game clients ([guess-the-song-client.tsx](bias-arcade-web/src/components/game/guess-the-song-client.tsx), [save-one-drop-one-song-client.tsx](bias-arcade-web/src/components/game/save-one-drop-one-song-client.tsx)) follow the same three-view state machine:

```
"setup" -> "in-game" -> "results" -> "in-game" (next round) or "setup" (end game)
```

**Setup view**: User picks a mode (All K-pop ir Artist Select). Artist Select opens the `ArtistModeSelector` modal.

**In-game view**: Displays the current round. Users click "Play Snippet" to hear audio through the Spotify player, then interact with the game (guess and option / pick a song). Round stats (score, streak, round number) are shown in a top bar.

**Results view**: Shows the correct answer and a per-round points breakdown (GTS) or save/drop outcome (SODO). User can continue to the next round or end the game.

### Artist Mode Selector

[artist-mode-selector.tsx](bias-arcade-web/src/components/game/artist-mode-selector.tsx) is a modal that lets users pick from the artist registery. It resolves to an `ArtistScope` object which is sent to the game creation API. The modal supports `all-kpop`, `artist`, `group`, `group+solo`, and `custom` scope types.

### Volume Slider

[volume-slider.tsx](bias-arcade-web/src/components/game/volume-slider.tsx) calls `player.setVolume()` directly on the Spotify SDK instance passed in from context. It only renders when a player is connected.

---

## Backend Documentation

### Auth Routes

| Endpoint | Description |
|---|---|
| `POST /api/auth/signup` | Creates a Firebase user via Admin SDK, then signs in via NextAuth |
| `GET/POST /api/auth/[...nextAuth]` | NextAuth handler - sign in, session, CSRF |
| `POST /api/auth/logout` | Clears the NextAuth session cookie |

NextAuth is configured with the Credentials provider. Sign-in validates credentials against the Firebase Identity Toolkit REST API (`signInWithPassword`). The retured Firebase `localId` becomes the NextAuth `user.id`, which is carried in the JWT and exposed on `session.user.id`.

### Spotify Integration Routes

| Endpoint | Description |
|---|---|
| `GET /api/integrations/spotify/login` | Redirects to Spotify OAuth with required scopes |
| `GET /api/integrations/spotify/callback` | Exchanges code for tokens; sets `spotify_access_token` and `spotify_refresh_token` HTTP-only cookies |
| `POST /api/integrations/spotify/refresh` | Refreshes the access token using the refresh token cookie; rotates both cookies on success |
| `GET /api/integrations/spotify/status` | Returns `{ connected: boolean }` based on cookie state |
| `GET /api/integrations/spotify/me` | Proxies `GET /v1/me` for the logged-in Spotify user |
| `POST /api/integrations/spotify/disconnect` | Deletes both Spotify token cookies |

The refresh endpoint is the single source of truth for access tokens. It handles:
- Falling back to the access token cookie if no refresh token is present
- Detecting revoked refresh tokens and clearing stale cookies
- Returning a structured `SPOTIFY_REAUTH_REQUIRED` error code that clients use to show a reconnect prompt.

Including an error code for reauth is vital considering as of July 20, 2026 refresh tokens issued by Spotify apps will expire sooner than initially.

### Game Routes

#### Guess the Song

| Endpoint | Method | Description |
|---|---|---|
| `/api/games/guess-the-song/game` | `POST` | Creates a game session; returns `gameId` |
| `/api/games/guess-the-song/game` | `DELETE` | Ends the game; saves stats to Firestore |
| `/api/games/guess-the-song/round` | `POST` | Returns the next round's answer track + options |

#### Save One Drop One Song

| Endpoint | Method | Description |
|---|---|---|
| `/api/games/save-one-drop-one-song/game` | `POST` | Creates a game session; returns `gameId` |
| `/api/games/save-one-drop-one-song/game` | `DELETE` | Ends the game; saves stats to Firestore |
| `/api/games/save-one-drop-one-song/round` | `POST` | Returns the next pair of songs |

**Game creation** (`POST /api/games/.../game`):
- Validates and sanitizes `scope` and `seedGenres` from the request body
- Creates an in-memory session via `createSession()`
- For `custom` scope (specific artists): pre-fetches the artist's discography from Spotify and stores it in the session pool immediately
- For `all-kpop` scope: pool is filled lazily on each round request.

**Round generation** (`POST /api/games/.../round`): 
- Looks up the session by `gameId`
- Checks if the round cap has been reached
- Refills the session pool from Spotify if it falls below `MIN_POOL = 60` tracks (up to 3 refill attempts)
- Picks a fresh answer (not recently used, not already used as an answer) and distractors (GTS)
- Picks two fresh tracks (`songA`, `songB`) not in the recent `USED_WINDOW = 60` IDs; falls back to the full pool if fewer than 2 fresh candidates remain. (SODO)
- Updates session state (used answers, recently-used window, round number)
- Returns the round payload to the client

**Game end** (`DELETE /api/games/.../game`): 
- Requires an authenticated NextAuth session (returns 401 otherwise)
- Calls `updateUserStats()` to write score/streak to Firestore
- Deletes the in-memory game session

### Collection Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/collections` | `GET` | Returns `UserStats` + evaluated `CollectionItem[]` for the logged-in user |
| `/api/collections/progress` | `POST` | Marks a badge as claimed in Firestore |

### Firestore Data Model

**`users/{uid}`**

```typescript
{
  stats: {
    totalGamesPlayed: number;
    averageScore: number;
    highestScore: number;
    currentStreak: number;
    longestStreak: number;
    gameHistory: Array<{
      gameId: string;       // "guess_the_song" | "save_one_drop_one_song"
      score: number;
      dateAchieved: string; // ISO string
      streak: number;
    }>;
  };
  claimedBadges: string[];  // array of badge IDs
  createdAt: string;
  updatedAt: string;
}
```
---

## Core Game Logic

### Artist Scopes

`ArtistScope` is a discriminated union that controls which tracks are eligible for a game session:

| Scope type | Description |
|---|---|
| `all-kpop` | No filter - any track from the K-pop genre seeds |
| `artist` | Tracks by a single artist ID |
| `group` | Tracks by a group's Spotify artist ID |
| `group+solo` | Group tracks plus tracks by listed member artist IDs (Deprecated due to Spotify developer limitations) | 
| `custom` | Tracks by an arbitrary list of artist IDs (used for multi select) |


`trackMatchesScope()` in [src/lib/games/shared/scope.ts](bias-arcade-web/src/lib/games/shared/scope.ts) evaluates whether a candidate track belongs to the active scope.

### Artist Registery

[src/lib/games/shared/artist-registery.ts](bias-arcade-web/src/lib/games/shared/artist-registry.ts) is a hardcoded list of ~50+ K-pop groups, group members, and solo artists, each with a Spotify artistID, display label, type (`"solo"` | `"group"`), and optional `family` (the group solo artists belong to) and `subunits` (additional Spotify IDs for sub-units of the group).

`resolveCustomScope(artistIds)` converts a list of Spotify IDs into `{groupNames, memberIds}` for the Spotify artist track-fetching function.

### Track Fetching and Pool Management

**All K-Pop mode** (`fetchTrackBatch`):
1. Builds a search query from seed genres enriched with two variant-seeded tokens (drawn from: `"kpop"`, `"korean"`, `"idol"`, `"comeback"`, `"boy group"`, `"girl group"`, `"new release"`) and applies a variant-seeded offset (0–799) for result variety
2. Calls the Spotify Search endpoint with the composed query
3. Falls back to the default seed genres if the initial search fails
4. Falls back to offset 0 if the offset overshoots the catalogue
5. Falls back to a broad `"kpop korean idol"` search as a last resort if still no tracks
6. Runs `prioritizeKoreanGenreTracks()` on the result set, which hits `/v1/artists` in batches of 50 to verify genres, bubbling confirmed K-pop tracks to the front

**Artist Select mode** (`fetchArtistTrackBatch`): 
1. Resolves artist names from the registery
2. Searches Spotify with `artist:"<name>"` for each artist/member, with a variant-seeded offset for variety
3. Filters out unwanted track types (kareoke, instrumental, cover, remix, live, acoustic)
4. Falls back to offset 0 if the offset overshoots the catalogue

**Session pool**:
- `MIN_POOL = 60` tracks; the round handler refills up to 3 times if below this
- `usedAnswers` (a `Set<string>`) tracks every ID that has been the correct answer - these are never reused (GTS only)
- `recentlyUsedIds` is a sliding window of the last 60 IDs used as either answers or distractors, to prevent repretition across consecutive rounds
- `dedupeTracks()` deduplicates by track ID, keeping the last seen entry

### Round cap calculation

```
roundCap = floor((poolSize / tracksPerRound) * 0.8)
```

The 0.8 safety factor ensure the game ends before complete pool exhaustion. This is only important for Artist Select game modes as there is a limitation to the artist's discography. For these game modes the cap is set at game creation based on the initial pool size.

### Guess the Song Scoring

| Event | Points |
|---|---|
| Correct answer | +100 |
| Incorrect answer | −50 |
| Streak bonus (streak ≥ 2) | +(streak − 1) × 10 |
| Reveal artist hint | −20 |
| Reveal album hint | −20 |
| Skip round | Resets streak; −(hints used × 20) |

Scores can go negative. The round results view shows a full per-round breakdown including base points, streak bonus, hint penalty, and wrong-answer penalty.

### Save One Drop One Song Scoring

| Event | Points |
|---|---|
| Select a song (either) | +5 |
| "Can't Choose" (skip) | −3 (floor 0) |

There is no correct/incorrect answer — any selection earns points. The score floor is 0.

### Badge System

Badges are defined in [src/lib/collections/badges.ts](bias-arcade-web/src/lib/collections/badges.ts) and their unlock conditions in [src/lib/collections/unlock-rules.ts](bias-arcade-web/src/lib/collections/unlock-rules.ts). 

Current badges: 

| ID | Unlock condition |
|---|---|
| `first_game` | Play at least 1 game |
| `guess_the_song` | Complete a Guess the Song game |
| `save_one_drop_one` | Complete a Save One Drop One game |
| `score_100_points` | Score ≥ 100 in a single game |
| `score_500_points` | Score ≥ 500 in a single game |
| `score_1000_points` | Score ≥ 1000 in a single game |
| `3_game_streak` | Reach a current streak of 3 |
| `5_game_streak` | Reach a current streak of 5 |
| `10_game_streak` | Reach a current streak of 10 |

Badge status is one of `"locked"` / `"unlocked"` / `"claimed"`. Claimed takes precedence over unlocked. `evaluateCollection()` derives the full collection state from `UserStats` without any additional Firestore reads.

---

## Setup and Run

### Prerquisites (Local machine run)

- Node.js 20+
- A Spotify Developer app with the redirect URI set to `http://127.0.0.1:3000/api/integrations/spotify/callback`
- A Firebase project with Authentication (Email/Password provider) and Firestore enabled
- A Firebase service account key for the Admin SDK

### Environment Variables

Create `bias-arcade-web/.env.local`:

```bash
# NextAuth
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"  # npx auth secret

# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."

# Firebase Admin (server-side)
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# Spotify
SPOTIFY_CLIENT_ID="..."
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/api/integrations/spotify/callback"
```

### Install and Run

```bash
cd bias-arcade-web
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Do **not** use `localhost:3000` —  Spotify tokens may not be set correctly if you initiate requests from `localhost`.

### Other Scripts

```bash
npm run build    # Production build
npm run start    # Start the production server
npm run lint     # Run ESLint
npm test         # Run Jest tests
```

---

## Deployment

The app is deployed on [Vercel](https://vercel.com) and is live at the production URL. It can also be self-hosted on any platform that supports Next.js (AWS, Railway, etc.).

**Things to configure before deploying to a new environment:**

1. Set all environment variables from `.env.local` in the hosting platform's secrets manager

2. Update `NEXTAUTH_URL` to the production domain

3. Update `SPOTIFY_REDIRECT_URI` to the production callback URL and add it to the Spotify Developer Dashboard

4. Set `NODE_ENV=production` — the middleware localhost redirect is disabled in production, and Spotify token cookies are set with `secure: true`

5. The in-memory game session store (`globalThis` Map) does **not** persist across server restarts or scale across multiple instances. In a multi-instance deployment, sessions will be lost on restart and requests hitting a different instance will return 404. See [Known Limitations](#known-limitations-and-next-improvements).

--- 

## Testing Coverage

Tests live in `bias-arcade-web/src/__tests__/` and run with Jest 30. The test environment is `node` (configured in [jest.config.js](bias-arcade-web/jest.config.js) vias `next/jest`).

| File | Module under test | What is covered |
|---|---|---|
| `evaluate.test.ts` | `lib/collections/evaluate.ts` | Collection evaluation — all locked, unlock when rule met, claimed state, claimed > unlocked precedence |
| `helpers.test.ts` | `lib/games/guess-the-song/helpers.ts` | `dedupeTracks` (empty, no dups, dups keep last); `shuffle` (preserves elements, doesn't mutate, returns new ref) |
| `round-cap.test.ts` | `lib/games/shared/round-cap.ts` | `computeRoundCap` — minimum of 1, zero pool, safety factor, flooring, scaling |
| `spotify-client.test.ts` | `lib/spotify/client.ts` | `getSpotifyAccessToken` — happy path, correct endpoint, cookie forwarding, missing token, 401 reauth, 500 error, network failure; `spotifyFetch` — relative URL prepend, absolute URL passthrough, Bearer header, header merging |
| `spotify-status.test.ts` | `lib/spotify/status.ts` | `getSpotifyConnectionStatus` — connected via refresh token (no API call), not connected (no tokens), connected via access token (200), not connected (non-ok), prefers refresh token, correct Bearer header |
| `unlock-rules.test.ts` | `lib/collections/unlock-rules.ts` | Every unlock rule: first_game, guess_the_song, score thresholds (100/500/1000), streak thresholds (3/5/10), boundary conditions |
| `utility-functions.test.ts` | `lib/games/shared/utility-functions.ts` | `isUnwantedTrack` (karaoke, instrumental, cover, remix, live, acoustic); `sanitizeSeedGenres` (normalization, filtering, fallback, deduplication, trimming); `isInvalidLimitError` (case-insensitive); `getRetryAfterSeconds` (no header, valid, non-numeric, zero/negative) |

### Running Tests

```bash
cd bias-arcade-web
npm test
```

### Coverage Gaps

- No tests for API Route Handlers (game session creation, round generation, Spotify OAuth flow)
- No tests for React components or client-side game logic
- No integration tests against Firestore or the Spotify API
- No end-to-end tests

---

## Known Limitations and Next Improvements

### In-Memory Session Store

Game sessions are held in a `globalThis` Map on the server process. This means:
- Sessions are lost on every server restart or deployment
- The app cannot scale horizontally - a load balancer routing a round request to a different instance will return 404
- In development, Next.js hot reload can silently clear sessions.

**Next Step**: Migrate to a persistant, shared session store keyed by `gameId`.

### Spotify Requires Premium

The Spotify Web Playback SDK and the `/v1/me/player/play` endpoint both require a Spotify Premium account. Free users will connect Spotify successfully but will see an authentication or account error when the game tries to play audio. Unfortunately at this time there is no improvements that can be done more than clearly stating the premium subscription requirement. 

### No Route-Level Auth Guards

There are no server-side redirects that enforce authentication on UI pages. A logged-out user navigating directly to `/game/guess-the-song` will reach the page and only encounter an error when they try to start a game. 

**Next Step**: Incorporate a proxy (middleware is deprecated) to redirect unauthenticated requests for `/games/*`, `/collection', `/profile` to `/login`.

### Badge Images Are Placeholder

All badges in [src/lib/collections/badges.ts](bias-arcade-web/src/lib/collections/badges.ts) have `imageUrl: ""`. The collection page renders empty image slots.

**Next step**: Create badge artwork and populate the `imageUrl` fields (or store URLs in a Firestore config collection to allow updating without a code deploy).

### Streak Semantics Are Ambiguous

The `currentStreak` in `UserStats` is set directly from the streak value sent by the client at game end. There is no server-side validation of the streak count, and there is no distinction between a "game-level" streak (consecutive correct rounds within a single game) and a "session-level" streak (consecutive games played). Currently both Guess the Song and SODO send different streak interpretations to the same field.

**Related bug**: Because only the end-of-game streak value is sent, a player's highest streak within a game is lost if the game continues after that peak.

**Next step**: Clarify the streak definition, track and send an additional `highestStreak` value along with `currentStreak`, and enforce it server-side.

### No Pagination on Game History

`UserStats.gameHistory` is an unbounded array appended to on every game completion. As a user plays more games, the Firestore document grows indefinitely.

**Next step**: Cap the in-document history (e.g., last 100 games) and move older records to a sub-collection if full history is needed.

### Track Filter Patterns Are Basic

`UNWANTED_TRACK_PATTERNS` in [src/lib/games/shared/types.ts](bias-arcade-web/src/lib/games/shared/types.ts) filters karaoke, instrumental, cover, remix, live, and acoustic tracks by name substring. This is fragile — it will miss non-English variants and may over-filter legitimate tracks.

**Next step**: Cross-reference against the `available_markets` field and consider using the Spotify track's `is_playable` flag as a primary filter, using name-based filtering as a secondary heuristic.

### Artist Registry Is Manually Maintained

The artist registry is a large hardcoded TypeScript file (~700 lines). Adding a new artist or correcting a Spotify ID requires a code change and deployment.

**Next step**: Move the registry to a Firestore collection or a JSON config file that can be updated independently of code.


## Future Development Plans

### Game Hub Additions

- Guess the Song by ______ (Into, Outro, Bridge, Chorus): Attempt to utilize the startMs to filter track snippets to certain parts of songs.
- Save One Drop 3: Instead of just dropping one song users have to drop 3 from selections.
- Additional Save one drop X song(s) versions: These could vary by company filters, generations, debut songs, latest releases, ect...

### Collection Additions

- Add more badges to collect
- Implement a Photocard collection: While users earn points they earn the ability to recieve a random photocard that will be added to their digital collection. 

### Other 

- Properly design a UI that suits the atmosphere of the application
- Add accessibilty features
- Provide opportunity for artist additions for Artist Select game modes.
- Implement daily challenge: Randomly select a game and game mode that will rotate everyday. (Examples: GTS - Artist Select - Ateez, SODO - Artist Select - Shinee + Got7)