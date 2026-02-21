import type { CombatEvent, MonsterState, PlayerState } from "./contracts/types";
import type { RngLike } from "./contracts/types";
export interface CombatResolution {
    player: PlayerState;
    monster: MonsterState;
    events: CombatEvent[];
}
export declare function resolvePlayerAttack(player: PlayerState, monster: MonsterState, rng: RngLike, timestampMs: number): CombatResolution;
export declare function resolveMonsterAttack(monster: MonsterState, player: PlayerState, rng: RngLike, timestampMs: number): CombatResolution;
//# sourceMappingURL=combat.d.ts.map