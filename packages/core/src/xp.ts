import type { BaseStats, PlayerState } from "./contracts/types";

export function xpForNextLevel(level: number): number {
  return Math.floor(80 + level * level * 18);
}

export function applyXpGain(
  player: PlayerState,
  amount: number,
  statPreference: keyof BaseStats = "strength"
): { player: PlayerState; leveledUp: boolean } {
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
