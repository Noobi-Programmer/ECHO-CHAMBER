# AGENT_SYNC.md — Mandatory Multi-Agent Coordination Contract

> Read before every task, before every write, after pulling main and before handing off.

## 1. Source-of-truth order

1. `AGENT_SYNC.md` — process and conflict rules.
2. `AGENT_STATUS.md` — current task claims, leases and blockers.
3. `PROJECT_CHARTER.md` — product pillars and non-goals.
4. `STORY_DECISIONS.md` + `STORY_BIBLE.md` — story facts/status.
5. `IDEA.md` + `EXPERIENCE_BLUEPRINT.md` — experience direction.
6. `TECHNICAL_RESEARCH_PLAN.md` + approved `ARCHITECTURE_DECISION.md` — implementation decisions.
7. Task card / GitHub issue — task-specific requirements.

A lower document cannot silently override a higher one. If documents conflict, stop and create a decision request.

## 2. Startup handshake (mandatory)

Before editing, each agent must:
1. Read this file and relevant source-of-truth docs.
2. Inspect `git status`, branch, worktree and latest commit.
3. Fetch latest `main`; never overwrite local changes.
4. Report actual model/runtime, tools available, permissions, loaded skills and any quota/latency constraints.
5. Select a READY task that matches its capabilities; inspect dependencies.
6. Claim the task in `AGENT_STATUS.md` and the linked issue with exact write-set, read-set, branch/worktree, acceptance criteria and expected handoff.
7. Check all active write-sets for overlap. No claim or conflict-free write-set = no edits.
8. Create an isolated branch/worktree `agent/<session>/<task-id>`.

## 3. Safe parallelism

- Parallel agents must have non-overlapping write-sets.
- Never use a shared working directory for simultaneous writers.
- One coordinator holds the `AGENT_STATUS.md` write lease for a batch. Other agents submit status updates to the coordinator; they do not edit the board concurrently.
- One integration captain owns merging to `main` for a batch.
- Agents open PRs; the captain reviews diff, conflicts, tests and task criteria before merge.
- Markdown “locks” are not atomic. Git isolation and a single writer per file are required.
- Never force-push, reset another agent's branch, delete unknown files, overwrite uncommitted work or commit secrets.

## 4. Story firewall

Technical/agent/asset research may recommend how to represent story content but may not change character facts, chronology, puzzle answers, themes, endings or tone. Story changes require a proposal in `STORY_DECISIONS.md` and Abi's explicit approval. Until `STORY_LOCK: APPROVED`, treat `STORY_BIBLE.md` as provisional. Once approved, change only through the decision process.

## 5. Task card format

Every task claim must include:
- Task ID and title
- Assigned session and temporary role
- Objective and why this agent is suitable
- Read-set (files/docs)
- Exact write-set (files/directories)
- Dependencies
- Acceptance criteria / verification commands
- Branch/worktree
- Risk and reviewer
- Expected handoff format

## 6. Handoff format

Before review, report:
- summary and rationale;
- exact files changed;
- branch, commit and PR URL;
- tests/build/browser checks actually run and results;
- screenshots or asset previews where relevant;
- known issues, assumptions and follow-up tasks;
- whether the write-set is now released.

Do not claim an unrun test passed. Mark status `REVIEW` until the integration captain accepts it.

## 7. Merge and resync

After a PR merges, the captain updates `AGENT_STATUS.md`, records the new main commit and notifies affected sessions. Agents fetch latest main and verify their next task still has a conflict-free write-set. Rebase only their own branches. If a shared interface changes, update the interface contract and notify dependants before continuing.

## 8. Status values

`PROPOSED`, `READY`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `MERGED`, `VERIFIED`, `DROPPED`.

A task is not `VERIFIED` merely because it merged. Acceptance criteria must be checked in the integrated main build.
