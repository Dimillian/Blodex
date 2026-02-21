export declare const GAME_EVENTS: {
    readonly PLAYER_MOVED: "PLAYER_MOVED";
    readonly TARGET_ACQUIRED: "TARGET_ACQUIRED";
    readonly ATTACK_RESOLVED: "ATTACK_RESOLVED";
    readonly LOOT_DROPPED: "LOOT_DROPPED";
    readonly ITEM_EQUIPPED: "ITEM_EQUIPPED";
    readonly XP_GAINED: "XP_GAINED";
    readonly LEVEL_UP: "LEVEL_UP";
    readonly RUN_ENDED: "RUN_ENDED";
};
export type GameEventName = (typeof GAME_EVENTS)[keyof typeof GAME_EVENTS];
//# sourceMappingURL=events.d.ts.map