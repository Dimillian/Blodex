import type { BaseStats, DerivedStats, ItemInstance } from "./contracts/types";

export function deriveStats(base: BaseStats, equippedItems: ItemInstance[]): DerivedStats {
  const baseDerived: DerivedStats = {
    maxHealth: 100 + base.vitality * 18,
    maxMana: 40 + base.intelligence * 10,
    armor: base.dexterity * 1.5,
    attackPower: 8 + base.strength * 2.2,
    critChance: 0.03 + base.dexterity * 0.0015,
    attackSpeed: 1 + base.dexterity * 0.002,
    moveSpeed: 140 + base.dexterity * 0.3
  };

  for (const item of equippedItems) {
    for (const [key, value] of Object.entries(item.rolledAffixes) as Array<
      [keyof DerivedStats, number | undefined]
    >) {
      if (value === undefined) {
        continue;
      }
      baseDerived[key] += value;
    }
  }

  baseDerived.critChance = Math.min(0.5, baseDerived.critChance);
  return baseDerived;
}

export function defaultBaseStats(): BaseStats {
  return {
    strength: 8,
    dexterity: 8,
    vitality: 8,
    intelligence: 5
  };
}
