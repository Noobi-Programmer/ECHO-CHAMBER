// DOM overlay UI: crisp text over the pixel canvas. Presentation only — no story logic.
import { audio } from './audio';
import { saveSystem } from './save';
import { InspectionModal } from './interactions/InspectionModal';
import { CrtTerminal } from './interactions/CrtTerminal';
import { EvidenceComparison } from './interactions/EvidenceComparison';
import { AudioRecorderModal } from './interactions/AudioRecorderModal';
import { PuzzleKeypad } from './interactions/PuzzleKeypad';
import type { InspectConfig, CrtConfig, RecorderTrack, ContestedMemoryConfig } from './interactions/types';

const ADV_KEYS = new Set(['e', 'E', ' ', 'Enter']);
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

export interface ChoiceOption { id: string; label: string; hint?: string }
export interface EvidenceItem { id: string; name: string; desc: string }
export interface EvidenceData { recall: number; items: EvidenceItem[] }
export type { InspectConfig, CrtConfig, RecorderTrack, ContestedMemoryConfig };

class UI {
  root!: HTMLElement;
  private orphEl!: HTMLElement;
  private orphText!: HTMLElement;
  private panel!: HTMLElement;
  private panelText!: HTMLElement;
  private panelTag!: HTMLElement;
  private promptEl!: HTMLElement;
  private hud!: HTMLElement;
  private meterFill!: HTMLElement;
  private hudLabel!: HTMLElement;
  private sourceEl!: HTMLElement;
  private subEl!: HTMLElement;
  private fadeEl!: HTMLElement;
  private choiceEl!: HTMLElement;
  private toastEl!: HTMLElement;
  private hintEl!: HTMLElement;
  private recallEl!: HTMLElement;
  private helpBtn!: HTMLElement;
  private shortcutsEl!: HTMLElement;
  private inventoryEl!: HTMLElement;
  private inspectionModal!: InspectionModal;
  private crtTerminal!: CrtTerminal;
  private evidenceComparison!: EvidenceComparison;
  private audioRecorderModal!: AudioRecorderModal;
  private puzzleKeypad!: PuzzleKeypad;
  private evidenceProvider?: () => EvidenceData;
  private modal = 0;
  private orphQueue: Promise<void> = Promise.resolve();
  private orphToken = 0;
  private subTimer = 0;
  private toastTimer = 0;
  textSpeed = 22; // ms per char

