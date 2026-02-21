import type { CombatEvent, MonsterState, PlayerState } from "./contracts/types";
import type { RngLike } from "./contracts/types";

export interface CombatResolution {
  player: PlayerState;
  monster: MonsterState;
  events: CombatEvent[];
}

export function resolvePlayerAttack(
  player: PlayerState,
  monster: MonsterState,
  rng: RngLike,
  timestampMs: number
): CombatResolution {
  if (monster.health <= 0) {
    return { player, monster, events: [] };
  }

  const crit = rng.next() < player.derivedStats.critChance;
  const damage = Math.max(1, Math.floor(player.derivedStats.attackPower * (crit ? 1.7 : 1)));
  const nextHealth = Math.max(0, monster.health - damage);

  const events: CombatEvent[] = [
    {
      kind: crit ? "crit" : "damage",
      sourceId: player.id,
      targetId: monster.id,
      amount: damage,
      damageType: "physical",
      timestampMs
    }
  ];

  if (nextHealth === 0) {
    events.push({
      kind: "death",
      sourceId: player.id,
      targetId: monster.id,
      amount: damage,
      damageType: "physical",
      timestampMs
    });
  }

  return {
    player,
    monster: {
      ...monster,
      health: nextHealth,
      aiState: nextHealth === 0 ? "dead" : monster.aiState
    },
    events
  };
}

export function resolveMonsterAttack(
  monster: MonsterState,
  player: PlayerState,
  rng: RngLike,
  timestampMs: number
): CombatResolution {
  if (player.health <= 0 || monster.health <= 0) {
    return { player, monster, events: [] };
  }

  const dodgeChance = Math.min(0.35, player.derivedStats.critChance * 0.8);
  if (rng.next() < dodgeChance) {
    return {
      player,
      monster,
      events: [
        {
          kind: "dodge",
          sourceId: monster.id,
          targetId: player.id,
          amount: 0,
          damageType: "physical",
          timestampMs
        }
      ]
    };
  }

  const mitigatedDamage = Math.max(1, Math.floor(monster.damage - player.derivedStats.armor * 0.1));
  const nextHealth = Math.max(0, player.health - mitigatedDamage);

  const events: CombatEvent[] = [
    {
      kind: "damage",
      sourceId: monster.id,
      targetId: player.id,
      amount: mitigatedDamage,
      damageType: "physical",
      timestampMs
    }
  ];

  if (nextHealth === 0) {
    events.push({
      kind: "death",
      sourceId: monster.id,
      targetId: player.id,
      amount: mitigatedDamage,
      damageType: "physical",
      timestampMs
    });
  }

  return {
    player: {
      ...player,
      health: nextHealth
    },
    monster,
    events
  };
}
