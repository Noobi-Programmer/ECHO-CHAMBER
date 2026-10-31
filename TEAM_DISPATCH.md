# Initial Team Dispatch — Dynamic, Not Permanent Roles

The following are starting assignments for the first work batch, based on the currently reported tool seats. The router may reassign tasks after checking current runtime, model, quota, permissions and availability.

| Person | Available sessions | Initial task candidates | Important constraint |
|---|---|---|---|
| Abi | OpenCode, Antigravity Pro, OmniRush | Product/story approval; technical architecture research; integration captain | Keep human decisions and the main branch under one accountable owner |
| Arpita | Claude Pro / Claude Code | Lead story-workshop synthesis; can later take technical or QA tasks if best fit | Story remains draft until Abi explicitly approves |
| Kishore | Antigravity + OpenCode | Engine proof, browser QA, implementation research or independent review | Use separate worktree and distinct write-set from Abi's sessions |

## First parallel dispatch

- **STORY-001 — Experience track:** Arpita's Claude Code session is the initial candidate author. Produce three distinct treatments, choose a recommendation, causal timeline, character map, player-knowledge map, 10–15 minute beat sheet, clue matrix, dialogue draft and ending options. Write only to `research/story/**` plus the task claim. Abi approves. Then a different session performs a blind critique.
- **TECH-001 — Engine track:** Route to the currently best-equipped OpenCode/Antigravity session (Abi or Kishore). Compare Phaser and Godot Web with a 45-minute proof. Write only to `research/technical/**`.
- **AGENT-001 — Agent-system track:** Route to a session with strong tool/documentation research capability. Verify skill loading and Git/worktree coordination. Write only to `research/agents/**` and `SKILLS_PLAN.md` only through the coordinator's controlled merge.
- **ASSET-001 — Asset automation track:** Route to a browser/API-enabled session. Design official-source discovery, independent licence audit and safe ingestion. Write only to `research/assets/**`.
- **QA-001 — QA track:** Route to a browser-capable session. Evaluate browser automation and propose test plan. Write only to `research/qa/**`.

No one is waiting for the other track to finish: story work and technical research are independent. Full game implementation starts after the story experience is approved and the ECHO technical proof has passed. A disposable prototype may proceed earlier on its own branch, using placeholder story text and assets.
