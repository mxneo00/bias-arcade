import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// PKCE helpers — encode a buffer as URL-safe base64 with no padding.
function base64URLEncode(str: Buffer) {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

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
    return toCanonicalDevUrl(new URL(`/api/integrations/spotify/callback`, `${forwardedProto}://${forwardedHost}`)).toString();
  }

  return toCanonicalDevUrl(new URL('/api/integrations/spotify/callback', request.url)).toString();
}

function shouldRedirectToCanonicalDevHost(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  return host === 'localhost' || host === 'localhost:3000';
}

export async function GET(request: NextRequest) {
  // Ensure the OAuth flow starts on the canonical dev host so cookies are consistent.
  if (shouldRedirectToCanonicalDevHost(request)) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.protocol = 'http:';
    canonicalUrl.hostname = '127.0.0.1';
    canonicalUrl.port = '3000';

    return NextResponse.redirect(canonicalUrl.toString(), 302);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getSpotifyRedirectUri(request);
  const isProduction = process.env.NODE_ENV === 'production';
  const scope = [
    'user-read-private',
    'user-read-email',
    'streaming',
    'user-modify-playback-state',
    'user-read-playback-state',
  ].join(' ');
  
  // Generate a PKCE code verifier/challenge pair for the authorization request.
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

  // Random state value used to verify the callback comes from our redirect.
  const state = base64URLEncode(crypto.randomBytes(16));

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId!);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', redirectUri!);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', codeChallenge);

  const response = NextResponse.redirect(authUrl.toString(), 302);

  // Store the verifier and state in short-lived cookies so the callback can validate them.
  response.cookies.set('spotify_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });
  response.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });

  return response;
}