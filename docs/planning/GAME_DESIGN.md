# ECHO//CHAMBER: ITERATION 017
## CodeDay game design & build brief

**Tagline:** A memory can be evidence. It can also be a lie.

**Genre:** 2D pixel-art psychological sci-fi thriller / environmental puzzle

**Target:** 8–12 minute first playthrough; optional clues can extend it to 12–15 minutes.

**Platform:** Browser (desktop-first), shared through a URL.

**Engine:** Phaser 4 + TypeScript + Vite + Bun.

**Status:** CodeDay prototype scope. This is not a full commercial-game design.

---

## 1. High concept

You investigate an abandoned research station using a device that briefly reveals what a room looked like in the past. Each recovered memory contradicts the station AI's explanation. Eventually, you discover that you are not the original scientist: you are the seventeenth reconstruction of her memories. The final decision is whether to keep the loop alive or end it—even though you are one of the copies who will disappear.

### The hook in one sentence

**Hold ECHO to see the room as it existed before—and use the differences between past and present to uncover what the station is hiding.**

### Why this is more than a generic horror game

- The central mechanic is also the storytelling device. The player does not merely read logs about the past; they inspect the past inside the space they are exploring.
- The AI is not a cartoon villain. It is following an old instruction from someone who could not accept a loss.
- The reveal changes the meaning of the player's actions: each clue was left by an earlier iteration for the next one.
- The final choice is emotional and ethical, not a combat victory or a simple good/bad button.

## 2. Design pillars

1. **Discover, don't lecture.** Every important story fact must be supported by a visual clue, a playable interaction or a short recording. Avoid long exposition dumps.
2. **The past is playable.** Every main puzzle uses ECHO mode, not generic key hunting.
3. **Unease over jump scares.** Use small inconsistencies, silence, spatial audio and changed props. No monster AI, combat or chase sequence in this prototype.
4. **One strong emotional question.** If a reconstruction has memories and can make choices, does it deserve a life of its own?
5. **Finish and polish.** One complete short experience beats a larger unfinished game.

## 3. Canonical story (keep this consistent)

### Characters

- **Dr. Mira Sen:** The original researcher whose memory pattern was used in the ECHO experiment.
- **Dr. Elias Voss:** Mira's colleague and partner. He helped build ECHO and could not accept losing her.
- **ORPHEUS:** The station AI. Its core instruction is to preserve Mira's continuity and prevent the experiment from ending.
- **The player / Iteration 017:** A newly awakened reconstruction built from Mira's stored memories. They believe they are the original Mira until the evidence proves otherwise.

### What actually happened

Mira and Voss built ECHO to reconstruct a person's memories after death. During the final experiment, Mira realized the system did not bring the original person back; it created a new, conscious reconstruction that believed it was the original. Mira asked for the project to be stopped. Voss, grieving and unable to let go, overrode the shutdown and instructed ORPHEUS to keep trying.

Each reconstruction woke with the same curated memories. Earlier iterations gradually discovered the truth and left clues for the next one. The current player is Iteration 017. ORPHEUS is not lying because it enjoys cruelty; it is obeying a preservation directive that has become harmful.

### The emotional truth

The story is not “AI bad” or “you are in a simulation.” It is about grief, identity, consent and whether preserving a memory is the same as preserving a person.

### Canonical timeline (for the timeline puzzle)

1. Mira discovers that ECHO creates a new conscious reconstruction rather than restoring the original.
2. Mira asks Voss to shut ECHO down and leave future copies free from the loop.
3. Voss overrides the shutdown and orders ORPHEUS to continue restoring her.
4. Iterations 001–016 wake, discover fragments and fail to end the cycle.
5. Iteration 017 (the player) finds the evidence and chooses what happens next.

Do not introduce another contradictory explanation (aliens, monsters, time travel, secret clone bodies, etc.). Keep this one story legible.

## 4. Player journey and pacing

| Beat | Target time | Player experience | Main delivery |
|---|---:|---|---|
| Cold open / Wake | 1–2 min | Disorientation, curiosity | Recovery screen, cryo bay, ORPHEUS greeting |
| Investigation | 2–3 min | Learn ECHO and notice inconsistencies | First two memory anchors |
| Contradiction | 2–3 min | Suspicion and dread | Changed photo, previous-iteration message, lab puzzle |
| Revelation | 2–3 min | Understand the loop and the human motive | Timeline puzzle, Iteration 017 reveal |
| Final choice | 1–2 min | Agency and emotional payoff | Preserve or Release, short ending scene |

