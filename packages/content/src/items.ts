import type { ItemDef } from "./types";

export const ITEM_DEFS: ItemDef[] = [
  {
    id: "rusted_sabre",
    name: "Rusted Sabre",
    slot: "weapon",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_weapon_01",
    minAffixes: 1,
    maxAffixes: 1,
    affixPool: [
      { key: "attackPower", min: 2, max: 5 },
      { key: "critChance", min: 0, max: 1 }
    ]
  },
  {
    id: "pilgrim_mace",
    name: "Pilgrim Mace",
    slot: "weapon",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_weapon_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "attackPower", min: 3, max: 6 },
      { key: "maxHealth", min: 3, max: 8 }
    ]
  },
  {
    id: "dusk_halberd",
    name: "Dusk Halberd",
    slot: "weapon",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_weapon_02",
    minAffixes: 2,
    maxAffixes: 2,
    affixPool: [
      { key: "attackPower", min: 5, max: 10 },
      { key: "critChance", min: 1, max: 2 },
      { key: "attackSpeed", min: 1, max: 3 }
    ]
  },
  {
    id: "penitent_blade",
    name: "Penitent Blade",
    slot: "weapon",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_weapon_02",
    minAffixes: 2,
    maxAffixes: 3,
    affixPool: [
      { key: "attackPower", min: 4, max: 9 },
      { key: "maxMana", min: 4, max: 8 },
      { key: "critChance", min: 1, max: 2 }
    ]
  },
  {
    id: "sanctified_greatsword",
    name: "Sanctified Greatsword",
    slot: "weapon",
    rarity: "rare",
    requiredLevel: 3,
    iconId: "item_weapon_03",
    minAffixes: 3,
    maxAffixes: 3,
    affixPool: [
      { key: "attackPower", min: 10, max: 16 },
      { key: "critChance", min: 2, max: 4 },
      { key: "attackSpeed", min: 2, max: 4 },
      { key: "maxHealth", min: 8, max: 14 }
    ]
  },
  {
    id: "grim_helm",
    name: "Grim Helm",
    slot: "helm",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_helm_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "maxHealth", min: 4, max: 10 },
      { key: "armor", min: 1, max: 4 }
    ]
  },
  {
    id: "chapel_cowl",
    name: "Chapel Cowl",
    slot: "helm",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_helm_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "maxMana", min: 4, max: 9 },
      { key: "armor", min: 1, max: 3 }
    ]
  },
  {
    id: "warden_greathelm",
    name: "Warden Greathelm",
    slot: "helm",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_helm_02",
    minAffixes: 2,
    maxAffixes: 2,
    affixPool: [
      { key: "armor", min: 3, max: 7 },
      { key: "maxHealth", min: 8, max: 16 },
      { key: "critChance", min: 1, max: 2 }
    ]
  },
  {
    id: "revenant_mask",
    name: "Revenant Mask",
    slot: "helm",
    rarity: "rare",
    requiredLevel: 3,
    iconId: "item_helm_02",
    minAffixes: 2,
    maxAffixes: 3,
    affixPool: [
      { key: "armor", min: 5, max: 10 },
      { key: "maxHealth", min: 10, max: 20 },
      { key: "maxMana", min: 6, max: 12 }
    ]
  },
  {
    id: "patchwork_hauberk",
    name: "Patchwork Hauberk",
    slot: "chest",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_chest_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "armor", min: 2, max: 5 },
      { key: "maxHealth", min: 5, max: 11 }
    ]
  },
  {
    id: "cathedral_plate",
    name: "Cathedral Plate",
    slot: "chest",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_chest_01",
    minAffixes: 2,
    maxAffixes: 3,
    affixPool: [
      { key: "maxHealth", min: 8, max: 20 },
      { key: "armor", min: 3, max: 8 },
      { key: "moveSpeed", min: 1, max: 3 }
    ]
  },
  {
    id: "oathbound_cuirass",
    name: "Oathbound Cuirass",
    slot: "chest",
    rarity: "rare",
    requiredLevel: 3,
    iconId: "item_chest_02",
    minAffixes: 3,
    maxAffixes: 3,
    affixPool: [
      { key: "armor", min: 7, max: 14 },
      { key: "maxHealth", min: 12, max: 24 },
      { key: "maxMana", min: 8, max: 14 },
      { key: "moveSpeed", min: 2, max: 4 }
    ]
  },
  {
    id: "wanderer_boots",
    name: "Wanderer Boots",
    slot: "boots",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_boots_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "moveSpeed", min: 2, max: 6 },
      { key: "armor", min: 1, max: 4 }
    ]
  },
  {
    id: "pilgrim_treads",
    name: "Pilgrim Treads",
    slot: "boots",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_boots_02",
    minAffixes: 2,
    maxAffixes: 2,
    affixPool: [
      { key: "moveSpeed", min: 4, max: 8 },
      { key: "maxHealth", min: 5, max: 10 },
      { key: "attackSpeed", min: 1, max: 2 }
    ]
  },
  {
    id: "catacomb_greaves",
    name: "Catacomb Greaves",
    slot: "boots",
    rarity: "rare",
    requiredLevel: 3,
    iconId: "item_boots_02",
    minAffixes: 2,
    maxAffixes: 3,
    affixPool: [
      { key: "moveSpeed", min: 5, max: 10 },
      { key: "armor", min: 3, max: 7 },
      { key: "maxHealth", min: 8, max: 14 }
    ]
  },
  {
    id: "iron_vow_loop",
    name: "Iron Vow Loop",
    slot: "ring",
    rarity: "common",
    requiredLevel: 1,
    iconId: "item_ring_01",
    minAffixes: 1,
    maxAffixes: 2,
    affixPool: [
      { key: "maxMana", min: 3, max: 7 },
      { key: "critChance", min: 1, max: 1 }
    ]
  },
  {
    id: "oath_ring",
    name: "Oath Ring",
    slot: "ring",
    rarity: "magic",
    requiredLevel: 2,
    iconId: "item_ring_01",
    minAffixes: 2,
    maxAffixes: 2,
    affixPool: [
      { key: "critChance", min: 1, max: 2 },
      { key: "attackPower", min: 2, max: 6 },
      { key: "maxMana", min: 4, max: 10 }
    ]
  },
  {
    id: "bloodsigil_band",
    name: "Bloodsigil Band",
    slot: "ring",
    rarity: "rare",
    requiredLevel: 3,
    iconId: "item_ring_02",
    minAffixes: 2,
    maxAffixes: 3,
    affixPool: [
      { key: "critChance", min: 2, max: 4 },
      { key: "attackPower", min: 5, max: 11 },
      { key: "maxHealth", min: 8, max: 16 }
    ]
  }
];

export const ITEM_DEF_MAP = Object.fromEntries(ITEM_DEFS.map((def) => [def.id, def]));
