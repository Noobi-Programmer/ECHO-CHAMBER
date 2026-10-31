// Local browser save system for ECHO//CHAMBER
// Follows docs/technical/LOCAL_BROWSER_SAVE_SPEC.md

export const SAVE_KEY = 'echo-chamber:save:v1';

export interface EchoSaveSample {
  x: number;
  y: number;
  tex: string;
  flip: boolean;
}

export interface EchoSaveV1 {
  version: 1;
  savedAt: number;
  step: 'card' | 'lab' | 'core' | 'final';
  player: { x: number; y: number };
  flags: string[];
  recallN: number;
  qaAsked: string[];
  samples: EchoSaveSample[];
}

export class SaveSystem {
  private key = SAVE_KEY;
  private warnedQuota = false;

  hasSave(): boolean {
    return this.getSave() !== null;
  }

  getSave(): EchoSaveV1 | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return null;
      const data = JSON.parse(raw) as Partial<EchoSaveV1>;
      if (
        data.version !== 1 ||
        !data.savedAt ||
        !data.step ||
        !['card', 'lab', 'core', 'final'].includes(data.step) ||
        !data.player ||
        typeof data.player.x !== 'number' ||
        typeof data.player.y !== 'number' ||
        !Array.isArray(data.flags) ||
        typeof data.recallN !== 'number'
      ) {
        return null;
      }
      return data as EchoSaveV1;
    } catch (err) {
      console.warn('[SaveSystem] Failed to parse local save:', err);
      return null;
    }
  }

  saveGame(state: Omit<EchoSaveV1, 'version' | 'savedAt'>): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const payload: EchoSaveV1 = {
        version: 1,
        savedAt: Date.now(),
        step: state.step,
        player: {
          x: Math.round(state.player.x),
          y: Math.round(state.player.y),
        },
        flags: state.flags.filter((f) => !f.startsWith('l_')),
        recallN: state.recallN,
        qaAsked: state.qaAsked,
        samples: (state.samples || []).slice(-70),
      };
      window.localStorage.setItem(this.key, JSON.stringify(payload));
      return true;
    } catch (err) {
      if (!this.warnedQuota) {
        this.warnedQuota = true;
        console.warn('[SaveSystem] Could not save progress to localStorage:', err);
      }
      return false;
    }
  }

  clearSave(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.key);
      }
    } catch (err) {
      console.warn('[SaveSystem] Failed to clear local save:', err);
    }
  }

  getSaveSummary(): { label: string; date: string; recall: number } | null {
    const save = this.getSave();
    if (!save) return null;
    const stepLabels: Record<string, string> = {
      card: 'Cradle Bay',
      lab: 'Observation Lab',
      core: 'The Well / Core',
      final: 'Restoration Terminal',
    };
    const dateStr = new Date(save.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      label: stepLabels[save.step] ?? 'Station',
      date: dateStr,
      recall: save.recallN,
    };
  }
}

export const saveSystem = new SaveSystem();
