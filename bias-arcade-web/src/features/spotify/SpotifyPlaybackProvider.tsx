'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';

type SpotifyPlaybackContextType = {
    isReady: boolean;
    deviceId: string | null;
    error: string | null;
    player: SpotifyPlayerInstance | null;
    playSnippet: (trackURI: string, startMs: number, lengthMs: number) => Promise<void>;
    resetPlayer: () => Promise<void>;
};

type SpotifyErrorEvent = {
    message: string;
};

type SpotifyPlayerConstructor = new (options: {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
}) => SpotifyPlayerInstance;

type SpotifyPlayerInstance = {
    addListener: (
        eventName:
            | 'ready'
            | 'initialization_error'
            | 'authentication_error'
            | 'account_error'
            | 'playback_error',
        callback: (event: { device_id: string } | SpotifyErrorEvent) => void,
    ) => void;
    connect: () => Promise<boolean>;
    pause: () => Promise<void>;
    disconnect: () => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
};

type SpotifySDK = {
    Player: SpotifyPlayerConstructor;
};

const SpotifyPlaybackContext = createContext<SpotifyPlaybackContextType | null>(null);

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify?: SpotifySDK;
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
}

async function loadSpotifySDK() {
    if (window.Spotify) {
        return;
    }
    return new Promise<void>((resolve, reject) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            resolve();
        };

        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src="https://sdk.scdn.co/spotify-player.js"]',
        );

        if (existingScript) {
            existingScript.addEventListener(
                'error',
                () => reject(new Error('Failed to load Spotify SDK script')),
                { once: true },
            );
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        script.onerror = () => reject(new Error('Failed to load Spotify SDK script'));
        document.body.appendChild(script);
    });
}

async function getAccessToken(): Promise<string> {
    const response = await fetch('/api/integrations/spotify/refresh', {
        method: 'POST',
    });
    const data = (await response.json()) as {
        accessToken?: string;
        access_token?: string;
        error?: string;
        code?: string;
    };

    if (!response.ok) {
        if (response.status === 401 && data.code === 'SPOTIFY_REAUTH_REQUIRED') {
            throw new Error(data.error ?? 'Spotify connection expired. Please reconnect Spotify.');
        }

        throw new Error(data.error ?? 'Failed to refresh Spotify access token');
    }

    const token = data.access_token ?? data.accessToken;
    if (!token) {
        throw new Error('No access token returned from refresh endpoint');
    }
    return token;
}

async function transferPlaybackToDevice(deviceId: string, accessToken: string) {
    await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            device_ids: [deviceId],
            play: false,
        }),
    });
}

export function SpotifyPlaybackProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const playerRef = useRef<SpotifyPlayerInstance | null>(null);
    const tokenRef = useRef<string | null>(null);

    const initializePlayer = async () => {
        try {
            await loadSpotifySDK();
            const token = await getAccessToken();
            tokenRef.current = token;
            if (!window.Spotify) {
                throw new Error('Spotify SDK failed to load');
            }
            const player = new window.Spotify.Player({
                name: 'Bias Arcade Player',
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(tokenRef.current!);
                },
            });
            player.addListener('ready', (event) => {
                if (!('device_id' in event)) {
                    return;
                }
                const { device_id } = event;
                setDeviceId(device_id);
                setIsReady(true);
            });
            await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenRef.current}`,
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: false,
                }),
            });
            player.addListener('initialization_error', (event) => {
                if (!('message' in event)) {
                    return;
                }
                const { message } = event;
                setError(`Initialization error: ${message}`);
            });
            player.addListener('authentication_error', (event) => {
                if (!('message' in event)) {
                    return;
                }
                const { message } = event;
                setError(`Authentication error: ${message}`);
            });
            player.addListener('account_error', (event) => {
                if (!('message' in event)) {
                    return;
                }
                const { message } = event;
                setError(`Account error: ${message}`);
            });
            player.addListener('playback_error', (event) => {
                if (!('message' in event)) {
                    return;
                }
                const { message } = event;
                setError(`Playback error: ${message}`);
            });
            player.connect();
            playerRef.current = player;
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            console.error('Error initializing Spotify player:', getErrorMessage(err));
        }
    };

    useEffect(() => {
        void initializePlayer();

        return () => {
            if (playerRef.current) {
                void playerRef.current.disconnect();
                playerRef.current = null;
            }
        };
    }, []);

    const playSnippet = async (trackURI: string, startMs: number, lengthMs: number) => {
        if (!deviceId) {
            throw new Error('Spotify player is not ready');
        }
        try {
            await transferPlaybackToDevice(deviceId, tokenRef.current!);
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenRef.current}`,
                },
                body: JSON.stringify({
                    uris: [trackURI],
                    position_ms: startMs,
                }),
            });
            setTimeout(async () => {
                await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenRef.current}`,
                    },
                });
            }, lengthMs);
        } catch (err: unknown) {
            setError(`Failed to play snippet: ${getErrorMessage(err)}`);
        }
    };

    const resetPlayer = async () => {
        if (playerRef.current) {
            try{
                await playerRef.current.pause();
                playerRef.current.disconnect();
            } catch (err: unknown) {
                console.error('Error disconnecting Spotify player:', getErrorMessage(err));
            }
            playerRef.current = null;
        }
        setIsReady(false);
        setDeviceId(null);
        setError(null);

        try {
            await initializePlayer();
        } catch (err: unknown) {
            console.error('Error re-initializing Spotify player:', getErrorMessage(err));
        }
    };

    return (
        <SpotifyPlaybackContext.Provider
            value={{ isReady, deviceId, error, player: playerRef.current, playSnippet, resetPlayer }}
        >
            {children}
        </SpotifyPlaybackContext.Provider>
    );
}

export function useSpotifyPlayback() {
    const context = useContext(SpotifyPlaybackContext);
    if (!context) {
        throw new Error('useSpotifyPlayback must be used within a SpotifyPlaybackProvider');
    }
    return context;
}