import type { MonsterArchetypeId } from "./types";
export interface MonsterArchetypeDef {
    id: MonsterArchetypeId;
    name: string;
    healthMultiplier: number;
    damageMultiplier: number;
    attackRange: number;
    moveSpeed: number;
    xpValue: number;
    spriteId: string;
}
export declare const MONSTER_ARCHETYPES: MonsterArchetypeDef[];
export declare const MONSTER_ARCHETYPE_MAP: {
    [k: string]: MonsterArchetypeDef;
};
//# sourceMappingURL=monsters.d.ts.map