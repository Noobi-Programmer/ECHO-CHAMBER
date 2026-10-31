// ECHO//CHAMBER — Inspection Illustration Registry & Manifest Mappings
// Maps station interactions to delivered production illustrations from commit 9f091a4

export interface IllustrationData {
  id: string;
  present: string;
  echo?: string;
  detail?: string;
  title: string;
  tag: string;
  overlayText?: string;
  notes?: string;
}

export const ILLUSTRATION_MAP: Record<string, IllustrationData> = {
  // 1. Cradle Bay — Reconstruction Unit
  cradle: {
    id: 'cradle',
    present: 'assets/illustrations/cradle/cradle-chamber-001.png',
    echo: 'assets/illustrations/cradle/cradle-chamber-echo-001.png',
    title: 'MEDICAL RECONSTRUCTION CHAMBER // UNIT 17',
    tag: 'CRADLE BAY // CHAMBER 017',
    notes: 'Empty medical reconstruction chamber close-up in present; 16 tally marks scratched on lid interior in ECHO.',
  },

  // 2. Cradle Bay — Voss Cryostasis Pod
  vossPod: {
    id: 'vossPod',
    present: 'assets/illustrations/cradle/voss-pod-001.png',
    title: 'CRYOSTASIS UNIT // DR. E. VOSS',
    tag: 'CRADLE BAY // STASIS',
    notes: 'Voss preserved behind frosted stasis glass.',
  },

  // 3. Cradle Bay — Ceramic Mug (Present / ECHO Pair)
  mug: {
    id: 'mug',
    present: 'assets/illustrations/cradle/mug-present-001.png',
    echo: 'assets/illustrations/cradle/mug-echo-001.png',
    title: 'CERAMIC MUG // PERSONAL ARTIFACT',
    tag: 'EVIDENCE // MIRA SEN',
    notes: 'Cracked/glued handle in present; restored handle with smiley & steam in ECHO.',
  },

  // 4. Cradle Bay — Locker Interior
  locker: {
    id: 'locker',
    present: 'assets/illustrations/cradle/locker-interior-001.png',
    title: 'LOCKER INTERIOR // DR. M. SEN',
    tag: 'CRADLE BAY // LOCKER 04',
    notes: 'Locker interior staging art; card reveal area left clear.',
  },

  // 5. Cradle Bay — Floor Plate 3
  plate3: {
    id: 'plate3',
    present: 'assets/illustrations/cradle/floor-plate-001.png',
    title: 'SUB-FLOOR CONDUIT // ACCESS PLATE 3',
    tag: 'CONDUIT // FLOOR PLATE 03',
    notes: 'Floor plate staging art; card reveal driven by code.',
  },
  card: {
    id: 'card',
    present: 'assets/illustrations/cradle/floor-plate-001.png',
    title: 'SUB-FLOOR CONDUIT // ACCESS PLATE 3',
    tag: 'CONDUIT // FLOOR PLATE 03',
    notes: 'Floor plate staging art; card reveal driven by code.',
  },

  // 6. Observation Lab — Observation Window
  window: {
    id: 'window',
    present: 'assets/illustrations/observation-lab/observation-window-001.png',
    title: 'OBSERVATION PORT // THE EYE STORM',
    tag: 'OBSERVATION LAB // WINDOW',
    notes: 'Ice giant and Eye storm viewport.',
  },

  // 7. Observation Lab — Wall Inscription Rule
  wallRule: {
    id: 'wallRule',
    present: 'assets/illustrations/observation-lab/wall-inscription-001.png',
    title: 'STATION PRINCIPLE // WALL INSCRIPTION',
    tag: 'OBSERVATION LAB // WALL',
    overlayText: 'A MEMORY YOU CAN EDIT IS NOT EVIDENCE.',
    notes: 'Blank central panel; canonical wording rendered by UI text layer.',
  },

  // 8. Observation Lab — Console Evidence & Snapped Key
  keySlot: {
    id: 'keySlot',
    present: 'assets/illustrations/observation-lab/console-evidence-001.png',
    detail: 'assets/illustrations/observation-lab/console-key-detail-001.png',
    title: 'LETHE REMOTE HOUSING // KEY SLOT',
    tag: 'ECHO OVERSIGHT // KEY MECHANISM',
    notes: 'Console with snapped shaft; optional macro detail of key mechanism.',
  },

  // 9. Observation Lab — Archival Photograph (Present / ECHO Pair)
  photo: {
    id: 'photo',
    present: 'assets/illustrations/observation-lab/photograph-present-001.png',
    echo: 'assets/illustrations/observation-lab/photograph-echo-001.png',
    title: 'ARCHIVAL PHOTOGRAPH // ASPHODEL RESEARCH TEAM',
    tag: 'EVIDENCE // PHOTOGRAPH',
    notes: 'Damaged in present; pristine in ECHO.',
  },

  // 10. Observation Lab — Voss Desk / Recorder Desk
  vossDesk: {
    id: 'vossDesk',
    present: 'assets/illustrations/observation-lab/research-desk-001.png',
    title: 'RESEARCH DESK // FIELD AUDIO RECORDER',
    tag: 'OBSERVATION LAB // VOSS DESK',
    notes: 'Recorder and unmarked research objects.',
  },

  // 11. The Well / Resonance Core — Archive Console
  wellConsole: {
    id: 'wellConsole',
    present: 'assets/illustrations/well/well-archive-001.png',
    title: 'THE WELL // ARCHIVE CONSOLE',
    tag: 'RESONANCE CORE // CONSOLE',
    notes: 'Archive console close-up.',
  },

  // 12. The Well / Resonance Core — Lethe Purge Lever
  lethe: {
    id: 'lethe',
    present: 'assets/illustrations/well/lethe-lever-001.png',
    title: 'LETHE MECHANISM // FINAL PURGE',
    tag: 'RESONANCE CORE // LETHE',
    notes: 'Closed protective glass; lever-pull state driven by gameplay logic.',
  },
};

/** Lookup illustration mapping for a given interaction ID */
export function getIllustration(id: string): IllustrationData | null {
  return ILLUSTRATION_MAP[id] ?? null;
}

/** Preload all delivered illustration PNGs into browser cache */
export function preloadIllustrations(): void {
  const paths = new Set<string>();
  for (const item of Object.values(ILLUSTRATION_MAP)) {
    if (item.present) paths.add(item.present);
    if (item.echo) paths.add(item.echo);
    if (item.detail) paths.add(item.detail);
  }
  for (const src of paths) {
    const img = new Image();
    img.src = src;
  }
}

