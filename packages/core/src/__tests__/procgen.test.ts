import { describe, expect, it } from "vitest";
import { generateDungeon } from "../procgen";

describe("generateDungeon", () => {
  it("is deterministic for identical seeds", () => {
    const a = generateDungeon({
      width: 50,
      height: 50,
      roomCount: 10,
      minRoomSize: 4,
      maxRoomSize: 8,
      seed: "seed-123"
    });

    const b = generateDungeon({
      width: 50,
      height: 50,
      roomCount: 10,
      minRoomSize: 4,
      maxRoomSize: 8,
      seed: "seed-123"
    });

    expect(a.layoutHash).toBe(b.layoutHash);
    expect(a.rooms).toEqual(b.rooms);
    expect(a.corridors).toEqual(b.corridors);
  });

  it("creates reachable room centers along corridors", () => {
    const dungeon = generateDungeon({
      width: 50,
      height: 50,
      roomCount: 8,
      minRoomSize: 4,
      maxRoomSize: 8,
      seed: "seed-rooms"
    });

    expect(dungeon.rooms.length).toBeGreaterThanOrEqual(4);
    expect(dungeon.corridors.length).toBe(dungeon.rooms.length - 1);
    for (const corridor of dungeon.corridors) {
      expect(corridor.path.length).toBeGreaterThan(0);
    }
  });
});
