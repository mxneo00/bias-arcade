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

type CreateGameResponse = {
  gameId: string;
};

function SaveOneDropOneSongContent() {
    const { isReady, error: playbackError, player, playSnippet } = useSpotifyPlayback();
    const pointsPerSelection = 10;
    
    const [gameId, setGameId] = useState<string | null>(null);

    const [currentPair, setCurrentPair] = useState<{ songA: SpotifyApi.TrackObjectFull; songB: SpotifyApi.TrackObjectFull } | null>(null);
    const [isLoadingPair, setIsLoadingPair] = useState(false);
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
        const response = await fetch("/api/games/save-one-drop-one-song/create", {
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
            const response = await fetch(`/api/games/save-one-drop-one-song/${resolvedGameId}/next`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
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
        } catch (error) {
            console.error("Error loading round:", error);
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred while loading the round.");
        }
    }
}