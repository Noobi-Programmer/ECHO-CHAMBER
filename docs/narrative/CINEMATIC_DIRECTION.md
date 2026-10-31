# CINEMATIC_DIRECTION — ECHO//CHAMBER

**Status:** PROPOSAL v0.2. Engine-agnostic. "Camera" means the game camera at the internal resolution (proposal: 320×180, integer-scaled).

---

## 1. Emotional curve and pacing

| Time | Beat | Target emotion | Tension (1–10) | Tool |
|---|---|---|---:|---|
| 0:00 | Opening memory | Curious, uneasy | 4 | Wrong-state open |
| 0:45 | Wake, ORPHEUS | Comforted | 2 | Warm voice, soft light |
| 1:30 | Mug echo / title | Wonder | 3 | First ECHO, title reveal |
| 2:30 | Locker opens to palm | Suspicious | 4 | Silence after the click |
| 3:15 | Card figure | Suspicious | 5 | Faceless figure looks at camera |
| 4:00 | Lab, Tender | Unsettled | 4 | Something tidying |
| 5:00 | Storm ritual | Tender (quiet beat) | 2 | Warmth, the motif |
| 6:00 | Contested echo | Disoriented | 6 | Flicker, tick |
| 7:30 | Corroborated, REC_03 | Recognition (partial) | 6 | Strained ORPHEUS, voice |
| 9:30 | Core door, DON'T ANSW | Paranoid | 8 | Involuntary echo, name loop |
| 10:30 | REC_04 | Emotional | 5 | Stillness |
| 12:00 | R-017 replay, log | Existential | 9 | Silence, typed log |
| 12:45 | Reflection | Recognition (full) | 7 | Lights fall |
| 13:15 | Questions | Responsible | 6 | ORPHEUS honest |
| 14:00 | Choice | Responsible | 8 | Non-modal choice |
| 14:30+ | Ending | Haunted | — | Silence, motif |

**Pacing rules**
- First input ≤ 10 s after the cut. First ECHO ≤ 90 s. First contradiction (the card figure) before 3:30.
- After each major reveal, a quiet beat of ≥ 10 s with no new text: storm ritual after the card, REC_04 stillness before the timeline, the reflection before the questions.
- **The silence budget:** three deliberate full silences (no hum). Opening (4 s), log reveal (whole duration), LETHE (3 s).

---

## 2. Playable chapter plan (brief §7, the 17-point spec)

### Chapter 0+1 — "The Cradle" (Cradle Bay)
| # | |
|---|---|
| 1 Title | The Cradle |
| 2 Playtime | 0:00–4:00 (✂ 3:00) |
| 3 Objective | Get into the Lab. |
| 4 Emotion at entry | Disoriented curiosity. |
| 5 Player believes | "I'm a crew member waking from stasis after an incident." |
| 6 Environment | A narrow bay. Left: the Cradle (warm gel pod) and Voss's frosted stasis pod. Centre: five floor plates. Right: the Cradle terminal and mug, Mira's locker, the Lab door. One overhead light pool on the Cradle. Navy darkness elsewhere. |
| 7 Objects | Cradle, Voss pod, mug, terminal, locker, plates 1–5, lab door, crew photo ✂ |
| 8 Interactions | Inspect, open locker (palm), lift plate, use card, terminal Q&A |
| 9 ECHO discoveries | Mug (tutorial), locker/card figure (P1), Cradle lid tally (optional) |
| 10 Puzzle | P0 Mug, P1 Look Back |
| 11 Clues | Opening memory, "It will come to you", CYCLE 17 panel, mug inner voice, palm locker, faceless gowned figure |
| 12 Dialogue | `VO_ORPH_WAKE_*`, Ch1 reactive, `QA_C1_*` |
| 13 Audio | Hum bed, Voss pod's slow pump, ECHO pulse, relay clicks |
| 14 Visual events | Wrong-state open, title on first ECHO, card figure looks at camera |
| 15 Revelation | Someone in a gown like mine is hiding things from the AI. |
| 16 Exit | Lab card used at the door. |
| 17 Emotion at end | Suspicious, intrigued. |

### Chapter 2 — "Testimony" (Observation Lab)
| # | |
|---|---|
| 1 | Testimony |
| 2 | 4:00–9:30 (✂ 3:30) |
| 3 | Find out what happened between Sen and Voss, and open the Core. |
| 4 | Suspicious. |
| 5 | "The scientists had an incident. Voss might be responsible. The AI is hiding something." |
| 6 | Wide room. A huge window onto the ice giant (cyan rim light, the Eye storm). Console centre-right. Mira's desk left. Voss's desk right. Core door at the back wall with a frosted viewport. |
| 7 | Window, pencil, console, key slot, wall rule, photo, sealed recorder, Voss desk, whiteboard ✂, Core keypad |
| 8 | Inspect, turn photo, corroborate, keypad, mark storm (optional), recordings |
| 9 | Storm ritual + iteration dots, contested argument, unsealed code memory, photo face (optional) |
| 10 | P2a Corroborate, P2b Door |
| 11 | Snapped key, wall rule, vividness mismatch, R-009's photo, REC_01/02 |
| 12 | REC_01 ✂, REC_02, REC_03 ★, `VO_ORPH_*` |
| 13 | Window wind (low), Tender skitter, contested tick, the snap, the storm motif (first appearance) |
| 14 | Tender wiping, contested flicker, strained-ORPHEUS light dip |
| 15 | Voss stopped her. His memory lies. She foresaw *you*. |
| 16 | Code entered → Core door beat. |
| 17 | Recognition mixed with dread. |

