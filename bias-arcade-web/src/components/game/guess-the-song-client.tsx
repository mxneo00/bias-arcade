"use client";

import Link from "next/link";
import { useState } from "react";

import { useSpotifyPlayback } from "@/features/spotify/SpotifyPlaybackProvider";
import { SiteHeader } from "@/components/layout/site-header";
import { VolumeControl } from "@/components/game/volume-slider";
import type {
	CreateGameResponse,
	RoundPayload as RoundResponse,
	RoundTrack,
} from "@/lib/games/guess-the-song/types";
import { ArtistModeSelector } from "@/components/game/artist-mode-selector";
import { ArtistScope } from "@/lib/games/shared/scope";

import styles from "./page.module.css";

function GuessTheSongContent() {
	const { 
		isReady, 
		error: playbackError, 
		player, 
		playSnippet, 
		pauseSnippet, 
		isSnippetPlaying, 
		activeTrackUri 
	} = useSpotifyPlayback();
	const pointsPerCorrectAnswer = 100;
	const incorrectPenalty = 50;
	const HINT_COST = 20;

	const [gameId, setGameId] = useState<string | null>(null);

	const [options, setOptions] = useState<RoundTrack[]>([]);
	const [answerTrack, setAnswerTrack] = useState<RoundTrack | null>(null);
	const [answerTrackId, setAnswerTrackId] = useState<string | null>(null);
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
	const [isLoadingRound, setIsLoadingRound] = useState(false);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [requireSpotifyReconnect, setRequireSpotifyReconnect] = useState(false);
	const [view, setView] = useState<"setup" | "in-game" | "results">("setup");
	const [roundNumber, setRoundNumber] = useState(1);
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [didSkipRound, setDidSkipRound] = useState(false);

	const [lastRoundBreakdown, setLastRoundBreakdown] = useState<{
		wasCorrect: boolean;
		wasSkipped: boolean;
		basePoints: number;
		streakBonus: number;
		streakCount: number;
		total: number;
		hintPenalty?: number;
		incorrectPenalty?: number;
	} | null>(null);

	const [selectedScope, setSelectedScope] = useState<ArtistScope | null>(null);
	const [roundCap, setRoundCap] = useState<number>(0);
	const [showModeSelector, setShowModeSelector] = useState(false);
	const [gameMode, setGameMode] = useState<"all-kpop" | "artist-select">("all-kpop");
	const [hintsUsed, setHintsUsed] = useState<{ artist: boolean; album: boolean }>({ artist: false, album: false });

	const hasAnswered = selectedTrackId !== null;
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
		setRequireSpotifyReconnect(false);
		setSelectedTrackId(null);
		setHintsUsed({ artist: false, album: false });
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
			setRoundNumber(data.roundNumber);
			setOptions(data.options);
			setAnswerTrack(data.answer);
			setAnswerTrackId(data.answer.id);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to load round";

			if (message === "Spotify re-authorization required") {
				setRequireSpotifyReconnect(true);
			}

			setErrorMessage(message);
			setOptions([]);
			setAnswerTrack(null);
			setAnswerTrackId(null);
			setView("setup");
		} finally {
			setIsLoadingRound(false);
		}
	}

	async function handleSnippetButtonClick() {
		if (!answerTrack || !isReady) {
			return;
		}

		setErrorMessage(null);

		try {
			if (isSnippetPlaying && activeTrackUri === answerTrack.uri) {
				await pauseSnippet();
				return;
			}

			const snippetLength = 8000;
			const maxStart = Math.max(0, answerTrack.durationMs - snippetLength);
			const startMs = maxStart === 0 ? 0 : Math.floor(Math.random() * maxStart);
			await playSnippet(answerTrack.uri, startMs, snippetLength);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to play snippet";
			setErrorMessage(message);
		}
	}

	function handleGuess(trackId: string) {
		if (hasAnswered) {
			return;
		}

		setSelectedTrackId(trackId);

		const isCorrect = trackId === answerTrackId;
		const newStreak = isCorrect ? streak + 1 : 0;
		const base = isCorrect ? pointsPerCorrectAnswer : 0;
		const streakBonus = newStreak >= 2 ? (newStreak - 1) * 10 : 0;
		const hintPenalty = (hintsUsed.artist ? HINT_COST : 0) + (hintsUsed.album ? HINT_COST : 0);

		if (isCorrect) {
			setScore((currentScore) => currentScore + base + streakBonus);
			setStreak(newStreak);
		} else {
			setScore((currentScore) => currentScore - incorrectPenalty);
			setStreak(0);
		}

		const wrongPenalty = isCorrect ? 0 : incorrectPenalty;
		setLastRoundBreakdown({
			wasCorrect: isCorrect,
			wasSkipped: false,
			basePoints: base,
			streakBonus,
			streakCount: newStreak,
			hintPenalty,
			incorrectPenalty: wrongPenalty,
			total: base + streakBonus - hintPenalty - wrongPenalty,
		});

		setView("results");
	}

	async function handleStartGame(scope: ArtistScope) {
		setShowModeSelector(false);
		setSelectedScope(scope);
		setScore(0);
		setStreak(0);
		setSelectedTrackId(null);
		setDidSkipRound(false);
		setLastRoundBreakdown(null);

		try{
			const response = await fetch("/api/games/guess-the-song/game", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ optionsCount: 4, scope }),
				cache: "no-store",
			});

			if (!response.ok) {
				const body = (await response.json().catch(() => null)) as { error?: string } | null;
				throw new Error(body?.error ?? "Failed to start game session");
			}

			const data = (await response.json()) as CreateGameResponse & { roundCap?: number };
			setRoundCap(data.roundCap ?? 0);
			setGameId(data.gameId);
			setView("in-game");
			await loadRound(data.gameId);
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

		const hintPenalty = (hintsUsed.artist ? HINT_COST : 0) + (hintsUsed.album ? HINT_COST : 0);
		
		setStreak(0);
		setHintsUsed({ artist: false, album: false });
		setDidSkipRound(true);
		setLastRoundBreakdown({
			wasCorrect: false,
			wasSkipped: true,
			basePoints: 0,
			streakBonus: 0,
			streakCount: 0,
			hintPenalty: hintPenalty,
			total: -hintPenalty,
		});
		setView("results");
	}

	function handleUseHint(type: "artist" | "album") {
		if (hintsUsed[type] || hasAnswered || didSkipRound || !answerTrack) {
			return;
		}

		setHintsUsed((prev) => ({ ...prev, [type]: true }));
		setScore((currentScore) => currentScore - HINT_COST);
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

	async function handleEndGame() {
		if (gameId) {
			void fetch(`/api/games/guess-the-song/game?gameId=${encodeURIComponent(gameId)}`, {
				method: "DELETE",
				cache: "no-store",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					score,
					streak,
				}),
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
							<p>Choose your mode and start the game when ready.</p>
						</div>
						<div className={styles.setupControls}>
							<label className={styles.modeSelector} htmlFor="game-mode">
								<span>Mode</span>
								<select
									id="game-mode"
									value={gameMode}
									onChange={(e) => setGameMode(e.target.value as "all-kpop" | "artist-select")}
								>
									<option value="all-kpop">All K-Pop</option>
									<option value="artist-select">Artist Select</option>
								</select>
							</label>
							<button type="button" onClick={() => {
								if (gameMode === "all-kpop") {
									void handleStartGame({ type: "all-kpop" });
								} else {
									setShowModeSelector(true);
								}
							}} className={styles.primaryButton}>
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
				) : null}

				{view === "in-game" ? (
					<section className={styles.panel}>
						<div className={styles.topBar}>
							<div className={styles.statItem}>
								<span>Round</span>
								<strong>{roundCap > 0 ? `${roundNumber} / ${roundCap}` : roundNumber}</strong>
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
							<button 
								type="button" 
								onClick={() => loadRound()} 
								disabled={isLoadingRound}
							>
								{isLoadingRound ? "Loading Round..." : "Refresh Round"}
							</button>
							<button
								type="button"
								onClick={handleSnippetButtonClick}
								disabled={!isReady || !answerTrack || isLoadingRound}
							>
								{isSnippetPlaying && activeTrackUri === answerTrack?.uri ? "Pause Snippet" : "Play Snippet"}
							</button>
							<button 
								type="button" 
								onClick={handleGoToResults} 
								disabled={!canContinueToResults}
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
							<button
								type="button"
								onClick={() => handleUseHint("artist")}
								disabled={hintsUsed.artist || hasAnswered || didSkipRound || !answerTrack}
							>
								{hintsUsed.artist
									? `Artist: ${answerTrack?.artists.join(", ")}`
									: `Reveal Artist (−${HINT_COST} pts)`}
							</button>
							<button
								type="button"
								onClick={() => handleUseHint("album")}
								disabled={hintsUsed.album || hasAnswered || didSkipRound || !answerTrack}
							>
								{hintsUsed.album
									? `Album: ${answerTrack?.albumName ?? "Unknown"}`
									: `Reveal Album (−${HINT_COST} pts)`}
							</button>
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
							{lastRoundBreakdown ? (
								<>
									<ul>
										<li className={styles.breakdownRow}>
											<span>Base points</span>
											<span>{lastRoundBreakdown.wasSkipped ? "Skipped" : lastRoundBreakdown.wasCorrect ? `+${lastRoundBreakdown.basePoints}` : "Incorrect"}</span>
										</li>
										<li className={styles.breakdownRow}>
											<span>Streak bonus{lastRoundBreakdown.streakCount >= 2 ? ` (×${lastRoundBreakdown.streakCount})` : ""}</span>
											<span>{lastRoundBreakdown.streakBonus > 0 ? `+${lastRoundBreakdown.streakBonus}` : "—"}</span>
										</li>
										{(lastRoundBreakdown.incorrectPenalty ?? 0) > 0 && (
											<li className={styles.breakdownRow}>
												<span>Wrong answer</span>
												<span>−{lastRoundBreakdown.incorrectPenalty}</span>
											</li>
										)}
										{(lastRoundBreakdown.hintPenalty ?? 0) > 0 && (
											<li className={styles.breakdownRow}>
												<span>Hint penalty</span>
												<span>−{lastRoundBreakdown.hintPenalty}</span>
											</li>
										)}
										<li className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
											<span>Round total</span>
											<span>{lastRoundBreakdown.total >= 0 ? `+${lastRoundBreakdown.total}` : `${lastRoundBreakdown.total}`}</span>
										</li>
									</ul>
									<p className={styles.runningScore}>Session score: <strong>{score}</strong></p>
								</>
							) : (
								<p>Complete a round to see your points breakdown.</p>
							)}
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

			{showModeSelector && (
				<ArtistModeSelector
					optionsCount={4}
					onSelect={(scope, cap) => {
						setRoundCap(cap ?? 0);
						void handleStartGame(scope);
					}}
					onCancel={() => setShowModeSelector(false)}
					isLoading={isLoadingRound}
				/>
			)}
		</div>
	);
}

export default function GuessTheSongClient() {
	return (
		<GuessTheSongContent />
	);
}
