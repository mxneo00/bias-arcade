import { GamesSpotifyWrapper } from '@/components/layout/games-spotify-wrapper';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    return <GamesSpotifyWrapper>{children}</GamesSpotifyWrapper>;
}
