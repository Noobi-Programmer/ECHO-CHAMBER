# AGENT_HANDOFF — asset production (ASSET-002)

**Read this first.** It is the only file you need to resume this work without the original conversation.

## Task
Produce the asset blueprint for ECHO//CHAMBER so that OmniRush (sprites), Neel + agents (audio) and the game team can work independently, with every asset swappable by stable ID. Full brief: the "MASTER ASSET INVENTORY, GENERATION & HANDOFF SPECIFICATION" prompt (see §Deliverables for the file list).

## Branches (obey `AGENT_SYNC.md`)
| Branch | Purpose | State |
|---|---|---|
| `agent/claude/gameplay-vertical-slice-001` | Playable game (Phaser 3 + TS + Vite). Commit `be30449`. | Playable; e2e test 37/37 at last full run. **Do not edit from this task.** |
| `agent/claude/assets-001` | This task. Branched from `be30449`. Write-set: `docs/assets/**` only. | In progress |
| `agent/claude/story-001` | Narrative proposal (`docs/narrative/**`), commit `95184a2`. | Proposal, not approved canon |

No branch has been pushed: the session has no GitHub write access (see root-level notes from the user).

## Status by block
| Block | Scope | Status |
|---|---|---|
| 0 | Repo + implementation audit | **DONE** (this file §Audit) |
| 1 | Asset inventory (visual, animation, audio, voice, cinematic) | **DONE** (P0/P1/P2 split; see `ASSET_BIBLE.md`) |
| 2 | Replacement architecture, manifests, ID scheme | NOT STARTED |
| 3 | Sprite generation package + OmniRush brief | NOT STARTED |
| 4 | Audio package + Neel brief | NOT STARTED |
| 5 | Integration contracts, validation, gap report | NOT STARTED |

**Next block: BLOCK 2** (replacement architecture: final ID scheme, manifest loader contract, versioning/rollback, fallback). Then Block 3 (protagonist prompts first: 3 concepts, no full animation set until one is approved), Block 4 (Neel brief), Block 5 (validation + `ASSET_GAP_REPORT.md`).

## Audit (Block 0): what actually exists

### Build facts
- Engine: Phaser 3.90.0, TypeScript 5.9.3, Vite 8.3.5. `npm run build` → `dist/`. Internal resolution **320×180**, integer-ish scaling via `Phaser.Scale.FIT`, `pixelArt: true`.
- `public/` is **empty**. There are **no shipped image or audio files**. `ASSET_REGISTER.csv` has a header row and **zero approved assets**. No asset has been licence-audited.
- Everything visible is generated in code at boot:
  - Art: `src/art/textures.ts` (canvas primitives + string-row pixel sprites).
  - Sound: `src/systems/audio.ts` (WebAudio synthesis; no samples).
  - Text/narrative: `src/data/story.ts` (proposal text, not approved).
  - UI: DOM overlay (`src/systems/ui.ts`, `src/style.css`), fonts VT323 + IBM Plex Mono via `@fontsource` (OFL licence, bundled).
- Asset references in code are **hardcoded texture keys** (`'p_down_0'`, `'cradle'`…) and direct function calls (`audio.snap()`). **There is no asset manifest or ID layer yet.** Block 2 must design one; the game team must then adapt the loader.

### Implemented visual assets (all placeholders, code-generated)
Characters (frames are 12×16 px, 2 walk frames per direction): `p_{down,up,side}_{0,1}` player; `ghost_*` faceless iteration; `mira_*`, `miraface_*` (with/without face), `mira_cane`, `miraface_cane`, `voss_down`, `voss_up`, `voss_faceless`, `ghost_kneel`.
Environment/props: `map` (whole station, 704×560), `cradle`, `cradle_closed`, `tally`, `voss_pod`, `voss_pod_open`, `terminal`, `mug`, `mug_echo`, `locker`, `locker_open`, `card`, `plate`, `plate_raised`, `plate_open`, `reader_red`, `reader_green`, `keypad`, `slab`, `sh_circle/triangle/square/diamond`, `window`, `dots`, `dots_echo`, `my_dot`, `console`, `console_key`, `desk`, `photo_down`, `photo_up`, `recorder`, `recorder_sealed`, `glue`, `tender_0/1`, `well`, `well_dark`, `well_console`, `stool`, `lethe`, `lethe_glass`, `lethe_pulled`, doors `door_lab`, `door_lab_open`, `door_core`, `door_core_open`.
FX textures: `light`, `scanlines`, `noise`, `vignette`, `px`.

