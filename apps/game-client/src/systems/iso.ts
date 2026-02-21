export interface IsoPoint {
  x: number;
  y: number;
}

export function gridToIso(
  gridX: number,
  gridY: number,
  tileWidth: number,
  tileHeight: number,
  originX: number,
  originY: number
): IsoPoint {
  return {
    x: (gridX - gridY) * (tileWidth / 2) + originX,
    y: (gridX + gridY) * (tileHeight / 2) + originY
  };
}

export function isoToGrid(
  isoX: number,
  isoY: number,
  tileWidth: number,
  tileHeight: number,
  originX: number,
  originY: number
): IsoPoint {
  const localX = isoX - originX;
  const localY = isoY - originY;

  return {
    x: (localY / (tileHeight / 2) + localX / (tileWidth / 2)) / 2,
    y: (localY / (tileHeight / 2) - localX / (tileWidth / 2)) / 2
  };
}
