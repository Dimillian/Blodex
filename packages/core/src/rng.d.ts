import type { RngLike } from "./contracts/types";
export declare class SeededRng implements RngLike {
    private readonly prng;
    constructor(seed: string);
    next(): number;
    nextInt(min: number, max: number): number;
    pick<T>(items: T[]): T;
}
//# sourceMappingURL=rng.d.ts.map