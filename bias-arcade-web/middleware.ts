import { NextRequest, NextResponse } from 'next/server';

// Spotify OAuth cookies are scoped to 127.0.0.1, so all dev traffic must use this host.
const CANONICAL_DEV_HOST = '127.0.0.1:3000';

function shouldRedirectToCanonicalHost(request: NextRequest): boolean {
    if (process.env.NODE_ENV !== 'development') {
        return false;
    }

    const hostHeader = request.headers.get('host');

    if (!hostHeader) {
        return false;
    }

    // Redirect any localhost requests to the canonical dev host.
    return hostHeader === 'localhost:3000' || hostHeader === 'localhost';
}

export function middleware(request: NextRequest) {
    if (!shouldRedirectToCanonicalHost(request)) {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    const [hostname, port] = CANONICAL_DEV_HOST.split(':');

    url.hostname = hostname;
    url.port = port;
    url.protocol = 'http:';

    // 308 preserves the HTTP method on redirect.
    return NextResponse.redirect(url, 308);
}

export const config = {
    // Apply middleware to all routes except static assets and API routes.
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
