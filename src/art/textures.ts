// All art is original and generated at boot from code: pixel sprites from string rows,
// props and the room drawn with canvas primitives. No external image assets.
import Phaser from 'phaser';
import { buildGrid, MAP_H, MAP_W, TILE } from '../world/map';

export const PAL: Record<string, string> = {
  K: '#06080e', // near-black
  N: '#0d1424', // navy
  n: '#16213a',
  B: '#24324d', // blue-grey
  G: '#4a5a73', // metal grey
  g: '#7d8ca3',
  W: '#c9d4e3', // pale
  C: '#62d6d8', // cyan
  T: '#2a7f86', // teal
  A: '#e0a64a', // amber
  R: '#d0453b', // red
  S: '#d6a68c', // skin
  s: '#9c6f5d', // skin shadow
  f: '#3a3f4f', // faceless shadow
  H: '#1b1820', // dark hair
  h: '#4b3426', // brown hair
  w: '#b9c3cf', // gown
  v: '#8792a3', // gown shade
  L: '#e2e6ec', // lab coat
  l: '#a9b0bb',
  D: '#2c3446', // dark shirt
  d: '#1e2533',
};

type Ctx = CanvasRenderingContext2D;

function canvasTex(scene: Phaser.Scene, key: string, w: number, h: number, draw: (c: Ctx) => void) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const t = scene.textures.createCanvas(key, w, h)!;
  const c = t.getContext();
  c.imageSmoothingEnabled = false;
  draw(c);
  t.refresh();
}

const rect = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  c.fillStyle = col;
  c.fillRect(x, y, w, h);
};

function rowsTex(scene: Phaser.Scene, key: string, rows: string[], map: (ch: string, x: number, y: number) => string | null = (ch) => PAL[ch] ?? null) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  canvasTex(scene, key, w, h, (c) => {
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = row[x] === '.' ? null : map(row[x], x, y);
        if (col) rect(c, x, y, 1, 1, col);
      }
    });
  });
}

// deterministic pseudo-random
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------------------------------------------------------------- characters (Concept C Production)
const px = (c: CanvasRenderingContext2D, x: number, y: number, col: string) => { c.fillStyle = col; c.fillRect(x, y, 1, 1); };
const bx = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, col: string) => { c.fillStyle = col; c.fillRect(x, y, w, h); };

