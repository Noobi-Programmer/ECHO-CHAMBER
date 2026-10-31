// Reusable Cinematic Object Inspection Interface for ECHO//CHAMBER
import { audio } from '../audio';
import type { InspectConfig, InspectStateContent } from './types';
import { getIllustration } from '../illustrations';

const ADV_KEYS = new Set(['e', 'E', ' ', 'Enter']);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

export class InspectionModal {
  private wrap?: HTMLElement;
  private isEcho = false;
  private isMagnified = false;
  private currentConfig?: InspectConfig;
  private currentParaIndex = 0;
  private isTyping = false;
  private skipTyping = false;
  private onCloseCallback?: () => void;
  private keyListener?: (e: KeyboardEvent) => void;

  constructor(private root: HTMLElement) {}

  inspect(config: InspectConfig): Promise<void> {
    return new Promise((resolve) => {
      this.currentConfig = config;
      this.isEcho = Boolean(config.initialEcho && config.echo);
      this.isMagnified = false;
      this.currentParaIndex = 0;
      this.onCloseCallback = () => resolve();

      this.render();
      audio.blip();
    });
  }

  private render() {
    if (this.wrap) this.destroy();

    const config = this.currentConfig!;
    const state = this.isEcho && config.echo ? config.echo : config.present;

    this.wrap = el('div', 'inspect-modal-backdrop', this.root);
    const card = el('div', 'inspect-card panel', this.wrap); // includes .panel for automated test compatibility
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', config.title);

    // Header
    const header = el('div', 'inspect-header', card);
    const headerLeft = el('div', 'inspect-header-left', header);
    const cat = config.category ?? 'EQUIPMENT';
    const src = (this.isEcho && config.echo?.source) ? config.echo.source : (config.source ?? 'ASPHODEL // INTERNAL ARCHIVE');
    el('div', 'inspect-tag', headerLeft, `<span class="inspect-cat">${cat}</span> · <span class="inspect-src">${src}</span>`);
    el('div', 'inspect-title', headerLeft, config.title);

    const headerRight = el('div', 'inspect-header-right', header);

    // ECHO / PRESENT State Toggle (if ECHO state exists)
    if (config.echo) {
      const toggle = el('button', `inspect-state-toggle ${this.isEcho ? 'echo-mode' : 'present-mode'}`, headerRight);
      toggle.innerHTML = `<span class="toggle-pill">${this.isEcho ? '◈ ECHO MEMORY' : '▣ PRESENT STATE'}</span> <kbd>Q</kbd>`;
      toggle.title = 'Toggle between Present and ECHO Memory (Q)';
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleEchoState();
      });
    }

    // Close button
    const closeBtn = el('button', 'inspect-close-btn', headerRight, '✕');
    closeBtn.title = 'Close Inspection (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Main Body (Split View: Visual Area on Left, Narrative Details on Right)
    const body = el('div', 'inspect-body', card);

    // Viewport / Illustration Frame
    const illus = getIllustration(config.id);
    const echoTintClass = (!illus && this.isEcho) ? 'echo-tint' : '';
    const viewport = el('div', `inspect-viewport ${this.isMagnified ? 'magnified' : ''} ${echoTintClass}`, body);
    
    // Scanline & raster overlay
    el('div', 'inspect-viewport-overlay', viewport);

    // Visual Content or Clean Placeholder Slot
    this.renderVisualContent(viewport, state, config);
    // Viewport Controls (Magnify / Zoom / Macro Detail)
    if (config.canMagnify !== false) {
      const magLabel = illus?.detail ? (this.isMagnified ? '[-] 1× OVERVIEW' : '[+] MACRO DETAIL') : (this.isMagnified ? '[-] 1× VIEW' : '[+] 2× MAGNIFY');
      const magBtn = el('button', 'inspect-mag-btn', viewport, magLabel);
      magBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isMagnified = !this.isMagnified;
        viewport.classList.toggle('magnified', this.isMagnified);
        magBtn.textContent = illus?.detail ? (this.isMagnified ? '[-] 1× OVERVIEW' : '[+] MACRO DETAIL') : (this.isMagnified ? '[-] 1× VIEW' : '[+] 2× MAGNIFY');
        if (illus?.detail) {
          const img = viewport.querySelector('.inspect-illus-img.present') as HTMLImageElement;
          if (img) img.src = this.isMagnified ? illus.detail : illus.present;
        }
        audio.blip();
      });
    }

    // Info & Narrative Column
    const infoCol = el('div', 'inspect-info-col', body);

    if (state.badge) {
      el('div', 'inspect-badge', infoCol, state.badge);
    }

    // Description text box
    const textBox = el('div', 'inspect-text-box', infoCol);
    const paraEl = el('div', 'inspect-text panel-text', textBox); // .panel-text for tests
    
    // Pagination / Progress indicator
    const footer = el('div', 'inspect-footer', card);
    const pager = el('div', 'inspect-pager', footer);
    const controlsHelp = el('div', 'inspect-controls-hint', footer, `
      <span><kbd>E</kbd> / <kbd>Space</kbd> Continue</span>
      ${config.echo ? '<span><kbd>Q</kbd> Echo State</span>' : ''}
      <span><kbd>Esc</kbd> Close</span>
    `);

    // Type Paragraph
    this.typeCurrentParagraph(paraEl, state.description, pager);

    // Card or advance click
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on toggle or buttons
      if ((e.target as HTMLElement).closest('button')) return;
      this.advanceParagraph(paraEl, state.description, pager);
    });

    // Backdrop click to close
    this.wrap.addEventListener('click', (e) => {
      if (e.target === this.wrap) this.close();
    });

    // Global Key Listener for Modal
    this.keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.close();
        return;
      }
      if (e.key === 'q' || e.key === 'Q') {
        if (config.echo) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleEchoState();
          return;
        }
      }
      if (ADV_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        this.advanceParagraph(paraEl, state.description, pager);
      }
    };
    window.addEventListener('keydown', this.keyListener, true);
  }

  private renderVisualContent(viewport: HTMLElement, state: InspectStateContent, config: InspectConfig) {
    const stage = el('div', 'inspect-visual-stage', viewport);

    const illus = getIllustration(config.id);
    if (illus) {
      const container = el('div', 'inspect-illustration-container', stage);

      const presentSrc = (this.isMagnified && illus.detail) ? illus.detail : illus.present;
      const imgPresent = el('img', `inspect-illus-img present ${!this.isEcho ? 'active' : ''}`, container) as HTMLImageElement;
      imgPresent.src = presentSrc;
      imgPresent.alt = config.title;

      if (illus.echo) {
        const imgEcho = el('img', `inspect-illus-img echo ${this.isEcho ? 'active' : ''}`, container) as HTMLImageElement;
        imgEcho.src = illus.echo;
        imgEcho.alt = `${config.title} (ECHO)`;
      }

      if (illus.overlayText) {
        const overlay = el('div', 'inspect-wall-text', container);
        overlay.textContent = illus.overlayText;
      }
      return;
    }

    if (state.textureKey) {
      // If a texture key is provided and rendered onto canvas or existing preview
      const previewEl = el('div', 'inspect-texture-preview', stage);
      previewEl.setAttribute('data-texture', state.textureKey);

      // Render pixel visual placeholder with technical diagram
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 120;
      canvas.className = 'inspect-diagram-canvas';
      this.drawProceduralObject(canvas, config.id, this.isEcho);
      previewEl.appendChild(canvas);
    } else {
      // Clean Blueprint / Placeholder Slot for future ChatGPT asset
      const placeholder = el('div', 'inspect-asset-slot', stage);
      placeholder.innerHTML = `
        <div class="slot-blueprint">
          <div class="slot-grid"></div>
          <div class="slot-crosshair"></div>
          <div class="slot-spec">
            <span class="spec-id">OBJ_ID: ${config.id.toUpperCase()}</span>
            <span class="spec-state">STATE: ${this.isEcho ? 'RESONANCE_ECHO' : 'MATERIAL_CURRENT'}</span>
            <span class="spec-dim">RENDER TARGET: 256×192 2D PIXEL ART</span>
          </div>
          <div class="slot-icon">◈</div>
          <div class="slot-status">RENDER TARGET INTEGRATION POINT</div>
          <div class="slot-note">${state.placeholderNote ?? 'Art asset pipeline: ChatGPT illustration pending.'}</div>
        </div>
      `;
    }
  }

  private drawProceduralObject(canvas: HTMLCanvasElement, id: string, echo: boolean) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const w = canvas.width;
    const h = canvas.height;

    // Dark technical background
    ctx.fillStyle = echo ? '#04161c' : '#070b12';
    ctx.fillRect(0, 0, w, h);

    // Subtle technical grid
    ctx.strokeStyle = echo ? 'rgba(98, 214, 216, 0.12)' : 'rgba(201, 212, 227, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center focal point
    const cx = w / 2;
    const cy = h / 2;

    if (id === 'cradle') {
      // Medical stasis pod rendering
      ctx.fillStyle = echo ? '#00e5ff' : '#2a7f86';
      ctx.fillRect(cx - 48, cy - 20, 96, 40);
      ctx.fillStyle = echo ? '#cffcff' : '#0e1a26';
      ctx.fillRect(cx - 44, cy - 16, 88, 32);
      // Vitals line
      ctx.strokeStyle = echo ? '#e0a64a' : '#62d6d8';
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy);
      ctx.lineTo(cx - 20, cy);
      ctx.lineTo(cx - 15, cy - 10);
      ctx.lineTo(cx - 10, cy + 10);
      ctx.lineTo(cx - 5, cy);
      ctx.lineTo(cx + 40, cy);
      ctx.stroke();
      if (echo) {
        // Tally marks on rim
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 4; i++) {
          const gx = cx - 30 + i * 16;
          for (let j = 0; j < 4; j++) ctx.fillRect(gx + j * 3, cy + 18, 1, 6);
          ctx.fillRect(gx - 1, cy + 20, 11, 1);
        }
      }
    } else if (id === 'mug') {
      // Ceramic mug with glued handle
      ctx.fillStyle = echo ? '#e8f6f7' : '#92a0b3';
      ctx.fillRect(cx - 18, cy - 16, 36, 32);
      ctx.fillStyle = echo ? '#121f2d' : '#080d14';
      ctx.fillRect(cx - 14, cy - 14, 28, 6);
      // Handle
      ctx.strokeStyle = echo ? '#e8f6f7' : '#92a0b3';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx + 18, cy - 10, 10, 20);
      // Glued fracture seam
      if (!echo) {
        ctx.strokeStyle = '#e0a64a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 17, cy - 6); ctx.lineTo(cx + 26, cy - 4);
        ctx.moveTo(cx + 17, cy + 6); ctx.lineTo(cx + 26, cy + 8);
        ctx.stroke();
      } else {
        // Smiley face in grease pencil
        ctx.fillStyle = '#e0a64a';
        ctx.fillRect(cx - 8, cy - 2, 2, 2);
        ctx.fillRect(cx + 6, cy - 2, 2, 2);
        ctx.beginPath();
        ctx.arc(cx, cy + 4, 6, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.strokeStyle = '#e0a64a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (id === 'vossPod') {
      // Frosted stasis chamber
      ctx.fillStyle = '#162334';
      ctx.fillRect(cx - 48, cy - 24, 96, 48);
      ctx.fillStyle = 'rgba(160, 220, 240, 0.25)';
      ctx.fillRect(cx - 44, cy - 20, 88, 40);
      // Silhouette hand against glass
      ctx.fillStyle = 'rgba(216, 160, 134, 0.45)';
      ctx.fillRect(cx - 8, cy - 12, 16, 20);
      for (let f = 0; f < 4; f++) ctx.fillRect(cx - 7 + f * 4, cy - 18, 3, 7);
    } else if (id === 'photo') {
      // Photograph
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 28, cy - 36, 56, 72);
      ctx.fillStyle = '#121922';
      ctx.fillRect(cx - 24, cy - 32, 48, 52);
      if (!echo) {
        // Scratched woman face
        ctx.fillStyle = '#d8a086';
        ctx.fillRect(cx - 16, cy - 20, 14, 16);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 22); ctx.lineTo(cx + 2, cy - 2);
        ctx.moveTo(cx - 18, cy - 2); ctx.lineTo(cx + 2, cy - 22);
        ctx.stroke();
        // Voss beside her
        ctx.fillStyle = '#9c6f5d';
        ctx.fillRect(cx + 4, cy - 22, 16, 18);
      } else {
        // Restored photograph face
        ctx.fillStyle = '#d8a086';
        ctx.fillRect(cx - 16, cy - 20, 14, 16);
        ctx.fillStyle = '#1b1820'; // hair
        ctx.fillRect(cx - 18, cy - 24, 18, 6);
        ctx.fillStyle = '#9c6f5d';
        ctx.fillRect(cx + 4, cy - 22, 16, 18);
      }
    } else {
      // Generic technical schematic
      ctx.strokeStyle = echo ? '#62d6d8' : '#e0a64a';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 30, cy - 24, 60, 48);
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 24); ctx.lineTo(cx + 30, cy + 24);
      ctx.moveTo(cx + 30, cy - 24); ctx.lineTo(cx - 30, cy + 24);
      ctx.stroke();
    }
  }

  private toggleEchoState() {
    if (!this.currentConfig?.echo) return;
    this.isEcho = !this.isEcho;
    this.currentParaIndex = 0;
    audio.motif('first');
    this.currentConfig.onStateChange?.(this.isEcho);
    this.render();
  }

  private async typeCurrentParagraph(paraEl: HTMLElement, paragraphs: string[], pager: HTMLElement) {
    if (!paragraphs.length) return;
    const text = paragraphs[this.currentParaIndex] || '';
    pager.textContent = `ENTRY ${this.currentParaIndex + 1} OF ${paragraphs.length}`;
    
    this.isTyping = true;
    this.skipTyping = false;
    paraEl.textContent = '';

    for (let i = 0; i < text.length; i++) {
      if (this.skipTyping) {
        paraEl.textContent = text;
        break;
      }
      paraEl.textContent = text.slice(0, i + 1);
      if (i % 3 === 0 && text[i] !== ' ') audio.type();
      await new Promise((r) => setTimeout(r, text[i] === '.' || text[i] === '…' ? 90 : 18));
    }
    this.isTyping = false;
  }

  private advanceParagraph(paraEl: HTMLElement, paragraphs: string[], pager: HTMLElement) {
    if (this.isTyping) {
      this.skipTyping = true;
      return;
    }

    if (this.currentParaIndex < paragraphs.length - 1) {
      this.currentParaIndex++;
      audio.blip();
      this.typeCurrentParagraph(paraEl, paragraphs, pager);
    } else {
      this.close();
    }
  }

  close() {
    audio.blip();
    this.destroy();
    this.onCloseCallback?.();
  }

  private destroy() {
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
