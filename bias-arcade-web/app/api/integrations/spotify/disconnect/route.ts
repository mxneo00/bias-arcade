import { NextRequest, NextResponse } from "next/server";

function toCanonicalDevUrl(url: URL): URL {
	if (process.env.NODE_ENV !== "development") {
		return url;
	}

	url.protocol = "http:";
	url.hostname = "127.0.0.1";
	url.port = "3000";

	return url;
}

function clearSpotifyCookies(response: NextResponse) {
	response.cookies.delete("spotify_access_token");
	response.cookies.delete("spotify_refresh_token");
	response.cookies.delete("spotify_code_verifier");
	response.cookies.delete("spotify_auth_state");
}

function buildProfileRedirect(request: NextRequest) {
	return toCanonicalDevUrl(new URL("/profile", request.url));
}

export async function POST(request: NextRequest) {
	const response = NextResponse.redirect(buildProfileRedirect(request), 303);
	clearSpotifyCookies(response);
	return response;
}

export async function GET(request: NextRequest) {
	const response = NextResponse.redirect(buildProfileRedirect(request), 303);
	clearSpotifyCookies(response);
	return response;
}
