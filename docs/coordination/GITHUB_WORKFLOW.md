# GitHub & Parallel Workflow

## Branch strategy

- `main`: always runnable; only integration captain merges.
- Task branches: `agent/<session>/<task-id>`.
- Story-only docs can live under `research/story/` until approved; approved canon changes update core docs in one reviewed PR.
- Tech research lives under `research/technical/`; agent/skills under `research/agents/`; asset work under `research/assets/`; QA under `research/qa/`.

## PR requirements

Title: `[TASK-ID] concise result`.

Description must include purpose, write-set, acceptance criteria, exact tests/commands run, screenshots if visual, licences if assets, known issues and source-of-truth docs changed. One PR per task where practical.

## No unsafe concurrency

- Never use a shared checkout for concurrent writes.
- Separate worktrees are preferred.
- If a shared filesystem is unavoidable, use a single-writer lease and let all other sessions remain read-only.
- Do not let the coordinator and contributor both edit `AGENT_STATUS.md` at once.
- GitHub Issues/PRs provide durable task records; Markdown status is a visible summary, not an atomic lock.

## Merge sequence

1. PR author requests review and releases write-set.
2. Integration captain checks conflict and scope.
3. Reviewer checks acceptance criteria independently.
4. Captain runs integrated build/tests.
5. Merge; record commit; update status; notify agents.
6. Agents fetch latest main before claiming next task.