function drawConceptC(c: CanvasRenderingContext2D, dir: 'down' | 'up' | 'side', step: number) {
  let bob = 0, legL = 0, legR = 0, armL = 0, armR = 0;
  if (step === 1) { legL = -2; legR = 2; armL = 1; armR = -1; bob = 0; }
  const yOff = bob;

  if (dir === 'down') {
    // Hair bun & head
    bx(c, 7, 3 + yOff, 3, 2, '#161c28'); px(c, 8, 2 + yOff, '#0c0f16'); px(c, 8, 3 + yOff, '#2a364a');
    bx(c, 5, 4 + yOff, 6, 2, '#161c28'); px(c, 6, 4 + yOff, '#2a364a'); px(c, 7, 4 + yOff, '#2a364a');
    bx(c, 4, 6 + yOff, 2, 4, '#161c28'); bx(c, 10, 6 + yOff, 2, 4, '#161c28');
    // Face (Dr. Mira Sen / Concept C)
    bx(c, 6, 6 + yOff, 4, 4, '#d8a086'); px(c, 6, 7 + yOff, '#161a24'); px(c, 9, 7 + yOff, '#161a24');
    px(c, 6, 9 + yOff, '#a87460'); px(c, 9, 9 + yOff, '#a87460');
    // Collar
    bx(c, 6, 10 + yOff, 4, 1, '#0e121a'); bx(c, 6, 11 + yOff, 4, 1, '#242e3e'); px(c, 7, 11 + yOff, '#e6a541');
    // Shoulders
    bx(c, 3, 12 + yOff, 10, 1, '#242e3e');
    // Asymmetric jacket: dark right torso, slate chest panel left
    bx(c, 4, 13 + yOff, 3, 5, '#242e3e'); px(c, 5, 14 + yOff, '#e6a541');
    bx(c, 7, 13 + yOff, 4, 5, '#73869e'); px(c, 7, 12 + yOff, '#94a8c2'); px(c, 8, 13 + yOff, '#94a8c2'); px(c, 10, 17 + yOff, '#e6a541');
    // Right arm
    bx(c, 2, 13 + yOff + armR, 2, 4, '#242e3e'); bx(c, 2, 17 + yOff + armR, 2, 4, '#161c28');
    // Left arm (HAS GLOWING CYAN ECHO DEVICE)
    bx(c, 12, 13 + yOff + armL, 2, 4, '#242e3e'); bx(c, 12, 17 + yOff + armL, 2, 1, '#161c28');
    bx(c, 12, 18 + yOff + armL, 2, 2, '#00ebf5'); px(c, 12, 18 + yOff + armL, '#c5ffff'); px(c, 13, 19 + yOff + armL, '#0091aa');
    bx(c, 12, 20 + yOff + armL, 2, 1, '#161c28');
    // Utility belt
    bx(c, 4, 18 + yOff, 8, 1, '#12161e'); px(c, 4, 18 + yOff, '#2e3a4c'); px(c, 11, 18 + yOff, '#2e3a4c');
    px(c, 7, 18 + yOff, '#94a8c2'); px(c, 10, 19 + yOff, '#e6a541');
    // Trousers
    bx(c, 5, 19 + yOff, 3, 5 + legL, '#1e2634'); bx(c, 8, 19 + yOff, 3, 5 + legR, '#1e2634');
    bx(c, 5, 24 + yOff + Math.floor(legL / 2), 3, 2, '#344054'); px(c, 6, 24 + yOff + Math.floor(legL / 2), '#e6a541');
    bx(c, 8, 24 + yOff + Math.floor(legR / 2), 3, 2, '#344054'); px(c, 9, 24 + yOff + Math.floor(legR / 2), '#e6a541');
    bx(c, 5, 26 + yOff + legL, 3, 2, '#121822'); bx(c, 8, 26 + yOff + legR, 3, 2, '#121822');
    // Boots grounded at y=31
    bx(c, 4, 28 + legL, 4, 3, '#10141c'); px(c, 4, 29 + legL, '#e6a541'); bx(c, 4, 31, 4, 1, '#0a0c12');
    bx(c, 8, 28 + legR, 4, 3, '#10141c'); px(c, 11, 29 + legR, '#e6a541'); bx(c, 8, 31, 4, 1, '#0a0c12');
  } else if (dir === 'up') {
    // Hair bun from behind
    bx(c, 6, 2 + yOff, 4, 3, '#161c28'); px(c, 7, 2 + yOff, '#2a364a'); px(c, 8, 2 + yOff, '#2a364a');
    bx(c, 4, 5 + yOff, 8, 5, '#161c28'); px(c, 5, 5 + yOff, '#2a364a'); px(c, 10, 5 + yOff, '#2a364a');
    bx(c, 6, 10 + yOff, 4, 2, '#0e121a');
    bx(c, 3, 12 + yOff, 10, 1, '#242e3e'); bx(c, 4, 13 + yOff, 8, 5, '#242e3e');
    // Back diagonal slate seam
    px(c, 4, 13 + yOff, '#73869e'); px(c, 5, 13 + yOff, '#73869e'); px(c, 6, 14 + yOff, '#73869e');
    px(c, 7, 14 + yOff, '#73869e'); px(c, 8, 15 + yOff, '#73869e'); px(c, 9, 15 + yOff, '#73869e'); px(c, 9, 16 + yOff, '#e6a541');
    // Arms
    bx(c, 2, 13 + yOff - armL, 2, 5, '#242e3e'); bx(c, 2, 18 + yOff - armL, 2, 1, '#00ebf5'); px(c, 2, 18 + yOff - armL, '#c5ffff'); bx(c, 2, 19 + yOff - armL, 2, 2, '#161c28');
    bx(c, 12, 13 + yOff - armR, 2, 5, '#242e3e'); bx(c, 12, 18 + yOff - armR, 2, 3, '#161c28');
    // Belt
    bx(c, 4, 18 + yOff, 8, 1, '#12161e'); px(c, 5, 19 + yOff, '#e6a541');
    // Trousers & boots
    bx(c, 5, 19 + yOff, 3, 8 - legL, '#1e2634'); bx(c, 8, 19 + yOff, 3, 8 - legR, '#1e2634');
    bx(c, 4, 28 - legL, 4, 3, '#10141c'); px(c, 5, 29 - legL, '#e6a541'); bx(c, 4, 31, 4, 1, '#0a0c12');
    bx(c, 8, 28 - legR, 4, 3, '#10141c'); px(c, 9, 29 - legR, '#e6a541'); bx(c, 8, 31, 4, 1, '#0a0c12');
  } else {
    // Side view (facing right)
    bx(c, 4, 3 + yOff, 3, 3, '#161c28'); px(c, 5, 3 + yOff, '#2a364a');
    bx(c, 6, 4 + yOff, 5, 3, '#161c28'); bx(c, 5, 7 + yOff, 4, 3, '#161c28');
    bx(c, 9, 6 + yOff, 2, 4, '#d8a086'); px(c, 11, 7 + yOff, '#d8a086'); px(c, 10, 7 + yOff, '#161a24'); px(c, 9, 9 + yOff, '#a87460');
    bx(c, 7, 10 + yOff, 4, 2, '#242e3e');
    bx(c, 5, 12 + yOff, 6, 6, '#242e3e'); px(c, 9, 13 + yOff, '#73869e'); px(c, 10, 13 + yOff, '#94a8c2'); px(c, 10, 15 + yOff, '#e6a541');
    bx(c, 6, 12 + yOff + armR, 3, 4, '#242e3e'); bx(c, 6, 16 + yOff + armR, 2, 4, '#161c28');
    if (armL > 0) { px(c, 10, 17 + yOff + armL, '#00ebf5'); px(c, 10, 18 + yOff + armL, '#c5ffff'); }
    else if (armL < 0) { px(c, 3, 17 + yOff + armL, '#00ebf5'); }
    bx(c, 5, 18 + yOff, 6, 1, '#12161e'); bx(c, 7, 18 + yOff, 2, 2, '#2e3a4c'); px(c, 9, 19 + yOff, '#e6a541');
    bx(c, 6, 20 + yOff, 4, 7, '#1e2634'); px(c, 9, 24 + yOff, '#344054'); px(c, 9, 25 + yOff, '#e6a541');
    bx(c, 7 + legR, 28, 4, 3, '#10141c'); px(c, 10 + legR, 29, '#e6a541'); bx(c, 7 + legR, 31, 4, 1, '#0a0c12');
    if (step > 0 && Math.abs(legL) > 0) { bx(c, 5 - legR, 28, 3, 3, '#10141c'); px(c, 4 - legR, 29, '#e6a541'); bx(c, 5 - legR, 31, 3, 1, '#0a0c12'); }
  }
}

