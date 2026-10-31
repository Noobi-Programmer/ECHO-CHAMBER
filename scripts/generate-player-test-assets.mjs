import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const W = 16;
const H = 32;
const OUT = 'public/assets/characters';
const FRAME_OUT = join(OUT, 'char-player-001-frames-v2');

const PAL = {
  ink: [6, 8, 14, 255], navy: [13, 20, 36, 255], metal: [74, 90, 115, 255],
  pale: [201, 212, 227, 255], cyan: [98, 214, 216, 255], teal: [42, 127, 134, 255],
  amber: [224, 166, 74, 255], hair: [21, 27, 38, 255], skin: [214, 166, 140, 255],
  shade: [156, 111, 93, 255], transparent: [0, 0, 0, 0],
};

function image(w, h, fill = PAL.transparent) {
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set(fill, i * 4);
  return { w, h, data };
}

function pixel(img, x, y, color) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  img.data.set(color, (y * img.w + x) * 4);
}

function rect(img, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) for (let px = x; px < x + w; px++) pixel(img, px, py, color);
}

function line(img, x0, y0, x1, y1, color) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    pixel(img, x0, y0, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function copy(dst, src, dx, dy, scale = 1) {
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
    const at = (y * src.w + x) * 4;
    if (src.data[at + 3] === 0) continue;
    for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
      pixel(dst, dx + x * scale + sx, dy + y * scale + sy, src.data.slice(at, at + 4));
    }
  }
}

function crc32(data) {
  let c = 0xffffffff;
  for (const byte of data) {
    c ^= byte;
    for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type);
  const size = Buffer.alloc(4); size.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([size, typeBytes, data, crc]);
}

