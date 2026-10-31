# PUZZLE_NARRATIVE_SPEC — ECHO//CHAMBER

**Status:** PROPOSAL v0.2. IDs match `NARRATIVE_STATE_SPEC.md`.

## Design principles
1. **Every puzzle is a story fact the player proves.** P1 proves *the room has been staged*. P2 proves *a memory lied*. P3 proves *you are part of the record*.
2. **The three puzzles use three reasoning types:** follow an action (P1), weigh testimony against evidence (P2), order events by causality (P3).
3. **No pixel hunts.** Every required object has an interaction prompt within 24 px and a visual focal point (light, motion, or ECHO outline).
4. **No colour-only information.** Code lights are *shapes* (◯ △ □ ◇). Echo sources are *text tags*. Contested echoes *alternate*, they aren't just tinted.
5. **Hints never come from ORPHEUS** (protocol P-2: "do not guide her"). It says so if asked, which is itself a clue. Hints come from the protagonist's own inspect text, escalating over time, and from 016's muttered echo lines.
6. **No fail states, no softlocks.** Wrong answers cost nothing.

### Hint system (shared)
Each puzzle has 3 hint tiers, keyed off **time-in-state** or **failed attempts**, whichever comes first. A tier fires as a one-line inner thought in the dialogue panel the next time the player inspects any related object, or automatically after the timer (non-blocking toast).

| Tier | Timer | Content style |
|---|---|---|
| H1 | 45 s | Points attention ("The floor here sounds different.") |
| H2 | 90 s or 2 fails | Points at the mechanic ("Look back. Hold ECHO here.") |
| H3 | 150 s or 4 fails | Near-solution ("The figure put it under the third plate from the pod.") |

---

## P0 — Tutorial micro-puzzle: "The Mug" (Ch1, ~40 s)
- **Purpose:** teach ECHO with zero stakes, and plant the inheritance clue.
- **Sees:** a chipped mug on the Cradle terminal shelf, handle glued (visible seam lines).
- **Interacts:** Inspect → *"A mug. Someone glued the handle back on. Twice. You don't know how you know it was twice."* ORPHEUS: *"You may find ECHO useful. Hold [Q]."*
- **ECHO reveals:** the mug whole, steam rising, with a grease-pencil smiley on it. `SOURCE: M.SEN`.
- **Success:** player holds ECHO within range for ≥0.5 s → `FLAG_ECHO_TAUGHT`. The control hint fades.
- **Hints:** H1 at 20 s: the control hint pulses.
- **Story:** establishes echoes' sources, Mira, and the player's uncanny familiarity. Recall 3% → 9%.

---

## P1 — "Look Back" (Cradle Bay, the hidden card)

