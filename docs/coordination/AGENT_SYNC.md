# AGENT_SYNC.md — Mandatory Multi-Agent Coordination Contract

> Read before every task, before every write, after pulling main and before handing off.

## 1. Source-of-truth order
1. `docs/coordination/AGENT_SYNC.md` — process and conflict rules.
2. `docs/coordination/AGENT_STATUS.md` — current task claims, leases and blockers.
3. `AGENTS.md` — repository-wide rules, including skill policy.
4. `docs/planning/PROJECT_CHARTER.md` — product pillars and non-goals.
5. `docs/narrative/STORY_DECISIONS.md` + `docs/narrative/STORY_BIBLE.md` — story facts/status.
6. `docs/planning/IDEA.md` + `docs/planning/EXPERIENCE_BLUEPRINT.md` — experience direction.
7. `docs/technical/TECHNICAL_RESEARCH_PLAN.md` + approved `ARCHITECTURE_DECISION.md` — implementation decisions.
8. `docs/coordination/SKILL_DISCOVERY.md` + `docs/coordination/SKILLS_PLAN.md` — agent-native skill discovery and use.
9. Task card / GitHub issue — task-specific requirements.

A lower document cannot silently override a higher one. If documents conflict, stop and create a decision request.

## 2. Startup handshake (mandatory)
Before editing, each agent must:
1. Read this file and relevant source-of-truth docs.
2. Inspect `git status`, branch, worktree and latest commit.
3. Fetch latest `main`; never overwrite local changes.
4. Report actual model/runtime, available tools, permissions, loaded skills and any quota/latency constraints.
5. Identify the runtime-native skill location from `docs/coordination/SKILL_DISCOVERY.md`; inspect available skill descriptions and load only task-relevant skills.
6. If a needed skill is missing, follow the controlled expansion process in `docs/coordination/SKILL_DISCOVERY.md`.
7. Select a READY task that matches current capabilities; inspect dependencies.
8. Claim the task in `docs/coordination/AGENT_STATUS.md` and linked issue with exact write-set, read-set, branch/worktree, acceptance criteria and expected handoff.
9. Check all active write-sets for overlap. No claim or conflict-free write-set = no edits.
10. Create isolated branch/worktree `agent/<session>/<task-id>`.

## 3. Safe parallelism
- Parallel agents must have non-overlapping write-sets.
- Never use a shared working directory for simultaneous writers.
- One coordinator holds the `docs/coordination/AGENT_STATUS.md` write lease for a batch. Other agents submit updates to the coordinator; they do not edit the board concurrently.
- One integration captain owns merging to `main` for a batch.
- Agents open PRs; the captain reviews diff, conflicts, tests and task criteria before merge.
- Markdown “locks” are not atomic. Git isolation and a single writer per file are required.
- Never force-push, reset another agent's branch, delete unknown files, overwrite uncommitted work or commit secrets.

## 4. Story firewall
Technical/agent/asset research may recommend how to represent story content but may not change character facts, chronology, puzzle answers, themes, endings or tone. Story changes require a proposal in `docs/narrative/STORY_DECISIONS.md` and Abi's explicit approval. Until `STORY_LOCK: APPROVED`, treat `docs/narrative/STORY_BIBLE.md` as provisional. Once approved, change only through the decision process.

## 5. Skills change-control
- Canonical project skills live in `.agents/skills/<id>/SKILL.md`.
- `.claude/skills/` is the generated compatibility mirror for Claude Code and OmniRush.
- Do not maintain duplicate hand-edited copies in multiple tool folders.
- Any task adding/updating a skill must claim the exact skill path and `docs/coordination/SKILLS_PLAN.md` write-set.
- Audit third-party skill source, licence, frontmatter, prompt content and bundled scripts before adoption.
- After canonical skill changes, run `node scripts/sync-skills.mjs` and `node scripts/check-agent-skills.mjs`.
- Report whether the active runtime refreshed its skill catalog. Restart/rebuild the session when needed.

## 6. Task card format
Every task claim must include:
- Task ID and title;
- assigned session and temporary role;
- runtime/model and selected skill IDs;
- objective and why this session is suitable;
- read-set and exact write-set;
- dependencies and acceptance criteria;
- branch/worktree;
- risk and reviewer;
- expected handoff format.

## 7. Handoff format
Before review, report:
- summary and rationale;
- exact files changed;
- branch, commit and PR URL;
- skills used and any new skill/source/licence review;
- tests/build/browser checks actually run and results;
- screenshots or asset previews where relevant;
- known issues, assumptions and follow-up;
- whether the write-set is released and whether the skill catalog was refreshed.

Do not claim an unrun test passed. Mark status `REVIEW` until the integration captain accepts it.

## 8. Merge and resync
After a PR merges, the captain updates `docs/coordination/AGENT_STATUS.md`, records the new main commit and notifies affected sessions. Agents fetch latest main and verify their next task still has a conflict-free write-set. Rebase only their own branches. If a shared interface changes, update the interface contract and notify dependants before continuing.

## 9. Status values
`PROPOSED`, `READY`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `MERGED`, `VERIFIED`, `DROPPED`.

A task is not `VERIFIED` merely because it merged. Acceptance criteria must be checked in the integrated main build.
