import type { ItemDef, ItemInstance, LootTableDef } from "./contracts/types";
import type { RngLike } from "./contracts/types";
export declare function rollItemDrop(lootTable: LootTableDef, itemDefs: Record<string, ItemDef>, floor: number, rng: RngLike, seedFragment: string): ItemInstance | null;
//# sourceMappingURL=loot.d.ts.map