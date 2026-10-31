import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT_BASE = 'public/assets/characters';
const PLAYER_DIR = join(OUT_BASE, 'player');
const ITER_DIR = join(OUT_BASE, 'iterations');
const MIRA_DIR = join(OUT_BASE, 'mira');
const VOSS_DIR = join(OUT_BASE, 'voss');
const TENDER_DIR = join(OUT_BASE, 'tender');
const PREVIEWS_DIR = join(OUT_BASE, 'previews');

// Common Palettes
const C = {
  trans: [0, 0, 0, 0],
  ink: [14, 18, 26, 255],
  crease: [22, 28, 38, 255],
  
  // Concept C Protagonist
  hair_shadow: [12, 15, 22, 255],
  hair_base: [22, 28, 40, 255],
  hair_hi: [42, 54, 74, 255],
  skin_base: [216, 162, 136, 255],
  skin_sh: [168, 116, 96, 255],
  skin_hi: [238, 194, 172, 255],
  eye: [22, 26, 36, 255],
  jacket_dark: [36, 46, 62, 255],
  jacket_sh: [24, 30, 42, 255],
  jacket_hi: [52, 66, 88, 255],
  slate_panel: [115, 134, 158, 255],
  slate_hi: [148, 168, 194, 255],
  slate_sh: [84, 100, 122, 255],
  belt: [18, 22, 30, 255],
  pouch: [46, 58, 76, 255],
  amber: [230, 165, 65, 255],
  amber_hi: [252, 202, 98, 255],
  cyan_core: [205, 255, 255, 255],
  cyan_glow: [0, 235, 245, 255],
  cyan_deep: [0, 145, 170, 255],
  pant_base: [30, 38, 52, 255],
  pant_sh: [18, 24, 34, 255],
  knee_pad: [52, 64, 84, 255],
  boot_base: [16, 20, 28, 255],
  boot_hi: [34, 42, 56, 255],
  boot_sole: [10, 12, 18, 255],

  // Ghost Spectral Palette
  ghost_base: [56, 68, 86, 255],
  ghost_sh: [32, 40, 52, 255],
  ghost_hi: [92, 110, 136, 255],
  ghost_face: [26, 32, 42, 255],
  ghost_rim: [0, 220, 240, 200],
  ghost_rim_soft: [0, 200, 220, 120],

  // Lab Coat (Mira)
  coat_white: [222, 230, 242, 255],
  coat_hi: [245, 250, 255, 255],
  coat_sh: [160, 174, 194, 255],
  coat_deep: [112, 126, 146, 255],

  // Voss (Male Researcher)
  voss_hair: [34, 28, 24, 255],
  voss_shirt: [28, 36, 48, 255],
  voss_vest: [48, 58, 74, 255],
  voss_vest_sh: [32, 40, 52, 255],

  // Tender Drone
  drone_metal: [64, 76, 94, 255],
  drone_dark: [36, 44, 56, 255],
  drone_hi: [105, 124, 150, 255],
  drone_eye: [245, 175, 55, 255],
  drone_brush: [140, 130, 120, 255]
};

function createImage(w, h, fill = C.trans) {
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set(fill, i * 4);
  return { w, h, data };
}

function p(img, x, y, color) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  const idx = (y * img.w + x) * 4;
  if (color[3] === 255 || img.data[idx + 3] === 0) {
    img.data.set(color, idx);
  } else {
    const a = color[3] / 255;
    const invA = 1 - a;
    img.data[idx] = Math.round(color[0] * a + img.data[idx] * invA);
    img.data[idx + 1] = Math.round(color[1] * a + img.data[idx + 1] * invA);
    img.data[idx + 2] = Math.round(color[2] * a + img.data[idx + 2] * invA);
    img.data[idx + 3] = Math.min(255, img.data[idx + 3] + color[3]);
  }
}

function r(img, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      p(img, px, py, color);
    }
  }
}

