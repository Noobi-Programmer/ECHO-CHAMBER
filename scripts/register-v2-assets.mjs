import fs from 'fs';
import crypto from 'crypto';

const sheets = [
  { id: 'CHAR-PLAYER-001', title: 'Iteration 017 Protagonist Spritesheet', file: 'public/assets/characters/char-player-001.png', dim: '80x128' },
  { id: 'CHAR-PLAYER-ACTIONS-001', title: 'Player ECHO and Actions Spritesheet', file: 'public/assets/characters/char-player-actions-001.png', dim: '96x160' },
  { id: 'CHAR-ITERATION-GHOST-001', title: 'Previous Iteration Ghost Spritesheet', file: 'public/assets/characters/char-iteration-ghost-001.png', dim: '80x128' },
  { id: 'CHAR-ITERATION-KNEEL-001', title: 'Previous Iteration Cinematic Poses', file: 'public/assets/characters/char-iteration-kneel-001.png', dim: '128x32' },
  { id: 'CHAR-MIRA-001', title: 'Dr Mira Sen Spritesheet', file: 'public/assets/characters/char-mira-001.png', dim: '80x64' },
  { id: 'CHAR-MIRA-CANE-001', title: 'Dr Mira Sen with Cane Spritesheet', file: 'public/assets/characters/char-mira-cane-001.png', dim: '80x32' },
  { id: 'CHAR-VOSS-001', title: 'Elias Voss Spritesheet', file: 'public/assets/characters/char-voss-001.png', dim: '80x64' },
  { id: 'CHAR-TENDER-001', title: 'Tender Maintenance Drone Spritesheet', file: 'public/assets/characters/char-tender-001.png', dim: '64x32' },
];

let reg = fs.readFileSync('docs/assets/ASSET_REGISTER.csv', 'utf8');

sheets.forEach(s => {
  if (reg.includes(s.id)) {
    console.log(s.id + ' already in register');
    return;
  }
  const buf = fs.readFileSync(s.file);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const row = `${s.id},SPRITE-PRODUCTION-001,"${s.title}",ECHO//CHAMBER Production Team,Project Internal,public/assets/ECHO_CHAMBER_V2.zip,public/assets/ECHO_CHAMBER_V2.zip,Proprietary / CC0 compatible,N/A,N/A,ECHO//CHAMBER Project,image/png,${s.dim},Concept C production pixel art,Antigravity,Abi approved,APPROVED,docs/assets/SPRITE_PRODUCTION_004_V2_REPORT.md,${hash},${s.file},V2 production character sprite`;
  reg += '\n' + row;
});

fs.writeFileSync('docs/assets/ASSET_REGISTER.csv', reg);
console.log('Updated ASSET_REGISTER.csv');
