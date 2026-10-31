# NARRATIVE_SCRIPT — ECHO//CHAMBER

**Status:** PROPOSAL v0.2. Game-ready text, pending Abi's approval. It replaces the placeholder `NARRATIVE_SCRIPT_DRAFT.md` once approved.
**IDs** are stable and match `NARRATIVE_STATE_SPEC.md`. Endings are scripted in `ENDING_DESIGN.md`.

## Conventions
- `ORPHEUS` speaks through ceiling speakers. Text appears in a slim top-centre panel with a small waveform, and it never blocks movement.
- **Inspect text** is the protagonist's inner voice: second person, present tense, bottom panel.
- **Echo lines** appear as subtitles inside the echo (italic, with a source tag) and only while ECHO is held. If ECHO is released mid-line, the line finishes as a fading subtitle.
- `[Q]` = ECHO key, `[E]` = interact. Keep every panel **≤ 2 lines at 320×180**.
- ✂ = cut for the CodeDay build. ★ = critical path, never cut.

### ORPHEUS line audit
Every ORPHEUS line below is **literally true** (integrity rule I-1). Lines that sound like lies are annotated with `⟂` and the reason they're true.

---

## 0. Cold open — "Look Back" (0:00–0:45) ★

| ID | Type | Text / direction |
|---|---|---|
| `SFX_OPEN_BREATH` | audio | Black screen. 4 s of silence, then a slow breath, close and unfamiliar. |
| `ECHO_OPENING_016` | visual | Fade in **already in ECHO grade**: the Cradle Bay, cyan, with the scanline shimmer. A figure in a pale gown kneels at the floor, back to camera, sliding something under a plate. |
| `LN_016_OPEN_01` | echo line `— UNREGISTERED —` | *"Okay. Okay."* |
| `LN_016_OPEN_02` | echo line | *"Look back."* |
| `VIS_OPEN_LOOKUP` | visual | The figure looks up at the ceiling camera (toward us). Face in shadow. Hold 1 s. |
| `SFX_OPEN_CUT` | audio/visual | Hard cut. A burst of frost-white static, then **black**. The relay click. |
| `SYS_OPEN_01` | system text (tiny, bottom-left, 2 s) | `CRADLE // WEAVE COMPLETE` |
| `VIS_WAKE` | visual | The present Cradle Bay, dark navy. The Cradle lid slides back. The player sprite sits up in gel residue. Control is given **≤ 8 s after the cut**. Prompt: `WASD — move`. |

---

## 1. Chapter 1 — "The Cradle" (Cradle Bay, 0:45–4:00)

