import fs from 'fs';

let lines = fs.readFileSync('src/scenes/StationScene.ts', 'utf8').split(/\r?\n/);

const idx = lines.findIndex(l => l.includes('const moving = vx !== 0 || vy !== 0;'));
console.log('Found moving at line:', idx + 1);

const endIdx = lines.findIndex((l, i) => i > idx && l.includes('this.player.setDepth(this.player.y);'));
console.log('Found setDepth at line:', endIdx + 1);

const replacement = [
  '    const moving = vx !== 0 || vy !== 0;',
  '    const isRunning = Boolean(k.SHIFT && k.SHIFT.isDown);',
  '    const stepRate = isRunning ? 100 : 135;',
  '    if (moving) {',
  '      const len = Math.hypot(vx, vy);',
  '      const runMult = isRunning ? 1.45 : 1;',
  '      const sp = SPEED * (this.echoT > 0.5 ? 0.75 : runMult) * (dt / 1000);',
  '      const nx = this.player.x + (vx / len) * sp;',
  '      const ny = this.player.y + (vy / len) * sp;',
  '      if (!this.blocked(nx, this.player.y)) this.player.x = nx;',
  '      if (!this.blocked(this.player.x, ny)) this.player.y = ny;',
  '      if (Math.abs(vx) > 0) { this.dir = "side"; this.flip = vx < 0; }',
  '      if (vy !== 0 && vx === 0) this.dir = vy < 0 ? "up" : "down";',
  '      const oldFrame = Math.floor(this.walkClock / stepRate) % 4;',
  '      this.walkClock += dt;',
  '      const newFrame = Math.floor(this.walkClock / stepRate) % 4;',
  '      if (newFrame !== oldFrame && (newFrame === 1 || newFrame === 3)) audio.footstep();',
  '      this.idleClock = 0;',
  '    } else {',
  '      this.walkClock = 0;',
  '      this.idleClock += dt;',
  '    }',
  '    if (this.echoActive && !moving) {',
  '      const echoFr = Math.floor(this.time.now / 240) % 2;',
  '      this.player.setTexture(`p_echo_idle_${echoFr}`).setFlipX(false);',
  '    } else if (moving) {',
  '      const frame = (Math.floor(this.walkClock / stepRate) % 4) + 1;',
  '      if (this.dir === "side") {',
  '        const sideDir = this.flip ? "west" : "east";',
  '        this.player.setTexture(`p_${sideDir}_${frame}`).setFlipX(false);',
  '      } else {',
  '        this.player.setTexture(`p_${this.dir}_${frame}`).setFlipX(false);',
  '      }',
  '    } else {',
  '      if (this.dir === "side") {',
  '        const sideDir = this.flip ? "west" : "east";',
  '        this.player.setTexture(`p_${sideDir}_0`).setFlipX(false);',
  '      } else {',
  '        this.player.setTexture(`p_${this.dir}_0`).setFlipX(false);',
  '      }',
  '    }'
];

lines.splice(idx, endIdx - idx, ...replacement);
fs.writeFileSync('src/scenes/StationScene.ts', lines.join('\n'));
console.log('Replaced movement lines cleanly!');
