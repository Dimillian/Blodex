import type { ItemDef, ItemInstance, LootTableDef } from "./contracts/types";
import type { RngLike } from "./contracts/types";

function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num));
}

function rollAffixes(itemDef: ItemDef, rng: RngLike): ItemInstance["rolledAffixes"] {
  const rolled: ItemInstance["rolledAffixes"] = {};
  const affixCount = clamp(rng.nextInt(itemDef.minAffixes, itemDef.maxAffixes), 1, itemDef.affixPool.length);
  const pool = [...itemDef.affixPool];

  for (let i = 0; i < affixCount; i += 1) {
    const index = rng.nextInt(0, pool.length - 1);
    const picked = pool.splice(index, 1)[0];
    if (picked === undefined) {
      continue;
    }
    const value = rng.nextInt(picked.min, picked.max);
    rolled[picked.key] = (rolled[picked.key] ?? 0) + value;
  }

  return rolled;
}

export function rollItemDrop(
  lootTable: LootTableDef,
  itemDefs: Record<string, ItemDef>,
  floor: number,
  rng: RngLike,
  seedFragment: string
): ItemInstance | null {
  const validEntries = lootTable.entries.filter((entry) => entry.minFloor <= floor);
  if (validEntries.length === 0) {
    return null;
  }

  const totalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);
  let needle = rng.next() * totalWeight;
  let selected = validEntries[0]!;

  for (const entry of validEntries) {
    needle -= entry.weight;
    if (needle <= 0) {
      selected = entry;
      break;
    }
  }

  const def = itemDefs[selected.itemDefId];
  if (def === undefined) {
    return null;
  }

  return {
    id: `${def.id}-${seedFragment}`,
    defId: def.id,
    name: def.name,
    slot: def.slot,
    rarity: def.rarity,
    requiredLevel: def.requiredLevel,
    iconId: def.iconId,
    seed: seedFragment,
    rolledAffixes: rollAffixes(def, rng)
  };
}
