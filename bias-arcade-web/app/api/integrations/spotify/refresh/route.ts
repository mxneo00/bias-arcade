import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const isProduction = process.env.NODE_ENV === "production";

	if (!refreshToken) {
		return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
	}

	if (!clientId) {
		return NextResponse.json({ error: "Missing SPOTIFY_CLIENT_ID" }, { status: 500 });
	}

	const body = new URLSearchParams();
	body.append("grant_type", "refresh_token");
	body.append("refresh_token", refreshToken);
	body.append("client_id", clientId);

	const spotifyResponse = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: body.toString(),
	});

	const tokenData = await spotifyResponse.json();

	if (!spotifyResponse.ok) {
		return NextResponse.json(
			{ error: tokenData?.error_description ?? "Token refresh failed" },
			{ status: spotifyResponse.status }
		);
	}

	if (!tokenData.access_token) {
		return NextResponse.json({ error: "Missing access_token in Spotify response" }, { status: 502 });
	}

	const response = NextResponse.json({
		access_token: tokenData.access_token,
		expires_in: tokenData.expires_in,
		token_type: tokenData.token_type,
		scope: tokenData.scope,
	});

	if (tokenData.access_token) {
		response.cookies.set("spotify_access_token", tokenData.access_token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax",
		});
	}

	if (tokenData.refresh_token) {
		response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax",
		});
	}

	return response;
}