function drawGhost(c: CanvasRenderingContext2D, dir: 'down' | 'up' | 'side', step: number) {
  let bob = 0, legL = 0, legR = 0, armL = 0, armR = 0;
  if (step === 1) { legL = -2; legR = 2; armL = 1; armR = -1; bob = 0; }
  const yOff = bob;

  if (dir === 'down') {
    bx(c, 7, 3 + yOff, 3, 2, '#202834');
    bx(c, 5, 4 + yOff, 6, 2, '#384456');
    bx(c, 4, 6 + yOff, 2, 4, '#202834'); bx(c, 10, 6 + yOff, 2, 4, '#202834');
    // FACELESS VOID
    bx(c, 6, 6 + yOff, 4, 4, '#1a202a');
    bx(c, 6, 10 + yOff, 4, 2, '#202834');
    bx(c, 3, 12 + yOff, 10, 1, '#384456'); bx(c, 4, 13 + yOff, 8, 5, '#384456');
    bx(c, 7, 13 + yOff, 4, 4, '#5c6e88');
    bx(c, 2, 13 + yOff + armR, 2, 8, '#202834');
    bx(c, 12, 13 + yOff + armL, 2, 8, '#202834');
    px(c, 12, 18 + yOff + armL, '#00ebf5'); px(c, 13, 18 + yOff + armL, '#00ebf5');
    bx(c, 4, 18 + yOff, 8, 1, '#202834');
    bx(c, 5, 19 + yOff, 3, 9 + legL, '#384456'); bx(c, 8, 19 + yOff, 3, 9 + legR, '#384456');
    bx(c, 4, 28 + legL, 4, 4, '#202834'); bx(c, 8, 28 + legR, 4, 4, '#202834');
  } else if (dir === 'up') {
    bx(c, 6, 2 + yOff, 4, 3, '#202834'); bx(c, 4, 5 + yOff, 8, 5, '#384456');
    bx(c, 6, 10 + yOff, 4, 2, '#202834'); bx(c, 3, 12 + yOff, 10, 1, '#384456'); bx(c, 4, 13 + yOff, 8, 5, '#384456');
    bx(c, 2, 13 + yOff - armL, 2, 8, '#202834'); px(c, 2, 18 + yOff - armL, '#00ebf5');
    bx(c, 12, 13 + yOff - armR, 2, 8, '#202834'); bx(c, 4, 18 + yOff, 8, 1, '#202834');
    bx(c, 5, 19 + yOff, 3, 9 - legL, '#384456'); bx(c, 8, 19 + yOff, 3, 9 - legR, '#384456');
    bx(c, 4, 28 - legL, 4, 4, '#202834'); bx(c, 8, 28 - legR, 4, 4, '#202834');
  } else {
    bx(c, 4, 3 + yOff, 3, 3, '#202834'); bx(c, 6, 4 + yOff, 5, 3, '#384456');
    bx(c, 9, 6 + yOff, 2, 4, '#1a202a');
    bx(c, 7, 10 + yOff, 4, 2, '#202834'); bx(c, 5, 12 + yOff, 6, 6, '#384456');
    bx(c, 6, 12 + yOff + armR, 3, 8, '#202834'); bx(c, 5, 18 + yOff, 6, 1, '#202834');
    bx(c, 6, 20 + yOff, 4, 8, '#384456'); bx(c, 7 + legR, 28, 4, 4, '#202834');
    if (step > 0 && Math.abs(legL) > 0) bx(c, 5 - legR, 28, 3, 4, '#202834');
  }
}

function drawMira(c: CanvasRenderingContext2D, dir: 'down' | 'up' | 'side', faceless: boolean, step: number) {
  const leg = step === 1 ? 1 : 0;
  if (dir === 'down') {
    bx(c, 5, 4, 6, 3, '#161c28');
    bx(c, 6, 6, 4, 4, faceless ? '#1a202a' : '#d8a086');
    if (!faceless) { px(c, 6, 7, '#161a24'); px(c, 9, 7, '#161a24'); }
    bx(c, 6, 10, 4, 2, '#a0aebb');
    bx(c, 3, 12, 10, 8, '#dee6f2'); bx(c, 8, 12, 1, 8, '#a0aebb');
    bx(c, 2, 12 + leg, 2, 6, '#dee6f2'); bx(c, 12, 12 - leg, 2, 6, '#dee6f2');
    bx(c, 5, 20, 3, 8 + leg, '#1e2634'); bx(c, 8, 20, 3, 8 - leg, '#1e2634');
    bx(c, 4, 28 + leg, 4, 4, '#10141c'); bx(c, 8, 28 - leg, 4, 4, '#10141c');
  } else if (dir === 'up') {
    bx(c, 4, 4, 8, 6, '#161c28'); bx(c, 3, 12, 10, 8, '#dee6f2');
    bx(c, 2, 12 - leg, 2, 6, '#dee6f2'); bx(c, 12, 12 + leg, 2, 6, '#dee6f2');
    bx(c, 5, 20, 3, 8 - leg, '#1e2634'); bx(c, 8, 20, 3, 8 + leg, '#1e2634');
    bx(c, 4, 28 - leg, 4, 4, '#10141c'); bx(c, 8, 28 + leg, 4, 4, '#10141c');
  } else {
    bx(c, 5, 4, 5, 4, '#161c28');
    bx(c, 9, 6, 2, 4, faceless ? '#1a202a' : '#d8a086');
    bx(c, 5, 12, 6, 8, '#dee6f2'); bx(c, 6, 13 + leg, 3, 6, '#dee6f2');
    bx(c, 6, 20, 4, 8, '#1e2634'); bx(c, 6 + leg, 28, 4, 4, '#10141c');
  }
}

