import { describe, expect, it } from "vitest";
import { createInitialMeta, endRun } from "../run";
import { deriveStats } from "../stats";
import { equipItem, unequipItem } from "../inventory";
import type { ItemInstance, PlayerState } from "../contracts/types";

function player(level = 1): PlayerState {
  const base = { strength: 10, dexterity: 10, vitality: 10, intelligence: 5 };
  return {
    id: "player",
    position: { x: 0, y: 0 },
    level,
    xp: 0,
    xpToNextLevel: 100,
    health: 280,
    mana: 90,
    baseStats: base,
    derivedStats: deriveStats(base, []),
    inventory: [],
    equipment: {},
    gold: 0
  };
}

describe("progression", () => {
  it("enforces level requirements when equipping", () => {
    const item: ItemInstance = {
      id: "ring-1",
      defId: "ring",
      name: "Mystic Ring",
      slot: "ring",
      rarity: "rare",
      requiredLevel: 3,
      iconId: "icon_ring",
      seed: "x",
      rolledAffixes: { maxHealth: 15 }
    };

    const lowLevel = { ...player(1), inventory: [item] };
    const highLevel = { ...player(4), inventory: [item] };

    expect(equipItem(lowLevel, item.id).equipment.ring).toBeUndefined();
    expect(equipItem(highLevel, item.id).equipment.ring?.id).toBe(item.id);
  });

  it("updates meta progression while run progression resets", () => {
    const meta = createInitialMeta();
    const { summary, meta: updatedMeta } = endRun(
      {
        startedAtMs: 0,
        floor: 2,
        kills: 18,
        lootCollected: 5
      },
      player(3),
      60000,
      meta
    );

    expect(summary.floorReached).toBe(2);
    expect(updatedMeta.runsPlayed).toBe(1);
    expect(updatedMeta.bestFloor).toBe(2);
    expect(updatedMeta.bestTimeMs).toBe(60000);
  });

  it("supports unequipping items back to inventory", () => {
    const item: ItemInstance = {
      id: "boots-1",
      defId: "boots",
      name: "Traveler Boots",
      slot: "boots",
      rarity: "magic",
      requiredLevel: 1,
      iconId: "icon_boots",
      seed: "abc",
      rolledAffixes: { moveSpeed: 4 }
    };

    const equipped = equipItem({ ...player(3), inventory: [item] }, item.id);
    expect(equipped.equipment.boots?.id).toBe(item.id);

    const unequipped = unequipItem(equipped, "boots");
    expect(unequipped.equipment.boots).toBeUndefined();
    expect(unequipped.inventory.find((entry) => entry.id === item.id)).toBeDefined();
  });
});
