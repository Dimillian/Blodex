import type { DungeonLayout } from "./contracts/types";
export interface ProcgenOptions {
    width: number;
    height: number;
    roomCount: number;
    minRoomSize: number;
    maxRoomSize: number;
    seed: string;
}
export declare function generateDungeon(options: ProcgenOptions): DungeonLayout;
//# sourceMappingURL=procgen.d.ts.map