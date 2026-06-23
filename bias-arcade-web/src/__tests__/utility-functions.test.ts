import {
    isUnwantedTrack,
    sanitizeSeedGenres,
    isInvalidLimitError,
    getRetryAfterSeconds,
} from '@/lib/games/shared/utility-functions';

describe('isUnwantedTrack', () => {
    it.each([
        ['Karaoke Version', true],
        ['Instrumental Mix', true],
        ['Cover Song', true],
        ['Club Remix', true],
        ['Live at Seoul', true],
        ['Acoustic Version', true],
    ])('flags "%s" as unwanted', (name, expected) => {
        expect(isUnwantedTrack(name)).toBe(expected);
    });

    it('allows regular track names', () => {
        expect(isUnwantedTrack('Dynamite')).toBe(false);
        expect(isUnwantedTrack('Love Scenario')).toBe(false);
        expect(isUnwantedTrack('FAKE LOVE')).toBe(false);
    });
});

describe('sanitizeSeedGenres', () => {
    it('returns valid genres normalized to lowercase', () => {
        expect(sanitizeSeedGenres(['K-POP', 'K-ROCK'], [])).toEqual(['k-pop', 'k-rock']);
    });

    it('filters out genres not in the allowed list', () => {
        expect(sanitizeSeedGenres(['pop', 'hip-hop'], ['k-pop'])).toEqual(['k-pop']);
    });

    it('falls back to the fallback list when input is all invalid', () => {
        expect(sanitizeSeedGenres(['jazz', 'blues'], ['k-pop'])).toEqual(['k-pop']);
    });

    it('returns default ["k-pop", "k-rock"] when both lists are invalid', () => {
        expect(sanitizeSeedGenres(['jazz'], ['blues'])).toEqual(['k-pop', 'k-rock']);
    });

    it('deduplicates genres', () => {
        expect(sanitizeSeedGenres(['k-pop', 'k-pop', 'k-rock'], [])).toEqual(['k-pop', 'k-rock']);
    });

    it('trims whitespace from genres', () => {
        expect(sanitizeSeedGenres(['  k-pop  ', 'k-rock'], [])).toEqual(['k-pop', 'k-rock']);
    });
});

describe('isInvalidLimitError', () => {
    it('returns true when body contains "invalid limit"', () => {
        expect(isInvalidLimitError('error: invalid limit')).toBe(true);
    });

    it('is case-insensitive', () => {
        expect(isInvalidLimitError('INVALID LIMIT value provided')).toBe(true);
    });

    it('returns false for unrelated error messages', () => {
        expect(isInvalidLimitError('rate limit exceeded')).toBe(false);
        expect(isInvalidLimitError('')).toBe(false);
    });
});

describe('getRetryAfterSeconds', () => {
    const mockResponse = (headers: Record<string, string | null>) =>
        ({ headers: { get: (key: string) => headers[key] ?? null } }) as Response;

    it('returns 60 when no retry-after header is present', () => {
        const res = mockResponse({});
        expect(getRetryAfterSeconds(res)).toBe(60);
    });

    it('returns the parsed value from the retry-after header', () => {
        const res = mockResponse({ 'retry-after': '30' });
        expect(getRetryAfterSeconds(res)).toBe(30);
    });

    it('returns 60 when retry-after is not a number', () => {
        const res = mockResponse({ 'retry-after': 'Wed, 21 Oct 2015 07:28:00 GMT' });
        expect(getRetryAfterSeconds(res)).toBe(60);
    });

    it('returns 60 when retry-after is zero or negative', () => {
        expect(getRetryAfterSeconds(mockResponse({ 'retry-after': '0' }))).toBe(60);
        expect(getRetryAfterSeconds(mockResponse({ 'retry-after': '-5' }))).toBe(60);
    });
});
