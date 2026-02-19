import { NextRequest, NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify/client";

export async function PUT(request: NextRequest) {
    const { deviceId, trackUri } = await request.json();
    if (!deviceId || !trackUri) {
        return NextResponse.json({ error: "Device ID and Track URI are required" }, { status: 400 });
    }

    try {
        const url = `/me/player/play?device_id=${encodeURIComponent(deviceId)}`;
        const response = await spotifyFetch(request, url, {
            method: "PUT",
            body: JSON.stringify({
                device_ids: [deviceId],
                uris: [trackUri],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: `Spotify API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}` }, { status: response.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";

        if (message === "Spotify re-authorization required") {
            return NextResponse.json(
                {
                    error: "Spotify connection expired. Please reconnect your Spotify account.",
                    code: "SPOTIFY_REAUTH_REQUIRED",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}