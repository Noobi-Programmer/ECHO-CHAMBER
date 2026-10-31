// Reusable Audio Recorder Interface for ECHO//CHAMBER
import { audio } from '../audio';
import type { RecorderTrack } from './types';

const ADV_KEYS = new Set(['e', 'E', ' ', 'Enter']);

const VOICE_MAP: Record<string, string> = {
  REC_01: 'vo-voss-rec01.ogg',
  REC_03: 'vo-mira-rec03.ogg',
  REC_04: 'vo-voss-rec04.ogg',
  REC_05: 'vo-mira-rec05.ogg',
};

const VOICE_DURATIONS: Record<string, number> = {
  REC_01: 31000,
  REC_03: 57000,
  REC_04: 46000,
  REC_05: 15000,
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

export class AudioRecorderModal {
  private wrap?: HTMLElement;
  private keyListener?: (e: KeyboardEvent) => void;
  private animFrame = 0;
  private isPlaying = false;
  private currentLineIndex = 0;
  private lineTimer = 0;
  private waveformCanvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D | null;
  private audioAmplitudes: number[] = new Array(32).fill(0.08);

  constructor(private root: HTMLElement) {}

  open(track: RecorderTrack): Promise<void> {
    return new Promise((resolve) => {
      this.buildRecorderUI(track, () => {
        this.destroy();
        resolve();
      });
    });
  }

  private buildRecorderUI(track: RecorderTrack, onClose: () => void) {
    if (this.wrap) this.destroy();

    this.wrap = el('div', 'recorder-modal-backdrop', this.root);
    const deck = el('div', 'recorder-deck panel', this.wrap); // includes .panel for automated test compatibility
    deck.setAttribute('role', 'dialog');
    deck.setAttribute('aria-label', `Voice Recorder: ${track.tag}`);

    // Hardware chassis details (screws, top grill)
    el('div', 'recorder-chassis-top', deck, `
      <div class="deck-screw tl">✕</div>
      <div class="deck-mic-grille">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="deck-screw tr">✕</div>
    `);

    // Recorder Display Header
    const head = el('div', 'recorder-header', deck);
    const headLeft = el('div', 'recorder-head-left', head);
    el('div', 'recorder-tag', headLeft, `AUDIO LOG // SOLID-STATE REEL`);
    el('div', 'recorder-title', headLeft, track.tag);

    const headRight = el('div', 'recorder-head-right', head);
    const statusLed = el('div', `recorder-led ${track.sealed ? 'led-sealed' : 'led-ready'}`, headRight);
    statusLed.title = track.sealed ? 'SECURITY SEAL ACTIVE' : 'REEL READY';
    
    const closeBtn = el('button', 'recorder-close-btn', headRight, '✕');
    closeBtn.title = 'Stop and Close (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.stopPlayback();
      onClose();
    });

    // Sealed Warning State (if recording is sealed by ORPHEUS)
    if (track.sealed) {
      const sealedBox = el('div', 'recorder-sealed-box', deck);
      sealedBox.innerHTML = `
        <div class="sealed-lock-icon">🔒</div>
        <div class="sealed-badge">SEALED // ORPHEUS SECURITY DIRECTIVE</div>
        <div class="sealed-msg">${track.sealedMessage ?? 'This recording is sealed by Dr. Voss\'s instruction pending corroboration.'}</div>
        <div class="sealed-help"><kbd>Esc</kbd> / <kbd>E</kbd> Return</div>
      `;
      this.keyListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || ADV_KEYS.has(e.key)) {
          e.preventDefault();
          this.stopPlayback();
          onClose();
        }
      };
      window.addEventListener('keydown', this.keyListener, true);
      deck.addEventListener('click', () => {
        this.stopPlayback();
        onClose();
      });
      return;
    }

    // Waveform Oscilloscope Display
    const waveBox = el('div', 'recorder-waveform-box', deck);
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 64;
    canvas.className = 'recorder-waveform-canvas';
    waveBox.appendChild(canvas);
    this.waveformCanvas = canvas;
    this.canvasCtx = canvas.getContext('2d');
    this.startWaveformAnimation();

    // Progress bar & Time counter
    const progressRow = el('div', 'recorder-progress-row', deck);
    const timeDisplay = el('div', 'recorder-time', progressRow, '00:00 / 00:45');
    const progressBar = el('div', 'recorder-progress-bar', progressRow);
    const progressFill = el('div', 'recorder-progress-fill', progressBar);

    // Transcript Container
    const transcriptBox = el('div', 'recorder-transcript-box', deck);
    const transcriptText = el('div', 'recorder-transcript-text panel-text', transcriptBox); // .panel-text for tests

    // Controls Row (Play/Pause, Prev, Next)
    const controlsRow = el('div', 'recorder-controls-row', deck);
    const playBtn = el('button', 'deck-btn play-btn', controlsRow, '▶ PLAY');
    const stepBtn = el('button', 'deck-btn step-btn', controlsRow, 'NEXT LINE ▸');
    const closeDeckBtn = el('button', 'deck-btn close-deck-btn', controlsRow, 'CLOSE (ESC)');

    // Playback logic
    this.isPlaying = true;
    this.currentLineIndex = 0;
    playBtn.textContent = '❚❚ PAUSE';

    const voiceFile = VOICE_MAP[track.id];
    if (voiceFile) {
      void audio.playVoice(voiceFile);
    }

    const totalMs = VOICE_DURATIONS[track.id] || (track.lines.length * 6000);
    const lineDuration = Math.max(3000, Math.floor(totalMs / Math.max(1, track.lines.length)));

    const renderCurrentLine = () => {
      const line = track.lines[this.currentLineIndex] || '';
      transcriptText.textContent = line;
      
      const pct = ((this.currentLineIndex + 1) / track.lines.length) * 100;
      progressFill.style.width = `${pct}%`;
      const totSec = Math.floor(totalMs / 1000);
      const curSec = Math.min(totSec, Math.floor(((this.currentLineIndex + 1) / track.lines.length) * totSec));
      timeDisplay.textContent = `00:${curSec.toString().padStart(2, '0')} / 00:${totSec.toString().padStart(2, '0')}`;
      
      audio.type();
    };

    renderCurrentLine();

    // Auto-advance voice lines while playing
    const scheduleNextLine = () => {
      clearTimeout(this.lineTimer);
      if (!this.isPlaying) return;

      this.lineTimer = window.setTimeout(() => {
        if (this.currentLineIndex < track.lines.length - 1) {
          this.currentLineIndex++;
          renderCurrentLine();
          scheduleNextLine();
        } else {
          this.isPlaying = false;
          playBtn.textContent = '▶ REPLAY';
        }
      }, lineDuration);
    };

    scheduleNextLine();

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isPlaying = !this.isPlaying;
      playBtn.textContent = this.isPlaying ? '❚❚ PAUSE' : '▶ RESUME';
      audio.blip();
      if (this.isPlaying) {
        if (voiceFile) void audio.playVoice(voiceFile);
        if (this.currentLineIndex >= track.lines.length - 1) {
          this.currentLineIndex = 0;
          renderCurrentLine();
        }
        scheduleNextLine();
      } else {
        clearTimeout(this.lineTimer);
        audio.stopVoice();
      }
    });

    stepBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.blip();
      if (this.currentLineIndex < track.lines.length - 1) {
        this.currentLineIndex++;
        renderCurrentLine();
        scheduleNextLine();
      } else {
        this.stopPlayback();
        onClose();
      }
    });

    closeDeckBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.stopPlayback();
      onClose();
    });

    // Advance on card click (compatible with test drain())
    deck.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      if (this.currentLineIndex < track.lines.length - 1) {
        this.currentLineIndex++;
        renderCurrentLine();
        scheduleNextLine();
      } else {
        this.stopPlayback();
        onClose();
      }
    });

    this.keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.stopPlayback();
        onClose();
        return;
      }
      if (ADV_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (this.currentLineIndex < track.lines.length - 1) {
          this.currentLineIndex++;
          renderCurrentLine();
          scheduleNextLine();
        } else {
          this.stopPlayback();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', this.keyListener, true);
  }

  private startWaveformAnimation() {
    const draw = () => {
      if (!this.waveformCanvas || !this.canvasCtx) return;
      const ctx = this.canvasCtx;
      const w = this.waveformCanvas.width;
      const h = this.waveformCanvas.height;

      ctx.clearRect(0, 0, w, h);

      // Dark oscilloscope screen background
      ctx.fillStyle = '#060a10';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(98, 214, 216, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Dynamic amplitude bars
      const numBars = this.audioAmplitudes.length;
      const barWidth = (w - (numBars - 1) * 2) / numBars;

      for (let i = 0; i < numBars; i++) {
        if (this.isPlaying) {
          // React to line playback with randomized rhythmic frequencies
          const target = 0.15 + Math.random() * 0.75 * Math.sin((i / numBars) * Math.PI);
          this.audioAmplitudes[i] += (target - this.audioAmplitudes[i]) * 0.35;
        } else {
          // Idle low amplitude hum
          this.audioAmplitudes[i] += (0.05 - this.audioAmplitudes[i]) * 0.1;
        }

        const barHeight = Math.max(3, this.audioAmplitudes[i] * h);
        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = this.isPlaying ? '#62d6d8' : '#304758';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      this.animFrame = requestAnimationFrame(draw);
    };

    this.animFrame = requestAnimationFrame(draw);
  }

  private stopPlayback() {
    clearTimeout(this.lineTimer);
    cancelAnimationFrame(this.animFrame);
    this.isPlaying = false;
    audio.stopVoice();
  }

  private destroy() {
    this.stopPlayback();
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener, true);
      this.keyListener = undefined;
    }
    if (this.wrap) {
      this.wrap.remove();
      this.wrap = undefined;
    }
  }
}
