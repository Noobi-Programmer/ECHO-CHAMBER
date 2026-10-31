// Reusable Evidence Comparison Interface for ECHO//CHAMBER
import { audio } from '../audio';
import type { ContestedMemoryConfig, EvidenceOption } from './types';

const ADV_KEYS = new Set(['e', 'E', ' ', 'Enter']);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent?: HTMLElement, html = '') {
  const e = document.createElement(tag);
  e.className = cls;
  if (html) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

export class EvidenceComparison {
  private wrap?: HTMLElement;
  private keyListener?: (e: KeyboardEvent) => void;

  constructor(private root: HTMLElement) {}

  /**
   * Opens the evidence comparison and arbitration modal
   */
  open(config: ContestedMemoryConfig): Promise<{ memoryId: string; evidenceId: string } | null> {
    return new Promise((resolve) => {
      this.buildComparisonUI(config, (result) => {
        this.destroy();
        resolve(result);
      });
    });
  }

  private buildComparisonUI(
    config: ContestedMemoryConfig,
    onComplete: (res: { memoryId: string; evidenceId: string } | null) => void
  ) {
    if (this.wrap) this.destroy();

    this.wrap = el('div', 'evidence-modal-backdrop', this.root);
    const card = el('div', 'evidence-card panel', this.wrap); // includes .panel for automated test compatibility
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', config.title);

    // Header
    const head = el('div', 'evidence-header', card);
    const headLeft = el('div', 'evidence-head-left', head);
    el('div', 'evidence-tag', headLeft, 'RESONANCE OVERSIGHT // MEMORY ARBITRATION PROTOCOL');
    el('div', 'evidence-title', headLeft, config.title);

    const headRight = el('div', 'evidence-head-right', head);
    const closeBtn = el('button', 'evidence-close-btn', headRight, '✕');
    closeBtn.title = 'Close Console (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.blip();
      onComplete(null);
    });

    // Subtitle / Directive banner
    el('div', 'evidence-directive', card, `
      <span class="evidence-directive-icon">⚖</span>
      <span class="evidence-directive-text">Two conflicting memory recordings exist for this timestamp. Select a memory and corroborate with physical evidence from the present.</span>
    `);

    // Main Columns Container (Dual Memory Cards)
    const columnsContainer = el('div', 'evidence-columns', card);

    let selectedMemory = 'M'; // default selection
    let selectedEvidence: string | null = null;

    // Memory Card Alpha (Mira Sen)
    const cardM = el('div', `evidence-column memory-m ${selectedMemory === 'M' ? 'selected' : ''}`, columnsContainer);
    cardM.innerHTML = `
      <div class="col-head">
        <span class="col-badge badge-m">SOURCE: ${config.versionM.speaker}</span>
        <span class="col-time">${config.versionM.timestamp}</span>
      </div>
      <div class="col-quote">"${config.versionM.quote}"</div>
      <div class="col-summary">${config.versionM.summary}</div>
      <div class="col-footer">
        <span class="col-status">${config.versionM.status}</span>
        <button class="col-select-btn choice-btn">${selectedMemory === 'M' ? 'SELECTED ◈' : 'SELECT MEMORY'}</button>
      </div>
    `;

    // Memory Card Beta (Elias Voss)
    const cardV = el('div', `evidence-column memory-v ${selectedMemory === 'V' ? 'selected' : ''}`, columnsContainer);
    cardV.innerHTML = `
      <div class="col-head">
        <span class="col-badge badge-v">SOURCE: ${config.versionV.speaker}</span>
        <span class="col-time">${config.versionV.timestamp}</span>
      </div>
      <div class="col-quote">"${config.versionV.quote}"</div>
      <div class="col-summary">${config.versionV.summary}</div>
      <div class="col-footer">
        <span class="col-status">${config.versionV.status}</span>
        <button class="col-select-btn choice-btn">${selectedMemory === 'V' ? 'SELECTED ◈' : 'SELECT MEMORY'}</button>
      </div>
    `;

    const updateMemoryCards = () => {
      cardM.classList.toggle('selected', selectedMemory === 'M');
      cardV.classList.toggle('selected', selectedMemory === 'V');
      cardM.querySelector('.col-select-btn')!.textContent = selectedMemory === 'M' ? 'SELECTED ◈' : 'SELECT MEMORY';
      cardV.querySelector('.col-select-btn')!.textContent = selectedMemory === 'V' ? 'SELECTED ◈' : 'SELECT MEMORY';
    };

    cardM.addEventListener('click', () => {
      selectedMemory = 'M';
      audio.blip();
      updateMemoryCards();
    });

    cardV.addEventListener('click', () => {
      selectedMemory = 'V';
      audio.blip();
      updateMemoryCards();
    });

    // Evidence Docket (Physical items from Present)
    const docketSection = el('div', 'evidence-docket-section', card);
    el('div', 'docket-title', docketSection, 'CORROBORATING PHYSICAL EVIDENCE (PRESENT):');
    const docketGrid = el('div', 'docket-grid choices', docketSection); // .choices class for test compatibility

    const evidenceBtns = config.evidenceList.map((item: EvidenceOption, idx: number) => {
      const b = el('button', 'docket-item choice', docketGrid); // .choice for test runner
      b.innerHTML = `
        <span class="docket-num choice-n">[ ${idx + 1} ]</span>
        <span class="docket-label choice-l">${item.label}</span>
      `;
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        selectedEvidence = item.id;
        audio.blip();
        evidenceBtns.forEach((btn: HTMLElement) => btn.classList.remove('sel'));
        b.classList.add('sel');
        triggerCorroborationTest();
      });
      return b;
    });

    // Bottom Action Bar
    const foot = el('div', 'evidence-foot', card);
    el('div', 'evidence-foot-hint', foot, `
      <span><kbd>1</kbd>–<kbd>${config.evidenceList.length}</kbd> Select Evidence</span>
      <span><kbd>Esc</kbd> Step away</span>
    `);

    const triggerCorroborationTest = () => {
      if (!selectedEvidence) return;
      onComplete({ memoryId: selectedMemory, evidenceId: selectedEvidence });
    };

    // Keyboard Shortcuts
    this.keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        audio.blip();
        onComplete(null);
        return;
      }
      if (e.key === '1' && config.evidenceList.length >= 1) {
        selectedEvidence = config.evidenceList[0].id;
        triggerCorroborationTest();
        return;
      }
      if (e.key === '2' && config.evidenceList.length >= 2) {
        selectedEvidence = config.evidenceList[1].id;
        triggerCorroborationTest();
        return;
      }
      if (e.key === '3' && config.evidenceList.length >= 3) {
        selectedEvidence = config.evidenceList[2].id;
        triggerCorroborationTest();
        return;
      }
      if (e.key === '4' && config.evidenceList.length >= 4) {
        selectedEvidence = config.evidenceList[3].id;
        triggerCorroborationTest();
        return;
      }
    };
    window.addEventListener('keydown', this.keyListener, true);
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
