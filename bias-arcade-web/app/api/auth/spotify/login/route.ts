import { NextResponse } from 'next/server';
import crypto from 'crypto';

function base64URLEncode(str: Buffer) {
    return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
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

  response.cookies.set('spotify_code_verifier', codeVerifier, { httpOnly: true, secure: true, sameSite: 'lax' });
  response.cookies.set('spotify_auth_state', state, { httpOnly: true, secure: true, sameSite: 'lax' });

  return response;
}