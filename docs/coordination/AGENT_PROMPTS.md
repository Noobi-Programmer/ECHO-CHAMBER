# Agent Launch Prompts — Dynamic Team

## Universal startup prompt (paste into every new session)

You are joining ECHO//CHAMBER. Before doing anything, read `docs/coordination/AGENT_SYNC.md`, `docs/coordination/AGENT_STATUS.md`, `AGENTS.md`, `docs/planning/PROJECT_CHARTER.md` and `docs/coordination/SKILL_DISCOVERY.md`.

1. Identify your actual product/runtime, model, tools, permissions, context and quota constraints.
2. Discover skills in the runtime-native directory described in `docs/coordination/SKILL_DISCOVERY.md`.
3. Automatically select and load only the skills relevant to the task. Do not ask the user to manually select skills.
4. If a required capability is not covered, search the existing project skills first. If still missing, follow the audited skill-expansion process and claim the new skill path.
5. Report runtime, relevant skill IDs and current availability.
6. Inspect Git state, choose a READY task, check active write-sets and claim exact files/acceptance criteria before editing.
7. Work in an isolated branch/worktree. Never overlap another writer or merge to `main`.
8. Deliver a factual handoff with changed files, skills used, verification actually performed and known issues.

People and tool seats are not permanent job assignments. The router assigns tasks dynamically based on current model/runtime fit, tool permissions, relevant context, verification value, workload and quota.

## Story workshop / narrative assignment

Read `docs/narrative/STORY_WORKSHOP.md`, `docs/narrative/STORY_BIBLE.md`, `docs/planning/EXPERIENCE_BLUEPRINT.md`, `docs/narrative/STORY_REVIEW_RUBRIC.md` and `docs/narrative/STORY_DECISIONS.md`. Load relevant skills such as `story-workshop`, `psychological-thriller-writing`, `narrative-continuity`, `cinematic-pacing`, `puzzle-design` and `player-experience-review`.

Do not simply polish the draft. Generate three genuinely different treatments, score them, recommend one, identify clichés and causal holes, then develop the best into a character map, causal chronology, player-knowledge map, 10–15 minute beat sheet, clue/puzzle matrix, dialogue/recording draft and two ending treatments. Keep story docs in `research/story/` until Abi approves. Do not edit engine code or approved canon. Output unresolved decisions separately.

## Independent story critic

Read the current story treatment without coaching from the author. Load `player-experience-review`, `narrative-continuity` and `psychological-thriller-writing` as appropriate. Test originality, causal logic, mystery fairness, player agency, emotional specificity and feasibility. Identify what a first-time player will understand at each beat and where they will misunderstand. Suggest cuts and alternative reveals. Do not rewrite canon; submit a review memo.

## Engine researcher

Read `docs/technical/TECHNICAL_RESEARCH_PLAN.md` and `docs/technical/ARCHITECTURE_PROPOSAL.md`. Load `engine-evaluation` and verify official documentation for current engine versions. Compare Phaser 4 + TS/Vite against Godot Web (and only other viable candidates). Use a timeboxed proof: pixel-perfect room, movement/collision, ECHO past-state toggle, interaction and browser refresh. Record versions, commands, evidence, problems, deployment and recommendation in `research/technical/`. Do not alter story docs or merge application code without a separate task claim.

## Agent/skills researcher

Read `docs/coordination/AGENT_SYSTEM_PLAN.md`, `docs/coordination/AGENT_ROUTER.md`, `docs/coordination/SKILLS_PLAN.md`, `docs/coordination/SKILL_DISCOVERY.md` and `docs/coordination/AGENT_SYNC.md`. Load `multi-agent-coordination` and `git-parallel-work`. Verify current support/discovery of skill paths for the actual installed Claude Code, OpenCode, Antigravity and OmniRush versions. Propose the smallest useful skill set, dynamic task scoring, status mechanism and Git/worktree workflow. Distinguish documented support from assumed compatibility. Report in `research/agents/`.

## Asset automation researcher

Read `docs/assets/ASSET_PIPELINE.md` and `docs/assets/ASSET_SOURCES.md`. Load `browser-asset-scout`, `asset-license-audit` and `asset-ingestion`. Research approved official APIs and terms for images, sprites, SVG/GIF, animation, sound effects, ambience, music and fonts. Design independent scout → licence audit → approval → quarantine download → validation → register → import. Do not scrape MyInstants or websites that disallow automation. Do not download/import copyrighted/unknown-licence files. Use mock candidates if APIs/keys are unavailable. Report feasible APIs, rate/plan constraints, schemas and safe implementation in `research/assets/`.

## QA and release researcher

Read `docs/technical/QA_PLAN.md` and `docs/coordination/GITHUB_WORKFLOW.md`. Load `browser-game-qa`, `performance-accessibility` and `git-parallel-work`. Design an automated browser test path for movement, ECHO, interactions, puzzle states, endings, responsive layout, console/network errors and reload. Evaluate Playwright or available browser automation. Report exact tests and what cannot be automated. Do not modify game code unless assigned.

## Implementation task prompt (only after engine lock)

Read approved architecture and assigned ticket. Inspect repository and all active write-sets. Load the engine and task-specific skills that match the approved stack. Implement only the task's allowed files. Add tests or manual verification steps. Preserve a playable build. Avoid dependency changes unless the integration captain approves. Open a PR; never merge to main yourself.
