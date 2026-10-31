# QA Plan

## Test stages

### Narrative / blind-playtest
- Ask a person unfamiliar with the story to play without explanation.
- Record time to first ECHO use, first clue, first suspicion and final understanding.
- Ask what happened, why it happened, what the protagonist wants and what the choice means.
- Do not coach during the run. Distinguish confusion that is intended from confusion caused by unclear clues.

### Functional
- Fresh load and refresh.
- Keyboard movement, diagonal speed, wall collision and interaction distance.
- ECHO toggle: correct past-state differences, visual/audio feedback, no accidental state corruption.
- Dialogue progression, pause, restart and scene transitions.
- Puzzle state, hints, repeated failures, reset and completion.
- Both endings; choice persistence within the run; restart behaviour.

### Accessibility and readability
- Every colour-coded clue has a shape/text/icon equivalent.
- Text readable at laptop window sizes; adequate contrast.
- No rapid full-screen flashes; reduce-motion alternative where possible.
- Audio is not the only source of critical information; volume/mute.
- Controls shown in-game and consistent.

### Technical
- No uncaught browser console errors.
- Static deploy works from a clean URL and refresh.
- Asset requests resolve; no local-only paths or leaked API keys.
- Check load time, file sizes, frame pacing, memory and resize behaviour.
- Test at least current Chromium plus one alternative browser if time allows.

## Severity

P0: cannot load/play/finish, softlock, story-breaking puzzle impossible, security/licence violation.  
P1: major interaction or clue broken, ending unreachable, severe visual/audio issue.  
P2: polish, minor readability or non-blocking glitch.  
P3: optional improvement.

Only P0/P1 fixes after feature freeze unless the lead explicitly accepts a trade-off.
