export type ArtistScope = 
    | { type: "all-kpop" }
    | { type: "artist"; artistId: string, label: string }
    | { type: "group"; artistId: string, label: string }
    | { type: "group+solo"; artistId: string, label: string, memberArtistIds: string[] };

export function trackMatchesScope(
    track: { artistIds: string[] },
    scope: ArtistScope
): boolean {
    switch (scope.type) {
        case "all-kpop":
            return true;
        case "artist":
            return track.artistIds.includes(scope.artistId);
        case "group":
            return track.artistIds.includes(scope.artistId);
        case "group+solo":
            return track.artistIds.includes(scope.artistId) ||
                scope.memberArtistIds.some(memberId => track.artistIds.includes(memberId));
    }
}