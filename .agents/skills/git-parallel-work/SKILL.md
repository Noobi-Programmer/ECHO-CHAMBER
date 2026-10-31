---
name: git-parallel-work
description: Coordinate multiple concurrent contributors with branches, worktrees and reviewed merges.
---

# Git Parallel Work

Read AGENT_SYNC.md. Use one isolated branch/worktree per task. Define exact write-set and avoid overlapping files. Never edit from a shared checkout concurrently. Do not force-push, reset another branch or overwrite uncommitted work. Open PR with scope, changed files, actual tests and known issues. Integration captain alone merges main for the batch. Update status and resync after merge.
