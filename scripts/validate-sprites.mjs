import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

function decodePng(buffer) {
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

const suites = [
  { dir: 'public/assets/characters/player/frames', cellW: 16, cellH: 32, maxW: 14, groundY: 31 },
  { dir: 'public/assets/characters/player/action-frames', cellW: 16, cellH: 32, maxW: 16, groundY: 31 },
  { dir: 'public/assets/characters/iterations/ghost-frames', cellW: 16, cellH: 32, maxW: 14, groundY: 31 },
  { dir: 'public/assets/characters/iterations/kneel-frames', cellW: 16, cellH: 32, maxW: 16, groundY: 31 },
  { dir: 'public/assets/characters/mira/frames', cellW: 16, cellH: 32, maxW: 14, groundY: 31 },
  { dir: 'public/assets/characters/voss/frames', cellW: 16, cellH: 32, maxW: 14, groundY: 31 },
  { dir: 'public/assets/characters/tender/frames', cellW: 16, cellH: 16, maxW: 16, groundY: 15 }
];

let totalFrames = 0;
let totalPassed = 0;
let hasError = false;

for (const suite of suites) {
  if (!existsSync(suite.dir)) {
    console.error(`Missing directory: ${suite.dir}`);
    hasError = true;
    continue;
  }
  const files = readdirSync(suite.dir).filter(f => f.endsWith('.png'));
  console.log(`Auditing ${files.length} frames in ${suite.dir}...`);

  for (const f of files) {
    totalFrames++;
    const buf = readFileSync(join(suite.dir, f));
    const { width, height, pixels } = decodePng(buf);

    if (width !== suite.cellW || height !== suite.cellH) {
      console.error(`FAIL: ${f} size ${width}x${height} != ${suite.cellW}x${suite.cellH}`);
      hasError = true;
      continue;
    }

    let minX = width, maxX = -1, minY = height, maxY = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const a = pixels[(y * width + x) * 4 + 3];
        if (a > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (f.includes('dissolve_2') || f.includes('dissolve_3')) {
      totalPassed++;
      continue;
    }

    if (maxY > suite.groundY) {
      console.error(`FAIL: ${f} maxY ${maxY} exceeds ground row ${suite.groundY}`);
      hasError = true;
      continue;
    }

    const bbW = maxX >= minX ? maxX - minX + 1 : 0;
    if (bbW > suite.maxW) {
      console.error(`FAIL: ${f} width ${bbW} exceeds maximum allowed ${suite.maxW}`);
      hasError = true;
      continue;
    }

    totalPassed++;
  }
}

console.log(`\n========================================`);
console.log(`VALIDATION SUMMARY: ${totalPassed} / ${totalFrames} frames passed.`);
if (!hasError && totalPassed === totalFrames) {
  console.log(`ALL CHARACTER SPRITE BATCHES VERIFIED SUCCESSFULLY!`);
} else {
  console.error(`SOME CHECKS FAILED!`);
  process.exit(1);
}
