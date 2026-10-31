# ASSET_BRIEF — narrative requirements for the asset team

**Status:** PROPOSAL v0.2. This brief says **what the story needs**. Sourcing, licences and ingestion follow `ASSET_PIPELINE.md` / `ASSET_SOURCES.md`. Nothing here authorises a download.

Priority: **E** = essential (the critical path breaks without it) · **S** = strong (a big quality gain) · **O** = optional / stretch.
Asset IDs use the `ART_` prefix and map to the gameplay `OBJ_`/`ITEM_` IDs of the same name. Sizes assume a 320×180 internal resolution and 16×16 tiles. Adjust if the engineering team picks a different base.

---

## 1. Environments

| ID | Asset | Narrative purpose | Visual requirements | P |
|---|---|---|---|---|
| `ENV_CRADLE_BAY` | Cradle Bay room | Wake, tutorial, first contradiction | ~20×11 tiles. Clinical, cold. One warm light pool over the Cradle. Five *distinct* floor plates in a row (plate 3 has a 1-px raised shadow). | E |
| `ENV_LAB` | Observation Lab | Human story, contested memory | ~22×12 tiles. A **large window** across the top wall showing the ice giant with a dark storm (`the Eye`). Two desks that read as two personalities (hers cluttered, his tidy). Wall stencil. Core door with a frosted viewport in the back wall. | E |
| `ENV_CORE` | The Well (Core) | Reveal, choice | ~16×14 tiles. Circular footprint. A central glass column (animated light). Four pillars. A floor rail with 5 sockets. Lethe lever behind a glass shutter. A terminal. A stool with a recorder. | E |
| `ENV_TRANSITIONS` | Door/fade transitions | — | Simple fades, or a 1-tile corridor if the engine prefers. | E |
| `ENV_PLANET_LOOP` | Ice giant + storm (window backdrop) | Mood, the storm ritual | A slowly rotating band texture behind the window glass. The storm drifts ~1 px per 10 s. | S |

## 2. Characters and silhouettes

| ID | Asset | Purpose | Requirements | P |
|---|---|---|---|---|
| `CHR_PLAYER` | Player (R-017) | Protagonist | ~16×24 px. **Pale gown** + a small glowing wrist unit. 4-direction walk (2–4 frames), idle. Interact pose (optional). | E |
| `CHR_ITER_GHOST` | Iteration echo figure | Relay figures | **The same sprite as the player**, recoloured for echo (cyan, outline) and **with no face** (rule E12). Poses: kneel, slide, look up, walk, write-on-glass, stagger. | E |
| `CHR_MIRA_ECHO` | Mira (echo) | Memories | Short dark hair, lab jacket, lanyard. **Two variants:** steady (F1) and with cane + tremor (F2/argument). Faceless when the source is M.SEN; 2–3 px face when the source is E.VOSS. | E |
| `CHR_VOSS_ECHO` | Voss (echo) | Memories | Tall, rolled sleeves, tool belt. Poses: lean, grab wrist, climb into pod, stand behind. | E |
| `CHR_VOSS_POD` | Voss in stasis | The stakes, visible all game | Shape behind frosted glass, hand against the glass. A wake animation for the endings (sit up, stand). | E |
| `CHR_TENDER` | Tender drone | Staged present | Cat-sized, four-legged, a brush arm. Wipe loop, scuttle. | S |
| `PORTRAIT_REFLECTION` | Face in glass | CM-07 | ~96×96 portrait. *Must match* `ITEM_PHOTO_ECHO`'s face, with a different expression (uncertain, not smiling). | S |

## 3. Key objects

| ID | Object | Purpose | Requirements | P |
|---|---|---|---|---|
| `ART_CRADLE` | Cradle pod | Where you wake | Open/closed lid. Gel sheen. Panel text. Lid interior variant with the 16-mark tally (echo only). | E |
| `ART_VOSS_POD` | Stasis pod | Voss | Frosted glass, label, vitals line. Open variant for endings. | E |
| `ART_MUG` | Mug | Tutorial and motif | Present: handle with visible glue seams. Echo: whole, steaming, a smiley. | E |
| `ART_LOCKER_SEN` | Locker | Palm clue | Closed/open. Inside: jacket, empty lanyard, a clean dust rectangle. | E |
| `ART_FLOOR_PLATE` ×5 | Plates | P1 | Plate 3 lifted variant with card + knotted fabric scrap. | E |
| `ART_ITEM_LAB_CARD` | Keycard | P1 | Inventory icon + world sprite. | E |
| `ART_LAB_DOOR` / `ART_CORE_DOOR` | Doors | Gates | Reader red/green. Core door: frosted viewport + 4-shape keypad (◯ △ □ ◇). | E |
| `ART_WINDOW_DOTS` | Window dot trail | Ritual | Dot layer (present) + an echo layer of 16 extra dots + a player-dot overlay. | E |
| `ART_LAB_CONSOLE` | Console + key slot | P2 | Slot with a snapped key shaft (zoom inspect icon). | E |
| `ART_WALL_RULE` | Stencil | Theme as evidence | Readable at 1×: `A MEMORY YOU CAN EDIT IS NOT EVIDENCE.` (2 lines). | E |
| `ART_RECORDER` | Voice recorder | REC_03/04 | Sealed-tag variant. | E |
| `ART_PILLARS` + `ART_SHARD_F1..F4` | Core | P3 | 4 shards visually distinct (icon per fragment: storm, key, pod, plate). | E |
| `ART_LETHE` | Lever | Endings | Shutter closed/open. Tape label. Pull animation (3 frames). | E |
| `ART_PHOTO` | Desk photo | Optional clue | Face-down, face-up scratched, back text, echo intact. | S |
| `ART_CREW_PHOTO` | Crew of 6 | Texture | Small frame. | O |
| `ART_WHITEBOARD` | Diagram | Texture | Crossed-out diagram. | O |

