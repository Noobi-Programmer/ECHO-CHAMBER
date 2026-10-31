# ENDING_DESIGN — ECHO//CHAMBER

**Status:** PROPOSAL v0.2.

## 1. Why the original PRESERVE / RELEASE needed to change

| Problem in the draft | Effect | Fix |
|---|---|---|
| Both endings end 017 (PRESERVE starts cycle 018; RELEASE powers down the reconstruction). | The player has nothing personal at stake. PRESERVE becomes the "evil button". | Each main ending now costs the player something different: **their self** or **their life**. |
| "Preserve the archive" has no human beneficiary. | No emotional pull. | The beneficiary is a man asleep ten feet from where you woke, whom the player has watched in echoes being kind. |
| The choice is abstract (a system state). | Judges can't feel it in 90 seconds. | The choice is **a name**. Everyone understands what it means to answer to a name. |
| No relation to the mechanic. | Ending could be from any game. | The ending is the end of the restoration you performed *by using ECHO*. The mechanic was the procedure. |

## 2. Ending matrix

| Ending | Condition | You | Voss | Mira's wish | The sixteen | Cycle | Scope |
|---|---|---|---|---|---|---|---|
| **HER NAME** | `CH_MIRA` + `CH_STAY_YES` | **Live, as Mira** | Wakes to "her" | Betrayed | Archived forever, unseen | Ends (success) | ★ main |
| **LETHE** | Pull Lethe without answering | **End** | Wakes alone to the truth | Honoured | Erased with you | Ends (destroyed) | ★ main |
| **CYCLE 018** | `CH_MIRA`+`CH_STAY_NO`, or `CH_OTHER` without corroboration | **Wiped** | Still asleep | Unresolved | You join them | **Continues** | ◐ cheap (reuses opening) |
| **YOUR NAME** | `CH_OTHER` + `FLAG_STORM_MARKED` | **Live, as yourself** | Wakes to a stranger | Honoured *and* exceeded | Remain archived | Ends (protocol has no subject) | ✦ secret / stretch |

**The core dilemma** (the two main endings): *Live as someone else's memory, or end as yourself.* Neither is labelled good or bad. HER NAME is kind to Voss and ends the cycle **without killing anyone else**, which is a real argument for it. LETHE honours consent and truth, and costs the player their life and the sixteen's memories.

**Choice fairness check:** at the moment of decision the player has heard, explicitly from ORPHEUS (which cannot lie), what each option does (`QA_F_*`). Nothing is hidden. The difficulty is moral, not informational.

---

## 3. END_HER_NAME — "Continuity" ★

**Circumstances:** The player says "Mira" and "Yes."
**Understanding at decision:** They know they're not her. They know Voss believes a false memory. They know saying yes ends the cycle and keeps them alive.

**Consequences:** Restoration is confirmed. Recall reaches 100%. ORPHEUS ends the protocol. Voss wakes. No eighteenth iteration. The Well persists. You live out your life on Asphodel answering to her name, beside a man who never learns the truth unless you tell him.

