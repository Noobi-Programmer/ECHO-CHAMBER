# Agent prompts — ECHO//CHAMBER

Use the same `GAME_DESIGN.md` and `AGENTS.md` as shared context. Keep each task narrow.

## 1. OpenCode — lead engineer (main branch)

You are the sole integration owner for ECHO//CHAMBER. Inspect the repository first. Build the smallest working Phaser 4 + TypeScript + Vite browser game matching the design brief. Implement in this order:

1. Boot and load scene; 320×180 or 384×216 internal resolution with integer scaling.
2. Top-down player movement and wall collision in one room.
3. Interactable objects and a readable dialogue panel.
4. ECHO toggle that shows/hides authored past-state objects/overlays.
5. Three compact connected room states.
6. Light-sequence puzzle and three-card timeline puzzle.
7. Iteration 017 reveal, two endings, restart.

Keep the game playable at every stage. Prefer placeholder shapes/sprites initially; do not block on final art. Avoid Next.js, Supabase, auth, server APIs, LLM APIs or extra features. Run the actual project build and report the result. Do not let other agents edit the same files.

## 2. Freebuff — narrative/puzzle data (separate worktree)

Read `GAME_DESIGN.md` and `AGENTS.md`. Work only in `src/data/story.ts` and `src/data/puzzleData.ts` (create these only if they don't exist). Produce concise, game-ready text and deterministic data for:

- Up to five readable logs/recordings, each 1–3 short sentences.
- Object interaction labels and contextual hints.
- The three timeline cards and their correct order.
- One gentle hint for each puzzle, shown after a delay or repeated failed attempts.
- Text for PRESERVE and RELEASE endings.

Preserve the canonical story: Mira's original request to stop ECHO; Voss overrode it; ORPHEUS follows that directive; player is Iteration 017; prior iterations left clues. Do not add new characters, monsters, aliens, time travel or extra lore. Ensure the puzzle answer is inferable from clues, not guesswork. Do not edit engine/scenes/config files. Report file paths and content assumptions.

## 3. Antigravity — browser QA / visual review

Open the running game in a real browser and play it from a fresh load. Do not edit the project unless the lead explicitly asks. Report only reproducible issues with:

- Steps to reproduce.
- Expected result.
- Actual result.
- Screenshot or browser artifact if available.

Prioritize: controls, collisions, ECHO state visibility, object interaction range, text legibility, puzzle clarity, softlocks, ending/restart, overflow/resizing, console errors and load failures. Also judge whether the visual hierarchy makes interactable objects obvious without destroying the atmosphere. Never claim a test passed if it was not performed.

## 4. Optional bounded Ralph task

Fix this one named reproducible bug: [paste bug]. Inspect the smallest relevant code path, make a minimal fix, run the existing test/build, and stop. Maximum 2–3 iterations. Do not refactor unrelated code, add features, upgrade dependencies or edit the canonical story.
