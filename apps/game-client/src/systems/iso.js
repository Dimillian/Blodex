export function gridToIso(gridX, gridY, tileWidth, tileHeight, originX, originY) {
    return {
        x: (gridX - gridY) * (tileWidth / 2) + originX,
        y: (gridX + gridY) * (tileHeight / 2) + originY
    };
}
export function isoToGrid(isoX, isoY, tileWidth, tileHeight, originX, originY) {
    const localX = isoX - originX;
    const localY = isoY - originY;
    return {
        x: (localY / (tileHeight / 2) + localX / (tileWidth / 2)) / 2,
        y: (localY / (tileHeight / 2) - localX / (tileWidth / 2)) / 2
    };
}
//# sourceMappingURL=iso.js.map