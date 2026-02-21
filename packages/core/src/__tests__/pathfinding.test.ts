import { describe, expect, it } from "vitest";
import { findPath } from "../pathfinding";

describe("findPath", () => {
  it("finds a valid path on walkable tiles", () => {
    const grid = [
      [true, true, true, true],
      [false, false, true, false],
      [true, true, true, true],
      [true, false, false, true]
    ];

    const path = findPath(grid, { x: 0, y: 0 }, { x: 3, y: 3 });
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual({ x: 0, y: 0 });
    expect(path[path.length - 1]).toEqual({ x: 3, y: 3 });

    for (const point of path) {
      expect(grid[point.y]?.[point.x]).toBe(true);
    }
  });
});
