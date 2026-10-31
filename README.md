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
- [`docs/narrative/STORY_BIBLE.md`](./docs/narrative/STORY_BIBLE.md) — Canonical story bible, character rules, and guardrails.
- [`docs/narrative/STORY_DECISIONS.md`](./docs/narrative/STORY_DECISIONS.md) — Story decisions and approval lock status.
- [`docs/narrative/NARRATIVE_SCRIPT.md`](./docs/narrative/NARRATIVE_SCRIPT.md) — Full dialogue script, cues, and scene texts.
- [`docs/narrative/CHARACTER_BIBLE.md`](./docs/narrative/CHARACTER_BIBLE.md) — Character dossiers and voices.
- [`docs/narrative/CHRONOLOGY_AND_CLUE_MAP.md`](./docs/narrative/CHRONOLOGY_AND_CLUE_MAP.md) — Chronological timeline and clue cross-references.
- [`docs/narrative/STORY_WORKSHOP.md`](./docs/narrative/STORY_WORKSHOP.md) — Story workshop synthesis and treatment comparisons.
- [`docs/narrative/STORY_REVIEW_RUBRIC.md`](./docs/narrative/STORY_REVIEW_RUBRIC.md) — Quality evaluation rubric.

### 4. Technical & Engineering (`docs/technical/`)
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
