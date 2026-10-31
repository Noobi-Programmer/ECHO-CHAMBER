# OPEN_QUESTIONS — decisions needed from Abi

**Status:** PROPOSAL v0.2. Each question has a recommended answer, so a fast "approve all recommendations" is possible. Silence is not approval (`STORY_DECISIONS.md`).

## A. Approval of direction (blocking narrative production)

| # | Question | Recommendation | Why it matters |
|---|---|---|---|
| Q1 | Approve **Treatment A "The Relay"** (with elements of C and B) as the story direction? | **Yes** | Everything else depends on it. |
| Q2 | Approve the ECHO rule: **echoes are archived memories with sources, not objective past states** (SD-005, E1–E12)? | **Yes** | Biggest design change. It lets memories contradict each other, carry previous-iteration messages and be sealed, all from one rule. |
| Q3 | Approve **ORPHEUS never lies** (withholds, seals, stages; I-1)? | **Yes** | Makes the AI coherent and the final choice informed. Rules out "evil AI" lines in GAME_DESIGN §8. |
| Q4 | Approve **Voss alive in stasis** in the Cradle Bay (SD-008)? | **Yes** | Gives the endings a human consequence. |
| Q5 | Approve **the endings**: HER NAME + LETHE as main, CYCLE 018 as the refusal outcome, YOUR NAME as a secret stretch goal (SD-010)? | **Yes** | Replaces PRESERVE/RELEASE (see `ENDING_DESIGN.md` §1). |
| Q6 | Retire "Welcome back, Dr. Sen" as the opening line and the visible "RECOVERY CYCLE 017" counter (SD-012)? | **Yes**. The line is reused as ORPHEUS's last words in HER NAME. | It gives away the twist in the first 30 seconds. |
| Q7 | Station name **Asphodel**; vessel = **one body** grown from Mira's tissue (SD-009, SD-011)? | **Yes** | Avoids "clone farm" and "simulation" readings. |

## B. Creative calls (non-blocking, with defaults)

| # | Question | Default if no answer |
|---|---|---|
| Q8 | Player gown and body: is a female-bodied vessel okay, with ORPHEUS avoiding pronouns for the player in YOUR NAME ("They woke this morning")? | Yes, as written. |
| Q9 | Should the protagonist have *any* spoken line? (Currently only an optional "I'm here." in HER NAME, and the typed name in YOUR NAME.) | Keep as written. |
| Q10 | Mira's illness is unnamed ("a progressive neurological condition"). Should we name it? | Keep unnamed. That avoids medical inaccuracy. |
| Q11 | Recall % on terminals: does it give away too much too early? | Keep. Playtest. If 2 of 3 testers guess "restoration" before REC_04, hide it until the Lab. |
| Q12 | ECHO input: hold (current) or toggle? | Hold, ~4 s. The fiction supports either. Decide by playtest. |
| Q13 | Does the LETHE "cascade" (every memory at once) fit the build time? | Fallback: a 3-room cut sequence showing 4 layers each, then fade. |

## C. Process and coordination

| # | Question | Default |
|---|---|---|
| Q14 | **Write-set conflict:** `AGENT_STATUS.md` lists STORY-001 as `research/story/**`, but the narrative brief requires `docs/narrative/**`. Coordinator: please update the claim to `docs/narrative/**`. | Treat `docs/narrative/**` as STORY-001's write-set. |
| Q15 | **Playtime source of truth:** GAME_DESIGN (8–12), IDEA/Charter (10–15), brief (12–15). | Full design 12–15. CodeDay build 9–11 (✂ markers). Update PD-001. |
| Q16 | After approval, who updates root `STORY_BIBLE.md`, `STORY_DECISIONS.md`, `GAME_DESIGN.md` §3/§7–9, `EXPERIENCE_BLUEPRINT.md`, `NARRATIVE_SCRIPT_DRAFT.md`, `CODEDAY_RUNSHEET.md` pitch? | STORY-002, by the story session, in one PR after approval (AGENT_SYNC §4). |
| Q17 | **Independent blind review:** a different session should play-read `NARRATIVE_SCRIPT.md` without reading the bible and report what it inferred per chapter (compare against `CHRONOLOGY_AND_CLUE_MAP.md` §7). | Assign to Kishore's Antigravity session after the engine spike. |
| Q18 | The CodeDay pitch in `CODEDAY_RUNSHEET.md` / `GAME_DESIGN.md` §18 spoils the twist ("you're the seventeenth reconstruction"). That's fine for team formation, but use the new spoiler-light pitch for judges? | Yes. See below. |

### Proposed new 30-second pitch (spoiler-light)
> "ECHO//CHAMBER is a short pixel-art psychological thriller on a silent space station. Your device replays the station's *memories*: not what happened, but what people *remember* happened. Memories disagree, some lie, and the faceless figure in them keeps hiding things from the AI. The same mechanic is the puzzle language, the evidence system and, it turns out, the reason you exist. It ends with one question from the AI, and every answer costs something."

## D. Known weaknesses I couldn't resolve without your input
1. **Exposition density in the Core.** REC_04 + log + reflection arrive within ~90 s. It's mitigated by player pacing and silences, but needs a playtest.
2. **R-007's "pressed the key slot = divergence"** is the one place where ORPHEUS treats an action as an answer. It's consistent, but a sharp reader may notice the asymmetry with the manual lever. Defensible (remote trigger vs. silence), or simply delete R-007's line.
3. **Voss's age.** Stasis doesn't age him, so after ~8.4 years he looks the same. Some players may read that as a time-travel hint. Optional fix: a frost-burn scar, or the vitals line showing "8y 156d".
