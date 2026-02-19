"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
	SpotifyPlaybackProvider,
	useSpotifyPlayback,
} from "@/features/spotify/SpotifyPlaybackProvider";
import { SiteHeader } from "@/components/layout/site-header";

import styles from "./page.module.css";

type RoundTrack = {
	id: string;
	name: string;
	artists: string[];
	uri: string;
	durationMs: number;
};

type RoundResponse = {
	tracks: RoundTrack[];
};

function getRandomIndex(length: number) {
	return Math.floor(Math.random() * length);
}

function shuffle(values: string[]) {
	const array = [...values];

	for (let index = array.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[array[index], array[swapIndex]] = [array[swapIndex], array[index]];
	}

	return array;
}

function GuessTheSongContent() {
	const { isReady, error: playbackError, playSnippet } = useSpotifyPlayback();
	const pointsPerCorrectAnswer = 100;

	const [tracks, setTracks] = useState<RoundTrack[]>([]);
	const [answerTrackId, setAnswerTrackId] = useState<string | null>(null);
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
	const [isLoadingRound, setIsLoadingRound] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [requiresSpotifyReconnect, setRequiresSpotifyReconnect] = useState(false);
	const [view, setView] = useState<"setup" | "in-game" | "results">("setup");
	const [roundNumber, setRoundNumber] = useState(1);
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [didSkipRound, setDidSkipRound] = useState(false);

	const answerTrack = useMemo(
		() => tracks.find((track) => track.id === answerTrackId) ?? null,
		[tracks, answerTrackId]
	);

	const options = useMemo(() => shuffle(tracks.map((track) => track.name)), [tracks]);

	const hasAnswered = selectedTrackId !== null;
	const isCorrect = hasAnswered && selectedTrackId === answerTrackId;
	const canContinueToResults = hasAnswered || didSkipRound;

	async function loadRound() {
		setIsLoadingRound(true);
		setErrorMessage(null);
		setRequiresSpotifyReconnect(false);
		setSelectedTrackId(null);
		setDidSkipRound(false);

		try {
			const response = await fetch("/api/games/guess-the-song/round?limit=4", {
				cache: "no-store",
			});

			if (!response.ok) {
				const body = await response.json().catch(() => null) as {
					error?: string;
					details?: unknown;
					code?: string;
				} | null;

				if (body?.code === "SPOTIFY_REAUTH_REQUIRED") {
					setRequiresSpotifyReconnect(true);
				}

				const details = body?.details
					? typeof body.details === "string"
						? body.details
						: JSON.stringify(body.details)
					: null;

				throw new Error(details ? `${body?.error ?? "Failed to load round"}: ${details}` : body?.error ?? "Failed to load round");
			}

			const data = (await response.json()) as RoundResponse;

			if (!data.tracks?.length) {
				throw new Error("No tracks available for a round");
			}

			setTracks(data.tracks);
			const randomTrack = data.tracks[getRandomIndex(data.tracks.length)];
			setAnswerTrackId(randomTrack.id);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to load round";

			if (message === "Spotify re-authorization required") {
				setRequiresSpotifyReconnect(true);
			}

			setErrorMessage(message);
			setTracks([]);
			setAnswerTrackId(null);
		} finally {
			setIsLoadingRound(false);
		}
	}

	async function handlePlaySnippet() {
		if (!answerTrack || !isReady) {
			return;
		}

		setIsPlaying(true);
		setErrorMessage(null);

		try {
			const snippetLength = 8000;
			const maxStart = Math.max(0, answerTrack.durationMs - snippetLength);
			const startMs = maxStart === 0 ? 0 : Math.floor(Math.random() * maxStart);

			await playSnippet(answerTrack.uri, startMs, snippetLength);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to play snippet";
			setErrorMessage(message);
		} finally {
			setIsPlaying(false);
		}
	}

	function handleGuess(trackName: string) {
		if (hasAnswered) {
			return;
		}

		const guessedTrack = tracks.find((track) => track.name === trackName);
		if (!guessedTrack) {
			return;
		}

		setSelectedTrackId(guessedTrack.id);

		if (guessedTrack.id === answerTrackId) {
			setScore((currentScore) => currentScore + pointsPerCorrectAnswer);
			setStreak((currentStreak) => currentStreak + 1);
		} else {
			setStreak(0);
		}
	}

	function handleStartGame() {
		setRoundNumber(1);
		setScore(0);
		setStreak(0);
		setView("in-game");
		void loadRound();
	}

	function handleSkipRound() {
		if (hasAnswered || isLoadingRound) {
			return;
		}

		setStreak(0);
		setDidSkipRound(true);
		setView("results");
	}

	function handleGoToResults() {
		if (!canContinueToResults) {
			return;
		}

		setView("results");
	}

	function handleNextRound() {
		setRoundNumber((currentRound) => currentRound + 1);
		setView("in-game");
		void loadRound();
	}

	function handleEndGame() {
		setView("setup");
		setRoundNumber(1);
		setTracks([]);
		setAnswerTrackId(null);
		setSelectedTrackId(null);
		setDidSkipRound(false);
	}

	return (
		<div className={styles.page}>
			<SiteHeader isLoggedIn={true} />

			<main className={styles.main}>
				<section className={styles.pageHeader}>
					<div className={styles.headerRow}>
						<h1>Guess the Song</h1>
						<Link href="/games" className={styles.backLink}>
							← Back to Games
						</Link>
					</div>
					<p>Set up your round, listen to the clip, and choose the correct song title.</p>
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
					</section>
				) : null}

				{view === "in-game" ? (
					<section className={styles.panel}>
						<div className={styles.topBar}>
							<div className={styles.statItem}>
								<span>Round</span>
								<strong>{roundNumber}</strong>
							</div>
							<div className={styles.statItem}>
								<span>Timer</span>
								<strong>--:--</strong>
							</div>
							<div className={styles.statItem}>
								<span>Score</span>
								<strong>{score}</strong>
							</div>
							<div className={styles.statItem}>
								<span>Streak</span>
								<strong>{streak}</strong>
							</div>
						</div>

						<section className={styles.controls}>
							<button type="button" onClick={loadRound} disabled={isLoadingRound}>
								{isLoadingRound ? "Loading Round..." : "Refresh Round"}
							</button>
							<button
								type="button"
								onClick={handlePlaySnippet}
								disabled={!isReady || !answerTrack || isPlaying || isLoadingRound}
							>
								{isPlaying ? "Playing..." : "Play Snippet"}
							</button>
							<button type="button" onClick={handleGoToResults} disabled={!canContinueToResults}>
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

						{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

						{requiresSpotifyReconnect ? (
							<Link href="/api/integrations/spotify/login" className={styles.backLink}>
								Reconnect Spotify
							</Link>
						) : null}

						<section className={styles.options}>
							{options.map((trackName) => {
								const track = tracks.find((value) => value.name === trackName);
								const trackId = track?.id ?? trackName;
								const isSelected = selectedTrackId === trackId;

								return (
									<button
										key={trackId}
										type="button"
										className={styles.option}
										onClick={() => handleGuess(trackName)}
										disabled={!answerTrack || hasAnswered || didSkipRound}
										data-selected={isSelected}
									>
										{trackName}
									</button>
								);
							})}
						</section>

						<section className={styles.placeholders}>
							<div className={styles.placeholderBox}>
								<h3>Hints</h3>
								<p>Hint options will be added here.</p>
							</div>
							<div className={styles.placeholderBox}>
								<h3>Skip</h3>
								<p>Use skip to move on without guessing.</p>
								<button type="button" onClick={handleSkipRound} disabled={hasAnswered || didSkipRound}>
									Skip Round
								</button>
							</div>
						</section>
					</section>
				) : null}

				{view === "results" ? (
					<section className={styles.panel}>
						<div className={styles.panelHeader}>
							<h2>Round Results</h2>
							<p>Review the correct answer, scoring details, and choose what to do next.</p>
						</div>

						<p className={styles.result}>
							{answerTrack
								? `Correct answer: ${answerTrack.name} by ${answerTrack.artists.join(", ")}.`
								: "Answer unavailable for this round."}
						</p>

						<section className={styles.pointsBreakdown}>
							<h3>Points Breakdown</h3>
							<p>Detailed points and bonus calculations will be implemented here.</p>
							<ul>
								<li>Round base points: Placeholder</li>
								<li>Time bonus: Placeholder</li>
								<li>Streak bonus: Placeholder</li>
							</ul>
						</section>

						<section className={styles.controls}>
							<button type="button" onClick={handleNextRound}>
								Next Round
							</button>
							<button type="button" onClick={handleEndGame}>
								End Game
							</button>
						</section>
					</section>
				) : null}
			</main>
		</div>
	);
}

export default function GuessTheSongClient() {
	return (
		<SpotifyPlaybackProvider>
			<GuessTheSongContent />
		</SpotifyPlaybackProvider>
	);
}
