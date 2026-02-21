export function createInitialMeta() {
    return {
        runsPlayed: 0,
        bestFloor: 0,
        bestTimeMs: 0
    };
}
export function collectLoot(player, item) {
    return {
        ...player,
        inventory: [...player.inventory, item]
    };
}
export function endRun(run, player, nowMs, meta) {
    const elapsedMs = Math.max(0, nowMs - run.startedAtMs);
    const summary = {
        floorReached: run.floor,
        kills: run.kills,
        lootCollected: run.lootCollected,
        elapsedMs,
        leveledTo: player.level
    };
    const bestTimeMs = run.floor >= meta.bestFloor && (meta.bestTimeMs === 0 || elapsedMs < meta.bestTimeMs)
        ? elapsedMs
        : meta.bestTimeMs;
    return {
        summary,
        meta: {
            runsPlayed: meta.runsPlayed + 1,
            bestFloor: Math.max(meta.bestFloor, run.floor),
            bestTimeMs
        }
    };
}
//# sourceMappingURL=run.js.map