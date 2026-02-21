import type { DungeonCorridor, DungeonLayout, DungeonRoom } from "./contracts/types";
import { SeededRng } from "./rng";

function createGrid(width: number, height: number): boolean[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => false));
}

function carveRoom(grid: boolean[][], room: DungeonRoom): void {
  for (let y = room.y; y < room.y + room.height; y += 1) {
    for (let x = room.x; x < room.x + room.width; x += 1) {
      grid[y]![x] = true;
    }
  }
}

function center(room: DungeonRoom): { x: number; y: number } {
  return {
    x: Math.floor(room.x + room.width / 2),
    y: Math.floor(room.y + room.height / 2)
  };
}

function carveCorridor(
  grid: boolean[][],
  from: { x: number; y: number },
  to: { x: number; y: number }
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  let x = from.x;
  let y = from.y;
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);

  while (x !== to.x) {
    grid[y]![x] = true;
    points.push({ x, y });
    x += dx;
  }

  while (y !== to.y) {
    grid[y]![x] = true;
    points.push({ x, y });
    y += dy;
  }

  grid[y]![x] = true;
  points.push({ x, y });
  return points;
}

function roomsOverlap(a: DungeonRoom, b: DungeonRoom): boolean {
  return !(
    a.x + a.width + 1 < b.x ||
    b.x + b.width + 1 < a.x ||
    a.y + a.height + 1 < b.y ||
    b.y + b.height + 1 < a.y
  );
}

export interface ProcgenOptions {
  width: number;
  height: number;
  roomCount: number;
  minRoomSize: number;
  maxRoomSize: number;
  seed: string;
}

export function generateDungeon(options: ProcgenOptions): DungeonLayout {
  const rng = new SeededRng(options.seed);
  const grid = createGrid(options.width, options.height);
  const rooms: DungeonRoom[] = [];

  for (let attempt = 0; attempt < options.roomCount * 6 && rooms.length < options.roomCount; attempt += 1) {
    const width = rng.nextInt(options.minRoomSize, options.maxRoomSize);
    const height = rng.nextInt(options.minRoomSize, options.maxRoomSize);
    const x = rng.nextInt(1, options.width - width - 2);
    const y = rng.nextInt(1, options.height - height - 2);

    const room: DungeonRoom = {
      id: `room-${rooms.length}`,
      x,
      y,
      width,
      height
    };

    if (rooms.some((existing) => roomsOverlap(room, existing))) {
      continue;
    }

    rooms.push(room);
    carveRoom(grid, room);
  }

  if (rooms.length < 2) {
    throw new Error("Procgen failed to place enough rooms.");
  }

  const corridors: DungeonCorridor[] = [];
  for (let i = 1; i < rooms.length; i += 1) {
    const fromRoom = rooms[i - 1]!;
    const toRoom = rooms[i]!;
    const path = carveCorridor(grid, center(fromRoom), center(toRoom));
    corridors.push({
      fromRoomId: fromRoom.id,
      toRoomId: toRoom.id,
      path
    });
  }

  const spawnPoints = rooms.slice(1).map((room) => center(room));
  const playerSpawn = center(rooms[0]!);
  const layoutHash = `${options.seed}:${rooms.length}:${corridors.length}`;

  return {
    width: options.width,
    height: options.height,
    walkable: grid,
    rooms,
    corridors,
    spawnPoints,
    playerSpawn,
    layoutHash
  };
}
