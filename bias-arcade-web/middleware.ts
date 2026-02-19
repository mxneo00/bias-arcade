import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_DEV_HOST = '127.0.0.1:3000';

function shouldRedirectToCanonicalHost(request: NextRequest): boolean {
    if (process.env.NODE_ENV !== 'development') {
        return false;
    }

    const hostHeader = request.headers.get('host');

    if (!hostHeader) {
        return false;
    }

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

    return NextResponse.redirect(url, 308);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
