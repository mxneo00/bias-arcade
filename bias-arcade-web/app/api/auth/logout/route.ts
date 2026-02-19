import { NextRequest, NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ success: true });

	response.cookies.delete("spotify_access_token");
	response.cookies.delete("spotify_refresh_token");
	response.cookies.delete("spotify_code_verifier");
	response.cookies.delete("spotify_auth_state");

	return response;
}

export async function GET(request: NextRequest) {
	const response = NextResponse.redirect(new URL("/", request.url));

	response.cookies.delete("spotify_access_token");
	response.cookies.delete("spotify_refresh_token");
	response.cookies.delete("spotify_code_verifier");
	response.cookies.delete("spotify_auth_state");

	return response;
}
