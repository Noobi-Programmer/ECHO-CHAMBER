# NARRATIVE_STATE_SPEC — handoff to engineering

**Status:** PROPOSAL v0.2. This is a **narrative contract**, not an architecture. It says *what must be true when*. How the runtime stores it (scene data, TS enums, Godot resources…) is the engineering team's call (`ARCHITECTURE_PROPOSAL.md`).

**Machine-readable companion:** [`narrative_state.json`](./narrative_state.json). It was generated and reference-checked: every clue points to a real object, echo, item or recording, and every chapter boundary and emitted event is declared. It parses as valid JSON.

---

## 1. Four layers, kept separate

| Layer | What it contains | Where |
|---|---|---|
| **Narrative content** | Every line of text, recordings, environmental text | `NARRATIVE_SCRIPT.md`, `ENDING_DESIGN.md` (IDs like `VO_*`, `INS_*`, `LN_*`, `REC_*`, `ENV_*`, `SYS_*`, `QA_*`, `HINT_*`) |
| **Gameplay state** | Flags, variables, puzzle states, events, ending conditions | This file + `narrative_state.json` (`FLAG_*`, `PZ_*`, `EV_*`, `END_*`, `CH_*`) |
| **Presentation instructions** | Visual/audio triggers, scripted sequences, camera notes | `narrative_state.json` → `audioTriggers`, `visualTriggers`, `scriptedSequences`; `CINEMATIC_DIRECTION.md` |
| **Optional content** | Things that can be cut with no logic changes | `narrative_state.json` → `optionalContent`, `codedayCut` |

## 2. ID conventions (stable, unique, uppercase snake)

| Prefix | Meaning | Example |
|---|---|---|
| `ROOM_` | Space | `ROOM_LAB` |
| `CH` | Chapter | `CH2_LAB` |
| `OBJ_` | Interactable world object | `OBJ_KEY_SLOT` |
| `ITEM_` | Inventory item | `ITEM_LAB_CARD` |
| `ECHO_` | Echo state/overlay | `ECHO_ARGUMENT_CONTESTED` |
| `CL_` | Clue (knowledge unit) | `CL_SNAPPED_KEY` |
| `REC_` / `NOTE_` | Recording / readable note | `REC_03` |
| `LOG_` | Terminal log | `LOG_ITERATIONS` |
| `PZ_` | Puzzle | `PZ_P2A` |
| `FLAG_` | Boolean story flag | `FLAG_STORM_MARKED` |
| `EV_` | Event | `EV_CODE_CORRECT` |
| `CH_` (choice) | Choice option | `CH_STAY_YES` |
| `END_` | Ending | `END_LETHE` |
| `VO_ORPH_` | ORPHEUS line | `VO_ORPH_NAMEQ_LOOP` |
| `LN_` | Character/echo line | `LN_ARG_M` |
| `INS_` | Inspect text | `INS_MUG_01` |
| `QA_` | Question/answer pair | `QA_F_LETHE` |
| `SYS_` / `ENV_` / `UI_` | System / environmental / UI text | `SYS_RECALL_n` |
| `HINT_` | Hint text | `HINT_P3_2` |
| `SEQ_` | Scripted sequence | `SEQ_CORE_DOOR` |
| `SFX_` / `AMB_` / `MUS_` | Audio | `SFX_SNAP` |
| `VIS_` | Visual event | `VIS_SOCKET5` |

**Never rename an ID after merge.** Deprecate it and add a new one.

## 3. Chapter state machine

```
CH0_OPEN ──EV_CONTROL_GIVEN──▶ CH1_CRADLE ──EV_LAB_ENTER──▶ CH2_LAB ──EV_CORE_ENTER──▶ CH3_WELL
                                                                                        │
                                       EV_REFLECTION_DONE ◀──────────────────────────────┘
                                               ▼
                                           CH4_NAME ──EV_ENDING_START(id)──▶ END_* ──EV_RESTART──▶ CH0_OPEN
```

Detailed gates:

