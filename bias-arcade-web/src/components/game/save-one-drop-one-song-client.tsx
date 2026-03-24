"use client";

import Link from "next/link";
import { useState } from "react";

import {
	SpotifyPlaybackProvider,
	useSpotifyPlayback,
} from "@/features/spotify/SpotifyPlaybackProvider";
import { SiteHeader } from "@/components/layout/site-header";
import { VolumeControl } from "@/components/game/volume-slider";

import styles from "./page.module.css";

type SongA = {
    id: string;
    name: string;
    artists: string[];
    albumImageUrl: string | null;
    uri: string;
    duration_ms: number;
}

type SongB = {
    id: string;
    name: string;
    artists: string[];
    albumImageUrl: string | null;
    uri: string;
    duration_ms: number;
}

type RoundResponse = {
    roundNumber: number;
    songA: SongA;
    songB: SongB;
};

type CreateGameResponse = {
  gameId: string;
};

function SaveOneDropOneSongContent() {
    const { isReady, error: playbackError, player, playSnippet, resetPlayer } = useSpotifyPlayback();
    const pointsPerSelection = 10;
    
    const [gameId, setGameId] = useState<string | null>(null);

    const [currentPair, setCurrentPair] = useState<{ songA: SongA; songB: SongB } | null>(null);
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
    const [isLoadingRound, setIsLoadingRound] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [requireSpotifyReconnect, setRequireSpotifyReconnect] = useState(false);
    const [view, setView] = useState<"setup" | "in-game" | "results">("setup");
    const [roundNumber, setRoundNumber] = useState(0);
    const [score, setScore] = useState(0);

    const hasAnswered = selectedTrackId !== null;
    const canContinue = hasAnswered && !isLoadingRound;

    async function createGameSession() {
        const response = await fetch("/api/games/save-one-drop-one-song/game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            cache: "no-store",
        });

        if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as { error?: string };
            throw new Error(body.error || "Failed to create game session");
        }

        const data = (await response.json()) as CreateGameResponse;
        return data.gameId;
    }

    async function loadRound(activateGameId?: string) {
        setIsLoadingRound(true);
        setErrorMessage(null);
        setRequireSpotifyReconnect(false);
        setSelectedTrackId(null);

        const resolvedGameId = activateGameId ?? gameId;

        if (!resolvedGameId) {
			setErrorMessage("Game session missing. Please start a new game.");
			setIsLoadingRound(false);
			return;
		}

        try {
            const response = await fetch("/api/games/save-one-drop-one-song/round", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameId: resolvedGameId }),
                cache: "no-store",
            });

            if (!response.ok) {
				const body = await response.json().catch(() => null) as {
					error?: string;
					details?: unknown;
					code?: string;
				} | null;

				if (body?.code === "SPOTIFY_REAUTH_REQUIRED") {
					setRequireSpotifyReconnect(true);
				}

				const details = body?.details
					? typeof body.details === "string"
						? body.details
						: JSON.stringify(body.details)
					: null;

				throw new Error(details ? `${body?.error ?? "Failed to load round"}: ${details}` : body?.error ?? "Failed to load round");
			}

            const data = (await response.json()) as RoundResponse;
            setCurrentPair({ songA: data.songA, songB: data.songB });
            setView("in-game");
            setRoundNumber(data.roundNumber);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to load round";

			if (message === "Spotify re-authorization required") {
				setRequireSpotifyReconnect(true);
			}

            setErrorMessage(message);
            setCurrentPair(null);
            setView("setup");
        } finally {
            setIsLoadingRound(false);
        }
    }

    async function handlePlaySnippet(track: SongA | SongB) {
        if (!isReady || !player) {
            setErrorMessage("Spotify playback not ready. Please connect your Spotify account.");
            return;
        }
        setErrorMessage(null);
        setIsPlaying(true);

        try {
            const snippetLength = 20 * 1000; // 10 seconds
            const maxStart = Math.max(0, track.duration_ms - snippetLength);
            const startMs = maxStart === 0 ? 0 : Math.floor(Math.random() * maxStart);
            await playSnippet(track.uri, startMs, snippetLength);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to play snippet";
            setErrorMessage(message);
        } finally {
            setIsPlaying(false);
        }
    }

    function handleSelectTrack(trackId: string) {
        if (isLoadingRound) return;
        setSelectedTrackId(trackId);
        
        if (trackId === currentPair?.songA.id || trackId === currentPair?.songB.id) {
            setScore((prev) => prev + pointsPerSelection);
        } else {
            setScore((prev) => Math.max(0, prev - pointsPerSelection));
        }

        setView("results");
    }

    async function handleStartGame() {
        setScore(0);
        setSelectedTrackId(null);
        setRoundNumber(0);

        try {
            const newGameId = await createGameSession();
            setGameId(newGameId);
            setView("in-game");
            await loadRound(newGameId);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to start game";
            setErrorMessage(message);
            setView("setup");
        }
    }

    function handleGoToResults() {
        if (!canContinue) return;
        setView("results");
    }

    function handleNextRound() {
        setView("in-game");
        void loadRound();
    }

    async function handleEndGame() {
        if (gameId) {
            void fetch(`/api/games/save-one-drop-one-song/game?gameId=${encodeURIComponent(gameId)}`, {
                method: "DELETE",
                cache: "no-store",
            });
            await resetPlayer();
        }

        setView("setup");
        setCurrentPair(null);
        setGameId(null);
        setRoundNumber(0);
        setScore(0);
    }

    return (
        <div className={styles.page}>
            <SiteHeader isLoggedIn={true} />
            <main className={styles.main}>
                <section className={styles.pageHeader}>
                    <div className={styles.headerRow}>
						<h1>Save One Drop One Song</h1>
						<Link href="/games" className={styles.backLink}>
							← Back to Games
						</Link>
                    </div>
                    <p>Set up your round, listen to each clip and save one song from each pair.</p>
                </section>

                {view === "setup" ? (
                    <section className={styles.panel}>
						<div className={styles.panelHeader}>
							<h2>Game Setup</h2>
							<p>Choose your mode (coming soon) and start the game when ready.</p>
						</div>
						<div className={styles.setupControls}>
							<label className={styles.modeSelector} htmlFor="game-mode">
								<span>Mode</span>
								<select id="game-mode" disabled defaultValue="classic">
									<option value="classic">Classic (Placeholder)</option>
								</select>
							</label>
							<button type="button" onClick={handleStartGame} className={styles.primaryButton}>
								Start Game
							</button>
						</div>

                        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

                        {requireSpotifyReconnect ? (
                            <Link href="/api/integrations/spotify/login" className={styles.backLink}>
                                Reconnect Spotify
                            </Link>
                        ) : null}
					</section>
                ): null}

                {view === "in-game" ? (
                    <section className={styles.panel}>
                        <div className={`${styles.topBar} ${styles.twoColumnTopBar}`}>
                            <div className={styles.statItem}>
                                <span>Round</span>
                                <strong>{roundNumber}</strong>
                            </div>
                            <div className={styles.statItem}>
                                <span>Score</span>
                                <strong>{score}</strong>
                            </div>
                        </div>

                        <section className={styles.controls}>
                            <button 
                                type="button" 
                                onClick={() => loadRound()} 
                                disabled={isLoadingRound}
                            >
                                {isLoadingRound ? "Loading Round..." : "Refresh Round"}
                            </button>
                            <button
                                type="button"
                                onClick={handleGoToResults}
                                disabled={!canContinue}
                            >
                                View Results
                            </button>
                        </section>

                        <p className={styles.status}>
                            {playbackError
								? `Spotify: ${playbackError}`
								: isReady
									? "Spotify player is ready"
									: "Preparing Spotify player..."}
                        </p>

                        <VolumeControl player={player} />

						{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

						{requireSpotifyReconnect ? (
							<Link href="/api/integrations/spotify/login" className={styles.backLink}>
								Reconnect Spotify
							</Link>
						) : null}

                        <section className={styles.songOptions}>
                            {currentPair ? (
                                <>
                                    <section className={styles.snippetControls}>
                                        <button
                                            type="button"
                                            className={styles.snippetButton}
                                            onClick={() => {
                                                void handlePlaySnippet(currentPair.songA);
                                            }}
                                            disabled={!isReady || isPlaying || isLoadingRound}
                                        >
                                            {isPlaying ? "Playing..." : "Play Left Song"}
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.snippetButton}
                                            onClick={() => {
                                                void handlePlaySnippet(currentPair.songB);
                                            }}
                                            disabled={!isReady || isPlaying || isLoadingRound}
                                        >
                                            {isPlaying ? "Playing..." : "Play Right Song"}
                                        </button>
                                    </section>

                                    <section className={styles.songPair}>
                                        <div
                                            className={`${styles.songOption} ${selectedTrackId === currentPair.songA.id ? styles.selected : ""}`}
                                            onClick={() => handleSelectTrack(currentPair.songA.id)}
                                        >
                                            <img src={currentPair.songA.albumImageUrl ?? ""} alt={`${currentPair.songA.name} album art`} className={styles.albumArt} />
                                            <div className={styles.songInfo}>
                                                <span className={styles.songName}>{currentPair.songA.name}</span>
                                                <span className={styles.artistName}>{currentPair.songA.artists.join(", ")}</span>
                                            </div>
                                        </div>
                                        <div
                                            className={`${styles.songOption} ${selectedTrackId === currentPair.songB.id ? styles.selected : ""}`}
                                            onClick={() => handleSelectTrack(currentPair.songB.id)}
                                        >
                                            <img src={currentPair.songB.albumImageUrl ?? ""} alt={`${currentPair.songB.name} album art`} className={styles.albumArt} />
                                            <div className={styles.songInfo}>
                                                <span className={styles.songName}>{currentPair.songB.name}</span>
                                                <span className={styles.artistName}>{currentPair.songB.artists.join(", ")}</span>
                                            </div>
                                        </div>
                                    </section>
                                </>
                            ) : null}
                        </section>
                    </section>
                ): null}

                {view === "results" ? (
                    <section className={styles.panel}>
                        <div className={styles.resultsHeader}>
                            <h2>Round Results</h2>
                        </div>
                        <section className={styles.resultsSongs}>
                            <div className={styles.resultSong}>
                                <img src={currentPair?.songA.albumImageUrl ?? ""} alt={`${currentPair?.songA.name} album art`} className={styles.albumArt} />
                                <div className={styles.songInfo}>
                                    <span className={styles.songName}>{currentPair?.songA.name}</span>
                                    <span className={styles.artistName}>{currentPair?.songA.artists.join(", ")}</span>
                                    <span className={styles.resultLabel}>{selectedTrackId === currentPair?.songA.id ? "Saved" : "Dropped"}</span>
                                </div>
                            </div>
                            <div className={styles.resultSong}>
                                <img src={currentPair?.songB.albumImageUrl ?? ""} alt={`${currentPair?.songB.name} album art`} className={styles.albumArt} />
                                <div className={styles.songInfo}>
                                    <span className={styles.songName}>{currentPair?.songB.name}</span>
                                    <span className={styles.artistName}>{currentPair?.songB.artists.join(", ")}</span>
                                    <span className={styles.resultLabel}>{selectedTrackId === currentPair?.songB.id ? "Saved" : "Dropped"}</span>
                                </div>
                            </div>
                        </section>
                        <section className={styles.resultsControls}>
                            <button type="button" onClick={handleNextRound} className={styles.primaryButton}>
                                Next Round
                            </button>
                            <button type="button" onClick={handleEndGame} className={styles.secondaryButton}>
                                End Game
                            </button>
                        </section>
                    </section>
                ) : null}
            </main>            
        </div>
    );
}

export default function SaveOneDropOneSong() {
    return (
        <SpotifyPlaybackProvider>
            <SaveOneDropOneSongContent />
        </SpotifyPlaybackProvider>
    );
}