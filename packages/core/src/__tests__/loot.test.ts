import { describe, expect, it } from "vitest";
import { rollItemDrop } from "../loot";
import { SeededRng } from "../rng";
import type { ItemDef, LootTableDef } from "../contracts/types";

const itemDefs: Record<string, ItemDef> = {
  axe_common: {
    id: "axe_common",
    name: "Bandit Axe",
    slot: "weapon",
    rarity: "common",
    requiredLevel: 1,
    iconId: "icon_axe",
    minAffixes: 1,
    maxAffixes: 1,
    affixPool: [{ key: "attackPower", min: 1, max: 3 }]
  },
  ring_rare: {
    id: "ring_rare",
    name: "Oath Ring",
    slot: "ring",
    rarity: "rare",
    requiredLevel: 1,
    iconId: "icon_ring",
    minAffixes: 2,
    maxAffixes: 2,
    affixPool: [
      { key: "critChance", min: 1, max: 2 },
      { key: "maxHealth", min: 3, max: 6 }
    ]
  }
};

const lootTable: LootTableDef = {
  id: "starter",
  entries: [
    { itemDefId: "axe_common", weight: 80, minFloor: 1 },
    { itemDefId: "ring_rare", weight: 20, minFloor: 1 }
  ]
};

describe("rollItemDrop", () => {
  it("roughly respects weighted rarity distribution", () => {
    const rng = new SeededRng("loot-balance");
    let common = 0;
    let rare = 0;

    for (let i = 0; i < 1000; i += 1) {
      const item = rollItemDrop(lootTable, itemDefs, 1, rng, `seed-${i}`);
      if (item?.rarity === "common") {
        common += 1;
      }
      if (item?.rarity === "rare") {
        rare += 1;
      }
    }

    expect(common).toBeGreaterThan(rare * 2);
  });
});
