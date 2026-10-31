import Phaser from 'phaser';
import '@fontsource/vt323/400.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/400-italic.css';
import './style.css';
import { StationScene } from './scenes/StationScene';
import { ui } from './systems/ui';
import { audio } from './systems/audio';

ui.init(document.getElementById('ui')!);

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 320,
  height: 180,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [StationScene],
  fps: { target: 60 },
  banner: false,
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    audio.setMuted(!audio.muted);
    ui.toast(audio.muted ? 'SOUND OFF  [M]' : 'SOUND ON  [M]', 1400);
  }
  // keep arrow/space from scrolling an embedding page
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
});

ui.title((mode) => {
  audio.start();
  const scene = game.scene.getScene("Station") as unknown as StationScene;
  scene.begin(mode);
});

// test/debug hook (read-only state + helpers used by tests/playthrough.mjs)
(window as unknown as { __ECHO: unknown }).__ECHO = {
  get scene() { return game.scene.getScene('Station'); },
};
