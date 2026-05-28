'use client';

import { SpotifyPlaybackProvider } from '@/features/spotify/SpotifyPlaybackProvider';

export function GamesSpotifyWrapper({ children }: { children: React.ReactNode }) {
    return <SpotifyPlaybackProvider>{children}</SpotifyPlaybackProvider>;
}
