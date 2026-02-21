export const LOOT_TABLES = [
    {
        id: "starter_floor",
        entries: [
            { itemDefId: "rusted_sabre", weight: 16, minFloor: 1 },
            { itemDefId: "pilgrim_mace", weight: 14, minFloor: 1 },
            { itemDefId: "grim_helm", weight: 14, minFloor: 1 },
            { itemDefId: "chapel_cowl", weight: 12, minFloor: 1 },
            { itemDefId: "patchwork_hauberk", weight: 12, minFloor: 1 },
            { itemDefId: "wanderer_boots", weight: 12, minFloor: 1 },
            { itemDefId: "iron_vow_loop", weight: 10, minFloor: 1 },
            { itemDefId: "oath_ring", weight: 10, minFloor: 1 }
        ]
    },
    {
        id: "cathedral_depths",
        entries: [
            { itemDefId: "dusk_halberd", weight: 14, minFloor: 1 },
            { itemDefId: "penitent_blade", weight: 12, minFloor: 1 },
            { itemDefId: "warden_greathelm", weight: 12, minFloor: 1 },
            { itemDefId: "cathedral_plate", weight: 12, minFloor: 1 },
            { itemDefId: "pilgrim_treads", weight: 12, minFloor: 1 },
            { itemDefId: "oath_ring", weight: 12, minFloor: 1 },
            { itemDefId: "revenant_mask", weight: 8, minFloor: 1 },
            { itemDefId: "oathbound_cuirass", weight: 8, minFloor: 1 },
            { itemDefId: "bloodsigil_band", weight: 10, minFloor: 1 }
        ]
    },
    {
        id: "catacomb_elite",
        entries: [
            { itemDefId: "sanctified_greatsword", weight: 12, minFloor: 1 },
            { itemDefId: "revenant_mask", weight: 14, minFloor: 1 },
            { itemDefId: "oathbound_cuirass", weight: 14, minFloor: 1 },
            { itemDefId: "catacomb_greaves", weight: 14, minFloor: 1 },
            { itemDefId: "bloodsigil_band", weight: 16, minFloor: 1 },
            { itemDefId: "cathedral_plate", weight: 10, minFloor: 1 },
            { itemDefId: "dusk_halberd", weight: 10, minFloor: 1 },
            { itemDefId: "oath_ring", weight: 10, minFloor: 1 }
        ]
    }
];
export const LOOT_TABLE_MAP = Object.fromEntries(LOOT_TABLES.map((table) => [table.id, table]));
//# sourceMappingURL=lootTables.js.map