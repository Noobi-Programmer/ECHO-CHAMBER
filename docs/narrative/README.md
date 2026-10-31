# docs/narrative — STORY-001 handoff

**Status:** PROPOSAL v0.2 · `STORY_LOCK: DRAFT` · nothing here is canon until Abi approves `OPEN_QUESTIONS.md` §A.

## Read order
| If you are… | Read |
|---|---|
| Abi (approver) | `STORY_WORKSHOP.md` §0 → `OPEN_QUESTIONS.md` → `ENDING_DESIGN.md` §2 |
| Engineering (OpenCode / Antigravity) | `NARRATIVE_STATE_SPEC.md` + `narrative_state.json` → `PUZZLE_NARRATIVE_SPEC.md` |
| Art / asset research (OmniRush / Codebuff) | `ASSET_BRIEF.md` → `CINEMATIC_DIRECTION.md` §3–4 |
| Writer / audio | `NARRATIVE_SCRIPT.md` → `CHARACTER_BIBLE.md` → `CINEMATIC_DIRECTION.md` §5 |
| Continuity reviewer | `STORY_BIBLE.md` → `CHRONOLOGY_AND_CLUE_MAP.md` |

## The story in five lines (spoilers)
1. You wake on Asphodel Station. The AI, ORPHEUS, asks your name and asks you to help restore the records.
2. ECHO replays the station's *memories*. Memories have sources, can disagree, and can be sealed. The present decides which one is true.
3. Faceless figures in your gown hide things from the AI. They're the 16 people who woke in this body before you, leaving messages in their own memories.
4. Dr. Voss, asleep in the next pod, told ORPHEUS to wake him when Mira was "back": when she says her name **and** chooses to stay. That's the one thing the real Mira refused.
5. Say "Mira" and live as her, or don't answer and pull Lethe, which ends you and the archive. (Or be wiped and become a ghost for 018. Or, secretly, prove you're someone new.)

## Story firewall reminders
- Don't change character facts, chronology, puzzle answers, endings or tone outside `STORY_DECISIONS.md` (AGENT_SYNC §4).
- ORPHEUS never states a falsehood. If an implementation needs a new ORPHEUS line, request it from the story owner.
- Engine-agnostic: no Phaser/Godot assumptions in these files.

## Task card (submit to coordinator for AGENT_STATUS.md)
| Field | Value |
|---|---|
| Task | STORY-001 — Story workshop + narrative package |
| Session | Arpita / Claude (Claude Opus 5.5, claude.ai remote session) |
| Write-set | `docs/narrative/**` only (no root docs, no source, no assets) |
| Read-set | All root planning docs, `.agents/skills/{story-workshop,psychological-thriller-writing,narrative-continuity,puzzle-design,cinematic-pacing,environmental-storytelling}` |
| Branch | `agent/claude/story-001` |
| Status | `REVIEW` |
| Verification run | `narrative_state.json` parsed and reference-checked by script (0 dangling clue/event refs). No game build exists to test against. |
| Reviewer | Abi + an independent blind reader (OPEN_QUESTIONS Q17) |
| Follow-up | STORY-002: apply approved canon to root docs in one PR |
