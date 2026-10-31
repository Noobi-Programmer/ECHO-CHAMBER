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

## Repository Structure

```text
├── src/                     # Game source code (Phaser 3 + TypeScript)
│   ├── main.ts              # Entry point and Phaser game bootstrap
│   ├── style.css            # Game viewport styling and retro CRT styles
│   ├── art/                 # Procedural pixel-art textures and palettes
│   ├── data/                # Story dialogue, logs, and interaction data
│   ├── scenes/              # Game scenes (StationScene exploration & ECHO)
│   ├── systems/             # Subsystems (AudioDirector, UI overlays)
│   └── world/               # Room layout and coordinate definitions
├── docs/                    # Detailed design bibles and asset specifications
│   ├── assets/              # Asset manifests (audio, animations, voice, cues)
│   └── narrative/           # Narrative script, character bible, clue maps, state
├── research/                # Technical research spikes and candidate evaluations
│   ├── agents/              # Multi-agent capability reports
│   ├── assets/              # Audio/visual asset candidates & license audits
│   ├── qa/                  # Test automation research & reports
│   ├── story/               # Story workshop treatment evaluations
│   └── technical/           # Engine benchmark notes & comparison templates
├── scripts/                 # Maintenance and validation utilities
│   ├── check-agent-skills.mjs # Validates skill frontmatter and mirrors
│   ├── sync-skills.mjs      # Synchronizes .agents/skills into .claude/skills
│   └── validate-plan.mjs    # Validates required project plan documents
├── .agents/skills/          # Canonical project skills library (19 skills)
├── .claude/skills/          # Mirrored skills for Claude Code and OmniRush
└── [Root Documents]         # High-level architecture, contracts, and planning
```

---

## Key Documents Index

### 1. Getting Started & Coordination
- [`START_HERE.md`](./START_HERE.md) — 60-minute quickstart strategy and tracks.
- [`CODEDAY_RUNSHEET.md`](./CODEDAY_RUNSHEET.md) — CodeDay schedule, pitch, roles, and cut order.
- [`AGENT_SYNC.md`](./AGENT_SYNC.md) — Mandatory multi-agent coordination contract.
- [`AGENT_STATUS.md`](./AGENT_STATUS.md) — Real-time task status board and coordinator lease.
- [`AGENTS.md`](./AGENTS.md) — Repository-wide rules and constraints.
- [`SKILL_DISCOVERY.md`](./SKILL_DISCOVERY.md) — Runtime-native skill discovery and expansion.

### 2. Story & Game Experience
- [`GAME_DESIGN.md`](./GAME_DESIGN.md) — Full game design document and mechanic specs.
- [`IDEA.md`](./IDEA.md) — High-level pitch and player promise.
- [`EXPERIENCE_BLUEPRINT.md`](./EXPERIENCE_BLUEPRINT.md) — Playthrough timeline, pacing, and input language.
- [`STORY_BIBLE.md`](./STORY_BIBLE.md) — Core story premises, characters, and guardrails.
- [`STORY_DECISIONS.md`](./STORY_DECISIONS.md) — Story decisions and approval lock status.
- [`docs/narrative/NARRATIVE_SCRIPT.md`](./docs/narrative/NARRATIVE_SCRIPT.md) — Full character dialogue and scene text.

### 3. Engineering & Testing
- [`TECHNICAL_RESEARCH_PLAN.md`](./TECHNICAL_RESEARCH_PLAN.md) — Technical spike requirements.
- [`ARCHITECTURE_PROPOSAL.md`](./ARCHITECTURE_PROPOSAL.md) — Engine architecture and systems design.
- [`IMPLEMENTATION_ROADMAP.md`](./IMPLEMENTATION_ROADMAP.md) — Phased delivery plan from prototype to ship.
- [`QA_PLAN.md`](./QA_PLAN.md) — Functional, accessibility, and blind-playtest criteria.

### 4. Assets & Licensing
- [`ASSET_PIPELINE.md`](./ASSET_PIPELINE.md) — Safe asset acquisition, audit, and ingestion pipeline.
- [`ASSET_REGISTER.csv`](./ASSET_REGISTER.csv) — Register of all imported third-party assets and licences.
- [`ASSET_SOURCES.md`](./ASSET_SOURCES.md) — Permitted sources and legal verification rules.
- [`docs/assets/`](./docs/assets/) — Audio, animation, and visual asset manifests.

---

## Agent Runtimes & Skills

This repository uses the open `SKILL.md` standard:
- **Canonical Library:** `.agents/skills/<skill-id>/SKILL.md`
- **Claude / OmniRush Mirror:** `.claude/skills/<skill-id>/SKILL.md`

All agents automatically discover and load only task-relevant skills. Run `npm run skills:check` to verify skill validity.
