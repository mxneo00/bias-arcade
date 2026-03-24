# Bias Arcade Web

## Environment variables

Create `bias-arcade-web/.env.local` with:

```bash
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"

NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."

SPOTIFY_CLIENT_ID="..."
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/api/integrations/spotify/callback"
```

Generate a secret with:

```bash
npx auth secret
```

## Run locally

```bash
npm install
npm run dev
```

Open http://127.0.0.1:3000.

## Auth flows

- App login/signup uses Auth.js credentials (`/login`, `/signup`).
- Credentials are validated via Firebase Authentication.
- User profile metadata is stored in Firestore `users/{uid}`.
- Spotify connect remains separate at `/api/integrations/spotify/login`.
