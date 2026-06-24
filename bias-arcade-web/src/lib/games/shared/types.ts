export type SpotifyArtist = { id?: string; name: string };
export type SpotifyImage = { url: string };

export type SpotifyAlbum = { name?: string; images?: SpotifyImage[] };
export type SpotifyArtistDetails = { id: string; genres?: string[] };

export type SpotifyTrack = {
    id: string;
    name: string;
    uri: string;
    duration_ms: number;
    preview_url: string | null;
    external_urls?: { spotify?: string; };
    artists: SpotifyArtist[];
    album?: SpotifyAlbum;
};

export type SpotifyRecommendationsResponse = { tracks?: SpotifyTrack[]; };
export type SpotifySearchResponse = { tracks?: { items?: SpotifyTrack[]; }; };
export type SpotifyArtistNameResponse = { artists?: Array<{ id: string; name: string }> };
export type SpotifyArtistsResponse = { artists?: SpotifyArtistDetails[]; };

export const UNWANTED_TRACK_PATTERNS = [
    /karaoke/i,
    /instrumental/i,
    /cover/i,
    /remix/i,
    /live/i,
    /acoustic/i,
];

export const ALLOWED_SEED_GENRES = [
    "k-pop", "k-rock", "korean-pop", "korean-rock", 
    "kpop", "kpop", "korean pop", "korean rock",
    "kpop boy group", "kpop girl group", "korean idol", "korean band",
];
