import type {
  EquipmentSlot,
  ItemInstance,
  MetaProgression,
  PlayerState,
  RunSummary
} from "@blodex/core";

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

const EQUIPMENT_SLOTS: EquipmentSlot[] = ["weapon", "helm", "chest", "boots", "ring"];

function slotLabel(slot: EquipmentSlot): string {
  switch (slot) {
    case "weapon":
      return "WPN";
    case "helm":
      return "HELM";
    case "chest":
      return "CHEST";
    case "boots":
      return "BOOTS";
    case "ring":
      return "RING";
  }
}

function slotLongLabel(slot: EquipmentSlot): string {
  switch (slot) {
    case "weapon":
      return "Weapon";
    case "helm":
      return "Helm";
    case "chest":
      return "Chest";
    case "boots":
      return "Boots";
    case "ring":
      return "Ring";
  }
}

function formatAffixName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export class Hud {
  private readonly metaEl = document.querySelector("#meta") as HTMLDivElement;
  private readonly statsEl = document.querySelector("#stats") as HTMLDivElement;
  private readonly runEl = document.querySelector("#run") as HTMLDivElement;
  private readonly inventoryEl = document.querySelector("#inventory") as HTMLDivElement;
  private readonly summaryEl = document.querySelector("#summary") as HTMLDivElement;
  private readonly tooltipEl: HTMLDivElement;

  constructor(
    private readonly onEquip: (itemId: string) => void,
    private readonly onUnequip: (slot: EquipmentSlot) => void,
    private readonly onNewRun: () => void
  ) {
    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "inventory-tooltip hidden";
    document.body.appendChild(this.tooltipEl);
  }

  render(state: HudState): void {
    this.metaEl.className = "panel-block compact-block";
    this.metaEl.innerHTML = `
      <div class="mini-grid mini-3">
        <div><span class="k">Runs</span><span>${state.meta.runsPlayed}</span></div>
        <div><span class="k">Best F</span><span>${state.meta.bestFloor}</span></div>
        <div><span class="k">Best T</span><span>${(state.meta.bestTimeMs / 1000).toFixed(1)}s</span></div>
      </div>
    `;

    const player = state.player;
    this.statsEl.className = "panel-block compact-block";
    this.statsEl.innerHTML = `
      <h2>Vanguard</h2>
      <div class="mini-grid mini-2">
        <div><span class="k">Lvl</span><span>${player.level}</span></div>
        <div><span class="k">XP</span><span>${player.xp}/${player.xpToNextLevel}</span></div>
        <div><span class="k">HP</span><span>${Math.floor(player.health)}/${Math.floor(player.derivedStats.maxHealth)}</span></div>
        <div><span class="k">Mana</span><span>${Math.floor(player.mana)}/${Math.floor(player.derivedStats.maxMana)}</span></div>
        <div><span class="k">Pow</span><span>${Math.floor(player.derivedStats.attackPower)}</span></div>
        <div><span class="k">Arm</span><span>${Math.floor(player.derivedStats.armor)}</span></div>
      </div>
    `;

    this.runEl.className = "panel-block compact-block";
    this.runEl.innerHTML = `
      <div class="mini-grid mini-2">
        <div><span class="k">Floor</span><span>${state.run.floor}</span></div>
        <div><span class="k">Status</span><span class="${
          player.health <= 0 ? "badge-danger" : "badge-ok"
        }">${player.health <= 0 ? "Dead" : "Hunting"}</span></div>
        <div><span class="k">Kills</span><span>${state.run.kills}/${state.run.targetKills}</span></div>
        <div><span class="k">Loot</span><span>${state.run.lootCollected}</span></div>
      </div>
    `;

    this.renderInventory(player.inventory, player.equipment);
  }

  private renderInventory(inventory: ItemInstance[], equipment: PlayerState["equipment"]): void {
    const itemById = new Map<string, ItemInstance>();
    for (const item of inventory) {
      itemById.set(item.id, item);
    }
    for (const item of Object.values(equipment)) {
      if (item !== undefined) {
        itemById.set(item.id, item);
      }
    }

    this.inventoryEl.className = "panel-block compact-block inventory-panel";

    const equipmentGrid = EQUIPMENT_SLOTS.map((slot) => {
      const equipped = equipment[slot];
      if (equipped === undefined) {
        return `
          <div class="equip-slot empty">
            <div class="equip-slot-name">${slotLabel(slot)}</div>
            <div class="equip-slot-empty">-</div>
          </div>
        `;
      }

      return `
        <div class="equip-slot filled ${equipped.rarity}" data-item-id="${equipped.id}">
          <div class="equip-slot-head">
            <div class="equip-slot-name">${slotLabel(slot)}</div>
            <button data-unequip-slot="${slot}" title="Unequip ${slotLongLabel(slot)}">×</button>
          </div>
          <img class="item-icon" src="/generated/${equipped.iconId}.png" alt="${equipped.name}" />
        </div>
      `;
    }).join("");

    const inventoryGrid = inventory
      .map(
        (item) => `
        <div class="inventory-cell ${item.rarity}" data-item-id="${item.id}">
          <img class="item-icon" src="/generated/${item.iconId}.png" alt="${item.name}" />
          <button data-item-id="${item.id}" title="Equip ${item.name}">E</button>
        </div>
      `
      )
      .join("");

    this.inventoryEl.innerHTML = `
      <h2>Inventory</h2>
      <div class="equipment-grid">${equipmentGrid}</div>
      <div class="inventory-subhead">Backpack (${inventory.length})</div>
      <div class="inventory-scroll">
        <div class="inventory-grid">${inventoryGrid || '<div class="inventory-empty">No drops yet.</div>'}</div>
      </div>
    `;

    this.inventoryEl.querySelectorAll("button[data-item-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = (button as HTMLButtonElement).dataset.itemId;
        if (id !== undefined) {
          this.onEquip(id);
        }
      });
    });

    this.inventoryEl.querySelectorAll("button[data-unequip-slot]").forEach((button) => {
      button.addEventListener("click", () => {
        const slot = (button as HTMLButtonElement).dataset.unequipSlot as EquipmentSlot | undefined;
        if (slot !== undefined) {
          this.onUnequip(slot);
        }
      });
    });

    this.inventoryEl.querySelectorAll<HTMLElement>("[data-item-id]").forEach((element) => {
      element.addEventListener("mouseenter", (event) => {
        const itemId = element.dataset.itemId;
        if (itemId === undefined) {
          return;
        }
        const item = itemById.get(itemId);
        if (item === undefined) {
          return;
        }
        this.showTooltip(item, event as MouseEvent);
      });

      element.addEventListener("mousemove", (event) => {
        const itemId = element.dataset.itemId;
        if (itemId === undefined) {
          return;
        }
        const item = itemById.get(itemId);
        if (item === undefined) {
          return;
        }
        this.showTooltip(item, event as MouseEvent);
      });

      element.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
    });
  }

  private showTooltip(item: ItemInstance, event: MouseEvent): void {
    const affixes = Object.entries(item.rolledAffixes)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `<div>+${value} ${formatAffixName(key)}</div>`)
      .join("");

    this.tooltipEl.innerHTML = `
      <div class="tooltip-name">${item.name}</div>
      <div class="tooltip-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
      <div class="tooltip-meta">Slot: ${slotLongLabel(item.slot)}</div>
      <div class="tooltip-meta">Req Lvl: ${item.requiredLevel}</div>
      <div class="tooltip-divider"></div>
      <div class="tooltip-affixes">${affixes || "No affixes"}</div>
    `;

    this.tooltipEl.classList.remove("hidden");
    const x = event.clientX + 14;
    const y = event.clientY + 14;
    this.tooltipEl.style.left = `${x}px`;
    this.tooltipEl.style.top = `${y}px`;
  }

  private hideTooltip(): void {
    this.tooltipEl.classList.add("hidden");
  }

  showSummary(summary: RunSummary): void {
    this.summaryEl.classList.remove("hidden");
    this.summaryEl.className = "panel-block";
    this.summaryEl.innerHTML = `
      <h2>Run Ended</h2>
      <div class="stat-line"><span>Floor</span><span>${summary.floorReached}</span></div>
      <div class="stat-line"><span>Kills</span><span>${summary.kills}</span></div>
      <div class="stat-line"><span>Loot</span><span>${summary.lootCollected}</span></div>
      <div class="stat-line"><span>Time</span><span>${(summary.elapsedMs / 1000).toFixed(1)}s</span></div>
      <div class="stat-line"><span>Level</span><span>${summary.leveledTo}</span></div>
      <div class="summary-actions" style="margin-top: 10px;">
        <button id="new-run-button">New Run</button>
      </div>
    `;

    const button = this.summaryEl.querySelector("#new-run-button");
    button?.addEventListener("click", () => this.onNewRun());
  }

  clearSummary(): void {
    this.summaryEl.className = "hidden";
    this.summaryEl.innerHTML = "";
  }
}
