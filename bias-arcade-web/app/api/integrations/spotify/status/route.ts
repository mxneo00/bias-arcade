import { NextRequest, NextResponse } from 'next/server';

import { getSpotifyConnectionStatus } from '@/lib/spotify/status';

export async function GET(request: NextRequest) {
    const status = await getSpotifyConnectionStatus(request.cookies);

    return NextResponse.json({
        connected: status.connected,
        source: status.source,
    });
}
