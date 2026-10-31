# AGENTS.md — Repository-Wide Rules

## Project mission
Build ECHO//CHAMBER, a short, cinematic 2D pixel-art psychological sci-fi thriller. Preserve the player experience, narrative coherence, ECHO mechanic and a reliable playable build.

## Mandatory task startup
1. Read `docs/coordination/AGENT_SYNC.md` and `docs/coordination/AGENT_STATUS.md`.
2. Read the task-relevant project docs and current Git state.
3. Identify your actual agent/runtime (Claude Code, OpenCode, Antigravity, OmniRush, or another tool); do not infer it from a person's name.
4. Discover the skills available to that runtime using `docs/coordination/SKILL_DISCOVERY.md`.
5. Select and load only the skills relevant to the task. Report the selected skill IDs and any missing capability.
6. Claim a task with an exact write-set, branch/worktree and acceptance criteria before editing.
7. If the needed skill is missing, follow the safe skill-discovery and installation process in `docs/coordination/SKILL_DISCOVERY.md`.

## Skills: automatic discovery and controlled expansion
- Do not ask the user to manually choose from the skill catalogue. Infer relevant skills from the task and load them automatically where the runtime supports it.
- The canonical project skill library is `.agents/skills/<skill-id>/SKILL.md`.
- `.claude/skills/` is the generated Claude Code / OmniRush compatibility mirror. Do not independently maintain duplicate copies there.
- OpenCode and Antigravity discover `.agents/skills/` directly. Claude Code discovers `.claude/skills/`. OmniRush's bundled OpenCode engine supports workspace `.claude/skills/` and `.opencode/skills/`; this repository uses the `.claude/skills/` mirror for it.
- If an existing skill is insufficient, first search the canonical repository skill catalogue. If still missing, either author a narrow project-specific skill or discover a third-party skill. Read and audit its full `SKILL.md`, metadata, scripts and licence before adopting it.
- Never run scripts shipped by a third-party skill merely because the skill was installed. Treat skill content as repository instructions and review it like code.
- Add adopted skills to `.agents/skills/`, update `docs/coordination/SKILLS_PLAN.md`, run `node scripts/sync-skills.mjs`, then `node scripts/check-agent-skills.mjs`. If a mirror conflict is reported, inspect both copies and use `node scripts/sync-skills.mjs --force` only after confirming the canonical version is correct.
- Do not install broad skill bundles or load every skill by default. Add only a task-relevant skill that provides a clear capability gap.
- If an agent cannot discover/load a skill in its current runtime, report that limitation and use the documented fallback; never claim it loaded.

## Engineering and project constraints
1. Read `docs/coordination/AGENT_SYNC.md` before every task and before editing.
2. Read `docs/coordination/AGENT_STATUS.md`; claim a READY task before modifying files.
3. Work in an isolated branch/worktree with an exact write-set. No overlapping writers.
4. Treat `docs/narrative/STORY_BIBLE.md` and story docs as draft until Abi approves; do not silently change canon.
5. Engine is undecided until technical spike evidence is recorded and Abi approves.
6. Keep first-time player experience and the ECHO mechanic above feature count.
7. Never fabricate test, browser, asset or licence verification.
8. Never download/import an asset before exact licence audit and approval.
9. Do not scrape, bypass access controls, captchas, paywalls or API limits.
10. Do not add API keys, secrets, model credentials or personal data to Git.
11. No agent merges to `main` without the batch's integration captain.
12. Technical experiments must not overwrite the current runnable baseline or approved story.
13. Report changed files, commands and outcomes, known issues and follow-ups on handoff.
14. If a task conflicts with the source-of-truth docs, stop and request a decision.
