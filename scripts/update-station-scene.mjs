import fs from 'fs';

let scene = fs.readFileSync('src/scenes/StationScene.ts', 'utf8');

// 1. Add preloadCharacterSprites import if missing
if (!scene.includes('preloadCharacterSprites')) {
  scene = scene.replace(
    /import { generateTextures } from '\.\.\/art\/textures';/,
    `import { generateTextures } from '../art/textures';\nimport { preloadCharacterSprites } from '../art/characterSprites';`
  );
}

// 2. Add preload() before create() if missing
if (!scene.includes('preload()')) {
  scene = scene.replace(
    /create\(\) \{/,
    `preload() {\n    preloadCharacterSprites(this);\n  }\n\n  create() {`
  );
}

// 3. Update player walk & idle texture handling in update()
const oldMovement = `    const frame = moving ? Math.floor(this.walkClock / 170) % 2 : 0;
    this.player.setTexture(\`p_\${this.dir}_\${frame}\`).setFlipX(this.dir === 'side' && this.flip);
    this.player.setDepth(this.player.y);`;

const newMovement = `    if (this.echoActive && !moving) {
      const echoFr = Math.floor(this.time.now / 240) % 2;
      this.player.setTexture(\`p_echo_idle_\${echoFr}\`).setFlipX(false);
    } else if (moving) {
      const stepRate = isRunning ? 100 : 130;
      const frame = (Math.floor(this.walkClock / stepRate) % 4) + 1;
      if (this.dir === 'side') {
        const sideDir = this.flip ? 'west' : 'east';
        this.player.setTexture(\`p_\${sideDir}_\${frame}\`).setFlipX(false);
      } else {
        this.player.setTexture(\`p_\${this.dir}_\${frame}\`).setFlipX(false);
      }
    } else {
      if (this.dir === 'side') {
        const sideDir = this.flip ? 'west' : 'east';
        this.player.setTexture(\`p_\${sideDir}_0\`).setFlipX(false);
      } else {
        this.player.setTexture(\`p_\${this.dir}_0\`).setFlipX(false);
      }
    }
    this.player.setDepth(this.player.y);`;

if (scene.includes(oldMovement)) {
  scene = scene.replace(oldMovement, newMovement);
} else {
  // Try with flexible regex
  scene = scene.replace(
    /const frame = moving \? Math\.floor\(this\.walkClock \/ 170\) % 2 : 0;[\r\n\s]+this\.player\.setTexture\(`p_\$\{this\.dir\}_\$\{frame\}`\)\.setFlipX\(this\.dir === 'side' && this\.flip\);[\r\n\s]+this\.player\.setDepth\(this\.player\.y\);/,
    newMovement
  );
}

// 4. Update footstep timing for 4-frame walk cycle
scene = scene.replace(
  /const oldFrame = Math\.floor\(this\.walkClock \/ stepRate\) % 2;[\r\n\s]+this\.walkClock \+= dt;[\r\n\s]+const newFrame = Math\.floor\(this\.walkClock \/ stepRate\) % 2;[\r\n\s]+if \(newFrame !== oldFrame && newFrame === 1\) audio\.footstep\(\);/,
  `const stepRate = isRunning ? 100 : 130;
      const oldFrame = Math.floor(this.walkClock / stepRate) % 4;
      this.walkClock += dt;
      const newFrame = Math.floor(this.walkClock / stepRate) % 4;
      if (newFrame !== oldFrame && (newFrame === 1 || newFrame === 3)) audio.footstep();`
);

// 5. Update locker ghost waypoints to include card slide & lookup poses
scene = scene.replace(
  /\[2400, 184, 480, 'ghost_kneel'\],[\r\n\s]+\[3500, 184, 480, 'ghost_kneel'\],/,
  `[2400, 184, 480, 'ghost_kneel'],\n      [2800, 184, 480, 'ghost_card'],\n      [3200, 184, 480, 'ghost_lookup'],`
);

// 6. Update Tender 4-frame walk
scene = scene.replace(
  /const ev = this\.time\.addEvent\(\{ delay: 140, loop: true, callback: \(\) => \{ fr \^= 1; t\.setTexture\(`tender_\$\{fr\}`\); \} \}\);/,
  `const ev = this.time.addEvent({ delay: 130, loop: true, callback: () => { fr = (fr + 1) % 4; t.setTexture(\`tender_\${fr}\`); } });`
);

// 7. Update Core door ghost writing & dissolve
scene = scene.replace(
  /ui\.subtitle\(T\.ghostNo, SRC\.UNREG, 1800\);[\r\n\s]+await wait\(1600\);[\r\n\s]+const writing = ui\.frost\("DON'T ANSWER", 10\);/,
  `ui.subtitle(T.ghostNo, SRC.UNREG, 1800);
    await wait(1600);
    g.setTexture('ghost_write');
    const writing = ui.frost("DON'T ANSWER", 10);`
);

scene = scene.replace(
  /audio\.ghostDisappear\(\);[\r\n\s]+this\.glitch = 1;[\r\n\s]+this\.tweens\.add\(\{ targets: g, alpha: 0, scaleX: 1\.6, scaleY: 0\.4, duration: 700 \}\);/,
  `audio.ghostDisappear();
    this.glitch = 1;
    for (let f = 0; f < 4; f++) {
      g.setTexture(\`ghost_dissolve_\${f}\`);
      await wait(140);
    }
    this.tweens.add({ targets: g, alpha: 0, scaleX: 1.6, scaleY: 0.4, duration: 350 });`
);

// 8. Update cradle wake up in begin()
scene = scene.replace(
  /this\.player\.setVisible\(true\);[\r\n\s]+this\.player\.setPosition\(122, 452\);[\r\n\s]+this\.cameras\.main\.startFollow/,
  `this.player.setVisible(true);
    this.player.setPosition(122, 452);
    this.player.setTexture('p_cradle_wake_0');
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    for (let i = 1; i <= 4; i++) {
      await wait(160);
      this.player.setTexture(\`p_cradle_wake_\${i}\`);
    }
    await wait(200);
    this.player.setTexture('p_down_0');
    this.cameras.main.startFollow`
);

fs.writeFileSync('src/scenes/StationScene.ts', scene);
console.log('Successfully updated StationScene.ts');
