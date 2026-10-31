// Reusable CRT Terminal Interface for ECHO//CHAMBER
import { audio } from '../audio';
import type { CrtConfig, CrtMenuItem } from './types';

const ADV_KEYS = new Set(['e', 'E', ' ', 'Enter']);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class CrtTerminal {
  private wrap?: HTMLElement;
  private keyListener?: (e: KeyboardEvent) => void;
  private skip = false;

  constructor(private root: HTMLElement) {}

  /**
   * Unified terminal display supporting both:
   * 1. Streaming protocol log mode (header, rows, footer)
   * 2. Interactive query menu mode (Cradle terminal questions/answers)
   */
  async openStreamLog(header: string[], rows: string[], footer: string, title = 'ASPHODEL // RESTORATION TERMINAL'): Promise<void> {
    return new Promise<void>((resolve) => {
      this.buildTerminalFrame(title, 'ORPHEUS CORE PROTOCOL // MEMORY CONTINUITY LOG', async (body, finish) => {
        const textPre = el('pre', 'term-text crt-stream-text', body);
        this.skip = false;

        const onAdvance = (e: KeyboardEvent) => {
          if (ADV_KEYS.has(e.key)) this.skip = true;
        };
        window.addEventListener('keydown', onAdvance);

        // Header lines with phosphor flicker
        for (const h of header) {
          textPre.textContent += h + '\n';
          await wait(this.skip ? 0 : 120);
          audio.type();
        }
        textPre.textContent += '\n' + '─'.repeat(54) + '\n\n';

        // Stream rows
        for (const r of rows) {
          textPre.textContent += r + '\n';
          audio.type();
          await wait(this.skip ? 0 : 260);
          // Auto-scroll terminal monitor to follow cursor
          body.scrollTop = body.scrollHeight;
        }

        // Footer
        textPre.textContent += '\n' + footer + '\n';
        window.removeEventListener('keydown', onAdvance);

        finish();
        resolve();
      });
    });
  }

  /**
   * Interactive menu-driven CRT terminal for station queries
   */
  openInteractiveMenu(config: CrtConfig): Promise<string> {
    return new Promise<string>((resolve) => {
      this.buildTerminalFrame(config.title, config.systemTag, async (body, finish) => {
        // System status header block
        if (config.statusLines && config.statusLines.length > 0) {
          const statusBox = el('div', 'crt-status-box', body);
          for (const line of config.statusLines) {
            el('div', 'crt-status-row', statusBox, `<span class="crt-bullet">▸</span> ${line}`);
          }
        }

        const promptBox = el('div', 'crt-menu-prompt', body, config.menuPrompt ?? 'SELECT QUERY FROM BUFFER:');
        const menuList = el('div', 'crt-menu-list', body);
        const outputBox = el('div', 'crt-output-box hidden', body);

        let selectedIndex = 0;
        const items = [...(config.items ?? [])];
        if (config.allowStepAway !== false) {
          items.push({ id: 'x', label: 'Step away from terminal', response: 'Terminal connection closed.' });
        }

        const btns = items.map((item, i) => {
          const btn = el('button', 'crt-menu-item choice', menuList); // includes .choice for automated tests
          btn.innerHTML = `
            <span class="crt-item-num choice-n">[ ${i + 1} ]</span>
            <span class="crt-item-label choice-l">${item.label}</span>
            ${item.status ? `<span class="crt-item-status choice-h">${item.status}</span>` : ''}
          `;
          btn.addEventListener('mouseenter', () => {
            selectedIndex = i;
            updateSelection();
          });
          btn.addEventListener('click', () => {
            chooseItem(item);
          });
          return btn;
        });

        const updateSelection = () => {
          btns.forEach((b, i) => b.classList.toggle('sel', i === selectedIndex));
        };
        updateSelection();

        const chooseItem = async (item: CrtMenuItem) => {
          audio.confirm();
          if (item.id === 'x') {
            finish();
            resolve('x');
            return;
          }

          menuList.classList.add('hidden');
          promptBox.classList.add('hidden');
          outputBox.classList.remove('hidden');
          outputBox.innerHTML = `
            <div class="crt-query-echo">QUERY: ${item.label}</div>
            <div class="crt-query-divider">────────────────────────────────────</div>
            <div class="crt-response-text"></div>
            <div class="term-more crt-return-hint"><kbd>E</kbd> / <kbd>Enter</kbd> Return to index</div>
          `;

          const respEl = outputBox.querySelector('.crt-response-text') as HTMLElement;
          const lines = Array.isArray(item.response) ? item.response : [item.response];

          let skipResp = false;
          const onSkip = (e: KeyboardEvent) => {
            if (ADV_KEYS.has(e.key)) skipResp = true;
          };
          window.addEventListener('keydown', onSkip);

          for (const line of lines) {
            for (let c = 0; c < line.length; c++) {
              if (skipResp) {
                respEl.textContent = lines.join('\n\n');
                break;
              }
              respEl.textContent += line[c];
              if (c % 3 === 0 && line[c] !== ' ') audio.type();
              await wait(line[c] === '.' ? 100 : 18);
            }
            if (!skipResp) {
              respEl.textContent += '\n\n';
              await wait(180);
            }
          }
          window.removeEventListener('keydown', onSkip);

          // Wait for player to press Enter/E or click to return
          const awaitReturn = (e: KeyboardEvent) => {
            if (ADV_KEYS.has(e.key)) {
              e.preventDefault();
              window.removeEventListener('keydown', awaitReturn);
              finish();
              resolve(item.id);
            }
          };
          window.addEventListener('keydown', awaitReturn);
          outputBox.addEventListener('click', () => {
            window.removeEventListener('keydown', awaitReturn);
            finish();
            resolve(item.id);
          });
        };

        // Keyboard menu navigation
        const onNavKey = (e: KeyboardEvent) => {
          if (!outputBox.classList.contains('hidden')) return;
          const n = parseInt(e.key, 10);
          if (n >= 1 && n <= items.length) {
            e.preventDefault();
            chooseItem(items[n - 1]);
            return;
          }
          if (['ArrowUp', 'w', 'W'].includes(e.key)) {
            selectedIndex = (selectedIndex + items.length - 1) % items.length;
            updateSelection();
            audio.blip();
          }
          if (['ArrowDown', 's', 'S'].includes(e.key)) {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection();
            audio.blip();
          }
          if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            chooseItem(items[selectedIndex]);
          }
        };
        window.addEventListener('keydown', onNavKey);
      });
    });
  }

  private buildTerminalFrame(title: string, systemTag: string, contentBuilder: (body: HTMLElement, finish: () => void) => void) {
    if (this.wrap) this.destroy();

    this.wrap = el('div', 'crt-backdrop', this.root);
    // .term ensures backward-compatibility with tests:
    const monitor = el('div', 'crt-monitor term', this.wrap);
    monitor.setAttribute('role', 'dialog');
    monitor.setAttribute('aria-label', title);

    // Bezel and CRT effects
    el('div', 'crt-bezel-reflection', monitor);
    el('div', 'crt-scanlines', monitor);
    el('div', 'crt-vignette', monitor);

    // Monitor Header
    const head = el('div', 'crt-header', monitor);
    const headLeft = el('div', 'crt-head-left', head);
    el('div', 'crt-sys-tag', headLeft, systemTag);
    el('div', 'crt-title', headLeft, title);

    const headRight = el('div', 'crt-head-right', head);
    el('div', 'crt-rec-badge', headRight, 'ONLINE // PHOSPHOR P1');
    const closeBtn = el('button', 'crt-close-btn', headRight, '✕');
    closeBtn.title = 'Disconnect / Exit (Esc)';

    // Terminal Screen Body
    const body = el('div', 'crt-body', monitor);

    // Monitor Footer with persistent prompt & controls
    const foot = el('div', 'crt-footer', monitor);
    const footStatus = el('div', 'crt-foot-status', foot, '<span class="crt-blink">█</span> ASPHODEL_SYS // READY');
    const termMore = el('div', 'term-more crt-foot-hint hidden', foot, '<kbd>E</kbd> ▸ close');

    let finished = false;
    const finish = () => {
      finished = true;
      termMore.classList.remove('hidden');
    };

    const close = () => {
      audio.blip();
      this.destroy();
    };

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });

    this.keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }
      if (finished && ADV_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener('keydown', this.keyListener, true);

    monitor.addEventListener('click', () => {
      if (finished) close();
    });

    contentBuilder(body, finish);
  }

  close() {
    audio.blip();
    this.destroy();
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