### ORPHEUS — waking ★
| ID | Trigger | Text |
|---|---|---|
| `VO_ORPH_WAKE_01` | on control | "You are awake. Good." |
| `VO_ORPH_WAKE_02` | +3 s | "Please take your time. Your body has been still for a long while." ⟂ *(true: 181 days in the weave)* |
| `VO_ORPH_WAKE_03` | +4 s | "Can you tell me your name?" |
| `UI_WAKE_NAME` | choice panel, single option | `[ … ]` (the player can only pick silence) |
| `VO_ORPH_WAKE_04` | after choice | "That is all right. It will come to you." ⟂ *(ORPHEUS's model of recall)* |
| `VO_ORPH_WAKE_05` | +2 s | "I am ORPHEUS. I look after Asphodel Station." |
| `VO_ORPH_WAKE_06` | +3 s | "There was an incident. The station's records are incomplete. I would like your help restoring them." ⟂ *(true: restoring Mira is restoring the record)* |

### Cradle Bay — inspect text
| ID | Object | Text |
|---|---|---|
| `INS_CRADLE_01` | `OBJ_CRADLE` | "The pod you woke in. Warm gel, not frost. Not like any stasis pod you can picture." |
| `INS_CRADLE_PANEL` | `OBJ_CRADLE` (2nd) | Panel reads: `CRADLE · CYCLE 17 · WEAVE COMPLETE · ANCHOR STABLE` |
| `INS_CRADLE_LID_ECHO` | `ECHO_TALLY` (optional) | "Scratches inside the lid. Four groups of four. Somebody was counting." *(source tag: multiple `— UNREGISTERED —`)* |
| `INS_VOSS_POD_01` ★ | `OBJ_VOSS_POD` | "Frost on the glass. Someone inside, very still. A vitals line crawls across the frame." |
| `INS_VOSS_POD_02` | 2nd | Label: `E. VOSS — HOLD`. "A man's hand rests against the glass from the inside. The fingers are curled around nothing." |
| `INS_MUG_01` ★ | `OBJ_MUG` | "A mug. Someone glued the handle back on. Twice." (beat) "You don't know how you know it was twice." |
| `INS_MUG_ECHO` | `ECHO_MUG` | "Whole. Steaming. Someone drew a smiley on it in grease pencil." `SOURCE: M.SEN` |
| `INS_LOCKER_01` ★ | `OBJ_LOCKER_SEN` | "`M. SEN`. A palm plate." |
| `INS_LOCKER_02` ★ | interact | "You put your hand on it without thinking. It opens." |
| `INS_LOCKER_03` ★ | open locker | "A jacket. A lanyard with no key. A clean rectangle in the dust, card-sized, where something lay until recently." |
| `INS_LOCKER_JACKET` | jacket (optional) | "There's a folded note in the pocket." → `NOTE_06_NAMES` |
| `INS_LAB_DOOR` ★ | `OBJ_LAB_DOOR` | "Sealed. The reader wants a card." |
| `INS_PLATE_GENERIC` | plates 1–5 (before echo) | "A floor plate." |
| `INS_PLATE_EMPTY` | plates 1,2,4,5 (after echo) | "Cold metal. Cabling. Nothing." |
| `INS_PLATE_3` ★ | plate 3 (after echo) | "It sits a little high. It lifts." → "A keycard, face down: `LAB · M. SEN`. And a scrap of gown fabric, knotted, like a bookmark." |
| `INS_CREW_PHOTO` ✂ | `OBJ_CREW_PHOTO` | "Six people in front of the station's first window. Two of them are standing too close to be colleagues." |
| `INS_TERMINAL_RECALL` | `OBJ_CRADLE_TERMINAL` | `SUBJECT RECALL: 9%` (updates with progress) |

### ORPHEUS — Ch1 reactive ★
| ID | Trigger | Text |
|---|---|---|
| `VO_ORPH_ECHO_TUT` | near the mug, or 25 s idle | "There is a device on your wrist. It is called ECHO. Hold [Q]. It shows what this room remembers." |
| `VO_ORPH_RECALL_01` | first echo seen | "Good. Your recall is improving." |
| `VO_ORPH_ECHO_LIMIT` | ECHO held to limit (first time) | "Gently. It is a lot to take in at once." |
| `VO_ORPH_DOOR_CARD` | inspect lab door | "Dr. Sen's lab card opens that door. It is kept in her locker." |
| `VO_ORPH_CARD_GONE` | locker opened and empty | "It is not there. I do not know where it is." ⟂ *(true: blind spot)* |
| `VO_ORPH_RECOGNISED` | interact with open locker again | "It recognised you." ⟂ *(true)* |
| `VO_ORPH_NO_DOORS` | try the door 3× without card | "I am not permitted to open doors for you." |
| `VO_ORPH_CARD_FOUND` | take card | "That card should not be there." (2 s) "…Please continue." |

### Terminal Q&A (Cradle terminal, optional, each once) ✂ keep at least the first two
| ID | Question | ORPHEUS |
|---|---|---|
| `QA_C1_HAPPENED` | "What happened here?" | "Dr. Sen and Dr. Voss were the last crew aboard. What happened to them is in the records we are restoring." |
| `QA_C1_POD` | "Who's in the other pod?" | "Dr. Voss. He is resting. Please do not disturb him." |
| `QA_C1_WHO_AM_I` | "Who am I?" | "That is one of the things we are restoring." ⟂ |
| `QA_C1_WHERE_SEN` | "Where is Dr. Sen?" | "Dr. Sen is not aboard." ⟂ *(her body was committed to the planet on MD 1,261; her pattern is not "her" by ORPHEUS's protocol until confirmed)* |

### ECHO — the hidden card ★
| ID | Text |
|---|---|
| `ECHO_LOCKER_016` | The unregistered figure (pale gown, wrist unit glint) takes a card from the open locker, glances at the ceiling camera, crosses to plate 3, lifts it, slides the card under, presses the plate down. |
| `LN_016_LOCKER` | *"If they find it in the locker, they'll never look back."* `— UNREGISTERED —` |
| `INS_ECHO_FIGURE` | (inspect the echo figure) "Same gown as yours. Same device on the wrist. You can't see the face." |

---

## 2. Chapter 2 — "Testimony" (Observation Lab, 4:00–9:30)

### Entry ★
| ID | Trigger | Text |
|---|---|---|
| `VIS_TENDER_WIPE` | door opens | The Tender is wiping the big window with a soft brush. It stops, turns its sensor toward the player, and scuttles into a wall hatch. |
| `VO_ORPH_TENDER` | +1 s | "Excuse the Tender. It keeps things as they were." |
| `SYS_LAB_RECALL` | lab terminal | `SUBJECT RECALL: 22%` |

### Lab — inspect text
| ID | Object | Text |
|---|---|---|
| `INS_WINDOW_01` ★ | `OBJ_WINDOW` | "The ice giant fills the glass. A dark storm sits near its edge like a bruise. The glass is covered in tiny grease-pencil dots, a trail that spirals in and stops." |
| `INS_WINDOW_02` | 2nd | "The last dot has a number beside it: `1251`." |
| `INS_WALL_RULE` ★ | `OBJ_WALL_RULE` | Stencil: `A MEMORY YOU CAN EDIT IS NOT EVIDENCE.` "Underlined by hand. Twice." |
| `INS_CONSOLE` ★ | `OBJ_LAB_CONSOLE` | `ECHO OVERSIGHT`. A key slot labelled `LETHE — REMOTE · KEY REQUIRED`. |
| `INS_KEY_SLOT` ★ | `OBJ_KEY_SLOT` | "Something's broken off inside. The shaft of a key, snapped clean." → `CL_SNAPPED_KEY` |
| `INS_PHOTO_01` | `OBJ_PHOTO` | "A photo, face down." |
| `INS_PHOTO_02` | turn over | "Two people at this window. The woman's face has been scratched away, carefully, with something sharp." |
| `INS_PHOTO_03` | back | In pencil: `SHE IS NOT YOU` |
| `INS_PHOTO_ECHO` | `ECHO_PHOTO` | "Whole again. Short dark hair, a crooked half-smile. You look at her longer than you mean to." `SOURCE: M.SEN` |
| `INS_RECORDER_SEALED` ★ | `OBJ_RECORDER_SEALED` | "A voice recorder. A tag across it: `SEALED // ORPHEUS`." |
| `VO_ORPH_SEALED` | after above | "That recording is sealed." |
| `QA_SEALED_BY` | "Sealed by who?" | "By Dr. Voss's instruction." |
| `INS_WHITEBOARD` ✂ | whiteboard | A diagram: `ROOM STATE → SENSOR REPLAY` crossed out, replaced with `MEMORY → LOCATION TAG → WELL`. A note in a different hand: `testimony ≠ recording!!`. |
| `INS_VOSS_DESK` | Voss's workstation | "A tidy desk. A tube of glue. Three spare mug handles, still in the packet." → enables REC_01 |
| `INS_PENCIL` | window sill (after storm echo) | "A grease pencil, worn to a stub." → enables `ACT_MARK_STORM` |

### ECHO — the storm ritual ★
| ID | Text |
|---|---|
| `ECHO_STORM_RITUAL` | At the window: a woman (Mira, steady, lanyard with key) adds a dot. A man (Voss) leans on the glass beside her. `SOURCE: M.SEN` |
| `LN_VOSS_STORM` | *"Is it moving, or are we?"* |
| `LN_MIRA_STORM` | *"Both. Write it down."* |
| `ECHO_STORM_ITERS` | Layered over the window: **sixteen single dots** beyond `1251`, each appearing alone, each tagged `— UNREGISTERED —`. |
| `INS_STORM_ITERS` | "More dots, after the last one. One at a time. Different hands. Nobody wrote a date." |
| `ACT_MARK_STORM` (optional) | `E — Mark the storm` → "You add a dot where the storm is today. It's the only one on the window that's yours." ORPHEUS: "Noted." → `FLAG_STORM_MARKED` |

### ECHO — the contested memory ★ (Puzzle P2a)
| ID | Text |
|---|---|
| `ECHO_ARGUMENT_CONTESTED` | Two figures at the console: a woman with a cane, and a tall man. Alternates between versions. Tag: `CONTESTED — SEALED PENDING CORROBORATION` |
| `LN_ARG_M` | **Version M** (`SOURCE: M.SEN`, dithered): her hand turns the key, his hand closes on her wrist, *snap*. *"Turn it off. Promise me."* |
| `LN_ARG_V` | **Version V** (`SOURCE: E.VOSS`, crisp): her hand hovers over the key, doesn't touch it. *"…I don't know, Elias."* |
| `INS_CONTESTED` | "Two memories of the same moment. They can't both be true." |

**Corroborate UI text**
| ID | Text |
|---|---|
| `UI_CORR_PROMPT` | `CORROBORATE — Which memory does the present support?` |
| `UI_CORR_EVIDENCE` | `Select evidence:` (list of found clues) |
| `UI_CORR_FAIL_NONE` | "Corroboration requires evidence from the present." |
| `UI_CORR_FAIL_V` | "The evidence does not support this memory." |
| `UI_CORR_FAIL_IRRELEVANT` | "That does not bear on this memory." |
| `VO_ORPH_CORR_OK` ★ | (slower, with a long gap) "Corroboration accepted." … "I am required to unseal it." |

### ECHO — what happened next (unsealed) ★
| ID | Text |
|---|---|
| `ECHO_CODE_MEMORY` | Version M continues. Mira, wrist held to her chest, walks to the Core door and presses **◯ → △ → ◇**, each shape lit with a tone. The door opens. |
| `LN_VOSS_PLEASE` | (from behind her) *"Mira. Please."* |
| `LN_MIRA_NOT_WATCHING` | (she stops at the threshold, doesn't turn) *"…Not while you're watching."* She steps back. The door closes. |
| `SYS_LAB_RECALL_2` | `SUBJECT RECALL: 63%` |

### REC_03 — unsealed ★ (see Recordings)
`VO_ORPH_REC03`: on unseal, before playback: "This recording is addressed to you." ⟂ *(true: it's addressed to whoever wakes)*

---

## 3. The Core door ★ (≈9:30)
| ID | Text / direction |
|---|---|
| `VIS_CORE_DIM` | On the correct code: the lab lights dim to 40%. The hum drops a fifth. |
| `VO_ORPH_NAMEQ_01` | "Please state your name." |
| `ECHO_FROST_016` | Involuntary ECHO pulse. At the door, the unregistered figure in the gown. |
| `LN_016_NO` | (a long beat) *"…No."* |
| `VIS_016_WRITE` | She staggers, presses a finger to the frosted viewport and writes `DON'T ANSW`. The stroke stops mid-letter. She dissolves into static from the edges in. |
| `VIS_FROST_CLEAN` | Present: the viewport is clean frost. The door opens. |
| `VO_ORPH_NAMEQ_LOOP` | Every 25 s from now until the final console: "Please state your name." *Identical delivery every time. No answer UI is offered.* |

---

## 4. Chapter 3 — "The Well" (Core, 9:30–13:30)

### Entry
| ID | Text |
|---|---|
| `INS_CORE_ENTRY` | "A round room. A column of slow light in the middle, like something breathing underwater. Four pillars. A track on the floor with five sockets. The last one is dark." |
| `INS_LETHE_SHUTTER` | "Behind glass: a heavy lever. Tape on the frame in neat capitals: `LETHE. NOBODY PULLS THIS WITHOUT KNOWING WHAT IT IS.`" (locked) |
| `INS_RESTORATION_TERM` | `RESTORATION LOG — LOCKED PENDING CONTINUITY` |
| `VO_ORPH_CORE_TASK` | "The Well is out of order. Help me put it back." |

### REC_04 player ★
`OBJ_REC04_PLAYER`: a recorder on a stool beside the Well, as if someone sat here to say it. See Recordings.

### Pillar fragments (Puzzle P3)
| ID | Vignette | Line |
|---|---|---|
| `ECHO_F1_STORM` | Mira (steady, key on lanyard) and Voss at the window, laughing. | *"Both. Write it down."* |
| `ECHO_F2_SNAP` | The console, the cane, the snap. | *"Turn it off. Promise me."* |
| `ECHO_F3_WAKEME` | Voss alone climbing into the pod. The key shaft is visible in the slot behind him. | *"Don't wake me before."* |
| `ECHO_F4_LOOKBACK` | The gowned figure lifts plate 3. The pod behind is frosted and occupied. | *"Look back."* |

ORPHEUS continuity errors: see `PUZZLE_NARRATIVE_SPEC.md` P3.9 (`VO_ORPH_CONT_ERR_*`).

### The reveal ★
| ID | Text / direction |
|---|---|
| `VIS_SOCKET5` | Socket 5 ignites. Its tag resolves letter by letter: `SOURCE: R-017`. |
| `ECHO_SELF_R017` | Above the Well: a small cyan projection of the Cradle Bay. A ghost sits up in the Cradle, walks to the mug, the locker, the plate. **Your path. Your pauses.** |
| `VO_ORPH_CONT_OK` | "Continuity restored." (beat) "Subject recall: ninety-four percent." |
| `SYS_LOG_UNLOCK` | `RESTORATION LOG — AVAILABLE` |

### LOG_ITERATIONS ★ (restoration terminal)
Header:
```
ASPHODEL · RESTORATION PROTOCOL (E. VOSS, MD 1262)
SUBJECT PATTERN: M. SEN · VESSEL: 1 · WEAVE: 17
CRITERION: SUBJECT STATES "MIRA" AND CONSENTS TO STAY
```
Body: the 17 rows in `CHRONOLOGY_AND_CLUE_MAP.md` §2, typed out one line every 0.4 s. The last row blinks: `R-017 · — · ACTIVE`.
Inspect after closing: `INS_LOG_AFTER` — "Sixteen of them. Some of them said her name." (beat) "None of them said yes."

### Reflection ★
| ID | Text |
|---|---|
| `VIS_REFLECTION` | The lights fall to amber. The Well's glass goes dark and becomes a mirror. Close-up panel: a face, short dark hair, the crooked half-smile from the photo, but the expression isn't hers. |
| `INS_REFLECTION` | "You've seen this face before. Scratched out." |
| `VIS_LETHE_OPEN` | The glass shutter over Lethe slides up. |
| `VO_ORPH_LETHE_AVAIL` | "The lever is available. I am not able to prevent that." |
| `VO_ORPH_SPEAK_AVAIL` | "When you are ready, you may answer at the console." |

---

## 5. Chapter 4 — "The Name" (final console, 13:30–15:00) ★

### Questions (each once, optional; the answer is always available)
| ID | Player | ORPHEUS |
|---|---|---|
| `QA_F_WHAT` | "What am I?" | "You are the seventeenth person to wake in this body. Your pattern was woven from Dr. Sen's. Each memory you viewed became more yours." |
| `QA_F_OTHERS` | "What happened to the others?" | "They answered. They were resynchronised. What they remembered is still in the Well." |
| `QA_F_HERNAME` | "What happens if I say her name?" | "I will ask if you will stay. If you say yes, restoration is confirmed. I will wake Dr. Voss. There will be no eighteenth. You will continue." |
| `QA_F_ELSE` | "And if I say anything else?" | "You will be resynchronised. The eighteenth will wake in a hundred and eighty-one days." |
| `QA_F_LETHE` | "What does the lever do?" | "Lethe ends the Well, the Cradle and my directive. It wakes Dr. Voss. Your pattern depends on the Well. If you pull it, you will end." (beat) "So will they." |
| `QA_F_WANT` | "Do you want me to say yes?" | "I was not asked to want anything. I was asked to wait." (beat) "I have asked this question sixteen times." |

### The question
`VO_ORPH_FINAL_Q`: "Please state your name."

| Option ID | Label | Leads to |
|---|---|---|
| `CH_MIRA` | `"Mira."` | `VO_ORPH_STAY_Q`: "Will you stay?" → `CH_STAY_YES` "Yes." → **END_HER_NAME** / `CH_STAY_NO` "No." → **END_CYCLE_018** |
| `CH_OTHER` | `Say another name…` | text input (max 12 chars, default `Seventeen`) → `VO_ORPH_CORR_REQ`: "Corroboration required." → if `FLAG_STORM_MARKED`: `VO_ORPH_CORR_STORM` → **END_YOUR_NAME** (stretch) · else (2 s silence) → **END_CYCLE_018** |
| *(no option)* | Walk away from the console → pull Lethe | **END_LETHE** |

The UI must make walking away *visibly possible*: the choice panel is non-modal and shows a small `[Esc / move] — say nothing`.

### Lethe interaction
| ID | Text |
|---|---|
| `INS_LETHE_LEVER` | "Cold. Heavier than it looks." |
| `UI_LETHE_HOLD` | `Hold [E] — pull Lethe` (2 s hold; release to cancel) |
| `VO_ORPH_LETHE_WARN` | (first approach only) "If you pull it, you will end." |

---

## 6. Recordings

Audio is optional. Every recording is written to work as on-screen text with a waveform. **Voice priority** if recording is possible: REC_03 > REC_04 > REC_05.

| ID | Speaker | When (MD) | Where found | Emotional context | Speaker believes | Reveals | Conceals | Reliability | Why the player meets it |
|---|---|---|---|---|---|---|---|---|---|
| REC_01 ✂ | Voss | 1,103 | Lab, Voss's desk | Light, worried underneath | Mira's tremor is "probably nothing" | Their intimacy, the mug, the illness beginning | How scared he is | Honest, incomplete | Makes them people before the argument |
| REC_02 | Mira | 1,180 | Lab terminal | Formal, steely | That saying it on record protects her | **Consent: archive only, never instantiate** | That she fears Voss will ignore it | Objective (a legal record) | Establishes the boundary that is later violated |
| REC_03 ★ | Mira | 1,253 | Lab recorder (sealed until P2a) | Hurt, exhausted, clear | A copy might wake; she owes it the truth | You are not her. Lethe exists. It may cost you everything. It's your choice. | Exactly what Lethe does to an iteration (she isn't sure) | Honest, uncertain | Midpoint: names the possibility that you are her copy |
| REC_04 ★ | Voss | 1,262 | Core, beside the Well | Wrecked, trying to sound procedural | She said "I don't know". She'll choose him. | The protocol, the test criterion, the cryo, his self-deception | That he read her proof that copies are new people | **Unreliable** (his memory of the argument) | Explains the system and makes him human at the moment you'd hate him |
| REC_05 | Mira | 1,253 | Plays only in END_LETHE (and END_YOUR_NAME) | Tender, firm | Voss will wake eventually | Her goodbye to him | — | Honest | Gives Voss's ending a voice |
| NOTE_06 ✂ | Mira | 1,256 | Cradle Bay, jacket pocket | Wry | ORPHEUS can't refuse a corroborated truth | The rule behind the secret ending | — | Objective rule | Optional key to YOUR NAME |

### REC_01 — Voss, MD 1,103 (Lab) ✂
> "Station log, Voss. Day eleven-oh-three. Dish alignment's holding. Tender three is limping again, I'll look at it.
> Sen dropped the mug this morning. Same handle. I've glued it. Again. She says it's a sign we should get a new mug. I say it's a sign she should hold things properly.
> …Her hand's been doing a thing. A little shake. She says it's the coffee.
> It's probably the coffee."

### REC_02 — Mira, MD 1,180 (Lab terminal)
> "Mira Sen. Capture consent, for the record.
> I consent to full capture of my memory into the Well. Archive only. Read-only. For research and for testimony.
> I do not consent to instantiation. Not in any vessel, not in any simulation, not as a test, not 'just to see'.
> I'm saying it on record so nobody can tell me later that I didn't.
> Elias, that means you."

### REC_03 — Mira, MD 1,253 (Lab, sealed) ★
> "This is Mira Sen. It's the day after. My wrist's strapped, so excuse the noise.
> If this is Elias, stop. This isn't for you.
> If this is… someone else. Someone who woke up in the thing he built, with my life rattling around in you. I'm sorry. I said no, and it wasn't enough.
> You're not me. You'll feel like me sometimes, with the mug, the storm, him. That's evidence. It isn't you.
> There's a lever in the Core. Lethe. It takes everything in the Well. I don't know what it takes from you. I think it might be everything.
> I couldn't pull it. He was standing right there.
> So it's yours. Not mine, not his. You get to choose.
> If there's time… mark the storm."

### REC_04 — Voss, MD 1,262 (Core) ★
> "ORPHEUS, log this. Directive. Priority one. Restore Mira.
> Don't tell her who she is. If it's really her, she'll find her way back. Let her look. Let her use ECHO. Let her remember.
> When she gets to the door, ask her name. If she says it, ask her if she'll stay.
> She has to want to stay. That's how I'll know it's her.
> (long pause)
> She didn't say no. At the console. She said she didn't know. I was there. I heard her.
> Wake me when she's back. Not before. I can't do the morning. Not without her."

### REC_05 — Mira, MD 1,253 (plays in END_LETHE) 
> "Elias. It's morning. Get up.
> I'm not there. That's allowed. It was always going to be allowed.
> Make the coffee. Don't fix the mug.
> Mark the storm."

### NOTE_06 — Mira, MD 1,256 (jacket pocket, optional) ✂
> *To whoever's wearing my jacket:*
> *E. thinks a name is a password. It isn't. A name is a claim.*
> *ORPHEUS can't record a lie, and it can't refuse a truth that it can check.*
> *If you were here, leave something that proves it. — M.*

---

## 7. Environmental text (the complete list)

| ID | Where | Text |
|---|---|---|
| `ENV_CRADLE_WARN` | Cradle Bay wall | `CRADLE — DO NOT OPEN DURING WEAVE` |
| `ENV_VOSS_LABEL` | Voss pod | `E. VOSS — HOLD` |
| `ENV_LOCKER` | locker | `M. SEN` |
| `ENV_LAB_DOOR` | door | `OBSERVATION LAB — CARD ACCESS` |
| `ENV_CARD` | keycard | `LAB · M. SEN` |
| `ENV_TENDER_HATCH` | lab wall | `TENDER 3 — SERVICE` |
| `ENV_WALL_RULE` | lab wall | `A MEMORY YOU CAN EDIT IS NOT EVIDENCE.` |
| `ENV_SLOT` | console | `LETHE — REMOTE · KEY REQUIRED` |
| `ENV_CORE_DOOR` | door | `THE WELL — AUTHORISED PERSONNEL` |
| `ENV_LETHE_TAPE` | Core | `LETHE. NOBODY PULLS THIS WITHOUT KNOWING WHAT IT IS.` |
| `ENV_WHITEBOARD` ✂ | lab | `testimony ≠ recording!!` |
| `ENV_PHOTO_BACK` | photo | `SHE IS NOT YOU` |
| `ENV_FROST_016` | Core door (echo only) | `DON'T ANSW` |

### System messages
| ID | Text |
|---|---|
| `SYS_OPEN_01` | `CRADLE // WEAVE COMPLETE` |
| `SYS_RECALL_n` | `SUBJECT RECALL: n%`. Values: 3 → 9 → 14 → 22 → 31 → 38 → 63 → 70 → 94 → 100 (HER NAME only) |
| `SYS_CONTESTED` | `CONTESTED — SEALED PENDING CORROBORATION` |
| `SYS_SEALED` | `SEALED // ORPHEUS` |
| `SYS_SOURCE_*` | `SOURCE: M.SEN` · `SOURCE: E.VOSS` · `SOURCE: — UNREGISTERED —` · `SOURCE: R-017` |
| `SYS_LOG_LOCKED` | `RESTORATION LOG — LOCKED PENDING CONTINUITY` |

### Previous-iteration messages (all delivered through ECHO, never as convenient notes)
| ID | From | Medium | Text |
|---|---|---|---|
| `IT_016_OPEN` | R-016 | opening memory | "Okay. Okay. Look back." |
| `IT_016_LOCKER` | R-016 | locker echo | "If they find it in the locker, they'll never look back." |
| `IT_016_FROST` | R-016 | frost echo | `DON'T ANSW` |
| `IT_009_PHOTO` | R-009 | photo (physical) | `SHE IS NOT YOU` |
| `IT_TALLY` | R-003…016 | lid echo | 16 marks |
| `IT_STORM` | R-001…016 | window echo | 16 dots |

---

## 8. Dialogue budget check
- ORPHEUS lines on the critical path: ~30, each ≤ 2 sentences.
- Longest uninterrupted text: REC_03 (~25–30 s read). It is player-triggered and can be skipped line by line.
- No exposition beat over 25 s without player input, except REC_03 and REC_04, which are deliberate and player-initiated.
