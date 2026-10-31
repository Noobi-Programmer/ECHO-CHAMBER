# Start Here — First 60 Minutes

## The strategy

Run two independent workstreams immediately:

### Track A — EXPERIENCE FIRST (story and player experience)

Goal: design a compelling 10–15 minute experience that makes the player feel curiosity, suspicion, disorientation, recognition and finally agency. It owns narrative proposals, scene structure, clue logic, puzzle fairness, dialogue and emotional payoff. It must not wait for engine research.

**First dispatch:** Arpita + Claude Code as the initial narrative-workshop session, with Abi as product/story approver. This is a convenient initial allocation, not a permanent role. Other available sessions may review the story independently once the first draft is ready.

### Track B — BUILD SYSTEM (technical and operational research)

Goal: determine how to build, coordinate agents, use skills, acquire assets safely, test and ship. It may prototype isolated technical experiments, but must not rewrite story canon. It owns engine comparison, Phaser/Godot proof-of-concept, rendering approach, ECHO state architecture, agent capability matrix, skill discovery, asset scout design, licence validation, QA and deployment research.

**Initial dispatch:** Abi, Kishore and available agent sessions. OpenCode, Antigravity and OmniRush can divide research/prototyping dynamically. Claude Code can also be routed to technical work later if its capability or availability makes it the best fit.

## First-hour schedule

| Timebox | Track A | Track B |
|---|---|---|
| 0–10 min | Read story workshop; list assumptions and unanswered questions | Read technical plan; inspect repository/tool availability |
| 10–25 min | Generate 2–3 story treatments; compare emotional stakes and originality | Compare Phaser 4, Godot Web and other viable options; list proof requirements |
| 25–40 min | Select one treatment and make a causal story timeline | Prototype risk spike: canvas pixel scaling, input, scene states, ECHO overlay feasibility |
| 40–55 min | Draft player journey, clue matrix and ending choices | Map agents, skill discovery, Git isolation, asset-search feasibility and QA loop |
| 55–60 min | Send decision memo to Abi; unresolved questions explicit | Send technical recommendation with evidence, risks and next experiment |

## No premature implementation rule

Do not build rooms, lore-heavy dialogue or final art before the story team establishes the emotional arc and the technical team proves the smallest ECHO prototype. Placeholder art is acceptable for the prototype.

## Decisions required from Abi

1. Approve one story treatment.
2. Approve the protagonist/relationship framing and final moral dilemma.
3. Approve target duration and required content scope.
4. Approve engine after a timed technical spike.
5. Approve the production plan and task allocations.

Nothing is `STORY_LOCK: APPROVED` until Abi explicitly marks it so in `STORY_DECISIONS.md`.

## Core developer and agent commands

```bash
# Install dependencies
npm install

# Run the game locally (Vite dev server)
npm run dev

# Build the game for production
npm run build

# Preview production build locally
npm run preview

# Validate planning docs and skills
npm run plan:validate

# Verify and synchronize agent skills
npm run skills:check
npm run skills:sync
```
