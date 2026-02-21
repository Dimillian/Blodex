import seedrandom from "seedrandom";
export class SeededRng {
    prng;
    constructor(seed) {
        this.prng = seedrandom(seed);
    }
    next() {
        return this.prng.quick();
    }
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    pick(items) {
        if (items.length === 0) {
            throw new Error("Cannot pick from empty array.");
        }
        const index = this.nextInt(0, items.length - 1);
        const item = items[index];
        if (item === undefined) {
            throw new Error("Random pick index out of bounds.");
        }
        return item;
    }
}
//# sourceMappingURL=rng.js.map