import { NextRequest, NextResponse  } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error'); 

    if (error) {
        console.error('Spotify authentication error:', error);
        return NextResponse.json({ error: 'Spotify authentication failed' }, { status: 400 });
    }
    if (!code || !state) {
        console.error('Missing code or state in Spotify callback');
        return NextResponse.json({ error: 'Missing code or state in Spotify callback' }, { status: 400 });
    }

    const storedState = request.cookies.get('spotify_auth_state')?.value;
    const codeVerifier = request.cookies.get('spotify_code_verifier')?.value;

    if (state !== storedState) {
        console.error('State mismatch in Spotify callback');
        return NextResponse.json({ error: 'State mismatch in Spotify callback' }, { status: 400 });
    }
    if (!codeVerifier) {
        console.error('Missing code verifier in Spotify callback');
        return NextResponse.json({ error: 'Missing code verifier in Spotify callback' }, { status: 400 });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

    const body = new URLSearchParams();
    body.append('client_id', clientId);
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', redirectUri);
    body.append('code_verifier', codeVerifier);

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
        console.error('Failed to exchange code for token:', tokenData);
        return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('spotify_access_token', tokenData.access_token, { httpOnly: true, secure: true, sameSite: 'lax' });

    if (tokenData.refresh_token) {
        response.cookies.set('spotify_refresh_token', tokenData.refresh_token, { httpOnly: true, secure: true, sameSite: 'lax' });
    }

    response.cookies.delete('spotify_code_verifier');
    response.cookies.delete('spotify_auth_state');
    return response;
}