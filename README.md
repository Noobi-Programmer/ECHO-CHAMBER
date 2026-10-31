# ECHO//CHAMBER — Iteration 017

> **A memory can be evidence. It can also be a lie.**

A short, browser-first psychological sci-fi thriller about memory, identity, and the choices that make a person.

You wake aboard **Asphodel**, an isolated research station orbiting an ice giant. The station's caretaker, ORPHEUS, asks you to help restore its incomplete records. But the rooms remember things the station's logs do not—and those memories do not always agree.

Use **ECHO** to reveal fragments of the past, compare them with the physical evidence in front of you, and discover why someone has been leaving clues for the next person to wake.

## The experience

- Explore three connected spaces: Cradle Bay, the Observation Lab, and the Well.
- Hold ECHO to reveal authored memories layered over the present.
- Investigate objects, recordings, terminals, and conflicting accounts.
- Corroborate memories using evidence in the physical world.
- Solve environmental puzzles, reconstruct a sequence of events, and make a final choice.
- Follow a compact, atmospheric story designed around discovery rather than combat or jump scares.

## Controls

| Key | Action |
|---|---|
| `W A S D` / Arrow keys | Move |
| `Shift` | Run |
| `E` / `Space` | Inspect, interact, or continue dialogue |
| Hold `Q` | Activate ECHO and reveal the past |
| `Tab` | Open inventory / evidence |
| `?` | Show keyboard shortcuts |
| `M` | Mute / unmute audio |
| `Esc` | Close an interface / pause where supported |

Headphones recommended. The current title screen estimates a 6–8 minute playthrough; exploration and reading pace may change that.

## Play in the browser

The project is built as a static web game with Phaser 3, TypeScript, and Vite. Once a browser build is published, it is intended to run directly on itch.io without a separate download.

**Current publication status:** in development. This repository is not yet a claim that a final public release has been shipped.

## Run locally

Requirements: Node.js and a package manager.

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Type-check and create a production build
npm run build

# Preview the production build locally
npm run preview
```

Useful repository checks:

```bash
npm run plan:validate
npm run skills:check
```

`npm run test:e2e` runs the Playwright playthrough script; Playwright and its browser need to be available in the development environment.

The production build is written to `dist/`. For an itch.io HTML build, ZIP the **contents** of `dist/` so `index.html` is at the root of the ZIP—not inside an extra `dist/` folder.

## Progress and saves

**Browser-local saving is not implemented in the inspected build.** Reloading the page currently starts the experience again. There is no account system, cloud save, or cross-device synchronisation.

The recommended first save implementation is a single automatic save slot in the browser's `localStorage`. It should preserve story flags, the current safe checkpoint, player position, recall/evidence state, and the movement samples needed for the self-replay. A Continue / New Game choice can then be shown on the title screen. This requires no backend or player account; saves remain local to that browser profile and device.

## Technical overview

- **Engine:** Phaser 3.90
- **Language:** TypeScript
- **Build tool:** Vite 8
- **Rendering:** 320 × 180 internal resolution, scaled to a 16:9 game stage with pixel-art rendering
- **Architecture:** one primary Station scene, DOM-based interface overlays, and an audio director with sample playback and procedural fallbacks
- **Backend:** none required for the current game

The game currently creates its main runtime textures through `generateTextures()` in `src/art/textures.ts`. The repository also contains separate illustration, character, audio, and voice-over asset directories; check the manifests and actual scene references before assuming every staged asset is already used in gameplay.

## Project structure

```text
src/
  main.ts                 # Phaser bootstrap
  art/textures.ts         # Runtime texture generation
  data/story.ts           # Dialogue, recordings, puzzle fragments and endings
  scenes/StationScene.ts  # Exploration, ECHO, interactions and story flow
  systems/audio.ts        # Audio director
  systems/ui.ts           # Dialogue, terminals, keypad and interface overlays
  style.css               # Game and UI styling
  world/                  # Map, rooms and coordinates