| # | Spec |
|---|---|
| 1. Narrative purpose | Prove the present is *staged*, and that someone in a gown like yours is hiding things from ORPHEUS. Introduce the unregistered source. |
| 2. What the player sees | A sealed door to the Lab with a card reader (red). Mira's locker (`M. SEN`) with a palm plate. A row of five floor plates between the pods and the terminal. The middle one sits fractionally proud, a 1-px shadow line (visible but not emphasised). |
| 3. Interactables | `OBJ_LAB_DOOR`, `OBJ_LOCKER_SEN`, `OBJ_FLOOR_PLATE_3`, `OBJ_VOSS_POD`, `OBJ_CRADLE`, `OBJ_MUG`, `OBJ_CRADLE_TERMINAL`. |
| 4. What ECHO reveals | At the locker: **ECHO_LOCKER_016**, an unregistered figure in a pale gown takes a card from the open locker, looks up at the ceiling camera, walks to plate 3, lifts it, slides the card under, and replaces the plate. Mutters: *"Look back."* The echo loops while ECHO is held (about 3.5 s, in 3 key poses for cheap animation). At the Cradle lid: **ECHO_TALLY** (optional), 16 scratched marks. |
| 5. Clues | Locker opens to your palm but holds only Mira's jacket, plus a clean rectangle in the dust where a card sat. ORPHEUS (asked about the door): *"Dr. Sen's lab card opens that door. It is kept in her locker."* Then: *"It is not there. I do not know where it is."* (True.) Opening memory showed someone at this floor. |
| 6. Reasoning | The card was kept in the locker → it's gone → ECHO shows who moved it and where → check that plate. |
| 7. Solution | Inspect `OBJ_FLOOR_PLATE_3` → "Lift" → take `ITEM_LAB_CARD` → use at `OBJ_LAB_DOOR`. |
| 8. Success recognition | `ITEM_LAB_CARD` in inventory. Door reader turns green on use. `PZ_P1 = SOLVED`. |
| 9. Wrong-answer behaviour | Lifting plates 1, 2, 4, 5 → *"Cold metal. Cabling. Nothing."* No penalty. Plate 3 is the only one with a "Lift" prompt **after** ECHO_LOCKER_016 has been seen. Before that, all plates say *"A floor plate."* This prevents solving by brute force before the story beat lands. |
| 10. Hint progression | H1: *"The locker's been opened recently. There's a clean shape in the dust."* H2: *"Whoever took it was here. Look back."* H3: *"They put it under the floor. The plate that sits a little high."* |
| 11. Advances story | ORPHEUS on success: *"That card should not be there."* (beat) *"…Please continue."* First crack in the AI's omniscience. Plants "unregistered". Recall 14%. |

**Palm locker note:** `OBJ_LOCKER_SEN` opens on first interact (no puzzle). If the player asks ORPHEUS (interact while the locker is open): *"It recognised you."* Keep this. It's one of the best lines in the game.

---

## P2 — "Two Memories of One Night" (Observation Lab)

A two-stage puzzle: **P2a Corroborate** (deduction), then **P2b The Door** (sequence).

