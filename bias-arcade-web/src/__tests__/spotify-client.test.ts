import { getSpotifyAccessToken, spotifyFetch } from '@/lib/spotify/client';
import { NextRequest } from 'next/server';

const mockRequest = (options: { origin?: string; cookie?: string } = {}) =>
    ({
        nextUrl: { origin: options.origin ?? 'http://localhost:3000' },
        headers: { get: (key: string) => (key === 'cookie' ? (options.cookie ?? '') : null) },
    }) as unknown as NextRequest;

const makeJsonResponse = (body: unknown, status = 200): Response => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
    clone: () => makeJsonResponse(body, status),
    text: () => Promise.resolve(JSON.stringify(body)),
    headers: { get: () => null },
} as unknown as Response);

describe('getSpotifyAccessToken', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('returns the access token on a successful refresh', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({ access_token: 'tok_abc123' }));
        await expect(getSpotifyAccessToken(mockRequest())).resolves.toBe('tok_abc123');
    });

    it('calls the refresh endpoint on the correct origin', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({ access_token: 'tok' }));
        await getSpotifyAccessToken(mockRequest({ origin: 'https://example.com' }));
        expect(fetchSpy).toHaveBeenCalledWith(
            'https://example.com/api/integrations/spotify/refresh',
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('forwards the request cookie to the refresh endpoint', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({ access_token: 'tok' }));
        await getSpotifyAccessToken(mockRequest({ cookie: 'session=abc' }));
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ headers: expect.objectContaining({ cookie: 'session=abc' }) })
        );
    });

    it('throws when the refresh response contains no access_token', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({}));
        await expect(getSpotifyAccessToken(mockRequest())).rejects.toThrow(
            'refresh response did not include access_token'
        );
    });

    it('throws "re-authorization required" on 401 with SPOTIFY_REAUTH_REQUIRED', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({ code: 'SPOTIFY_REAUTH_REQUIRED' }, 401));
        await expect(getSpotifyAccessToken(mockRequest())).rejects.toThrow(
            'Spotify re-authorization required'
        );
    });

    it('throws with status info on other non-ok responses', async () => {
        fetchSpy.mockResolvedValueOnce(makeJsonResponse({ error: 'server_error' }, 500));
        await expect(getSpotifyAccessToken(mockRequest())).rejects.toThrow(
            'Failed to refresh Spotify token: 500'
        );
    });

    it('throws a network error message when fetch itself fails', async () => {
        fetchSpy.mockRejectedValueOnce(new Error('Network down'));
        await expect(getSpotifyAccessToken(mockRequest())).rejects.toThrow(
            'Failed to reach Spotify refresh endpoint: Network down'
        );
    });
});

describe('spotifyFetch', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        fetchSpy = jest.spyOn(global, 'fetch');
        // First call is always the token refresh; second is the actual Spotify API call
        fetchSpy
            .mockResolvedValueOnce(makeJsonResponse({ access_token: 'test_token' }))
            .mockResolvedValueOnce(makeJsonResponse({ id: 'user123' }));
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    it('prepends the Spotify base URL for relative paths', async () => {
        await spotifyFetch(mockRequest(), '/me');
        expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/me', expect.anything());
    });

    it('uses absolute URLs as-is', async () => {
        await spotifyFetch(mockRequest(), 'https://api.spotify.com/v1/me');
        expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://api.spotify.com/v1/me', expect.anything());
    });

    it('adds a Bearer Authorization header using the fetched token', async () => {
        await spotifyFetch(mockRequest(), '/me');
        expect(fetchSpy).toHaveBeenNthCalledWith(
            2,
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer test_token' }),
            })
        );
    });

    it('merges caller-provided headers with the auth header', async () => {
        await spotifyFetch(mockRequest(), '/me', { headers: { 'X-Custom': 'yes' } });
        expect(fetchSpy).toHaveBeenNthCalledWith(
            2,
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer test_token',
                    'X-Custom': 'yes',
                }),
            })
        );
    });
});