**Sequence**
| t | Visual | Audio | Text |
|---|---|---|---|
| 0.0 | Close on the console. The SPEAK light holds steady. | The hum, then silence. | `CH_MIRA` → "Mira." |
| 2.0 | The Well light warms from cyan to pale amber, for the first time in the game. | A single low chord. | `VO_ORPH_STAY_Q` "Will you stay?" |
| 5.0 | — | — | `CH_STAY_YES` "Yes." |
| 6.0 | `SYS_RECALL_100` ticks to `100%`. | A soft relay click. | `VO_ORPH_HN_01` "Restoration confirmed." |
| 8.5 | — | — | `VO_ORPH_HN_02` "Thank you for your patience." (beat) "Welcome back, Dr. Sen." |
| 11.0 | **Cut to the Cradle Bay.** Voss's pod hisses. Frost slides off the glass in sheets. | Stasis release. Breath. | — |
| 14.0 | Wide, static camera. The player sprite enters from the Core corridor. Voss sits up, older than his photo by nothing. Stasis doesn't age you. | Footsteps. | — |
| 17.0 | He sees you. | Silence. | `LN_VOSS_HN_01` "…Mira?" |
| 19.0 | Player choice: `[ "I'm here." ]` or `[ say nothing ]`. *(Both continue. This is the protagonist's only optional line.)* | — | — |
| 22.0 | He crosses the room and holds you. Hold the frame. | A warm, simple two-note motif (the storm motif, major for the first time). | `LN_VOSS_HN_02` "You came back." |
| 27.0 | **ECHO is available.** A prompt flickers once: `[Q]`. If the player holds it: **sixteen pale silhouettes in gowns** stand around the bay, perfectly still, watching. Release, and they're gone. | Under ECHO: sixteen overlapping breaths, then nothing. | — |
| 33.0 | Cut to the Lab window. Two figures. He hands you the grease pencil. You mark the storm. | — | — |
| 37.0 | Hold on the window: the trail of dots continues. Fade to black. | The motif resolves. | `SYS_END_HN` `CONTINUITY: CONFIRMED` |

**Final image:** two figures at the window, a new dot on the glass.
**Credits transition:** the dot remains as the only thing on screen. Credits roll beside it.
**Question it leaves:** *Did you save yourself, or erase yourself? Is a kind lie a life?*

---

## 4. END_LETHE — "The Morning After" ★

**Circumstances:** The player ignores the question, walks to the lever, and holds [E] for 2 s.
**Understanding at decision:** They know it ends them and the sixteen, wakes Voss, and honours Mira.

**Consequences:** The Well is purged and every archived memory erased. The Cradle dies. ORPHEUS is released from all directives. Voss wakes. 017's pattern unravels over about 60 s. Voss lives on alone on Asphodel with the truth and her last message.

**Sequence**
| t | Visual | Audio | Text |
|---|---|---|---|
| 0.0 | The lever travels. A hard *clunk*. | ORPHEUS's name-loop stops **mid-word**: "Please state your—" | — |
| 1.5 | Every light in the Core goes to emergency amber. | The hum dies. Total silence for 3 s. *(Do not fill it.)* | — |
| 4.5 | **The cascade.** ECHO activates by itself and stays on. In every room, *every* archived memory plays at once, layered: Mira and Voss at the window, the argument (both versions), sixteen figures in gowns walking their sixteen routes, the mug steaming, frost letters. The camera slowly pans back through Core → Lab → Cradle Bay (or cuts room to room). | All the echo lines overlap at low volume, a choir of fragments, rising. | — |
| 14.0 | The memories begin to go out **one by one**, oldest first. The last to go are the gowned figures. One turns toward the camera before vanishing (016). | Voices drop out one by one. | `VO_ORPH_LE_01` "Directive released." |
| 18.0 | The player sprite stands in the Cradle Bay. Its outline begins dithering, exactly like Mira's illness-softened echoes. | — | `VO_ORPH_LE_02` "Dr. Sen asked me to give you this, if anyone ever pulled it." |
| 21.0 | — | (as text, slowly) | `VO_ORPH_LE_03` "'Thank you. I'm sorry. It was yours.'" |
| 25.0 | Voss's pod opens. Frost falls. | Stasis release. | — |
| 28.0 | The player sprite is gone. Only a slight shimmer where it stood, then nothing. | — | — |
| 30.0 | Voss sits up in an empty, amber-lit bay. He looks at the Cradle: open, dark, empty. | A recorder clicks on by itself. | **REC_05** plays: "Elias. It's morning. Get up…" |
| 45.0 | Cut to the Lab. Voss at the window. The trail of dots ends at `1251`. He picks up the grease pencil. Long hold (5 s). He marks the storm. | The storm motif, solo, minor, unresolved. | — |
| 52.0 | The player may press [Q]. **ECHO is gone:** a small `NO SIGNAL` label, static, nothing. | A dead click. | — |
| 55.0 | Fade to black. | Silence. | `SYS_END_LE` `THE WELL IS EMPTY.` |

**Final image:** an old man (in grief, not age) at a window, one new dot on the glass.
**Credits transition:** silence for the whole credits, or only the station hum with no music.
**Question it leaves:** *Was ending yourself a gift, or just a different way of being used by somebody else's wish? Was it fair to take the sixteen with you?*

---

## 5. END_CYCLE_018 — "The Relay" ◐ (the cycle continues)

**Circumstances:** The player refuses the name or the stay, or claims another name without corroboration.

**Sequence**
| t | Visual | Audio | Text |
|---|---|---|---|
| 0.0 | The console light turns white. | — | `VO_ORPH_CY_01` "Divergence recorded." (beat) "Resynchronising." |
| 3.0 | The edges of the screen begin to fill with static. **The player keeps control for 10 seconds.** | A rising tone. | `UI_CY_HINT` (small, once): "You have a few seconds. What should the next one see?" |
| 3–13 | Whatever the player does is recorded. (Most players will run to something meaningful: the plate, the frost, the window.) | — | — |
| 13.0 | White-out. | Cut to silence. | — |
| 15.0 | **Replay the cold open**, with the opening memory now drawn from **the player's last 4 seconds**, shown as an unregistered figure in a gown. *(Fallback: authored "kneeling at plate 3".)* | The same breath as the game's opening. | `SYS_END_CY` `CRADLE // WEAVE 18` |
| 20.0 | The Cradle lid slides back. Cut to black before control returns. | — | — |

**Final image:** the game's first image, with your ghost in it.
**Question it leaves:** *Did you refuse, or did you hand the choice to someone who doesn't exist yet?*
✂ For CodeDay: implement with the authored fallback. Cost is about 30 minutes, since it reuses the opening scene.

---

## 6. END_YOUR_NAME — "New Personnel" ✦ (secret, stretch goal)

**Unlock:** `FLAG_STORM_MARKED` (the player marked the window themselves), then `CH_OTHER` at the final question. Clues that teach it: R-012 "Wren — corroboration required" in the log, NOTE_06 (optional), and REC_03's "mark the storm".

**Why it's not a cheat button:** it needs an act the player chose for themselves, before they knew it mattered. That act *is* the evidence of selfhood. It also doesn't fix anything: Voss still wakes to a stranger with his wife's face.

**Sequence**
| t | Visual | Audio | Text |
|---|---|---|---|
| 0.0 | Text field. The player types a name (default `Seventeen`). | Keyboard clicks echo oddly. | — |
| 3.0 | — | — | `VO_ORPH_CORR_REQ` "Corroboration required." |
| 5.0 | The Well projects the Lab window: one dot in the trail glows. | A soft ping. | `VO_ORPH_CORR_STORM` "Storm log. One entry, today. Unrecorded hand." |
| 9.0 | — | Long pause (3 s). | `VO_ORPH_YN_01` "Corroborated." (beat) "Registering new personnel: {NAME}." |
| 14.0 | — | — | `VO_ORPH_YN_02` "The restoration protocol has no subject. Dr. Voss's stasis order cannot be met. I am required to wake him." |
| 18.0 | Cradle Bay. Voss's pod opens. You are standing there. | Stasis release. | — |
| 22.0 | He sees you. | — | `LN_VOSS_YN_01` "Mira—" |
| 24.0 | — | — | Player line (auto, shown as text): "{NAME}." |
| 26.0 | Hold on his face. Three full seconds. No music. | — | — |
| 30.0 | — | — | `VO_ORPH_YN_03` "Dr. Voss. This is {NAME}. They woke this morning." |
| 33.0 | Cut to black before he answers. | The storm motif, a new variation (neither major nor minor). | `SYS_END_YN` `NEW PERSONNEL: {NAME}` |

**Question it leaves:** *If you can't be who they wanted, can you still be someone? And will he let you?*

---

## 7. Ending-specific audio cues
| Cue ID | Use |
|---|---|
| `MUS_STORM_MOTIF_MAJOR` | HER NAME |
| `MUS_STORM_MOTIF_MINOR_SOLO` | LETHE |
| `MUS_STORM_MOTIF_OPEN` | YOUR NAME |
| `SFX_STASIS_RELEASE` | HER NAME, LETHE, YOUR NAME |
| `SFX_ECHO_CASCADE` | LETHE |
| `SFX_ECHO_DEAD` | LETHE post-credits [Q] |
| `AMB_SIXTEEN_BREATHS` | HER NAME under-ECHO |

## 8. Restart
All endings → credits → `[E] — Wake again` → title. Keep **no persistent state** between runs (judges will replay). Optional stretch: after any ending, the title screen shows a faint extra dot on a window graphic per completed run.