public/assets/            # Static assets served by Vite
assets/                   # Staged source audio and voice-over material
docs/                     # Design, narrative, coordination and asset documentation
tests/                    # Browser playthrough test
```

## Development notes

- The narrative and story bible are marked provisional in the project documentation; story changes should follow the approval process documented in `docs/coordination/AGENT_SYNC.md`.
- The inspection-illustration bundle is catalogued in `docs/assets/ILLUSTRATION_MANIFEST.csv`.
- Voice-over source files are staged separately. The inspected runtime audio code does not yet demonstrate that those MP3 voice files are played in-game, so this README does not describe the current build as fully voice acted.
- The game is designed around keyboard controls and desktop browser play. Mobile support has not been established.

## Credits

Created for CodeDay Bengaluru 2026. Built by the ECHO//CHAMBER team.

### 3. Narrative & Story (`docs/narrative/`)
- [`docs/narrative/WALKTHROUGH.md`](./docs/narrative/WALKTHROUGH.md) — Complete game walkthrough, puzzle solutions, and endings guide.
- [`docs/narrative/STORY_BIBLE.md`](./docs/narrative/STORY_BIBLE.md) — Canonical story bible, character rules, and guardrails.
- [`docs/narrative/STORY_DECISIONS.md`](./docs/narrative/STORY_DECISIONS.md) — Story decisions and approval lock status.
- [`docs/narrative/NARRATIVE_SCRIPT.md`](./docs/narrative/NARRATIVE_SCRIPT.md) — Full dialogue script, cues, and scene texts.
- [`docs/narrative/CHARACTER_BIBLE.md`](./docs/narrative/CHARACTER_BIBLE.md) — Character dossiers and voices.
- [`docs/narrative/CHRONOLOGY_AND_CLUE_MAP.md`](./docs/narrative/CHRONOLOGY_AND_CLUE_MAP.md) — Chronological timeline and clue cross-references.
- [`docs/narrative/STORY_WORKSHOP.md`](./docs/narrative/STORY_WORKSHOP.md) — Story workshop synthesis and treatment comparisons.
- [`docs/narrative/STORY_REVIEW_RUBRIC.md`](./docs/narrative/STORY_REVIEW_RUBRIC.md) — Quality evaluation rubric.

### 4. Technical & Engineering (`docs/technical/`)
- [`docs/technical/LOCAL_BROWSER_SAVE_SPEC.md`](./docs/technical/LOCAL_BROWSER_SAVE_SPEC.md) — Browser local storage save and restore specification.
- [`docs/technical/TECHNICAL_RESEARCH_PLAN.md`](./docs/technical/TECHNICAL_RESEARCH_PLAN.md) — Engine benchmark and technical spikes.
- [`docs/technical/ARCHITECTURE_PROPOSAL.md`](./docs/technical/ARCHITECTURE_PROPOSAL.md) — Engine architecture, state machine, and systems.
- [`docs/technical/QA_PLAN.md`](./docs/technical/QA_PLAN.md) — Functional, accessibility, and blind-playtest criteria.
- [`docs/technical/SOURCES_AND_RESEARCH.md`](./docs/technical/SOURCES_AND_RESEARCH.md) — Official documentation and research references.

### 5. Assets & Licensing (`docs/assets/`)
- [`docs/assets/ASSET_PIPELINE.md`](./docs/assets/ASSET_PIPELINE.md) — Safe asset acquisition, audit, and ingestion pipeline.
- [`docs/assets/ASSET_REGISTER.csv`](./docs/assets/ASSET_REGISTER.csv) — Register of all imported third-party assets and licences.
- [`docs/assets/ASSET_SOURCES.md`](./docs/assets/ASSET_SOURCES.md) — Permitted sources and legal verification rules.
- Manifests: `AUDIO_MANIFEST.csv`, `ANIMATION_MANIFEST.csv`, `VISUAL_ASSET_MANIFEST.csv`, `VOICE_RECORDING_MANIFEST.csv`.

---

## Agent Runtimes & Skills

This repository uses the open `SKILL.md` standard:
- **Canonical Library:** `.agents/skills/<skill-id>/SKILL.md`
- **Claude / OmniRush Mirror:** `.claude/skills/<skill-id>/SKILL.md`

All agents automatically discover and load only task-relevant skills. Run `npm run skills:check` to verify skill validity.

---

## 🎮 Complete Game Walkthrough & Puzzle Guide

Detailed narrative documentation lives in [`docs/narrative/WALKTHROUGH.md`](./docs/narrative/WALKTHROUGH.md).

### Station Controls & Shortcuts
- **Movement:** <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or Arrow Keys
- **Run / Sprint:** Hold <kbd>Shift</kbd> (1.45× speed)
- **Interact / Inspect:** <kbd>E</kbd>, <kbd>Space</kbd>, or <kbd>Enter</kbd>
- **ECHO (Memory Traces):** Hold <kbd>Q</kbd>
- **Inventory / Evidence:** <kbd>Tab</kbd>
- **Keyboard Shortcuts:** <kbd>?</kbd> (`Shift` + `/`) or top-right `?` button
- **Mute Audio:** <kbd>M</kbd>

### Core Puzzles & Solutions

1. **Cradle Bay — Transit Keycard:**
   - Inspect locker `M. SEN` (biometric palm reader opens it).
   - Hold <kbd>Q</kbd> to see an echo hiding the card under the floor plates.
   - Pry loose **Deck Plate 03** to obtain the **Maintenance Keycard**.
   - Swipe card at the north bulkhead door.

2. **Observation Lab — Contested Memory Corroboration:**
   - Inspect the viewport and select **"Add a dot where the storm is today"** *(Prerequisite for the Secret True Ending)*.
   - Inspect the key slot on the central console to discover the **Snapped Brass Key Fragment**.
   - Read the stencilled rule on Bulkhead 4: *"A MEMORY YOU CAN EDIT IS NOT EVIDENCE."*
   - Access the Contested Memory console:
     - Choose **Mira's Memory (`M`)**: *"Turn it off. Promise me."*
     - Present Physical Evidence: **"The key snapped off inside the slot" (`slot`)**.
     - ORPHEUS accepts the corroboration and unseals Mira's audio memo (REC_03) and the Core keypad.

3. **Core Blast Door Keypad:**
   - Keypad sequence: **$\bigcirc \rightarrow \triangle \rightarrow \diamondsuit$** (Circle &rarr; Triangle &rarr; Diamond).

4. **The Well — Continuity Chronology Puzzle:**
   - Arrange the loose archive fragments in chronological order:
     - **Slot 1 (`F1`):** *A woman marks the storm on the glass. Her hands are steady. A key hangs on her lanyard.*
     - **Slot 2 (`F2`):** *A key snaps in the console slot. The woman is leaning on a cane.*
     - **Slot 3 (`F3`):** *A man climbs into a stasis pod, alone. The snapped key is still in the slot behind him.*
     - **Slot 4 (`F4`):** *Someone in a pale gown hides a card under the floor. The stasis pod behind them is frosted over, occupied.*
   - **Order:** `F1` &rarr; `F2` &rarr; `F3` &rarr; `F4`.
   - The archive reveals Slot 5 (`R-017` — your own movements since waking).
   - Access the restoration terminal to read logs `R-001` through `R-016` (unlocks Lethe lever).

### Branching Endings Guide

| Ending | Title | How to Trigger |
|---|---|---|
| **Ending 1** | **Continuity Confirmed** | At the Well console, state name `"Mira."` &rarr; Choose `"Yes."` when asked to stay. |
| **Ending 2** | **The Well is Empty** | Pull the heavy red **LETHE** lever on the wall. |
| **Ending 3** | **The Relay (Cycle 18)** | At the Well console, state name `"Mira."` &rarr; Choose `"No."` OR state `"Seventeen."` without having marked the window dot. |
| **Ending 4** | **New Personnel: Seventeen** *(Secret True Ending)* | **1.** Mark the storm dot at the Observation Window in Phase 2.<br>**2.** At the Well console, choose `"Seventeen." — a name of your own`. ORPHEUS validates the storm log in the present and registers you as an individual. |

### Browser Local Save System
- Progress automatically saves into browser `localStorage` (`echo-chamber:save:v1`) across 10 safe checkpoints and during free movement.
- Resume anytime via the **Continue** button on the title screen, or reset via **New Cycle** or **Erase local save**.

