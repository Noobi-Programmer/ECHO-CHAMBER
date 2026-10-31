# Agent Router — Dynamic Assignment

## Candidate registry (revalidate each work batch)

| Person | Tool sessions reported by user | Notes |
|---|---|---|
| Abi | OpenCode, Antigravity Pro (Gemini config), OmniRush (10M reported) | Human product approver; proposed integration captain |
| Arpita | Claude Pro / Claude Code | Available for narrative, planning, research or code depending on task/session capabilities |
| Kishore | Antigravity + OpenCode | Available for implementation, research, browser QA or review depending on current capability |

The table lists access, not permanent jobs. Tool/model availability and limits must be checked at dispatch time.

## Routing algorithm

1. Convert request into a task card.
2. Identify work type, risk, dependencies, write-set and verification method.
3. Ask candidate sessions to report current model/runtime, tool access, skill discovery, quota/cost, context and availability.
4. Score candidate (0–5): domain fit 30%; permissions/tool fit 20%; relevant context 15%; independent verification value 15%; load/availability 10%; quota/latency 10%.
5. Assign highest score. For critical story/architecture/security/licensing work, assign a separate reviewer.
6. Check write-set conflict and issue a branch/worktree claim.
7. Re-evaluate on blocker, quota exhaustion, missed handoff or task change. Reassign without duplicating edits.

## Example routing

- Narrative treatment: Claude Code may author; another session performs a blind critique; Abi approves.
- Phaser prototype: choose whichever OpenCode/Antigravity session has best current engine knowledge and local tool execution; another tests the browser result.
- Asset discovery: browser-capable session scouts; independent session audits each licence; only approved candidates download.
- Git conflicts: integration captain resolves; other sessions remain read-only.
- Story review: do not let the author be sole approver.

## Fairness and safety

Do not infer task capability from a model brand alone. Do not exceed user plan quotas or bypass access controls. Do not share API keys or private credentials in prompts, docs, screenshots or Git. Use user-provided authorised accounts and approved services only.
