import { NextRequest } from "next/server";

type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
};

function isAbsoluteUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
}

// Fetches a valid Spotify access token by calling the server-side refresh endpoint,
// forwarding the caller's cookies so the endpoint can read the stored refresh token.
export async function getSpotifyAccessToken(request: NextRequest): Promise<string> {
    const baseUrl = request.nextUrl.origin;
    const refreshUrl = `${baseUrl}/api/integrations/spotify/refresh`;
    let response: Response;

    try {
        response = await fetch(refreshUrl, {
            method: "POST",
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
            cache: "no-store",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to reach Spotify refresh endpoint: ${message}`);
    }

    if (!response.ok) {
        let errorData: { error?: string; code?: string } | null = null;

        try {
            errorData = await response.json();
        } catch {
            errorData = null;
        }

        if (response.status === 401 && errorData?.code === "SPOTIFY_REAUTH_REQUIRED") {
            throw new Error("Spotify re-authorization required");
        }

        throw new Error(
            `Failed to refresh Spotify token: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
    }
    const data: Partial<SpotifyTokenResponse> = await response.json();
    if (!data.access_token) {
        throw new Error("Failed to refresh Spotify token: refresh response did not include access_token");
    }
    return data.access_token;
}

// Convenience wrapper that attaches a fresh Bearer token to any Spotify API request.
// Pass a relative path (e.g. "/me") or a full URL; both are handled.
export async function spotifyFetch(request: NextRequest, url: string, init: RequestInit = {}): Promise<Response> {
    const accessToken = await getSpotifyAccessToken(request);
    const spotifyApiUrl = isAbsoluteUrl(url) ? url : `https://api.spotify.com/v1${url}`;
    return fetch(spotifyApiUrl, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
    });
}