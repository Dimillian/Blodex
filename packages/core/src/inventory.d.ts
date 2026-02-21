import type { ItemInstance, PlayerState } from "./contracts/types";
export declare function canEquip(player: PlayerState, item: ItemInstance): boolean;
export declare function equipItem(player: PlayerState, itemId: string): PlayerState;
export declare function unequipItem(player: PlayerState, slot: ItemInstance["slot"]): PlayerState;
//# sourceMappingURL=inventory.d.ts.map