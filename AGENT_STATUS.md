# Agent Status Board

**Coordinator lease:** UNASSIGNED  
**Integration captain:** Abi (proposed default; confirm each batch)  
**Last synchronized main commit:** pending  
**Story lock:** DRAFT  
**Engine lock:** UNDECIDED

> Only the current coordinator edits this file. Other sessions submit updates to that coordinator. Every active task must have a unique write-set.

## Active work

| Task | Track | Temporary role | Session/person | Status | Branch/worktree | Exact write-set | Reviewer | Handoff |
|---|---|---|---|---|---|---|---|---|
| STORY-001 | Experience | Story workshop lead | Arpita / Claude Code (initial proposal) | READY | `agent/claude/story-001` | `research/story/**`, `STORY_WORKSHOP.md` (proposal only) | Abi + independent reviewer | Pending |
| TECH-001 | Build | Engine researcher | dynamic: Abi/Kishore session selected | READY | `agent/<session>/tech-001` | `research/technical/**` | Different session | Pending |
| AGENT-001 | Build | Agent/skill researcher | dynamic session | READY | `agent/<session>/agent-001` | `research/agents/**`, `SKILLS_PLAN.md` | Different session | Pending |
| ASSET-001 | Build | Asset automation researcher | dynamic session | READY | `agent/<session>/asset-001` | `research/assets/**`, `ASSET_PIPELINE.md` proposal | Licence reviewer | Pending |
| QA-001 | Build | QA/release researcher | dynamic session | READY | `agent/<session>/qa-001` | `research/qa/**` | Integration captain | Pending |

## Decision queue

| Decision | Owner | Needed by | Status |
|---|---|---|---|
| Story treatment and emotional engine | Abi | Before narrative lock | OPEN |
| Canonical protagonist/relationships/timeline | Abi | Before dialogue production | OPEN |
| Engine/framework | Abi after technical proof | Before full scaffold | OPEN |
| ECHO interaction model | Integration captain | Before content production | OPEN |
| Asset sourcing policy | Abi / licence reviewer | Before asset downloads | OPEN |

## Batch log

Append batch ID, coordinator, integration captain, start/end main SHA, merged PRs, decisions and incidents. Do not erase prior entries.
