# Implementation Roadmap

## Phase 0 — Experience + feasibility (parallel)

**Story track:** Three treatments → recommendation → character/causal timeline → beat sheet → clue/puzzle matrix → dialogue and endings → human story approval.

**Technical track:** Engine spike → ECHO prototype → browser/deployment validation → dynamic agent workflow → skills and asset pipeline plan.

Exit: `STORY_LOCK: APPROVED` and `ENGINE_LOCK: APPROVED`.

## Phase 1 — Vertical slice

Deliver one polished room with movement, collision, interaction, ECHO state change, one fair clue, audio cue and an entry/exit transition. Use placeholders where necessary.

Exit: fresh browser load; first-time player understands the mechanic; no critical console/build errors.

## Phase 2 — Complete playable path

Add remaining spaces, story evidence, puzzle state, timeline reconstruction, reveal and two endings. Maintain deterministic progression and hint paths.

Exit: first-time player can finish without developer help; full run within target duration.

## Phase 3 — Art/audio/polish

Replace placeholders with cohesive pixel art and licensed/original audio. Improve lighting, animation, transitions, dialogue pacing, soundscape and feedback. Keep a consistent palette and asset register.

Exit: all shipped external assets have recorded licence/attribution; no temporary debug UI; performance and legibility checks pass.

## Phase 4 — QA and ship

Blind playtest; bug triage; browser/device verification; build-size and load test; static deploy; submission text and demo route.

Exit: known issues listed; clean deployment URL; 60–90 second demo works offline/online as expected.

## Feature freeze

Freeze content/features before final QA. After freeze, only P0/P1 bugs may be changed. No engine swap, new systems, secret ending or major narrative rewrite after freeze unless the lead explicitly decides to drop another scope item.
