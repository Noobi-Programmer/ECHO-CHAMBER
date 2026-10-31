# Skills Plan — Dynamic, Agent-Native and Task-Scoped

## Current state (verified against repository tree)
- 19 canonical skills under `.agents/skills/`.
- 19 matching Claude-compatible mirrors under `.claude/skills/`.
- The two locations contain the same skill set. `.agents/skills/` is canonical; `.claude/skills/` is generated.
- There is no need to create a separate Antigravity directory: Antigravity uses `.agents/skills/`.
- There is no need to duplicate an OpenCode directory: OpenCode discovers `.agents/skills/`.
- OmniRush's current desktop docs explicitly support workspace `.claude/skills/` and `.opencode/skills/`; this repository uses the `.claude/skills/` mirror so its bundled OpenCode sidecar sees the same library.

## Runtime mapping

| Runtime | Skill path | Loading |
|---|---|---|
| OpenCode | `.agents/skills/` | Native `skill` tool; load the best matching skills on demand |
| Antigravity | `.agents/skills/` | Autonomous discovery from skill names/descriptions; slash invoke when needed |
| Claude Code | `.claude/skills/` | Native project skills, selected by task relevance |
| OmniRush | `.claude/skills/` | OpenCode sidecar; restart/rebuild workspace engine if catalog is cached |
| Unknown | Verify official docs | Never guess; document exact supported path/format |

Full procedure: `SKILL_DISCOVERY.md`.

## Existing canonical skill inventory

| Skill | Use when |
|---|---|
| `asset-ingestion` | Importing approved assets into the game |
| `asset-license-audit` | Verifying reuse rights, attribution and licence conditions |
| `browser-asset-scout` | Searching permitted sources for art/audio assets |
| `browser-game-qa` | Testing a playable browser build |
| `cinematic-pacing` | Planning dramatic beats, reveals and quiet moments |
| `engine-evaluation` | Comparing game engines before engine lock |
| `environmental-storytelling` | Communicating narrative through spaces and props |
| `git-parallel-work` | Managing branches, worktrees and safe integration |
| `godot-web-engineering` | Implementing Godot Web only if Godot is selected |
| `multi-agent-coordination` | Routing tasks and coordinating agent handoffs |
| `narrative-continuity` | Auditing chronology, character knowledge and story consistency |
| `performance-accessibility` | Reviewing performance, readability, input and motion |
| `phaser-engineering` | Implementing Phaser only if Phaser is selected |
| `pixel-art-direction` | Maintaining the pixel-art visual language |
| `player-experience-review` | Reviewing clarity, agency, pacing and player comprehension |
| `psychological-thriller-writing` | Writing suspense, dialogue and psychological reveals |
| `puzzle-design` | Designing fair puzzles, clues and hint ladders |
| `soundscape-design` | Planning ambience, effects, silence and music |
| `story-workshop` | Developing and evaluating story treatments |

## Dynamic task-to-skill suggestions

This is guidance, not a fixed role assignment. The agent router chooses based on each task.

| Task | Likely skills |
|---|---|
| Story treatments / story bible | `story-workshop`, `psychological-thriller-writing`, `narrative-continuity`, `cinematic-pacing` |
| Scene and clue design | `environmental-storytelling`, `puzzle-design`, `player-experience-review` |
| Engine comparison / prototype | `engine-evaluation`, then one of `phaser-engineering` or `godot-web-engineering` only after decision |
| Pixel art and environment | `pixel-art-direction`, `environmental-storytelling` |
| Audio research and implementation | `soundscape-design`, `browser-asset-scout`, `asset-license-audit`, `asset-ingestion` |
| Asset discovery bots | `browser-asset-scout`, `asset-license-audit`, `asset-ingestion` |
| Agent routing / collaboration | `multi-agent-coordination`, `git-parallel-work` |
| Browser testing / release | `browser-game-qa`, `performance-accessibility`, `git-parallel-work` |

## Automatic skill policy

1. Each agent identifies its runtime and reads `SKILL_DISCOVERY.md`.
2. It inspects the skill catalogue and loads the smallest relevant set automatically.
3. It reports the actual skill IDs loaded.
4. If a needed skill is missing, it searches first, audits source/compatibility/licence/security, then adds a focused project skill to `.agents/skills/`.
5. After an addition, run `node scripts/sync-skills.mjs` and `node scripts/check-agent-skills.mjs`.
6. No blanket bundle installs, no duplicate agent-specific copies, no running unreviewed skill scripts.
7. Skill changes are task-scoped Git changes and must be reviewed like code.

## External skill provenance register

When adopting a third-party skill, append:
- skill ID;
- source repository and exact URL;
- source commit or version;
- licence/permission;
- date reviewed;
- reviewer;
- files copied;
- compatibility tested;
- security notes.

No third-party skill is considered approved without this record.