| From → To | Requires |
|---|---|
| CH1 → CH2 | `FLAG_HAS_LAB_CARD` + use at `OBJ_LAB_DOOR` |
| CH2: P2B active | `FLAG_ARGUMENT_CORROBORATED` |
| CH2 → CH3 | `EV_CODE_CORRECT` → `SEQ_CORE_DOOR` → `EV_CORE_ENTER` |
| CH3: log available | `FLAG_CONTINUITY_COMPLETE` |
| CH3 → CH4 | `EV_LOG_CLOSED` → `SEQ_AFTER_LOG` (sets `FLAG_LETHE_UNLOCKED`, `FLAG_SPEAK_ENABLED`) |
| CH4 → END | final choice or `EV_LETHE_PULLED` |

**Softlock audit:** every gate has an always-available re-trigger. The echoes can be replayed indefinitely, wrong answers reset, and no item can be lost or consumed before its use (the card is consumed on door use). Shards that fail return to their pillars.

## 4. Flags

| Flag | Set by | Read by |
|---|---|---|
| `FLAG_ECHO_TAUGHT` | `ECHO_MUG` seen | tutorial UI hide, PZ_P0 |
| `FLAG_SEEN_ECHO_LOCKER_016` | `ECHO_LOCKER_016` seen | plate 3 "Lift" prompt |
| `FLAG_HAS_LAB_CARD` | plate 3 | lab door |
| `FLAG_LAB_UNLOCKED` | lab door | — |
| `FLAG_SEEN_STORM_RITUAL` | `ECHO_STORM_RITUAL` | pencil prompt |
| `FLAG_STORM_MARKED` *(optional)* | `ACT_MARK_STORM` | `END_YOUR_NAME` |
| `FLAG_SEEN_CONTESTED` | contested echo | PZ_P2A active |
| `FLAG_CLUE_SNAPPED_KEY` | key slot | corroborate evidence list |
| `FLAG_ARGUMENT_CORROBORATED` | P2a success | REC_03 unseal, P2B, code echo |
| `FLAG_REC03_PLAYED` | REC_03 | (analytics/QA only) |
| `FLAG_CODE_ENTERED` | P2b success | `SEQ_CORE_DOOR` |
| `FLAG_NAMEQ_ACTIVE` | `SEQ_CORE_DOOR` | name loop |
| `FLAG_HEARD_REC04` | REC_04 | (optional hint gating) |
| `FLAG_CONTINUITY_COMPLETE` | P3 | log terminal, `SEQ_REVEAL` |
| `FLAG_LOG_READ` | log closed | `SEQ_AFTER_LOG` |
| `FLAG_LETHE_UNLOCKED` | `SEQ_AFTER_LOG` | Lethe lever |
| `FLAG_SPEAK_ENABLED` | `SEQ_AFTER_LOG` | Well console |
| `FLAG_READ_NOTE06` *(optional)* | jacket note | — |

**Variables:** `recall` (int; display only; step table in JSON `recallSteps`), `playerName` (string ≤ 12, default "Seventeen"), `ch1PathSamples` (optional; for `ECHO_SELF_R017`).

## 5. Ending conditions (structured, not free-form strings)

```json
"END_HER_NAME":  { "all": [ {"choice":"CH_MIRA"}, {"choice":"CH_STAY_YES"} ] }
"END_LETHE":     { "all": [ {"flag":"FLAG_LETHE_UNLOCKED"}, {"event":"EV_LETHE_PULLED"} ] }
"END_CYCLE_018": { "any": [ { "all": [ {"choice":"CH_MIRA"}, {"choice":"CH_STAY_NO"} ] },
                            { "all": [ {"choice":"CH_OTHER"}, {"not":{"flag":"FLAG_STORM_MARKED"}} ] } ] }
"END_YOUR_NAME": { "all": [ {"choice":"CH_OTHER"}, {"flag":"FLAG_STORM_MARKED"} ] }   // stretch
```
If `END_YOUR_NAME` is cut, `CH_OTHER` always routes to `END_CYCLE_018`. If `END_CYCLE_018` is also cut, remove `CH_OTHER` and `CH_STAY_NO`. The final choice is then just "Mira → stay" vs walk to the lever.

## 6. Hint text table

