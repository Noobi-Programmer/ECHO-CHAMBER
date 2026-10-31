# CodeDay run sheet — ECHO//CHAMBER

## Before team formation
- Bring laptop, charger, mouse, headphones.
- Ensure Bun, Git and browser are ready.
- Have the 30-second pitch ready.
- Agree that the first playable build matters more than a large feature list.

## Build window
The event schedule gives two build blocks: 10:15 AM–1:00 PM and 2:30–5:30 PM (5 hours 45 minutes total). Submission is due at 5:30 PM. Aim to freeze features by 4:45 PM and submit by 5:20 PM.

| Time | Deliverable |
|---|---|
| 9:45–10:15 | Pitch, find team, agree roles |
| 10:15–10:30 | Lock scope, create repo, start app, assign file ownership |
| 10:30–11:15 | Player movement, collisions, first room |
| 11:15–12:00 | Interaction prompt, dialogue, room transitions |
| 12:00–1:00 | ECHO overlay and first meaningful clue working |
| 1:00–2:30 | Lunch + guest session; no risky architecture changes |
| 2:30–3:15 | Add remaining room states and evidence |
| 3:15–4:00 | Light sequence + timeline puzzle + reveal |
| 4:00–4:30 | Endings, ambient audio, visual polish |
| 4:30–4:45 | Blind playtest; fix blockers and confusing interactions |
| 4:45–5:10 | Feature freeze; clean build, deployment and submission |
| 5:10–5:30 | Buffer for upload/link/check-in problems |

## 30-second team formation pitch

“ECHO//CHAMBER is a short pixel-art psychological thriller set in an abandoned research station. You can briefly reveal how each room looked in the past, then compare those memories with the present to solve environmental puzzles. As the station AI contradicts your discoveries, you learn you're the seventeenth reconstruction of a researcher—and that earlier versions have been leaving clues for you. The final question is whether to preserve the loop or end it.”

## Team roles (4 people)
- Project lead / integrator: scope, merge, build, test, pitch.
- Programmer: player, rooms, interactions, ECHO, puzzle flow.
- Artist: tile palette, player, room art, props, past-state silhouettes.
- Writer/audio/puzzle: logs, timeline clues, hints, ambience, SFX.

## Demo route for judges (60–90 seconds)
1. Show the character moving and one interactable object.
2. Trigger ECHO; show a past-state difference.
3. Solve one short puzzle.
4. Reveal Iteration 017 and show the two choices.
5. Explain that ECHO is simultaneously the mechanic, puzzle language and story device.

## Last-minute cut order
1. Secret/optional ending.
2. Optional collectibles.
3. Voice acting.
4. Extra animation and fancy effects.
5. One secondary puzzle.

Do not cut the ECHO mechanic, the reveal, the ending, restart, or basic QA.

## Final QA checklist
- [ ] Fresh reload works.
- [ ] No blocking console errors.
- [ ] WASD/arrows move; wall collision works.
- [ ] E interaction is clear and reliable.
- [ ] ECHO shows the past-state overlay.
- [ ] Each puzzle has a fair clue and hint.
- [ ] No room transition softlock.
- [ ] Both endings work.
- [ ] Restart works.
- [ ] Text is readable at normal laptop distance.
- [ ] Audio can be muted.
- [ ] Game is deployed or launchable with clear instructions.
- [ ] Submission link is copied and tested.