function png(img) {
  const raw = Buffer.alloc((img.w * 4 + 1) * img.h);
  for (let y = 0; y < img.h; y++) {
    raw[y * (img.w * 4 + 1)] = 0;
    Buffer.from(img.data.slice(y * img.w * 4, (y + 1) * img.w * 4)).copy(raw, y * (img.w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

function writePng(path, img) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, png(img)); }

function player(direction, step) {
  const a = image(W, H);
  const leg = [0, 1, 0, -1][step] ?? 0;
  const arm = [0, -1, 0, 1][step] ?? 0;
  if (direction === 'south') {
    // C: female-bodied vessel with a dark bun, asymmetrical research jacket, and compact utility belt.
    rect(a, 8, 0, 3, 3, PAL.hair); rect(a, 5, 1, 6, 2, PAL.hair); rect(a, 4, 3, 8, 4, PAL.hair);
    rect(a, 5, 4, 6, 3, PAL.skin); rect(a, 5, 3, 6, 1, PAL.hair); pixel(a, 6, 5, PAL.ink); pixel(a, 9, 5, PAL.ink); pixel(a, 4, 6, PAL.hair);
    rect(a, 4, 8, 8, 10, PAL.navy); rect(a, 5, 9, 6, 9, PAL.metal); line(a, 5, 9, 10, 15, PAL.pale); line(a, 6, 9, 11, 14, PAL.teal);
    rect(a, 2, 10 + arm, 2, 8, PAL.metal); rect(a, 12, 10 - arm, 2, 8, PAL.metal);
    rect(a, 2, 17 + arm, 2, 3, PAL.hair); rect(a, 12, 17 - arm, 2, 2, PAL.hair); rect(a, 13, 17 - arm, 1, 2, PAL.cyan);
    rect(a, 4, 18, 8, 2, PAL.ink); rect(a, 5, 18, 2, 2, PAL.amber); rect(a, 9, 18, 2, 2, PAL.amber); rect(a, 7, 18, 2, 2, PAL.pale);
    rect(a, 5, 20, 3, 8 + leg, PAL.metal); rect(a, 9, 20, 3, 8 - leg, PAL.metal);
    rect(a, 4, 28 + leg, 4, 3 - leg, PAL.hair); rect(a, 8, 28 - leg, 4, 3 + leg, PAL.hair); rect(a, 4, 31, 5, 1, PAL.ink); rect(a, 8, 31, 5, 1, PAL.ink);
  } else if (direction === 'north') {
    rect(a, 8, 0, 3, 3, PAL.hair); rect(a, 5, 1, 6, 2, PAL.hair); rect(a, 4, 3, 8, 5, PAL.hair); rect(a, 5, 7, 6, 1, PAL.navy);
    rect(a, 4, 8, 8, 10, PAL.navy); rect(a, 5, 9, 6, 8, PAL.metal); line(a, 4, 9, 4, 17, PAL.teal); line(a, 11, 9, 11, 17, PAL.teal); line(a, 5, 9, 10, 15, PAL.pale);
    rect(a, 2, 10 - arm, 2, 8, PAL.metal); rect(a, 12, 10 + arm, 2, 8, PAL.metal);
    rect(a, 2, 17 - arm, 2, 3, PAL.hair); rect(a, 12, 17 + arm, 2, 2, PAL.hair); rect(a, 12, 17 + arm, 1, 2, PAL.cyan);
    rect(a, 4, 18, 8, 2, PAL.ink); rect(a, 5, 18, 2, 2, PAL.amber); rect(a, 9, 18, 2, 2, PAL.amber); rect(a, 5, 20, 3, 8 + leg, PAL.metal); rect(a, 9, 20, 3, 8 - leg, PAL.metal);
    rect(a, 4, 27 + leg, 4, 4 - leg, PAL.hair); rect(a, 8, 27 - leg, 4, 4 + leg, PAL.hair);
    rect(a, 3, 31, 5, 1, PAL.ink); rect(a, 8, 31, 5, 1, PAL.ink);
  } else {
    rect(a, 8, 0, 3, 3, PAL.hair); rect(a, 6, 1, 4, 2, PAL.hair); rect(a, 5, 3, 6, 4, PAL.hair); rect(a, 7, 4, 4, 3, PAL.skin); pixel(a, 10, 5, PAL.ink);
    rect(a, 5, 8, 6, 10, PAL.navy); rect(a, 6, 9, 5, 8, PAL.metal); line(a, 6, 9, 10, 14, PAL.pale); rect(a, 5, 8, 1, 10, PAL.teal);
    rect(a, 10, 10 + arm, 2, 9, PAL.metal); rect(a, 11, 17 + arm, 2, 2, PAL.cyan); rect(a, 11, 19 + arm, 2, 2, PAL.hair);
    rect(a, 5, 18, 6, 2, PAL.ink); rect(a, 7, 18, 2, 2, PAL.amber); rect(a, 6, 20, 2, 9 + leg, PAL.metal); rect(a, 9, 20, 2, 9 - leg, PAL.metal);
    rect(a, 5, 28 + leg, 4, 3 - leg, PAL.hair); rect(a, 8, 28 - leg, 4, 3 + leg, PAL.hair); rect(a, 6, 31, 6, 1, PAL.ink);
  }
  return a;
}

function gifLzw(indices, minCodeSize) {
  const clear = 1 << minCodeSize, end = clear + 1;
  let next = end + 1, codeSize = minCodeSize + 1, dict = new Map();
  const output = []; let bits = 0, count = 0;
  const push = (code) => { bits |= code << count; count += codeSize; while (count >= 8) { output.push(bits & 255); bits >>>= 8; count -= 8; } };
  const reset = () => { dict = new Map(); next = end + 1; codeSize = minCodeSize + 1; };
  reset(); push(clear); let phrase = String(indices[0]);
  for (let i = 1; i < indices.length; i++) {
    const k = String(indices[i]), candidate = `${phrase},${k}`;
    if (dict.has(candidate)) phrase = candidate;
    else {
      push(phrase.includes(',') ? dict.get(phrase) : Number(phrase));
      if (next < 4096) { dict.set(candidate, next++); if (next === (1 << codeSize) && codeSize < 12) codeSize++; }
      else { push(clear); reset(); }
      phrase = k;
    }
  }
  push(phrase.includes(',') ? dict.get(phrase) : Number(phrase)); push(end);
  if (count) output.push(bits & 255);
  return Buffer.from(output);
}

function gif(frames) {
  const palette = [PAL.transparent, PAL.ink, PAL.navy, PAL.metal, PAL.pale, PAL.cyan, PAL.teal, PAL.amber, PAL.hair, PAL.skin, PAL.shade];
  const data = [Buffer.from('GIF89a', 'ascii')]; const lsd = Buffer.alloc(7);
  lsd.writeUInt16LE(frames[0].w, 0); lsd.writeUInt16LE(frames[0].h, 2); lsd[4] = 0x83; lsd[5] = 0; lsd[6] = 0; data.push(lsd);
  for (let i = 0; i < 16; i++) data.push(Buffer.from(palette[i] ?? [0, 0, 0]).subarray(0, 3));
  data.push(Buffer.from([0x21, 0xff, 0x0b]), Buffer.from('NETSCAPE2.0', 'ascii'), Buffer.from([3, 1, 0, 0, 0]));
  for (const frame of frames) {
    const gce = Buffer.from([0x21, 0xf9, 4, 0x09, 8, 0, 0, 0]); data.push(gce);
    const desc = Buffer.alloc(10); desc[0] = 0x2c; desc.writeUInt16LE(frame.w, 5); desc.writeUInt16LE(frame.h, 7); data.push(desc);
    const indexed = []; for (let p = 0; p < frame.w * frame.h; p++) {
      const at = p * 4; let found = 0;
      for (let i = 1; i < palette.length; i++) if (palette[i].every((v, c) => v === frame.data[at + c])) { found = i; break; }
      indexed.push(frame.data[at + 3] === 0 ? 0 : found);
    }
    const compressed = gifLzw(indexed, 4); data.push(Buffer.from([4]));
    for (let i = 0; i < compressed.length; i += 255) data.push(Buffer.from([Math.min(255, compressed.length - i)]), compressed.subarray(i, i + 255));
    data.push(Buffer.from([0]));
  }
  data.push(Buffer.from([0x3b])); return Buffer.concat(data);
}

mkdirSync(FRAME_OUT, { recursive: true });
const directions = ['south', 'north', 'east'];
const frames = {};
for (const direction of directions) {
  frames[direction] = [player(direction, 0), player(direction, 0), player(direction, 1), player(direction, 2), player(direction, 3)];
  for (let i = 0; i < frames[direction].length; i++) writePng(join(FRAME_OUT, `${direction}-${i === 0 ? 'idle' : `walk-${i - 1}`}.png`), frames[direction][i]);
}

const sheet = image(80, 96);
directions.forEach((direction, row) => frames[direction].forEach((frame, column) => copy(sheet, frame, column * W, row * H)));
writePng(join(OUT, 'char-player-001-test-spritesheet-v1.png'), sheet);

const previewFrames = frames.east.slice(1).map((frame) => { const p = image(64, 128); copy(p, frame, 0, 0, 4); return p; });
writeFileSync(join(OUT, 'char-player-001-test-preview-v1.gif'), gif(previewFrames));

const game = image(320, 180, PAL.ink);
rect(game, 14, 18, 292, 144, PAL.navy); rect(game, 20, 24, 280, 132, [22, 33, 58, 255]);
for (let x = 24; x < 296; x += 16) line(game, x, 132, x + 8, 156, [35, 50, 77, 255]);
rect(game, 28, 30, 86, 66, [9, 16, 31, 255]); rect(game, 34, 36, 74, 54, [10, 33, 47, 255]);
rect(game, 225, 34, 42, 92, [9, 16, 31, 255]); rect(game, 230, 39, 32, 82, [42, 127, 134, 255]);
rect(game, 232, 41, 28, 78, [13, 20, 36, 255]); rect(game, 22, 156, 276, 4, PAL.metal);
rect(game, 64, 116, 42, 6, PAL.metal); rect(game, 72, 108, 26, 8, PAL.metal); rect(game, 76, 105, 14, 3, PAL.cyan);
copy(game, frames.south[1], 136, 64, 3); rect(game, 130, 159, 60, 2, [42, 127, 134, 255]);
for (let x = 28; x < 114; x += 12) pixel(game, x, 102, PAL.cyan);
writePng(join(OUT, 'char-player-001-native-preview-v1.png'), game);

const metadata = {
  assetId: 'CHAR-PLAYER-001', version: 'test-v1', status: 'CONCEPT-REVIEW', source: 'Hand-authored native-pixel script (original work)',
  transparency: true, sheet: { file: 'char-player-001-test-spritesheet-v1.png', width: 80, height: 96, frameWidth: 16, frameHeight: 32, columns: 5, rows: 3 },
  pivot: { x: 8, y: 31, description: 'bottom centre; feet occupy row 31' },
  fps: 8, loop: true,
  frameOrder: directions.map((direction, row) => ({ direction, row, frames: ['idle', 'walk-0', 'walk-1', 'walk-2', 'walk-3'], west: direction === 'east' ? 'mirror east' : undefined })),
  integration: { south: ['p_down_0', 'p_down_1'], north: ['p_up_0', 'p_up_1'], east: ['p_side_0', 'p_side_1'], west: 'setFlipX(true) on east' },
};
writeFileSync(join(OUT, 'char-player-001-test-metadata-v1.json'), `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Generated ${join(OUT, 'char-player-001-test-spritesheet-v1.png')}`);
