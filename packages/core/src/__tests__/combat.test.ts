import { describe, expect, it } from "vitest";
import { resolveMonsterAttack, resolvePlayerAttack } from "../combat";
import { SeededRng } from "../rng";
import type { MonsterState, PlayerState } from "../contracts/types";

function makePlayer(): PlayerState {
  return {
    id: "player",
    position: { x: 0, y: 0 },
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    health: 120,
    mana: 40,
    gold: 0,
    baseStats: { strength: 10, dexterity: 10, vitality: 10, intelligence: 6 },
    derivedStats: {
      maxHealth: 120,
      maxMana: 40,
      armor: 12,
      attackPower: 25,
      critChance: 0.1,
      attackSpeed: 1,
      moveSpeed: 140
    },
    inventory: [],
    equipment: {}
  };
}

function makeMonster(): MonsterState {
  return {
    id: "monster",
    archetypeId: "melee_grunt",
    level: 1,
    health: 80,
    maxHealth: 80,
    damage: 15,
    attackRange: 1,
    moveSpeed: 110,
    xpValue: 20,
    dropTableId: "starter",
    position: { x: 1, y: 0 },
    aiState: "attack"
  };
}

describe("combat", () => {
  it("applies player damage and can kill monsters", () => {
    const rng = new SeededRng("combat");
    let monster = makeMonster();

    for (let i = 0; i < 6; i += 1) {
      const result = resolvePlayerAttack(makePlayer(), monster, rng, i * 100);
      monster = result.monster;
    }

    expect(monster.health).toBe(0);
    expect(monster.aiState).toBe("dead");
  });

  it("applies monster damage to player", () => {
    const rng = new SeededRng("incoming");
    const result = resolveMonsterAttack(makeMonster(), makePlayer(), rng, 1000);
    expect(result.player.health).toBeLessThan(120);
  });
});
