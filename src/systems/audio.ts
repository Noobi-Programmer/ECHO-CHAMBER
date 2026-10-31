// ECHO//CHAMBER Audio System
// Supports both high-fidelity sample playback (/assets/audio/*.ogg)
// and procedural WebAudio synthesis fallbacks.
// Sound only enhances: every essential beat is also communicated in text.

type RoomTone = 'cradle' | 'lab' | 'core';
export type BgmTrack =
  | 'title'
  | 'station'
  | 'echo'
  | 'tension'
  | 'well'
  | 'reveal'
  | 'decision'
  | 'hername'
  | 'lethe'
  | 'cycle'
  | 'yourname'
  | 'credits';

class AudioDirector {
  ctx: AudioContext | null = null;
  master!: GainNode;
  ambBus!: GainNode;
  ambFilter!: BiquadFilterNode;
  sfxBus!: GainNode;
  bgmBus!: GainNode;
  voiceBus!: GainNode;
  delay!: DelayNode;
  muted = false;

  private oscA?: OscillatorNode;
  private oscB?: OscillatorNode;
  private nameLoopTimer = 0;

  // Sample playback cache & state
  private buffers = new Map<string, AudioBuffer>();
  private activeBgm?: { source: AudioBufferSourceNode; gain: GainNode; track: BgmTrack };
  private activeVoice?: { source: AudioBufferSourceNode; gain: GainNode };
  private activeLoops = new Map<string, { source: AudioBufferSourceNode; gain: GainNode }>();

  start() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(ctx.destination);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.6;
    this.sfxBus.connect(this.master);

    this.bgmBus = ctx.createGain();
    this.bgmBus.gain.value = 0.45;
    this.bgmBus.connect(this.master);

    this.voiceBus = ctx.createGain();
    this.voiceBus.gain.value = 1.0;
    this.voiceBus.connect(this.master);

    // simple echo send for motif/voice-ish cues
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = 0.32;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    this.delay.connect(fb); fb.connect(this.delay); this.delay.connect(wet); wet.connect(this.master);

    // ambience: low hum + filtered noise air
    this.ambFilter = ctx.createBiquadFilter();
    this.ambFilter.type = 'lowpass';
    this.ambFilter.frequency.value = 320;
    this.ambBus = ctx.createGain();
    this.ambBus.gain.value = 0;
    this.ambFilter.connect(this.ambBus);
    this.ambBus.connect(this.master);

    const a = ctx.createOscillator(); a.type = 'sawtooth'; a.frequency.value = 55;
    const b = ctx.createOscillator(); b.type = 'sine'; b.frequency.value = 82.4;
    const ga = ctx.createGain(); ga.gain.value = 0.05;
    const gb = ctx.createGain(); gb.gain.value = 0.08;
    a.connect(ga); b.connect(gb); ga.connect(this.ambFilter); gb.connect(this.ambFilter);
    a.start(); b.start();
    this.oscA = a; this.oscB = b;

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(4, true);
    noise.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 400; nf.Q.value = 0.6;
    const ng = ctx.createGain(); ng.gain.value = 0.25;
    noise.connect(nf); nf.connect(ng); ng.connect(this.ambFilter);
    noise.start();

    // slow wobble
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lg = ctx.createGain(); lg.gain.value = 60;
    lfo.connect(lg); lg.connect(this.ambFilter.frequency); lfo.start();

