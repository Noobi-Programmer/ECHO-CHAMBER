# Dynamic Agent System Plan

## Principle

The team consists of people and available tool/model sessions, not fixed job titles. Assign roles per task. An agent may be an excellent planner for one task and a poor choice for another. Route based on demonstrated task fit, access to the required tools, context, quota/cost, availability, speed, and whether an independent reviewer is valuable.

## User-provided seats (availability is not guaranteed)

| Person | Available tools / resources | Typical strengths to test, not assume |
|---|---|---|
| Abi | OpenCode, Antigravity Pro (configured Gemini model), OmniRush (user-reported 10M) | Product decisions, integration, implementation, orchestration |
| Arpita | Claude Pro / Claude Code | Long-context reasoning, narrative synthesis, coding/review |
| Kishore | Antigravity + OpenCode | Parallel prototyping, browser/tool execution, implementation/review |

At the start of each work batch, ask each session to report its actual model/runtime, tool permissions, skill loading, context/quota constraints and availability. Model names and usage limits can change; do not hard-code them in routing rules.

## Dynamic task routing

Every task gets a short card with: objective, work type, risk, write-set, read-set, dependencies, expected output, acceptance tests and deadline.

Score candidate sessions (0–5):
- task-domain fit (30%)
- tool and permission fit (20%)
- context already loaded (15%)
- available quota/latency (10%)
- independent verification value (15%)
- current load/availability (10%)

Assign best-fit session. For high-risk narrative or architecture work, pair an author with an independent reviewer. Keep one human approver for product/story/engine locks.

## Roles are temporary capabilities

Possible task roles: task router, story author, narrative critic, continuity auditor, player-experience reviewer, technical researcher, engine prototyper, gameplay engineer, UI implementer, asset scout, licence auditor, asset ingester, browser QA, performance reviewer, release integrator. One session may hold multiple compatible roles, but cannot approve its own high-risk change alone.

## Coordination topology

- **Work-batch coordinator:** one temporary lease-holder who updates `AGENT_STATUS.md` and assigns tasks. Rotate if unavailable; only one writer at a time.
- **Integration captain:** one temporary person/agent permitted to merge to `main` during a batch. Defaults to Abi/OpenCode unless explicitly reassigned.
- **Task agents:** work on separate branches/worktrees and non-overlapping file write-sets.
- **Independent reviewers:** read-only until assigned fixes.

## Task lifecycle

`PROPOSED → READY → CLAIMED → IN_PROGRESS → REVIEW → MERGED → VERIFIED`

Alternative terminal states: `BLOCKED`, `DROPPED`. Every transition is recorded in `AGENT_STATUS.md` and linked issue/PR. A markdown lock is a coordination convention, not an atomic distributed lock. Git branches/worktrees, narrow write-sets, GitHub issues/PRs and one merge captain provide actual isolation.

## Do not

- Assign “Claude = writer” or “Kishore = coder” permanently.
- Let multiple agents write one shared file concurrently.
- Let the same agent author and solely approve a high-risk change.
- Allow an agent to merge directly to main without captain review.
- Let technical researchers silently rewrite story canon.
