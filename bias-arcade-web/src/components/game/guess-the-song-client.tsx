"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
	SpotifyPlaybackProvider,
	useSpotifyPlayback,
} from "@/features/spotify/SpotifyPlaybackProvider";

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

	const [tracks, setTracks] = useState<RoundTrack[]>([]);
	const [answerTrackId, setAnswerTrackId] = useState<string | null>(null);
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
	const [isLoadingRound, setIsLoadingRound] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const answerTrack = useMemo(
		() => tracks.find((track) => track.id === answerTrackId) ?? null,
		[tracks, answerTrackId]
	);

	const options = useMemo(() => shuffle(tracks.map((track) => track.name)), [tracks]);

	const hasAnswered = selectedTrackId !== null;
	const isCorrect = hasAnswered && selectedTrackId === answerTrackId;

	async function loadRound() {
		setIsLoadingRound(true);
		setErrorMessage(null);
		setSelectedTrackId(null);

		try {
			const response = await fetch("/api/games/guess-the-song/round?limit=4", {
				cache: "no-store",
			});

			if (!response.ok) {
				const body = await response.json().catch(() => null);
				throw new Error(body?.error ?? "Failed to load round");
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
	}

	useEffect(() => {
		void loadRound();
	}, []);

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<section className={styles.header}>
					<div className={styles.headerRow}>
						<h1>Guess the Song</h1>
						<Link href="/games" className={styles.backLink}>
							← Back to Games
						</Link>
					</div>
					<p>Listen to the short clip and pick the correct song title.</p>
				</section>

				<section className={styles.controls}>
					<button type="button" onClick={loadRound} disabled={isLoadingRound}>
						{isLoadingRound ? "Loading Round..." : "New Round"}
					</button>
					<button
						type="button"
						onClick={handlePlaySnippet}
						disabled={!isReady || !answerTrack || isPlaying || isLoadingRound}
					>
						{isPlaying ? "Playing..." : "Play Snippet"}
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
								disabled={!answerTrack || hasAnswered}
								data-selected={isSelected}
							>
								{trackName}
							</button>
						);
					})}
				</section>

				{hasAnswered && answerTrack ? (
					<p className={styles.result}>
						{isCorrect ? "Correct!" : "Not quite."} The answer is <strong>{answerTrack.name}</strong>{" "}
						by {answerTrack.artists.join(", ")}.
					</p>
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
