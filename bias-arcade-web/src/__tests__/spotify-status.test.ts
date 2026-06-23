import { getSpotifyConnectionStatus } from '@/lib/spotify/status';

const makeCookieStore = (cookies: Record<string, string>) => ({
    get: (name: string) => (cookies[name] !== undefined ? { value: cookies[name] } : undefined),
});

describe('getSpotifyConnectionStatus', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('returns connected via refresh_token without calling the Spotify API', async () => {
        const store = makeCookieStore({ spotify_refresh_token: 'rtoken' });
        const result = await getSpotifyConnectionStatus(store);
        expect(result).toEqual({ connected: true, source: 'refresh_token' });
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('returns not connected when both tokens are absent', async () => {
        const store = makeCookieStore({});
        const result = await getSpotifyConnectionStatus(store);
        expect(result).toEqual({ connected: false, source: 'none' });
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('returns connected via access_token when /v1/me responds 200', async () => {
        fetchSpy.mockResolvedValueOnce({ ok: true } as Response);
        const store = makeCookieStore({ spotify_access_token: 'atoken' });
        const result = await getSpotifyConnectionStatus(store);
        expect(result).toEqual({ connected: true, source: 'access_token' });
    });

    it('returns not connected when /v1/me responds with a non-ok status', async () => {
        fetchSpy.mockResolvedValueOnce({ ok: false } as Response);
        const store = makeCookieStore({ spotify_access_token: 'expired_token' });
        const result = await getSpotifyConnectionStatus(store);
        expect(result).toEqual({ connected: false, source: 'none' });
    });

    it('prefers refresh_token and skips the API call when both tokens exist', async () => {
        const store = makeCookieStore({
            spotify_refresh_token: 'rtoken',
            spotify_access_token: 'atoken',
        });
        const result = await getSpotifyConnectionStatus(store);
        expect(result).toEqual({ connected: true, source: 'refresh_token' });
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('sends the access_token as a Bearer header to /v1/me', async () => {
        fetchSpy.mockResolvedValueOnce({ ok: true } as Response);
        const store = makeCookieStore({ spotify_access_token: 'my_access_token' });
        await getSpotifyConnectionStatus(store);
        expect(fetchSpy).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/me',
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer my_access_token' }),
            })
        );
    });
});