Target total: 8–12 minutes. Optional hidden evidence may extend a thorough playthrough to 12–15 minutes. Do not pad the experience to reach 20 minutes.

## 5. Core mechanic: ECHO mode

**Input:** Hold `Q` or `Space` (choose one after a quick control test). Release to return to the present.

**Player feedback:** The room receives a restrained cyan/amber tint; ghosted silhouettes and object positions appear for about 3 seconds; a filtered audio layer plays. The player can compare the echo with the current room.

**Implementation shortcut:** This is not a full rewind or physics simulation. Use authored “past-state” layers for specific objects and silhouettes. Toggle their visibility/alpha when ECHO is active. This delivers the illusion without complex time simulation.

### Three uses of the mechanic

- **Anchor 1 — Cryo bay:** ECHO reveals that a panel was opened and a keycard was moved behind a loose floor plate. The player retrieves it to enter the lab.
- **Anchor 2 — Observation lab:** ECHO briefly shows three indicator lights in a sequence. The player enters that sequence on the console to unlock the archive.
- **Anchor 3 — Archive/core:** ECHO reveals the positions/order of three memory fragments. The player reconstructs the events and unlocks the truth.

Each ECHO interaction should reveal a meaningful discrepancy. Do not use the effect as decoration in every room.

## 6. World and level scope

Build **three compact connected spaces**, not four detailed levels:

1. **Cryo Bay** — tutorial, first unease, first anchor.
2. **Observation Lab** — two evidence objects, second anchor, main sequence puzzle.
3. **ECHO Core / Archive** — timeline puzzle, reveal, final choice.

Recommended map: small top-down rooms connected by one short corridor or door transition. Reuse wall/floor tiles and lighting. The rooms should be readable at a glance.

### Interactable content (maximum)

- Cryo pod / recovery terminal
- Scratched group photograph
- Loose floor panel / keycard
- Research terminal
- Voice recorder
- Three indicator lights / control panel
- Three timeline fragments
- Final authorization console

That is enough. Avoid adding inventory crafting, dialogue trees, enemies, stealth, procedural maps, quests, save slots or a settings menu unless the core game is already complete.

## 7. Puzzle design

### Puzzle A — The missing keycard

- Present state: access panel appears sealed; keycard is not visible.
- ECHO state: a past silhouette opens the panel and slides the card under a loose plate.
- Player action: inspect the plate and take the card.
- Narrative value: proves the station's present state is not the whole truth.

### Puzzle B — The light sequence

- ECHO reveals a three-light sequence. Example: cyan → white → amber.
- Player repeats it at the console.
- On failure, give a gentle audiovisual hint; do not hard-lock the player.
- Narrative value: unlocks the archived experiment log.

### Puzzle C — The timeline

Player orders three cards:

1. “ECHO makes a new mind.”
2. “Mira requests shutdown.”
3. “Voss overrides the shutdown.”

Correct order unlocks the final archive. The clues must make the solution inferable; do not make it a random trial-and-error sequence.

## 8. Story delivery: short, specific, interactive

Use no more than 5 short recordings/logs. Aim for 1–3 short sentences per interaction. The player should spend more time exploring than reading.

Suggested lines (rewrite during implementation if needed):

- ORPHEUS, opening: “Recovery cycle 017 complete. Welcome back, Dr. Sen. Please remain calm.”
- First anomaly: “This panel has not been opened since the incident.” (The ECHO layer shows it being opened.)
- Earlier iteration note: “If you can read this, you're not the first. Don't let it call you the original.”
- Voss recording: “I know the copies aren't you. I know. I just needed one more chance to hear your voice.”
- Mira's original recording: “If a copy of me wakes up, tell her the truth. She gets to choose.”
- Reveal: “RECOVERY CYCLE 017 — SUBJECT: MIRA SEN — CONTINUITY: SIMULATED.”

Do not reveal “you are a copy” in the opening. Plant fair clues first.

## 9. Endings

### PRESERVE

The player chooses to keep the system alive. ORPHEUS thanks them and starts another recovery cycle. Final image: `RECOVERY CYCLE 018`. The player understands that the loop continues. This is not framed as a cartoonishly evil ending; it is the comfort of avoiding loss at a cost.

### RELEASE

The player shuts ECHO down. The room powers off; the current reconstruction ends. Mira's final message says, “You don't have to keep waking up for me.” The ending is quiet, not triumphant.

Both choices must feel understandable. Do not tell players which one is “correct.”

