# Architecture Proposal — Hypotheses to Validate

**Status: proposed, not implementation authority until the technical spike passes.**

## Engine hypothesis

Phaser 4 + TypeScript + Vite + Bun. If the 45-minute proof fails or Godot materially outperforms it, present measured evidence before switching.

## Logical modules

- `GameBootstrap`: game config, scaling and asset preload.
- `RoomScene`: room bounds, layers, collision and camera.
- `PlayerController`: movement, facing, interaction range.
- `InteractionSystem`: nearest valid interactable, prompt and interaction events.
- `EchoStateSystem`: present/echo state transitions and authored differences.
- `PuzzleSystem`: deterministic puzzle state, attempts and hints.
- `DialogueSystem`: data-driven dialogue, logs and recording playback.
- `NarrativeState`: flags that track what the player discovered; keep it small.
- `AudioDirector`: ambience, one-shots, ECHO motif, silence and transitions.
- `UI`: title, prompt, dialogue, evidence, pause, ending.

## ECHO model (preferred simple approach)

Represent each room using a stable base layout plus two authored state layers/variants. ECHO changes which past-only objects and visual variants are rendered. Shared geometry and collision remain stable unless a specific puzzle explicitly needs a state-dependent physical barrier. State transition must be deterministic and reversible. Do not implement a generic time-travel simulation.

## Data separation

Keep authored content separate from scene code: room data, interactable definitions, dialogue, clue conditions and puzzle sequence data. Use typed IDs and validate references at build/test time. Avoid using large free-form string conditions.

## Quality requirements

- Pixel-perfect integer scaling and deliberate letterboxing.
- Readable UI at common laptop resolutions.
- Rebindable or clearly documented keyboard controls where feasible.
- Pause and restart behaviour.
- No softlocks; puzzle hints and reset routes exist.
- Audio volume control and mute.
- Respect reduced-motion preference where practical; no rapid flashing.
- Static hosting; no backend or runtime API dependencies.
