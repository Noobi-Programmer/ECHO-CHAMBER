# Technical Research Plan — Track B

## Goal

Recommend and verify the fastest reliable route to a polished browser-playable 2D game. Do not select technology based on preference alone. Prove the core risk: ECHO must render two authored states of a room cleanly and perform at stable frame rate.

## Candidate engines

### Phaser 4 + TypeScript + Vite

Leading hypothesis because the team already has TypeScript/web skills and browser deployment is a priority. Verify current Phaser version/API, tilemap workflow, animation, input, camera, pixel-art settings, audio, scaling and browser support. Use official docs/examples, not guessed APIs.

### Godot 4 Web export

Strong integrated editor and 2D workflow. Test actual browser export, input, audio, loading and deployment constraints in the target browser. Account for WebAssembly/WebGL/browser compatibility and export setup.

### Unity / other engines

Only reconsider if a teammate already has strong 2D workflow experience or a specific required feature makes another engine materially faster. Do not change engines based on novelty.

## Timeboxed proof plan (45 minutes maximum)

1. Scaffold a new empty project from official templates.
2. Render a crisp 320×180 or 384×216 internal-resolution room.
3. Move a placeholder character with keyboard input and collide with walls.
4. Toggle ECHO to show/hide a separate set of past-state objects without moving the player.
5. Add one interaction prompt and a readable text panel.
6. Verify resize/fullscreen and a second browser refresh.
7. Record exact versions, commands, issues, frame rate impression, export/deploy steps and docs references.

## Decision matrix

Score each engine 1–5 with proof:
- Time to first playable room (25%)
- ECHO-state implementation simplicity (20%)
- Browser reliability/deployment (20%)
- Pixel-art rendering quality (10%)
- Team familiarity and debugging capacity (15%)
- Asset pipeline and animation workflow (5%)
- Build size/load time (5%)

## Architecture questions

- Are present and past represented as separate authored layers, state variants, or snapshot data?
- Which object state is authoritative when ECHO toggles?
- How are collision bodies handled in the past state—visual-only or interactive?
- How do interactions remain legible across both states?
- How is puzzle progression stored and reset?
- How is dialogue data authored separately from scene logic?
- How are sound cues tied to ECHO transitions and narrative beats?
- How are asset licences and attribution included in the shipped build?

## Expected output

`research/technical/ENGINE_COMPARISON.md`, `research/technical/ECHO_PROTOTYPE_REPORT.md`, `research/technical/ARCHITECTURE_DECISION.md`, and a recommendation with evidence. Do not overwrite `IDEA.md` or narrative files.