function drawVoss(c: CanvasRenderingContext2D, dir: 'down' | 'up', faceless: boolean) {
  if (dir === 'down') {
    bx(c, 5, 3, 6, 3, '#342c24');
    bx(c, 6, 5, 4, 5, faceless ? '#1a202a' : '#d8a086');
    if (!faceless) { px(c, 6, 7, '#161a24'); px(c, 9, 7, '#161a24'); }
    bx(c, 2, 10, 12, 2, '#1c2430'); bx(c, 3, 12, 10, 7, '#303a4a');
    bx(c, 1, 11, 2, 8, '#1c2430'); bx(c, 13, 11, 2, 8, '#1c2430');
    bx(c, 3, 19, 10, 2, '#12161e');
    bx(c, 5, 21, 3, 7, '#1e2634'); bx(c, 8, 21, 3, 7, '#1e2634');
    bx(c, 4, 28, 4, 4, '#10141c'); bx(c, 8, 28, 4, 4, '#10141c');
  } else {
    bx(c, 4, 3, 8, 5, '#342c24'); bx(c, 2, 10, 12, 9, '#303a4a');
    bx(c, 1, 11, 2, 8, '#1c2430'); bx(c, 13, 11, 2, 8, '#1c2430');
    bx(c, 3, 19, 10, 2, '#12161e');
    bx(c, 5, 21, 3, 7, '#1e2634'); bx(c, 8, 21, 3, 7, '#1e2634');
    bx(c, 4, 28, 4, 4, '#10141c'); bx(c, 8, 28, 4, 4, '#10141c');
  }
}

export const DIRS = ['down', 'up', 'side'] as const;

function makeCharacters(scene: Phaser.Scene) {
  // Concept C Player & matching characters (16x32, grounded at y=31)
  for (const d of DIRS) {
    [0, 1].forEach((i) => {
      canvasTex(scene, `p_${d}_${i}`, 16, 32, (c) => drawConceptC(c, d, i));
      canvasTex(scene, `ghost_${d}_${i}`, 16, 32, (c) => drawGhost(c, d, i));
      canvasTex(scene, `mira_${d}_${i}`, 16, 32, (c) => drawMira(c, d, true, i));
      canvasTex(scene, `miraface_${d}_${i}`, 16, 32, (c) => drawMira(c, d, false, i));
    });
  }

  // Kneeling ghost at floor plate 3 (16x32)
  canvasTex(scene, 'ghost_kneel', 16, 32, (c) => {
    bx(c, 6, 10, 5, 4, '#161c28'); bx(c, 6, 13, 4, 3, '#1a202a');
    bx(c, 4, 16, 8, 6, '#384456'); px(c, 7, 17, '#5c6e88');
    bx(c, 3, 17, 2, 6, '#202834'); bx(c, 11, 17, 2, 6, '#202834');
    px(c, 11, 21, '#00ebf5');
    bx(c, 4, 23, 8, 5, '#384456'); bx(c, 4, 28, 8, 4, '#202834');
  });

  // Mira with cane (16x32)
  canvasTex(scene, 'mira_cane', 16, 32, (c) => {
    drawMira(c, 'down', true, 0);
    bx(c, 13, 18, 1, 14, '#a0b0c2'); px(c, 13, 17, '#e6a541');
  });
  canvasTex(scene, 'miraface_cane', 16, 32, (c) => {
    drawMira(c, 'down', false, 0);
    bx(c, 13, 18, 1, 14, '#a0b0c2'); px(c, 13, 17, '#e6a541');
  });

  // Elias Voss (16x32)
  canvasTex(scene, 'voss_down', 16, 32, (c) => drawVoss(c, 'down', false));
  canvasTex(scene, 'voss_faceless', 16, 32, (c) => drawVoss(c, 'down', true));
  canvasTex(scene, 'voss_up', 16, 32, (c) => drawVoss(c, 'up', false));

  // Tender drone (16x16)
  canvasTex(scene, 'tender_0', 16, 16, (c) => {
    bx(c, 3, 5, 10, 5, '#404c5e'); bx(c, 4, 4, 8, 1, '#697c96');
    bx(c, 11, 6, 2, 2, '#f5af37');
    bx(c, 3, 10, 2, 6, '#242c38'); bx(c, 11, 10, 2, 6, '#242c38');
    bx(c, 6, 10, 1, 6, '#404c5e'); bx(c, 9, 10, 1, 6, '#404c5e');
  });
  canvasTex(scene, 'tender_1', 16, 16, (c) => {
    bx(c, 3, 5, 10, 5, '#404c5e'); bx(c, 4, 4, 8, 1, '#697c96');
    bx(c, 11, 6, 2, 2, '#f5af37');
    bx(c, 2, 10, 2, 6, '#242c38'); bx(c, 12, 10, 2, 6, '#242c38');
    bx(c, 7, 10, 1, 6, '#404c5e'); bx(c, 8, 10, 1, 6, '#404c5e');
  });
}

