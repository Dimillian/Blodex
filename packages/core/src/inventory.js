import { deriveStats } from "./stats";
export function canEquip(player, item) {
    return player.level >= item.requiredLevel;
}
export function equipItem(player, itemId) {
    const item = player.inventory.find((candidate) => candidate.id === itemId);
    if (item === undefined) {
        return player;
    }
    if (!canEquip(player, item)) {
        return player;
    }
    const inventory = player.inventory.filter((candidate) => candidate.id !== itemId);
    const equipment = { ...player.equipment };
    const replaced = equipment[item.slot];
    equipment[item.slot] = item;
    if (replaced !== undefined) {
        inventory.push(replaced);
    }
    const equipped = Object.values(equipment).filter((entry) => entry !== undefined);
    const derivedStats = deriveStats(player.baseStats, equipped);
    return {
        ...player,
        inventory,
        equipment,
        derivedStats,
        health: Math.min(player.health, derivedStats.maxHealth),
        mana: Math.min(player.mana, derivedStats.maxMana)
    };
}
export function unequipItem(player, slot) {
    const equippedItem = player.equipment[slot];
    if (equippedItem === undefined) {
        return player;
    }
    const equipment = { ...player.equipment };
    delete equipment[slot];
    const inventory = [...player.inventory, equippedItem];
    const equipped = Object.values(equipment).filter((entry) => entry !== undefined);
    const derivedStats = deriveStats(player.baseStats, equipped);
    return {
        ...player,
        equipment,
        inventory,
        derivedStats,
        health: Math.min(player.health, derivedStats.maxHealth),
        mana: Math.min(player.mana, derivedStats.maxMana)
    };
}
//# sourceMappingURL=inventory.js.map