| ID | Text |
|---|---|
| `HINT_P1_1` | "The locker's been opened recently. There's a clean shape in the dust." |
| `HINT_P1_2` | "Whoever took it was here. Look back." |
| `HINT_P1_3` | "They put it under the floor. The plate that sits a little high." |
| `HINT_P2A_1` | "They can't both be true. Something in this room has to agree with one of them." |
| `HINT_P2A_2` | "What happened to the key?" |
| `HINT_P2A_3` | "The key's snapped off in the slot. Someone turned it. Hard." |
| `HINT_P2B_1` | "She knew the way in." |
| `HINT_P2B_2` | "Look back at the door." |
| `HINT_P2B_3` | "Circle. Triangle. Diamond." |
| `HINT_P3_1` | "Each memory has something that changes. The key. Her cane. The pod." |
| `HINT_P3_2` | "Start with the one where she's well." |
| `HINT_P3_3` | "Storm, then the snap, then he sleeps, then someone hides the card." |
| `VO_ORPH_CONT_ERR_KEY` | "Continuity error. The key cannot be broken before it breaks." |
| `VO_ORPH_CONT_ERR_POD` | "Continuity error. Dr. Voss cannot be asleep before he lies down." |
| `VO_ORPH_CONT_ERR_HANDS` | "Continuity error. Her hands are steady after they shake." |
| `VO_ORPH_CONT_ERR_GENERIC` | "Continuity error." |

## 7. ECHO behaviour contract (for the ECHO system owner)
1. Hold-to-view (proposal: `Q`). Max ~4 s, 1 s cooldown. *(The playtest can switch to toggle; the fiction supports either.)*
2. While held, render every echo layer anchored to the current room whose `requires` is satisfied.
3. Each echo layer may be: `static` (props), `vignette` (short looping pose sequence), `contested` (two variants alternating, `swap` event), `sealed` (slab), `scripted` (engine-driven, e.g. opening, frost, self-replay).
4. An inspectable echo shows its `source` tag.
5. `involuntary` echoes (only `ECHO_FROST_016`) play regardless of input.
6. Reduced-motion: contested → manual toggle. Scanline shimmer → static outline.

## 8. Events the narrative needs fired (minimum set)

`EV_GAME_START, EV_CONTROL_GIVEN, EV_ECHO_FIRST_USE, EV_LOCKER_OPENED, EV_ECHO_LOCKER_SEEN, EV_CARD_TAKEN, EV_LAB_ENTER, EV_STORM_SEEN, EV_STORM_MARKED, EV_CONTESTED_SEEN, EV_SNAPPED_KEY_FOUND, EV_CORROBORATE_FAIL, EV_CORROBORATE_SUCCESS, EV_REC03_PLAYED, EV_CODE_FAIL, EV_CODE_CORRECT, EV_CORE_DOOR_BEAT, EV_CORE_ENTER, EV_REC04_PLAYED, EV_SHARD_TAKEN, EV_SHARD_PLACED, EV_CONTINUITY_ERROR, EV_CONTINUITY_COMPLETE, EV_SELF_REPLAY_DONE, EV_LOG_CLOSED, EV_REFLECTION_DONE, EV_FINAL_QA, EV_FINAL_ANSWER, EV_LETHE_PULLED, EV_ENDING_START, EV_ENDING_DONE, EV_RESTART, ECHO_HOLD_START, ECHO_HOLD_END`

Audio and visual trigger bindings for these events are in the JSON (`audioTriggers`, `visualTriggers`).

## 9. CodeDay build order (suggested, narrative-side)
1. Rooms + movement + inspect text (CH1 objects).
2. ECHO overlay with `ECHO_MUG` + `ECHO_LOCKER_016` → P1 end to end.
3. Lab: storm echo, contested echo + corroborate picker, keypad → `SEQ_CORE_DOOR`.
4. Core: pillars + rail ordering → `SEQ_REVEAL` (authored self-path) → log → `SEQ_AFTER_LOG`.
5. Final choice + `END_HER_NAME` + `END_LETHE`.
6. If time: `END_CYCLE_018`, REC_02, the photo, recorded self-path.
