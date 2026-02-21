import type { ItemInstance, MetaProgression, PlayerState, RunSummary } from "./contracts/types";
export interface RunState {
    startedAtMs: number;
    floor: number;
    kills: number;
    lootCollected: number;
}
export declare function createInitialMeta(): MetaProgression;
export declare function collectLoot(player: PlayerState, item: ItemInstance): PlayerState;
export declare function endRun(run: RunState, player: PlayerState, nowMs: number, meta: MetaProgression): {
    summary: RunSummary;
    meta: MetaProgression;
};
//# sourceMappingURL=run.d.ts.map