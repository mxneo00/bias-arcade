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

type RoundTrack = {
  id: string;
  name: string;
  artists: string[];
  uri: string;
  durationMs: number;
};

type RoundResponse = {
  roundNumber: number;
  answer: RoundTrack;
  options: RoundTrack[];
};

type CreateGameResponse = {
  gameId: string;
};

function GuessTheSongContent() {
	const { isReady, error: playbackError, player, playSnippet } = useSpotifyPlayback();
	const pointsPerCorrectAnswer = 100;

	const [gameId, setGameId] = useState<string | null>(null);

	const [options, setOptions] = useState<RoundTrack[]>([]);
	const [answerTrack, setAnswerTrack] = useState<RoundTrack | null>(null);
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

	const hasAnswered = selectedTrackId !== null;
	const isCorrect = hasAnswered && selectedTrackId === answerTrackId;
	const canContinueToResults = hasAnswered || didSkipRound;

	async function createGameSession() {
		const response = await fetch("/api/games/guess-the-song/game", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ optionsCount: 4 }), // optional
			cache: "no-store",
		});

		if (!response.ok) {
			const body = (await response.json().catch(() => null)) as { error?: string } | null;
			throw new Error(body?.error ?? "Failed to start game session");
		}

		const data = (await response.json()) as CreateGameResponse;
		return data.gameId;
	}

	async function loadRound(activateGameId?: string) {
		setIsLoadingRound(true);
		setErrorMessage(null);
		setRequiresSpotifyReconnect(false);
		setSelectedTrackId(null);
		setDidSkipRound(false);

		const resolvedGameId = activateGameId ?? gameId;

		if (!resolvedGameId) {
			setErrorMessage("Game session missing. Please start a new game.");
			setIsLoadingRound(false);
			return;
		}

		try {
			const response = await fetch("/api/games/guess-the-song/round", {
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

			setRoundNumber(data.roundNumber);
			setOptions(data.options);
			setAnswerTrack(data.answer);
			setAnswerTrackId(data.answer.id);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to load round";

			if (message === "Spotify re-authorization required") {
				setRequiresSpotifyReconnect(true);
			}

			setErrorMessage(message);
			setOptions([]);
			setAnswerTrack(null);
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

	function handleGuess(trackId: string) {
		if (hasAnswered) {
			return;
		}

		setSelectedTrackId(trackId);

		if (trackId === answerTrackId) {
			setScore((currentScore) => currentScore + pointsPerCorrectAnswer);
			setStreak((currentStreak) => currentStreak + 1);
		} else {
			setStreak(0);
		}

		setView("results");
	}

	async function handleStartGame() {
		setScore(0);
		setStreak(0);
		setSelectedTrackId(null);
		setDidSkipRound(false);

		try{
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
		setView("in-game");
		void loadRound();
	}

	function handleEndGame() {
		if (gameId) {
			void fetch(`/api/games/guess-the-song/${gameId}`, {
				method: "DELETE",
				cache: "no-store",
			});
		}

		setView("setup");
		setGameId(null);
		setRoundNumber(1);
		setAnswerTrack(null);
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
							<button type="button" onClick={() => loadRound()} disabled={isLoadingRound}>
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

						<VolumeControl player={player} />

						{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

						{requiresSpotifyReconnect ? (
							<Link href="/api/integrations/spotify/login" className={styles.backLink}>
								Reconnect Spotify
							</Link>
						) : null}

						<section className={styles.options}>
							{options.map((track) => {
								const isSelected = selectedTrackId === track.id;

								return (
								<button
									key={track.id}
									type="button"
									className={styles.option}
									onClick={() => handleGuess(track.id)}
									disabled={!answerTrack || hasAnswered || didSkipRound}
									data-selected={isSelected}
								>
									{track.name}
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
