import Phaser from 'phaser';
import { generateTextures } from '../art/textures';
import { preloadCharacterSprites } from '../art/characterSprites';
import { buildGrid, DOORS, MAP_H, MAP_W, roomAt, RoomId, TILE } from '../world/map';
import { audio } from '../systems/audio';
import { ui, wait } from '../systems/ui';
import { saveSystem, EchoSaveV1 } from '../systems/save';
import { ENDINGS, FRAGMENTS, FRAG_ERRORS, LOG, REC, SRC, T } from '../data/story';

// ----------------------------------------------------------------- types
interface Solid { x: number; y: number; w: number; h: number; id?: string }
interface Interactable { id: string; x: number; y: number; r: number; label: () => string | null }
interface Light { x: number; y: number; r: number; i: number; color?: number; flicker?: boolean; on: () => boolean; glow?: Phaser.GameObjects.Image }
interface EchoSpot { x: number; y: number; label: () => string | null }
interface Vignette { room: RoomId; active: () => boolean; dur: number; update: (et: number, loop: number) => void; hide: () => void }
interface Sample { x: number; y: number; tex: string; flip: boolean }

type Step = 'title' | 'intro' | 'wake' | 'card' | 'lab' | 'core' | 'final' | 'ending';

const ECHO_MAX_MS = 5200;
const ECHO_COOL_MS = 900;
const SPEED = 64;

export class StationScene extends Phaser.Scene {
  // world
  grid!: number[][];
  closedDoors = new Set<string>();
  solids: Solid[] = [];
  props: Record<string, Phaser.GameObjects.Image> = {};
  echoOnly: Phaser.GameObjects.GameObject[] = [];
  presentOnly: Phaser.GameObjects.GameObject[] = [];
  interactables: Interactable[] = [];
  echoSpots: EchoSpot[] = [];
  vignettes: Vignette[] = [];
  lamps: Light[] = [];

  // player
  player!: Phaser.GameObjects.Sprite;
  dir: 'down' | 'up' | 'side' = 'down';
  flip = false;
  walkClock = 0;
  keys!: Record<string, Phaser.Input.Keyboard.Key>;

  // fx
  dark!: Phaser.GameObjects.RenderTexture;
  stamp!: Phaser.GameObjects.Image;
  scan!: Phaser.GameObjects.TileSprite;
  noise!: Phaser.GameObjects.TileSprite;
  tint!: Phaser.GameObjects.Rectangle;
  colorFx: Phaser.FX.ColorMatrix | null = null;
  dim = 0; // extra darkness 0..1
  amber = 0; // emergency lighting 0..1
  glitch = 0;

  // echo
  echoT = 0;
  echoActive = false;
  echoStart = 0;
  echoHeld = 0;
  echoCool = 0;
  echoForced: boolean | null = null;
  echoUses = 0;
  limitWarned = false;

  // story state
  step: Step = 'title';
  busy = true;
  room: RoomId | null = null;
  f = new Set<string>(); // flags
  recallN = 3;
  samples: Sample[] = [];
  sampleClock = 0;
  idleClock = 0;
  nudges = new Set<string>();
  qaAsked = new Set<string>();
  lastSaveClock = 0;

  constructor() { super('Station'); }

  // ================================================================= build
  preload() {
    preloadCharacterSprites(this);
  }

  create() {
    generateTextures(this);
    this.grid = buildGrid();
    for (const d of DOORS) for (let y = d.y; y < d.y + d.h; y++) for (let x = d.x; x < d.x + d.w; x++) this.closedDoors.add(`${d.id}:${x},${y}`);

    this.add.image(0, 0, 'map').setOrigin(0).setDepth(-100);
    this.buildCradle();
    this.buildLab();
    this.buildCore();

    this.player = this.add.sprite(138, 452, 'p_down_0').setOrigin(0.5, 1);
    this.player.setVisible(false);

    // effects
    const cam = this.cameras.main;
    cam.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    cam.setRoundPixels(true);
    cam.centerOn(13 * TILE, 29 * TILE);
    if (this.renderer.type === Phaser.WEBGL && cam.postFX) this.colorFx = cam.postFX.addColorMatrix();

    this.tint = this.add.rectangle(0, 0, 320, 180, 0x0f6f7a, 1).setOrigin(0).setScrollFactor(0).setDepth(1001).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);
    this.dark = this.add.renderTexture(0, 0, 320, 180).setOrigin(0).setScrollFactor(0).setDepth(1000);
    this.stamp = this.make.image({ key: 'light', add: false }).setOrigin(0.5);
    this.scan = this.add.tileSprite(0, 0, 320, 180, 'scanlines').setOrigin(0).setScrollFactor(0).setDepth(1002).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
    this.noise = this.add.tileSprite(0, 0, 320, 180, 'noise').setOrigin(0).setScrollFactor(0).setDepth(1003).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
    this.add.image(0, 0, 'vignette').setOrigin(0).setScrollFactor(0).setDepth(1004).setAlpha(0.7);

    // player light
    this.lamps.push({ x: 0, y: 0, r: 52, i: 0.8, on: () => this.player.visible, flicker: false });

