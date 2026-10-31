import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Target dimensions
const CELL_W = 16;
const CELL_H = 32;

// Output paths
const OUT_BASE = 'public/assets/characters';
const PLAYER_DIR = join(OUT_BASE, 'player');
const FRAMES_DIR = join(PLAYER_DIR, 'frames');
const PREVIEWS_DIR = join(OUT_BASE, 'previews');

// Palette definition matching Concept C
const C = {
  trans: [0, 0, 0, 0],
  // Outlines and deep shadow
  ink: [14, 18, 26, 255],
  crease: [22, 28, 38, 255],
  
  // Hair (dark adult tied back in high bun)
  hair_shadow: [12, 15, 22, 255],
  hair_base: [22, 28, 40, 255],
  hair_hi: [42, 54, 74, 255],

  // Face / skin
  skin_base: [216, 162, 136, 255],
  skin_sh: [168, 116, 96, 255],
  skin_hi: [238, 194, 172, 255],
  eye: [22, 26, 36, 255],

  // Asymmetrical Station Jacket (Concept C)
  // Base dark graphite body
  jacket_dark: [36, 46, 62, 255],
  jacket_sh: [24, 30, 42, 255],
  jacket_hi: [52, 66, 88, 255],
  // Iconic asymmetric slate-grey chest/back panel
  slate_panel: [115, 134, 158, 255],
  slate_hi: [148, 168, 194, 255],
  slate_sh: [84, 100, 122, 255],

  // Belt & harness
  belt: [18, 22, 30, 255],
  pouch: [46, 58, 76, 255],
  pouch_sh: [28, 36, 48, 255],

  // Amber utility accents
  amber: [230, 165, 65, 255],
  amber_hi: [252, 202, 98, 255],
  amber_sh: [175, 115, 35, 255],

  // Glowing cyan ECHO device
  cyan_core: [205, 255, 255, 255],
  cyan_glow: [0, 235, 245, 255],
  cyan_deep: [0, 145, 170, 255],
  cyan_aura: [0, 235, 245, 90],

  // Trousers & knee pads
  pant_base: [30, 38, 52, 255],
  pant_sh: [18, 24, 34, 255],
  knee_pad: [52, 64, 84, 255],
  knee_sh: [26, 32, 44, 255],

  // Heavy station boots
  boot_base: [16, 20, 28, 255],
  boot_hi: [34, 42, 56, 255],
  boot_sole: [10, 12, 18, 255]
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
    // Alpha blend
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

function blit(dst, src, dx, dy, scale = 1, flipX = false) {
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const srcX = flipX ? src.w - 1 - x : x;
      const at = (y * src.w + srcX) * 4;
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

// PNG Encoding
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
    raw[y * (img.w * 4 + 1)] = 0; // Filter None
    Buffer.from(img.data.slice(y * img.w * 4, (y + 1) * img.w * 4)).copy(raw, y * (img.w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0);
  ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
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

// GIF LZW Encoding
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
    if (dict.has(candidate)) {
      phrase = candidate;
    } else {
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
  push(phrase.includes(',') ? dict.get(phrase) : Number(phrase));
  push(end);
  if (count) output.push(bits & 255);
  return Buffer.from(output);
}

function encodeGif(frames, delayCs = 12) { // 12cs = 8.3 fps
  // Collect 256 color palette
  const palMap = new Map();
  const palette = [[0, 0, 0]]; // Index 0 = transparent
  palMap.set('0,0,0,0', 0);

  for (const frame of frames) {
    for (let i = 0; i < frame.w * frame.h; i++) {
      const idx = i * 4;
      if (frame.data[idx + 3] === 0) continue;
      const key = `${frame.data[idx]},${frame.data[idx + 1]},${frame.data[idx + 2]}`;
      if (!palMap.has(key)) {
        if (palette.length < 256) {
          palMap.set(key, palette.length);
          palette.push([frame.data[idx], frame.data[idx + 1], frame.data[idx + 2]]);
        }
      }
    }
  }

  // Pad palette to power of 2
  let pSize = 2;
  while (pSize < palette.length && pSize < 256) pSize <<= 1;
  const palBits = Math.max(1, Math.ceil(Math.log2(pSize)));

  const chunks = [Buffer.from('GIF89a', 'ascii')];
  const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(frames[0].w, 0);
  lsd.writeUInt16LE(frames[0].h, 2);
  lsd[4] = 0x80 | ((palBits - 1) << 4) | (palBits - 1); // GCT flag & color resolution
  lsd[5] = 0; // Background color index
  lsd[6] = 0; // Pixel aspect ratio
  chunks.push(lsd);

  // Global Color Table
  for (let i = 0; i < (1 << palBits); i++) {
    const col = palette[i] || [0, 0, 0];
    chunks.push(Buffer.from([col[0], col[1], col[2]]));
  }

  // Netscape loop block
  chunks.push(Buffer.from([0x21, 0xff, 0x0b]), Buffer.from('NETSCAPE2.0', 'ascii'), Buffer.from([3, 1, 0, 0, 0]));

  for (const frame of frames) {
    // Graphic Control Extension (Transparent + Delay)
    const gce = Buffer.alloc(8);
    gce[0] = 0x21; gce[1] = 0xf9; gce[2] = 4;
    gce[3] = 0x09; // Disposal method: restore to background, transparent flag = 1
    gce.writeUInt16LE(delayCs, 4); // Delay
    gce[6] = 0; // Transparent color index = 0
    gce[7] = 0; // Block terminator
    chunks.push(gce);

    // Image Descriptor
    const desc = Buffer.alloc(10);
    desc[0] = 0x2c;
    desc.writeUInt16LE(0, 1); // X
    desc.writeUInt16LE(0, 3); // Y
    desc.writeUInt16LE(frame.w, 5);
    desc.writeUInt16LE(frame.h, 7);
    desc[9] = 0; // Local palette flag: none
    chunks.push(desc);

    // Indexed pixels
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
    chunks.push(Buffer.from([0])); // Block terminator
  }

  chunks.push(Buffer.from([0x3b])); // Trailer
  return Buffer.concat(chunks);
}

// -------------------------------------------------------------
// SPRITE RENDERING LOGIC — CONCEPT C
// -------------------------------------------------------------
// Character dimensions: approx 12x27 px within 16x32 cell.
// Bottom-centre alignment at y=31.
// -------------------------------------------------------------

function renderConceptC(dir, animType, step = 0) {
  const img = createImage(CELL_W, CELL_H);

  // Bob and limb offsets based on walk step
  // step: 0=step A, 1=pass A, 2=step B, 3=pass B, idle=0
  let bob = 0;
  let legL = 0, legR = 0;
  let armL = 0, armR = 0;

  if (animType === 'walk') {
    if (step === 0) {
      legL = -2; legR = 2; armL = 1; armR = -1; bob = 0;
    } else if (step === 1) {
      legL = 0; legR = 0; armL = 0; armR = 0; bob = -1;
    } else if (step === 2) {
      legL = 2; legR = -2; armL = -1; armR = 1; bob = 0;
    } else if (step === 3) {
      legL = 0; legR = 0; armL = 0; armR = 0; bob = -1;
    }
  }

  const yOff = bob; // Torso & head move by bob

  if (dir === 'south') {
    // -----------------------------------------------------------
    // SOUTH VIEW (Front)
    // Concept C: Tied-back dark hair bun, asymmetric jacket with
    // slate chest flap crossing left shoulder/chest, utility belt with
    // pouches & amber fastener, dark trousers with knee reinforcements,
    // heavy boots, cyan ECHO device on LEFT wrist (viewer's right).
    // -----------------------------------------------------------

    // Hair bun (behind head, high up)
    r(img, 7, 3 + yOff, 3, 2, C.hair_base);
    p(img, 8, 2 + yOff, C.hair_shadow);
    p(img, 8, 3 + yOff, C.hair_hi);

    // Head base & hair top
    r(img, 5, 4 + yOff, 6, 2, C.hair_base);
    p(img, 6, 4 + yOff, C.hair_hi);
    p(img, 7, 4 + yOff, C.hair_hi);

    // Hair silhouette / sides framing face
    r(img, 4, 6 + yOff, 2, 4, C.hair_base);
    r(img, 10, 6 + yOff, 2, 4, C.hair_base);
    p(img, 4, 7 + yOff, C.hair_shadow);
    p(img, 11, 7 + yOff, C.hair_shadow);

    // Face / skin
    r(img, 6, 6 + yOff, 4, 4, C.skin_base);
    p(img, 6, 9 + yOff, C.skin_sh); // Chin shadow
    p(img, 9, 9 + yOff, C.skin_sh);

    // Eyes (subtle, calm adult focus)
    p(img, 6, 7 + yOff, C.eye);
    p(img, 9, 7 + yOff, C.eye);

    // High dark station collar
    r(img, 6, 10 + yOff, 4, 1, C.ink);
    r(img, 6, 11 + yOff, 4, 1, C.jacket_dark);
    p(img, 7, 11 + yOff, C.amber); // Tiny amber collar clasp

    // Shoulders
    r(img, 3, 12 + yOff, 10, 1, C.jacket_dark);
    p(img, 3, 12 + yOff, C.ink);
    p(img, 12, 12 + yOff, C.ink);

    // Main Torso / Jacket — Asymmetric Concept C design!
    // Right torso (viewer's left: x=4..6): dark graphite station jacket
    r(img, 4, 13 + yOff, 3, 5, C.jacket_dark);
    p(img, 4, 13 + yOff, C.jacket_hi);
    // Shoulder harness strap & amber clip on character's right
    l(img, 5, 12 + yOff, 5, 17 + yOff, C.crease);
    p(img, 5, 14 + yOff, C.amber);

    // Left torso (viewer's right: x=7..11): Distinctive slate-grey flap!
    // Diagonal cut from center collar down to left ribcage
    r(img, 7, 13 + yOff, 4, 5, C.slate_panel);
    p(img, 7, 12 + yOff, C.slate_hi);
    p(img, 8, 13 + yOff, C.slate_hi);
    p(img, 9, 13 + yOff, C.slate_hi);
    p(img, 10, 14 + yOff, C.slate_panel);
    p(img, 10, 17 + yOff, C.amber); // Amber fastener at corner of flap
    l(img, 7, 13 + yOff, 7, 17 + yOff, C.slate_sh); // Edge seam

    // Arms
    // Right arm (viewer's left, swinging with armR)
    r(img, 2, 13 + yOff + armR, 2, 4, C.jacket_dark);
    p(img, 2, 13 + yOff + armR, C.jacket_hi);
    r(img, 2, 17 + yOff + armR, 2, 2, C.crease); // Forearm / cuff
    r(img, 2, 19 + yOff + armR, 2, 2, C.hair_base); // Dark fingerless glove

    // Left arm (viewer's right, swinging with armL) — HAS CYAN ECHO DEVICE!
    r(img, 12, 13 + yOff + armL, 2, 4, C.jacket_dark);
    p(img, 13, 13 + yOff + armL, C.jacket_hi);
    r(img, 12, 17 + yOff + armL, 2, 1, C.crease); // Cuff
    // Glowing cyan ECHO wrist device!
    r(img, 12, 18 + yOff + armL, 2, 2, C.cyan_glow);
    p(img, 12, 18 + yOff + armL, C.cyan_core);
    p(img, 13, 19 + yOff + armL, C.cyan_deep);
    // Cyan soft aura
    p(img, 14, 18 + yOff + armL, C.cyan_aura);
    // Dark glove hand
    r(img, 12, 20 + yOff + armL, 2, 1, C.hair_base);

    // Utility Belt (Row 18)
    r(img, 4, 18 + yOff, 8, 1, C.belt);
    p(img, 4, 18 + yOff, C.pouch); // Hip pouch right
    p(img, 11, 18 + yOff, C.pouch); // Hip pouch left
    p(img, 7, 18 + yOff, C.slate_hi); // Center buckle
    p(img, 10, 19 + yOff, C.amber); // Hanging amber tag / ring below left pouch
    p(img, 10, 20 + yOff, C.amber_sh);

    // Trousers & Legs
    // Left leg (viewer's left, legL)
    r(img, 5, 19 + yOff, 3, 5 + legL, C.pant_base);
    p(img, 4, 21 + yOff, C.pant_sh); // Outer seam cargo pouch
    p(img, 4, 22 + yOff, C.pant_sh);
    // Knee reinforcement pad
    r(img, 5, 24 + yOff + Math.floor(legL / 2), 3, 2, C.knee_pad);
    p(img, 6, 24 + yOff + Math.floor(legL / 2), C.amber); // Subtle amber knee rivet
    // Lower trouser
    r(img, 5, 26 + yOff + legL, 3, 2, C.pant_sh);

    // Right leg (viewer's right, legR)
    r(img, 8, 19 + yOff, 3, 5 + legR, C.pant_base);
    p(img, 11, 21 + yOff, C.pant_sh); // Outer seam cargo pouch
    p(img, 11, 22 + yOff, C.pant_sh);
    // Knee reinforcement pad
    r(img, 8, 24 + yOff + Math.floor(legR / 2), 3, 2, C.knee_pad);
    p(img, 9, 24 + yOff + Math.floor(legR / 2), C.amber);
    // Lower trouser
    r(img, 8, 26 + yOff + legR, 3, 2, C.pant_sh);

    // Heavy Station Boots (y=28..31)
    // Left boot
    r(img, 4, 28 + legL, 4, 3, C.boot_base);
    p(img, 4, 28 + legL, C.boot_hi);
    p(img, 4, 29 + legL, C.amber); // Amber lace/boot fastener
    r(img, 4, 31, 4, 1, C.boot_sole); // Firm ground at y=31

    // Right boot
    r(img, 8, 28 + legR, 4, 3, C.boot_base);
    p(img, 11, 28 + legR, C.boot_hi);
    p(img, 11, 29 + legR, C.amber);
    r(img, 8, 31, 4, 1, C.boot_sole);

  } else if (dir === 'north') {
    // -----------------------------------------------------------
    // NORTH VIEW (Back)
    // Concept C: Dark tied-back hair bun with strands, collar,
    // asymmetrical back yoke crossing diagonally from left shoulder
    // across back, utility belt with pouches seen from behind,
    // dark trousers, boots with amber heel accents.
    // -----------------------------------------------------------

    // Hair bun (prominent from behind)
    r(img, 6, 2 + yOff, 4, 3, C.hair_base);
    p(img, 7, 2 + yOff, C.hair_hi);
    p(img, 8, 2 + yOff, C.hair_hi);
    p(img, 7, 4 + yOff, C.hair_shadow); // Bun tie

    // Back of head
    r(img, 4, 5 + yOff, 8, 5, C.hair_base);
    p(img, 5, 5 + yOff, C.hair_hi);
    p(img, 10, 5 + yOff, C.hair_hi);
    p(img, 4, 7 + yOff, C.hair_shadow);
    p(img, 11, 7 + yOff, C.hair_shadow);

    // Nape of neck & high collar
    r(img, 6, 10 + yOff, 4, 2, C.ink);
    p(img, 6, 11 + yOff, C.jacket_dark);
    p(img, 9, 11 + yOff, C.jacket_dark);

    // Shoulders
    r(img, 3, 12 + yOff, 10, 1, C.jacket_dark);

    // Torso / Back — Asymmetric back yoke of Concept C!
    // Dark graphite base
    r(img, 4, 13 + yOff, 8, 5, C.jacket_dark);
    // Diagonal slate back panel from character's left (viewer's left x=4..7)
    // crossing downward to right flank
    p(img, 4, 13 + yOff, C.slate_panel);
    p(img, 5, 13 + yOff, C.slate_panel);
    p(img, 6, 14 + yOff, C.slate_panel);
    p(img, 7, 14 + yOff, C.slate_panel);
    p(img, 8, 15 + yOff, C.slate_panel);
    p(img, 9, 15 + yOff, C.slate_panel);
    p(img, 9, 16 + yOff, C.amber); // Back panel fastener rivet
    l(img, 4, 14 + yOff, 9, 16 + yOff, C.slate_sh);

    // Arms seen from behind
    // Character's right arm (viewer's right, armR)
    r(img, 12, 13 + yOff - armR, 2, 5, C.jacket_dark);
    r(img, 12, 18 + yOff - armR, 2, 3, C.hair_base);

    // Character's left arm (viewer's left, armL) — cyan glow visible on wrist rim
    r(img, 2, 13 + yOff - armL, 2, 5, C.jacket_dark);
    r(img, 2, 18 + yOff - armL, 2, 1, C.cyan_glow); // ECHO device rim
    p(img, 2, 18 + yOff - armL, C.cyan_core);
    r(img, 2, 19 + yOff - armL, 2, 2, C.hair_base);

    // Utility Belt from behind (Row 18)
    r(img, 4, 18 + yOff, 8, 1, C.belt);
    p(img, 4, 18 + yOff, C.pouch);
    p(img, 11, 18 + yOff, C.pouch);
    p(img, 5, 19 + yOff, C.amber); // Amber lanyard on left hip (viewer's left)
    p(img, 5, 20 + yOff, C.amber_sh);

    // Trousers
    r(img, 5, 19 + yOff, 3, 8 - legL, C.pant_base);
    r(img, 8, 19 + yOff, 3, 8 - legR, C.pant_base);
    p(img, 4, 21 + yOff, C.pant_sh);
    p(img, 11, 21 + yOff, C.pant_sh);
    // Back crease
    l(img, 6, 21 + yOff, 6, 27 + yOff, C.pant_sh);
    l(img, 9, 21 + yOff, 9, 27 + yOff, C.pant_sh);

    // Boots (back view, amber heel reflector)
    r(img, 4, 28 - legL, 4, 3, C.boot_base);
    p(img, 5, 29 - legL, C.amber); // Amber heel accent
    r(img, 4, 31, 4, 1, C.boot_sole);

    r(img, 8, 28 - legR, 4, 3, C.boot_base);
    p(img, 9, 29 - legR, C.amber); // Amber heel accent
    r(img, 8, 31, 4, 1, C.boot_sole);

  } else if (dir === 'east') {
    // -----------------------------------------------------------
    // EAST VIEW (Walking right / side profile)
    // Facing right. Character's right side is foreground,
    // left side with cyan wrist device swings forward/back.
    // Concept C: High hair bun trailing back, face profile right,
    // asymmetric slate chest panel wrapping front edge, utility belt
    // with side pouches, boots stride.
    // -----------------------------------------------------------

    // Hair bun (protruding backward to left)
    r(img, 4, 3 + yOff, 3, 3, C.hair_base);
    p(img, 4, 4 + yOff, C.hair_shadow);
    p(img, 5, 3 + yOff, C.hair_hi);

    // Head profile
    r(img, 6, 4 + yOff, 5, 3, C.hair_base);
    p(img, 8, 4 + yOff, C.hair_hi);
    r(img, 5, 7 + yOff, 4, 3, C.hair_base); // Hair over ear/neck

    // Face profile (facing right, x=9..11)
    r(img, 9, 6 + yOff, 2, 4, C.skin_base);
    p(img, 11, 7 + yOff, C.skin_base); // Nose bridge
    p(img, 10, 7 + yOff, C.eye); // Eye profile
    p(img, 9, 9 + yOff, C.skin_sh); // Jawline

    // High collar
    r(img, 7, 10 + yOff, 4, 2, C.jacket_dark);
    p(img, 10, 11 + yOff, C.ink);

    // Torso side
    r(img, 5, 12 + yOff, 6, 6, C.jacket_dark);
    // Slate panel wraps around chest front (x=9..10)
    p(img, 9, 13 + yOff, C.slate_panel);
    p(img, 10, 13 + yOff, C.slate_hi);
    p(img, 9, 14 + yOff, C.slate_panel);
    p(img, 10, 14 + yOff, C.slate_panel);
    p(img, 10, 15 + yOff, C.amber); // Amber chest fastener
    p(img, 5, 13 + yOff, C.jacket_sh); // Back shadow

    // Arm (in foreground, swinging with armR)
    r(img, 6, 12 + yOff + armR, 3, 4, C.jacket_dark);
    p(img, 7, 12 + yOff + armR, C.jacket_hi);
    r(img, 6, 16 + yOff + armR, 2, 2, C.crease);
    // Wrist / hand
    r(img, 6, 18 + yOff + armR, 2, 2, C.hair_base);

    // Left arm in background (when walking, its cyan device flashes at side)
    if (armL > 0) {
      p(img, 10, 17 + yOff + armL, C.cyan_glow);
      p(img, 10, 18 + yOff + armL, C.cyan_core);
    } else if (armL < 0) {
      p(img, 3, 17 + yOff + armL, C.cyan_glow);
    }

    // Utility Belt & Pouch (Row 18)
    r(img, 5, 18 + yOff, 6, 1, C.belt);
    r(img, 7, 18 + yOff, 2, 2, C.pouch); // Side pouch
    p(img, 9, 19 + yOff, C.amber); // Amber utility clip

    // Legs in profile
    // Leg stride: legR is forward/back, legL is opposite
    const legFront = legR;
    const legBack = -legR;

    // Trousers
    r(img, 6, 20 + yOff, 4, 7, C.pant_base);
    p(img, 5, 22 + yOff, C.pant_sh);
    // Side cargo pocket
    r(img, 7, 21 + yOff, 2, 3, C.pant_sh);
    p(img, 7, 21 + yOff, C.pant_base);
    // Knee pad in profile
    p(img, 9, 24 + yOff, C.knee_pad);
    p(img, 9, 25 + yOff, C.amber);

    // Boots (Stride)
    // Forward foot
    r(img, 7 + legFront, 28, 4, 3, C.boot_base);
    p(img, 10 + legFront, 29, C.amber); // Boot tip/accent
    r(img, 7 + legFront, 31, 4, 1, C.boot_sole);

    // Back foot
    if (animType === 'walk' && Math.abs(legBack) > 0) {
      r(img, 5 + legBack, 28, 3, 3, C.boot_base);
      p(img, 4 + legBack, 29, C.amber);
      r(img, 5 + legBack, 31, 3, 1, C.boot_sole);
    }

  } else if (dir === 'west') {
    // -----------------------------------------------------------
    // WEST VIEW (Walking left / side profile)
    // Concept C has important asymmetry!
    // In west view, her LEFT side is in the foreground!
    // That means:
    // 1. The glowing cyan ECHO device is directly in the FOREGROUND on her left wrist!
    // 2. The prominent slate chest panel is facing left!
    // 3. The amber lanyard hangs on this side!
    // This makes generating West explicitly vastly superior to simple mirroring!
    // -----------------------------------------------------------

    // Hair bun (trailing right/backward)
    r(img, 9, 3 + yOff, 3, 3, C.hair_base);
    p(img, 11, 4 + yOff, C.hair_shadow);
    p(img, 10, 3 + yOff, C.hair_hi);

    // Head profile
    r(img, 5, 4 + yOff, 5, 3, C.hair_base);
    p(img, 7, 4 + yOff, C.hair_hi);
    r(img, 7, 7 + yOff, 4, 3, C.hair_base); // Hair over ear/neck

    // Face profile (facing left, x=4..6)
    r(img, 5, 6 + yOff, 2, 4, C.skin_base);
    p(img, 4, 7 + yOff, C.skin_base); // Nose bridge
    p(img, 5, 7 + yOff, C.eye); // Eye profile
    p(img, 6, 9 + yOff, C.skin_sh); // Jawline

    // High collar
    r(img, 5, 10 + yOff, 4, 2, C.jacket_dark);
    p(img, 5, 11 + yOff, C.ink);

    // Torso side (left side has the prominent slate panel!)
    r(img, 5, 12 + yOff, 6, 6, C.slate_panel);
    p(img, 5, 13 + yOff, C.slate_hi);
    p(img, 6, 13 + yOff, C.slate_hi);
    p(img, 5, 14 + yOff, C.slate_panel);
    p(img, 5, 15 + yOff, C.amber); // Amber fastener
    p(img, 10, 13 + yOff, C.jacket_sh); // Dark back edge

    // Forearm / Wrist in foreground: HAS CYAN ECHO DEVICE!
    r(img, 7, 12 + yOff + armL, 3, 4, C.jacket_dark);
    p(img, 8, 12 + yOff + armL, C.jacket_hi);
    r(img, 7, 16 + yOff + armL, 2, 1, C.crease);
    // Glowing cyan ECHO device on foreground wrist!
    r(img, 7, 17 + yOff + armL, 3, 2, C.cyan_glow);
    p(img, 7, 17 + yOff + armL, C.cyan_core);
    p(img, 8, 17 + yOff + armL, C.cyan_core);
    p(img, 9, 18 + yOff + armL, C.cyan_deep);
    // Dark glove hand
    r(img, 7, 19 + yOff + armL, 2, 2, C.hair_base);

    // Utility Belt & Lanyard (Row 18)
    r(img, 5, 18 + yOff, 6, 1, C.belt);
    r(img, 7, 18 + yOff, 2, 2, C.pouch);
    p(img, 6, 19 + yOff, C.amber); // Amber lanyard / tag hanging down
    p(img, 6, 20 + yOff, C.amber_sh);

    // Legs in profile
    const legFront = legL;
    const legBack = -legL;

    r(img, 6, 20 + yOff, 4, 7, C.pant_base);
    p(img, 10, 22 + yOff, C.pant_sh);
    r(img, 7, 21 + yOff, 2, 3, C.pant_sh);
    p(img, 6, 24 + yOff, C.knee_pad);
    p(img, 6, 25 + yOff, C.amber);

    // Boots (Stride)
    r(img, 5 - legFront, 28, 4, 3, C.boot_base);
    p(img, 5 - legFront, 29, C.amber);
    r(img, 5 - legFront, 31, 4, 1, C.boot_sole);

    if (animType === 'walk' && Math.abs(legBack) > 0) {
      r(img, 8 - legBack, 28, 3, 3, C.boot_base);
      p(img, 10 - legBack, 29, C.amber);
      r(img, 8 - legBack, 31, 3, 1, C.boot_sole);
    }
  }

  return img;
}

// -------------------------------------------------------------
// MAIN GENERATION SUITE
// -------------------------------------------------------------

console.log('Generating approved Concept C player spritesheets...');

mkdirSync(FRAMES_DIR, { recursive: true });
mkdirSync(PREVIEWS_DIR, { recursive: true });

const directions = ['south', 'north', 'east', 'west'];
const framesData = {};

// Generate all individual frames
for (const dir of directions) {
  framesData[dir] = {
    idle: renderConceptC(dir, 'idle', 0),
    walk: [
      renderConceptC(dir, 'walk', 0),
      renderConceptC(dir, 'walk', 1),
      renderConceptC(dir, 'walk', 2),
      renderConceptC(dir, 'walk', 3)
    ]
  };

  // Save individual PNG frames
  savePng(join(FRAMES_DIR, `${dir}-idle.png`), framesData[dir].idle);
  for (let i = 0; i < 4; i++) {
    savePng(join(FRAMES_DIR, `${dir}-walk-${i}.png`), framesData[dir].walk[i]);
  }
}

// Generate Spritesheets:
// Sheet 1: 4 directions x 5 frames (Idle, Walk-0..3) -> 80x128 px
const fullSheet = createImage(80, 128);
directions.forEach((dir, row) => {
  blit(fullSheet, framesData[dir].idle, 0, row * CELL_H);
  framesData[dir].walk.forEach((frame, col) => {
    blit(fullSheet, frame, (col + 1) * CELL_W, row * CELL_H);
  });
});

// Also create 3-row compatible sheet (South, North, East with East mirrored for West) -> 80x96 px
const compatSheet = createImage(80, 96);
['south', 'north', 'east'].forEach((dir, row) => {
  blit(compatSheet, framesData[dir].idle, 0, row * CELL_H);
  framesData[dir].walk.forEach((frame, col) => {
    blit(compatSheet, frame, (col + 1) * CELL_W, row * CELL_H);
  });
});

// Save to both requested locations:
// 1. characters/player/char-player-001.png
// 2. characters/char-player-001.png
savePng(join(PLAYER_DIR, 'char-player-001.png'), fullSheet);
savePng(join(OUT_BASE, 'char-player-001.png'), fullSheet);

savePng(join(PLAYER_DIR, 'char-player-001-3row.png'), compatSheet);
savePng(join(OUT_BASE, 'char-player-001-3row.png'), compatSheet);

// Contact Sheet with labels and grid (2x scaled for clear review)
const contactSheet = createImage(200, 160, [10, 14, 20, 255]);
// Draw labels / cells
directions.forEach((dir, row) => {
  // 5 frames per row
  const rowFrames = [framesData[dir].idle, ...framesData[dir].walk];
  rowFrames.forEach((frame, col) => {
    const x = 10 + col * 36;
    const y = 10 + row * 36;
    // Cell border
    r(contactSheet, x - 1, y - 1, 34, 34, [28, 38, 54, 255]);
    r(contactSheet, x, y, 32, 32, [18, 24, 34, 255]);
    // Draw 1x inside cell (centered)
    blit(contactSheet, frame, x + 8, y);
  });
});
savePng(join(PREVIEWS_DIR, 'player-contact-sheet.png'), contactSheet);

// Animated Walk GIFs
for (const dir of directions) {
  // Scale 3x for clear animated review
  const gifFrames = framesData[dir].walk.map(f => {
    const scaled = createImage(CELL_W * 3, CELL_H * 3);
    blit(scaled, f, 0, 0, 3);
    return scaled;
  });
  const gifBuf = encodeGif(gifFrames, 12); // ~8.3 FPS
  writeFileSync(join(PREVIEWS_DIR, `player-walk-${dir}.gif`), gifBuf);
}

// Multi-direction walk preview loop (South -> East -> North -> West)
const multiFrames = [];
for (const dir of ['south', 'east', 'north', 'west']) {
  for (const f of framesData[dir].walk) {
    const scaled = createImage(CELL_W * 4, CELL_H * 4);
    blit(scaled, f, 0, 0, 4);
    multiFrames.push(scaled);
  }
}
writeFileSync(join(PREVIEWS_DIR, 'player-walk-preview.gif'), encodeGif(multiFrames, 12));
writeFileSync(join(OUT_BASE, 'player-walk-preview.gif'), encodeGif(multiFrames, 12));

// Native-Resolution In-Game Mockup (320x180)
// Renders the character inside the actual Observation Lab / Cradle Room context at 1:1 scale
const scene = createImage(320, 180, [10, 14, 20, 255]);
// Background station tiles (16x16 grid)
for (let y = 0; y < 180; y += 16) {
  for (let x = 0; x < 320; x += 16) {
    const isFloor = y >= 48 && y < 160 && x >= 32 && x < 288;
    if (isFloor) {
      r(scene, x, y, 16, 16, [20, 28, 42, 255]);
      r(scene, x + 1, y + 1, 14, 14, [24, 34, 50, 255]);
      // Floor seams
      p(scene, x + 15, y + 15, [14, 20, 30, 255]);
    } else {
      // Wall / boundary
      r(scene, x, y, 16, 16, [12, 16, 24, 255]);
      r(scene, x + 1, y + 1, 14, 14, [15, 20, 30, 255]);
    }
  }
}

// Observation window / Core glow
r(scene, 96, 16, 128, 30, [8, 14, 24, 255]);
r(scene, 98, 18, 124, 26, [16, 38, 56, 255]);
// Core glow line
l(scene, 100, 31, 220, 31, [0, 230, 245, 120]);
l(scene, 130, 31, 190, 31, [0, 255, 255, 220]);

// Cradle Bay pod at left
r(scene, 48, 70, 36, 64, [16, 22, 32, 255]);
r(scene, 52, 74, 28, 56, [24, 34, 48, 255]);
r(scene, 56, 80, 20, 44, [0, 180, 200, 140]);
r(scene, 58, 84, 16, 36, [180, 255, 255, 180]);

// Place character standing in center of room (South idle at x=152, y=96)
blit(scene, framesData.south.idle, 152, 96);

// Place walking east character at right (x=210, y=104)
blit(scene, framesData.east.walk[1], 210, 104);

// Place walking north character heading toward observation console (x=120, y=60)
blit(scene, framesData.north.walk[2], 120, 60);

// Ambient floor lighting and vignette
for (let y = 0; y < 180; y++) {
  p(scene, 0, y, [6, 8, 12, 255]);
  p(scene, 319, y, [6, 8, 12, 255]);
}
for (let x = 0; x < 320; x++) {
  p(scene, x, 0, [6, 8, 12, 255]);
  p(scene, x, 179, [6, 8, 12, 255]);
}

savePng(join(PREVIEWS_DIR, 'player-native-preview.png'), scene);
savePng(join(OUT_BASE, 'char-player-001-native-preview-v2.png'), scene);

// JSON Metadata for Phaser 3
const metadata = {
  assetId: 'CHAR-PLAYER-001',
  name: 'Dr. Mira Sen / Iteration 017 (Concept C Production)',
  version: '2.0.0-approved-concept-c',
  status: 'PRODUCTION-READY',
  source: 'Original hand-crafted native pixel-art engine adhering to approved Concept C',
  character: {
    identity: 'Dr. Mira Sen / Iteration 017',
    gender: 'Female adult protagonist',
    apparel: 'Asymmetrical graphite-grey research-station jacket with distinctive slate-grey chest panel, dark graphite trousers, utility belt with pouches & amber fastener, heavy boots',
    distinctive_features: 'Asymmetric slate chest flap, high dark hair bun with loose strands, glowing cyan ECHO wrist device on left wrist'
  },
  engine: {
    target: 'Phaser 3.90.0',
    resolution: '320x180',
    pixelArt: true,
    scaleMode: 'NEAREST'
  },
  cell: {
    width: 16,
    height: 32,
    character_bounds: { width: 12, height: 27 },
    pivot: { x: 8, y: 31, description: 'bottom-centre, feet grounded at y=31' },
    transparent_background: true
  },
  sheets: {
    full_4dir: {
      file: 'public/assets/characters/player/char-player-001.png',
      width: 80,
      height: 128,
      columns: 5,
      rows: 4,
      directions: ['south', 'north', 'east', 'west']
    },
    compat_3dir: {
      file: 'public/assets/characters/player/char-player-001-3row.png',
      width: 80,
      height: 96,
      columns: 5,
      rows: 3,
      directions: ['south', 'north', 'east'],
      west_handling: 'mirror east via setFlipX(true)'
    }
  },
  animations: {
    fps: 8,
    frame_order: ['idle', 'walk_0', 'walk_1', 'walk_2', 'walk_3'],
    south: {
      idle: { row: 0, col: 0, frameIndex: 0 },
      walk: { row: 0, cols: [1, 2, 3, 4], frameIndices: [1, 2, 3, 4], loop: true }
    },
    north: {
      idle: { row: 1, col: 0, frameIndex: 5 },
      walk: { row: 1, cols: [1, 2, 3, 4], frameIndices: [6, 7, 8, 9], loop: true }
    },
    east: {
      idle: { row: 2, col: 0, frameIndex: 10 },
      walk: { row: 2, cols: [1, 2, 3, 4], frameIndices: [11, 12, 13, 14], loop: true }
    },
    west: {
      idle: { row: 3, col: 0, frameIndex: 15 },
      walk: { row: 3, cols: [1, 2, 3, 4], frameIndices: [16, 17, 18, 19], loop: true }
    }
  },
  individual_frames_directory: 'public/assets/characters/player/frames/',
  previews: {
    contact_sheet: 'public/assets/characters/previews/player-contact-sheet.png',
    walk_gif: 'public/assets/characters/previews/player-walk-preview.gif',
    native_preview: 'public/assets/characters/previews/player-native-preview.png'
  }
};

writeFileSync(join(PLAYER_DIR, 'char-player-001.json'), JSON.stringify(metadata, null, 2) + '\n');
writeFileSync(join(OUT_BASE, 'char-player-001.json'), JSON.stringify(metadata, null, 2) + '\n');

console.log('Concept C production spritesheet and previews successfully created!');