### Implemented audio (synthesised cues, no files)
Ambience bed with per-room pitch (`room`) and ECHO low-pass (`echoMix`); cues: `echoOn`, `echoOff`, `echoDenied`, `blip`, `confirm`, `deny`, `relay`, `snap`, `door`, `plate`, `static`, `orpheus`, `frost`, `stasis`, `lever`, `type`, `keyTone(0-3)`, `breath`, and `motif(first|major|minor|open)` (four-note motif). **No music tracks. No voice.** All dialogue is on-screen text.

### Implemented UI
Title screen (logo is styled text, not an image), controls list, ORPHEUS panel, inspect panel, choice list, shape keypad, terminal log, frost-writing, ECHO meter, source tag, recall readout, subtitles, toasts, ending screen. **Not implemented:** pause menu, settings/volume sliders (only `M` mute), credits screen, separate tutorial overlay.

### Not implemented / known weak points
- **Protagonist sprite is too chibi** (12×16 px, large head, per the art director's note). This is the top visual fix.
- No walk/idle/examine/ECHO animation sets beyond 2-frame walk; no appear/dissolve animation (ghosts fade by alpha).
- No tilesets: the map is one procedurally painted canvas, not a tile atlas.
- No particles (dust/sparks) beyond a noise overlay.

### Story dependencies (do not invent)
Source of requirements: `docs/narrative/ASSET_BRIEF.md` and `NARRATIVE_SCRIPT.md` on branch `agent/claude/story-001` (**proposal, `STORY_LOCK: DRAFT`**). Any asset or voice line tied to that text is **pending Abi's approval**. The playable build already uses a subset of that text (`src/data/story.ts`).

### How to read the narrative branch without checking it out
`git show agent/claude/story-001:docs/narrative/ASSET_BRIEF.md`

## Deliverables (all under `docs/assets/`)
`ASSET_BIBLE.md` · `VISUAL_ASSET_MANIFEST.csv` · `ANIMATION_MANIFEST.csv` · `AUDIO_MANIFEST.csv` · `VOICE_RECORDING_MANIFEST.csv` · `CINEMATIC_CUE_SHEET.md` · `SPRITE_GENERATION_PROMPTS.md` · `OMNIRUSH_PRODUCTION_BRIEF.md` · `NEEL_AUDIO_PRODUCTION_BRIEF.md` · `ASSET_REPLACEMENT_GUIDE.md` · `ASSET_GAP_REPORT.md` · `AGENT_HANDOFF.md` (this file).
Existing after Block 1: this file, `ASSET_BIBLE.md`, the four manifests, `CINEMATIC_CUE_SHEET.md`.

## Open decisions / unverified
- Whether OmniRush can reach Universal-LPC or AutoSprite is **unverified**. Do not assume; Block 3 must include a manual fallback.
- ElevenLabs licence terms for shipped voice are **unverified**.
- Whether the build will use voice at all is undecided (text-only is the current, safe state).

## Changed paths
- Block 0: `docs/assets/AGENT_HANDOFF.md`
- Block 1: `docs/assets/{ASSET_BIBLE.md, VISUAL_ASSET_MANIFEST.csv, ANIMATION_MANIFEST.csv, AUDIO_MANIFEST.csv, VOICE_RECORDING_MANIFEST.csv, CINEMATIC_CUE_SHEET.md}` and this file. Validated by script: no duplicate IDs, uniform columns.

## Priority definition (agreed with Abi)
P0 = needed by the playable demo today (most already implemented as code-generated placeholders). P1 = cinematic polish. P2 = future production. Every row has owner, target filename, spec, status.