## 4. ECHO-state variations (essential list)

| ID | Room | Present | Echo |
|---|---|---|---|
| `ECHO_OPENING_016` | Cradle | — | Figure at plate 3 |
| `ECHO_MUG` | Cradle | Glued mug | Whole, steaming |
| `ECHO_LOCKER_016` | Cradle | Empty locker | Figure takes card → plate 3 |
| `ECHO_TALLY` | Cradle | Clean lid | 16 marks (O) |
| `ECHO_STORM_RITUAL` | Lab | Dots end at 1251 | Mira + Voss marking |
| `ECHO_STORM_ITERS` | Lab | — | 16 extra dots |
| `ECHO_ARGUMENT_CONTESTED` | Lab | Console | Version M / Version V |
| `ECHO_CODE_MEMORY` | Lab | Keypad (sealed slab before P2a) | Mira enters ◯△◇, door opens, she stops |
| `ECHO_FROST_016` | Lab | Clean frost | Figure writes DON'T ANSW, dissolves |
| `ECHO_F1..F4` | Core | Pillars | 4 vignettes |
| `ECHO_SELF_R017` | Core | — | Replay of the player's path (code-driven) |
| `ECHO_SIXTEEN` | Cradle (HER NAME) | — | 16 still figures |
| `ECHO_CASCADE` | All (LETHE) | — | Everything at once (reuse all layers) |

## 5. UI storytelling elements

| ID | Element | Purpose | P |
|---|---|---|---|
| `UI_ECHO_METER` | Small ring on the wrist icon, draining over ~4 s | Shows the ECHO limit | E |
| `UI_SOURCE_TAG` | Monospace tag near an inspected echo | Teaches sources | E |
| `UI_CONTESTED_TAG` / `UI_SEALED_SLAB` | — | P2 | E |
| `UI_CORROBORATE` | Two-step picker (memory → evidence) | P2a | E |
| `UI_ORPHEUS_PANEL` | Top-centre text + waveform | ORPHEUS voice | E |
| `UI_CHOICE_NONMODAL` | Docked, translucent | Final choice | E |
| `UI_RECALL_READOUT` | Terminal text `SUBJECT RECALL: n%` | Restoration clue | S |
| `UI_LOG_TYPEOUT` | Terminal log | Reveal | E |
| `UI_NAME_INPUT` | 12-char field | Secret ending | O |

## 6. Audio

| ID | Sound | Purpose | P |
|---|---|---|---|
| `AMB_CRADLE` / `AMB_LAB` / `AMB_CORE` | Room hums (3 loops, ~30 s each, slightly different pitches) | Space identity | E |
| `SFX_ECHO_ON` / `SFX_ECHO_OFF` | Swelling inverted tone, release | The mechanic's voice | E |
| `AMB_ECHO_FILTER` | Low-pass + reversed tail on ambience (DSP, not an asset) | Echo state | E |
| `SFX_RELAY_CLICK` | Dry click | Transitions, cuts | E |
| `SFX_DOOR_*` | Card accept, keypad shape tones ×4, wrong buzz, door slide | Gates | E |
| `SFX_PLATE_LIFT` | Metal scrape | P1 | E |
| `SFX_SNAP` | Small, dry snap | The argument | E |
| `SFX_CONTESTED_TICK` | Soft tick on swap | P2a | E |
| `SFX_FROST_WRITE` | Finger on glass | CM-05 | S |
| `SFX_TENDER` | Soft skitter + brush | Lab entry | S |
| `SFX_POD_PUMP` | Slow stasis pump loop | Voss's presence | S |
| `SFX_STASIS_RELEASE` | Hiss + frost crack | Endings | E |
| `SFX_LEVER` | Heavy clunk | LETHE | E |
| `SFX_TYPE_TICK` | Log type-on | Reveal | S |
| `MUS_STORM_MOTIF` | 4-note motif in 4 variations (first, major, minor solo, open) | The emotional thread | S (E for endings) |
| `SFX_ECHO_DEAD` | Static + "no signal" click | LETHE post-ending | O |
| `AMB_SIXTEEN_BREATHS` | Layered breaths | HER NAME | O |
| **Silence** | 3 planned silences | Required by design | E (free) |

**Footsteps:** one soft set for metal floors. That's enough. **Do not** request a large library.
**Copyright:** no existing game music or recognisable sound marks. Everything original or properly licensed.

## 7. Voice: where it matters most (if any recording is possible)
1. **REC_03 (Mira)**: the emotional centre. A phone recording in a quiet room, close to the mic, slightly tired. ~35 s.
2. **REC_04 (Voss)**: the self-deception. ~35 s. The pause matters more than the lines.
3. **"Please state your name." (ORPHEUS)**: one line, recorded once, used 10+ times. The best value-per-second in the game.
4. Echo whispers ("Look back.", "…No.") in one voice for all iterations. That's correct: same vocal cords.
Everything else stays as text. If there's no time: **text only, with excellent sound**. That's safer than bad VO.

## 8. Cinematic compositions (for art direction)
| Moment | Composition note |
|---|---|
| CM-01 | Cradle Bay, low angle, plate in lower-third right. Figure back to camera. |
| CM-04 | Console framed centre with Mira left and Voss right. Window light behind. |
| CM-05 | Frost viewport fills ~40% of the frame. Lettering ≥ 6 px tall. |
| CM-06 | Wide Core, the Well column dead centre, projection above. |
| HER NAME end | Two figures small against the huge window. A single dot at eye height. |
| LETHE end | One figure at the window. The amber room behind him empty. |