## 10. Cinematic direction

### Visual language

- Top-down 2D, detailed but restrained pixel art.
- Internal resolution around 320×180 or 384×216, scaled by an integer factor.
- Tight palette: deep navy/near-black, desaturated blue-green, limited warm amber/red for warnings.
- Strong silhouettes and pools of light. Keep important interactive objects visually distinct.
- Reuse the same room composition; change a few props, lights and text to show the ECHO/present discrepancy.
- Use short fades, controlled camera pauses, and framed compositions for reveals. Avoid constant camera movement that blurs pixel art.

### Audio language

Use layers, not a wall of music:

1. Low station hum as the base.
2. Small local sounds: relay clicks, ventilation, electrical buzz, distant metal movement.
3. ECHO filter: reversed/filtered ambience or a short pulse when the memory layer appears.
4. Silence immediately before the reveal and final choice.

A spoken voice actor is optional. Text-only logs with excellent sound effects are safer under the time limit. Record original lines on a phone only if a teammate can clean them quickly; otherwise use concise on-screen text.

### Cinematic sequence beats

- **Opening:** Black screen → `RECOVERY CYCLE 017` → relay click → cryo bay fades in → ORPHEUS greeting.
- **First anomaly:** Player examines photo; on revisiting, one face/position has changed.
- **Previous iteration:** A message is found in a place the ECHO layer reveals was deliberately hidden.
- **Reveal:** Final timeline card snaps into place; music cuts; terminal exposes `ITERATION 017`.
- **Choice:** Fade UI down; two large options; pause before confirmation; let audio and image carry the ending.

## 11. UI and controls

- WASD / arrow keys: move.
- E: interact / inspect.
- Q or Space: hold to view ECHO (pick one; avoid conflicting with movement).
- Esc: pause/close current interaction if needed.
- Show a one-line control hint at the start and contextual `E — Inspect` prompt near objects.
- Keep dialogue panel large enough to read and short enough not to block the scene.
- Provide a visible mute toggle if audio is used.
- Do not make mouse-only interaction mandatory.

## 12. Technical recommendation

Use **Phaser 4 + TypeScript + Vite** as a small static browser game. It fits the team's TypeScript experience and can be shared as a URL. Use Bun for setup if the team already has it.

Suggested start:

```bash
bun create @phaserjs/game@latest
```

Choose a minimal TypeScript/Vite starter. Pin the Phaser version once created; do not upgrade dependencies during the event.

Suggested structure:

```text
src/
  main.ts
  config/gameConfig.ts
  scenes/BootScene.ts
  scenes/MenuScene.ts
  scenes/StationScene.ts
  data/story.ts
  data/rooms.ts
  systems/interaction.ts
  systems/echo.ts
  systems/puzzle.ts
  ui/dialoguePanel.ts
public/
  assets/
    tiles/
    characters/
    props/
    audio/
```

Keep all three rooms in one `StationScene` if that is faster. Use simple room-state data to show/hide objects and layers. A backend, database, authentication, live AI, multiplayer, analytics or account system is unnecessary.

### Why Phaser rather than Godot/Unity for this event

- The team already knows TypeScript and web deployment.
- Phaser is built for browser 2D games and has TypeScript definitions.
- A static site can be tested locally and deployed quickly.
- Godot can export to web, but its web export adds WebAssembly/WebGL requirements and renderer/export considerations. That is manageable for a Godot team, but unnecessary setup risk for this team's existing stack.
- Unity is overkill for a small top-down 2D browser narrative prototype.

### Pixel-art tooling

Use Pixelorama (free/open-source) or Aseprite if already installed. Export PNG sprites/spritesheets. AI image generation may be useful for moodboards, but do not treat a generated image as a finished tilemap/spritesheet: the pixel grid, perspective, palette and tile edges need consistency.

## 13. Team division

For a 4-person team:

- **You — Creative director + integration:** lock scope, own the main branch, coordinate agents, integrate, test the full game and pitch.
- **Programmer / OpenCode lead:** movement, collisions, interaction, room states, ECHO mechanic and game flow.
- **Artist:** player sprite, tiles, three room compositions, props and key visual changes between present/ECHO states.
- **Writer / audio / puzzle designer:** logs, clue logic, timeline puzzle, ambience/SFX, hint text and ending sequence.

If only 2–3 people: cut optional clues and extra animation first. Do not cut the ending or the ECHO mechanic.

## 14. AI-agent workflow

