import fs from 'fs';
import path from 'path';

const sheets = [
  { key: 'char_player', file: 'public/assets/characters/char-player-001.png', path: 'assets/characters/char-player-001.png' },
  { key: 'char_actions', file: 'public/assets/characters/char-player-actions-001.png', path: 'assets/characters/char-player-actions-001.png' },
  { key: 'char_ghost', file: 'public/assets/characters/char-iteration-ghost-001.png', path: 'assets/characters/char-iteration-ghost-001.png' },
  { key: 'char_kneel', file: 'public/assets/characters/char-iteration-kneel-001.png', path: 'assets/characters/char-iteration-kneel-001.png' },
  { key: 'char_mira', file: 'public/assets/characters/char-mira-001.png', path: 'assets/characters/char-mira-001.png' },
  { key: 'char_mira_cane', file: 'public/assets/characters/char-mira-cane-001.png', path: 'assets/characters/char-mira-cane-001.png' },
  { key: 'char_voss', file: 'public/assets/characters/char-voss-001.png', path: 'assets/characters/char-voss-001.png' },
  { key: 'char_tender', file: 'public/assets/characters/char-tender-001.png', path: 'assets/characters/char-tender-001.png' },
];

const frames = [
  // Player movement (16x32)
  { key: 'p_down_0', sheet: 'char_player', x: 0, y: 0, w: 16, h: 32 },
  { key: 'p_down_1', sheet: 'char_player', x: 16, y: 0, w: 16, h: 32 },
  { key: 'p_down_2', sheet: 'char_player', x: 32, y: 0, w: 16, h: 32 },
  { key: 'p_down_3', sheet: 'char_player', x: 48, y: 0, w: 16, h: 32 },
  { key: 'p_down_4', sheet: 'char_player', x: 64, y: 0, w: 16, h: 32 },

  { key: 'p_up_0', sheet: 'char_player', x: 0, y: 32, w: 16, h: 32 },
  { key: 'p_up_1', sheet: 'char_player', x: 16, y: 32, w: 16, h: 32 },
  { key: 'p_up_2', sheet: 'char_player', x: 32, y: 32, w: 16, h: 32 },
  { key: 'p_up_3', sheet: 'char_player', x: 48, y: 32, w: 16, h: 32 },
  { key: 'p_up_4', sheet: 'char_player', x: 64, y: 32, w: 16, h: 32 },

  { key: 'p_east_0', sheet: 'char_player', x: 0, y: 64, w: 16, h: 32 },
  { key: 'p_east_1', sheet: 'char_player', x: 16, y: 64, w: 16, h: 32 },
  { key: 'p_east_2', sheet: 'char_player', x: 32, y: 64, w: 16, h: 32 },
  { key: 'p_east_3', sheet: 'char_player', x: 48, y: 64, w: 16, h: 32 },
  { key: 'p_east_4', sheet: 'char_player', x: 64, y: 64, w: 16, h: 32 },

  { key: 'p_side_0', sheet: 'char_player', x: 0, y: 64, w: 16, h: 32 },
  { key: 'p_side_1', sheet: 'char_player', x: 16, y: 64, w: 16, h: 32 },

  { key: 'p_west_0', sheet: 'char_player', x: 0, y: 96, w: 16, h: 32 },
  { key: 'p_west_1', sheet: 'char_player', x: 16, y: 96, w: 16, h: 32 },
  { key: 'p_west_2', sheet: 'char_player', x: 32, y: 96, w: 16, h: 32 },
  { key: 'p_west_3', sheet: 'char_player', x: 48, y: 96, w: 16, h: 32 },
  { key: 'p_west_4', sheet: 'char_player', x: 64, y: 96, w: 16, h: 32 },

  // Player actions (16x32)
  { key: 'p_examine_0', sheet: 'char_actions', x: 0, y: 0, w: 16, h: 32 },
  { key: 'p_examine_1', sheet: 'char_actions', x: 16, y: 0, w: 16, h: 32 },
  { key: 'p_examine_2', sheet: 'char_actions', x: 32, y: 0, w: 16, h: 32 },
  { key: 'p_echo_on_0', sheet: 'char_actions', x: 48, y: 0, w: 16, h: 32 },
  { key: 'p_echo_on_1', sheet: 'char_actions', x: 64, y: 0, w: 16, h: 32 },
  { key: 'p_echo_on_2', sheet: 'char_actions', x: 80, y: 0, w: 16, h: 32 },
  { key: 'p_echo_on_3', sheet: 'char_actions', x: 0, y: 32, w: 16, h: 32 },
  { key: 'p_echo_idle_0', sheet: 'char_actions', x: 16, y: 32, w: 16, h: 32 },
  { key: 'p_echo_idle_1', sheet: 'char_actions', x: 32, y: 32, w: 16, h: 32 },
  { key: 'p_echo_off_0', sheet: 'char_actions', x: 48, y: 32, w: 16, h: 32 },
  { key: 'p_echo_off_1', sheet: 'char_actions', x: 64, y: 32, w: 16, h: 32 },
  { key: 'p_echo_off_2', sheet: 'char_actions', x: 80, y: 32, w: 16, h: 32 },
  { key: 'p_cradle_wake_0', sheet: 'char_actions', x: 0, y: 64, w: 16, h: 32 },
  { key: 'p_cradle_wake_1', sheet: 'char_actions', x: 16, y: 64, w: 16, h: 32 },
  { key: 'p_cradle_wake_2', sheet: 'char_actions', x: 32, y: 64, w: 16, h: 32 },
  { key: 'p_cradle_wake_3', sheet: 'char_actions', x: 48, y: 64, w: 16, h: 32 },
  { key: 'p_cradle_wake_4', sheet: 'char_actions', x: 64, y: 64, w: 16, h: 32 },

  // Ghost movement (16x32)
  { key: 'ghost_down_0', sheet: 'char_ghost', x: 0, y: 0, w: 16, h: 32 },
  { key: 'ghost_down_1', sheet: 'char_ghost', x: 16, y: 0, w: 16, h: 32 },
  { key: 'ghost_down_2', sheet: 'char_ghost', x: 32, y: 0, w: 16, h: 32 },
  { key: 'ghost_down_3', sheet: 'char_ghost', x: 48, y: 0, w: 16, h: 32 },
  { key: 'ghost_down_4', sheet: 'char_ghost', x: 64, y: 0, w: 16, h: 32 },

  { key: 'ghost_up_0', sheet: 'char_ghost', x: 0, y: 32, w: 16, h: 32 },
  { key: 'ghost_up_1', sheet: 'char_ghost', x: 16, y: 32, w: 16, h: 32 },
  { key: 'ghost_up_2', sheet: 'char_ghost', x: 32, y: 32, w: 16, h: 32 },
  { key: 'ghost_up_3', sheet: 'char_ghost', x: 48, y: 32, w: 16, h: 32 },
  { key: 'ghost_up_4', sheet: 'char_ghost', x: 64, y: 32, w: 16, h: 32 },

  { key: 'ghost_east_0', sheet: 'char_ghost', x: 0, y: 64, w: 16, h: 32 },
  { key: 'ghost_east_1', sheet: 'char_ghost', x: 16, y: 64, w: 16, h: 32 },
  { key: 'ghost_east_2', sheet: 'char_ghost', x: 32, y: 64, w: 16, h: 32 },
  { key: 'ghost_east_3', sheet: 'char_ghost', x: 48, y: 64, w: 16, h: 32 },
  { key: 'ghost_east_4', sheet: 'char_ghost', x: 64, y: 64, w: 16, h: 32 },

  { key: 'ghost_side_0', sheet: 'char_ghost', x: 0, y: 64, w: 16, h: 32 },
  { key: 'ghost_side_1', sheet: 'char_ghost', x: 16, y: 64, w: 16, h: 32 },

  { key: 'ghost_west_0', sheet: 'char_ghost', x: 0, y: 96, w: 16, h: 32 },
  { key: 'ghost_west_1', sheet: 'char_ghost', x: 16, y: 96, w: 16, h: 32 },
  { key: 'ghost_west_2', sheet: 'char_ghost', x: 32, y: 96, w: 16, h: 32 },
  { key: 'ghost_west_3', sheet: 'char_ghost', x: 48, y: 96, w: 16, h: 32 },
  { key: 'ghost_west_4', sheet: 'char_ghost', x: 64, y: 96, w: 16, h: 32 },

  // Ghost kneel & cinematic poses (16x32)
  { key: 'ghost_kneel', sheet: 'char_kneel', x: 0, y: 0, w: 16, h: 32 },
  { key: 'ghost_card', sheet: 'char_kneel', x: 16, y: 0, w: 16, h: 32 },
  { key: 'ghost_lookup', sheet: 'char_kneel', x: 32, y: 0, w: 16, h: 32 },
  { key: 'ghost_write', sheet: 'char_kneel', x: 48, y: 0, w: 16, h: 32 },
  { key: 'ghost_dissolve_0', sheet: 'char_kneel', x: 64, y: 0, w: 16, h: 32 },
  { key: 'ghost_dissolve_1', sheet: 'char_kneel', x: 80, y: 0, w: 16, h: 32 },
  { key: 'ghost_dissolve_2', sheet: 'char_kneel', x: 96, y: 0, w: 16, h: 32 },
  { key: 'ghost_dissolve_3', sheet: 'char_kneel', x: 112, y: 0, w: 16, h: 32 },

  // Mira Sen (16x32)
  { key: 'mira_down_0', sheet: 'char_mira', x: 0, y: 0, w: 16, h: 32 },
  { key: 'mira_up_0', sheet: 'char_mira', x: 16, y: 0, w: 16, h: 32 },
  { key: 'mira_up_1', sheet: 'char_mira', x: 16, y: 0, w: 16, h: 32 },
  { key: 'mira_side_0', sheet: 'char_mira', x: 32, y: 0, w: 16, h: 32 },
  { key: 'mira_side_1', sheet: 'char_mira', x: 32, y: 0, w: 16, h: 32 },
  { key: 'mira_east_0', sheet: 'char_mira', x: 32, y: 0, w: 16, h: 32 },
  { key: 'mira_west_0', sheet: 'char_mira', x: 48, y: 0, w: 16, h: 32 },
  { key: 'mira_3q_0', sheet: 'char_mira', x: 64, y: 0, w: 16, h: 32 },

  { key: 'miraface_down_0', sheet: 'char_mira', x: 0, y: 32, w: 16, h: 32 },
  { key: 'miraface_up_0', sheet: 'char_mira', x: 16, y: 32, w: 16, h: 32 },
  { key: 'miraface_up_1', sheet: 'char_mira', x: 16, y: 32, w: 16, h: 32 },
  { key: 'miraface_side_0', sheet: 'char_mira', x: 32, y: 32, w: 16, h: 32 },
  { key: 'miraface_side_1', sheet: 'char_mira', x: 32, y: 32, w: 16, h: 32 },
  { key: 'miraface_east_0', sheet: 'char_mira', x: 32, y: 32, w: 16, h: 32 },
  { key: 'miraface_west_0', sheet: 'char_mira', x: 48, y: 32, w: 16, h: 32 },
  { key: 'miraface_3q_0', sheet: 'char_mira', x: 64, y: 32, w: 16, h: 32 },

  // Mira with cane (16x32)
  { key: 'mira_cane', sheet: 'char_mira_cane', x: 0, y: 0, w: 16, h: 32 },
  { key: 'mira_cane_up', sheet: 'char_mira_cane', x: 16, y: 0, w: 16, h: 32 },
  { key: 'mira_cane_side', sheet: 'char_mira_cane', x: 32, y: 0, w: 16, h: 32 },
  { key: 'mira_cane_west', sheet: 'char_mira_cane', x: 48, y: 0, w: 16, h: 32 },
  { key: 'miraface_cane', sheet: 'char_mira_cane', x: 64, y: 0, w: 16, h: 32 },

  // Elias Voss (16x32)
  { key: 'voss_down', sheet: 'char_voss', x: 0, y: 0, w: 16, h: 32 },
  { key: 'voss_up', sheet: 'char_voss', x: 16, y: 0, w: 16, h: 32 },
  { key: 'voss_side', sheet: 'char_voss', x: 32, y: 0, w: 16, h: 32 },
  { key: 'voss_west', sheet: 'char_voss', x: 48, y: 0, w: 16, h: 32 },
  { key: 'voss_3q', sheet: 'char_voss', x: 64, y: 0, w: 16, h: 32 },

  { key: 'voss_faceless', sheet: 'char_voss', x: 0, y: 32, w: 16, h: 32 },
  { key: 'voss_faceless_down', sheet: 'char_voss', x: 0, y: 32, w: 16, h: 32 },
  { key: 'voss_faceless_up', sheet: 'char_voss', x: 16, y: 32, w: 16, h: 32 },
  { key: 'voss_faceless_side', sheet: 'char_voss', x: 32, y: 32, w: 16, h: 32 },
  { key: 'voss_faceless_west', sheet: 'char_voss', x: 48, y: 32, w: 16, h: 32 },
  { key: 'voss_faceless_3q', sheet: 'char_voss', x: 64, y: 32, w: 16, h: 32 },

  // Tender drone (16x16)
  { key: 'tender_0', sheet: 'char_tender', x: 0, y: 0, w: 16, h: 16 },
  { key: 'tender_1', sheet: 'char_tender', x: 16, y: 0, w: 16, h: 16 },
  { key: 'tender_2', sheet: 'char_tender', x: 32, y: 0, w: 16, h: 16 },
  { key: 'tender_3', sheet: 'char_tender', x: 48, y: 0, w: 16, h: 16 },

  { key: 'tender_clean_0', sheet: 'char_tender', x: 0, y: 16, w: 16, h: 16 },
  { key: 'tender_clean_1', sheet: 'char_tender', x: 16, y: 16, w: 16, h: 16 },
  { key: 'tender_clean_2', sheet: 'char_tender', x: 32, y: 16, w: 16, h: 16 },
  { key: 'tender_clean_3', sheet: 'char_tender', x: 48, y: 16, w: 16, h: 16 },
];

