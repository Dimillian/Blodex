export type EquipmentSlot = "weapon" | "helm" | "chest" | "boots" | "ring";
export type ItemRarity = "common" | "magic" | "rare";
export type MonsterArchetypeId = "melee_grunt" | "ranged_caster" | "elite_bruiser";
export interface ItemAffix {
    key: "maxHealth" | "maxMana" | "armor" | "attackPower" | "critChance" | "attackSpeed" | "moveSpeed";
    min: number;
    max: number;
}
export interface ItemDef {
    id: string;
    name: string;
    slot: EquipmentSlot;
    rarity: ItemRarity;
    requiredLevel: number;
    iconId: string;
    minAffixes: number;
    maxAffixes: number;
    affixPool: ItemAffix[];
}
export interface LootTableDef {
    id: string;
    entries: Array<{
        itemDefId: string;
        weight: number;
        minFloor: number;
    }>;
}
export interface GameConfig {
    tileWidth: number;
    tileHeight: number;
    gridWidth: number;
    gridHeight: number;
    floorClearKillTarget: number;
    enemyBaseHealth: number;
    enemyBaseDamage: number;
}
//# sourceMappingURL=types.d.ts.map