### Chapter 3 — "The Well" (Core)
| # | |
|---|---|
| 1 | The Well |
| 2 | 9:30–13:30 (✂ 3:00) |
| 3 | Put the archive in order (ORPHEUS's request). |
| 4 | Paranoid. The name question is looping. |
| 5 | "ORPHEUS wants me to be someone. Someone like me died at that door." |
| 6 | Circular room. The Well column centre (breathing light). Four pillars at the compass points. A floor rail with 5 sockets. The Lethe lever behind glass. Restoration terminal. REC_04 on a stool. |
| 7 | Pillars F1–F4, sockets, REC_04, restoration terminal, Lethe shutter, Well console |
| 8 | Play fragments, place shards, read log, questions |
| 9 | Fragments F1–F4, self-replay R-017 |
| 10 | P3 Continuity |
| 11 | Key on lanyard vs snapped, cane, pod occupied |
| 12 | REC_04, `VO_ORPH_CONT_*`, `LOG_ITERATIONS` |
| 13 | Well heartbeat (slow sub pulse), name loop, silence at the log |
| 14 | Socket 5 ignite, self-replay, reflection |
| 15 | You are R-017. Sixteen before you. Your investigation was the restoration. |
| 16 | Lethe unlocked + SPEAK enabled. |
| 17 | Existential, grieving. |

### Chapter 4 — "The Name" (Core, final)
| # | |
|---|---|
| 1 | The Name |
| 2 | 13:30–15:00 (✂ 1:30) |
| 3 | Decide. |
| 4 | Responsible. |
| 5 | Full understanding (verified by ORPHEUS's honest answers). |
| 6 | Same room, amber light, the shutter open. |
| 7 | Well console, Lethe lever |
| 8 | Questions, answer, or walk away and pull |
| 9 | None (ECHO quiet), until the endings |
| 10 | — |
| 11 | All |
| 12 | `QA_F_*`, `VO_ORPH_FINAL_Q` |
| 13 | Only the Well pulse |
| 14 | Non-modal choice panel |
| 15 | The cost of each choice |
| 16 | Ending condition met |
| 17 | Haunted |

---

## 3. Major cinematic moments

### CM-01 — Wrong-state open ("Look Back")
- **Player:** watching (no control, 8 s max).
- **Camera:** static, framing the Cradle Bay slightly low, with the floor plate in the lower-third right.
- **Lighting:** full ECHO grade (cyan, scanlines). One warm practical light that doesn't exist in the present.
- **Positions:** faceless figure kneeling at plate 3, back to camera. It looks up at the *ceiling camera*, i.e. at us.
- **Animation:** 3 key poses (kneel → slide → look up). Shimmer.
- **Sound:** 4 s silence → breath → whisper lines → hard static cut → relay click.
- **Dialogue:** "Okay. Okay." / "Look back."
- **Learns:** someone hid something here. ("Look back" teaches the verb before the mechanic.)
- **Intention:** wrong-footedness. *Was that the present?*
- **Complexity:** Low. One overlay layer, reused in P1 and CYCLE 018.

### CM-02 — The title is a memory
- **Player:** first holds ECHO at the mug.
- **Camera:** stays. A slow 1-px drift is allowed.
- **Lighting:** the room shifts to ECHO grade over 300 ms. The mug steams.
- **Event:** the title `ECHO//CHAMBER` fades in *inside* the echo, over the room, as if written in the memory. It fades when ECHO is released. It appears only once.
- **Sound:** the ECHO pulse (an inverted swell), then a filtered version of the room hum.
- **Learns:** what ECHO does.
- **Intention:** wonder. The game introduces itself through its mechanic.
- **Complexity:** Low.

### CM-03 — The figure looks at the camera
- **Player:** holding ECHO at the locker (P1).
- **Camera:** static. The figure crosses frame left→right.
- **Beat:** halfway across, the faceless figure stops and looks up at the ceiling camera (ORPHEUS's eye), just like the opening. The player realises *this is the same person*.
- **Sound:** under ECHO, a single breath catches.
- **Intention:** the first chill. Something is hiding from the thing that's been comforting you.
- **Complexity:** Low (same 3 poses).

### CM-04 — Two memories of one night
- **Player:** holding ECHO at the console.
- **Camera:** static medium framing of the console. Characters at ~32 px tall.
- **Lighting:** Version M: dithered, slightly warm, edges soft. Version V: crisp, brighter, higher contrast. *The lie looks better.*
- **Animation:** alternation every 0.8 s, with a tick sound on each swap. Both freeze at the hand until corroborated. After corroboration, Version M "wins": V fragments into static, and M continues to the door and *"Not while you're watching."*
- **Sound:** tick-tock alternation, then **the snap** (dry, small, horrible) only in M.
- **Learns:** echoes are testimony. The clearest one lied.
- **Intention:** disorientation turning into conviction.
- **Complexity:** Medium. Two overlays + a swap timer + a continuation sequence. Reduced-motion: manual toggle.

### CM-05 — DON'T ANSW
- **Player:** has just entered the code. Control is held for ~6 s.
- **Camera:** slow push (or a 2× crop if pushes are ugly in pixel art) onto the frosted viewport.
- **Lighting:** lab lights dim to 40%. Frost glows faintly.
- **Event:** ORPHEUS asks the name for the first time. ECHO pulses involuntarily. The faceless figure hesitates, says "…No," and writes in the frost. The letters appear stroke by stroke and stop mid-letter. She dissolves edge-inward into static.
- **Sound:** the hum drops a fifth. Under the writing, finger-on-glass squeaks. When she's wiped: a soft *click* and the hum returns. **Do not use a sting.**
- **Learns:** the name question is the trap. Someone like you died here, just now (to her).
- **Intention:** paranoia and protectiveness.
- **Complexity:** Medium (stroke-reveal text + a dissolve shader or dithered frames).

### CM-06 — Socket five
- **Player:** places the last shard.
- **Camera:** pulls up/out to frame the whole Core (or a static wide).
- **Lighting:** all four sockets light. The fifth flares white, then cyan. The Well column projects a small window of the Cradle Bay above it.
- **Event:** a ghost in the projection sits up in the Cradle. Same pause at the mug. Same route to the locker. *The player recognises their own hesitation.* The tag types out `SOURCE: R-017`.
- **Sound:** **full silence**, including the hum. Only the type-on ticks.
- **Learns:** you're in the archive. The figures were all of you.
- **Intention:** vertigo. This should be the moment players remember.
- **Complexity:** Medium. Requires recording the player's Ch1 path (positions every 250 ms). Fallback: authored path.

### CM-07 — The reflection
- **Player:** closes the log.
- **Camera:** cut to a close-up UI panel (the only portrait-scale art in the game): a face in dark glass, Mira's face from the photo echo, wearing a different expression.
- **Lighting:** the room falls to amber. The face is lit from below by the Well.
- **Sound:** the Well pulse, very low.
- **Learns:** the face that was scratched out is the one you're wearing.
- **Intention:** recognition, quiet.
- **Complexity:** Low (one 96×96 portrait).

### CM-08 — The choice (non-modal)
- **Player:** at the console, with control retained.
- **Camera:** static wide. The console is left, the lever right, the player in between.
- **UI:** the choice panel docks bottom-left, translucent, with `[Esc / move] — say nothing`. If the player walks away, the panel stays visible but fades with distance. ORPHEUS's loop continues.
- **Sound:** only the Well pulse and the name loop.
- **Intention:** the player has to *walk* to the lever while being asked their name. The body makes the choice.
- **Complexity:** Low.

---

## 4. Visual language
- **Present:** dark navy, desaturated cyan highlights, cool practical lights, a little dust in the light pools.
- **Echo:** shift to a cyan/teal grade with 1-px scanline shimmer and a slightly lifted black level. Echo-only objects get a 1-px light outline. Never use colour alone: echo objects also shimmer and have the outline.
- **Contested:** alternating two versions. **Sealed:** a black slab with an `ORPHEUS` glyph.
- **Amber/red:** reserved for warnings, the Lethe label, and the final act's emergency lighting. The Well turns amber only in HER NAME.
- **Faces:** the rememberer's own figure is faceless (rule E12). Others have 2–3 px faces.
- **Camera:** fixed per room, or a gentle follow with dead-zone. No shake. Fades ≤ 400 ms. No flashing above 3 Hz.

## 5. Audio direction
- **Bed:** a low station hum per room, with a slightly different pitch in each (Cradle lowest, Core has a slow sub "breath").
- **ECHO pulse:** a swelling inverted tone on activation. While held, ambience is low-passed and reversed-tail.
- **Memory voices:** close-mic'd and dry in Version M, bright with slight reverb in Version V (the lie sounds better).
- **The storm motif:** 4 notes, played on a single instrument (a felt piano or a soft synth). First heard at the storm ritual, then varied in every ending.
- **ORPHEUS:** neutral, warm, unhurried. If voiced, slight band-limit. If text, use a subtle waveform and *no* beeps per character (beeps make it cute).
- **The name loop:** identical audio file every time. Repetition is the horror.
- **Silence:** three planned silences (§1).