  init(root: HTMLElement) {
    this.root = root;
    root.innerHTML = '';
    this.inspectionModal = new InspectionModal(root);
    this.crtTerminal = new CrtTerminal(root);
    this.evidenceComparison = new EvidenceComparison(root);
    this.audioRecorderModal = new AudioRecorderModal(root);
    this.puzzleKeypad = new PuzzleKeypad(root);
    this.orphEl = el('div', 'orph hidden', root, '<div class="orph-name">ORPHEUS</div><div class="orph-wave"><i></i><i></i><i></i><i></i><i></i></div><div class="orph-text"></div>');
    this.orphText = this.orphEl.querySelector('.orph-text')!;
    this.hud = el('div', 'hud hidden', root, '<div class="hud-ring"><div class="hud-fill"></div></div><div class="hud-label">ECHO</div>');
    this.meterFill = this.hud.querySelector('.hud-fill')!;
    this.hudLabel = this.hud.querySelector('.hud-label')!;
    this.recallEl = el('div', 'recall hidden', root);
    this.sourceEl = el('div', 'source hidden', root);
    this.subEl = el('div', 'sub hidden', root);
    this.promptEl = el('div', 'prompt hidden', root);
    this.hintEl = el('div', 'hint hidden', root);
    this.panel = el('div', 'hidden', root, '<div class="panel-tag"></div><div class="panel-text"></div><div class="panel-more">E ▸</div>');
    this.panelText = this.panel.querySelector('.panel-text')!;
    this.panelTag = this.panel.querySelector('.panel-tag')!;
    this.choiceEl = el('div', 'choices hidden', root);
    this.toastEl = el('div', 'toast hidden', root);
    this.fadeEl = el('div', 'fade', root);
    this.fadeEl.style.opacity = '1';

    // Top-right help button
    this.helpBtn = el('button', 'help-btn', root, '?');
    this.helpBtn.title = 'Keyboard Shortcuts (?)';
    this.helpBtn.setAttribute('aria-label', 'Open Keyboard Shortcuts');
    this.helpBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.toggleShortcuts();
    });

    // Keyboard Shortcuts overlay modal
    this.shortcutsEl = el('div', 'shortcuts-modal hidden', root, `
      <div class="sc-backdrop"></div>
      <div class="sc-card" role="dialog" aria-modal="true" aria-label="Keyboard Shortcuts">
        <div class="sc-header">
          <div class="sc-header-text">
            <div class="sc-tag">PROTOCOL TERMINAL // CONTROLS</div>
            <div class="sc-title">KEYBOARD SHORTCUTS</div>
          </div>
          <button class="sc-close" title="Close (Esc)">✕</button>
        </div>
        <div class="sc-body">
          <table class="sc-table">
            <thead>
              <tr>
                <th>KEY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="sc-key"><kbd>?</kbd> <span class="sc-dim">or</span> <kbd>Shift</kbd>+<kbd>/</kbd></td>
                <td class="sc-action">Open / Close keyboard shortcuts</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>Esc</kbd></td>
                <td class="sc-action">Close window / Pause</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>E</kbd> <span class="sc-dim">or</span> <kbd>Space</kbd></td>
                <td class="sc-action">Interact / Continue dialogue</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>Q</kbd> <span class="sc-dim">(hold)</span></td>
                <td class="sc-action">Activate ECHO (Past-state view)</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> <span class="sc-dim">/</span> <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></td>
                <td class="sc-action">Movement</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>Shift</kbd> <span class="sc-dim">(hold)</span></td>
                <td class="sc-action">Run</td>
              </tr>
              <tr>
                <td class="sc-key"><kbd>Tab</kbd></td>
                <td class="sc-action">Inventory / Evidence</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sc-footer">
          <div class="sc-tip"><span class="sc-amber">TIP:</span> Compare differences between present & ECHO past to solve station puzzles.</div>
          <div class="sc-credit"><span class="sc-cyan">ECHO//CHAMBER</span> · Iteration 017 · <kbd>Esc</kbd> to return</div>
        </div>
      </div>`);

    this.shortcutsEl.querySelector('.sc-close')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.closeShortcuts();
    });
    this.shortcutsEl.querySelector('.sc-backdrop')!.addEventListener('click', () => {
      this.closeShortcuts();
    });

    // Evidence / Inventory overlay modal (Tab)
    this.inventoryEl = el('div', 'inventory-modal hidden', root, `
      <div class="sc-backdrop"></div>
      <div class="sc-card inv-card" role="dialog" aria-modal="true" aria-label="Evidence and Inventory">
        <div class="sc-header">
          <div class="sc-header-text">
            <div class="sc-tag">RESONANCE ARCHIVE // DOSSIER</div>
            <div class="sc-title">INVENTORY & EVIDENCE</div>
          </div>
          <button class="sc-close inv-close" title="Close (Tab / Esc)">✕</button>
        </div>
        <div class="inv-recall-banner">
          <span class="inv-label">CONSCIOUSNESS RECALL:</span>
          <span class="inv-recall-num">3%</span>
          <div class="inv-bar"><div class="inv-bar-fill"></div></div>
        </div>
        <div class="inv-body">
          <div class="inv-items"></div>
        </div>
        <div class="sc-footer">
          <div class="sc-tip"><span class="sc-amber">EVIDENCE:</span> Objective station records survive memory rewrites.</div>
          <div class="sc-credit"><kbd>Tab</kbd> / <kbd>Esc</kbd> to return</div>
        </div>
      </div>`);

    this.inventoryEl.querySelector('.inv-close')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.closeInventory();
    });
    this.inventoryEl.querySelector('.sc-backdrop')!.addEventListener('click', () => {
      this.closeInventory();
    });

    // Global keyboard listener for ? and Tab
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleShortcuts();
        return;
      }
      if (e.key === 'Escape') {
        if (this.isShortcutsOpen()) {
          e.preventDefault();
          e.stopPropagation();
          this.closeShortcuts();
          return;
        }
        if (this.isInventoryOpen()) {
          e.preventDefault();
          e.stopPropagation();
          this.closeInventory();
          return;
        }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        this.toggleInventory();
        return;
      }
    }, true);
  }

  isModal() { return this.modal > 0; }

  // ------------------------------------------------------------- shortcuts & inventory
  isShortcutsOpen(): boolean {
    return Boolean(this.shortcutsEl && !this.shortcutsEl.classList.contains('hidden'));
  }

  openShortcuts() {
    if (this.isShortcutsOpen()) return;
    if (this.isInventoryOpen()) this.closeInventory(false);
    audio.blip();
    this.shortcutsEl.classList.remove('hidden');
    this.modal++;
  }

  closeShortcuts(sound = true) {
    if (!this.isShortcutsOpen()) return;
    if (sound) audio.blip();
    this.shortcutsEl.classList.add('hidden');
    this.modal = Math.max(0, this.modal - 1);
  }

  toggleShortcuts() {
    if (this.isShortcutsOpen()) {
      this.closeShortcuts();
    } else {
      this.openShortcuts();
    }
  }

  setEvidenceProvider(fn: () => EvidenceData) {
    this.evidenceProvider = fn;
  }

  isInventoryOpen(): boolean {
    return Boolean(this.inventoryEl && !this.inventoryEl.classList.contains('hidden'));
  }

  openInventory() {
    if (this.isInventoryOpen()) return;
    if (this.isShortcutsOpen()) this.closeShortcuts(false);
    const data = this.evidenceProvider ? this.evidenceProvider() : { recall: 3, items: [] };
    const numEl = this.inventoryEl.querySelector('.inv-recall-num') as HTMLElement;
    const barEl = this.inventoryEl.querySelector('.inv-bar-fill') as HTMLElement;
    const itemsEl = this.inventoryEl.querySelector('.inv-items') as HTMLElement;
    if (numEl) numEl.textContent = `${data.recall}%`;
    if (barEl) barEl.style.width = `${Math.min(100, Math.max(3, data.recall))}%`;
    if (itemsEl) {
      itemsEl.innerHTML = '';
      if (data.items.length === 0) {
        itemsEl.innerHTML = `<div class="inv-empty">No active evidence catalogued in current cycle.<br><small>Investigate the station and toggle ECHO <kbd>Q</kbd> to recover memory traces.</small></div>`;
      } else {
        for (const item of data.items) {
          const row = el('div', 'inv-row', itemsEl);
          row.innerHTML = `<div class="inv-item-name"><span class="inv-bullet">◈</span> ${item.name}</div><div class="inv-item-desc">${item.desc}</div>`;
        }
      }
    }
    audio.blip();
    this.inventoryEl.classList.remove('hidden');
    this.modal++;
  }

  closeInventory(sound = true) {
    if (!this.isInventoryOpen()) return;
    if (sound) audio.blip();
    this.inventoryEl.classList.add('hidden');
    this.modal = Math.max(0, this.modal - 1);
  }

  toggleInventory() {
    if (this.isInventoryOpen()) {
      this.closeInventory();
    } else {
      this.openInventory();
    }
  }

  // ------------------------------------------------------------- title
  title(onStart: (mode: 'new' | 'continue') => void) {
    const render = () => {
      const saveSummary = saveSystem.getSaveSummary();
      const hasSave = saveSummary !== null;

      const buttonsHtml = hasSave
        ? `
        <div class="title-actions">
          <button class="title-start title-continue">Continue <kbd>Enter</kbd>
            <span class="title-save-info">${saveSummary.label} · Recall ${saveSummary.recall}% · ${saveSummary.date}</span>
          </button>
          <button class="title-secondary title-newgame">New Cycle</button>
        </div>
        <div class="title-tools">
          <button class="title-erase">Erase local save</button>
        </div>`
        : `
        <div class="title-actions">
          <button class="title-start">Wake up <kbd>Enter</kbd></button>
        </div>`;

      const t = el('div', 'title', this.root, `
        <div class="title-inner">
          <div class="title-logo">ECHO<span>//</span>CHAMBER</div>
          <div class="title-tag">A memory can be evidence. It can also be a lie.</div>
          ${buttonsHtml}
          <div class="title-controls">
            <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrows — move</div>
            <div><kbd>Shift</kbd> — run</div>
            <div><kbd>E</kbd> — inspect / continue</div>
            <div><kbd>Q</kbd> (hold) — ECHO: see what this place remembers</div>
            <div><kbd>Tab</kbd> — inventory / evidence</div>
            <div><kbd>?</kbd> — keyboard shortcuts</div>
            <div><kbd>M</kbd> — mute</div>
          </div>
          <div class="title-note">Headphones recommended · about 6–8 minutes</div>
        </div>`);

      this.fadeTo(0, 600);

      const go = (mode: 'new' | 'continue') => {
        window.removeEventListener('keydown', onKey);
        t.classList.add('out');
        setTimeout(() => t.remove(), 700);
        onStart(mode);
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go(hasSave ? 'continue' : 'new');
        }
      };
      window.addEventListener('keydown', onKey);

      if (hasSave) {
        const contBtn = t.querySelector('.title-continue') as HTMLButtonElement | null;
        const newBtn = t.querySelector('.title-newgame') as HTMLButtonElement | null;
        const eraseBtn = t.querySelector('.title-erase') as HTMLButtonElement | null;

        contBtn?.addEventListener('click', () => go('continue'));
        newBtn?.addEventListener('click', () => {
          if (window.confirm('Start a new cycle? Your saved progress on this browser will be reset.')) {
            saveSystem.clearSave();
            go('new');
          }
        });
        eraseBtn?.addEventListener('click', () => {
          if (window.confirm('Erase saved station progress on this browser?')) {
            saveSystem.clearSave();
            window.removeEventListener('keydown', onKey);
            t.remove();
            render();
          }
        });
      } else {
        const wakeBtn = t.querySelector('.title-start') as HTMLButtonElement | null;
        wakeBtn?.addEventListener('click', () => go('new'));
      }
    };

    render();
  }

  // ------------------------------------------------------------- ORPHEUS (non-modal)
  orpheus(text: string, holdMs?: number): Promise<void> {
    const job = this.orphQueue.then(async () => {
      const token = ++this.orphToken;
      audio.orpheus();
      this.orphEl.classList.remove('hidden');
      this.orphEl.classList.add('speaking');
      await this.typeInto(this.orphText, text, 26);
      this.orphEl.classList.remove('speaking');
      await wait(holdMs ?? Math.max(1800, text.length * 55));
      if (token === this.orphToken) this.orphEl.classList.add('hidden');
    });
    this.orphQueue = job.catch(() => undefined);
    return job;
  }
  orpheusClear() { this.orphToken++; this.orphEl.classList.add('hidden'); }

  private async typeInto(node: HTMLElement, text: string, speed = this.textSpeed, skip?: () => boolean) {
    node.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (skip?.()) { node.textContent = text; return; }
      node.textContent = text.slice(0, i + 1);
      if (i % 3 === 0 && text[i] !== ' ') audio.type();
      await wait(text[i] === '.' || text[i] === '…' ? speed * 6 : speed);
    }
  }

  // ------------------------------------------------------------- modal inspect panel
  async say(text: string, tag = ''): Promise<void> {
    this.modal++;
    this.panel.classList.add('panel');
    this.panel.classList.remove('hidden');
    this.panelTag.textContent = tag;
    this.panelTag.style.display = tag ? '' : 'none';
    let skip = false;
    const opened = performance.now();
    let resolveAdv: () => void = () => undefined;
    const advanced = new Promise<void>((r) => (resolveAdv = r));
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || !ADV_KEYS.has(e.key) || performance.now() - opened < 180) return;
      e.preventDefault();
      if (!typed) skip = true; else resolveAdv();
    };
    const onClick = () => { if (!typed) skip = true; else resolveAdv(); };
    let typed = false;
    window.addEventListener('keydown', onKey);
    this.panel.addEventListener('click', onClick);
    this.panel.classList.remove('done');
    await this.typeInto(this.panelText, text, this.textSpeed, () => skip);
    typed = true;
    this.panel.classList.add('done');
    await advanced;
    window.removeEventListener('keydown', onKey);
    this.panel.removeEventListener('click', onClick);
    this.panel.classList.remove('panel');
    this.panel.classList.add('hidden');
    audio.blip();
    this.modal--;
  }

  async sayAll(lines: string[], tag = '') { for (const l of lines) await this.say(l, tag); }

  // ------------------------------------------------------------- choices
  choose(prompt: string, options: ChoiceOption[], tracker?: { current: number; total: number; placed?: string[] }): Promise<string> {
    this.modal++;
    return new Promise((resolve) => {
      this.choiceEl.innerHTML = '';
      if (tracker) {
        const tr = el('div', 'timeline-tracker', this.choiceEl);
        for (let s = 1; s <= tracker.total; s++) {
          const slot = el('div', `timeline-slot ${s < tracker.current ? 'filled' : s === tracker.current ? 'current' : ''}`, tr);
          slot.innerHTML = s < tracker.current ? `SLOT ${s} ◈ ${tracker.placed?.[s - 1] ?? 'PLACED'}` : s === tracker.current ? `SLOT ${s} ▸ ACTIVE` : `SLOT ${s}`;
        }
      }
      el('div', 'choices-prompt', this.choiceEl).textContent = prompt;
      let idx = 0;
      const btns = options.map((o, i) => {
        const b = el('button', 'choice', this.choiceEl);
        b.innerHTML = `<span class="choice-n">${i + 1}</span><span class="choice-l"></span>${o.hint ? '<span class="choice-h"></span>' : ''}`;
        b.querySelector('.choice-l')!.textContent = o.label;
        if (o.hint) b.querySelector('.choice-h')!.textContent = o.hint;
        b.addEventListener('mouseenter', () => { idx = i; sync(); });
        b.addEventListener('click', () => done(o.id));
        return b;
      });
      const sync = () => btns.forEach((b, i) => b.classList.toggle('sel', i === idx));
      sync();
      this.choiceEl.classList.remove('hidden');
      const opened = performance.now();
      const onKey = (e: KeyboardEvent) => {
        if (e.repeat || performance.now() - opened < 450) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= options.length) { e.preventDefault(); done(options[n - 1].id); return; }
        if (['ArrowUp', 'w', 'W'].includes(e.key)) { idx = (idx + options.length - 1) % options.length; sync(); audio.blip(); }
        if (['ArrowDown', 's', 'S'].includes(e.key)) { idx = (idx + 1) % options.length; sync(); audio.blip(); }
        if (ADV_KEYS.has(e.key)) { e.preventDefault(); done(options[idx].id); }
      };
      const done = (id: string) => {
        window.removeEventListener('keydown', onKey);
        this.choiceEl.classList.add('hidden');
        this.modal--;
        audio.confirm();
        resolve(id);
      };
      window.addEventListener('keydown', onKey);
    });
  }

  // ------------------------------------------------------------- cinematic object inspection
  async inspect(config: InspectConfig): Promise<void> {
    this.modal++;
    try {
      await this.inspectionModal.inspect(config);
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  // ------------------------------------------------------------- unified CRT terminal
  async crtLog(header: string[], rows: string[], footer: string, title?: string): Promise<void> {
    this.modal++;
    try {
      await this.crtTerminal.openStreamLog(header, rows, footer, title);
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  async crtMenu(config: CrtConfig): Promise<string> {
    this.modal++;
    try {
      return await this.crtTerminal.openInteractiveMenu(config);
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  async terminal(header: string[], rows: string[], footer: string): Promise<void> {
    return this.crtLog(header, rows, footer);
  }

  // ------------------------------------------------------------- evidence comparison
  async compareEvidence(config: ContestedMemoryConfig): Promise<{ memoryId: string; evidenceId: string } | null> {
    this.modal++;
    try {
      return await this.evidenceComparison.open(config);
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  // ------------------------------------------------------------- audio recorder
  async recorder(track: RecorderTrack): Promise<void> {
    this.modal++;
    try {
      await this.audioRecorderModal.open(track);
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  // ------------------------------------------------------------- keypad (shape code)
  async keypad(): Promise<string[] | null> {
    this.modal++;
    try {
      return await this.puzzleKeypad.open();
    } finally {
      this.modal = Math.max(0, this.modal - 1);
    }
  }

  // ------------------------------------------------------------- frost writing (CM-05)
  async frost(text: string, stopAt: number) {
    const f = el('div', 'frost', this.root, '<div class="frost-text"></div>');
    const t = f.querySelector('.frost-text') as HTMLElement;
    await wait(300);
    for (let i = 0; i < stopAt; i++) {
      t.textContent = text.slice(0, i + 1);
      audio.frost();
      await wait(text[i] === ' ' ? 120 : 260);
    }
    t.classList.add('cut');
    await wait(900);
    f.classList.add('out');
    await wait(900);
    f.remove();
  }

  // ------------------------------------------------------------- HUD bits
  prompt(text: string | null) {
    if (!text) { this.promptEl.classList.add('hidden'); return; }
    this.promptEl.innerHTML = `<kbd>E</kbd> ${text}`;
    this.promptEl.classList.remove('hidden');
  }

  hint(html: string | null) {
    if (!html) { this.hintEl.classList.add('hidden'); return; }
    this.hintEl.innerHTML = html;
    this.hintEl.classList.remove('hidden');
  }

  showHud(on: boolean) { this.hud.classList.toggle('hidden', !on); }

  echoHud(t: number, meter: number, cooling: boolean) {
    this.meterFill.style.transform = `scaleX(${Math.max(0, meter)})`;
    this.hud.classList.toggle('active', t > 0.05);
    this.hud.classList.toggle('cool', cooling);
    this.hudLabel.textContent = t > 0.05 ? 'ECHO // ARCHIVE' : cooling ? 'ECHO // RECOVERING' : 'ECHO  [Q]';
  }

  source(text: string | null) {
    if (!text) { this.sourceEl.classList.add('hidden'); return; }
    this.sourceEl.textContent = text;
    this.sourceEl.classList.remove('hidden');
  }

  recall(n: number | null) {
    if (n === null) { this.recallEl.classList.add('hidden'); return; }
    this.recallEl.textContent = `SUBJECT RECALL ${n}%`;
    this.recallEl.classList.remove('hidden');
    this.recallEl.classList.remove('pulse');
    void this.recallEl.offsetWidth;
    this.recallEl.classList.add('pulse');
  }

  subtitle(text: string, source = '', ms = 2600) {
    this.subEl.innerHTML = `${source ? `<span class="sub-src">${source}</span>` : ''}<span class="sub-t"></span>`;
    this.subEl.querySelector('.sub-t')!.textContent = text;
    this.subEl.classList.remove('hidden');
    clearTimeout(this.subTimer);
    this.subTimer = window.setTimeout(() => this.subEl.classList.add('hidden'), ms);
  }

  toast(text: string, ms = 2600) {
    this.toastEl.textContent = text;
    this.toastEl.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.add('hidden'), ms);
  }

  fadeTo(opacity: number, ms: number, color = '#000'): Promise<void> {
    this.fadeEl.style.background = color;
    this.fadeEl.style.transition = `opacity ${ms}ms ease`;
    this.fadeEl.style.opacity = String(opacity);
    return wait(ms);
  }

  // ------------------------------------------------------------- endings
  ending(title: string, lines: string[], tag: string, onRestart: () => void) {
    this.modal++;
    const e = el('div', 'ending', this.root, `<div class="end-inner"><div class="end-lines"></div><div class="end-title"></div><div class="end-tag"></div><div class="end-q"></div><button class="end-restart hidden">Wake again <kbd>Enter</kbd></button><div class="end-credit hidden">ECHO//CHAMBER · made at CodeDay Bengaluru 2026 · all art and sound generated in code</div></div>`);
    const linesEl = e.querySelector('.end-lines') as HTMLElement;
    (async () => {
      await wait(800);
      for (const l of lines) {
        const p = el('p', 'end-line', linesEl);
        p.textContent = l;
        await wait(1900 + l.length * 25);
      }
      await wait(600);
      (e.querySelector('.end-title') as HTMLElement).textContent = title;
      (e.querySelector('.end-tag') as HTMLElement).textContent = tag;
      await wait(1600);
      e.querySelector('.end-restart')!.classList.remove('hidden');
      e.querySelector('.end-credit')!.classList.remove('hidden');
      const go = () => { window.removeEventListener('keydown', k); onRestart(); };
      const k = (ev: KeyboardEvent) => { if (ev.key === 'Enter') go(); };
      window.addEventListener('keydown', k);
      e.querySelector('.end-restart')!.addEventListener('click', go);
    })();
  }
}

export const ui = new UI();
(window as unknown as { __UI: UI }).__UI = ui;
export { wait };
