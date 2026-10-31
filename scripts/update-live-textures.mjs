import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/art/textures.ts';
let code = readFileSync(path, 'utf8');

// The replacement block for characters
const startMarker = '// ---------------------------------------------------------------- characters';
const endMarker = '// ---------------------------------------------------------------- room map';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newCharacterBlock = `// ---------------------------------------------------------------- characters (Concept C Production)
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
      canvasTex(scene, \`p_\${d}_\${i}\`, 16, 32, (c) => drawConceptC(c, d, i));
      canvasTex(scene, \`ghost_\${d}_\${i}\`, 16, 32, (c) => drawGhost(c, d, i));
      canvasTex(scene, \`mira_\${d}_\${i}\`, 16, 32, (c) => drawMira(c, d, true, i));
      canvasTex(scene, \`miraface_\${d}_\${i}\`, 16, 32, (c) => drawMira(c, d, false, i));
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
`;

const updatedCode = code.slice(0, startIndex) + newCharacterBlock + '\n' + code.slice(endIndex);
writeFileSync(path, updatedCode, 'utf8');
console.log('Successfully updated src/art/textures.ts with Concept C production characters!');
