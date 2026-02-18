import { NextRequest, NextResponse } from "next/server";

function clearSpotifyCookies(response: NextResponse) {
	response.cookies.delete("spotify_access_token");
	response.cookies.delete("spotify_refresh_token");
	response.cookies.delete("spotify_code_verifier");
	response.cookies.delete("spotify_auth_state");
}

function buildProfileRedirect(request: NextRequest) {
	return new URL("/profile", request.url);
}

export async function POST(request: NextRequest) {
	const response = NextResponse.redirect(buildProfileRedirect(request), 303);
	clearSpotifyCookies(response);
	return response;
}

export async function GET(request: NextRequest) {
	const response = NextResponse.redirect(buildProfileRedirect(request));
	clearSpotifyCookies(response);
	return response;
}
