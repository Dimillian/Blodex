export type EquipmentSlot = "weapon" | "helm" | "chest" | "boots" | "ring";
export type ItemRarity = "common" | "magic" | "rare";
export type MonsterArchetypeId = "melee_grunt" | "ranged_caster" | "elite_bruiser";
export type DamageType = "physical" | "arcane";
export interface BaseStats {
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
}
export interface DerivedStats {
    maxHealth: number;
    maxMana: number;
    armor: number;
    attackPower: number;
    critChance: number;
    attackSpeed: number;
    moveSpeed: number;
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
export interface RunSeed {
    worldSeed: string;
    floorIndex: number;
    difficultyTier: number;
}
export interface ItemAffix {
    key: keyof DerivedStats;
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
export interface ItemInstance {
    id: string;
    defId: string;
    name: string;
    slot: EquipmentSlot;
    rarity: ItemRarity;
    requiredLevel: number;
    iconId: string;
    seed: string;
    rolledAffixes: Partial<DerivedStats>;
}
export interface LootEntry {
    itemDefId: string;
    weight: number;
    minFloor: number;
}
export interface LootTableDef {
    id: string;
    entries: LootEntry[];
}
export interface PlayerState {
    id: string;
    position: {
        x: number;
        y: number;
    };
    level: number;
    xp: number;
    xpToNextLevel: number;
    health: number;
    mana: number;
    baseStats: BaseStats;
    derivedStats: DerivedStats;
    inventory: ItemInstance[];
    equipment: Partial<Record<EquipmentSlot, ItemInstance>>;
    gold: number;
}
export interface MonsterState {
    id: string;
    archetypeId: MonsterArchetypeId;
    level: number;
    health: number;
    maxHealth: number;
    damage: number;
    attackRange: number;
    moveSpeed: number;
    xpValue: number;
    dropTableId: string;
    position: {
        x: number;
        y: number;
    };
    aiState: "idle" | "chase" | "attack" | "dead";
}
export interface DungeonRoom {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface DungeonCorridor {
    fromRoomId: string;
    toRoomId: string;
    path: Array<{
        x: number;
        y: number;
    }>;
}
export interface DungeonLayout {
    width: number;
    height: number;
    walkable: boolean[][];
    rooms: DungeonRoom[];
    corridors: DungeonCorridor[];
    spawnPoints: Array<{
        x: number;
        y: number;
    }>;
    playerSpawn: {
        x: number;
        y: number;
    };
    layoutHash: string;
}
export interface CombatEvent {
    kind: "damage" | "death" | "dodge" | "crit";
    sourceId: string;
    targetId: string;
    amount: number;
    damageType: DamageType;
    timestampMs: number;
}
export interface RunSummary {
    floorReached: number;
    kills: number;
    lootCollected: number;
    elapsedMs: number;
    leveledTo: number;
}
export interface MetaProgression {
    runsPlayed: number;
    bestFloor: number;
    bestTimeMs: number;
}
export interface AssetManifestEntry {
    id: string;
    category: "player_sprite" | "monster_sprite" | "tile" | "item_icon" | "hud" | "fx";
    styleTag: string;
    promptHash: string;
    sourcePath: string;
    outputPath: string;
    license: string;
    revision: number;
}
export interface RngLike {
    next(): number;
    nextInt(min: number, max: number): number;
    pick<T>(items: T[]): T;
}
//# sourceMappingURL=types.d.ts.map