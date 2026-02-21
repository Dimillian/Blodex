import type { ItemInstance, MetaProgression, PlayerState, RunSummary } from "./contracts/types";

export interface RunState {
  startedAtMs: number;
  floor: number;
  kills: number;
  lootCollected: number;
}

export function createInitialMeta(): MetaProgression {
  return {
    runsPlayed: 0,
    bestFloor: 0,
    bestTimeMs: 0
  };
}

export function collectLoot(player: PlayerState, item: ItemInstance): PlayerState {
  return {
    ...player,
    inventory: [...player.inventory, item]
  };
}

export function endRun(
  run: RunState,
  player: PlayerState,
  nowMs: number,
  meta: MetaProgression
): { summary: RunSummary; meta: MetaProgression } {
  const elapsedMs = Math.max(0, nowMs - run.startedAtMs);
  const summary: RunSummary = {
    floorReached: run.floor,
    kills: run.kills,
    lootCollected: run.lootCollected,
    elapsedMs,
    leveledTo: player.level
  };

  const bestTimeMs =
    run.floor >= meta.bestFloor && (meta.bestTimeMs === 0 || elapsedMs < meta.bestTimeMs)
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
