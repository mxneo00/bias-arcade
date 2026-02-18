import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function base64URLEncode(str: Buffer) {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

function getSpotifyRedirectUri(request: NextRequest) {
  const configuredUri = process.env.SPOTIFY_REDIRECT_URI?.trim();

  if (configuredUri) {
    return new URL(configuredUri).toString();
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}/api/integrations/spotify/callback`;
  }

  return new URL('/api/integrations/spotify/callback', request.url).toString();
}

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getSpotifyRedirectUri(request);
  const isProduction = process.env.NODE_ENV === 'production';
  const scope = ['user-read-private', 'user-read-email'].join(' ');
  
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

  const state = base64URLEncode(crypto.randomBytes(16));

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId!);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', redirectUri!);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', codeChallenge);

  const response = NextResponse.redirect(authUrl.toString());

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