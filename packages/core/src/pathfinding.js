function key(x, y) {
    return `${x},${y}`;
}
function fromKey(serialized) {
    const [rawX, rawY] = serialized.split(",");
    const x = Number.parseInt(rawX ?? "", 10);
    const y = Number.parseInt(rawY ?? "", 10);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`Invalid node key: ${serialized}`);
    }
    return { x, y };
}
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function neighbors(node, walkable) {
    const deltas = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];
    return deltas
        .map((delta) => ({ x: node.x + delta.x, y: node.y + delta.y }))
        .filter((candidate) => {
        const row = walkable[candidate.y];
        return row !== undefined && row[candidate.x] === true;
    });
}
function reconstructPath(cameFrom, current) {
    const path = [fromKey(current)];
    let cursor = current;
    while (cameFrom.has(cursor)) {
        const parent = cameFrom.get(cursor);
        if (parent === undefined) {
            break;
        }
        path.push(fromKey(parent));
        cursor = parent;
    }
    return path.reverse();
}
export function findPath(walkable, start, target) {
    const startKey = key(start.x, start.y);
    const targetKey = key(target.x, target.y);
    if (startKey === targetKey) {
        return [start];
    }
    const openSet = new Set([startKey]);
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, heuristic(start, target)]]);
    while (openSet.size > 0) {
        let current = "";
        let best = Number.POSITIVE_INFINITY;
        for (const candidate of openSet) {
            const score = fScore.get(candidate) ?? Number.POSITIVE_INFINITY;
            if (score < best) {
                best = score;
                current = candidate;
            }
        }
        if (current === targetKey) {
            return reconstructPath(cameFrom, current);
        }
        openSet.delete(current);
        const currentNode = fromKey(current);
        for (const neighbor of neighbors(currentNode, walkable)) {
            const neighborKey = key(neighbor.x, neighbor.y);
            const tentative = (gScore.get(current) ?? Number.POSITIVE_INFINITY) + 1;
            if (tentative < (gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentative);
                fScore.set(neighborKey, tentative + heuristic(neighbor, target));
                openSet.add(neighborKey);
            }
        }
    }
    return [];
}
//# sourceMappingURL=pathfinding.js.map