    // Preload all manifest sample assets asynchronously
    this.preloadAll();
  }

  // --- Sample Asset Loading & Playback ---

  private async loadSample(filename: string): Promise<AudioBuffer | null> {
    if (!this.ctx) this.start();
    if (!this.ctx) return null;
    if (this.buffers.has(filename)) return this.buffers.get(filename)!;

    const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    const paths = [
      `${cleanBase}assets/audio/${filename}`,
      `/assets/audio/${filename}`,
      `assets/audio/${filename}`,
      `${cleanBase}assets/audio/voice-overs/${filename}`,
      `/assets/audio/voice-overs/${filename}`,
      `assets/audio/voice-overs/${filename}`,
      `${cleanBase}public/assets/audio/${filename}`,
      `/public/assets/audio/${filename}`,
      `public/assets/audio/${filename}`,
      `${cleanBase}assets/audio/sound-effects/${filename}`,
      `/assets/audio/sound-effects/${filename}`,
      `assets/audio/sound-effects/${filename}`,
    ];

    for (const p of paths) {
      try {
        const resp = await fetch(p);
        if (resp.ok) {
          const ab = await resp.arrayBuffer();
          const buf = await this.ctx.decodeAudioData(ab);
          this.buffers.set(filename, buf);
          return buf;
        }
      } catch {
        // try next path
      }
    }
    console.warn(`[Audio] Asset missing from assets/audio: ${filename}`);
    return null;
  }

  private preloadAll() {
    const files = [
      'sfx-footstep-metal.ogg',
      'sfx-card-pickup.ogg',
      'sfx-door-locked.ogg',
      'sfx-locker-open.ogg',
      'sfx-contested-tick.ogg',
      'sfx-memory-reveal.ogg',
      'sfx-ghost-appear.ogg',
      'sfx-ghost-disappear.ogg',
      'sfx-echo-overload.ogg',
      'sfx-puzzle-solved.ogg',
      'sfx-tender-skitter.ogg',
      'sfx-pod-pump.ogg',
      'sfx-pause-resume.ogg',
      'sfx-terminal-boot.ogg',
      'amb-storm-window-01.ogg',
      'amb-vent-01.ogg',
      'amb-relay-random-01.ogg',
      'amb-sixteen-breaths-01.ogg',
      'amb-hull-creak-01.ogg',
      'cine-lethe-cascade-01.ogg',
      'cine-door-dim-01.ogg',
      'cine-ending-transition-01.ogg',
      'bgm-title-01.ogg',
      'bgm-station-01.ogg',
      'bgm-echo-01.ogg',
      'bgm-tension-01.ogg',
      'bgm-well-01.ogg',
      'bgm-reveal-01.ogg',
      'bgm-decision-01.ogg',
      'bgm-end-hername-01.ogg',
      'bgm-end-lethe-01.ogg',
      'bgm-end-cycle-01.ogg',
      'bgm-end-yourname-01.ogg',
      'bgm-credits-01.ogg',
      'vo-mira-rec03.ogg',
      'vo-voss-rec04.ogg',
      'vo-voss-rec01.ogg',
      'vo-mira-rec05.ogg',
      'vo-iter-open-01.ogg',
      'vo-iter-locker.ogg',
      'vo-iter-no.ogg',
    ];
    for (const f of files) {
      void this.loadSample(f);
    }
  }

  playVoice(filename: string, vol = 1.0): Promise<void> {
    if (!this.ctx) this.start();
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    this.stopVoice();
    if (!this.ctx || this.muted) return Promise.resolve();

    const playBuf = (buf: AudioBuffer): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (!this.ctx) { resolve(); return; }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const g = this.ctx.createGain();
        g.gain.value = vol;
        src.connect(g);
        g.connect(this.voiceBus);
        this.activeVoice = { source: src, gain: g };
        src.onended = () => {
          if (this.activeVoice?.source === src) {
            this.activeVoice = undefined;
          }
          resolve();
        };
        try {
          src.start();
        } catch {
          resolve();
        }
      });
    };

    const cached = this.buffers.get(filename);
    if (cached) {
      return playBuf(cached);
    }

    return this.loadSample(filename).then((loaded) => {
      if (!loaded) return;
      return playBuf(loaded);
    });
  }

  stopVoice() {
    if (this.activeVoice) {
      try {
        this.activeVoice.source.stop();
        this.activeVoice.source.disconnect();
      } catch {
        // ignore
      }
      this.activeVoice = undefined;
    }
  }

  private playSample(filename: string, bus: GainNode = this.sfxBus, loop = false, vol = 1): AudioBufferSourceNode | null {
    if (!this.ctx || this.muted) return null;
    const buf = this.buffers.get(filename);
    if (!buf) {
      // Lazy load if not yet fetched
      void this.loadSample(filename);
      return null;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = loop;
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.connect(g);
    g.connect(bus);
    src.start();
    return src;
  }

  // --- BGM Playback ---

  playBGM(track: BgmTrack, loop = true, fade = 1.2) {
    if (!this.ctx) return;
    if (this.activeBgm && this.activeBgm.track === track) return;
    this.stopBGM(fade);

    const trackMap: Record<BgmTrack, string> = {
      title: 'bgm-title-01.ogg',
      station: 'bgm-station-01.ogg',
      echo: 'bgm-echo-01.ogg',
      tension: 'bgm-tension-01.ogg',
      well: 'bgm-well-01.ogg',
      reveal: 'bgm-reveal-01.ogg',
      decision: 'bgm-decision-01.ogg',
      hername: 'bgm-end-hername-01.ogg',
      lethe: 'bgm-end-lethe-01.ogg',
      cycle: 'bgm-end-cycle-01.ogg',
      yourname: 'bgm-end-yourname-01.ogg',
      credits: 'bgm-credits-01.ogg',
    };

    const file = trackMap[track];
    const buf = this.buffers.get(file);
    if (!buf) {
      void this.loadSample(file);
      return;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = loop;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, this.now());
    g.gain.exponentialRampToValueAtTime(0.45, this.now() + Math.max(0.1, fade));
    src.connect(g);
    g.connect(this.bgmBus);
    src.start();
    this.activeBgm = { source: src, gain: g, track };
  }

  stopBGM(fade = 0.8) {
    if (!this.ctx || !this.activeBgm) return;
    const { source, gain } = this.activeBgm;
    try {
      gain.gain.cancelScheduledValues(this.now());
      gain.gain.setValueAtTime(gain.gain.value, this.now());
      gain.gain.exponentialRampToValueAtTime(0.0001, this.now() + fade);
      source.stop(this.now() + fade + 0.05);
    } catch {
      // ignore already stopped source
    }
    this.activeBgm = undefined;
  }

  // --- Core Utility & Procedural Generators ---

  private noiseBuffer(seconds: number, brown = false) {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return buf;
  }

  private now() { return this.ctx ? this.ctx.currentTime : 0; }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.now(), 0.05);
  }

  ambience(on: boolean, level = 1, fade = 1.5) {
    if (!this.ctx) return;
    this.ambBus.gain.cancelScheduledValues(this.now());
    this.ambBus.gain.setTargetAtTime(on ? 0.9 * level : 0, this.now(), fade / 3);
  }

  room(tone: RoomTone) {
    if (!this.ctx || !this.oscA || !this.oscB) return;
    const f = { cradle: [49, 73.4], lab: [55, 82.4], core: [41.2, 61.7] }[tone];
    this.oscA.frequency.setTargetAtTime(f[0], this.now(), 1);
    this.oscB.frequency.setTargetAtTime(f[1], this.now(), 1);
  }

  /** ECHO mix: 0 = present, 1 = memory (muffled, distant). */
  echoMix(t: number) {
    if (!this.ctx) return;
    this.ambFilter.frequency.setTargetAtTime(320 - 200 * t, this.now(), 0.05);
  }

  private tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.2, when = 0, send = false, glideTo?: number) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t0 = this.now() + when;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.sfxBus);
    if (send) g.connect(this.delay);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  private noise(dur: number, freq: number, q = 1, vol = 0.3, type: BiquadFilterType = 'bandpass', when = 0) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t0 = this.now() + when;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(Math.max(0.1, dur));
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxBus);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }

  // --- Sound Effects & Cinematic Cues (Sample with Procedural Fallback) ---

  footstep() {
    if (!this.playSample('sfx-footstep-metal.ogg', this.sfxBus, false, 0.35)) {
      this.noise(0.04, 800, 2, 0.08, 'lowpass');
    }
  }

  cardPickup() {
    if (!this.playSample('sfx-card-pickup.ogg', this.sfxBus, false, 0.5)) {
      this.confirm();
    }
  }

  doorLocked() {
    if (!this.playSample('sfx-door-locked.ogg', this.sfxBus, false, 0.6)) {
      this.deny();
    }
  }

  lockerOpen() {
    if (!this.playSample('sfx-locker-open.ogg', this.sfxBus, false, 0.6)) {
      this.door();
    }
  }

  contestedTick() {
    if (!this.playSample('sfx-contested-tick.ogg', this.sfxBus, false, 0.4)) {
      this.type();
    }
  }

  memoryReveal() {
    if (!this.playSample('sfx-memory-reveal.ogg', this.sfxBus, false, 0.5)) {
      this.blip();
    }
  }

  ghostAppear() {
    if (!this.playSample('sfx-ghost-appear.ogg', this.sfxBus, false, 0.5)) {
      this.static();
    }
  }

  ghostDisappear() {
    if (!this.playSample('sfx-ghost-disappear.ogg', this.sfxBus, false, 0.5)) {
      this.static();
    }
  }

  echoOverload() {
    if (!this.playSample('sfx-echo-overload.ogg', this.sfxBus, false, 0.5)) {
      this.echoDenied();
    }
  }

  puzzleSolved() {
    if (!this.playSample('sfx-puzzle-solved.ogg', this.sfxBus, false, 0.6)) {
      this.confirm();
    }
  }

  tenderSkitter() {
    if (!this.playSample('sfx-tender-skitter.ogg', this.sfxBus, false, 0.4)) {
      this.relay();
    }
  }

  pauseResume() {
    if (!this.playSample('sfx-pause-resume.ogg', this.sfxBus, false, 0.5)) {
      this.blip();
    }
  }

  terminalBoot() {
    if (!this.playSample('sfx-terminal-boot.ogg', this.sfxBus, false, 0.5)) {
      this.relay();
    }
  }

  hullCreak() {
    this.playSample('amb-hull-creak-01.ogg', this.ambBus, false, 0.35);
  }

  relayRandom() {
    if (!this.playSample('amb-relay-random-01.ogg', this.ambBus, false, 0.3)) {
      this.relay();
    }
  }

  doorDim() {
    this.playSample('cine-door-dim-01.ogg', this.sfxBus, false, 0.5);
  }

  letheCascade() {
    this.playSample('cine-lethe-cascade-01.ogg', this.sfxBus, false, 0.6);
  }

  endingTransition() {
    this.playSample('cine-ending-transition-01.ogg', this.sfxBus, false, 0.6);
  }

  echoOn() { this.tone(180, 0.5, 'sine', 0.18, 0, true, 720); this.noise(0.25, 3000, 0.8, 0.08); }
  echoOff() { this.tone(600, 0.25, 'sine', 0.1, 0, false, 160); }
  echoDenied() { this.tone(140, 0.15, 'square', 0.05); }
  blip() { this.tone(880, 0.07, 'triangle', 0.08); }
  confirm() { this.tone(660, 0.1, 'triangle', 0.1); this.tone(990, 0.16, 'triangle', 0.08, 0.08); }
  deny() { this.tone(180, 0.18, 'square', 0.06); this.tone(150, 0.2, 'square', 0.05, 0.1); }
  relay() { this.noise(0.04, 2500, 2, 0.4, 'highpass'); }
  snap() { this.noise(0.06, 4000, 3, 0.6, 'highpass'); this.tone(2400, 0.04, 'square', 0.05); }
  door() { this.noise(0.9, 600, 0.7, 0.25, 'lowpass'); this.tone(90, 0.8, 'sine', 0.12, 0, false, 60); }
  plate() { this.noise(0.35, 1400, 3, 0.2); this.tone(320, 0.2, 'triangle', 0.04, 0, false, 260); }
  static() { this.noise(0.35, 5000, 0.5, 0.18, 'highpass'); }
  orpheus() { this.tone(523.25, 0.18, 'sine', 0.07, 0, true); this.tone(784, 0.25, 'sine', 0.05, 0.12, true); }
  frost() { this.noise(0.25, 2600, 6, 0.08); }
  stasis() { this.noise(1.6, 900, 0.5, 0.3, 'lowpass'); this.noise(0.5, 6000, 1, 0.1, 'highpass', 0.6); }
  lever() { this.noise(0.12, 300, 1, 0.6, 'lowpass'); this.tone(70, 0.6, 'square', 0.12); }
  type() { this.tone(1800 + Math.random() * 200, 0.02, 'square', 0.015); }
  keyTone(i: number) { this.tone([523.25, 659.25, 587.33, 783.99][i] ?? 440, 0.25, 'triangle', 0.12, 0, true); }

  /** The four-note storm motif. mode: first / major / minor / open */
  motif(mode: 'first' | 'major' | 'minor' | 'open' = 'first') {
    const sets = {
      first: [220, 261.63, 329.63, 293.66],
      major: [220, 277.18, 329.63, 440],
      minor: [220, 261.63, 329.63, 246.94],
      open: [220, 293.66, 329.63, 392],
    };
    sets[mode].forEach((f, i) => this.tone(f, 1.4, 'triangle', 0.11, i * 0.55, true));

    // Also trigger corresponding ending music track
    if (mode === 'major') this.playBGM('hername', false, 2.0);
    else if (mode === 'minor') this.playBGM('lethe', false, 2.0);
    else if (mode === 'open') this.playBGM('yourname', false, 2.0);
  }

  breath() { this.noise(1.6, 700, 0.6, 0.12, 'bandpass'); }

  startNameLoop(cb: () => void, ms = 25000) {
    this.stopNameLoop();
    this.nameLoopTimer = window.setInterval(cb, ms);
  }
  stopNameLoop() { if (this.nameLoopTimer) window.clearInterval(this.nameLoopTimer); this.nameLoopTimer = 0; }
}

export const audio = new AudioDirector();
