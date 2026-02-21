import type { EquipmentSlot, MetaProgression, PlayerState, RunSummary } from "@blodex/core";
interface HudState {
    player: PlayerState;
    run: {
        floor: number;
        kills: number;
        lootCollected: number;
        targetKills: number;
    };
    meta: MetaProgression;
}
export declare class Hud {
    private readonly onEquip;
    private readonly onUnequip;
    private readonly onNewRun;
    private readonly metaEl;
    private readonly statsEl;
    private readonly runEl;
    private readonly inventoryEl;
    private readonly summaryEl;
    private readonly tooltipEl;
    constructor(onEquip: (itemId: string) => void, onUnequip: (slot: EquipmentSlot) => void, onNewRun: () => void);
    render(state: HudState): void;
    private renderInventory;
    private showTooltip;
    private hideTooltip;
    showSummary(summary: RunSummary): void;
    clearSummary(): void;
}
export {};
//# sourceMappingURL=Hud.d.ts.map