// ---------------------------------------------------------------- room map
function makeMap(scene: Phaser.Scene) {
  const grid = buildGrid();
  const solid = (x: number, y: number) => x < 0 || y < 0 || x >= MAP_W || y >= MAP_H || grid[y][x] === 1;
  const nearFloor = (x: number, y: number) => {
    for (let dy = -3; dy <= 3; dy++) for (let dx = -2; dx <= 2; dx++) if (!solid(x + dx, y + dy)) return true;
    return false;
  };
  const r = rng(17);
  canvasTex(scene, 'map', MAP_W * TILE, MAP_H * TILE, (c) => {
    rect(c, 0, 0, MAP_W * TILE, MAP_H * TILE, '#020307');
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const px = x * TILE, py = y * TILE;
        if (!solid(x, y)) {
          // floor panel
          const v = r();
          rect(c, px, py, TILE, TILE, v < 0.5 ? '#121a2b' : '#111827');
          rect(c, px, py, TILE, 1, '#0b1120');
          rect(c, px, py, 1, TILE, '#0b1120');
          rect(c, px + 1, py + 1, TILE - 1, 1, '#18223a');
          if (v > 0.7) { rect(c, px + 3, py + 3, 1, 1, '#1f2b45'); rect(c, px + 12, py + 12, 1, 1, '#1f2b45'); }
          if (v < 0.12) rect(c, px + 5 + Math.floor(r() * 6), py + 6 + Math.floor(r() * 5), 2, 1, '#0d1322');
          // shadow under a wall face
          if (solid(x, y - 1)) { rect(c, px, py, TILE, 3, '#070b14'); rect(c, px, py + 3, TILE, 1, '#0b101c'); }
          if (solid(x - 1, y)) rect(c, px, py, 2, TILE, '#0a0f1b');
        } else if (!solid(x, y + 1)) {
          // wall face (south-facing)
          rect(c, px, py, TILE, TILE, '#202b44');
          rect(c, px, py, TILE, 2, '#2f3d5c');
          rect(c, px, py + 5, TILE, 1, '#3a4a6b');
          rect(c, px, py + 6, TILE, 1, '#151d30');
          rect(c, px, py + 13, TILE, 3, '#121a2b');
          if (x % 3 === 0) rect(c, px, py + 2, 1, 11, '#172038');
          if (x % 4 === 1) { rect(c, px + 6, py + 9, 4, 1, '#3c4f74'); }
        } else if (nearFloor(x, y)) {
          // wall top
          rect(c, px, py, TILE, TILE, '#0a0e18');
          if (!solid(x, y + 2) || !solid(x - 1, y) || !solid(x + 1, y)) rect(c, px, py, TILE, TILE, '#0c111d');
          // rim highlight where the wall top meets a face below
          if (solid(x, y + 1) && !solid(x, y + 2)) rect(c, px, py + TILE - 1, TILE, 1, '#3b4b6c');
          if (!solid(x - 1, y)) rect(c, px, py, 1, TILE, '#273451');
          if (!solid(x + 1, y)) rect(c, px + TILE - 1, py, 1, TILE, '#273451');
          if (!solid(x, y - 1)) rect(c, px, py, TILE, 1, '#273451');
        }
      }
    }
    // Lab wall stencil "A MEMORY YOU CAN EDIT IS NOT EVIDENCE." as abstract glyph marks (x15..19, face row 12)
    const sx = 15 * TILE + 3, sy = 12 * TILE + 8;
    const rs = rng(4);
    for (let i = 0; i < 70; i++) {
      if (i % 12 === 11) continue;
      rect(c, sx + i, sy + (i > 36 ? 3 : 0) - (i > 36 ? 0 : 0), 1, rs() > 0.25 ? 2 : 1, '#8090ad');
    }
    rect(c, sx, sy + 6, 72, 1, '#6d7fa3');
    rect(c, sx + 2, sy + 7, 66, 1, '#5a6a8c');
  });
}

