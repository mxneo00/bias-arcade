# Changelog

All notable changes to Bias Arcade are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2026-06-29 - 2026-06-30] - Final touches for Capstone

### Added
- Settings UI for user account management
- User account APIs
- Add CHANGELOG.md

### Changed
- Update DOCUMENTATION.md
- Update Homepage Text
- Clearly state Spotify Premium requirement

### Fixed
- Latest session display on homepage
- Unlock badge display correctness
- Max Rounds Reach allows proper game ending instead of returning to setup view.
- Correct streak-based badge unlock rules

---

## [2026-06-24] — Deployment & Spotify Stability

### Added
- `vercel.json` to force Next.js framework detection on Vercel
- Spotify connection hint on homepage

### Changed
- Switched track fetching from recommendations (deprecated) to search with offset for more reliable results
- Renamed `middleware.ts` → `proxy.ts` to avoid Next.js edge middleware conflicts (deprecated)

### Fixed
- Removed no-op proxy edge middleware that caused routing issues
- Wrapped login page content in React Suspense to prevent hydration errors
- Session check and redirect now run before consuming user data

---

## [2026-06-23] — Testing Infrastructure

### Added
- Jest configuration, initial test suite, and updated dependencies

---

## [2026-06-15] — Shared Spotify Module

### Changed
- Moved Spotify types and utilities into a shared module for reuse across games

---

## [2026-06-08 – 2026-06-11] — GuessTheSong Improvements

### Added
- Hint feature in GuessTheSong
- Point penalties for incorrect guesses and for using hints
- Search and group expansion in the artist selector UI
- Multiple new K-pop group artists to the registry (including AMPERS&ONE)

### Changed
- Spotify track filter to remove unwanted/irrelevant tracks
- Track search now retries with adjusted offset when result overshoots
- Renamed Spotify reconnect state for clarity; surface reconnect errors to users

---

## [2026-05-21 – 2026-06-11] — Custom Artist Scope & Game Modes

### Added
- Artist Registery + lookup script
- Custom artist scope — play from a specific artist's discography
- Batched and parallelized artist track fetching
- Artist mode selector integrated into the game UI
- Game mode selector screen
- `&Team` group added to the artist registry
- Solo member entries for group artists; subunit/family fields in registry
- Region markers around artist family groupings
- Spotify artist lookup script for registry maintenance

### Changed
- Refactored artist registry for clearer family/subunit relationships
- Track pool uses `groupNames` and artist-name lookup for better matching
- Custom-scope fetching refined with deduplication and variant offset support
- Points breakdown shown at game end; skip option added; volume fixed

---

## [2026-04-02 – 2026-05-19] — Collections & Badges

### Added
- Collections page showing user progress
- Badge types, badge data, and unlock rules
- Collections API with badge evaluation logic
- Collections progress API with UI access guards
- Support for claiming badges; Firebase Admin used in collections API
- User stats displayed on profile (games played, score history)
- Game stats tracked and saved when a session ends

### Fixed
- GuessTheSong game link

---

## [2026-03-23] — Firebase Auth Migration

### Changed
- Replaced Prisma/SQLite authentication with Firebase Authentication

### Fixed
- SQLite datasource path resolution

---

## [2026-03-09 – 2026-03-10] — Save One Drop, One Song

### Added
- New game: **Save One Drop, One Song** — per-track snippet playback, save/drop decisions
- Game page, client UI, and round/session APIs for Save One Drop
- Spotify snippet controls and shared games wrapper component
- Refactored collection page into client components
- `Collection` link added to the site header

### Fixed
- Scoring fix: reward selection of either song in a paired result

---

## [2026-02-18 – 2026-02-19] — GuessTheSong v1

### Added
- **GuessTheSong** — first game: Spotify snippet playback, multiple-choice answer, and scoring
- Site header and game navigation
- Volume control and Spotify player exposure
- K-pop genre prioritization and improved Spotify recommendations

---

## [2026-02-17 – 2026-02-18] — Authentication & Spotify Connection

### Added
- Spotify OAuth flow and `/me` API route
- Authentication UI, API routes, and Prisma/SQLite setup
- Profile page and settings page

### Fixed
- Prisma migration and login callback

---

## [2026-02-17] — Project Kickoff

### Added
- Project scaffolding with Next.js and folder structure

---