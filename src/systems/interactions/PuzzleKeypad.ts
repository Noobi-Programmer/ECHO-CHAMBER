// Tactile Sci-Fi Shape Keypad Modal for ECHO//CHAMBER
import { audio } from '../audio';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

export class PuzzleKeypad {
  private wrap?: HTMLElement;
  private keyListener?: (e: KeyboardEvent) => void;

  constructor(private root: HTMLElement) {}

  open(): Promise<string[] | null> {
    return new Promise((resolve) => {
      const shapes = [
        { id: 'circle', g: '◯', label: 'CIRCLE' },
        { id: 'triangle', g: '△', label: 'TRIANGLE' },
        { id: 'square', g: '□', label: 'SQUARE' },
        { id: 'diamond', g: '◇', label: 'DIAMOND' },
      ];

      this.wrap = el('div', 'keypad-backdrop', this.root);
      const card = el('div', 'keypad tactile-keypad', this.wrap); // includes .keypad for test compatibility
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-label', 'Core Access Keypad');

      // Header with close button
      const head = el('div', 'kp-header', card);
      el('div', 'kp-title', head, 'THE WELL — AUTHORISED ACCESS');
      const closeBtn = el('button', 'kp-close-btn', head, '✕');
      closeBtn.title = 'Step away (Esc)';

      // LED Indicators (3 slots)
      const ledRow = el('div', 'kp-led-row', card);
      const leds = [
        el('div', 'kp-led-slot empty', ledRow, '·'),
        el('div', 'kp-led-slot empty', ledRow, '·'),
        el('div', 'kp-led-slot empty', ledRow, '·'),
      ];

      // Screen readout entry
      const entry = el('div', 'kp-entry', card);
      const grid = el('div', 'kp-grid', card);
      const help = el('div', 'kp-help', card, '<kbd>1</kbd>–<kbd>4</kbd> or click · <kbd>Esc</kbd> step away');

      const seq: string[] = [];
      const render = () => {
        entry.textContent = seq.map((s) => shapes.find((x) => x.id === s)!.g).join('  ') || '·  ·  ·';
        leds.forEach((led, i) => {
          if (i < seq.length) {
            led.className = 'kp-led-slot active';
            led.textContent = shapes.find((x) => x.id === seq[i])!.g;
          } else {
            led.className = 'kp-led-slot empty';
            led.textContent = '·';
          }
        });
      };
      render();

      let finished = false;
      const finish = (r: string[] | null) => {
        if (finished) return;
        finished = true;
        this.destroy();
        resolve(r);
      };

      const press = (i: number) => {
        if (seq.length >= 3 || finished) return;
        audio.keyTone(i);
        seq.push(shapes[i].id);
        render();

        // Button tactile feedback animation
        const btn = buttons[i];
        if (btn) {
          btn.classList.add('pressed');
          setTimeout(() => btn.classList.remove('pressed'), 120);
        }

        if (seq.length === 3) {
          setTimeout(() => finish([...seq]), 350);
        }
      };

      const buttons = shapes.map((s, i) => {
        const b = el('button', 'kp-btn tactile-btn', grid);
        b.innerHTML = `<span>${s.g}</span><small>${i + 1}</small>`;
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          press(i);
        });
        return b;
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        finish(null);
      });

      this.wrap.addEventListener('click', (e) => {
        if (e.target === this.wrap) finish(null);
      });

      const opened = performance.now();
      this.keyListener = (e: KeyboardEvent) => {
        if (e.repeat || performance.now() - opened < 200) return;
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4 && seq.length < 3) {
          e.preventDefault();
          press(n - 1);
        }
        if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault();
          finish(null);
        }
      };
      window.addEventListener('keydown', this.keyListener, true);
    });
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
