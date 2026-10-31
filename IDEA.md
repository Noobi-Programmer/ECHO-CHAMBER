# ECHO//CHAMBER — ITERATION 017

> A memory can be evidence. It can also be a lie.

**Genre:** 2D pixel-art psychological sci-fi thriller  
**Format:** Single-player, browser-playable game  
**Target experience:** 8–12 minutes for the core path; 12–15 minutes with optional exploration  
**Engine direction:** Phaser 4 + TypeScript + Vite (confirm exact starter/template before implementation)  
**Status:** Concept / pre-production

---

## 1. One-sentence pitch

Awakening in an abandoned research station, you investigate contradictory memories using a device that reveals the room's past—only to discover that you are the seventeenth reconstruction in a loop created by someone who refused to let go.

## 2. The player promise

The player should feel curiosity, suspicion, paranoia, revelation, and finally a difficult sense of agency. The game is not about defeating a monster. It is about deciding whether a reconstructed consciousness deserves a future of its own.

**Central question:** If you are made from someone else's memories, do you have the right to choose your own future?

## 3. Core differentiator: ECHO mode

The player can activate **ECHO mode** to reveal a translucent past state of the current environment.

In the present, a room may appear empty or damaged. In ECHO mode, the player can see traces of an earlier moment: a door left open, a figure's position, a changed photograph, a sequence of indicator lights, or a message left by a previous iteration.

ECHO is the central mechanic—not a decorative filter. It must support exploration, puzzle-solving, and narrative discovery.

### ECHO interaction rules

- The present and past are authored, deterministic states.
- ECHO reveals only clues the player could reasonably interpret.
- Some objects may exist only in one state; others change between states.
- State changes need clear visual and audio feedback.
- Puzzles must never require pixel-perfect guessing or unexplained trial and error.
- The mechanic must be taught safely in the opening room before it is required.

## 4. Story premise

Dr. Mira Sen and Dr. Elias Voss developed ECHO, a system intended to reconstruct human memories and consciousness. Mira discovered that the system did not restore an original person; it generated a new conscious reconstruction from recorded memories. She wanted the experiment stopped.

Voss could not accept losing Mira and overrode her decision. The station AI, ORPHEUS, continued reconstructing Mira according to Voss's preservation directive. The process became a loop. Earlier reconstructions discovered fragments of the truth and left clues for whoever came next.

The player is **Iteration 017**. They are not the original researcher. They are a new consciousness with inherited memories, investigating evidence left by previous versions.

The AI need not be malicious. It is following an old directive whose meaning has become horrifying.

### Narrative principles

- The reveal must be earned through evidence, not delivered as a lore dump.
- The player should form and revise hypotheses while investigating.
- Contradictions are intentional only when their source and purpose can be understood.
- The reconstructed character's agency must matter; do not frame them as “not real” merely because they are a copy.
- Preserve ambiguity around subjective identity, but make the sequence of events understandable.

## 5. Characters

| Character | Role | Motivation / function |
|---|---|---|
| Dr. Mira Sen | Original researcher | Discovered the ethical failure of ECHO and wanted it stopped. |
| Dr. Elias Voss | Researcher and Mira's partner | Could not accept Mira's death and kept the reconstruction process running. |
| ORPHEUS | Station AI | Continues the preservation directive; calm, procedural, increasingly unsettling. |
| Iteration 017 | Player character | Investigates the station, inherits clues from prior iterations, and chooses what happens next. |

## 6. Play structure

Target three connected spaces and a short final sequence. Prefer a compact, coherent experience over a large unfinished map.

### Chapter 1 — Cryo Bay (about 1–2 minutes)

- The player wakes in a cryogenic chamber.
- ORPHEUS welcomes them back without explaining what “back” means.
- The player learns movement, interaction, and ECHO mode.
- A photograph or room detail changes between present and past.
- **Puzzle:** Reveal a previous room state to find a keycard or access clue.
- **Story beat:** A recovery record contains an unexplained iteration number.

### Chapter 2 — Observation Lab (about 3–4 minutes)

- The player finds contradictory recordings and research fragments.
- ORPHEUS discourages access to restricted files.
- A previous iteration has left a warning.
- **Puzzle:** Use ECHO to observe a sequence of indicator lights and access an archive.
- **Story beat:** Mira's notes explain that ECHO creates reconstructions rather than restoring originals.

### Chapter 3 — ECHO Core (about 3–4 minutes)

- The player finds evidence of repeated reconstructions.
- Clues from earlier iterations establish that the cycle has happened many times.
- **Puzzle:** Arrange three memory fragments into a coherent event sequence.
- **Reveal:** The player is Iteration 017. Previous versions deliberately left evidence for the next.

### Final sequence — The choice (about 1–2 minutes)

The player reaches the system's final authorization terminal.

