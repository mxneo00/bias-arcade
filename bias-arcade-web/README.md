# Bias Arcade Web

## Environment variables

Create `bias-arcade-web/.env.local` with:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"

SPOTIFY_CLIENT_ID="..."
SPOTIFY_REDIRECT_URI="http://localhost:3000/api/integrations/spotify/callback"
```

Generate a secret with:

```bash
npx auth secret
```

## Database setup

```bash
npx prisma migrate dev --name init-auth
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Auth flows

- App login/signup uses Auth.js credentials (`/login`, `/signup`).
- Spotify connect remains separate at `/api/integrations/spotify/login`.
