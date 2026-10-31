# AGENTS.md — ECHO//CHAMBER

## Mission
Build a complete, short, browser-playable 2D pixel-art psychological thriller prototype for CodeDay. The core loop is: explore a room → activate ECHO to see a past-state overlay → inspect the discrepancy → solve a clue/puzzle → uncover the truth → choose an ending.

## Hard constraints
- Phaser 4 + TypeScript + Vite; use Bun if available.
- Browser-first, static deployment. No backend.
- One playable character, three compact spaces, 8–12 minute core playthrough.
- ECHO mode must work and matter to the puzzles and story.
- One timeline puzzle; two endings.
- No combat, enemies, procedural generation, multiplayer, accounts, database, LLM API, crafting, inventory system, or extra feature creep.
- Do not change the canonical story in GAME_DESIGN.md without the human project lead's approval.
- Prefer simple authored state changes over general-purpose systems.

## Narrative canon
Player is Iteration 017, a reconstruction of Dr. Mira Sen. Dr. Elias Voss overrode Mira's request to shut down ECHO because he could not accept losing her. ORPHEUS follows Voss's preservation instruction. Earlier iterations left clues. The final choice is PRESERVE (continue the loop) or RELEASE (end ECHO).

## Engineering rules
- Keep code small and readable. Avoid unnecessary architecture.
- Use deterministic puzzle logic; no external AI calls.
- Never put story-critical content solely in a hard-to-read visual effect.
- Ensure keyboard input does not conflict with dialogue or browser shortcuts.
- Add interaction prompts and soft hints; no softlocks.
- Preserve integer-aligned pixel rendering; avoid unnecessary scaling/rotation of pixel sprites.
- Run typecheck/build after each meaningful integration.
- Do not add dependencies without approval.
- Do not upgrade Phaser or other packages mid-event.

## File ownership
- OpenCode is the primary code owner and integration authority.
- Freebuff may create/edit `src/data/story.ts` and `src/data/puzzleData.ts` only, in a separate worktree, unless the lead assigns another isolated file.
- Antigravity is QA-first: inspect the running browser build, report bugs and screenshots/steps; do not concurrently refactor core files.
- Human artist owns the pixel-art assets. Coding agents can use clearly labelled placeholders until assets arrive.

## Definition of done
1. Fresh browser load succeeds.
2. Movement, wall collision and interaction work.
3. ECHO toggles the past-state overlay and reveals at least three meaningful differences.
4. Puzzles have unambiguous clues and a hint path.
5. Timeline puzzle reveals Iteration 017.
6. Both endings play; restart returns to the start.
7. The project builds cleanly and can be served/deployed as a static site.

## Agent behaviour
Before editing, inspect the existing project and state the exact files to be changed. Do not assume dependencies or APIs. Make the smallest implementation that passes acceptance criteria. Report changed files, commands run, test/build results, known issues and any manual steps. Never claim a browser test was run unless it actually was.
