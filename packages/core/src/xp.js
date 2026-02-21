export function xpForNextLevel(level) {
    return Math.floor(80 + level * level * 18);
}
export function applyXpGain(player, amount, statPreference = "strength") {
    let xp = player.xp + amount;
    let level = player.level;
    let xpToNext = player.xpToNextLevel;
    const base = { ...player.baseStats };
    let leveledUp = false;
    while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = xpForNextLevel(level);
        base[statPreference] += 1;
        leveledUp = true;
    }
    return {
        player: {
            ...player,
            level,
            xp,
            xpToNextLevel: xpToNext,
            baseStats: base
        },
        leveledUp
    };
}
//# sourceMappingURL=xp.js.map