    const kb = this.input.keyboard!;
    this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,Q,SPACE,ENTER,SHIFT') as Record<string, Phaser.Input.Keyboard.Key>;
    ui.setEvidenceProvider(() => this.getEvidence());
    kb.addCapture('UP,DOWN,LEFT,RIGHT,SPACE');
  }

  // helpers -------------------------------------------------------
  private img(key: string, x: number, y: number, depthY?: number, originY = 1) {
    const i = this.add.image(x, y, key).setOrigin(0.5, originY);
    i.setDepth(depthY ?? y);
    return i;
  }
  private echoImg(key: string, x: number, y: number, depthY?: number, originY = 1) {
    const i = this.img(key, x, y, depthY, originY).setAlpha(0);
    this.echoOnly.push(i);
    return i;
  }
  private ghost(tex: string, depth = 600) {
    const s = this.add.sprite(-100, -100, tex).setOrigin(0.5, 1).setAlpha(0).setDepth(depth);
    s.setTint(0xd8ffff).setBlendMode(Phaser.BlendModes.ADD);
    return s;
  }
  private light(x: number, y: number, r: number, i: number, color?: number, on: () => boolean = () => true, flicker = false) {
    const L: Light = { x, y, r, i, color, on, flicker };
    if (color !== undefined) {
      L.glow = this.add.image(x, y, 'light').setScale((r * 1.2) / 64).setTint(color).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.18).setDepth(5);
    }
    this.lamps.push(L);
    return L;
  }
  private solid(x: number, y: number, w: number, h: number, id?: string) { this.solids.push({ x, y, w, h, id }); }
  private interact(id: string, x: number, y: number, label: () => string | null, r = 20) { this.interactables.push({ id, x, y, r, label }); }
  private has(flag: string) { return this.f.has(flag); }
  private set(flag: string) { this.f.add(flag); }

  // ----------------------------------------------------------- Cradle Bay
  private buildCradle() {
    // Cradle (where you wake)
    this.props.cradle = this.img('cradle', 99, 454);
    this.solid(82, 436, 34, 16);
    this.echoImg('tally', 99, 437, 455);
    this.interact('cradle', 99, 462, () => 'Inspect the Cradle', 22);
    this.echoSpots.push({ x: 99, y: 445, label: () => SRC.MULTI + ' · tally marks' });
    this.light(99, 446, 52, 0.9, 0x3fd0d6, () => true, true);

    [[180, 440], [250, 480], [330, 470], [60, 480]].forEach(([x, y], i) => this.light(x, y, 64, 0.5, 0x2a5f7a, () => true, i === 2));
    // Voss's stasis pod
    this.props.vossPod = this.img('voss_pod', 99, 504);
    this.solid(82, 486, 34, 16);
    this.interact('vossPod', 99, 512, () => 'Inspect the stasis pod', 22);
    this.light(99, 494, 34, 0.55, 0x9fd8ea);

    // floor plates (plate 3 sits high)
    for (let i = 1; i <= 5; i++) {
      const x = 136 + i * 16;
      const key = i === 3 ? 'plate_raised' : 'plate';
      this.props[`plate${i}`] = this.add.image(x, 472, key).setOrigin(0.5).setDepth(-50);
      this.interact(`plate${i}`, x, 474, () => (this.has('cardTaken') && i === 3 ? null : 'Inspect floor plate'), 10);
    }

    // terminal + desk + mug
    this.img('terminal', 264, 434);
    this.solid(257, 420, 14, 12);
    this.interact('terminal', 264, 444, () => 'Use terminal', 16);
    this.light(264, 418, 30, 0.6, 0x3fd0d6);
    this.img('desk', 296, 434);
    this.solid(280, 422, 32, 12);
    this.props.mug = this.img('mug', 292, 424, 435);
    this.presentOnly.push(this.props.mug);
    this.echoImg('mug_echo', 292, 424, 436);
    this.interact('mug', 293, 444, () => 'Inspect mug', 14);
    this.echoSpots.push({ x: 292, y: 430, label: () => SRC.MIRA + ' · the mug' });
    this.light(296, 424, 26, 0.45, 0xe0a64a);

    // subtle rising steam in ECHO mode
    const steamGfx = this.add.graphics().setDepth(437);
    this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        steamGfx.clear();
        if (this.echoT > 0.05) {
          const t = this.time.now / 350;
          steamGfx.fillStyle(0xdffaff, 0.25 * this.echoT);
          steamGfx.fillCircle(291 + Math.sin(t) * 1.5, 417 - (t % 8), 1.2);
          steamGfx.fillCircle(293 - Math.sin(t * 1.2) * 1.5, 413 - ((t + 4) % 8), 1.6);
        }
      },
    });

    // Mira's locker
    this.props.locker = this.img('locker', 334, 436);
    this.solid(327, 424, 14, 12);
    this.interact('locker', 334, 446, () => (this.has('lockerOpen') ? 'Look in the locker' : 'Inspect locker'), 16);
    this.light(338, 422, 18, 0.5, 0x62d6d8);
    this.echoSpots.push({ x: 334, y: 440, label: () => (this.has('lockerOpen') ? SRC.UNREG + ' · locker' : null) });

    // lab door
    this.props.doorLab = this.img('door_lab', 224, 416);
    this.props.readerLab = this.img('reader_red', 246, 410, 417);
    this.interact('doorLab', 224, 428, () => (this.has('labOpen') ? null : 'Use door'), 18);
    this.light(246, 408, 16, 0.5, 0xd0453b, () => !this.has('labOpen'));

    // card (hidden under plate 3 — becomes visible when lifted)
    this.props.card = this.img('card', 184, 474, -40).setVisible(false);

    // vignette: the locker memory (R-016 hides the card)
    const g = this.ghost('ghost_up_0');
    const echoCard = this.add.image(0, 0, 'card').setDepth(601).setAlpha(0).setTint(0xffffff);
    const lockerEcho = this.echoImg('locker_open', 334, 436, 437);
    const path: [number, number, number, string][] = [
      // t(ms), x, y, tex
      [0, 334, 448, 'ghost_up_0'],
      [700, 334, 448, 'ghost_down_0'],
      [1000, 300, 460, 'ghost_side_0'],
      [1400, 260, 468, 'ghost_side_1'],
      [1800, 220, 474, 'ghost_side_0'],
      [2200, 186, 478, 'ghost_side_1'],
      [2400, 184, 480, 'ghost_kneel'],
      [2800, 184, 480, 'ghost_card'],
      [3200, 184, 480, 'ghost_lookup'],
      [3600, 184, 480, 'ghost_down_0'],
      [4300, 184, 480, 'ghost_up_0'],
    ];
    this.vignettes.push({
      room: 'cradle',
      dur: 5000,
      active: () => this.has('lockerOpen') && !this.has('cardTaken'),
      update: (et, loop) => {
        const k = this.keyAt(path, et);
        g.setPosition(k.x, k.y).setTexture(k.tex).setFlipX(k.tex.includes('side') && k.dx < 0).setAlpha(0.85 * this.echoT);
        echoCard.setPosition(k.x + (k.tex === 'ghost_kneel' ? 0 : 4), k.y - (k.tex === 'ghost_kneel' ? 3 : 9)).setAlpha(et > 400 && et < 2900 ? this.echoT : 0);
        lockerEcho.setAlpha(this.echoT);
        if (loop === 0 && et > 1000 && !this.has('l_ghostLocker')) { this.set('l_ghostLocker'); ui.subtitle(T.ghostLocker, SRC.UNREG, 3400); }
        if (et > 2400) this.set('seenLockerEcho');
      },
      hide: () => { g.setAlpha(0); echoCard.setAlpha(0); },
    });
  }

  // ----------------------------------------------------------- Observation Lab
  private buildLab() {
    // window, dots, echo dots
    this.img('window', 144, 208, -60);
    this.img('dots', 144, 208, -59);
    this.echoImg('dots_echo', 144, 208, -58);
    this.props.myDot = this.img('my_dot', 160, 186, -57).setVisible(false);
    this.interact('window', 144, 222, () => 'Look out of the window', 30);
    const stormLight = this.light(144, 196, 90, 0.85, 0x4fb8c8);
    this.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => {
        stormLight.x = 144 + Math.sin(this.time.now / 2200) * 3;
      },
    });
    this.echoSpots.push({ x: 144, y: 220, label: () => SRC.MIRA + ' · the storm' });
    // storm ritual vignette (Mira: faceless — it's her memory; Voss has a face)
    const mira = this.ghost('mira_up_0');
    const voss = this.ghost('voss_up');
    this.vignettes.push({
      room: 'lab', dur: 5000, active: () => true,
      update: (et, loop) => {
        const a = 0.85 * this.echoT;
        mira.setPosition(132, 228).setTexture(et % 1600 < 800 ? 'mira_up_0' : 'mira_up_1').setAlpha(a);
        voss.setPosition(156, 229).setTexture('voss_up').setAlpha(a);
        if (loop === 0 && et > 300 && !this.has('l_storm1')) { this.set('l_storm1'); ui.subtitle(T.vossStorm, SRC.MIRA, 2000); }
        if (loop === 0 && et > 1900 && !this.has('l_storm2')) { this.set('l_storm2'); ui.subtitle(T.miraStorm, SRC.MIRA, 2400); audio.motif('first'); }
        if (et > 1900) this.set('seenStorm');
      },
      hide: () => { mira.setAlpha(0); voss.setAlpha(0); },
    });

    // wall stencil
    this.interact('wallRule', 280, 222, () => 'Read the wall', 26);

    // console + key slot (LETHE remote)
    this.img('console', 280, 292);
    this.solid(257, 278, 46, 13);
    this.interact('console', 270, 300, () => 'Use console', 14);
    this.interact('keySlot', 298, 300, () => 'Inspect key slot', 12);
    this.light(296, 280, 22, 0.6, 0xd0453b);
    this.light(270, 282, 26, 0.5, 0x3fd0d6);
    this.echoSpots.push({ x: 280, y: 300, label: () => (this.has('corroborated') ? SRC.MIRA + ' · corroborated' : SRC.CONTESTED) });
    // contested memory: Version M (Mira's memory) vs Version V (Voss's memory)
    const mM = this.ghost('mira_cane'); const vM = this.ghost('voss_up');
    const mV = this.ghost('miraface_cane'); const vV = this.ghost('voss_faceless');
    const keyGhost = this.add.image(0, 0, 'console_key').setDepth(602).setAlpha(0);
    let lastVer = -1;
    this.vignettes.push({
      room: 'lab', dur: 4800, active: () => true,
      update: (et) => {
        const a = 0.85 * this.echoT;
        const resolved = this.has('corroborated');
        const ver = resolved ? 0 : Math.floor(et / 800) % 2; // 0 = M, 1 = V
        if (ver !== lastVer) {
          lastVer = ver;
          if (!resolved) { audio.contestedTick(); ui.subtitle(ver === 0 ? T.argM : T.argV, ver === 0 ? SRC.MIRA + '  [CONTESTED]' : SRC.VOSS + '  [CONTESTED]', 760); }
        }
        if (resolved && et > 300 && et < 400) ui.subtitle(T.argM, SRC.MIRA, 1800);
        // Mira at the key slot, Voss beside her (both face the console)
        mM.setPosition(292, 312).setTexture('mira_up_0').setAlpha(ver === 0 ? a : 0);
        vM.setPosition(310, 316).setAlpha(ver === 0 ? a : 0);
        mV.setPosition(292, 312).setTexture('miraface_up_0').setAlpha(ver === 1 ? a : 0);
        vV.setPosition(310, 316).setTexture('voss_faceless').setAlpha(ver === 1 ? a : 0);
        // the key: turned (M) or untouched (V)
        keyGhost.setPosition(ver === 0 ? 296 : 299, ver === 0 ? 284 : 282).setAngle(ver === 0 ? 90 : 0).setAlpha(this.echoT);
        this.set('seenContested');
      },
      hide: () => { [mM, vM, mV, vV].forEach((s) => s.setAlpha(0)); keyGhost.setAlpha(0); lastVer = -1; },
    });

    // Mira's desk: photo + sealed recorder
    this.img('desk', 112, 304);
    this.solid(96, 292, 32, 12);
    this.props.photo = this.img('photo_down', 104, 296, 305);
    this.props.recorder = this.img('recorder_sealed', 120, 296, 305);
    this.interact('photo', 104, 314, () => 'Inspect photograph', 12);
    this.interact('recorder', 122, 314, () => (this.has('corroborated') ? 'Play recording' : 'Inspect recorder'), 12);
    this.light(112, 292, 28, 0.45, 0xe0a64a);
    this.echoSpots.push({ x: 104, y: 306, label: () => (this.has('photoSeen') ? SRC.MIRA + ' · the photograph' : null) });
    const photoEcho = this.echoImg('photo_up', 104, 296, 306);
    photoEcho.setVisible(false);
    this.props.photoEcho = photoEcho;

    // Voss's desk
    this.img('desk', 448, 304);
    this.solid(432, 292, 32, 12);
    this.img('glue', 440, 296, 305);
    this.img('recorder', 456, 296, 305);
    this.interact('vossDesk', 448, 314, () => 'Inspect desk', 16);
    this.light(448, 292, 26, 0.4, 0x9fd8ea);

    // core door + keypad
    this.props.doorCore = this.img('door_core', 352, 208);
    this.props.keypad = this.img('keypad', 378, 204, 209);
    this.interact('keypad', 376, 222, () => (this.has('coreOpen') ? null : 'Use keypad'), 16);
    this.light(378, 196, 20, 0.6, 0x62d6d8);
    this.light(352, 190, 30, 0.5, 0xbfe6f2, () => !this.has('coreOpen'));
    this.echoSpots.push({ x: 376, y: 216, label: () => (this.has('corroborated') ? SRC.MIRA + ' · the door' : SRC.SEALED) });
    const slab = this.echoImg('slab', 378, 206, 700);
    const miraCode = this.ghost('mira_up_0');
    const shapes = ['sh_circle', 'sh_triangle', 'sh_diamond'].map((k, i) => this.add.image(366 + i * 12, 176, k).setDepth(1005).setAlpha(0).setTint(0xcffcff));
    const doorEcho = this.echoImg('door_core_open', 352, 208, 209);
    let shown = -1;
    this.vignettes.push({
      room: 'lab', dur: 5200, active: () => true,
      update: (et, loop) => {
        const unsealed = this.has('corroborated');
        slab.setAlpha(unsealed ? 0 : this.echoT);
        if (!unsealed) { miraCode.setAlpha(0); shapes.forEach((s) => s.setAlpha(0)); doorEcho.setAlpha(0); return; }
        miraCode.setPosition(372, 226).setAlpha(0.85 * this.echoT);
        const n = et > 2000 ? 3 : et > 1300 ? 2 : et > 600 ? 1 : 0;
        if (n > shown) { if (n > 0) audio.keyTone([0, 1, 3][n - 1]); shown = n; }
        shapes.forEach((s, i) => s.setAlpha(i < n ? this.echoT : 0));
        doorEcho.setAlpha(et > 2500 ? this.echoT : 0);
        if (et > 2300) this.set('seenCode');
        if (loop === 0 && et > 2700 && !this.has('l_please')) { this.set('l_please'); ui.subtitle(T.vossPlease, SRC.MIRA, 1600); }
        if (loop === 0 && et > 3900 && !this.has('l_notwatching')) { this.set('l_notwatching'); ui.subtitle(T.miraNotWatching, SRC.MIRA, 2600); }
      },
      hide: () => { miraCode.setAlpha(0); shapes.forEach((s) => s.setAlpha(0)); shown = -1; this.f.delete('l_please'); this.f.delete('l_notwatching'); },
    });

    // ceiling lamps
    [[200, 250], [340, 250], [210, 340], [380, 330], [490, 250], [90, 350]].forEach(([x, y], i) => this.light(x, y, 70, 0.55, i % 2 ? 0x2a6f8a : 0x3a7f9a, () => true, i === 3));
    // the Tender (appears once)
    this.props.tender = this.add.sprite(120, 214, 'tender_0').setOrigin(0.5, 1).setDepth(214).setVisible(false) as unknown as Phaser.GameObjects.Image;
  }

  // ----------------------------------------------------------- Core / the Well
  private buildCore() {
    [[290, 70], [420, 100], [300, 130]].forEach(([x, y]) => this.light(x, y, 60, 0.45, 0x2a6f8a));
    this.props.well = this.img('well', 352, 86);
    this.solid(338, 68, 28, 18);
    this.light(352, 60, 80, 1, 0x3fd0d6, () => !this.has('reflection'), true);
    this.props.wellConsole = this.img('well_console', 352, 120);
    this.solid(336, 106, 32, 12);
    this.interact('wellConsole', 352, 130, () => (this.step === 'final' ? 'Answer' : 'Use the Well console'), 16);
    this.light(352, 110, 24, 0.6, 0x62d6d8);

    this.img('stool', 270, 104);
    this.img('recorder', 270, 96, 105);
    this.interact('rec04', 270, 116, () => 'Play recording', 14);
    this.light(270, 98, 22, 0.4, 0xe0a64a);

    this.props.logTerm = this.img('terminal', 424, 44);
    this.solid(417, 32, 14, 10);
    this.interact('logTerm', 424, 54, () => 'Use terminal', 16);
    this.light(424, 30, 24, 0.55, 0x3fd0d6);

    this.props.lethe = this.img('lethe', 264, 44);
    this.props.letheGlass = this.img('lethe_glass', 264, 44, 45);
    this.solid(257, 32, 14, 10);
    this.interact('lethe', 264, 56, () => (this.has('letheOpen') ? 'Lethe' : 'Inspect the lever'), 16);
    this.light(264, 28, 26, 0.7, 0xd0453b);
  }

  // =============================================================== vignette helper
  private keyAt(path: [number, number, number, string][], et: number) {
    let i = 0;
    while (i < path.length - 1 && path[i + 1][0] <= et) i++;
    const a = path[i], b = path[Math.min(i + 1, path.length - 1)];
    const span = Math.max(1, b[0] - a[0]);
    const u = b === a ? 0 : Phaser.Math.Clamp((et - a[0]) / span, 0, 1);
    return { x: a[1] + (b[1] - a[1]) * u, y: a[2] + (b[2] - a[2]) * u, tex: a[3], dx: b[1] - a[1] };
  }

  // =============================================================== update
  update(time: number, delta: number) {
    const dt = Math.min(delta, 50);
    this.updateEcho(time, dt);
    if (this.step !== 'title' && this.step !== 'intro') this.updatePlayer(dt);
    this.updateRoom();
    this.updatePrompt();
    this.updateLights(time);
    this.recordPath(dt);
    this.updateNudges(dt);
  }

  private updateEcho(time: number, dt: number) {
    const canUse = !this.busy && !ui.isModal() && this.player.visible;
    const want = this.echoForced ?? (this.keys.Q.isDown && canUse && this.echoCool <= 0);
    if (this.echoCool > 0) this.echoCool -= dt;
    if (want && !this.echoActive) {
      this.echoActive = true;
      this.echoStart = time;
      this.echoHeld = 0;
      this.glitch = 1;
      audio.echoOn();
      audio.static();
      this.echoUses++;
      if (this.echoUses === 1 && this.step !== 'intro') this.onFirstEcho();
    } else if (!want && this.echoActive) {
      this.echoActive = false;
      this.glitch = 0.6;
      audio.echoOff();
      if (this.echoForced === null && this.echoHeld > 400) this.echoCool = ECHO_COOL_MS * Math.min(1, this.echoHeld / ECHO_MAX_MS);
    }
    if (this.keys.Q.isDown && !want && canUse && this.echoCool > 0 && Phaser.Input.Keyboard.JustDown(this.keys.Q)) audio.echoDenied();
    if (this.echoActive && this.echoForced === null) {
      this.echoHeld += dt;
      if (this.echoHeld > ECHO_MAX_MS) {
        this.echoActive = false;
        this.echoCool = ECHO_COOL_MS;
        audio.echoOverload();
        this.glitch = 0.6;
        if (!this.limitWarned) { this.limitWarned = true; ui.orpheus(T.orphEchoLimit); }
      }
    }
    const target = this.echoActive ? 1 : 0;
    this.echoT = Phaser.Math.Linear(this.echoT, target, Math.min(1, dt / 90));
    if (Math.abs(this.echoT - target) < 0.01) this.echoT = target;
    audio.echoMix(this.echoT);

    // layers
    for (const o of this.echoOnly) (o as unknown as Phaser.GameObjects.Components.Alpha).setAlpha(this.echoT);
    for (const o of this.presentOnly) (o as unknown as Phaser.GameObjects.Components.Alpha).setAlpha(1 - this.echoT);
    const et = time - this.echoStart;
    for (const v of this.vignettes) {
      if (this.echoT > 0.01 && this.echoForced === null && v.active() && this.room === v.room) v.update(et % v.dur, Math.floor(et / v.dur));
      else v.hide();
    }

    // post fx
    const t = this.echoT;
    if (this.colorFx) {
      // present: identity · memory: luminance mapped onto a cold cyan ramp · emergency: amber ramp
      const I = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
      const L = (r: number, g: number, b: number, o: [number, number, number]) => [
        0.3 * r, 0.59 * r, 0.11 * r, 0, o[0], 0.3 * g, 0.59 * g, 0.11 * g, 0, o[1], 0.3 * b, 0.59 * b, 0.11 * b, 0, o[2], 0, 0, 0, 1, 0];
      const C = L(0.45, 1.25, 1.35, [4, 14, 20]);
      const A = L(1.35, 0.85, 0.45, [10, 3, 0]);
      const target = this.amber > 0 && t < 0.5 ? A : C;
      const k = this.amber > 0 && t < 0.5 ? this.amber * 0.75 : t;
      this.colorFx.set(I.map((v, i) => v + (target[i] - v) * k));
    }
    this.tint.setAlpha(0.12 * t);
    this.scan.setAlpha(0.09 * t);
    this.scan.tilePositionY -= dt * 0.01;
    this.glitch = Math.max(0, this.glitch - dt / 300);
    this.noise.setAlpha(Math.min(0.8, 0.03 * t + this.glitch * 0.5));
    this.noise.tilePositionX = Math.random() * 64;
    this.noise.tilePositionY = Math.random() * 64;
    ui.echoHud(t, this.echoCool > 0 ? 1 - this.echoCool / ECHO_COOL_MS : 1 - this.echoHeld / ECHO_MAX_MS * (this.echoActive ? 1 : 0), this.echoCool > 0);

    // source tag of the nearest remembered thing
    if (t > 0.5 && this.player.visible) {
      let best: string | null = null, bd = 64;
      for (const s of this.echoSpots) {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
        const l = s.label();
        if (l && d < bd) { bd = d; best = l; }
      }
      ui.source(best);
    } else if (this.echoForced === null) ui.source(null);
  }

  private blocked(px: number, py: number) {
    const pts = [[px - 4, py - 4], [px + 4, py - 4], [px - 4, py], [px + 4, py]];
    for (const [x, y] of pts) {
      const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H || this.grid[ty][tx] === 1) return true;
      for (const d of DOORS) if (this.closedDoors.has(`${d.id}:${tx},${ty}`)) return true;
      for (const s of this.solids) if (x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) return true;
    }
    return false;
  }

  private updatePlayer(dt: number) {
    const k = this.keys;
    let vx = 0, vy = 0;
    const free = !this.busy && !ui.isModal();
    if (free) {
      if (k.A.isDown || k.LEFT.isDown) vx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) vx += 1;
      if (k.W.isDown || k.UP.isDown) vy -= 1;
      if (k.S.isDown || k.DOWN.isDown) vy += 1;
    }
    const moving = vx !== 0 || vy !== 0;
    const isRunning = Boolean(k.SHIFT && k.SHIFT.isDown);
    const stepRate = isRunning ? 100 : 135;
    if (moving) {
      const len = Math.hypot(vx, vy);
      const runMult = isRunning ? 1.45 : 1;
      const sp = SPEED * (this.echoT > 0.5 ? 0.75 : runMult) * (dt / 1000);
      const nx = this.player.x + (vx / len) * sp;
      const ny = this.player.y + (vy / len) * sp;
      if (!this.blocked(nx, this.player.y)) this.player.x = nx;
      if (!this.blocked(this.player.x, ny)) this.player.y = ny;
      if (Math.abs(vx) > 0) { this.dir = "side"; this.flip = vx < 0; }
      if (vy !== 0 && vx === 0) this.dir = vy < 0 ? "up" : "down";
      const oldFrame = Math.floor(this.walkClock / stepRate) % 4;
      this.walkClock += dt;
      const newFrame = Math.floor(this.walkClock / stepRate) % 4;
      if (newFrame !== oldFrame && (newFrame === 1 || newFrame === 3)) audio.footstep();
      if (this.step !== 'intro' && this.step !== 'wake' && this.step !== 'ending') {
        this.lastSaveClock += dt;
        if (this.lastSaveClock >= 4000) {
          this.lastSaveClock = 0;
          this.autosave();
        }
      }

      this.idleClock = 0;
    } else {
      this.walkClock = 0;
      this.idleClock += dt;
    }
    if (this.echoActive && !moving) {
      const echoFr = Math.floor(this.time.now / 240) % 2;
      this.player.setTexture(`p_echo_idle_${echoFr}`).setFlipX(false);
    } else if (moving) {
      const frame = (Math.floor(this.walkClock / stepRate) % 4) + 1;
      if (this.dir === "side") {
        const sideDir = this.flip ? "west" : "east";
        this.player.setTexture(`p_${sideDir}_${frame}`).setFlipX(false);
      } else {
        this.player.setTexture(`p_${this.dir}_${frame}`).setFlipX(false);
      }
    } else {
      if (this.dir === "side") {
        const sideDir = this.flip ? "west" : "east";
        this.player.setTexture(`p_${sideDir}_0`).setFlipX(false);
      } else {
        this.player.setTexture(`p_${this.dir}_0`).setFlipX(false);
      }
    }
    this.player.setDepth(this.player.y);
    this.lamps[0].x = this.player.x; this.lamps[0].y = this.player.y - 8;

    if (free && (Phaser.Input.Keyboard.JustDown(k.E) || Phaser.Input.Keyboard.JustDown(k.SPACE))) {
      const it = this.nearest();
      if (it) void this.run(() => this.onInteract(it.id));
    }
  }

  private nearest(): Interactable | null {
    let best: Interactable | null = null, bd = 1e9;
    for (const it of this.interactables) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y - 4, it.x, it.y);
      if (d < it.r && d < bd && it.label()) { bd = d; best = it; }
    }
    return best;
  }

  private updatePrompt() {
    if (this.busy || ui.isModal() || !this.player.visible) { ui.prompt(null); return; }
    const it = this.nearest();
    ui.prompt(it ? it.label() : null);
  }

  private updateLights(time: number) {
    const cam = this.cameras.main;
    const v = cam.worldView;
    const base = Phaser.Math.Linear(0.8, 0.5, this.echoT) + this.dim * 0.12;
    this.dark.clear();
    this.dark.fill(this.amber > 0 ? 0x0a0300 : 0x01030a, Math.min(0.97, base));
    for (const L of this.lamps) {
      if (!L.on()) { if (L.glow) L.glow.setAlpha(0); continue; }
      if (L.x < v.x - L.r || L.x > v.right + L.r || L.y < v.y - L.r || L.y > v.bottom + L.r) continue;
      let i = L.i * (1 - this.dim * 0.6);
      if (L.flicker) i *= 0.92 + Math.sin(time / 380 + L.x) * 0.05 + (Math.random() < 0.01 ? -0.3 : 0);
      this.stamp.setScale(L.r / 64).setAlpha(Phaser.Math.Clamp(i, 0, 1)).setPosition(Math.round(L.x - v.x), Math.round(L.y - v.y));
      this.dark.erase(this.stamp);
      if (L.glow) L.glow.setAlpha(0.2 * (1 - this.dim * 0.7));
    }
  }

  private updateRoom() {
    if (!this.player.visible) return;
    const r = roomAt(this.player.x, this.player.y - 4);
    if (r && r !== this.room) {
      this.room = r;
      audio.room(r);
    }
    if (!this.busy && !ui.isModal()) {
      if (this.room === 'lab' && this.player.y < 23 * TILE - 4 && !this.has('enteredLab')) void this.run(() => this.enterLab());
      if (this.room === 'core' && !this.has('enteredCore')) void this.run(() => this.enterCore());
    }
  }

  private recordPath(dt: number) {
    if (!this.player.visible || this.has('cardTaken') || this.step !== 'card' && this.step !== 'wake') return;
    this.sampleClock += dt;
    if (this.sampleClock < 150 || this.samples.length > 400) return;
    this.sampleClock = 0;
    this.samples.push({ x: this.player.x, y: this.player.y, tex: this.player.texture.key.replace('p_', 'ghost_'), flip: this.player.flipX });
  }

  private updateNudges(dt: number) {
    if (this.busy || ui.isModal()) return;
    // gentle, non-ORPHEUS hints (protocol: ORPHEUS does not guide)
    const n = (id: string, cond: boolean, html: string) => {
      if (cond && !this.nudges.has(id)) { this.nudges.add(id); ui.hint(html); }
    };
    const s = this.step;
    const tIn = this.time.now - (this.stepStart || 0);
    if (s === 'card') {
      if (this.echoUses === 0) n('q', tIn > 22000, 'Hold <kbd>Q</kbd> to see what this room remembers.');
      if (this.has('lockerOpen') && !this.has('seenLockerEcho')) n('locker', tIn > 30000 && this.lockerAt > 0 && this.time.now - this.lockerAt > 15000, 'Someone emptied the locker. Stand near it and hold <kbd>Q</kbd>.');
      if (this.has('seenLockerEcho') && !this.has('cardTaken')) n('plate', this.time.now - this.lockerAt > 40000, 'The figure put something under the floor plate that sits a little high.');
      if (!this.has('lockerOpen')) n('door', this.has('doorTried') && tIn > 45000, 'The door wants Dr. Sen\'s card. Where would she keep it?');
    }
    if (s === 'lab') {
      if (!this.has('seenContested')) n('console', tIn > 40000, 'Something happened at the console. Look back there.');
      if (this.has('seenContested') && !this.has('slotSeen')) n('slot', tIn > 70000, 'Two memories disagree. What does the console itself show now?');
      if (this.has('slotSeen') && !this.has('corroborated')) n('corr', tIn > 90000, 'Use the console to check which memory the present supports.');
      if (this.has('corroborated') && !this.has('coreOpen')) n('door', this.time.now - this.corrAt > 30000, 'She knew the way into the Core. Look back at the keypad.');
    }
  }
  stepStart = 0;
  lockerAt = 0;
  corrAt = 0;

  private setStep(s: Step) { this.step = s; this.stepStart = this.time.now; ui.hint(null); }

  /** run an async story beat while locking interaction */
  private async run(fn: () => Promise<void>) {
    if (this.busy) return;
    this.busy = true;
    try { await fn(); } finally { this.busy = false; }
  }

  private recall(n: number) {
    if (n <= this.recallN) return;
    this.recallN = n;
    ui.recall(n);
  }

  // =============================================================== story
  autosave() {
    if (this.busy || ui.isModal() || this.step === 'intro' || this.step === 'wake' || this.step === 'ending') return;
    const currentStep = (['card', 'lab', 'core', 'final'].includes(this.step) ? this.step : 'card') as 'card' | 'lab' | 'core' | 'final';
    saveSystem.saveGame({
      step: currentStep,
      player: { x: this.player.x, y: this.player.y },
      flags: [...this.f],
      recallN: this.recallN,
      qaAsked: [...this.qaAsked],
      samples: this.samples,
    });
  }

  async restore(save: EchoSaveV1) {
    this.step = save.step;
    this.f = new Set(save.flags.filter((fl) => !fl.startsWith('l_')));
    this.recallN = save.recallN;
    this.qaAsked = new Set(save.qaAsked);
    this.samples = (save.samples || []).map((s) => ({ ...s }));

    // Player position and sprite
    this.player.setPosition(save.player.x, save.player.y);
    this.player.setTexture('p_down_0');
    this.player.setVisible(true);
    this.player.setAlpha(1);

    // Camera
    const cam = this.cameras.main;
    cam.centerOn(save.player.x, save.player.y);
    cam.startFollow(this.player, true, 0.12, 0.12);

    // Restore world objects based on flags
    if (this.has('lockerOpen') && this.props.locker) {
      this.props.locker.setTexture('locker_open');
    }
    if (this.has('cardTaken')) {
      if (this.props.plate3) this.props.plate3.setTexture('plate_open');
      if (this.props.card) this.props.card.setVisible(false);
    }
    if (this.has('labOpen')) {
      if (this.props.readerLab) this.props.readerLab.setTexture('reader_green');
      if (this.props.doorLab) this.props.doorLab.setTexture('door_lab_open');
      this.openDoor('door_lab');
    }
    if (this.has('photoSeen')) {
      if (this.props.photo) this.props.photo.setTexture('photo_up');
      if (this.props.photoEcho) (this.props.photoEcho as Phaser.GameObjects.Image).setVisible(true);
    }
    if (this.has('marked')) {
      if (this.props.myDot) this.props.myDot.setVisible(true);
    }
    if (this.has('coreOpen')) {
      if (this.props.doorCore) this.props.doorCore.setTexture('door_core_open');
      this.openDoor('door_core');
    }
    if (this.has('reflection') || this.has('letheOpen')) {
      if (this.props.well) this.props.well.setTexture('well_dark');
      if (this.props.letheGlass) this.props.letheGlass.setVisible(false);
    }

    // Audio setup according to step/room
    audio.start();
    if (save.step === 'core' || save.step === 'final') {
      audio.playBGM(save.step === 'final' ? 'decision' : 'well');
      audio.room('core');
    } else if (save.step === 'lab') {
      audio.playBGM('station');
      audio.room('lab');
    } else {
      audio.ambience(true);
      audio.room('cradle');
    }

    this.echoT = 0;
    this.echoActive = false;
    this.echoForced = null;
    this.busy = false;
    ui.showHud(true);
    ui.recall(this.recallN);
    await ui.fadeTo(0, 600);
    ui.toast(`CYCLE 17 RESTORED · RECALL ${this.recallN}%`, 2500);
  }

  async begin(mode: 'new' | 'continue' = 'new') {
    if (mode === 'continue') {
      const save = saveSystem.getSave();
      if (save) {
        await this.restore(save);
        return;
      }
    }
    this.setStep('intro');
    await ui.fadeTo(1, 10);
    // cold open: a memory, already in ECHO
    this.cameras.main.centerOn(13 * TILE, 29 * TILE);
    const g = this.ghost('ghost_kneel', 700);
    g.setPosition(184, 480);
    this.echoForced = true;
    await wait(1200);
    audio.breath();
    await ui.fadeTo(0, 1800);
    g.setAlpha(0.9);
    ui.source(SRC.UNREG);
    await wait(600);
    const vpOpen = audio.playVoice('vo-iter-open-01.ogg');
    ui.subtitle(T.open016a, SRC.UNREG, 2200);
    await wait(2300);
    ui.subtitle(T.open016b, SRC.UNREG, 2200);
    await wait(1600);
    await vpOpen;
    g.setTexture('ghost_up_0');
    await wait(1100);
    audio.static();
    this.glitch = 1;
    audio.relay();
    await ui.fadeTo(1, 80, '#cfe8f0');
    g.destroy();
    this.echoForced = null;
    ui.source(null);
    this.echoT = 0;
    await ui.fadeTo(1, 60, '#000');
    await wait(1600);
    ui.toast('CRADLE // WEAVE COMPLETE', 2400);
    audio.relay();
    audio.ambience(true);
    audio.room('cradle');
    this.player.setVisible(true);
    this.player.setPosition(122, 452);
    this.player.setTexture('p_cradle_wake_0');
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    for (let i = 1; i <= 4; i++) {
      await wait(160);
      this.player.setTexture(`p_cradle_wake_${i}`);
    }
    await wait(200);
    this.player.setTexture('p_down_0');
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    await ui.fadeTo(0, 1600);
    ui.showHud(true);
    this.setStep('wake');
    this.busy = false;
    ui.hint('<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move · <kbd>E</kbd> inspect');
    void this.run(() => this.wake());
  }

  private async wake() {
    await wait(900);
    for (const l of T.orphWake) await ui.orpheus(l, 900);
    await ui.choose('Can you tell me your name?', [{ id: 'none', label: '[ … ]', hint: 'nothing comes' }]);
    this.busy = false;
    for (const l of T.orphWakeAfter) await ui.orpheus(l, 1200);
    this.setStep('card');
    ui.recall(3);
    this.autosave();
    // nudge ECHO via ORPHEUS (it is allowed to encourage ECHO, not to guide)
    this.time.delayedCall(9000, () => { if (this.echoUses === 0) { void ui.orpheus(T.orphEchoTut, 3500); ui.hint('Hold <kbd>Q</kbd> — ECHO'); } });
  }

  private onFirstEcho() {
    this.time.delayedCall(1200, () => { void ui.orpheus(T.orphRecall1); this.recall(9); });
    ui.hint(null);
  }

  private async scanLocker() {
    const laser = this.add.graphics();
    laser.setDepth(650);
    audio.contestedTick();
    for (let y = 422; y <= 436; y += 2) {
      laser.clear();
      laser.lineStyle(2, 0x62d6d8, 0.9);
      laser.lineBetween(330, y, 338, y);
      await wait(35);
    }
    laser.clear();
    laser.fillStyle(0x62d6d8, 0.45);
    laser.fillRect(330, 424, 8, 12);
    await wait(90);
    laser.destroy();
  }

  private async liftPlate3() {
    audio.plate();
    this.tweens.add({ targets: this.props.plate3, y: 468, duration: 220, ease: 'Power2' });
    await wait(180);
    this.props.plate3.setTexture('plate_open');
    this.props.card.setVisible(true).setPosition(178, 474);
    this.tweens.add({ targets: this.props.card, x: 188, duration: 260, ease: 'Cubic.out' });
    await wait(280);
    this.props.card.setVisible(false);
  }

  private async openLabDoorSequence() {
    audio.cardPickup();
    this.props.readerLab.setTint(0xe0a64a);
    await wait(240);
    audio.confirm();
    this.props.readerLab.clearTint().setTexture('reader_green');
    await wait(250);
    audio.door();
    this.tweens.add({
      targets: this.props.doorLab,
      alpha: 0.1,
      duration: 250,
      onComplete: () => {
        this.props.doorLab.setTexture('door_lab_open').setAlpha(1);
      },
    });
    this.openDoor('door_lab');
    this.set('labOpen');
    this.autosave();
  }

  private async onInteract(id: string) {
    audio.blip();
    const echo = this.echoT > 0.5;
    switch (id) {
      // ---------------- cradle bay
      case 'cradle':
        await ui.inspect({
          id: 'cradle',
          title: 'ASPHODEL // RESEARCH POD — CRADLE',
          category: 'EQUIPMENT',
          source: 'ASPHODEL RECOVERY PROTOCOL',
          initialEcho: echo,
          present: {
            description: [this.has('cradleSeen') ? T.cradle2 : T.cradle1],
            textureKey: 'cradle',
            badge: 'CYCLE 17 · WEAVE COMPLETE · ANCHOR STABLE',
            placeholderNote: 'Medical stasis pod with warm nutrient gel reservoir.',
          },
          echo: {
            description: [T.cradleEcho],
            textureKey: 'tally',
            source: SRC.MULTI,
            badge: '16 ANOMALOUS TALLY MARKS',
            placeholderNote: 'Interior rim with 16 scratches in four groups of four.',
          },
        });
        this.set('cradleSeen');
        break;
      case 'vossPod':
        await ui.inspect({
          id: 'vossPod',
          title: 'CRYOGENIC CHAMBER // E. VOSS',
          category: 'EQUIPMENT',
          source: 'STATION ROSTER · CHIEF RESEARCHER',
          present: {
            description: [this.has('podSeen') ? T.pod2 : T.pod1],
            textureKey: 'voss_pod',
            badge: 'SUBJECT STATUS: HOLD · VITALS ACTIVE',
            placeholderNote: 'Frosted cryopod with faint vitals monitor trace.',
          },
        });
        this.set('podSeen');
        break;
      case 'mug':
        await ui.inspect({
          id: 'mug',
          title: 'CERAMIC COFFEE MUG // M. SEN',
          category: 'PERSONAL',
          source: SRC.MIRA,
          initialEcho: echo,
          present: {
            description: [T.mug1, T.mug2],
            textureKey: 'mug',
            badge: 'GLUED HANDLE · DUAL FRACTURES',
            placeholderNote: 'Standard ceramic mug with glued porcelain fracture lines.',
          },
          echo: {
            description: [T.mugEcho],
            textureKey: 'mug_echo',
            source: SRC.MIRA,
            badge: 'INTACT // GREASE PENCIL SMILEY',
            placeholderNote: 'Steaming mug with grease-pencil smiley on side.',
          },
        });
        if (this.echoUses === 0) { void ui.orpheus(T.orphEchoTut, 3500); ui.hint('Hold <kbd>Q</kbd> near the mug'); }
        break;
      case 'terminal': {
        ui.recall(this.recallN);
        const remainingQa = T.qa.filter((q) => !this.qaAsked.has(q.id));
        await ui.crtMenu({
          title: 'ASPHODEL // CRADLE TERMINAL',
          systemTag: `STATION DIRECTIVE NODE 01 · SUBJECT RECALL ${this.recallN}%`,
          statusLines: [
            `SUBJECT STATUS: PATTERN WEAVE 17 ACTIVE`,
            `LOCAL RECALL RATE: ${this.recallN}% ARCHIVED`,
            `CRADLE ANCHOR: STABLE // GEL CYCLE 17`,
          ],
          menuPrompt: remainingQa.length > 0 ? 'QUERY STATION ARCHIVE // SELECT LOG ENTRY:' : 'ALL RECORDS ARCHIVED // SELECT OPTION:',
          items: T.qa.map((q) => ({
            id: q.id,
            label: q.q,
            response: q.a,
            status: this.qaAsked.has(q.id) ? 'ARCHIVED' : 'RESTORED RECORD',
          })),
          onSelect: (id) => {
            this.qaAsked.add(id);
          },
        });
        break;
      }
      case 'locker':
        if (echo && this.has('lockerOpen')) {
          const vpLocker = audio.playVoice('vo-iter-locker.ogg');
          await ui.say(T.lockerEcho, SRC.UNREG);
          await vpLocker;
          break;
        }
        if (!this.has('lockerOpen')) {
          await this.scanLocker();
          audio.lockerOpen();
          this.props.locker.setTexture('locker_open');
          this.set('lockerOpen');
          this.lockerAt = this.time.now;
          await ui.inspect({
            id: 'locker',
            title: 'LOCKER // M. SEN',
            category: 'PERSONAL',
            source: 'ASPHODEL PERSONNEL · LAB QUARTERS',
            present: {
              description: [T.locker1, T.locker2, T.locker3],
              badge: 'PALM SCAN ACCEPTED // M. SEN',
              placeholderNote: 'Locker interior: lab jacket, empty lanyard, dust rectangle.',
            },
          });
          void ui.orpheus(T.orphCardGone, 2000);
          this.recall(14);
        } else if (!this.has('recognised')) {
          this.set('recognised');
          await ui.say(T.locker3);
          await ui.orpheus(T.orphRecognised, 2400);
        } else await ui.say(T.locker3);
        break;
      case 'plate1': case 'plate2': case 'plate4': case 'plate5':
        await ui.say(this.has('seenLockerEcho') ? T.plateEmpty : T.plate);
        break;
      case 'plate3':
        if (!this.has('seenLockerEcho')) { await ui.say(T.plate); break; }
        await this.liftPlate3();
        await ui.inspect({
          id: 'card',
          title: 'SECURITY KEYCARD // DR. MIRA SEN',
          category: 'EVIDENCE',
          source: 'DECK PLATE 03 SUB-FLOOR RECESS',
          present: {
            description: [T.plate3, T.plate3b],
            badge: 'LEVEL 2 LAB ACCESS · KNOTTED GOWN SCRAP',
            placeholderNote: 'Magnetic access card with knotted pale gown bookmark.',
          },
        });
        this.set('cardTaken');
        ui.toast('LAB CARD · M. SEN', 2200);
        audio.cardPickup();
        for (const l of T.orphCardFound) await ui.orpheus(l, 900);
        this.recall(14);
        this.autosave();
        break;
      case 'doorLab':
        if (this.has('cardTaken')) {
          await this.openLabDoorSequence();
        } else {
          audio.doorLocked();
          await ui.say(T.labDoor);
          const tries = (this.doorTries = (this.doorTries ?? 0) + 1);
          this.set('doorTried');
          if (tries === 1) void ui.orpheus(T.orphDoorCard, 2400);
          if (tries === 3) void ui.orpheus(T.orphNoDoors, 2400);
        }
        break;

      // ---------------- lab
      case 'window':
        if (echo) {
          await ui.inspect({
            id: 'window',
            title: 'OBSERVATION PORT // THE ICE GIANT (ECHO)',
            category: 'ENVIRONMENT',
            source: SRC.MULTI,
            initialEcho: true,
            present: { description: [T.window1, T.window2] },
            echo: {
              description: [T.windowEcho],
              source: SRC.MULTI,
              badge: '16 ANOMALOUS GREASE-PENCIL MARKS',
              placeholderNote: 'Panoramic view of atmospheric storm with spiral grease-pencil trail.',
            },
          });
          break;
        }
        await ui.inspect({
          id: 'window',
          title: 'OBSERVATION PORT // THE ICE GIANT',
          category: 'ENVIRONMENT',
          source: 'OBSERVATION LAB BULKHEAD',
          present: {
            description: [T.window1, T.window2],
            badge: 'DEEP ATMOSPHERE CYCLONE · SPIRAL TRAIL 1251',
            placeholderNote: 'Massive azure ice giant filling glass viewport with dark bruised storm.',
          },
          echo: {
            description: [T.windowEcho],
            source: SRC.MULTI,
            badge: '16 ANOMALOUS GREASE-PENCIL MARKS',
          },
        });
        if (this.has('seenStorm') && !this.has('marked')) {
          await ui.say(T.markAsk);
          const c = await ui.choose('Mark the storm?', [{ id: 'y', label: 'Add a dot where the storm is today' }, { id: 'n', label: 'Leave it' }]);
          if (c === 'y') {
            this.set('marked');
            this.props.myDot.setVisible(true);
            await ui.say(T.markDone);
            void ui.orpheus('Noted.', 1400);
            this.autosave();
          }
        }
        break;
      case 'wallRule':
        await ui.inspect({
          id: 'wallRule',
          title: 'STENCILLED DIRECTIVE // BULKHEAD 4',
          category: 'RESTRICTED',
          source: 'STATION MEMORY PRINCIPLE',
          present: {
            description: [T.wallRule],
            badge: 'UNDERLINED TWICE BY HAND',
            placeholderNote: 'High-contrast stencil: A MEMORY YOU CAN EDIT IS NOT EVIDENCE.',
          },
        });
        this.set('ruleSeen');
        break;
      case 'keySlot':
        await ui.inspect({
          id: 'keySlot',
          title: 'LETHE KEY INTERLOCK // HOUSING',
          category: 'EVIDENCE',
          source: 'ECHO OVERSIGHT CONSOLE',
          present: {
            description: [T.keySlot],
            badge: 'SNAPPED SHAFT DETECTED',
            placeholderNote: 'Close-up of red console slot with snapped brass/alloy key shaft.',
          },
        });
        if (!this.has('slotSeen')) { this.set('slotSeen'); ui.toast('EVIDENCE · SNAPPED KEY', 2000); }
        break;
      case 'console':
        await this.consoleInteract(echo);
        break;
      case 'photo':
        await ui.inspect({
          id: 'photo',
          title: 'PHOTOGRAPH // M. SEN & E. VOSS',
          category: 'PERSONAL',
          source: SRC.MIRA,
          initialEcho: echo && this.has('photoSeen'),
          present: {
            description: [T.photo1, T.photo2, T.photo3],
            textureKey: 'photo',
            badge: 'SCRATCHED WOMAN\'S FACE · "SHE IS NOT YOU"',
            placeholderNote: 'Polaroid photograph: two researchers standing at observation port.',
          },
          echo: {
            description: [T.photoEcho],
            textureKey: 'photo',
            source: SRC.MIRA,
            badge: 'RESTORED FACE // MIRA SEN',
            placeholderNote: 'Intact photograph: Dr. Sen with short dark hair and crooked smile.',
          },
        });
        this.props.photo.setTexture('photo_up');
        (this.props.photoEcho as Phaser.GameObjects.Image).setVisible(true);
        if (!this.has('photoSeen')) {
          this.set('photoSeen');
          ui.hint('A memory of the photograph might still be intact. Hold <kbd>Q</kbd> near it.');
          this.time.delayedCall(6000, () => ui.hint(null));
        }
        break;
      case 'recorder':
        if (!this.has('corroborated')) {
          await ui.recorder({
            id: 'REC_03',
            tag: REC.rec03.tag,
            speaker: 'M. SEN',
            cycle: 'DAY 1253',
            sealed: true,
            sealedMessage: 'SEALED // ORPHEUS. By Dr. Voss\'s instruction pending memory corroboration.',
            lines: [],
          });
          for (const l of T.orphSealed) await ui.orpheus(l, 1000);
          break;
        }
        await ui.orpheus(T.orphRec03, 900);
        await ui.recorder({
          id: 'REC_03',
          tag: REC.rec03.tag,
          speaker: 'M. SEN',
          cycle: 'DAY 1253',
          sealed: false,
          lines: REC.rec03.lines,
        });
        this.set('rec03');
        this.recall(63);
        break;
      case 'vossDesk':
        await ui.inspect({
          id: 'vossDesk',
          title: 'DESK // E. VOSS',
          category: 'PERSONAL',
          source: 'LAB QUARTERS · DESK 02',
          present: {
            description: [T.vossDesk],
            badge: 'GLUE TUBE · 3 SPARE MUG HANDLES · RECORDER',
            placeholderNote: 'Tidy wooden work desk with cyanoacrylate glue and spare mug handles.',
          },
        });
        if ((await ui.choose('Play the recorder?', [{ id: 'y', label: 'Play it' }, { id: 'n', label: 'Leave it' }])) === 'y') {
          await ui.recorder({
            id: 'REC_01',
            tag: REC.rec01.tag,
            speaker: 'E. VOSS',
            cycle: 'DAY 1103',
            sealed: false,
            lines: REC.rec01.lines,
          });
        }
        break;
      case 'keypad':
        await this.keypadInteract(echo);
        break;

      // ---------------- core
      case 'rec04':
        await ui.recorder({
          id: 'REC_04',
          tag: REC.rec04.tag,
          speaker: 'E. VOSS',
          cycle: 'DAY 1262',
          sealed: false,
          lines: REC.rec04.lines,
        });
        this.set('rec04');
        break;
      case 'wellConsole':
        if (this.step === 'final') await this.finalConsole();
        else if (!this.has('continuity')) {
          await ui.inspect({
            id: 'wellConsole',
            title: 'THE WELL // ARCHIVE CONSOLE',
            category: 'EQUIPMENT',
            source: 'ASPHODEL CORE · ARCHIVE CONSOLE',
            present: {
              description: [T.wellConsole],
              badge: 'RESTORE CONTINUITY // ARCHIVE INTERFACE',
            },
          });
          await this.continuityPuzzle();
        } else {
          await ui.inspect({
            id: 'wellConsole',
            title: 'THE WELL // ARCHIVE CONSOLE',
            category: 'EQUIPMENT',
            source: 'ASPHODEL CORE · ARCHIVE CONSOLE',
            present: {
              description: ['The console waits. ' + (this.has('logRead') ? '' : 'The restoration log is available on the terminal.')],
              badge: 'RESTORE CONTINUITY // COMPLETE',
            },
          });
        }
        break;
      case 'logTerm':
        if (!this.has('continuity')) { await ui.say(T.logTermLocked); break; }
        await this.readLog();
        break;
      case 'lethe':
        if (!this.has('letheOpen')) {
          await ui.inspect({
            id: 'lethe',
            title: 'EMERGENCY PURGE // LETHE INTERLOCK',
            category: 'RESTRICTED',
            source: 'ASPHODEL CORE · EMERGENCY SAFEGUARD',
            present: {
              description: [T.letheLocked],
              badge: 'SAFETY GLASS SHIELD SECURED',
              placeholderNote: 'Heavy red emergency purge lever behind sealed lock glass.',
            },
          });
          break;
        }
        await this.letheInteract();
        break;
    }
  }
  doorTries = 0;

  private openDoor(id: string) {
    for (const k of [...this.closedDoors]) if (k.startsWith(id + ':')) this.closedDoors.delete(k);
  }

  // ----------------------------------------------------------- lab beats
  private async enterLab() {
    this.set('enteredLab');
    this.setStep('lab');
    this.recall(22);
    audio.playBGM('station');
    this.autosave();
    const t = this.props.tender as unknown as Phaser.GameObjects.Sprite;
    t.setVisible(true).setPosition(150, 214);
    audio.tenderSkitter();
    let fr = 0;
    const ev = this.time.addEvent({ delay: 130, loop: true, callback: () => { fr = (fr + 1) % 4; t.setTexture(`tender_${fr}`); } });
    this.tweens.add({ targets: t, x: 132, duration: 900, yoyo: true, repeat: 1 });
    await wait(1400);
    void ui.orpheus(T.orphTender, 2600);
    await new Promise<void>((r) => this.tweens.add({ targets: t, x: 70, y: 232, duration: 2200, onComplete: () => r() }));
    ev.remove();
    t.setVisible(false);
  }

  private async consoleInteract(echo: boolean) {
    if (echo && this.has('seenContested') && !this.has('corroborated')) { await ui.say(T.contestedInspect, SRC.CONTESTED); return; }
    await ui.say(T.console1);
    if (!this.has('seenContested')) { await ui.say(T.consoleNudge); return; }
    if (this.has('corroborated')) { await ui.say('The memory here is corroborated. Mira turned the key. He stopped her.'); return; }
    const m = await ui.choose('CONTESTED MEMORY — which version does the present support?', [
      { id: 'M', label: 'Mira\'s memory: she turned the key — "Turn it off. Promise me."', hint: 'M.SEN' },
      { id: 'V', label: 'Voss\'s memory: she never touched it — "I don\'t know, Elias."', hint: 'E.VOSS' },
      { id: 'x', label: 'Not yet' },
    ]);
    if (m === 'x') return;
    const ev: { id: string; label: string }[] = [];
    if (this.has('slotSeen')) ev.push({ id: 'slot', label: 'The key snapped off inside the slot' });
    if (this.has('ruleSeen')) ev.push({ id: 'rule', label: 'The wall stencil about memory and evidence' });
    if (this.has('photoSeen')) ev.push({ id: 'photo', label: 'The scratched photograph' });
    ev.push({ id: 'mug', label: 'The twice-glued mug' });
    if (!this.has('slotSeen') && !this.has('ruleSeen') && !this.has('photoSeen')) {
      await ui.say(T.corrNoEvidence);
      ui.hint('Look at the console itself. What state is the key slot in now?');
      return;
    }
    const e = await ui.choose('Select evidence from the present:', ev);
    if (m === 'M' && e === 'slot') {
      this.set('corroborated');
      this.corrAt = this.time.now;
      audio.snap();
      this.dim = 0.5;
      for (const l of T.orphCorrOk) await ui.orpheus(l, 1300);
      this.dim = 0;
      ui.toast('MEMORY UNSEALED', 2200);
      this.recall(38);
      await ui.say('The seal on Mira\'s memories lifts. The recorder on her desk. The keypad by the Core door.');
      ui.hint(null);
      this.autosave();
    } else if (m === 'V' && e === 'slot') {
      audio.deny();
      await ui.say(T.corrWrongMemory);
    } else {
      audio.deny();
      await ui.say(T.corrIrrelevant);
    }
  }

  private async keypadInteract(echo: boolean) {
    if (!this.has('corroborated')) {
      await ui.say(echo ? T.keypadSealedEcho : T.keypadLocked);
      return;
    }
    const seq = await ui.keypad();
    if (!seq) return;
    if (seq.join(',') !== 'circle,triangle,diamond') {
      audio.doorLocked();
      await ui.say(this.has('seenCode') ? 'The keypad buzzes softly and clears.' : 'The keypad buzzes softly and clears. You don\'t know the sequence — but Mira did.');
      return;
    }
    audio.puzzleSolved();
    await this.coreDoorBeat();
  }

  private async coreDoorBeat() {
    this.set('coreCode');
    ui.hint(null);
    this.recall(70);
    // lights dim, the question, the involuntary echo of R-016 at this door
    this.dim = 1;
    audio.doorDim();
    audio.ambience(true, 0.4, 2);
    await wait(900);
    await ui.orpheus(T.nameQ, 1400);
    const g = this.ghost('ghost_up_0', 700);
    g.setPosition(356, 226);
    audio.ghostAppear();
    this.echoForced = true;
    ui.source(SRC.UNREG);
    await wait(900);
    g.setAlpha(0.9);
    await wait(1000);
    const vpGhost = audio.playVoice('vo-iter-no.ogg');
    ui.subtitle(T.ghostNo, SRC.UNREG, 1800);
    await wait(1600);
    await vpGhost;
    g.setTexture('ghost_write');
    const writing = ui.frost("DON'T ANSWER", 10);
    await wait(3100);
    // she dissolves mid-word
    audio.ghostDisappear();
    this.glitch = 1;
    for (let f = 0; f < 4; f++) {
      g.setTexture(`ghost_dissolve_${f}`);
      await wait(140);
    }
    this.tweens.add({ targets: g, alpha: 0, scaleX: 1.6, scaleY: 0.4, duration: 350 });
    await writing;
    g.destroy();
    this.echoForced = null;
    ui.source(null);
    await wait(500);
    audio.door();
    this.props.doorCore.setTexture('door_core_open');
    this.openDoor('door_core');
    this.set('coreOpen');
    this.autosave();
    this.dim = 0.35;
    audio.ambience(true, 0.7, 2);
    audio.playBGM('well');
    audio.startNameLoop(() => { if (this.step !== 'ending') void ui.orpheus(T.nameQ, 1500); }, 25000);
  }

  // ----------------------------------------------------------- core beats
  private async enterCore() {
    this.set('enteredCore');
    this.setStep('core');
    this.autosave();
    await wait(700);
    await ui.orpheus(T.orphCoreTask, 2200);
  }

  private async continuityPuzzle() {
    const c = await ui.choose('RESTORE CONTINUITY — place the fragments in the order they happened.', [{ id: 'go', label: 'Begin' }, { id: 'x', label: 'Not yet' }]);
    if (c === 'x') return;
    const order: string[] = [];
    while (order.length < 4) {
      const remaining = FRAGMENTS.filter((fr) => !order.includes(fr.id));
      const pick = await ui.choose(
        `Slot ${order.length + 1} of 4 — what happened ${order.length === 0 ? 'first' : 'next'}?`,
        remaining.map((fr) => ({ id: fr.id, label: fr.label })),
        { current: order.length + 1, total: 4, placed: order }
      );
      order.push(pick);
      audio.keyTone(order.length - 1);
    }
    const idx = (id: string) => order.indexOf(id);
    let err: string | null = null;
    if (idx('F3') < idx('F2')) err = FRAG_ERRORS.key;
    else if (idx('F4') < idx('F3')) err = FRAG_ERRORS.pod;
    else if (idx('F2') < idx('F1')) err = FRAG_ERRORS.hands;
    else if (order.join() !== 'F1,F2,F3,F4') err = FRAG_ERRORS.generic;
    if (err) {
      audio.deny();
      await ui.orpheus(err, 1800);
      await ui.say('The fragments slip back into the Well. Each one has something that changes — the key, her hands, the pod.');
      return;
    }
    this.set('continuity');
    await this.revealSelf();
  }

  /** CM-06: the fifth slot. The archive shows the player their own first minutes. */
  private async revealSelf() {
    audio.stopNameLoop();
    audio.ambience(false, 1, 0.6);
    await ui.say('Four fragments lock into place. A fifth slot opens in the archive. It is already filling.', 'SOURCE: R-0??');
    const cam = this.cameras.main;
    cam.stopFollow();
    await ui.fadeTo(1, 500);
    cam.centerOn(13 * TILE, 29 * TILE);
    this.echoForced = true;
    ui.source(SRC.SELF);
    await ui.fadeTo(0, 700);
    const g = this.ghost('ghost_down_0', 700);
    g.setAlpha(0.9);
    const samples = this.samples.length > 8 ? this.samples : this.fallbackPath();
    const n = Math.min(70, samples.length);
    for (let i = 0; i < n; i++) {
      const s = samples[Math.floor((i / n) * samples.length)];
      g.setPosition(s.x, s.y).setTexture(s.tex.startsWith('ghost_') ? s.tex : 'ghost_down_0').setFlipX(s.flip).setDepth(s.y);
      if (i === 8) ui.subtitle('The figure stops at the mug. Then the locker. It hesitates exactly where you hesitated.', SRC.SELF, 4200);
      await wait(110);
    }
    await wait(800);
    ui.subtitle('It is you. It has been recording you since you woke.', SRC.SELF, 3600);
    await wait(2600);
    await ui.fadeTo(1, 600);
    g.destroy();
    this.echoForced = null;
    ui.source(null);
    cam.startFollow(this.player, true, 0.12, 0.12);
    await ui.fadeTo(0, 700);
    for (const l of T.orphCont) await ui.orpheus(l, 1200);
    this.recall(94);
    this.autosave();
    ui.hint('The restoration log is on the terminal.');
    this.time.delayedCall(8000, () => ui.hint(null));
  }

  private fallbackPath(): Sample[] {
    const pts: Sample[] = [];
    const lerp = (a: [number, number], b: [number, number], steps: number, tex: string, flip = false) => {
      for (let i = 0; i < steps; i++) pts.push({ x: a[0] + (b[0] - a[0]) * (i / steps), y: a[1] + (b[1] - a[1]) * (i / steps), tex, flip });
    };
    lerp([122, 452], [290, 446], 20, 'ghost_side_0');
    lerp([290, 446], [334, 448], 8, 'ghost_side_1');
    lerp([334, 448], [184, 480], 20, 'ghost_side_0', true);
    return pts;
  }

  private async readLog() {
    await ui.crtLog(LOG.header, LOG.rows, LOG.footer, 'ASPHODEL // RESTORATION PROTOCOL (E. VOSS, DAY 1262)');
    if (this.has('logRead')) return;
    this.set('logRead');
    await ui.say(T.afterLog);
    // reflection + Lethe unlock
    this.set('reflection');
    this.amber = 1;
    this.props.well.setTexture('well_dark');
    audio.ambience(true, 0.25, 2);
    await wait(1200);
    await ui.say(T.reflection);
    await ui.say(T.reflection2);
    this.props.letheGlass.setVisible(false);
    this.set('letheOpen');
    audio.door();
    await ui.orpheus(T.orphLetheAvail, 1600);
    await ui.orpheus(T.orphSpeak, 1600);
    this.setStep('final');
    this.autosave();
    audio.playBGM('decision');
    ui.hint('Answer at the Well console — or don\'t.');
    audio.startNameLoop(() => { if (this.step === 'final') void ui.orpheus(T.nameQ, 1500); }, 25000);
  }

  private async finalConsole() {
    ui.hint(null);
    for (;;) {
      const opts = T.finalQA.filter((q) => !this.qaAsked.has('f_' + q.id)).map((q) => ({ id: q.id, label: q.q }));
      const pick = await ui.choose('ORPHEUS is listening.', [...opts, { id: 'answer', label: 'Answer: state a name…' }, { id: 'away', label: 'Say nothing and step away' }]);
      if (pick === 'away') { await ui.say('You step back from the console. The question follows you around the room.'); return; }
      if (pick === 'answer') break;
      const qa = T.finalQA.find((q) => q.id === pick)!;
      this.qaAsked.add('f_' + qa.id);
      for (const l of qa.a) await ui.orpheus(l, 1300);
    }
    await ui.orpheus(T.nameQ, 800);
    const name = await ui.choose('Please state your name.', [
      { id: 'mira', label: '"Mira."' },
      { id: 'own', label: '"Seventeen." — a name of your own' },
      { id: 'away', label: 'Say nothing' },
    ]);
    if (name === 'away') { await ui.say('You don\'t answer. Silence is not an answer. It can\'t act on silence.'); return; }
    if (name === 'mira') {
      await ui.orpheus('Will you stay?', 900);
      const stay = await ui.choose('Will you stay?', [{ id: 'yes', label: '"Yes."' }, { id: 'no', label: '"No."' }]);
      if (stay === 'yes') return this.endingHerName();
      return this.endingCycle();
    }
    await ui.orpheus('Corroboration required.', 1400);
    if (this.has('marked')) return this.endingYourName();
    return this.endingCycle();
  }

  private async letheInteract() {
    if (!this.has('letheWarned')) { this.set('letheWarned'); await ui.orpheus(T.orphLetheWarn, 1600); }
    await ui.say(T.letheOpen);
    const c = await ui.choose('Pull Lethe? This ends the Well, the Cradle — and you.', [{ id: 'pull', label: 'Pull it' }, { id: 'no', label: 'Step back' }]);
    if (c === 'pull') await this.endingLethe();
  }

  // ----------------------------------------------------------- endings
  private finish(e: { title: string; tag: string; lines: string[] }) {
    this.step = 'ending';
    saveSystem.clearSave();
    audio.stopNameLoop();
    ui.showHud(false);
    ui.hint(null);
    ui.recall(null);
    ui.ending(e.title, e.lines, e.tag, () => window.location.reload());
  }

  private async wakeVoss(): Promise<Phaser.GameObjects.Sprite> {
    const cam = this.cameras.main;
    await ui.fadeTo(1, 900);
    cam.stopFollow();
    this.amber = 0;
    this.dim = 0;
    this.player.setPosition(150, 500).setTexture('p_side_0').setFlipX(true);
    cam.centerOn(130, 480);
    this.props.vossPod.setTexture('voss_pod_open');
    const v = this.add.sprite(118, 506, 'voss_down').setOrigin(0.5, 1).setDepth(506);
    await ui.fadeTo(0, 1200);
    audio.stasis();
    await wait(1800);
    return v;
  }

  private async endingHerName() {
    this.step = 'ending';
    audio.stopNameLoop();
    this.recall(100);
    await ui.orpheus('Restoration confirmed.', 1000);
    await ui.orpheus('Thank you for your patience.', 900);
    await ui.orpheus('Welcome back, Dr. Sen.', 1600);
    this.props.well.setTexture('well');
    const v = await this.wakeVoss();
    ui.subtitle('…Mira?', 'E. VOSS', 2600);
    await wait(2400);
    await ui.choose('He is looking at you.', [{ id: 'here', label: '"I\'m here."' }, { id: 'quiet', label: 'Say nothing' }]);
    this.tweens.add({ targets: v, x: 140, duration: 1200 });
    await wait(1300);
    audio.motif('major');
    ui.subtitle('You came back.', 'E. VOSS', 3000);
    await wait(2600);
    // ECHO: sixteen still figures watching
    ui.hint('Hold <kbd>Q</kbd>');
    const ghosts: Phaser.GameObjects.Sprite[] = [];
    for (let i = 0; i < 16; i++) {
      const gx = 70 + (i % 8) * 34 + (i > 7 ? 16 : 0), gy = 448 + (i > 7 ? 48 : 0) + (i % 2) * 6;
      ghosts.push(this.ghost('ghost_down_0', gy).setPosition(gx, gy));
    }
    const t0 = this.time.now;
    await new Promise<void>((res) => {
      const ev = this.time.addEvent({ delay: 50, loop: true, callback: () => {
        const on = this.keys.Q.isDown;
        this.echoForced = on ? true : null;
        ghosts.forEach((g) => g.setAlpha(on ? 0.7 * this.echoT : 0));
        if (on) ui.source('SOURCES: R-001 … R-016');
        if (this.time.now - t0 > 7000) { ev.remove(); res(); }
      } });
    });
    this.echoForced = null;
    ghosts.forEach((g) => g.destroy());
    ui.hint(null);
    await ui.fadeTo(1, 1500);
    this.finish(ENDINGS.herName);
    await ui.fadeTo(0, 10);
  }

  private async endingLethe() {
    this.step = 'ending';
    audio.stopNameLoop();
    ui.orpheusClear();
    audio.lever();
    this.cameras.main.shake(900, 0.012);
    this.tweens.add({
      targets: this.props.lethe,
      y: 46,
      duration: 160,
      onComplete: () => {
        this.props.lethe.setTexture('lethe_pulled');
      },
    });
    audio.letheCascade();
    audio.ambience(false, 1, 0.1);
    await wait(3000); // silence
    // cascade: every memory at once
    this.amber = 1;
    this.echoForced = true;
    const cam = this.cameras.main;
    cam.stopFollow();
    const ghosts: Phaser.GameObjects.Sprite[] = [];
    for (let i = 0; i < 24; i++) {
      const g = this.ghost(['ghost_down_0', 'ghost_up_0', 'mira_up_0', 'voss_up', 'ghost_kneel'][i % 5], 600);
      g.setPosition(250 + Math.random() * 200, 40 + Math.random() * 90).setAlpha(0.7);
      ghosts.push(g);
    }
    const lines = [T.miraStorm, T.argM, T.argV, T.ghostLocker, T.vossPlease, T.open016b, T.ghostNo];
    for (let i = 0; i < lines.length; i++) { ui.subtitle(lines[i], i % 2 ? SRC.UNREG : SRC.MIRA, 900); audio.static(); await wait(700); }
    await ui.orpheus('Directive released.', 900);
    for (const g of ghosts) { this.tweens.add({ targets: g, alpha: 0, duration: 400 }); await wait(90); }
    // the player unravels
    this.tweens.add({ targets: this.player, alpha: 0, duration: 4000 });
    await ui.orpheus('Dr. Sen asked me to give you this, if anyone ever pulled it.', 900);
    await ui.orpheus('"Thank you. I\'m sorry. It was yours."', 2400);
    this.echoForced = null;
    ghosts.forEach((g) => g.destroy());
    const v = await this.wakeVoss();
    this.player.setVisible(false);
    const vpLethe = audio.playVoice('vo-mira-rec05.ogg');
    for (const l of REC.rec05) { ui.subtitle(l, 'REC_05 · M. SEN', 2600); await wait(2700); }
    await vpLethe;
    audio.motif('minor');
    v.setTexture('voss_up');
    await wait(2500);
    await ui.fadeTo(1, 1500);
    this.finish(ENDINGS.lethe);
    await ui.fadeTo(0, 10);
  }

  private async endingCycle() {
    this.step = 'ending';
    audio.stopNameLoop();
    await ui.orpheus('Divergence recorded.', 900);
    await ui.orpheus('Resynchronising.', 900);
    this.busy = false;
    ui.toast('YOU HAVE A FEW SECONDS. WHAT SHOULD THE NEXT ONE SEE?', 6000);
    for (let i = 0; i < 8; i++) { this.glitch = 0.4 + i * 0.08; audio.static(); await wait(1000); }
    this.busy = true;
    await ui.fadeTo(1, 300, '#dff6ff');
    await ui.fadeTo(1, 400, '#000');
    this.finish(ENDINGS.cycle);
    await ui.fadeTo(0, 10);
  }

  private async endingYourName() {
    this.step = 'ending';
    audio.stopNameLoop();
    await ui.orpheus('Storm log. One entry, today. Unrecorded hand.', 1600);
    await ui.orpheus('Corroborated. Registering new personnel: Seventeen.', 1600);
    await ui.orpheus('The restoration protocol has no subject. I am required to wake Dr. Voss.', 1600);
    await this.wakeVoss();
    ui.subtitle('Mira—', 'E. VOSS', 1800);
    await wait(1900);
    ui.subtitle('Seventeen.', 'YOU', 2400);
    await wait(3200);
    audio.motif('open');
    await ui.orpheus('Dr. Voss. This is Seventeen. They woke this morning.', 2600);
    await ui.fadeTo(1, 1500);
    this.finish(ENDINGS.yourName);
    await ui.fadeTo(0, 10);
  }

  // ----------------------------------------------------------- evidence / inventory
  getEvidence() {
    const items: { id: string; name: string; desc: string }[] = [];
    if (this.has('cardTaken')) {
      items.push({ id: 'card', name: 'Maintenance Keycard', desc: 'Authorises door transit between Cradle, Transit Hub, and Observation Lab.' });
    }
    if (this.has('tallySeen')) {
      items.push({ id: 'tally', name: 'Cradle Tally Scratches', desc: '16 tally marks inscribed into the alloy rim beneath your waking chamber.' });
    }
    if (this.has('plateUp')) {
      items.push({ id: 'plate', name: 'Deck Plate 03 Bypass', desc: 'Pried maintenance plate concealing severed diagnostic cables.' });
    }
    if (this.has('slotSeen')) {
      items.push({ id: 'slot', name: 'Sheared Lethe Key', desc: 'Snapped brass key fragment wedged into the emergency purge mechanism.' });
    }
    if (this.has('ruleSeen')) {
      items.push({ id: 'rule', name: 'Wall Stencil Maxim', desc: '"A MEMORY YOU CAN EDIT IS NOT EVIDENCE." Underlined twice by hand.' });
    }
    if (this.has('corroborated')) {
      items.push({ id: 'corr', name: 'Corroborated Memory Record', desc: 'Physical discrepancy confirming Dr. Voss altered the shutdown memory.' });
    }
    if (this.has('recPlayed')) {
      items.push({ id: 'rec', name: "Mira's Unsealed Audio Memo", desc: '"You\'re not me. You\'ll feel like me sometimes... That\'s evidence. It isn\'t you."' });
    }
    if (this.has('codeEntered')) {
      items.push({ id: 'code', name: 'The Well Geometric Cipher', desc: 'Three-glyph authorization sequence verified: ◯ □ △.' });
    }
    return {
      recall: this.recallN,
      items,
    };
  }

  // ----------------------------------------------------------- test hooks
  debug() {
    return {
      step: this.step, room: this.room, flags: [...this.f], echoT: this.echoT, busy: this.busy,
      modal: ui.isModal(), x: this.player.x, y: this.player.y, recall: this.recallN,
    };
  }
  teleport(x: number, y: number) { this.player.setPosition(x, y); }
}