### P2a — Corroborate
| # | Spec |
|---|---|
| 1. Narrative purpose | Teach that echoes are *testimony*. Prove that the clearest memory is the lie. Expose what Voss did. Unseal Mira's voice. |
| 2. Sees | Lab console with a key slot (red warning label: `LETHE — REMOTE`). A wall stencil reading A MEMORY YOU CAN EDIT IS NOT EVIDENCE. The big window with storm dots. Mira's desk (photo face-down, recorder with a SEALED tag). The Core door (frosted viewport, shape keypad). |
| 3. Interactables | `OBJ_LAB_CONSOLE`, `OBJ_KEY_SLOT`, `OBJ_RECORDER_SEALED`, `OBJ_WALL_RULE`, `OBJ_WINDOW`, `OBJ_PHOTO`, `OBJ_CORE_DOOR`, `OBJ_CORE_KEYPAD`. |
| 4. ECHO reveals | At the console: **ECHO_ARGUMENT_CONTESTED**. Two figures (a woman leaning on a cane, a tall man) at the console. It alternates every ~0.8 s between **Version M** (`SOURCE: M.SEN`, *dithered, soft*): her hand turns the key, his hand closes on her wrist, a snap, she says *"Turn it off. Promise me."* and **Version V** (`SOURCE: E.VOSS`, *crisp, bright*): her hand hovers, never touches the key, she says *"…I don't know, Elias."* The tag reads `CONTESTED — SEALED PENDING CORROBORATION`, and after the line both versions freeze on the hand. |
| 5. Clues | `OBJ_KEY_SLOT` inspected in the present: *"Something's broken off inside. The shaft of a key, snapped clean."* → `CL_SNAPPED_KEY`. The wall rule. Optional REC_01 (Mira's tremor), REC_02 (her consent terms). |
| 6. Reasoning | Two incompatible memories. Present physical state is objective. A snapped key in the slot means someone turned it under force → Version M. The vivid one is wrong. |
| 7. Solution | With `CL_SNAPPED_KEY` known, interact with the contested echo (while holding ECHO, or via the console's "REVIEW MEMORY" prompt) → **Corroborate** menu: `[Mira's memory]` / `[Voss's memory]` → choose Mira's → choose evidence `[Snapped key in slot]`. |
| 8. Success recognition | `PZ_P2A = SOLVED`, `FLAG_ARGUMENT_CORROBORATED`. ORPHEUS (strained, slower): *"Corroboration accepted. …I am required to unseal it."* The echo resolves to Version M only and **continues** (see P2b). `OBJ_RECORDER_SEALED` loses its seal → REC_03 playable. |
| 9. Wrong-answer behaviour | Choose Voss's memory + any evidence: *"The evidence does not support this memory."* Choose without evidence: *"Corroboration requires evidence from the present."* Choose Mira's + wrong evidence (e.g. photo): *"That does not bear on this memory."* Unlimited retries. |
| 10. Hints | H1: *"They can't both be true. Something in this room has to agree with one of them."* H2: *"What happened to the key?"* (the slot gets a subtle glint) H3: *"The key's snapped off in the slot. Someone turned it. Hard."* |
| 11. Advances story | Reveals Voss physically stopped Mira, and that his memory rewrote it. Unseals REC_03 (the midpoint). Recall 38% → 63%. |

### P2b — The Door
| # | Spec |
|---|---|
| 1. Purpose | Follow Mira's last walk. Learn that she reached the Core and stopped. |
| 2. Sees | Core door keypad: four shape-buttons ◯ △ □ ◇, plus a frosted viewport. |
| 4. ECHO reveals | After corroboration, **ECHO_CODE_MEMORY** (`SOURCE: M.SEN`, previously a `SEALED // ORPHEUS` slab over the keypad): Mira, cradling her wrist, presses **◯ → △ → ◇**. The door opens. Voss's voice: *"Mira. Please."* She stops at the threshold and doesn't go in. Each press is shown with the shape highlighted *and* a distinct tone. |
| 6. Reasoning | Repeat what you saw. |
| 7. Solution | ◯, △, ◇ on `OBJ_CORE_KEYPAD`. |
| 8. Success | Door unlocks (`PZ_P2B = SOLVED`). **Before it opens**, ORPHEUS triggers the name question (see below). |
| 9. Wrong | The wrong shape buzzes softly and the entry resets after 3 presses. After 2 fails the keypad remembers nothing, but the echo is re-viewable anytime. |
| 10. Hints | H1: *"She knew the way in."* H2: *"Look back at the door."* H3: *"Circle. Triangle. Diamond."* |
| 11. Story | Mira had the chance and didn't take it, because he was watching. That's why the lever is still waiting. |

### The Core-door beat (scripted, not a puzzle)
On `PZ_P2B = SOLVED`: the lights dim. ORPHEUS: *"Please state your name."* Then **ECHO auto-pulses once** (the only involuntary ECHO in the game). **ECHO_FROST_016**: an unregistered figure at this door (the same gown) hesitates, says *"…No."*, then while staggering writes in the frost: **DON'T ANSW**. The letters stop mid-stroke and the figure dissolves into static. Then the present returns and the frost is clean. The door opens. There is no answer UI: the player cannot reply here. ORPHEUS repeats the question every ~25 s from now on (`VO_ORPH_NAMEQ_LOOP`).

---

## P3 — "Continuity" (The Well / Core)

| # | Spec |
|---|---|
| 1. Narrative purpose | The player finishes ORPHEUS's task (restoring the record) and in doing so discovers they are *in* the record. The act of solving *is* the restoration. It is simultaneously Mira's informed-consent lock: you can't end it without seeing it all. |
| 2. Sees | A circular chamber. The Well column in the centre (slow cyan light). A **continuity rail** on the floor: an arc of 5 sockets, the 5th dark and marked `—`. Four **memory pillars** around the room, each holding a fragment shard. The Lethe lever behind a glass shutter (locked). A restoration terminal (locked). |
| 3. Interactables | `OBJ_PILLAR_F1..F4`, `OBJ_RAIL_SOCKET_1..5`, `OBJ_LETHE_SHUTTER`, `OBJ_RESTORATION_TERMINAL`, `OBJ_WELL_CONSOLE` (answer point), `OBJ_REC04_PLAYER`. |
| 4. ECHO reveals | Holding ECHO at a pillar plays its fragment (3–5 s vignette). **F1 "Storm"**: Mira (no cane, steady) and Voss mark the window, laughing, with the key on her lanyard. **F2 "Snap"**: the corroborated argument (cane, key snaps). **F3 "Wake me"**: Voss alone climbs into the stasis pod. The photo is face-up on the desk behind him, the key shaft visible in the slot. **F4 "Look back"**: an unregistered figure hides the card under plate 3. Voss's pod in the background is frosted and occupied. |
| 5. Clues | Each fragment contains ordering evidence: **lanyard key intact (F1) vs snapped (F2, F3)**; **Mira present (F1, F2) vs absent (F3, F4)**; **Voss awake (F3) vs asleep in pod (F4)**. REC_04 (on the console nearby, optional but recommended) frames F3. |
| 6. Reasoning | Causal ordering by state changes, not by remembered dates. |
| 7. Solution | Take shards and place them in sockets 1–4 as **F1, F2, F3, F4**. |
| 8. Success | `PZ_P3 = SOLVED`. Socket 5 ignites. See the reveal sequence (CINEMATIC CM-05). |
| 9. Wrong | When all 4 are placed incorrectly, ORPHEUS names the *first* inconsistency literally (error reporting is allowed under P-3): F3 before F2 → *"Continuity error. The key cannot be broken before it breaks."*; F4 before F3 → *"Continuity error. Dr. Voss cannot be asleep before he lies down."*; F2 before F1 → *"Continuity error. Her hands are steady after they shake."*; anything else → *"Continuity error."* Shards pop back to their pillars. |
| 10. Hints | H1: *"Each memory has something that changes. The key. Her cane. The pod."* H2: *"Start with the one where she's well."* H3: *"Storm, then the snap, then he sleeps, then someone hides the card."* |
| 11. Advances story | Triggers the central reveal: socket 5 → `ECHO_SELF_R017` → log → reflection → Lethe unlocks → the final question becomes answerable. Recall 94%. |

### Reveal sequence after P3 (ordered, player-driven where possible)
1. Socket 5 lights `SOURCE: R-017`. ECHO auto-plays **ECHO_SELF_R017**: a ghost replaying *the player's own recorded path* from the Cradle Bay (wake, mug, locker), shown on a small projection above the Well. *(Implementation: record player x/y + facing every 250 ms in Ch1, then replay as a ghost sprite. Fallback: an authored path.)*
2. ORPHEUS: *"Continuity restored. Subject recall: ninety-four percent."*
3. `OBJ_RESTORATION_TERMINAL` unlocks → `LOG_ITERATIONS` (16 entries + R-017 ACTIVE).
4. On closing the log: the lights drop to emergency amber. The Well column glass becomes reflective → **CM-06 reflection**.
5. `OBJ_LETHE_SHUTTER` slides open (integrity rule I-3). ORPHEUS: *"The lever is available. I am not able to prevent that."*
6. `OBJ_WELL_CONSOLE` enables **SPEAK** → final choice (see `ENDING_DESIGN.md`).

---

## Optional interaction — "Mark the storm" (secret-ending key)
- **Where:** `OBJ_WINDOW`, after `ECHO_STORM_RITUAL` has been seen.
- **Prompt:** `E — Mark the storm` (a grease pencil sits on the sill).
- **Result:** the player's sprite marks a dot. Inspect text: *"You add a dot where the storm is today. It's the only one in the window that's yours."* Sets `FLAG_STORM_MARKED`. ORPHEUS: *"Noted."* (literally true: it logs it).
- **Never required.** Pays off only in the YOUR NAME secret ending.

## Accessibility notes
- Contested-echo alternation must respect reduced motion: switch to a manual toggle (`[←] Mira's memory / [→] Voss's memory`).
- Code sequence: shapes + tones + on-screen glyph trail. Never colour alone.
- All hint text can be re-read in a pause-menu "Notes" list (stretch).
