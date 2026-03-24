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
    activateElement?: () => Promise<void>;
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

function wait(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function isDeviceAvailable(deviceId: string, accessToken: string): Promise<boolean> {
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        return false;
    }

    const payload = (await response.json().catch(() => ({}))) as {
        devices?: Array<{ id?: string }>;
    };

    return (payload.devices ?? []).some((device) => device.id === deviceId);
}

async function waitForDeviceAvailability(
    deviceId: string,
    accessToken: string,
    maxAttempts = 12,
    delayMs = 300,
): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const available = await isDeviceAvailable(deviceId, accessToken);
        if (available) {
            return;
        }

        await wait(delayMs);
    }

    throw new Error('Spotify Web Playback device did not become available in time. Open the Spotify app and keep this tab active, then try again.');
}

async function transferPlaybackToDevice(deviceId: string, accessToken: string): Promise<void> {
    await waitForDeviceAvailability(deviceId, accessToken);

    const response = await fetch('https://api.spotify.com/v1/me/player', {
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

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to transfer playback: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
    }
}

async function playTrackOnDevice(
    deviceId: string,
    accessToken: string,
    trackURI: string,
    startMs: number,
    attempts = 3,
): Promise<void> {
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                uris: [trackURI],
                position_ms: startMs,
            }),
        });

        if (playResponse.ok) {
            return;
        }

        const body = await playResponse.text().catch(() => '');
        lastError = `Spotify play request failed: ${playResponse.status} ${playResponse.statusText}${body ? ` - ${body}` : ''}`;

        if (attempt < attempts) {
            await wait(300);
        }
    }

    throw new Error(lastError ?? 'Spotify play request failed');
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
                // Ensure Spotify routes playback to this SDK device once it is actually ready.
                void transferPlaybackToDevice(device_id, tokenRef.current!).catch((err: unknown) => {
                    setError(`Failed to transfer playback: ${getErrorMessage(err)}`);
                });
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
            const connected = await player.connect();
            if (!connected) {
                throw new Error('Spotify player failed to connect. Ensure Spotify is open and this tab has audio permission.');
            }
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
            const accessToken = await getAccessToken();
            tokenRef.current = accessToken;

            if (playerRef.current?.activateElement) {
                await playerRef.current.activateElement();
            }

            try {
                await transferPlaybackToDevice(deviceId, accessToken);
            } catch (transferError) {
                // Spotify can lag publishing a newly ready Web Playback device; play retries below can still succeed.
                console.warn('Transfer playback failed, attempting direct play:', getErrorMessage(transferError));
            }

            await playTrackOnDevice(deviceId, accessToken, trackURI, startMs);

            setTimeout(async () => {
                await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }, lengthMs);
        } catch (err: unknown) {
            const message = `Failed to play snippet: ${getErrorMessage(err)}`;
            setError(message);
            throw new Error(message);
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