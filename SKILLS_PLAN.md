# Skills Plan — Dynamic and Task-Scoped

## Shared source

Canonical skills: `.agents/skills/<skill-name>/SKILL.md`. Mirror to `.claude/skills/` for Claude Code with `scripts/sync-skills.mjs`. Keep one canonical copy to avoid drift. Each agent verifies skill loading in its own environment; skill discovery may require a new session/reload.

## Skills catalogue

| Skill | Use when | Key output |
|---|---|---|
| `story-workshop` | Developing/revising the experience | Treatments, beat sheet, story pitch |
| `psychological-thriller-writing` | Dialogue, suspense and reveals | Character voice, tension and payoff |
| `narrative-continuity` | Changing or auditing canon | Timeline, knowledge map, contradiction report |
| `cinematic-pacing` | Structuring a short playthrough | Beat timing, reveals and quiet beats |
| `environmental-storytelling` | Designing rooms and props | Visual clue plan and narrative set dressing |
| `puzzle-design` | Designing/validating puzzles | Clue matrix, solution, hint ladder |
| `player-experience-review` | Blind review and UX checks | Confusion map, pacing/agency feedback |
| `engine-evaluation` | Choosing Phaser/Godot/other | Evidence-based decision memo |
| `phaser-engineering` | Phaser code after engine lock | Small verified implementation |
| `godot-web-engineering` | Godot only if selected | Scene/scripts/export implementation |
| `pixel-art-direction` | Art direction and sprite work | Palette, tile/sprite specs, asset reviews |
| `soundscape-design` | Sound and music direction | Cue sheet and mix priorities |
| `multi-agent-coordination` | Routing and handoffs | Task cards, state updates, conflict avoidance |
| `browser-asset-scout` | Searching asset libraries | Candidate shortlist with provenance |
| `asset-license-audit` | Checking asset rights | Per-asset licence decision |
| `asset-ingestion` | Validating/importing approved files | Verified asset + register row |
| `browser-game-qa` | Playing the running build | Reproducible bug reports |
| `git-parallel-work` | Branch/worktree integration | Safe branch/PR workflow |
| `performance-accessibility` | Final polish | Performance, input, motion and readability audit |

## Loading policy

Load only relevant skills for the current task. A story-writing task should not load engine implementation skills; an asset scout should not need all story dialogue. If two skills conflict, report the conflict and follow source-of-truth docs.
