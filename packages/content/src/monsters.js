export const MONSTER_ARCHETYPES = [
    {
        id: "melee_grunt",
        name: "Crypt Hound",
        healthMultiplier: 1,
        damageMultiplier: 0.9,
        attackRange: 1,
        moveSpeed: 110,
        xpValue: 18,
        spriteId: "monster_melee_01"
    },
    {
        id: "ranged_caster",
        name: "Ash Acolyte",
        healthMultiplier: 0.75,
        damageMultiplier: 1.05,
        attackRange: 5,
        moveSpeed: 95,
        xpValue: 22,
        spriteId: "monster_ranged_01"
    },
    {
        id: "elite_bruiser",
        name: "Iron Revenant",
        healthMultiplier: 1.7,
        damageMultiplier: 1.15,
        attackRange: 1,
        moveSpeed: 85,
        xpValue: 40,
        spriteId: "monster_elite_01"
    }
];
export const MONSTER_ARCHETYPE_MAP = Object.fromEntries(MONSTER_ARCHETYPES.map((entry) => [entry.id, entry]));
//# sourceMappingURL=monsters.js.map