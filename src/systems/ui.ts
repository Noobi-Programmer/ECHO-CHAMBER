// DOM overlay UI: crisp text over the pixel canvas. Presentation only — no story logic.
import { audio } from './audio';

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
  private modal = 0;
  private orphQueue: Promise<void> = Promise.resolve();
  private orphToken = 0;
  private subTimer = 0;
  private toastTimer = 0;
  textSpeed = 22; // ms per char

  init(root: HTMLElement) {
    this.root = root;
    root.innerHTML = '';
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
    this.panel = el('div', 'panel hidden', root, '<div class="panel-tag"></div><div class="panel-text"></div><div class="panel-more">E ▸</div>');
    this.panelText = this.panel.querySelector('.panel-text')!;
    this.panelTag = this.panel.querySelector('.panel-tag')!;
    this.choiceEl = el('div', 'choices hidden', root);
    this.toastEl = el('div', 'toast hidden', root);
    this.fadeEl = el('div', 'fade', root);
    this.fadeEl.style.opacity = '1';
  }

  isModal() { return this.modal > 0; }

  // ------------------------------------------------------------- title
  title(onStart: () => void) {
    const t = el('div', 'title', this.root, `
      <div class="title-inner">
        <div class="title-logo">ECHO<span>//</span>CHAMBER</div>
        <div class="title-tag">A memory can be evidence. It can also be a lie.</div>
        <button class="title-start">Wake up <kbd>Enter</kbd></button>
        <div class="title-controls">
          <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrows — move</div>
          <div><kbd>E</kbd> — inspect / continue</div>
          <div><kbd>Q</kbd> (hold) — ECHO: see what this place remembers</div>
          <div><kbd>M</kbd> — mute</div>
        </div>
        <div class="title-note">Headphones recommended · about 6–8 minutes</div>
      </div>`);
    this.fadeTo(0, 600);
    const go = () => {
      window.removeEventListener('keydown', onKey);
      t.classList.add('out');
      setTimeout(() => t.remove(), 700);
      onStart();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    window.addEventListener('keydown', onKey);
    t.querySelector('button')!.addEventListener('click', go);
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
    this.panel.classList.add('hidden');
    audio.blip();
    this.modal--;
  }

  async sayAll(lines: string[], tag = '') { for (const l of lines) await this.say(l, tag); }

  // ------------------------------------------------------------- choices
  choose(prompt: string, options: ChoiceOption[]): Promise<string> {
    this.modal++;
    return new Promise((resolve) => {
      this.choiceEl.innerHTML = '';
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

  // ------------------------------------------------------------- keypad (shape code)
  keypad(): Promise<string[] | null> {
    this.modal++;
    return new Promise((resolve) => {
      const shapes = [
        { id: 'circle', g: '◯' },
        { id: 'triangle', g: '△' },
        { id: 'square', g: '□' },
        { id: 'diamond', g: '◇' },
      ];
      const wrap = el('div', 'keypad', this.root, '<div class="kp-title">THE WELL — AUTHORISED PERSONNEL</div><div class="kp-entry"></div><div class="kp-grid"></div><div class="kp-help"><kbd>1</kbd>–<kbd>4</kbd> or click · <kbd>Esc</kbd> step away</div>');
      const entry = wrap.querySelector('.kp-entry') as HTMLElement;
      const grid = wrap.querySelector('.kp-grid') as HTMLElement;
      const seq: string[] = [];
      const render = () => { entry.textContent = seq.map((s) => shapes.find((x) => x.id === s)!.g).join('  ') || '·  ·  ·'; };
      render();
      const press = (i: number) => {
        audio.keyTone(i);
        seq.push(shapes[i].id);
        render();
        if (seq.length === 3) { setTimeout(() => finish([...seq]), 350); }
      };
      shapes.forEach((s, i) => {
        const b = el('button', 'kp-btn', grid);
        b.innerHTML = `<span>${s.g}</span><small>${i + 1}</small>`;
        b.addEventListener('click', () => press(i));
      });
      const opened = performance.now();
      const onKey = (e: KeyboardEvent) => {
        if (e.repeat || performance.now() - opened < 200) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4 && seq.length < 3) press(n - 1);
        if (e.key === 'Escape' || e.key === 'Backspace') finish(null);
      };
      const finish = (r: string[] | null) => {
        window.removeEventListener('keydown', onKey);
        wrap.remove();
        this.modal--;
        resolve(r);
      };
      window.addEventListener('keydown', onKey);
    });
  }

  // ------------------------------------------------------------- terminal log
  async terminal(header: string[], rows: string[], footer: string): Promise<void> {
    this.modal++;
    const wrap = el('div', 'term', this.root, '<pre class="term-text"></pre><div class="term-more hidden">E ▸ close</div>');
    const pre = wrap.querySelector('.term-text') as HTMLElement;
    let skip = false;
    const onSkip = (e: KeyboardEvent) => { if (ADV_KEYS.has(e.key)) skip = true; };
    window.addEventListener('keydown', onSkip);
    for (const h of header) { pre.textContent += h + '\n'; await wait(skip ? 0 : 160); audio.type(); }
    pre.textContent += '\n';
    for (const r of rows) {
      pre.textContent += r + '\n';
      audio.type();
      await wait(skip ? 0 : 380);
    }
    pre.textContent += '\n' + footer;
    window.removeEventListener('keydown', onSkip);
    wrap.querySelector('.term-more')!.classList.remove('hidden');
    await new Promise<void>((res) => {
      const opened = performance.now();
      const k = (e: KeyboardEvent) => {
        if (e.repeat || !ADV_KEYS.has(e.key) || performance.now() - opened < 400) return;
        window.removeEventListener('keydown', k); res();
      };
      window.addEventListener('keydown', k);
      wrap.addEventListener('click', () => { window.removeEventListener('keydown', k); res(); });
    });
    wrap.remove();
    this.modal--;
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
export { wait };
