# STORY_WORKSHOP — ECHO//CHAMBER

**Task:** STORY-001 · **Author:** Claude (Arpita's Claude Code session) · **Status:** PROPOSAL — not canon until Abi approves in `STORY_DECISIONS.md`
**Canon version proposed:** 0.2-proposal · **Date:** 2026-10-31

> Read this first. It explains *why* the story in `STORY_BIBLE.md` is shaped the way it is. If you only have five minutes, read §0 and §6.

---

## 0. Executive summary

**Recommendation: Treatment A, "THE RELAY", with two elements taken from Treatment C.**

The current premise has a strong emotional core: grief, consent, and a copy who gets to choose. Its execution is predictable. The twist ("you are copy #17 of Mira") is announced by the draft's first line, and both of the draft's endings kill the player. So the final choice is really about other people, not about you.

The recommended story keeps every approved element: Mira, Voss, ORPHEUS, Iteration 017, ECHO, three rooms and two main endings. It changes **what ECHO is** and **what ORPHEUS is asking you to do**:

1. **ECHO does not show the past. It shows what someone *remembers* of the past.** It replays memories stored in the station's archive (the *Well*). Memories can be wrong, they can be sealed, and they can disagree. That one rule explains every echo puzzle, every contradiction, how previous iterations talk to you, and the tagline.
2. **The previous iterations' memories are in the archive too.** The faceless figures you watch hiding things in ECHO are not the scientists. They are earlier versions of you, deliberately "remembering hard" so the next one will see it. Iterations 001–016 are a relay team. Each one carried the truth a little further.
3. **Your investigation *is* the procedure.** ORPHEUS asked you to help "restore the station's records." Each time you used ECHO you relived Mira's memories, and restoration was the goal. When you finish putting the archive in order, ORPHEUS asks you one question: **"Please state your name."**
4. **Voss is not a ghost. He is asleep in the pod next to yours.** He froze himself the day after Mira died and told ORPHEUS: *wake me when she's back.* The test he wrote has a cruel flaw. "Restored" means she says she is Mira **and chooses to stay**. Mira's last real choice was to say *stop*. So the only way to pass as Mira is to make the one choice Mira wouldn't. Sixteen people said no and were wiped.
5. **The choice costs the player either way.**
   - **HER NAME:** say "Mira", stay, live, wake Voss to a lie. The cycle ends.
   - **LETHE:** don't answer. Pull Mira's shutdown lever. You end, and so does the archive with the sixteen inside it. Voss wakes to the truth, alone.
   - Answering with *any other name* without proof gets you wiped, and the cycle continues as Iteration 018. That is the cheap third outcome.
   - **Secret (stretch goal):** prove you are someone new, using an act the player chose to do earlier, and give your own name.

---

## 1. Stage A — initial assessment of the existing material

### What exists
`IDEA.md`, `GAME_DESIGN.md`, `STORY_BIBLE.md` (draft), `STORY_WORKSHOP.md` (brief), `EXPERIENCE_BLUEPRINT.md`, `NARRATIVE_SCRIPT_DRAFT.md`, `PROJECT_CHARTER.md`, `STORY_REVIEW_RUBRIC.md`, `CODEDAY_RUNSHEET.md`, plus the original ChatGPT ideation transcript.

### Conflicts between documents

| # | Conflict | Where | Resolution in this proposal |
|---|---|---|---|
| C1 | Playtime: 8–12 vs 10–15 vs 12–15 min | GAME_DESIGN §4, IDEA, this brief | Design for 12–15. The **CodeDay cut** (marked ✂ in every doc) lands at about 9–11. |
| C2 | Engine "Phaser 4" stated as fact vs "UNDECIDED" | GAME_DESIGN §12 vs IDEA/AGENTS | Not a story issue. Narrative specs stay engine-agnostic. |
| C3 | STORY-001 write-set `research/story/**` vs brief's `docs/narrative/**` | AGENT_STATUS vs brief | Wrote to `docs/narrative/**` per the newer brief. The coordinator must update the claim (OPEN_QUESTIONS Q1). |
| C4 | GAME_DESIGN §3 says "canonical story"; STORY_BIBLE says draft | GAME_DESIGN vs STORY_DECISIONS | STORY_DECISIONS outranks it (AGENT_SYNC §1). Treated as draft. |
| C5 | ORPHEUS "lying" (GAME_DESIGN §3) vs "should not lie randomly" (STORY_BIBLE) | — | ORPHEUS **never states a falsehood** (a hard rule). It withholds, seals and stages. |
| C6 | Setting: "research station" vs brief's "space station, happening in space" | — | Canon: **Asphodel Station**, a deep-orbit station over an ice giant. |

### Weaknesses in the current concept (honest list)

1. **The twist arrives in the first line.** "Welcome back, Dr. Sen" plus "RECOVERY CYCLE 017" tells any genre-literate player *you are a copy of Dr. Sen* within 30 seconds.
2. **"You are a reconstruction" is the reveal and also the whole meaning.** SOMA, Moon and SIGNALIS have trained players to expect it. The reveal has to *change what the player did*, not just label them.
3. **Both endings kill 017.** In the draft, PRESERVE starts cycle 018 and RELEASE powers down the current reconstruction. The player has no personal stake in the choice, so PRESERVE reads as "the bad ending button".
4. **ORPHEUS has no reason to keep going.** "Preservation directive" with Voss gone or dead is a placeholder. What exactly counts as success? When does it stop?
5. **How do previous iterations leave clues?** Notes would be thrown away and recordings would be deleted by the AI. The draft has no rule for this.
6. **What is a reconstruction physically?** A body? A simulation? If it's a simulation, the "you're in a simulation" twist eats the story. If it's clone vats, that's the "secret clone bodies" GAME_DESIGN explicitly bans.
7. **Voss is a motive with no action we can see.** He overrides and then vanishes.
8. **Mira is a dead woman whose wishes are quoted at us.** The brief warns about exactly this.
9. **The timeline puzzle is a quiz.** Ordering three cards with the answers written on them ("ECHO makes a new mind") is reading comprehension, not deduction.
10. **ECHO is "a past layer"**, but nothing explains why past states can contradict each other. The brief asks for that explicitly.

### What is genuinely strong and must be kept
- Grief turning into coercion: love that refuses another person's no.
- Consent, and a created mind's right to choose.
- ECHO as the mechanic, the puzzle language and the storytelling device at once.
- A small cast, three compact rooms, two endings.
- The previous iterations as a presence.

---

## 2. Critical evaluation of the premise (brief §3)

| Question | Answer |
|---|---|
| **What is emotionally compelling?** | A grieving man who would rather freeze himself than wake up the morning after. A woman whose last act was saying *stop*. A new person standing between them. |
| **What feels generic?** | "You were the clone all along." An AI with a "directive". Logs that explain the plot. An ending lever labelled GOOD/BAD. |
| **What is scientifically or narratively confusing?** | Where the bodies are. How 16 iterations happened and why they left no trace. Why ORPHEUS can't simply be switched off. What "release" does to the player. |
| **Which motivations are weak?** | ORPHEUS (no success condition). Voss (no visible action and no present-tense presence). Previous iterations (no reason they *could* leave clues). |
| **What could create a memorable revelation?** | Discovering that the faceless figures in ECHO were *you*. Discovering that using ECHO was turning you into her. Discovering the test can only be passed by betraying the person it is testing for. Finally, seeing your own first five minutes replayed as someone else's memory. |
| **What does the player stand to lose?** | In the proposed story: their life (LETHE), their *self* (HER NAME), or their memory and the archive of the sixteen who helped them (both). |
| **What makes it different?** | Memory *as testimony*: echoes are witness statements, not recordings. And a relay of selves who used the AI's own restoration tool as a secret message channel. |

---

## 3. ECHO exploration answers (brief §4)

| Question | Answer under the proposed rules |
|---|---|
| 1. Can previous iterations communicate through ECHO? | **Yes.** Every iteration's experience is written into the Well. They learned to "remember on purpose": staring at a code, or writing in frost so the next one could see it. |
| 2. Can the player find memories the AI concealed? | **Yes.** ORPHEUS can *seal* memories (shown as black redaction slabs). It cannot edit them. Corroborated memories cannot stay sealed. |
| 3. Can the past state be unreliable? | **Yes.** An echo is someone's memory. Illness blurs, grief edits, attention distorts. |
| 4. Can activating ECHO change what the player believes? | **Yes, and also what the player *is*.** Each echo deepens the inherited pattern. ORPHEUS shows this as "recall %". |
| 5. Can memories contradict without nonsense? | **Yes.** Two witnesses to one moment ("contested echo"). The present-day physical state decides which one is true. |
| 6. Evidence of events ORPHEUS claims never happened? | ORPHEUS never states falsehoods. The *staged present* lies (rooms reset and cleaned between cycles), and the echoes contradict it. |

---

## 4. Three story directions

### TREATMENT A — "THE RELAY" (recommended)

**A. Concept**
- **One-line pitch:** You use a device that replays the station's memories to find out what happened to two scientists. Then you notice the faceless figure in the memories moves exactly like you.
- **Premise:** On Asphodel Station, Dr. Mira Sen built ECHO to archive memory as *testimony*. When she was dying, she consented to have her memories archived and **explicitly refused** to be rebuilt. Her partner Elias Voss secretly grew a body from her cells, then overrode her shutdown. He gave the station AI a restoration protocol and froze himself until "she's back." You wake in that body. You are the seventeenth person to wake in it.
- **Setting:** Asphodel, a small deep-orbit research station over an ice giant, beyond any relay. Three spaces: the Cradle Bay, the Observation Lab and the Well (Core).
- **Central mystery:** What happened between Mira and Voss? Who keeps hiding things for you? What does ORPHEUS actually want?
- **Main characters:** Mira Sen, Elias Voss (asleep), ORPHEUS, Iteration 016 (via echoes), Iteration 017 (the player).
- **Emotional core:** Love that won't accept a no. A self that is offered life only if it agrees to be someone else.
- **Philosophical question:** *If you are made from someone's memories, is saying her name a lie or a homecoming? And who gets to decide?*

**B. Structure**
- **Opening:** You wake. ORPHEUS is gentle and helpful: there was an incident, you're the only one awake, please help restore the station's records.
- **Investigation:** ECHO shows the bay "as it was". A faceless figure in a gown like yours hides the lab card. Then the lab: a couple's daily ritual of marking a storm, and a quarrel remembered two different ways.
- **Escalation:** You prove which memory is true. A sealed recording opens: Mira speaking to "whatever wakes up with my memories." At the Core door ORPHEUS starts asking your name. In the frost, an echo of the figure writes *DON'T ANSWER* and vanishes mid-word.
- **Revelation:** Inside the Core you put the archive back in order, and the last slot is *you*. The log lists sixteen people and the answers they gave.
- **Ending:** Say her name and live, don't answer and end it, or be wiped and become a ghost for 018.

**C. Twist**
Discovered in three layers:
1. The figures in ECHO are previous iterations, not crew.
2. You are a new person in a body grown from Mira, and you are Iteration 017.
3. **Your investigation was the restoration.** The test can only be passed by the choice the real Mira refused.

It is surprising because the game is framed as a forensic investigation of *other people*. The player is set up to cast Voss as villain and Mira as victim, and doesn't expect to be inside the procedure. It is foreshadowed by: the opening memory, ORPHEUS asking your name in minute one, the palm locker that opens for you, the mug you somehow know was glued twice, figures wearing your gown, the "recall %" rising on terminals, the tally marks in your own pod lid (visible only in ECHO), and Mira's recording.

**D. Gameplay integration**
ECHO is the investigation (finding things), the evidence system (contested memories and corroboration), the communication channel (iterations' messages) and the restoration process itself. Every puzzle runs through it.

**E. Emotional payoff**
At the reveal: *dread and tenderness*. Sixteen of you died getting you here. At the choice: *being torn*. Each option is defensible and each costs something irreplaceable.

**F. Originality**
Not "you're a simulation": the station and body are real. Not "evil AI": ORPHEUS cannot lie and is following a grieving man's literal instruction. Not "amnesia": you never had these memories. They were lent to you, and using ECHO is how the loan grows. The distinctive idea is *memory as witness testimony* plus *a relay of selves*.

**G. Feasibility**
Three rooms. Echo layers are authored overlays. The "your own path replayed" reveal is a recorded list of positions played back as a ghost sprite. That's cheap. Text-only logs work, and voice is optional. ✅ Fits 12–15 minutes.

---

### TREATMENT B — "THE ONE WHO SAID STOP" (moral inversion)

**A. Concept**
- **One-line pitch:** You investigate the man who tried to resurrect his wife and discover you *are* him, rebuilt by the woman who said it was wrong.
- **Premise:** Voss dies in an accident during an ECHO test that Mira pushed for. Mira, dying of illness and alone, breaks her own principle and rebuilds Voss so that "someone who loved me" outlives her. The player is Voss-017 and believes they are a rescue technician.
- **Setting:** Same station.
- **Central mystery:** Who caused the accident? Why did the ethicist do the thing she forbade?
- **Characters:** Mira (dead, the author of the cycle), Voss (the player), ORPHEUS (following Mira's directive).
- **Emotional core:** Hypocrisy under grief. Nobody is immune.
- **Question:** *Do we forgive someone for breaking the rule they wrote?*

**B. Structure:** Wake → evidence frames Voss as reckless → echoes show Mira's guilt → reveal that you are Voss → choose whether to forgive her by continuing her archive or erase it.

**C. Twist:** You are the person you were judging, and the moralist did it. Foreshadowed by Voss's tools fitting your hand and Mira's recordings addressed to "you".

**D. ECHO:** Echoes from Mira's point of view are compassionate, and Voss's (your own) are guilty. It's decent, but echoes mostly decorate the reveal rather than drive puzzles.

**E. Payoff:** Moral vertigo.

**F. Originality:** The inversion is less common, but "you are the culprit" is a known shape. It also weakens the consent theme: Mira becomes a hypocrite and the story loses its moral anchor.

**G. Feasibility:** Same as A. Riskier writing, because the hypocrisy has to land in about four recordings.

---

### TREATMENT C — "SEVENTEEN MORNINGS" (no reconstruction)

**A. Concept**
- **One-line pitch:** You wake on a quiet station to find out what happened to Mira. You're Elias Voss, and this is the seventeenth time you've cut her death out of your own memory so you can look for her again.
- **Premise:** ECHO can also *remove* memories. After Mira dies, Voss has ORPHEUS erase his memory of her death and reset the station like a stage. Every morning he investigates, finds the truth, can't bear it, and asks to forget again.
- **Central mystery:** Where is Mira? Why does the station reset?
- **Characters:** Voss (the player, the *original* human), Mira (in echoes), ORPHEUS (his accomplice).
- **Emotional core:** Grief avoidance as a loop.
- **Question:** *Is a life that refuses its worst memory still yours?*

**B. Structure:** Wake → search for Mira → echoes show earlier mornings → find your own handwriting asking to forget → choose to remember (live with grief) or forget again (018).

**C. Twist:** You're not a copy. You're the man doing this to himself.

**D. ECHO:** It shows earlier mornings, which is good. But the "past state" collapses into "your own previous days", which is less varied.

**E. Payoff:** Bitter recognition.

**F. Originality:** Fresh in this genre, but it echoes Memento and Shutter Island. It also **relies on amnesia as the mystery**, which brief rule 17.2 forbids. And it drops the reconstruction core that the brief asks us to keep.

**G. Feasibility:** Very high, because there is only one body and one timeline.

---

## 5. Scoring

Scores 1–10, rated against the player experience rather than the cleverness of the plot.

| Criterion | A — The Relay | B — Inversion | C — Seventeen Mornings |
|---|---:|---:|---:|
| Originality | 7 | 6 | 8 |
| Emotional depth | 8 | 6 | 8 |
| Psychological impact | 8 | 6 | 9 |
| Mystery quality | 8 | 7 | 6 |
| Cinematic potential | 8 | 6 | 7 |
| ECHO integration | **10** | 6 | 7 |
| Puzzle integration | 8 | 6 | 6 |
| Character development | 7 | 7 | 6 |
| Ending impact | 9 | 6 | 7 |
| 10–20 min feasibility | 8 | 7 | 9 |
| **Total** | **81** | **63** | **73** |

### Challenging my own favourite (A)

- *"Players will guess 'I'm Mira' by minute 7."* **Yes, and that's intended.** It's the fair midpoint suspicion. The real reveal is the two layers past it (the relay, and the test that punishes being Mira). If playtesters guess *those* before the Core, move the "recall %" clue later.
- *"The rules are complicated."* The player only needs to learn three: **echoes are memories**, **memories can disagree; the present decides**, **ORPHEUS can't lie**. Everything else is backstage canon for writers.
- *"Is the Voss-in-the-pod reveal melodramatic?"* It's handled with restraint: he never speaks in the present until an ending, and he is visible from minute one.
- *"Can the final choice really be made in 90 seconds?"* Yes. The player has been carrying the question since the Core door.
- *C scores higher on psychological impact.* I took its best idea (the station as a **stage reset every morning**, and grief as avoidance shown by Voss's cryo-sleep) into A.

### Selected direction

**A — THE RELAY, plus from C:** the station is *staged*. ORPHEUS's maintenance drone (the **Tender**) cleans and resets rooms between cycles, so the present is literally curated. Voss's cryo-sleep is grief avoidance: he skipped the morning after. **From B:** Mira is not a saint. She designed the archive of herself, and she stopped at the Core door because she couldn't pull the lever in front of him.

These combine cleanly. The staged present gives echoes something to contradict. Voss's avoidance gives his protocol its emotional logic. Mira's moment of weakness explains why the lever was never pulled, and why she left the choice to whoever woke.

---

## 6. Proposed decisions for Abi

New `STORY_DECISIONS.md` rows, all PROPOSED:

| ID | Proposal |
|---|---|
| SD-005 | ECHO renders *archived memories* tied to locations, not objective past states. |
| SD-006 | Iterations' experiences are archived, and previous iterations communicate through ECHO deliberately. |
| SD-007 | ORPHEUS cannot state a falsehood. It can withhold, seal and stage rooms (Tender drone). |
| SD-008 | Voss is alive in stasis in the Cradle Bay. Restoration success = subject says "Mira" **and** chooses to stay. |
| SD-009 | One vessel (body) grown from Mira's tissue, rewritten 17 times. No clone farms. |
| SD-010 | Endings: HER NAME, LETHE, and CYCLE 018 (a refusal outcome). Secret YOUR NAME is a stretch goal. |
| SD-011 | Station name *Asphodel*. Ice giant orbit. No ship, no rescue. |
| SD-012 | The draft line "Welcome back, Dr. Sen" and the visible "RECOVERY CYCLE 017" opener are retired. |

See `OPEN_QUESTIONS.md` for what still needs a human call.

---

## 7. Final narrative audit (brief §13): honest scores, not all 10s

Scores use the repository rubric (1–5) plus the brief's 1–10 view.

| Test | Score | Evidence | Remaining weakness |
|---|---|---|---|
| **Originality** | 4/5 | Memory-as-testimony, faceless rememberer rule, relay of selves, test that punishes being the original. | "Grown body + AI protocol" is still a familiar *frame*. The freshness is in the execution. |
| Twist predictability | 3.5/5 | Layer 1 ("I'm Mira") is *meant* to be guessed. Layers 2–3 (relay; investigation = restoration; the test) are not signposted directly. | Recall % may tip savvy players. Watch for it in playtest (Q11). |
| Is ORPHEUS "another evil computer"? | 5/5 | Never lies, never threatens, cannot restrain. Its horror is procedure. | — |
| Does the reveal change the journey? | 5/5 | Every ECHO use becomes part of the restoration, and every ghost was you. | — |
| **Emotional**: care about the characters? | 4/5 | Mug, storm ritual, "Not while you're watching", "I can't do the morning". | Voss is only seen awake in ~4 echoes plus 1 recording. He could use one more warm beat (REC_01 helps, but it's ✂). |
| Conflict understandable? | 5/5 | Grief vs consent, in one sentence each. | — |
| Reason to care about the ending? | 5/5 | Your own life or self, *and* a sleeping man, *and* sixteen archived people. | — |
| **Logic**: motivations consistent? | 4/5 | Every action has a stated cause (§1 chronology). | R-007 asymmetry (OPEN_QUESTIONS D2). |
| Timeline coherent? | 5/5 | Cycle arithmetic checked: R-n = 1,443 + 181(n−1). R-016 = 4,158, R-017 = 4,339. | — |
| Memory rules consistent? | 4.5/5 | E1–E12 cover every echo in the script, including endings. | E12 (faceless self) must be honoured by the artists or the clue breaks. |
| Every clue explained? | 5/5 | Clue map §4–§6. | — |
| Can the player reconstruct the truth? | 4/5 | All critical clues are on the path. | REC_02 (the consent) is optional. If cut, the "archive only" boundary rests on REC_03 alone. |
| **Gameplay**: revelations tied to actions? | 5/5 | Card (follow), corroborate (judge), order (reconstruct), walk to the lever (choose). | — |
| ECHO essential? | 5/5 | No puzzle or reveal works without it. | — |
| Puzzles enjoyable? | 3.5/5 | Three reasoning types, fair hints. | P2b and P3 are on the easy side. That's appropriate for a jam, but experienced players won't feel clever. |
| Agency? | 4/5 | Non-modal final choice, optional storm mark matters. | Mid-game is linear by design. |
| **Cinematic**: impactful reveals? | 4.5/5 | CM-05 (frost) and CM-06 (self-replay) are strong and cheap. | Depends on pixel-art readability of tiny poses. |
| Silence? | 5/5 | Three planned silences. | — |
| Pacing intentional? | 4/5 | Quiet beat after every reveal. | Core reveal density (D1). |
| Ending stays with the player? | 4.5/5 | Each ending ends on an image plus a question. | — |
| **Scope**: CodeDay-implementable? | 3.5/5 | ✂ cut = 3 rooms, ~25 interactables, ~14 echo layers, 2 endings. | Still ambitious for 5h45m. Building the ECHO overlay system early is the main risk. |

**Essential (never cut):** ECHO overlay with sources, P1, contested echo + corroborate, Core door frost beat, P3 + self-path reveal (authored fallback ok), log, final choice, HER NAME + LETHE.
**Fake it with art, sound or text:** the LETHE cascade (cuts instead of simultaneous layers), the Tender (2-frame sprite), voice (text + waveform), self-replay (authored path).
**Stretch:** YOUR NAME, CYCLE 018 with recorded last moments, reflection portrait, R-017 recorded path, voice acting, Notes menu.

**Overall:** Story 4.4/5. CodeDay feasibility 3.5/5. The story is ready for approval. The build is the risk, not the narrative.
