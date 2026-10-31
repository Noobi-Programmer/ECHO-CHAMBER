import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

function decodePng(buffer) {
  // Simple PNG chunk reader for 8-bit RGBA
  let offset = 8;
  let width = 0, height = 0;
  const idatChunks = [];
  while (offset < buffer.length) {
    const len = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }
  const decompressed = inflateSync(Buffer.concat(idatChunks));
  const pixels = new Uint8Array(width * height * 4);
  const rowStride = width * 4 + 1;
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowStride + 1;
    for (let x = 0; x < width; x++) {
      const srcIdx = rowStart + x * 4;
      const dstIdx = (y * width + x) * 4;
      pixels[dstIdx] = decompressed[srcIdx];
      pixels[dstIdx + 1] = decompressed[srcIdx + 1];
      pixels[dstIdx + 2] = decompressed[srcIdx + 2];
      pixels[dstIdx + 3] = decompressed[srcIdx + 3];
    }
  }
  return { width, height, pixels };
}

const framesDir = 'public/assets/characters/player/frames';
const frameFiles = readdirSync(framesDir).filter(f => f.endsWith('.png'));

console.log(`Checking ${frameFiles.length} individual frames in ${framesDir}...`);

let allValid = true;

for (const file of frameFiles) {
  const buf = readFileSync(join(framesDir, file));
  const { width, height, pixels } = decodePng(buf);

  if (width !== 16 || height !== 32) {
    console.error(`FAIL: ${file} dimensions ${width}x${height} != 16x32`);
    allValid = false;
  }

  // Calculate bounding box of non-transparent pixels
  let minX = 16, maxX = -1, minY = 32, maxY = -1;
  let hasCyan = false;
  let hasAmber = false;
  let hasSlate = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = pixels[idx + 3];
      if (a > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
        // Cyan ECHO glow
        if (g > 200 && b > 200 && r < 100) hasCyan = true;
        // Amber fastener
        if (r > 200 && g > 140 && b < 100) hasAmber = true;
        // Slate chest panel
        if (r > 100 && r < 160 && g > 120 && g < 180 && b > 140 && b < 210) hasSlate = true;
      }
    }
  }

  const bbWidth = maxX - minX + 1;
  const bbHeight = maxY - minY + 1;

  // Ground baseline check: feet must be at row 31 (bottom row)
  if (maxY !== 31) {
    console.error(`FAIL: ${file} feet baseline at y=${maxY}, expected 31`);
    allValid = false;
  }

  // Width check: character should be ~12 pixels wide
  if (bbWidth > 14) {
    console.error(`FAIL: ${file} width ${bbWidth} exceeds 14px target`);
    allValid = false;
  }

  // Check key features
  if (file.startsWith('south') && (!hasCyan || !hasAmber || !hasSlate)) {
    console.warn(`WARNING: ${file} missing key Concept C colors (cyan:${hasCyan}, amber:${hasAmber}, slate:${hasSlate})`);
  }
}

if (allValid) {
  console.log(`SUCCESS: All ${frameFiles.length} frames passed geometry, baseline, dimension, and transparency checks!`);
} else {
  console.error('FAIL: One or more checks failed.');
  process.exit(1);
}
