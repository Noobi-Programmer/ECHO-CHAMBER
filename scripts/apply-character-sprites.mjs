import fs from 'fs';

// 1. Update src/art/textures.ts
let textures = fs.readFileSync('src/art/textures.ts', 'utf8');

// Ensure import
if (!textures.includes('sliceCharacterTextures')) {
  textures = textures.replace(
    /import { buildGrid, MAP_H, MAP_W, TILE } from '\.\.\/world\/map';/,
    `import { buildGrid, MAP_H, MAP_W, TILE } from '../world/map';\nimport { sliceCharacterTextures } from './characterSprites';`
  );
}

// Ensure sliceCharacterTextures in generateTextures
if (!textures.includes('sliceCharacterTextures(scene);')) {
  textures = textures.replace(
    /export function generateTextures\(scene: Phaser\.Scene\) \{[\s\S]*?\}/,
    `export function generateTextures(scene: Phaser.Scene) {\n  makeCharacters(scene);\n  makeMap(scene);\n  makeProps(scene);\n  sliceCharacterTextures(scene);\n}`
  );
}

fs.writeFileSync('src/art/textures.ts', textures);
console.log('Updated src/art/textures.ts');
