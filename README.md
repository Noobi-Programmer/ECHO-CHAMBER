# ECHO//CHAMBER — Iteration 017

> **A memory can be evidence. It can also be a lie.**

A cinematic 2D pixel-art psychological sci-fi thriller and environmental puzzle game for CodeDay. Built with Phaser 3, TypeScript, and Vite.

---

## Quickstart

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Validate required project plan documents
npm run plan:validate

# Verify and synchronize agent skill mirrors
npm run skills:check
npm run skills:sync
```

---

## Clean Repository Structure

The repository keeps only essential project roots in the top-level directory, with all specifications, planning, manifests, and research organized into focused subdirectories:

```text
├── src/                          # Game source code (Phaser 3 + TypeScript)
│   ├── main.ts                   # Entry point and Phaser game bootstrap
│   ├── style.css                 # Game viewport styling and retro CRT styles
│   ├── art/                      # Procedural pixel-art textures and palettes
│   ├── data/                     # Story dialogue, logs, and interaction data
│   ├── scenes/                   # Game scenes (StationScene exploration & ECHO)
│   ├── systems/                  # Subsystems (AudioDirector, UI overlays)
│   └── world/                    # Room layout and coordinate definitions
├── docs/                         # Canonical specifications and design bibles
│   ├── planning/                 # Game design, pitch, charter, and roadmap
│   ├── coordination/             # Multi-agent contracts, status board, prompts, skills
│   ├── narrative/                # Dialogue scripts, character bibles, clue maps, state
│   ├── technical/                # Engine benchmarks, architecture proposal, QA plan
│   └── assets/                   # Asset pipeline, audio/visual manifests, license registers
├── research/                     # Technical spikes, candidate audits, and logs
│   ├── agents/                   # Multi-agent capability reports
│   ├── assets/                   # Audio/visual asset candidates & license audits
│   ├── qa/                       # Test automation research & reports
│   ├── story/                    # Story workshop treatment evaluations
│   └── technical/                # Engine benchmark notes & comparison templates
├── scripts/                      # Validation and skill synchronization utilities
│   ├── check-agent-skills.mjs    # Validates skill frontmatter and mirrors
│   ├── sync-skills.mjs           # Synchronizes .agents/skills into .claude/skills
│   └── validate-plan.mjs         # Validates required project plan documents
├── .agents/skills/               # Canonical project skills library (19 skills)
├── .claude/skills/               # Mirrored skills for Claude Code and OmniRush
├── AGENTS.md                     # Repository-wide rules and constraints
├── CLAUDE.md                     # Claude Code agent instructions
├── README.md                     # Project overview and directory guide
├── index.html                    # Web app entrypoint
├── package.json                  # npm dependencies and scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite bundler configuration
```

---

## Key Documents Index

### 1. Planning & Design (`docs/planning/`)
- [`docs/planning/START_HERE.md`](./docs/planning/START_HERE.md) — 60-minute quickstart strategy and tracks.
- [`docs/planning/CODEDAY_RUNSHEET.md`](./docs/planning/CODEDAY_RUNSHEET.md) — CodeDay schedule, pitch, roles, and cut order.
- [`docs/planning/PROJECT_CHARTER.md`](./docs/planning/PROJECT_CHARTER.md) — Product pillars and non-goals.
- [`docs/planning/GAME_DESIGN.md`](./docs/planning/GAME_DESIGN.md) — Full game design document and mechanic specs.
- [`docs/planning/IDEA.md`](./docs/planning/IDEA.md) — High-level pitch and player promise.
- [`docs/planning/EXPERIENCE_BLUEPRINT.md`](./docs/planning/EXPERIENCE_BLUEPRINT.md) — Playthrough timeline, pacing, and input language.
- [`docs/planning/IMPLEMENTATION_ROADMAP.md`](./docs/planning/IMPLEMENTATION_ROADMAP.md) — Phased delivery plan from prototype to ship.
- [`docs/planning/DECISION_LOG.md`](./docs/planning/DECISION_LOG.md) — General project decision log.

### 2. Multi-Agent Coordination (`docs/coordination/`)
- [`AGENTS.md`](./AGENTS.md) — Repository-wide rules and constraints.
- [`docs/coordination/AGENT_SYNC.md`](./docs/coordination/AGENT_SYNC.md) — Mandatory multi-agent coordination contract.
- [`docs/coordination/AGENT_STATUS.md`](./docs/coordination/AGENT_STATUS.md) — Real-time task status board and coordinator lease.
- [`docs/coordination/AGENT_ROUTER.md`](./docs/coordination/AGENT_ROUTER.md) — Dynamic task router and assignment algorithm.
- [`docs/coordination/AGENT_PROMPTS.md`](./docs/coordination/AGENT_PROMPTS.md) — Role-specific launch prompts.
- [`docs/coordination/AGENT_SYSTEM_PLAN.md`](./docs/coordination/AGENT_SYSTEM_PLAN.md) — Dynamic agent system design and topology.
- [`docs/coordination/TEAM_DISPATCH.md`](./docs/coordination/TEAM_DISPATCH.md) — Initial parallel team assignments.
- [`docs/coordination/SKILL_DISCOVERY.md`](./docs/coordination/SKILL_DISCOVERY.md) — Runtime-native skill discovery and expansion.
- [`docs/coordination/SKILLS_PLAN.md`](./docs/coordination/SKILLS_PLAN.md) — Skills inventory and task recommendations.
- [`docs/coordination/GITHUB_WORKFLOW.md`](./docs/coordination/GITHUB_WORKFLOW.md) — Branch strategy, PR requirements, and safe parallelism.

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