let out = `// Generated character sprite definitions and embedded base64 sheets
// Production suite V2 for ECHO//CHAMBER

export interface SheetDef {
  key: string;
  path: string;
  dataUri: string;
}

export interface FrameDef {
  key: string;
  sheet: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const CHARACTER_SHEETS: SheetDef[] = [
`;

sheets.forEach(s => {
  const b64 = fs.readFileSync(s.file).toString('base64');
  out += `  { key: '${s.key}', path: '${s.path}', dataUri: 'data:image/png;base64,${b64}' },\n`;
});

out += `];\n\nexport const CHARACTER_FRAMES: FrameDef[] = ${JSON.stringify(frames, null, 2)};\n\n`;

out += `/**
 * Preload character sprites in Phaser Scene preload().
 * Uses URL path with automatic base64 fallback.
 */
export function preloadCharacterSprites(scene: Phaser.Scene) {
  for (const s of CHARACTER_SHEETS) {
    if (!scene.textures.exists(s.key)) {
      scene.load.image(s.key, s.path);
    }
  }
}

/**
 * Ensures all character sheets and individual frame textures are sliced and registered
 * in Phaser TextureManager with nearest-neighbour pixel-perfect filtering.
 */
export function sliceCharacterTextures(scene: Phaser.Scene): boolean {
  let allAvailable = true;
  for (const s of CHARACTER_SHEETS) {
    if (!scene.textures.exists(s.key)) {
      allAvailable = false;
      break;
    }
  }

  // If sheets were preloaded via scene.load.image:
  if (allAvailable) {
    applyFrames(scene);
    return true;
  }

  // Synchronous HTMLImageElement fallback from dataUri:
  let pending = CHARACTER_SHEETS.length;
  CHARACTER_SHEETS.forEach(s => {
    if (scene.textures.exists(s.key)) {
      pending--;
      if (pending === 0) applyFrames(scene);
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (!scene.textures.exists(s.key)) {
        scene.textures.addImage(s.key, img);
      }
      pending--;
      if (pending === 0) applyFrames(scene);
    };
    img.src = s.dataUri;
  });

  return false;
}

function applyFrames(scene: Phaser.Scene) {
  for (const f of CHARACTER_FRAMES) {
    if (!scene.textures.exists(f.sheet)) continue;
    const sheetTex = scene.textures.get(f.sheet);
    const srcImg = sheetTex.getSourceImage() as CanvasImageSource;
    if (!srcImg) continue;

    if (scene.textures.exists(f.key)) scene.textures.remove(f.key);
    const canvasTex = scene.textures.createCanvas(f.key, f.w, f.h);
    if (!canvasTex) continue;

    const ctx = canvasTex.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(srcImg, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
    canvasTex.refresh();
  }
}
`;

fs.writeFileSync('src/art/characterSprites.ts', out);
console.log('Generated src/art/characterSprites.ts successfully!');