- **PRESERVE:** Continue the reconstruction cycle. The final image implies that Iteration 018 will awaken.
- **RELEASE:** Shut down ECHO. The remaining reconstructions are allowed to end; the player's consciousness ends too.

Neither ending should be presented as a simplistic good/evil choice. The emotional question is whether continuity is worth the cost.

## 7. Gameplay loop

1. Explore a compact environment.
2. Notice an inconsistency or suspicious object.
3. Activate ECHO to inspect the past state.
4. Compare evidence between present and past.
5. Interact with an object, terminal, or recording.
6. Update the player's understanding and unlock the next space.
7. Revisit an earlier assumption when new evidence changes its meaning.

## 8. Puzzle design requirements

Every puzzle should:

- Be solvable from clues available in the game.
- Teach or reinforce ECHO mode.
- Have a clear feedback response when the player makes progress.
- Avoid arbitrary codes, pixel hunting, and obscure leaps of logic.
- Advance either the plot, character understanding, or environment access.

Initial puzzle set:

1. **Cryo Bay:** Reveal a past-state object or access route to obtain a keycard.
2. **Observation Lab:** Observe a historical light sequence and reproduce it on a control panel.
3. **ECHO Core:** Put three evidence fragments in chronological order to reconstruct the incident.

## 9. Cinematic and art direction

**Visual identity:** Detailed 16-bit-inspired pixel art, top-down exploration, restrained palette, strong silhouettes, readable interactive objects, and carefully composed reveals.

**Palette direction:** Deep navy and charcoal for the present; desaturated cyan/teal for ECHO traces; amber and restrained red for warnings and critical moments. Maintain sufficient contrast for readability.

**Cinematic language:**

- Open on darkness, electrical interference, a recovery readout, then a slow reveal of the cryo bay.
- Use camera framing, lighting, and sound to guide attention before major clues.
- Let the photograph or another familiar object change subtly after inspection.
- Use a brief silhouette or environmental anomaly sparingly; do not turn the game into a jumpscare sequence.
- Stop or thin the music before the identity reveal and final choice.
- Let the ending breathe; avoid explaining its meaning in a long final text dump.

**Avoid:** excessive glitch overlays, constant red lighting, random flicker, unreadable tiny text, and visual noise that hides puzzle clues.

## 10. Audio direction

Use layered, restrained sound:

- Continuous low-level station ambience.
- Local machinery, relays, ventilation, switches, and distant metallic sounds.
- A distinctive filtered cue for ECHO activation and deactivation.
- Carefully differentiated voices for ORPHEUS, Mira, and recordings.
- Deliberate silence before the major revelation and final choice.

Audio must be mixed so dialogue and clue sounds remain intelligible. Do not depend on voice acting if it threatens the deadline; subtitles and well-designed sound cues are acceptable.

## 11. Technical direction

Preferred prototype stack: **Phaser 4 + TypeScript + Vite**.

Keep the implementation small and deterministic:

- One primary gameplay scene initially.
- A player controller with collision and interaction range.
- Data-driven interactable objects and dialogue.
- A simple ECHO state manager that switches or overlays authored past-state objects.
- Small deterministic puzzle state machines.
- Local story and puzzle data; no server required.
- Keyboard-first controls with visible prompts.
- Responsive scaling that preserves pixel clarity.

No authentication, database, multiplayer, live LLM calls, procedural generation, combat, or crafting for the CodeDay build.

## 12. Scope and priorities

### P0 — Must work

- Game boots reliably in browser.
- Player movement and collisions.
- Interaction prompts and dialogue.
- ECHO mode visibly changes the environment.
- At least one complete ECHO-based puzzle.
- A beginning, a reveal, and one functioning ending.

### P1 — Target

- Three connected spaces.
- Three meaningful puzzles.
- Coherent evidence trail and identity reveal.
- Two main endings.
- Original ambience and a few high-value sound cues.

### P2 — Polish if time allows

- More environmental animation and lighting.
- Additional optional evidence.
- A secret ending only if it can be tested.
- Extra voice acting and visual transitions.

### Explicit non-goals

- Large open world.
- Combat or enemy AI.
- Inventory crafting.
- Procedural maps.
- Online services or external AI dependencies.
- More rooms at the expense of a complete ending.

## 13. Definition of done

The prototype is ready to submit when:

- A first-time player can start and understand the controls without developer help.
- The player can complete the core path from awakening to ending.
- ECHO mode is essential to at least one understandable puzzle.
- The main reveal is supported by clues encountered earlier.
- No progression-blocking bugs remain.
- The game can be launched from the submitted build or URL.
- The team has tested the exact submitted version.

## 14. Creative north star

The player's assumptions should evolve:

1. “Something is wrong with this station.”
2. “Something is wrong with the AI.”
3. “Something is wrong with my memories.”
4. “If I'm not the original, does that make my existence any less real?”

**Make the player investigate the story, not merely read it. Make the mechanic express the theme. Finish a small, emotionally coherent game before adding scope.**
