// Original synthesised audio (WebAudio). No sample files.
// Sound only enhances: every essential beat is also communicated in text.

type RoomTone = 'cradle' | 'lab' | 'core';

class AudioDirector {
  ctx: AudioContext | null = null;
  master!: GainNode;
  ambBus!: GainNode;
  ambFilter!: BiquadFilterNode;
  sfxBus!: GainNode;
  delay!: DelayNode;
  muted = false;
  private oscA?: OscillatorNode;
  private oscB?: OscillatorNode;
  private nameLoopTimer = 0;

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
  }

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
  }

  breath() { this.noise(1.6, 700, 0.6, 0.12, 'bandpass'); }

  startNameLoop(cb: () => void, ms = 25000) {
    this.stopNameLoop();
    this.nameLoopTimer = window.setInterval(cb, ms);
  }
  stopNameLoop() { if (this.nameLoopTimer) window.clearInterval(this.nameLoopTimer); this.nameLoopTimer = 0; }
}

export const audio = new AudioDirector();