function l(img, x0, y0, x1, y1, color) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    p(img, x0, y0, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function blit(dst, src, dx, dy, scale = 1) {
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const at = (y * src.w + x) * 4;
      if (src.data[at + 3] === 0) continue;
      const col = src.data.slice(at, at + 4);
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          p(dst, dx + x * scale + sx, dy + y * scale + sy, col);
        }
      }
    }
  }
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c ^= byte;
    for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(img) {
  const raw = Buffer.alloc((img.w * 4 + 1) * img.h);
  for (let y = 0; y < img.h; y++) {
    raw[y * (img.w * 4 + 1)] = 0;
    Buffer.from(img.data.slice(y * img.w * 4, (y + 1) * img.w * 4)).copy(raw, y * (img.w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function savePng(path, img) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, encodePng(img));
}

function gifLzw(indices, minCodeSize) {
  const clear = 1 << minCodeSize, end = clear + 1;
  let next = end + 1, codeSize = minCodeSize + 1, dict = new Map();
  const output = []; let bits = 0, count = 0;
  const push = (code) => {
    bits |= code << count; count += codeSize;
    while (count >= 8) { output.push(bits & 255); bits >>>= 8; count -= 8; }
  };
  const reset = () => { dict = new Map(); next = end + 1; codeSize = minCodeSize + 1; };
  reset(); push(clear);
  let phrase = String(indices[0]);
  for (let i = 1; i < indices.length; i++) {
    const k = String(indices[i]), candidate = `${phrase},${k}`;
    if (dict.has(candidate)) phrase = candidate;
    else {
      push(phrase.includes(',') ? dict.get(phrase) : Number(phrase));
      if (next < 4096) {
        dict.set(candidate, next++);
        if (next === (1 << codeSize) && codeSize < 12) codeSize++;
      } else {
        push(clear); reset();
      }
      phrase = k;
    }
  }
  push(phrase.includes(',') ? dict.get(phrase) : Number(phrase)); push(end);
  if (count) output.push(bits & 255);
  return Buffer.from(output);
}

function encodeGif(frames, delayCs = 12) {
  const palMap = new Map();
  const palette = [[0, 0, 0]];
  palMap.set('0,0,0,0', 0);

  for (const frame of frames) {
    for (let i = 0; i < frame.w * frame.h; i++) {
      const idx = i * 4;
      if (frame.data[idx + 3] === 0) continue;
      const key = `${frame.data[idx]},${frame.data[idx + 1]},${frame.data[idx + 2]}`;
      if (!palMap.has(key) && palette.length < 256) {
        palMap.set(key, palette.length);
        palette.push([frame.data[idx], frame.data[idx + 1], frame.data[idx + 2]]);
      }
    }
  }

  let pSize = 2;
  while (pSize < palette.length && pSize < 256) pSize <<= 1;
  const palBits = Math.max(1, Math.ceil(Math.log2(pSize)));

  const chunks = [Buffer.from('GIF89a', 'ascii')];
  const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(frames[0].w, 0); lsd.writeUInt16LE(frames[0].h, 2);
  lsd[4] = 0x80 | ((palBits - 1) << 4) | (palBits - 1);
  lsd[5] = 0; lsd[6] = 0; chunks.push(lsd);

  for (let i = 0; i < (1 << palBits); i++) {
    const col = palette[i] || [0, 0, 0];
    chunks.push(Buffer.from([col[0], col[1], col[2]]));
  }

  chunks.push(Buffer.from([0x21, 0xff, 0x0b]), Buffer.from('NETSCAPE2.0', 'ascii'), Buffer.from([3, 1, 0, 0, 0]));

  for (const frame of frames) {
    const gce = Buffer.alloc(8);
    gce[0] = 0x21; gce[1] = 0xf9; gce[2] = 4; gce[3] = 0x09;
    gce.writeUInt16LE(delayCs, 4); gce[6] = 0; gce[7] = 0;
    chunks.push(gce);

    const desc = Buffer.alloc(10);
    desc[0] = 0x2c; desc.writeUInt16LE(0, 1); desc.writeUInt16LE(0, 3);
    desc.writeUInt16LE(frame.w, 5); desc.writeUInt16LE(frame.h, 7);
    desc[9] = 0; chunks.push(desc);

    const indexed = [];
    for (let i = 0; i < frame.w * frame.h; i++) {
      const idx = i * 4;
      if (frame.data[idx + 3] === 0) {
        indexed.push(0);
      } else {
        const key = `${frame.data[idx]},${frame.data[idx + 1]},${frame.data[idx + 2]}`;
        indexed.push(palMap.get(key) || 1);
      }
    }

    const minCode = Math.max(2, palBits);
    const compressed = gifLzw(indexed, minCode);
    chunks.push(Buffer.from([minCode]));
    for (let i = 0; i < compressed.length; i += 255) {
      const subLen = Math.min(255, compressed.length - i);
      chunks.push(Buffer.from([subLen]), compressed.subarray(i, i + subLen));
    }
    chunks.push(Buffer.from([0]));
  }
  chunks.push(Buffer.from([0x3b]));
  return Buffer.concat(chunks);
}

// =============================================================
// BLOCK 2: PLAYER ACTIONS (CHAR-PLAYER-ACTIONS-001)
// 16x32 cells, feet on y=31
// Sequences:
// 1. Examine (3 frames)
// 2. Raise wrist (activate ECHO) (4 frames)
// 3. ECHO-held idle (2 frames)
// 4. ECHO deactivate (3 frames)
// 5. Cradle wake up (5 frames)
// =============================================================

function renderBaseConceptC(img, yOff = 0) {
  // Hair bun
  r(img, 7, 3 + yOff, 3, 2, C.hair_base);
  p(img, 8, 2 + yOff, C.hair_shadow);
  p(img, 8, 3 + yOff, C.hair_hi);
  // Head
  r(img, 5, 4 + yOff, 6, 2, C.hair_base);
  p(img, 6, 4 + yOff, C.hair_hi); p(img, 7, 4 + yOff, C.hair_hi);
  r(img, 4, 6 + yOff, 2, 4, C.hair_base);
  r(img, 10, 6 + yOff, 2, 4, C.hair_base);
  // Face
  r(img, 6, 6 + yOff, 4, 4, C.skin_base);
  p(img, 6, 7 + yOff, C.eye); p(img, 9, 7 + yOff, C.eye);
  p(img, 6, 9 + yOff, C.skin_sh); p(img, 9, 9 + yOff, C.skin_sh);
  // Collar
  r(img, 6, 10 + yOff, 4, 1, C.ink);
  r(img, 6, 11 + yOff, 4, 1, C.jacket_dark);
  p(img, 7, 11 + yOff, C.amber);
  // Shoulders & Torso
  r(img, 3, 12 + yOff, 10, 1, C.jacket_dark);
  r(img, 4, 13 + yOff, 3, 5, C.jacket_dark);
  l(img, 5, 12 + yOff, 5, 17 + yOff, C.crease);
  p(img, 5, 14 + yOff, C.amber);
  // Slate chest flap
  r(img, 7, 13 + yOff, 4, 5, C.slate_panel);
  p(img, 7, 12 + yOff, C.slate_hi); p(img, 8, 13 + yOff, C.slate_hi);
  p(img, 10, 17 + yOff, C.amber);
  // Belt
  r(img, 4, 18 + yOff, 8, 1, C.belt);
  p(img, 4, 18 + yOff, C.pouch); p(img, 11, 18 + yOff, C.pouch);
  p(img, 7, 18 + yOff, C.slate_hi);
  p(img, 10, 19 + yOff, C.amber);
  // Trousers
  r(img, 5, 19 + yOff, 3, 5, C.pant_base);
  r(img, 8, 19 + yOff, 3, 5, C.pant_base);
  r(img, 5, 24 + yOff, 3, 2, C.knee_pad); p(img, 6, 24 + yOff, C.amber);
  r(img, 8, 24 + yOff, 3, 2, C.knee_pad); p(img, 9, 24 + yOff, C.amber);
  r(img, 5, 26 + yOff, 3, 2, C.pant_sh);
  r(img, 8, 26 + yOff, 3, 2, C.pant_sh);
  // Boots grounded at row 31
  r(img, 4, 28, 4, 3, C.boot_base); p(img, 4, 29, C.amber); r(img, 4, 31, 4, 1, C.boot_sole);
  r(img, 8, 28, 4, 3, C.boot_base); p(img, 11, 29, C.amber); r(img, 8, 31, 4, 1, C.boot_sole);
}

function renderPlayerAction(action, frameIdx) {
  const img = createImage(16, 32);

  if (action === 'examine') {
    // 3 frames: reach out forward, inspect, return
    renderBaseConceptC(img, 0);
    if (frameIdx === 0) {
      // Arms slightly forward
      r(img, 2, 13, 2, 4, C.jacket_dark); r(img, 3, 17, 2, 2, C.hair_base);
      r(img, 12, 13, 2, 4, C.jacket_dark); r(img, 11, 17, 2, 2, C.hair_base);
      p(img, 11, 17, C.cyan_glow);
    } else if (frameIdx === 1) {
      // Both hands extended forward
      r(img, 3, 13, 2, 4, C.jacket_dark); r(img, 4, 16, 2, 3, C.hair_base);
      r(img, 11, 13, 2, 4, C.jacket_dark); r(img, 10, 16, 2, 3, C.hair_base);
      p(img, 10, 16, C.cyan_core); p(img, 9, 16, C.cyan_glow);
    } else {
      // Hands withdrawing
      r(img, 2, 14, 2, 4, C.jacket_dark); r(img, 2, 18, 2, 2, C.hair_base);
      r(img, 12, 14, 2, 4, C.jacket_dark); r(img, 12, 18, 2, 2, C.hair_base);
      p(img, 12, 18, C.cyan_glow);
    }
  } else if (action === 'echo_activate') {
    // 4 frames: left wrist raises to chest, device ignites with cyan pulse
    renderBaseConceptC(img, 0);
    // Right arm remains resting at side
    r(img, 2, 13, 2, 5, C.jacket_dark); r(img, 2, 18, 2, 2, C.hair_base);

    if (frameIdx === 0) {
      // Left arm bending upward
      r(img, 12, 13, 2, 3, C.jacket_dark);
      r(img, 11, 15, 2, 3, C.jacket_dark);
      r(img, 10, 16, 2, 2, C.hair_base);
      p(img, 10, 16, C.cyan_deep);
    } else if (frameIdx === 1) {
      // Left wrist held across chest
      r(img, 11, 13, 2, 3, C.jacket_dark);
      r(img, 9, 14, 3, 2, C.jacket_dark);
      r(img, 7, 14, 2, 2, C.hair_base);
      // Cyan device waking up
      r(img, 8, 14, 2, 2, C.cyan_glow);
      p(img, 8, 14, C.cyan_core);
    } else if (frameIdx === 2) {
      // Full flare & glow pulse
      r(img, 11, 13, 2, 3, C.jacket_dark);
      r(img, 9, 14, 3, 2, C.jacket_dark);
      r(img, 7, 14, 2, 2, C.hair_base);
      // Pulsing cyan aura
      r(img, 7, 13, 4, 4, [0, 230, 245, 100]);
      r(img, 8, 14, 2, 2, C.cyan_core);
      p(img, 8, 13, C.cyan_glow); p(img, 9, 15, C.cyan_glow);
    } else {
      // Active interface stabilized
      r(img, 11, 13, 2, 3, C.jacket_dark);
      r(img, 9, 14, 3, 2, C.jacket_dark);
      r(img, 7, 14, 2, 2, C.hair_base);
      r(img, 8, 14, 2, 2, C.cyan_glow);
      p(img, 8, 14, C.cyan_core);
      p(img, 7, 13, [180, 255, 255, 220]); // Hologram particle
    }
  } else if (action === 'echo_idle') {
    // 2 frames: wrist held at chest, subtle rhythmic pulse
    renderBaseConceptC(img, 0);
    r(img, 2, 13, 2, 5, C.jacket_dark); r(img, 2, 18, 2, 2, C.hair_base);
    r(img, 11, 13, 2, 3, C.jacket_dark);
    r(img, 9, 14, 3, 2, C.jacket_dark);
    r(img, 7, 14, 2, 2, C.hair_base);
    if (frameIdx === 0) {
      r(img, 8, 14, 2, 2, C.cyan_glow); p(img, 8, 14, C.cyan_core);
      p(img, 8, 13, [160, 245, 255, 180]);
    } else {
      r(img, 8, 14, 2, 2, C.cyan_glow); p(img, 9, 14, C.cyan_core);
      p(img, 9, 13, [160, 245, 255, 180]);
    }
  } else if (action === 'echo_deactivate') {
    // 3 frames: wrist lowers, glow shuts off
    renderBaseConceptC(img, 0);
    r(img, 2, 13, 2, 5, C.jacket_dark); r(img, 2, 18, 2, 2, C.hair_base);
    if (frameIdx === 0) {
      r(img, 11, 13, 2, 3, C.jacket_dark);
      r(img, 9, 15, 3, 2, C.jacket_dark);
      r(img, 8, 15, 2, 2, C.hair_base);
      p(img, 8, 15, C.cyan_deep);
    } else if (frameIdx === 1) {
      r(img, 12, 13, 2, 4, C.jacket_dark);
      r(img, 11, 17, 2, 2, C.jacket_dark);
      r(img, 11, 19, 2, 2, C.hair_base);
      p(img, 11, 18, [0, 80, 100, 255]); // Dim standby
    } else {
      r(img, 12, 13, 2, 4, C.jacket_dark);
      r(img, 12, 17, 2, 2, C.crease);
      r(img, 12, 19, 2, 2, C.hair_base);
      p(img, 12, 18, [0, 100, 120, 255]);
    }
  } else if (action === 'wake_cradle') {
    // 5 frames: lying low in pod cradle to standing upright
    if (frameIdx === 0) {
      // Horizontal in cradle pod (y=26..31)
      r(img, 2, 26, 12, 4, C.jacket_dark);
      r(img, 1, 25, 4, 4, C.hair_base); // Head resting left
      p(img, 3, 26, C.skin_base);
      r(img, 6, 26, 4, 2, C.slate_panel);
      p(img, 8, 27, C.amber);
      r(img, 10, 27, 4, 3, C.pant_base);
      r(img, 12, 28, 3, 3, C.boot_base);
    } else if (frameIdx === 1) {
      // Pushing up on elbows
      r(img, 3, 22, 5, 4, C.hair_base);
      p(img, 5, 23, C.skin_base);
      r(img, 4, 24, 7, 5, C.jacket_dark);
      r(img, 6, 24, 4, 3, C.slate_panel);
      p(img, 7, 26, C.cyan_glow); // Wrist brace
      r(img, 9, 26, 6, 4, C.pant_base);
      r(img, 12, 28, 3, 3, C.boot_base);
    } else if (frameIdx === 2) {
      // Sitting upright, legs swinging over edge
      r(img, 5, 12, 6, 5, C.hair_base);
      r(img, 6, 14, 4, 3, C.skin_base);
      p(img, 6, 15, C.eye); p(img, 9, 15, C.eye);
      r(img, 4, 18, 8, 6, C.jacket_dark);
      r(img, 7, 18, 4, 4, C.slate_panel);
      r(img, 4, 24, 8, 4, C.pant_base);
      r(img, 5, 28, 3, 3, C.boot_base);
      r(img, 8, 28, 3, 3, C.boot_base);
    } else if (frameIdx === 3) {
      // Standing up, slightly hunched
      renderBaseConceptC(img, 1);
    } else {
      // Fully upright at y=31
      renderBaseConceptC(img, 0);
    }
  }

  return img;
}

// =============================================================
// BLOCK 3: GHOST / PREVIOUS ITERATION (CHAR-ITERATION-GHOST-001)
// Exact match to player silhouette, faceless, spectral cyan accents
// =============================================================

function renderGhost(dir, animType, step = 0) {
  const img = createImage(16, 32);

  let bob = 0, legL = 0, legR = 0, armL = 0, armR = 0;
  if (animType === 'walk') {
    if (step === 0) { legL = -2; legR = 2; armL = 1; armR = -1; bob = 0; }
    else if (step === 1) { legL = 0; legR = 0; armL = 0; armR = 0; bob = -1; }
    else if (step === 2) { legL = 2; legR = -2; armL = -1; armR = 1; bob = 0; }
    else if (step === 3) { legL = 0; legR = 0; armL = 0; armR = 0; bob = -1; }
  }
  const yOff = bob;

  if (dir === 'south') {
    // Hair bun silhouette
    r(img, 7, 3 + yOff, 3, 2, C.ghost_sh);
    r(img, 5, 4 + yOff, 6, 2, C.ghost_base);
    r(img, 4, 6 + yOff, 2, 4, C.ghost_sh);
    r(img, 10, 6 + yOff, 2, 4, C.ghost_sh);

    // FACE REGION IS FACELESS / OBSCURED (per narrative canon)
    r(img, 6, 6 + yOff, 4, 4, C.ghost_face);
    p(img, 7, 7 + yOff, [18, 24, 34, 255]); // Soft shadow void

    // High collar
    r(img, 6, 10 + yOff, 4, 2, C.ghost_sh);

    // Torso / Jacket silhouette matches Concept C
    r(img, 3, 12 + yOff, 10, 1, C.ghost_base);
    r(img, 4, 13 + yOff, 8, 5, C.ghost_base);
    // Subtle desaturated chest panel
    r(img, 7, 13 + yOff, 4, 4, C.ghost_hi);
    p(img, 10, 17 + yOff, C.ghost_rim_soft);

    // Arms
    r(img, 2, 13 + yOff + armR, 2, 8, C.ghost_sh);
    r(img, 12, 13 + yOff + armL, 2, 8, C.ghost_sh);
    // Spectral cyan edge rim on wrist
    p(img, 12, 18 + yOff + armL, C.cyan_glow);
    p(img, 13, 18 + yOff + armL, C.cyan_glow);

    // Belt
    r(img, 4, 18 + yOff, 8, 1, C.ghost_sh);

    // Trousers & Boots
    r(img, 5, 19 + yOff, 3, 9 + legL, C.ghost_base);
    r(img, 8, 19 + yOff, 3, 9 + legR, C.ghost_base);
    r(img, 4, 28 + legL, 4, 4, C.ghost_sh);
    r(img, 8, 28 + legR, 4, 4, C.ghost_sh);

    // Spectral aura rims
    p(img, 3, 13 + yOff, C.ghost_rim_soft);
    p(img, 12, 13 + yOff, C.ghost_rim_soft);

  } else if (dir === 'north') {
    r(img, 6, 2 + yOff, 4, 3, C.ghost_sh);
    r(img, 4, 5 + yOff, 8, 5, C.ghost_base);
    r(img, 6, 10 + yOff, 4, 2, C.ghost_sh);
    r(img, 3, 12 + yOff, 10, 1, C.ghost_base);
    r(img, 4, 13 + yOff, 8, 5, C.ghost_base);
    // Back diagonal seam
    l(img, 4, 13 + yOff, 9, 16 + yOff, C.ghost_hi);
    r(img, 2, 13 + yOff - armL, 2, 8, C.ghost_sh);
    p(img, 2, 18 + yOff - armL, C.cyan_glow);
    r(img, 12, 13 + yOff - armR, 2, 8, C.ghost_sh);
    r(img, 4, 18 + yOff, 8, 1, C.ghost_sh);
    r(img, 5, 19 + yOff, 3, 9 - legL, C.ghost_base);
    r(img, 8, 19 + yOff, 3, 9 - legR, C.ghost_base);
    r(img, 4, 28 - legL, 4, 4, C.ghost_sh);
    r(img, 8, 28 - legR, 4, 4, C.ghost_sh);

  } else if (dir === 'east') {
    r(img, 4, 3 + yOff, 3, 3, C.ghost_sh);
    r(img, 6, 4 + yOff, 5, 3, C.ghost_base);
    r(img, 5, 7 + yOff, 4, 3, C.ghost_sh);
    // Faceless profile
    r(img, 9, 6 + yOff, 2, 4, C.ghost_face);
    r(img, 7, 10 + yOff, 4, 2, C.ghost_sh);
    r(img, 5, 12 + yOff, 6, 6, C.ghost_base);
    p(img, 10, 13 + yOff, C.ghost_hi);
    r(img, 6, 12 + yOff + armR, 3, 8, C.ghost_sh);
    r(img, 5, 18 + yOff, 6, 1, C.ghost_sh);
    r(img, 6, 20 + yOff, 4, 8, C.ghost_base);
    r(img, 7 + legR, 28, 4, 4, C.ghost_sh);
    if (animType === 'walk' && Math.abs(legL) > 0) r(img, 5 - legR, 28, 3, 4, C.ghost_sh);

  } else if (dir === 'west') {
    r(img, 9, 3 + yOff, 3, 3, C.ghost_sh);
    r(img, 5, 4 + yOff, 5, 3, C.ghost_base);
    r(img, 7, 7 + yOff, 4, 3, C.ghost_sh);
    r(img, 5, 6 + yOff, 2, 4, C.ghost_face);
    r(img, 5, 10 + yOff, 4, 2, C.ghost_sh);
    r(img, 5, 12 + yOff, 6, 6, C.ghost_base);
    p(img, 5, 13 + yOff, C.ghost_hi);
    r(img, 7, 12 + yOff + armL, 3, 8, C.ghost_sh);
    // Ghost wrist device
    p(img, 7, 17 + yOff + armL, C.cyan_glow);
    r(img, 5, 18 + yOff, 6, 1, C.ghost_sh);
    r(img, 6, 20 + yOff, 4, 8, C.ghost_base);
    r(img, 5 - legL, 28, 4, 4, C.ghost_sh);
    if (animType === 'walk' && Math.abs(legR) > 0) r(img, 8 + legL, 28, 3, 4, C.ghost_sh);
  }

  return img;
}

// =============================================================
// BLOCK 4: CINEMATIC POSES (CHAR-ITERATION-KNEEL-001)
// 1. Kneel at plate 3
// 2. Slide access card under plate
// 3. Look up towards camera
// 4. Write on frosted glass (DON'T ANSWER)
// 5. Stagger / dissolve (4 frames)
// =============================================================

function renderCinematicPose(pose, step = 0) {
  const img = createImage(16, 32);

  if (pose === 'kneel') {
    // Kneeling at floor plate 3
    r(img, 6, 10, 5, 4, C.hair_base);
    r(img, 6, 13, 4, 3, C.ghost_face); // Faceless memory figure
    r(img, 4, 16, 8, 6, C.ghost_base);
    p(img, 7, 17, C.ghost_hi);
    // Arms reaching down toward floor plate
    r(img, 3, 17, 2, 6, C.ghost_sh);
    r(img, 11, 17, 2, 6, C.ghost_sh);
    p(img, 11, 21, C.cyan_glow); // Faint wrist glow
    // Legs bent in kneel at row 31
    r(img, 4, 23, 8, 5, C.ghost_base);
    r(img, 4, 28, 8, 4, C.ghost_sh);
    // Floor plate 3 contact indicator
    l(img, 4, 31, 12, 31, [40, 56, 75, 255]);
  } else if (pose === 'slide_card') {
    // Kneeling, extending right hand to slip gold/cyan keycard under plate
    r(img, 6, 11, 5, 4, C.hair_base);
    r(img, 6, 14, 4, 3, C.ghost_face);
    r(img, 4, 17, 8, 6, C.ghost_base);
    r(img, 3, 18, 2, 6, C.ghost_sh);
    // Right arm reaching forward along floor
    r(img, 10, 18, 3, 5, C.ghost_sh);
    r(img, 11, 24, 3, 3, C.ghost_sh);
    // Gold/cyan Access Card sliding into floor seam!
    r(img, 11, 29, 3, 2, C.amber);
    p(img, 12, 29, C.cyan_glow);
    // Bent knees grounded at y=31
    r(img, 4, 24, 7, 5, C.ghost_base);
    r(img, 4, 29, 7, 3, C.ghost_sh);
    l(img, 3, 31, 13, 31, [40, 56, 75, 255]);
  } else if (pose === 'look_up') {
    // Kneeling, head tilting up toward camera/player
    r(img, 6, 8, 5, 5, C.hair_base);
    p(img, 7, 7, C.hair_hi);
    // Face angle tilted upward, shadowy blank expression
    r(img, 6, 10, 5, 4, C.ghost_face);
    p(img, 7, 11, [15, 20, 30, 255]);
    p(img, 9, 11, [15, 20, 30, 255]);
    // Torso & knees
    r(img, 4, 15, 8, 7, C.ghost_base);
    r(img, 3, 16, 2, 6, C.ghost_sh);
    r(img, 11, 16, 2, 6, C.ghost_sh);
    p(img, 11, 20, C.cyan_glow);
    r(img, 4, 23, 8, 5, C.ghost_base);
    r(img, 4, 28, 8, 4, C.ghost_sh);
  } else if (pose === 'write_frost') {
    // Facing North (back to camera), right hand raised writing on frosted glass
    r(img, 6, 3, 4, 3, C.hair_base);
    r(img, 4, 6, 8, 5, C.hair_base);
    r(img, 6, 11, 4, 2, C.ghost_sh);
    r(img, 4, 13, 8, 6, C.ghost_base);
    // Left arm down
    r(img, 2, 14, 2, 7, C.ghost_sh);
    p(img, 2, 19, C.cyan_glow);
    // Right arm raised high against glass viewport!
    r(img, 11, 12, 3, 3, C.ghost_base);
    r(img, 12, 8, 2, 4, C.ghost_sh);
    r(img, 11, 6, 3, 2, C.ghost_hi); // Finger on glass
    // Frost lettering condensation particles ("DON'T ANSWER")
    p(img, 9, 6, [210, 240, 255, 220]);
    p(img, 10, 5, [180, 230, 255, 180]);
    p(img, 12, 5, [220, 250, 255, 240]);
    p(img, 13, 6, [180, 230, 255, 180]);
    // Trousers & boots grounded
    r(img, 5, 19, 3, 9, C.ghost_base);
    r(img, 8, 19, 3, 9, C.ghost_base);
    r(img, 4, 28, 4, 4, C.ghost_sh);
    r(img, 8, 28, 4, 4, C.ghost_sh);
  } else if (pose === 'dissolve') {
    // 4 frames: stagger, clutch chest, particle fade
    if (step === 0) {
      // Staggering back
      r(img, 5, 5, 6, 5, C.ghost_base);
      r(img, 6, 7, 4, 3, C.ghost_face);
      r(img, 4, 11, 8, 7, C.ghost_base);
      r(img, 3, 13, 2, 5, C.ghost_sh);
      // Hand clutching temple
      r(img, 10, 8, 3, 4, C.ghost_sh);
      r(img, 5, 19, 3, 9, C.ghost_base);
      r(img, 8, 20, 3, 8, C.ghost_base);
      r(img, 4, 28, 4, 4, C.ghost_sh); r(img, 8, 28, 4, 4, C.ghost_sh);
    } else if (step === 1) {
      // Dissolving edges, cyan artifacting
      r(img, 5, 6, 6, 4, C.ghost_base);
      r(img, 4, 12, 7, 6, C.ghost_base);
      p(img, 3, 10, C.cyan_glow); p(img, 12, 11, C.cyan_glow);
      r(img, 5, 19, 3, 8, C.ghost_sh); r(img, 8, 20, 3, 8, C.ghost_sh);
      p(img, 6, 25, C.cyan_glow); p(img, 10, 24, C.cyan_glow);
      r(img, 4, 28, 4, 4, C.ghost_sh); r(img, 8, 28, 4, 4, C.ghost_sh);
    } else if (step === 2) {
      // Half faded, static breakup
      for (let y = 6; y < 32; y += 2) {
        for (let x = 4; x < 12; x += 2) {
          p(img, x, y, Math.random() > 0.4 ? C.ghost_sh : C.cyan_glow);
        }
      }
    } else {
      // Residual scattering cyan embers
      p(img, 5, 12, C.cyan_glow); p(img, 8, 16, C.cyan_core);
      p(img, 10, 22, C.cyan_glow); p(img, 6, 28, C.cyan_deep);
    }
  }

  return img;
}

// =============================================================
// BLOCK 5: SUPPORTING CAST
// 1. Mira Sen (Standard & Faceless) — CHAR-MIRA-001
// 2. Mira with Cane — CHAR-MIRA-CANE-001
// 3. Elias Voss (Standard & Faceless) — CHAR-VOSS-001
// 4. Tender Drone — CHAR-TENDER-001
// =============================================================

function renderMira(dir, variant = 'standard', step = 0) {
  const img = createImage(16, 32);
  const leg = [0, 1, 0, -1][step] ?? 0;
  const arm = [0, -1, 0, 1][step] ?? 0;

  if (dir === 'south') {
    // Short neat hair
    r(img, 5, 4, 6, 3, C.hair_base);
    p(img, 6, 4, C.hair_hi); p(img, 7, 4, C.hair_hi);
    r(img, 4, 6, 2, 4, C.hair_base); r(img, 10, 6, 2, 4, C.hair_base);
    // Face
    if (variant === 'standard') {
      r(img, 6, 6, 4, 4, C.skin_base);
      p(img, 6, 7, C.eye); p(img, 9, 7, C.eye);
    } else {
      r(img, 6, 6, 4, 4, C.ghost_face); // Faceless memory variant
    }
    // High collar & Pale Research Lab Coat
    r(img, 6, 10, 4, 2, C.coat_sh);
    r(img, 3, 12, 10, 8, C.coat_white);
    l(img, 8, 12, 8, 20, C.coat_sh); // Coat center opening
    r(img, 4, 13, 3, 6, C.coat_hi);
    // Arms in lab coat
    r(img, 2, 12 + arm, 2, 6, C.coat_white); r(img, 2, 18 + arm, 2, 2, C.skin_base);
    r(img, 12, 12 - arm, 2, 6, C.coat_white); r(img, 12, 18 - arm, 2, 2, C.skin_base);
    // Dark trousers
    r(img, 5, 20, 3, 8 + leg, C.pant_base);
    r(img, 8, 20, 3, 8 - leg, C.pant_base);
    // Boots
    r(img, 4, 28 + leg, 4, 4, C.boot_base);
    r(img, 8, 28 - leg, 4, 4, C.boot_base);
  } else if (dir === 'north') {
    r(img, 4, 4, 8, 6, C.hair_base);
    r(img, 6, 10, 4, 2, C.coat_sh);
    r(img, 3, 12, 10, 8, C.coat_white);
    r(img, 2, 12 - arm, 2, 6, C.coat_white);
    r(img, 12, 12 + arm, 2, 6, C.coat_white);
    r(img, 5, 20, 3, 8 - leg, C.pant_base);
    r(img, 8, 20, 3, 8 + leg, C.pant_base);
    r(img, 4, 28 - leg, 4, 4, C.boot_base);
    r(img, 8, 28 + leg, 4, 4, C.boot_base);
  } else {
    // East profile
    r(img, 5, 4, 5, 4, C.hair_base);
    if (variant === 'standard') {
      r(img, 9, 6, 2, 4, C.skin_base); p(img, 10, 7, C.eye);
    } else {
      r(img, 9, 6, 2, 4, C.ghost_face);
    }
    r(img, 5, 12, 6, 8, C.coat_white);
    r(img, 6, 13 + arm, 3, 6, C.coat_hi);
    r(img, 6, 20, 4, 8, C.pant_base);
    r(img, 6 + leg, 28, 4, 4, C.boot_base);
  }

  return img;
}

function renderMiraCane(dir, step = 0) {
  const img = renderMira(dir, 'standard', step);
  // Add ergonomic metallic walking cane in right hand
  if (dir === 'south' || dir === 'north') {
    // Cane planted on right side
    l(img, 13, 18, 13, 31, [160, 175, 195, 255]);
    p(img, 13, 17, C.amber); // Amber grip handle
    p(img, 13, 31, [60, 75, 95, 255]); // Rubber ferrule tip grounded at y=31
  } else {
    // Side profile cane
    l(img, 11, 18, 12, 31, [160, 175, 195, 255]);
    p(img, 11, 17, C.amber);
    p(img, 12, 31, [60, 75, 95, 255]);
  }
  return img;
}

function renderVoss(dir, variant = 'standard', step = 0) {
  const img = createImage(16, 32);
  const leg = [0, 1, 0, -1][step] ?? 0;
  const arm = [0, -1, 0, 1][step] ?? 0;

  // Voss is slightly taller (head at y=3)
  if (dir === 'south') {
    // Short brown/dark hair
    r(img, 5, 3, 6, 3, C.voss_hair);
    r(img, 4, 5, 2, 3, C.voss_hair); r(img, 10, 5, 2, 3, C.voss_hair);
    if (variant === 'standard') {
      r(img, 6, 5, 4, 5, C.skin_base);
      p(img, 6, 7, C.eye); p(img, 9, 7, C.eye);
      p(img, 7, 9, C.skin_sh); // Stronger jawline
    } else {
      r(img, 6, 5, 4, 5, C.ghost_face);
    }
    // Broad shoulders (12px) & dark work shirt with vest
    r(img, 2, 10, 12, 2, C.voss_shirt);
    r(img, 3, 12, 10, 7, C.voss_vest);
    l(img, 8, 12, 8, 19, C.voss_vest_sh);
    // Rolled up sleeves (forearms exposed)
    r(img, 1, 11 + arm, 2, 4, C.voss_shirt);
    r(img, 1, 15 + arm, 2, 4, C.skin_base); // Forearm
    r(img, 13, 11 - arm, 2, 4, C.voss_shirt);
    r(img, 13, 15 - arm, 2, 4, C.skin_base);
    // Heavy tool belt
    r(img, 3, 19, 10, 2, C.belt);
    p(img, 4, 19, C.amber); p(img, 11, 19, C.pouch);
    // Trousers
    r(img, 5, 21, 3, 7 + leg, C.pant_base);
    r(img, 8, 21, 3, 7 - leg, C.pant_base);
    // Heavy boots grounded at y=31
    r(img, 4, 28 + leg, 4, 4, C.boot_base);
    r(img, 8, 28 - leg, 4, 4, C.boot_base);
  } else if (dir === 'north') {
    r(img, 4, 3, 8, 5, C.voss_hair);
    r(img, 2, 10, 12, 9, C.voss_vest);
    r(img, 1, 11 - arm, 2, 8, C.voss_shirt);
    r(img, 13, 11 + arm, 2, 8, C.voss_shirt);
    r(img, 3, 19, 10, 2, C.belt);
    r(img, 5, 21, 3, 7 - leg, C.pant_base);
    r(img, 8, 21, 3, 7 + leg, C.pant_base);
    r(img, 4, 28 - leg, 4, 4, C.boot_base);
    r(img, 8, 28 + leg, 4, 4, C.boot_base);
  } else {
    // East profile
    r(img, 5, 3, 6, 4, C.voss_hair);
    if (variant === 'standard') {
      r(img, 9, 5, 2, 5, C.skin_base); p(img, 10, 7, C.eye);
    } else {
      r(img, 9, 5, 2, 5, C.ghost_face);
    }
    r(img, 4, 10, 8, 9, C.voss_vest);
    r(img, 5, 12 + arm, 3, 6, C.skin_base);
    r(img, 5, 19, 6, 2, C.belt);
    r(img, 6, 21, 4, 7, C.pant_base);
    r(img, 6 + leg, 28, 4, 4, C.boot_base);
  }

  return img;
}

function renderTenderDrone(action, step = 0) {
  // Tender drone cell size: 16x16, sprite is ~16x10 grounded at y=15
  const img = createImage(16, 16);
  const legShift = [0, 1, 0, -1][step] ?? 0;

  // Mechanical body / chassis (y=5..10)
  r(img, 3, 5, 10, 5, C.drone_metal);
  r(img, 4, 4, 8, 1, C.drone_hi);
  r(img, 4, 10, 8, 1, C.drone_dark);

  // Sensor optic visor (glowing amber)
  r(img, 11, 6, 2, 2, C.drone_eye);
  p(img, 11, 6, [255, 220, 140, 255]);

  // Four articulated legs
  if (action === 'walk') {
    // Leg 1 (front left)
    l(img, 4, 10, 3 - legShift, 15, C.drone_dark);
    // Leg 2 (front right)
    l(img, 11, 10, 12 + legShift, 15, C.drone_dark);
    // Leg 3 (rear left)
    l(img, 6, 10, 5 + legShift, 15, C.drone_metal);
    // Leg 4 (rear right)
    l(img, 9, 10, 10 - legShift, 15, C.drone_metal);
  } else {
    // Clean sweep action: brush arm sweeps back and forth
    l(img, 4, 10, 3, 15, C.drone_dark);
    l(img, 11, 10, 12, 15, C.drone_dark);
    l(img, 6, 10, 6, 15, C.drone_metal);
    l(img, 9, 10, 9, 15, C.drone_metal);

    // Front cleaning brush arm
    const sweep = step === 0 ? 0 : (step === 1 ? 2 : (step === 2 ? 0 : -2));
    r(img, 12, 9, 2, 3, C.drone_metal);
    r(img, 11 + sweep, 13, 4, 3, C.drone_brush);
    p(img, 12 + sweep, 15, [200, 190, 180, 255]);
  }

  return img;
}

// =============================================================
// RUN GENERATION & PACKAGING
// =============================================================

console.log('Generating Block 2, Block 3, Block 4, and Block 5 spritesheets...');

mkdirSync(join(PLAYER_DIR, 'action-frames'), { recursive: true });
mkdirSync(join(ITER_DIR, 'ghost-frames'), { recursive: true });
mkdirSync(join(ITER_DIR, 'kneel-frames'), { recursive: true });
mkdirSync(join(MIRA_DIR, 'frames'), { recursive: true });
mkdirSync(join(VOSS_DIR, 'frames'), { recursive: true });
mkdirSync(join(TENDER_DIR, 'frames'), { recursive: true });

// -------------------------------------------------------------
// BLOCK 2: PLAYER ACTIONS
// Layout: 6 columns x 5 rows -> 96x160 px
// Row 0: Examine (3 frames)
// Row 1: Raise Wrist / ECHO Activate (4 frames)
// Row 2: ECHO Held Idle (2 frames)
// Row 3: ECHO Deactivate (3 frames)
// Row 4: Cradle Wake Up (5 frames)
// -------------------------------------------------------------
const actionSheet = createImage(96, 160);
const actionList = [
  { name: 'examine', count: 3, row: 0 },
  { name: 'echo_activate', count: 4, row: 1 },
  { name: 'echo_idle', count: 2, row: 2 },
  { name: 'echo_deactivate', count: 3, row: 3 },
  { name: 'wake_cradle', count: 5, row: 4 }
];

const actionFrames = [];
actionList.forEach(act => {
  for (let i = 0; i < act.count; i++) {
    const f = renderPlayerAction(act.name, i);
    blit(actionSheet, f, i * 16, act.row * 32);
    savePng(join(PLAYER_DIR, 'action-frames', `${act.name}-${i}.png`), f);
    if (act.name.startsWith('echo')) actionFrames.push(f);
  }
});
savePng(join(PLAYER_DIR, 'char-player-actions-001.png'), actionSheet);
savePng(join(OUT_BASE, 'char-player-actions-001.png'), actionSheet);

// ECHO preview GIF (3x scaled)
const echoGifFrames = actionFrames.map(f => {
  const scaled = createImage(48, 96);
  blit(scaled, f, 0, 0, 3);
  return scaled;
});
writeFileSync(join(PREVIEWS_DIR, 'echo-animation-preview.gif'), encodeGif(echoGifFrames, 12));

const actionMetadata = {
  assetId: 'CHAR-PLAYER-ACTIONS-001',
  name: 'Dr. Mira Sen / Iteration 017 Actions & ECHO Animations',
  sheet: { file: 'public/assets/characters/player/char-player-actions-001.png', width: 96, height: 160, cellWidth: 16, cellHeight: 32 },
  pivot: { x: 8, y: 31 },
  animations: {
    examine: { row: 0, frames: 3, fps: 8, loop: false },
    echo_activate: { row: 1, frames: 4, fps: 10, loop: false },
    echo_idle: { row: 2, frames: 2, fps: 4, loop: true },
    echo_deactivate: { row: 3, frames: 3, fps: 8, loop: false },
    wake_cradle: { row: 4, frames: 5, fps: 6, loop: false }
  }
};
writeFileSync(join(PLAYER_DIR, 'char-player-actions-001.json'), JSON.stringify(actionMetadata, null, 2) + '\n');
writeFileSync(join(OUT_BASE, 'char-player-actions-001.json'), JSON.stringify(actionMetadata, null, 2) + '\n');

// -------------------------------------------------------------
// BLOCK 3: GHOST / PREVIOUS ITERATION (CHAR-ITERATION-GHOST-001)
// Identical dimensions & layout to char-player-001: 80x128 px
// -------------------------------------------------------------
const ghostSheet = createImage(80, 128);
const directions = ['south', 'north', 'east', 'west'];
const ghostWalkPreviewFrames = [];

directions.forEach((dir, row) => {
  const idle = renderGhost(dir, 'idle', 0);
  blit(ghostSheet, idle, 0, row * 32);
  savePng(join(ITER_DIR, 'ghost-frames', `${dir}-idle.png`), idle);

  for (let s = 0; s < 4; s++) {
    const walkF = renderGhost(dir, 'walk', s);
    blit(ghostSheet, walkF, (s + 1) * 16, row * 32);
    savePng(join(ITER_DIR, 'ghost-frames', `${dir}-walk-${s}.png`), walkF);
    if (dir === 'south') {
      const scaled = createImage(48, 96);
      blit(scaled, walkF, 0, 0, 3);
      ghostWalkPreviewFrames.push(scaled);
    }
  }
});
savePng(join(ITER_DIR, 'char-iteration-ghost-001.png'), ghostSheet);
savePng(join(OUT_BASE, 'char-iteration-ghost-001.png'), ghostSheet);
writeFileSync(join(PREVIEWS_DIR, 'ghost-walk-preview.gif'), encodeGif(ghostWalkPreviewFrames, 12));

const ghostMetadata = {
  assetId: 'CHAR-ITERATION-GHOST-001',
  name: 'Previous Iteration / Memory Ghost (Concept C Derivation)',
  sheet: { file: 'public/assets/characters/iterations/char-iteration-ghost-001.png', width: 80, height: 128, cellWidth: 16, cellHeight: 32 },
  pivot: { x: 8, y: 31 },
  features: 'Faceless memory figure, spectral desaturated silhouette, cyan temporal aura, exact alignment with CHAR-PLAYER-001'
};
writeFileSync(join(ITER_DIR, 'char-iteration-ghost-001.json'), JSON.stringify(ghostMetadata, null, 2) + '\n');
writeFileSync(join(OUT_BASE, 'char-iteration-ghost-001.json'), JSON.stringify(ghostMetadata, null, 2) + '\n');

// -------------------------------------------------------------
// BLOCK 4: CINEMATIC POSES (CHAR-ITERATION-KNEEL-001)
// 8 frames x 16x32: 128x32 px
// 0: kneel, 1: slide card, 2: look up, 3: write frost, 4..7: dissolve
// -------------------------------------------------------------
const kneelSheet = createImage(128, 32);
const cinematicPoses = [
  { name: 'kneel', fn: () => renderCinematicPose('kneel') },
  { name: 'slide_card', fn: () => renderCinematicPose('slide_card') },
  { name: 'look_up', fn: () => renderCinematicPose('look_up') },
  { name: 'write_frost', fn: () => renderCinematicPose('write_frost') },
  { name: 'dissolve_0', fn: () => renderCinematicPose('dissolve', 0) },
  { name: 'dissolve_1', fn: () => renderCinematicPose('dissolve', 1) },
  { name: 'dissolve_2', fn: () => renderCinematicPose('dissolve', 2) },
  { name: 'dissolve_3', fn: () => renderCinematicPose('dissolve', 3) }
];

cinematicPoses.forEach((pDef, idx) => {
  const f = pDef.fn();
  blit(kneelSheet, f, idx * 16, 0);
  savePng(join(ITER_DIR, 'kneel-frames', `${pDef.name}.png`), f);
});
savePng(join(ITER_DIR, 'char-iteration-kneel-001.png'), kneelSheet);
savePng(join(OUT_BASE, 'char-iteration-kneel-001.png'), kneelSheet);

// Cinematic poses review contact preview (2x)
const kneelPreview = createImage(256, 64, [12, 16, 24, 255]);
blit(kneelPreview, kneelSheet, 0, 0, 2);
savePng(join(PREVIEWS_DIR, 'iteration-poses-preview.png'), kneelPreview);

const kneelMetadata = {
  assetId: 'CHAR-ITERATION-KNEEL-001',
  sheet: { file: 'public/assets/characters/iterations/char-iteration-kneel-001.png', width: 128, height: 32, cellWidth: 16, cellHeight: 32 },
  pivot: { x: 8, y: 31 },
  poses: {
    kneel_plate: 0,
    slide_card: 1,
    look_up: 2,
    write_frost: 3,
    dissolve: [4, 5, 6, 7]
  }
};
writeFileSync(join(ITER_DIR, 'char-iteration-kneel-001.json'), JSON.stringify(kneelMetadata, null, 2) + '\n');
writeFileSync(join(OUT_BASE, 'char-iteration-kneel-001.json'), JSON.stringify(kneelMetadata, null, 2) + '\n');

// -------------------------------------------------------------
// BLOCK 5: SUPPORTING CHARACTERS
// 1. Mira Sen (char-mira-001.png: 80x64, S/N/E/W x 2 variants)
// 2. Mira with Cane (char-mira-cane-001.png: 80x32)
// 3. Elias Voss (char-voss-001.png: 80x64)
// 4. Tender Drone (char-tender-001.png: 64x32, 16x16 cells)
// -------------------------------------------------------------

// Mira Sen (Normal + Faceless)
const miraSheet = createImage(80, 64);
['south', 'north', 'east', 'west'].forEach((dir, col) => {
  const norm = renderMira(dir, 'standard', 0);
  const face = renderMira(dir, 'faceless', 0);
  blit(miraSheet, norm, col * 16, 0);
  blit(miraSheet, face, col * 16, 32);
  savePng(join(MIRA_DIR, 'frames', `mira-${dir}-standard.png`), norm);
  savePng(join(MIRA_DIR, 'frames', `mira-${dir}-faceless.png`), face);
});
savePng(join(MIRA_DIR, 'char-mira-001.png'), miraSheet);
savePng(join(OUT_BASE, 'char-mira-001.png'), miraSheet);

// Mira with Cane
const miraCaneSheet = createImage(80, 32);
['south', 'north', 'east', 'west'].forEach((dir, col) => {
  const f = renderMiraCane(dir, 0);
  blit(miraCaneSheet, f, col * 16, 0);
  savePng(join(MIRA_DIR, 'frames', `mira-cane-${dir}.png`), f);
});
savePng(join(MIRA_DIR, 'char-mira-cane-001.png'), miraCaneSheet);
savePng(join(OUT_BASE, 'char-mira-cane-001.png'), miraCaneSheet);

// Elias Voss (Normal + Faceless)
const vossSheet = createImage(80, 64);
['south', 'north', 'east', 'west'].forEach((dir, col) => {
  const norm = renderVoss(dir, 'standard', 0);
  const face = renderVoss(dir, 'faceless', 0);
  blit(vossSheet, norm, col * 16, 0);
  blit(vossSheet, face, col * 16, 32);
  savePng(join(VOSS_DIR, 'frames', `voss-${dir}-standard.png`), norm);
  savePng(join(VOSS_DIR, 'frames', `voss-${dir}-faceless.png`), face);
});
savePng(join(VOSS_DIR, 'char-voss-001.png'), vossSheet);
savePng(join(OUT_BASE, 'char-voss-001.png'), vossSheet);

// Tender Drone (16x16 cells, 4 walk frames + 4 clean sweep frames -> 64x32)
const tenderSheet = createImage(64, 32);
for (let s = 0; s < 4; s++) {
  const walkF = renderTenderDrone('walk', s);
  const cleanF = renderTenderDrone('clean', s);
  blit(tenderSheet, walkF, s * 16, 0);
  blit(tenderSheet, cleanF, s * 16, 16);
  savePng(join(TENDER_DIR, 'frames', `tender-walk-${s}.png`), walkF);
  savePng(join(TENDER_DIR, 'frames', `tender-clean-${s}.png`), cleanF);
}
savePng(join(TENDER_DIR, 'char-tender-001.png'), tenderSheet);
savePng(join(OUT_BASE, 'char-tender-001.png'), tenderSheet);

// Supporting Characters Preview Panel (2x)
const supportPreview = createImage(160, 120, [12, 16, 24, 255]);
// Draw Mira, Mira Cane, Voss, Tender side by side
blit(supportPreview, renderMira('south', 'standard', 0), 10, 16, 2);
blit(supportPreview, renderMiraCane('south', 0), 46, 16, 2);
blit(supportPreview, renderVoss('south', 'standard', 0), 82, 16, 2);
blit(supportPreview, renderTenderDrone('clean', 0), 120, 36, 2);
savePng(join(PREVIEWS_DIR, 'supporting-characters-preview.png'), supportPreview);

console.log('All character spritesheets and previews generated successfully!');
