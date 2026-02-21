import Phaser from "phaser";
import { applyXpGain, createInitialMeta, defaultBaseStats, deriveStats, endRun, equipItem, findPath, generateDungeon, resolveMonsterAttack, resolvePlayerAttack, rollItemDrop, SeededRng, unequipItem } from "@blodex/core";
import { GAME_CONFIG, ITEM_DEF_MAP, LOOT_TABLE_MAP, MONSTER_ARCHETYPES } from "@blodex/content";
import { gridToIso, isoToGrid } from "../systems/iso";
import { Hud } from "../ui/Hud";
const META_STORAGE_KEY = "blodex_meta_v1";
export class DungeonScene extends Phaser.Scene {
    static ENTITY_DEPTH_OFFSET = 10_000;
    rng = new SeededRng(`run-${Date.now()}`);
    hud;
    meta = createInitialMeta();
    run;
    dungeon = generateDungeon({
        width: 46,
        height: 46,
        roomCount: 12,
        minRoomSize: 4,
        maxRoomSize: 9,
        seed: `dungeon-${Date.now()}`
    });
    player;
    playerSprite;
    monsters = [];
    loot = [];
    path = [];
    attackTargetId = null;
    origin = { x: 0, y: 0 };
    worldBounds = { x: -2000, y: -2000, width: 4000, height: 4000 };
    tileWidth = GAME_CONFIG.tileWidth;
    tileHeight = GAME_CONFIG.tileHeight;
    playerYOffset = 16;
    nextPlayerAttackAt = 0;
    hudDirty = true;
    runEnded = false;
    constructor() {
        super("dungeon");
    }
    preload() {
        this.load.image("player_vanguard", "/generated/player_vanguard.png");
        this.load.image("monster_melee_01", "/generated/monster_melee_01.png");
        this.load.image("monster_ranged_01", "/generated/monster_ranged_01.png");
        this.load.image("monster_elite_01", "/generated/monster_elite_01.png");
        this.load.image("tile_floor_01", "/generated/tile_floor_01.png");
        this.load.image("item_weapon_01", "/generated/item_weapon_01.png");
        this.load.image("item_weapon_02", "/generated/item_weapon_02.png");
        this.load.image("item_weapon_03", "/generated/item_weapon_03.png");
        this.load.image("item_helm_01", "/generated/item_helm_01.png");
        this.load.image("item_helm_02", "/generated/item_helm_02.png");
        this.load.image("item_chest_01", "/generated/item_chest_01.png");
        this.load.image("item_chest_02", "/generated/item_chest_02.png");
        this.load.image("item_boots_01", "/generated/item_boots_01.png");
        this.load.image("item_boots_02", "/generated/item_boots_02.png");
        this.load.image("item_ring_01", "/generated/item_ring_01.png");
        this.load.image("item_ring_02", "/generated/item_ring_02.png");
    }
    create() {
        this.cameras.main.setBackgroundColor("#11161d");
        this.meta = this.loadMeta();
        this.bootstrapRun();
        this.input.on("pointerdown", (pointer) => {
            if (this.runEnded) {
                return;
            }
            const clickedGrid = isoToGrid(pointer.worldX, pointer.worldY, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
            const targetTile = {
                x: Math.round(clickedGrid.x),
                y: Math.round(clickedGrid.y)
            };
            const clickedMonster = this.pickMonsterAt(targetTile.x, targetTile.y);
            if (clickedMonster !== null) {
                this.attackTargetId = clickedMonster.state.id;
                return;
            }
            this.attackTargetId = null;
            this.path = this.computePathTo(targetTile.x, targetTile.y);
        });
        this.hud = new Hud((itemId) => {
            this.player = equipItem(this.player, itemId);
            this.hudDirty = true;
        }, (slot) => {
            this.player = unequipItem(this.player, slot);
            this.hudDirty = true;
        }, () => this.resetRun());
        this.hudDirty = true;
    }
    update(_, deltaMs) {
        if (this.runEnded) {
            return;
        }
        this.updatePlayerMovement(deltaMs / 1000);
        this.updateCombat();
        this.updateMonsters(deltaMs / 1000);
        this.collectNearbyLoot();
        const iso = gridToIso(this.player.position.x, this.player.position.y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
        this.playerSprite.setPosition(iso.x, iso.y - this.playerYOffset);
        this.playerSprite.setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET);
        if (this.player.health <= 0) {
            this.finishRun();
            return;
        }
        if (this.run.kills >= GAME_CONFIG.floorClearKillTarget) {
            this.finishRun();
            return;
        }
        if (this.hudDirty) {
            this.renderHud();
            this.hudDirty = false;
        }
    }
    bootstrapRun() {
        this.children.removeAll();
        this.dungeon = generateDungeon({
            width: 46,
            height: 46,
            roomCount: 12,
            minRoomSize: 4,
            maxRoomSize: 9,
            seed: `dungeon-${Date.now()}`
        });
        const baseStats = defaultBaseStats();
        const derivedStats = deriveStats(baseStats, []);
        this.player = {
            id: "player",
            position: { ...this.dungeon.playerSpawn },
            level: 1,
            xp: 0,
            xpToNextLevel: 98,
            health: derivedStats.maxHealth,
            mana: derivedStats.maxMana,
            baseStats,
            derivedStats,
            inventory: [],
            equipment: {},
            gold: 0
        };
        this.run = {
            startedAtMs: this.time.now,
            floor: 1,
            kills: 0,
            lootCollected: 0
        };
        this.path = [];
        this.attackTargetId = null;
        this.nextPlayerAttackAt = 0;
        this.hudDirty = true;
        this.runEnded = false;
        this.loot = [];
        this.computeWorldOriginAndBounds();
        this.drawDungeon();
        this.spawnPlayer();
        this.spawnMonsters();
        this.configureCamera();
    }
    computeWorldOriginAndBounds() {
        const corners = [
            gridToIso(0, 0, this.tileWidth, this.tileHeight, 0, 0),
            gridToIso(this.dungeon.width - 1, 0, this.tileWidth, this.tileHeight, 0, 0),
            gridToIso(0, this.dungeon.height - 1, this.tileWidth, this.tileHeight, 0, 0),
            gridToIso(this.dungeon.width - 1, this.dungeon.height - 1, this.tileWidth, this.tileHeight, 0, 0)
        ];
        const minX = Math.min(...corners.map((point) => point.x));
        const maxX = Math.max(...corners.map((point) => point.x));
        const minY = Math.min(...corners.map((point) => point.y));
        const maxY = Math.max(...corners.map((point) => point.y));
        const padding = 280;
        this.origin = {
            x: padding - minX,
            y: padding - minY
        };
        this.worldBounds = {
            x: minX + this.origin.x - padding,
            y: minY + this.origin.y - padding,
            width: maxX - minX + padding * 2,
            height: maxY - minY + padding * 2
        };
    }
    configureCamera() {
        const camera = this.cameras.main;
        camera.setBounds(this.worldBounds.x, this.worldBounds.y, this.worldBounds.width, this.worldBounds.height);
        camera.startFollow(this.playerSprite, true, 0.12, 0.12);
        camera.setZoom(1);
        camera.roundPixels = true;
    }
    drawDungeon() {
        if (this.textures.exists("tile_floor_01")) {
            for (let y = 0; y < this.dungeon.height; y += 1) {
                for (let x = 0; x < this.dungeon.width; x += 1) {
                    if (!this.dungeon.walkable[y]?.[x]) {
                        continue;
                    }
                    const iso = gridToIso(x, y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
                    this.add
                        .image(iso.x, iso.y, "tile_floor_01")
                        .setDisplaySize(this.tileWidth, this.tileHeight)
                        .setDepth(iso.y);
                }
            }
            return;
        }
        const g = this.add.graphics();
        for (let y = 0; y < this.dungeon.height; y += 1) {
            for (let x = 0; x < this.dungeon.width; x += 1) {
                if (!this.dungeon.walkable[y]?.[x]) {
                    continue;
                }
                const iso = gridToIso(x, y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
                const color = (x + y) % 2 === 0 ? 0x2f3f45 : 0x25343a;
                g.fillStyle(color, 1);
                g.lineStyle(1, 0x1a2328, 0.7);
                g.beginPath();
                g.moveTo(iso.x, iso.y - this.tileHeight / 2);
                g.lineTo(iso.x + this.tileWidth / 2, iso.y);
                g.lineTo(iso.x, iso.y + this.tileHeight / 2);
                g.lineTo(iso.x - this.tileWidth / 2, iso.y);
                g.closePath();
                g.fillPath();
                g.strokePath();
            }
        }
        g.setDepth(0);
    }
    spawnPlayer() {
        const iso = gridToIso(this.player.position.x, this.player.position.y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
        if (this.textures.exists("player_vanguard")) {
            this.playerSprite = this.add
                .image(iso.x, iso.y, "player_vanguard")
                .setOrigin(0.5, 1)
                .setDisplaySize(48, 64)
                .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET);
            this.playerYOffset = 0;
            return;
        }
        this.playerSprite = this.add
            .rectangle(iso.x, iso.y, 20, 30, 0xd2bb93)
            .setOrigin(0.5, 1)
            .setStrokeStyle(2, 0x674e2f)
            .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET);
        this.playerYOffset = 0;
    }
    generateMonsterSpawnPoints(count) {
        const candidates = [];
        const points = [];
        for (let y = 1; y < this.dungeon.height - 1; y += 1) {
            for (let x = 1; x < this.dungeon.width - 1; x += 1) {
                if (!this.dungeon.walkable[y]?.[x]) {
                    continue;
                }
                const distToPlayer = Phaser.Math.Distance.Between(x, y, this.player.position.x, this.player.position.y);
                if (distToPlayer < 6 || distToPlayer > 20) {
                    continue;
                }
                candidates.push({ x, y });
            }
        }
        while (points.length < count && candidates.length > 0) {
            const idx = this.rng.nextInt(0, candidates.length - 1);
            const picked = candidates.splice(idx, 1)[0];
            if (picked === undefined) {
                break;
            }
            const tooClose = points.some((point) => Phaser.Math.Distance.Between(point.x, point.y, picked.x, picked.y) < 2.8);
            if (!tooClose) {
                points.push(picked);
            }
        }
        if (points.length < count) {
            for (const fallback of this.dungeon.spawnPoints) {
                points.push({ x: fallback.x, y: fallback.y });
                if (points.length >= count) {
                    break;
                }
            }
        }
        return points;
    }
    spawnMonsters() {
        this.monsters = [];
        const points = this.generateMonsterSpawnPoints(GAME_CONFIG.floorClearKillTarget + 1);
        for (let i = 0; i < points.length; i += 1) {
            const point = points[i];
            const archetype = MONSTER_ARCHETYPES[i % MONSTER_ARCHETYPES.length];
            const levelScale = 1 + this.run.floor * 0.12;
            const dropTableId = archetype.id === "elite_bruiser"
                ? "catacomb_elite"
                : archetype.id === "ranged_caster"
                    ? "cathedral_depths"
                    : "starter_floor";
            const state = {
                id: `monster-${i}`,
                archetypeId: archetype.id,
                level: this.run.floor,
                health: Math.floor(GAME_CONFIG.enemyBaseHealth * archetype.healthMultiplier * levelScale),
                maxHealth: Math.floor(GAME_CONFIG.enemyBaseHealth * archetype.healthMultiplier * levelScale),
                damage: Math.floor(GAME_CONFIG.enemyBaseDamage * archetype.damageMultiplier * levelScale),
                attackRange: archetype.attackRange,
                moveSpeed: archetype.moveSpeed,
                xpValue: archetype.xpValue,
                dropTableId,
                position: { x: point.x, y: point.y },
                aiState: "idle"
            };
            const iso = gridToIso(state.position.x, state.position.y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
            const sprite = this.textures.exists(archetype.spriteId)
                ? this.add
                    .image(iso.x, iso.y, archetype.spriteId)
                    .setOrigin(0.5, 1)
                    .setDisplaySize(40, 52)
                    .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET)
                : this.add
                    .rectangle(iso.x, iso.y, 18, 26, archetype.id === "melee_grunt"
                    ? 0x7b5b52
                    : archetype.id === "ranged_caster"
                        ? 0x5a4f7d
                        : 0x835132)
                    .setOrigin(0.5, 1)
                    .setStrokeStyle(2, 0x1d1616)
                    .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET);
            const healthBarBg = this.add
                .rectangle(iso.x, iso.y - 36, 30, 5, 0x201316, 0.8)
                .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET + 2)
                .setVisible(false);
            const healthBarFg = this.add
                .rectangle(iso.x, iso.y - 36, 28, 3, 0xd75959, 0.95)
                .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET + 3)
                .setVisible(false);
            this.monsters.push({
                state,
                sprite,
                healthBarBg,
                healthBarFg,
                healthBarYOffset: this.textures.exists(archetype.spriteId) ? 36 : 30,
                yOffset: 0,
                nextAttackAt: 0
            });
        }
    }
    computePathTo(x, y) {
        const target = this.clampToWalkable(x, y);
        const start = {
            x: Math.round(this.player.position.x),
            y: Math.round(this.player.position.y)
        };
        return findPath(this.dungeon.walkable, start, target).slice(1);
    }
    clampToWalkable(x, y) {
        const clamped = {
            x: Phaser.Math.Clamp(x, 0, this.dungeon.width - 1),
            y: Phaser.Math.Clamp(y, 0, this.dungeon.height - 1)
        };
        if (this.dungeon.walkable[clamped.y]?.[clamped.x]) {
            return clamped;
        }
        let nearest = this.player.position;
        let nearestDist = Number.POSITIVE_INFINITY;
        for (let yy = Math.max(0, clamped.y - 2); yy <= Math.min(this.dungeon.height - 1, clamped.y + 2); yy += 1) {
            for (let xx = Math.max(0, clamped.x - 2); xx <= Math.min(this.dungeon.width - 1, clamped.x + 2); xx += 1) {
                if (!this.dungeon.walkable[yy]?.[xx]) {
                    continue;
                }
                const dist = Phaser.Math.Distance.Between(xx, yy, clamped.x, clamped.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = { x: xx, y: yy };
                }
            }
        }
        return nearest;
    }
    updatePlayerMovement(dt) {
        const next = this.path[0];
        if (next === undefined) {
            return;
        }
        const speedCellsPerSec = this.player.derivedStats.moveSpeed / 130;
        const dx = next.x - this.player.position.x;
        const dy = next.y - this.player.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.02) {
            this.player.position = { x: next.x, y: next.y };
            this.path.shift();
            return;
        }
        const step = Math.min(dist, speedCellsPerSec * dt);
        this.player.position = {
            x: this.player.position.x + (dx / dist) * step,
            y: this.player.position.y + (dy / dist) * step
        };
    }
    updateCombat() {
        const target = this.attackTargetId
            ? this.monsters.find((monster) => monster.state.id === this.attackTargetId)
            : undefined;
        if (target === undefined || target.state.health <= 0) {
            this.attackTargetId = null;
            return;
        }
        const distance = Phaser.Math.Distance.Between(this.player.position.x, this.player.position.y, target.state.position.x, target.state.position.y);
        if (distance > 1.5) {
            this.path = this.computePathTo(Math.round(target.state.position.x), Math.round(target.state.position.y));
            return;
        }
        if (this.time.now < this.nextPlayerAttackAt) {
            return;
        }
        this.nextPlayerAttackAt = this.time.now + 1000 / Math.max(0.6, this.player.derivedStats.attackSpeed);
        const result = resolvePlayerAttack(this.player, target.state, this.rng, this.time.now);
        target.state = result.monster;
        if (target.state.health <= 0) {
            this.run.kills += 1;
            this.attackTargetId = null;
            target.sprite.destroy();
            target.healthBarBg.destroy();
            target.healthBarFg.destroy();
            const xpResult = applyXpGain(this.player, target.state.xpValue, "strength");
            const nextDerived = deriveStats(xpResult.player.baseStats, Object.values(this.player.equipment).filter((item) => item !== undefined));
            this.player = {
                ...xpResult.player,
                derivedStats: nextDerived,
                health: Math.min(this.player.health + 12, nextDerived.maxHealth),
                mana: Math.min(this.player.mana + 4, nextDerived.maxMana)
            };
            this.hudDirty = true;
            const lootTable = LOOT_TABLE_MAP[target.state.dropTableId];
            if (lootTable !== undefined) {
                const item = rollItemDrop(lootTable, ITEM_DEF_MAP, this.run.floor, this.rng, `${target.state.id}-${this.run.kills}`);
                if (item !== null) {
                    const iso = gridToIso(target.state.position.x, target.state.position.y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
                    const sprite = this.textures.exists(item.iconId)
                        ? this.add
                            .image(iso.x, iso.y - 2, item.iconId)
                            .setDisplaySize(24, 24)
                            .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET - 10)
                        : this.add
                            .ellipse(iso.x, iso.y - 2, 10, 8, 0xd0a86f)
                            .setStrokeStyle(1, 0x3f301b)
                            .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET - 10);
                    this.loot.push({
                        item,
                        sprite,
                        position: { ...target.state.position }
                    });
                    this.hudDirty = true;
                }
            }
        }
    }
    updateMonsters(dt) {
        const living = this.monsters.filter((monster) => monster.state.health > 0);
        for (const monster of living) {
            const distance = Phaser.Math.Distance.Between(this.player.position.x, this.player.position.y, monster.state.position.x, monster.state.position.y);
            if (distance <= monster.state.attackRange + 0.2) {
                monster.state.aiState = "attack";
                if (this.time.now >= monster.nextAttackAt) {
                    monster.nextAttackAt = this.time.now + 1800;
                    const result = resolveMonsterAttack(monster.state, this.player, this.rng, this.time.now);
                    this.player = result.player;
                    monster.state = result.monster;
                    this.hudDirty = true;
                }
            }
            else if (distance < 7) {
                monster.state.aiState = "chase";
                const speed = (monster.state.moveSpeed / 130) * dt;
                const dx = this.player.position.x - monster.state.position.x;
                const dy = this.player.position.y - monster.state.position.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0.001) {
                    monster.state.position.x += (dx / dist) * Math.min(dist, speed);
                    monster.state.position.y += (dy / dist) * Math.min(dist, speed);
                }
            }
            else {
                monster.state.aiState = "idle";
            }
            const iso = gridToIso(monster.state.position.x, monster.state.position.y, this.tileWidth, this.tileHeight, this.origin.x, this.origin.y);
            monster.sprite.setPosition(iso.x, iso.y - monster.yOffset);
            monster.sprite.setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET);
            monster.sprite.setVisible(monster.state.health > 0);
            const wasDamaged = monster.state.health < monster.state.maxHealth;
            monster.healthBarBg.setPosition(iso.x, iso.y - monster.healthBarYOffset);
            monster.healthBarFg.setPosition(iso.x, iso.y - monster.healthBarYOffset);
            if (wasDamaged) {
                const width = Phaser.Math.Clamp((monster.state.health / monster.state.maxHealth) * 28, 0, 28);
                monster.healthBarBg
                    .setVisible(true)
                    .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET + 2);
                monster.healthBarFg
                    .setVisible(true)
                    .setDisplaySize(width, 3)
                    .setDepth(iso.y + DungeonScene.ENTITY_DEPTH_OFFSET + 3);
            }
            else {
                monster.healthBarBg.setVisible(false);
                monster.healthBarFg.setVisible(false);
            }
        }
    }
    collectNearbyLoot() {
        const remaining = [];
        for (const drop of this.loot) {
            const distance = Phaser.Math.Distance.Between(this.player.position.x, this.player.position.y, drop.position.x, drop.position.y);
            if (distance <= 0.7) {
                this.player.inventory.push(drop.item);
                this.run.lootCollected += 1;
                drop.sprite.destroy();
                this.hudDirty = true;
            }
            else {
                remaining.push(drop);
            }
        }
        this.loot = remaining;
    }
    pickMonsterAt(x, y) {
        let picked = null;
        let best = Number.POSITIVE_INFINITY;
        for (const monster of this.monsters) {
            if (monster.state.health <= 0) {
                continue;
            }
            const dist = Phaser.Math.Distance.Between(monster.state.position.x, monster.state.position.y, x, y);
            if (dist < 1.1 && dist < best) {
                best = dist;
                picked = monster;
            }
        }
        return picked;
    }
    finishRun() {
        if (this.runEnded) {
            return;
        }
        this.runEnded = true;
        const { summary, meta } = endRun(this.run, this.player, this.time.now, this.meta);
        this.meta = meta;
        this.saveMeta(meta);
        this.hud.showSummary(summary);
        this.hudDirty = true;
    }
    resetRun() {
        this.hud.clearSummary();
        this.bootstrapRun();
        this.hudDirty = true;
    }
    renderHud() {
        this.hud.render({
            player: this.player,
            run: {
                floor: this.run.floor,
                kills: this.run.kills,
                lootCollected: this.run.lootCollected,
                targetKills: GAME_CONFIG.floorClearKillTarget
            },
            meta: this.meta
        });
    }
    loadMeta() {
        const raw = window.localStorage.getItem(META_STORAGE_KEY);
        if (raw === null) {
            return createInitialMeta();
        }
        try {
            const parsed = JSON.parse(raw);
            return {
                runsPlayed: parsed.runsPlayed ?? 0,
                bestFloor: parsed.bestFloor ?? 0,
                bestTimeMs: parsed.bestTimeMs ?? 0
            };
        }
        catch {
            return createInitialMeta();
        }
    }
    saveMeta(meta) {
        window.localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    }
}
//# sourceMappingURL=DungeonScene.js.map