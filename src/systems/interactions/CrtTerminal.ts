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
   * Unified terminal display supporting streaming protocol log mode (header, rows, footer)
   */
  async openStreamLog(header: string[], rows: string[], footer: string, title = 'ASPHODEL // RESTORATION TERMINAL'): Promise<void> {
    return new Promise<void>((resolve) => {
      this.buildTerminalFrame(
        title,
        'ORPHEUS CORE PROTOCOL // MEMORY CONTINUITY LOG',
        async (body, finish, close) => {
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
            body.scrollTop = body.scrollHeight;
          }

          // Footer
          textPre.textContent += '\n' + footer + '\n';
          window.removeEventListener('keydown', onAdvance);

          finish(); // Unhides close instruction in terminal footer
        },
        () => {
          resolve();
        }
      );
    });
  }

  /**
   * Interactive menu-driven CRT terminal for station queries
   * Features a persistent live output pane directly displaying the selected record output.
   */
  openInteractiveMenu(config: CrtConfig): Promise<string> {
    return new Promise<string>((resolve) => {
      let resolvedValue = 'x';

      this.buildTerminalFrame(
        config.title,
        config.systemTag,
        (body, _finish, closeFrame) => {
          // System status header block
          if (config.statusLines && config.statusLines.length > 0) {
            const statusBox = el('div', 'crt-status-box', body);
            for (const line of config.statusLines) {
              el('div', 'crt-status-row', statusBox, `<span class="crt-bullet">▸</span> ${line}`);
            }
          }

          const promptBox = el('div', 'crt-menu-prompt', body, config.menuPrompt ?? 'SELECT QUERY FROM BUFFER:');
          const menuList = el('div', 'crt-menu-list choices', body); // includes .choices for tests

          // Persistent live output panel on the terminal glass
          const outputPanel = el('div', 'crt-output-panel', body);
          const outputHeader = el('div', 'crt-output-header', outputPanel);
          el('span', 'crt-output-tag', outputHeader, '◈ STATION ARCHIVE OUTPUT:');
          const outputStatus = el('span', 'crt-output-status', outputHeader, 'DECRYPTED RECORD');
          const outputContent = el('div', 'crt-output-content', outputPanel);

          const rawItems = [...(config.items ?? [])];
          const askedIds = new Set<string>();
          for (const it of rawItems) {
            if (it.status === 'ARCHIVED') askedIds.add(it.id);
          }

          const displayItems: CrtMenuItem[] = [...rawItems];
          if (config.allowStepAway !== false) {
            displayItems.push({
              id: 'x',
              label: 'Step away from terminal',
              response: 'Terminal session disconnected.',
              status: 'DISCONNECT',
            });
          }

          let selectedIndex = 0;
          let typingTimer: ReturnType<typeof setTimeout> | null = null;

          const displayOutput = (item: CrtMenuItem, animate = true) => {
            if (item.id === 'x') {
              outputStatus.textContent = 'DISCONNECTED';
              outputContent.textContent = 'Terminal session idle. Press [ 5 ] or Esc to step away.';
              return;
            }

            outputStatus.textContent = 'DECRYPTED RECORD';
            resolvedValue = item.id;
            askedIds.add(item.id);
            if (config.onSelect) {
              void config.onSelect(item.id);
            }

            updateItemStatuses();

            const text = Array.isArray(item.response) ? item.response.join('\n\n') : item.response;
            if (typingTimer) {
              clearTimeout(typingTimer);
              typingTimer = null;
            }

            if (!animate) {
              outputContent.textContent = text;
              return;
            }

            outputContent.textContent = '';
            let charIndex = 0;
            audio.confirm();

            const typeChar = () => {
              if (charIndex < text.length) {
                outputContent.textContent = text.slice(0, charIndex + 1);
                if (charIndex % 3 === 0 && text[charIndex] !== ' ') audio.type();
                charIndex++;
                typingTimer = setTimeout(typeChar, text[charIndex - 1] === '.' ? 70 : 14);
              } else {
                typingTimer = null;
              }
            };
            typeChar();
          };

          const btns = displayItems.map((item, i) => {
            const isAsked = askedIds.has(item.id);
            const btn = el('button', `crt-menu-item choice ${isAsked ? 'asked' : ''}`, menuList);
            const statusTag = isAsked ? 'ARCHIVED' : (item.status ?? '');
            btn.innerHTML = `
              <span class="crt-item-num choice-n">[ ${i + 1} ]</span>
              <span class="crt-item-label choice-l">${item.label}</span>
              <span class="crt-item-status choice-h">${statusTag}</span>
            `;
            btn.addEventListener('mouseenter', () => {
              selectedIndex = i;
              updateSelection();
            });
            btn.addEventListener('click', (ev) => {
              ev.stopPropagation();
              if (item.id === 'x') {
                if (typingTimer) clearTimeout(typingTimer);
                closeFrame();
                return;
              }
              selectedIndex = i;
              updateSelection();
              displayOutput(item, true);
            });
            return btn;
          });

          const updateItemStatuses = () => {
            displayItems.forEach((item, i) => {
              const statusEl = btns[i]?.querySelector('.crt-item-status');
              if (statusEl && item.id !== 'x') {
                statusEl.textContent = askedIds.has(item.id) ? 'ARCHIVED' : (item.status ?? '');
              }
            });
          };

          const updateSelection = () => {
            btns.forEach((b, i) => b.classList.toggle('sel', i === selectedIndex));
          };
          updateSelection();

          // Display the first query's output immediately on open so text output answers are visible!
          if (displayItems.length > 0 && displayItems[0].id !== 'x') {
            displayOutput(displayItems[0], false);
          }

          const onNavKey = (e: KeyboardEvent) => {
            const n = parseInt(e.key, 10);
            if (n >= 1 && n <= displayItems.length) {
              e.preventDefault();
              selectedIndex = n - 1;
              updateSelection();
              if (displayItems[selectedIndex].id === 'x') {
                if (typingTimer) clearTimeout(typingTimer);
                closeFrame();
              } else {
                displayOutput(displayItems[selectedIndex], true);
              }
              return;
            }
            if (['ArrowUp', 'w', 'W'].includes(e.key)) {
              e.preventDefault();
              selectedIndex = (selectedIndex + displayItems.length - 1) % displayItems.length;
              updateSelection();
              audio.blip();
              if (displayItems[selectedIndex].id !== 'x') {
                displayOutput(displayItems[selectedIndex], false);
              }
            }
            if (['ArrowDown', 's', 'S'].includes(e.key)) {
              e.preventDefault();
              selectedIndex = (selectedIndex + 1) % displayItems.length;
              updateSelection();
              audio.blip();
              if (displayItems[selectedIndex].id !== 'x') {
                displayOutput(displayItems[selectedIndex], false);
              }
            }
            if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
              e.preventDefault();
              if (displayItems[selectedIndex].id === 'x') {
                if (typingTimer) clearTimeout(typingTimer);
                closeFrame();
              } else {
                displayOutput(displayItems[selectedIndex], true);
              }
            }
          };

          window.addEventListener('keydown', onNavKey);
        },
        () => {
          resolve(resolvedValue);
        }
      );
    });
  }

  private buildTerminalFrame(
    title: string,
    systemTag: string,
    contentBuilder: (body: HTMLElement, finish: () => void, close: () => void) => void,
    onClose?: () => void
  ) {
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
    el('div', 'crt-foot-status', foot, '<span class="crt-blink">█</span> ASPHODEL_SYS // READY');
    const termMore = el('div', 'term-more crt-foot-hint hidden', foot, '<kbd>E</kbd> / <kbd>Enter</kbd> Close terminal');

    let finished = false;
    const finish = () => {
      finished = true;
      termMore.classList.remove('hidden');
    };

    const close = () => {
      audio.blip();
      this.destroy(onClose);
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

    contentBuilder(body, finish, close);
  }

  close() {
    audio.blip();
    this.destroy();
  }

  private destroy(onClose?: () => void) {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener, true);
      this.keyListener = undefined;
    }
    if (this.wrap) {
      this.wrap.remove();
      this.wrap = undefined;
    }
    onClose?.();
  }
}
