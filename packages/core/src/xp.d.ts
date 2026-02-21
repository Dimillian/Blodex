import type { BaseStats, PlayerState } from "./contracts/types";
export declare function xpForNextLevel(level: number): number;
export declare function applyXpGain(player: PlayerState, amount: number, statPreference?: keyof BaseStats): {
    player: PlayerState;
    leveledUp: boolean;
};
//# sourceMappingURL=xp.d.ts.map