import { NextRequest, NextResponse  } from "next/server";

function toCanonicalDevUrl(url: URL): URL {
    if (process.env.NODE_ENV !== 'development') {
        return url;
    }

    url.protocol = 'http:';
    url.hostname = '127.0.0.1';
    url.port = '3000';

    return url;
}

function getSpotifyRedirectUri(request: NextRequest) {
    const configuredUri = process.env.SPOTIFY_REDIRECT_URI?.trim();

    if (configuredUri) {
        return toCanonicalDevUrl(new URL(configuredUri)).toString();
    }

    const forwardedProto = request.headers.get('x-forwarded-proto');
    const forwardedHost = request.headers.get('x-forwarded-host');

    if (forwardedProto && forwardedHost) {
        return toCanonicalDevUrl(new URL('/api/integrations/spotify/callback', `${forwardedProto}://${forwardedHost}`)).toString();
    }

    return toCanonicalDevUrl(new URL('/api/integrations/spotify/callback', request.url)).toString();
}

function buildHomeRedirect(request: NextRequest): URL {
    return toCanonicalDevUrl(new URL('/', request.url));
}

export async function GET(request: NextRequest) {
    const isProduction = process.env.NODE_ENV === "production";
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

    if (!storedState) {
        console.error('Missing auth state cookie in Spotify callback');
        return NextResponse.json(
            { error: 'Missing auth state cookie in Spotify callback. Ensure you start from /api/integrations/spotify/login on the same host.' },
            { status: 400 }
        );
    }

    // Validate that the state parameter matches what we set during the login step.
    if (state !== storedState) {
        console.error('State mismatch in Spotify callback');
        return NextResponse.json({ error: 'State mismatch in Spotify callback' }, { status: 400 });
    }
    if (!codeVerifier) {
        console.error('Missing code verifier in Spotify callback');
        return NextResponse.json({ error: 'Missing code verifier in Spotify callback' }, { status: 400 });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const redirectUri = getSpotifyRedirectUri(request);

    // Exchange the authorization code for access and refresh tokens using PKCE.
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

    // Store tokens in httpOnly cookies and clean up the one-time PKCE cookies.
    const response = NextResponse.redirect(buildHomeRedirect(request), 302);
    response.cookies.set('spotify_access_token', tokenData.access_token, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });

    if (tokenData.refresh_token) {
        response.cookies.set('spotify_refresh_token', tokenData.refresh_token, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/' });
    } else {
        response.cookies.delete('spotify_refresh_token');
    }

    response.cookies.delete('spotify_code_verifier');
    response.cookies.delete('spotify_auth_state');
    return response;
}