const SAFETY_FACTOR = 0.8;

export function computeRoundCap(
    poolSize: number,
    tracksPerRound: number,
): number {
    return Math.max(1, Math.floor((poolSize / tracksPerRound) * SAFETY_FACTOR));
}