// World layout for the vertical slice. Pure data + geometry helpers (no Phaser).
// Three spaces stacked vertically: Core (top), Observation Lab (middle), Cradle Bay (bottom).

export const TILE = 16;
export const MAP_W = 44;
export const MAP_H = 35;

export type RoomId = 'cradle' | 'lab' | 'core';

export interface Rect { x: number; y: number; w: number; h: number }

/** Floor rectangles in tile units (inclusive start, size in tiles). */
export const ROOMS: Record<RoomId, Rect> = {
  core: { x: 15, y: 2, w: 14, h: 7 },     // x15..28, y2..8
  lab: { x: 4, y: 13, w: 30, h: 10 },     // x4..33, y13..22
  cradle: { x: 4, y: 26, w: 19, h: 7 },   // x4..22, y26..32
};

/** Door passages (tiles carved as floor, blocked while the door is closed). */
export interface DoorDef { id: string; x: number; y: number; w: number; h: number }
export const DOORS: DoorDef[] = [
  { id: 'door_lab', x: 13, y: 23, w: 2, h: 3 },   // Cradle Bay -> Lab
  { id: 'door_core', x: 21, y: 9, w: 2, h: 4 },   // Lab -> Core
];

export function buildGrid(): number[][] {
  // 1 = solid, 0 = floor
  const g: number[][] = [];
  for (let y = 0; y < MAP_H; y++) g.push(new Array(MAP_W).fill(1));
  const carve = (r: Rect) => {
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) g[y][x] = 0;
  };
  Object.values(ROOMS).forEach(carve);
  DOORS.forEach(carve);
  return g;
}

export function roomAt(px: number, py: number): RoomId | null {
  const tx = px / TILE, ty = py / TILE;
  for (const [id, r] of Object.entries(ROOMS) as [RoomId, Rect][]) {
    if (tx >= r.x - 0.5 && tx < r.x + r.w + 0.5 && ty >= r.y - 0.5 && ty < r.y + r.h + 0.5) return id;
  }
  // inside a door passage: attribute to the room below it
  if (ty >= 23 && ty < 26) return 'lab';
  if (ty >= 9 && ty < 13) return 'lab';
  return null;
}

/** Pixel centre of a tile coordinate. */
export const tc = (tx: number) => tx * TILE + TILE / 2;