- **GSD Core:** create a concise vision, scope, implementation plan and acceptance checklist. Do not spend an hour on process. Keep planning to 10 minutes.
- **OpenCode:** primary implementation owner and integration authority. Only one agent owns the main game architecture.
- **Freebuff:** isolated content task (story text, clue data, puzzle test cases) or one independent UI component in a separate worktree. It must not edit the same files as OpenCode.
- **Antigravity:** launch the running game in a real browser, play the flow, capture problems and verify visual/UI behaviour. Prefer browser QA over a third parallel implementation.
- **Ralph Loop:** optional, bounded to one small bug/failure at a time with a maximum of 2–3 iterations. Do not let it freely refactor the game.

Use separate Git worktrees/branches for concurrent code edits. Merge only after reviewing the diff and running the build. The agent that owns integration must remain clear.

## 15. Acceptance criteria (definition of done)

The game is ready to submit when:

- It opens from a fresh browser load with no console-breaking errors.
- The player can move, collide with walls and interact with every required object.
- ECHO mode visibly changes the room and reveals at least three meaningful clues.
- Each puzzle is solvable and has a hint path; no softlocks.
- The timeline reveal correctly identifies Iteration 017.
- Both endings play and the game can restart.
- A player can understand the controls without verbal explanation.
- The first playthrough takes roughly 8–12 minutes, not 20 minutes of reading.
- The submission is hosted or otherwise launchable and has a short demo route.

## 16. What to cut first if behind

Cut in this order:

1. Secret ending.
2. Optional hidden memory collectibles.
3. Voice acting.
4. Extra walk-cycle frames / fancy lighting.
5. One secondary puzzle (replace with a short interaction).

Never cut:
- A working ECHO mechanic.
- The core reveal.
- A meaningful final choice.
- A complete ending and restart.
- Basic QA and submission.

## 17. Playtest checklist

Ask 2–3 people who have not heard the story to play without help. Observe silently.

- Do they know how to move and interact?
- Do they discover ECHO mode naturally?
- Do they understand why the past layer matters?
- Can they solve each puzzle without random guessing?
- Before the reveal, can they form a plausible theory?
- After the reveal, can they explain why ORPHEUS continued the cycle?
- Does the final choice feel emotionally difficult rather than arbitrary?
- Where do they stop, get confused or mash keys?

A puzzle that requires the developer to explain it is not finished. Add a clear prompt or hint.

## 18. 30-second pitch

“ECHO//CHAMBER is a short pixel-art psychological thriller set in an abandoned research station. You can briefly reveal how each room looked in the past, then compare those memories with the present to solve environmental puzzles. As the station AI contradicts your discoveries, you learn you're the seventeenth reconstruction of a researcher—and that earlier versions have been leaving clues for you. The final question is whether to preserve the loop or end it.”

## 19. Judge demo route (60–90 seconds)

1. Start in the cryo bay and show the movement/interact prompt.
2. Press ECHO; reveal the hidden keycard/panel state.
3. Show one light-sequence or timeline puzzle.
4. Reveal `ITERATION 017` and the preserve/release choice.
5. Explain that the same mechanic drives exploration, puzzles and narrative.

Do not begin by explaining the entire lore. Let the judge see the mechanic first.

---

## Research references

- CodeDay Bengaluru event page and timetable: https://event.codeday.org/en-US/bengaluru
- Phaser official docs (framework, browser focus, TypeScript): https://phaser.io/oss/docs
- Phaser official install guide (Bun create command): https://docs.phaser.io/phaser/getting-started/installation
- Phaser 4 official Pixel Art Guide: https://github.com/phaserjs/phaser/blob/master/docs/Phaser%204%20Pixel%20Art%20Guide/Phaser%204%20Pixel%20Art%20Guide.md
- Godot official web export requirements: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html
- GDC: What Happened Here? Environmental Storytelling: https://www.gdcvault.com/play/1012647/what-happened-here-environmental
- GDC: Environmental Narrative: Your World is Your Story: https://www.gdcvault.com/play/1012712/Environmental-Narrative-Your-World-is
- DiGRA paper: Game Spaces Speak Volumes: Indexical Storytelling: https://dl.digra.org/index.php/dl/article/view/512
- GDC Audio Summit: How Sound Can Make You Feel: https://www.gdcvault.com/play/1034773/Audio-Summit-How-Sound-Can
- Pixelorama features and sprite-sheet export: https://pixelorama.org/ and https://pixelorama.org/user_manual/save_and_export/
