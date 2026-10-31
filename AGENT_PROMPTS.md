# Agent Launch Prompts — Dynamic Team

## Universal startup prompt (paste first into every session)

You are joining ECHO//CHAMBER. Before doing anything, read `AGENT_SYNC.md`, `AGENT_STATUS.md`, `AGENTS.md` and `PROJECT_CHARTER.md`. Then report your actual model/runtime, tools, permissions, loaded skills, quota/context constraints and availability. Inspect the repository and select a READY task matching your current capability. Claim its exact write-set, read-set, branch/worktree, dependencies and acceptance criteria in the task system before editing. Never assume a permanent role based on your tool brand or person. Never overlap another active writer. Provide a factual handoff with files and verification actually performed.

## Track A — story workshop author

Read `STORY_WORKSHOP.md`, `STORY_BIBLE.md`, `EXPERIENCE_BLUEPRINT.md`, `STORY_REVIEW_RUBRIC.md` and current `STORY_DECISIONS.md`. Do not simply polish the draft. Generate three genuinely different treatments, score them, recommend one, identify clichés and causal holes, then develop the best into a character map, causal chronology, player-knowledge map, beat sheet, clue/puzzle matrix, dialogue/recording draft and two ending treatments. Keep story docs in `research/story/` until Abi approves. Do not edit engine code or approved canon. Output unresolved decisions separately.

## Track A — independent story critic

Read the current story treatment without coaching from the author. Test originality, causal logic, mystery fairness, player agency, emotional specificity and feasibility. Identify what a first-time player will understand at each beat and where they will misunderstand. Suggest cuts and alternative reveals. Do not rewrite canon; submit a review memo.

## Track B — engine researcher

Read `TECHNICAL_RESEARCH_PLAN.md` and `ARCHITECTURE_PROPOSAL.md`. Compare Phaser 4 + TS/Vite against Godot Web (and only other viable candidates). Use official docs and a 45-minute maximum proof: pixel-perfect room, movement/collision, ECHO past-state toggle, interaction and browser refresh. Record versions, commands, evidence, problems, deployment and recommendation in `research/technical/`. Do not alter story docs or merge application code without a separate task claim.

## Track B — agent/skills researcher

Read `AGENT_SYSTEM_PLAN.md`, `AGENT_ROUTER.md`, `SKILLS_PLAN.md` and `AGENT_SYNC.md`. Verify current support/discovery of `.agents/skills/` and `.claude/skills/` across the actual installed Claude Code, OpenCode, Antigravity and Codebuff versions. Propose the smallest useful skill set, dynamic task scoring, status mechanism and Git/worktree workflow. Test skill invocation in each tool; distinguish documented support from assumed compatibility. Report in `research/agents/`.

## Track B — asset automation researcher

Read `ASSET_PIPELINE.md` and `ASSET_SOURCES.md`. Research approved official APIs and terms for images, sprites, SVG/GIF, animation, sound effects, ambience, music and fonts. Design independent scout → licence audit → approval → quarantine download → validation → register → import. Do not scrape MyInstants or websites that disallow automation. Do not download/import copyrighted/unknown-licence files. Use mock candidates if APIs/keys are unavailable. Report feasible APIs, rate/plan constraints, schemas and safe implementation in `research/assets/`.

## Track B — QA and release researcher

Read `QA_PLAN.md` and `GITHUB_WORKFLOW.md`. Design an automated browser test path for movement, ECHO, interactions, puzzle states, endings, responsive layout, console/network errors and reload. Evaluate Playwright or available browser automation. Report exact tests and what cannot be automated. Do not modify game code unless assigned.

## Implementation task prompt (only after engine lock)

Read approved architecture and assigned ticket. Inspect repository and all active write-sets. Implement only your task's allowed files. Add tests or manual verification steps. Preserve a playable build. Avoid dependency changes unless the integration captain approves. Open a PR; never merge to main yourself.
