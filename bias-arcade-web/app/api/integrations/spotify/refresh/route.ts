import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
	const accessToken = request.cookies.get("spotify_access_token")?.value;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const isProduction = process.env.NODE_ENV === "production";

	if (!refreshToken) {
		if (accessToken) {
			return NextResponse.json({
				access_token: accessToken,
				token_type: "Bearer",
				source: "access_token_cookie",
			});
		}

		return NextResponse.json(
			{
				error: "Spotify connection expired. Please reconnect your Spotify account.",
				code: "SPOTIFY_REAUTH_REQUIRED",
			},
			{ status: 401 }
		);
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
		const isRevokedRefreshToken =
			tokenData?.error === "invalid_grant" &&
			typeof tokenData?.error_description === "string" &&
			tokenData.error_description.toLowerCase().includes("revoked");

		if (isRevokedRefreshToken) {
			if (accessToken) {
				const response = NextResponse.json({
					access_token: accessToken,
					token_type: "Bearer",
					source: "access_token_cookie_fallback",
					error: "Spotify refresh token is invalid. Please reconnect your Spotify account.",
					code: "SPOTIFY_REAUTH_RECOMMENDED",
				});

				response.cookies.delete("spotify_refresh_token");
				return response;
			}

			const response = NextResponse.json(
				{
					error: "Spotify connection expired. Please reconnect your Spotify account.",
					code: "SPOTIFY_REAUTH_REQUIRED",
				},
				{ status: 401 }
			);

			response.cookies.delete("spotify_access_token");
			response.cookies.delete("spotify_refresh_token");

			return response;
		}

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
			path: "/",
		});
	}

	if (tokenData.refresh_token) {
		response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax",
			path: "/",
		});
	}

	return response;
}
