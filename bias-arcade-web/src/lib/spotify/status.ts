type CookieLike = {
    value: string;
};

type CookieStoreLike = {
    get: (name: string) => CookieLike | undefined;
};

type SpotifyConnectionStatus = {
    connected: boolean;
    source: 'refresh_token' | 'access_token' | 'none';
};

export async function getSpotifyConnectionStatus(cookieStore: CookieStoreLike): Promise<SpotifyConnectionStatus> {
    const accessToken = cookieStore.get('spotify_access_token')?.value;
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

    if (refreshToken) {
        return {
            connected: true,
            source: 'refresh_token',
        };
    }

    if (!accessToken) {
        return {
            connected: false,
            source: 'none',
        };
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });

    return {
        connected: response.ok,
        source: response.ok ? 'access_token' : 'none',
    };
}