// ---------------------------------------------------------------- props
function makeProps(scene: Phaser.Scene) {
  // Cradle (open pod, warm gel)
  canvasTex(scene, 'cradle', 34, 22, (c) => {
    rect(c, 1, 3, 32, 18, '#2b3753');
    rect(c, 0, 4, 34, 16, '#2b3753');
    rect(c, 2, 5, 30, 14, '#0f2a33');
    rect(c, 3, 6, 28, 12, '#1d5a63');
    rect(c, 4, 7, 26, 10, '#2a7f86');
    rect(c, 5, 8, 6, 2, '#62d6d8');
    rect(c, 2, 0, 30, 4, '#3a4a6b'); // lid slid back
    rect(c, 2, 0, 30, 1, '#5a6d92');
    rect(c, 26, 18, 6, 2, '#e0a64a');
    rect(c, 1, 20, 32, 2, '#0b0f19');
  });
  canvasTex(scene, 'cradle_closed', 34, 22, (c) => {
    rect(c, 0, 4, 34, 16, '#2b3753');
    rect(c, 2, 2, 30, 18, '#3a4a6b');
    rect(c, 4, 5, 26, 12, '#24324d');
    rect(c, 1, 20, 32, 2, '#0b0f19');
  });
  // tally marks inside the lid (echo only)
  canvasTex(scene, 'tally', 30, 4, (c) => {
    for (let i = 0; i < 16; i++) {
      const g = Math.floor(i / 4);
      const x = 2 + g * 7 + (i % 4);
      rect(c, x, 0, 1, 4, '#ffffff');
    }
  });
  // Voss's stasis pod (frosted, a shape inside)
  canvasTex(scene, 'voss_pod', 34, 22, (c) => {
    rect(c, 0, 4, 34, 16, '#2b3753');
    rect(c, 2, 2, 30, 18, '#3a4a6b');
    rect(c, 4, 4, 26, 13, '#8fb4c8');
    rect(c, 5, 5, 24, 11, '#a9c8d6');
    rect(c, 9, 7, 6, 6, '#5d7486'); // head
    rect(c, 15, 8, 12, 5, '#6d8597'); // body
    rect(c, 6, 6, 3, 2, '#d8eef5');
    rect(c, 22, 13, 4, 1, '#d8eef5');
    rect(c, 26, 18, 6, 1, '#62d6d8');
    rect(c, 1, 20, 32, 2, '#0b0f19');
  });
  canvasTex(scene, 'voss_pod_open', 34, 22, (c) => {
    rect(c, 0, 4, 34, 16, '#2b3753');
    rect(c, 2, 5, 30, 14, '#0f1626');
    rect(c, 2, 0, 30, 4, '#3a4a6b');
    rect(c, 1, 20, 32, 2, '#0b0f19');
  });
  // terminal (against wall)
  canvasTex(scene, 'terminal', 16, 24, (c) => {
    rect(c, 1, 2, 14, 20, '#2b3753');
    rect(c, 2, 3, 12, 9, '#0b1d24');
    rect(c, 3, 4, 10, 7, '#123a40');
    rect(c, 4, 5, 6, 1, '#62d6d8');
    rect(c, 4, 7, 8, 1, '#3aa3a8');
    rect(c, 4, 9, 4, 1, '#3aa3a8');
    rect(c, 2, 14, 12, 4, '#3a4a6b');
    rect(c, 3, 15, 2, 1, '#e0a64a');
    rect(c, 1, 22, 14, 2, '#0b0f19');
  });
  // mug (present: glued) / echo: whole + steam
  rowsTex(scene, 'mug', ['.....', 'WWWW.', 'WgWWg', 'WWWW.', '.gg..']);
  rowsTex(scene, 'mug_echo', ['.W.W.', '.....', 'WWWW.', 'WAWWW', 'WWWWW', '.WW..'].map((r) => r));
  // locker
  canvasTex(scene, 'locker', 14, 26, (c) => {
    rect(c, 0, 0, 14, 24, '#33415f');
    rect(c, 1, 1, 12, 22, '#2b3753');
    rect(c, 2, 3, 10, 1, '#1b2438');
    rect(c, 2, 5, 10, 1, '#1b2438');
    rect(c, 9, 11, 3, 4, '#62d6d8'); // palm plate
    rect(c, 2, 1, 6, 2, '#c9d4e3'); // label
    rect(c, 0, 24, 14, 2, '#0b0f19');
  });
  canvasTex(scene, 'locker_open', 14, 26, (c) => {
    rect(c, 0, 0, 14, 24, '#33415f');
    rect(c, 1, 1, 12, 22, '#0b0f19');
    rect(c, 3, 3, 8, 12, '#d9dde4'); // jacket
    rect(c, 3, 3, 8, 1, '#a9b0bb');
    rect(c, 6, 15, 1, 5, '#2a7f86'); // empty lanyard
    rect(c, 3, 21, 6, 1, '#24324d'); // clean dust rectangle
    rect(c, 0, 24, 14, 2, '#0b0f19');
  });
  rowsTex(scene, 'card', ['AAAAAA', 'AWWAAA', 'AAAAAA']);
  // floor plates
  canvasTex(scene, 'plate', 16, 16, (c) => {
    rect(c, 1, 1, 14, 14, '#18223a');
    rect(c, 2, 2, 12, 12, '#141d31');
    [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => rect(c, x, y, 1, 1, '#4a5a73'));
  });
  canvasTex(scene, 'plate_raised', 16, 16, (c) => {
    rect(c, 1, 0, 14, 15, '#1b2640');
    rect(c, 2, 1, 12, 12, '#162038');
    rect(c, 1, 15, 14, 1, '#05070c');
    [[2, 1], [13, 1], [2, 12], [13, 12]].forEach(([x, y]) => rect(c, x, y, 1, 1, '#4a5a73'));
  });
  canvasTex(scene, 'plate_open', 16, 16, (c) => {
    rect(c, 1, 1, 14, 14, '#05070c');
    rect(c, 2, 4, 12, 1, '#2a3550');
    rect(c, 3, 9, 10, 1, '#2a3550');
    rect(c, 1, 0, 14, 2, '#24324d');
  });
  // doors (32x48 covers wall top rows + face)
  const door = (key: string, h: number, open: boolean, core = false) =>
    canvasTex(scene, key, 32, h, (c) => {
      const faceY = h - 16;
      if (!open) {
        rect(c, 0, 0, 32, faceY, '#0c111d');
        rect(c, 0, faceY - 1, 32, 1, '#3b4b6c');
        rect(c, 0, faceY, 32, 16, '#2f3d5c');
        rect(c, 2, faceY + 1, 28, 14, '#3a4a6b');
        rect(c, 15, faceY + 1, 2, 14, '#1b2438');
        if (core) {
          rect(c, 6, faceY + 3, 20, 7, '#9fc2d4'); // frosted viewport
          rect(c, 7, faceY + 4, 18, 5, '#c4dde8');
          rect(c, 15, faceY + 3, 2, 7, '#7a9db0');
        } else {
          rect(c, 4, faceY + 6, 8, 1, '#1b2438');
          rect(c, 20, faceY + 6, 8, 1, '#1b2438');
        }
      } else {
        rect(c, 0, 0, 3, h, '#2f3d5c');
        rect(c, 29, 0, 3, h, '#2f3d5c');
        rect(c, 3, faceY + 14, 26, 2, '#0b101c');
      }
    });
  door('door_lab', 48, false);
  door('door_lab_open', 48, true);
  door('door_core', 64, false, true);
  door('door_core_open', 64, true, true);
  // reader lights
  rowsTex(scene, 'reader_red', ['GGGG', 'GRRG', 'GGGG', 'GKKG']);
  rowsTex(scene, 'reader_green', ['GGGG', 'GCCG', 'GGGG', 'GKKG']);
  // keypad with four shapes
  canvasTex(scene, 'keypad', 12, 14, (c) => {
    rect(c, 0, 0, 12, 14, '#2b3753');
    rect(c, 1, 1, 10, 12, '#151d30');
    rect(c, 2, 2, 3, 3, '#62d6d8'); rect(c, 7, 2, 3, 3, '#62d6d8');
    rect(c, 2, 8, 3, 3, '#62d6d8'); rect(c, 7, 8, 3, 3, '#62d6d8');
  });
  // sealed slab (echo)
  canvasTex(scene, 'slab', 22, 18, (c) => {
    rect(c, 0, 0, 22, 18, '#000000');
    rect(c, 0, 0, 22, 1, '#62d6d8'); rect(c, 0, 17, 22, 1, '#62d6d8');
    rect(c, 0, 0, 1, 18, '#62d6d8'); rect(c, 21, 0, 1, 18, '#62d6d8');
    rect(c, 6, 7, 10, 1, '#62d6d8'); rect(c, 8, 10, 6, 1, '#62d6d8');
  });
  // shape glyphs (for code memory)
  canvasTex(scene, 'sh_circle', 9, 9, (c) => { c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.arc(4.5, 4.5, 3.4, 0, Math.PI * 2); c.stroke(); });
  canvasTex(scene, 'sh_triangle', 9, 9, (c) => { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(4.5, 0); c.lineTo(9, 9); c.lineTo(0, 9); c.closePath(); c.fill(); });
  canvasTex(scene, 'sh_square', 9, 9, (c) => { rect(c, 0, 0, 9, 9, '#ffffff'); });
  canvasTex(scene, 'sh_diamond', 9, 9, (c) => { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(4.5, 0); c.lineTo(9, 4.5); c.lineTo(4.5, 9); c.lineTo(0, 4.5); c.closePath(); c.fill(); });

  // observation window with the ice giant and the storm (128 x 48)
  canvasTex(scene, 'window', 128, 48, (c) => {
    rect(c, 0, 0, 128, 48, '#3a4a6b');
    rect(c, 2, 2, 124, 42, '#02040a');
    const rs = rng(9);
    for (let i = 0; i < 40; i++) rect(c, 2 + Math.floor(rs() * 124), 2 + Math.floor(rs() * 20), 1, 1, rs() > 0.7 ? '#c9d4e3' : '#4a5a73');
    c.save();
    c.beginPath(); c.rect(2, 2, 124, 42); c.clip();
    const cx = 64, cy = 120, R = 104;
    const bands = ['#173a4f', '#1d4a5e', '#22566b', '#1a4459', '#2a6b7c', '#1e5064', '#3a8190', '#245a6c'];
    for (let i = 0; i < 60; i++) {
      c.fillStyle = bands[Math.floor(i / 7.5) % bands.length];
      c.beginPath(); c.arc(cx, cy, R - i * 0.4, Math.PI, 0); c.fill();
    }
    for (let b = 0; b < 8; b++) {
      c.strokeStyle = b % 2 ? '#2f7383' : '#14394d';
      c.lineWidth = 2;
      c.beginPath(); c.arc(cx, cy + 6, R - 6 - b * 7, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    }
    // the Eye
    c.fillStyle = '#0a1a26'; c.beginPath(); c.ellipse(82, 31, 9, 4, -0.15, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#123044'; c.beginPath(); c.ellipse(82, 31, 5, 2, -0.15, 0, Math.PI * 2); c.fill();
    // rim light
    c.strokeStyle = '#7fd6dc'; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, Math.PI * 1.12, Math.PI * 1.88); c.stroke();
    c.restore();
    rect(c, 2, 2, 124, 1, '#58698d');
    rect(c, 63, 2, 2, 42, '#3a4a6b');
    rect(c, 0, 44, 128, 4, '#2f3d5c');
    rect(c, 0, 46, 128, 2, '#151d30');
  });
  // grease-pencil storm dots, present (Mira & Voss trail ending at "1251")
  const spiral = (n: number, off = 0) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const a = (i + off) * 0.42;
      const rr = 18 - (i + off) * 0.25;
      pts.push([82 + Math.cos(a) * rr * 1.6, 25 + Math.sin(a) * rr * 0.6]);
    }
    return pts;
  };
  canvasTex(scene, 'dots', 128, 48, (c) => {
    spiral(44).forEach(([x, y]) => rect(c, Math.round(x), Math.round(y), 1, 1, '#d8dde6'));
    const last = spiral(44)[43];
    rect(c, Math.round(last[0]) + 2, Math.round(last[1]) - 3, 5, 1, '#d8dde6'); // "1251" scribble
  });
  canvasTex(scene, 'dots_echo', 128, 48, (c) => {
    spiral(16, 46).forEach(([x, y]) => { rect(c, Math.round(x), Math.round(y), 2, 2, '#ffffff'); });
  });
  rowsTex(scene, 'my_dot', ['AA', 'AA']);
  // lab console with key slot (48x18)
  canvasTex(scene, 'console', 48, 20, (c) => {
    rect(c, 0, 4, 48, 14, '#2b3753');
    rect(c, 1, 2, 46, 4, '#3a4a6b');
    rect(c, 3, 6, 20, 8, '#0b1d24');
    rect(c, 4, 7, 12, 1, '#62d6d8'); rect(c, 4, 9, 16, 1, '#2a7f86'); rect(c, 4, 11, 8, 1, '#2a7f86');
    rect(c, 26, 7, 8, 6, '#151d30');
    rect(c, 36, 6, 9, 9, '#3a1d1f'); // LETHE red housing
    rect(c, 37, 7, 7, 7, '#d0453b');
    rect(c, 40, 9, 1, 3, '#06080e'); // slot with the snapped shaft
    rect(c, 40, 10, 1, 1, '#c9d4e3');
    rect(c, 0, 18, 48, 2, '#0b0f19');
  });
  canvasTex(scene, 'console_key', 6, 4, (c) => { rect(c, 0, 1, 4, 2, '#e0a64a'); rect(c, 4, 0, 2, 4, '#e0a64a'); });
  // desks
  canvasTex(scene, 'desk', 32, 18, (c) => {
    rect(c, 0, 2, 32, 12, '#3a3f52');
    rect(c, 0, 2, 32, 1, '#5a627a');
    rect(c, 1, 14, 3, 4, '#24293a'); rect(c, 28, 14, 3, 4, '#24293a');
  });
  rowsTex(scene, 'photo_down', ['GGGGG', 'GgggG', 'GGGGG']);
  rowsTex(scene, 'photo_up', ['WWWWW', 'WTfTW', 'WSfSW', 'WWWWW']);
  rowsTex(scene, 'recorder', ['KKKK', 'KRgK', 'KKKK']);
  rowsTex(scene, 'recorder_sealed', ['AKKA', 'KAAK', 'AKKA']);
  rowsTex(scene, 'glue', ['.W.', 'WWW', 'WAW']);
  // tender drone
  rowsTex(scene, 'tender_0', ['..GGGG..', '.GgCCgG.', 'GGGGGGGG', '.K.KK.K.']);
  rowsTex(scene, 'tender_1', ['..GGGG..', '.GgCCgG.', 'GGGGGGGG', 'K.K..K.K']);
  // Core: the Well column
  canvasTex(scene, 'well', 32, 44, (c) => {
    rect(c, 2, 36, 28, 8, '#2b3753');
    rect(c, 0, 38, 32, 4, '#3a4a6b');
    rect(c, 6, 0, 20, 38, '#0e3a42');
    rect(c, 8, 0, 16, 38, '#1d6a72');
    rect(c, 11, 0, 10, 38, '#3aa3a8');
    rect(c, 14, 0, 4, 38, '#9fe8ea');
    rect(c, 4, 0, 24, 3, '#3a4a6b');
    rect(c, 4, 34, 24, 3, '#3a4a6b');
  });
  canvasTex(scene, 'well_dark', 32, 44, (c) => {
    rect(c, 2, 36, 28, 8, '#2b3753');
    rect(c, 0, 38, 32, 4, '#3a4a6b');
    rect(c, 6, 0, 20, 38, '#05070c');
    rect(c, 9, 4, 3, 26, '#1a2234');
    rect(c, 4, 0, 24, 3, '#3a4a6b');
    rect(c, 4, 34, 24, 3, '#3a4a6b');
  });
  canvasTex(scene, 'well_console', 32, 16, (c) => {
    rect(c, 0, 3, 32, 11, '#2b3753');
    rect(c, 2, 1, 28, 4, '#3a4a6b');
    rect(c, 4, 5, 24, 6, '#0b1d24');
    rect(c, 13, 6, 6, 4, '#62d6d8');
    rect(c, 0, 14, 32, 2, '#0b0f19');
  });
  canvasTex(scene, 'stool', 10, 10, (c) => { rect(c, 1, 2, 8, 3, '#3a3f52'); rect(c, 2, 5, 1, 5, '#24293a'); rect(c, 7, 5, 1, 5, '#24293a'); });
  // Lethe lever (behind glass shutter / open)
  canvasTex(scene, 'lethe', 16, 26, (c) => {
    rect(c, 1, 0, 14, 24, '#3a1d1f');
    rect(c, 2, 1, 12, 22, '#24131a');
    rect(c, 7, 4, 2, 12, '#9aa6b8');
    rect(c, 5, 3, 6, 3, '#d0453b');
    rect(c, 3, 18, 10, 3, '#4a5a73');
    rect(c, 0, 24, 16, 2, '#0b0f19');
  });
  canvasTex(scene, 'lethe_glass', 16, 26, (c) => {
    c.globalAlpha = 0.55; rect(c, 1, 0, 14, 24, '#9fc2d4'); c.globalAlpha = 1;
    rect(c, 1, 0, 14, 1, '#d8eef5'); rect(c, 3, 3, 1, 8, '#d8eef5');
  });
  canvasTex(scene, 'lethe_pulled', 16, 26, (c) => {
    rect(c, 1, 0, 14, 24, '#3a1d1f');
    rect(c, 2, 1, 12, 22, '#24131a');
    rect(c, 7, 10, 2, 10, '#9aa6b8');
    rect(c, 5, 19, 6, 3, '#d0453b');
    rect(c, 0, 24, 16, 2, '#0b0f19');
  });
  // gel/ambient glows & light stamps
  canvasTex(scene, 'light', 128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.7, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  });
  canvasTex(scene, 'scanlines', 4, 4, (c) => { rect(c, 0, 0, 4, 1, 'rgba(160,240,255,0.55)'); rect(c, 0, 2, 4, 1, 'rgba(0,0,0,0.6)'); });
  canvasTex(scene, 'noise', 64, 64, (c) => {
    const rs = rng(3);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const v = rs();
      if (v > 0.6) rect(c, x, y, 1, 1, `rgba(200,240,255,${(v - 0.6) * 1.5})`);
    }
  });
  canvasTex(scene, 'vignette', 320, 180, (c) => {
    const g = c.createRadialGradient(160, 90, 40, 160, 90, 200);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.85)');
    c.fillStyle = g; c.fillRect(0, 0, 320, 180);
  });
  canvasTex(scene, 'px', 1, 1, (c) => rect(c, 0, 0, 1, 1, '#ffffff'));
}

export function generateTextures(scene: Phaser.Scene) {
  makeCharacters(scene);
  makeMap(scene);
  makeProps(scene);
}
