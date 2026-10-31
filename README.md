# ECHO//CHAMBER — Full Production & Agent Plan

> **A memory can be evidence. It can also be a lie.**

A planning and pre-production repository for a short, cinematic 2D pixel-art psychological sci-fi thriller.

## Start here
1. Read `START_HERE.md`.
2. Every agent follows `AGENT_SYNC.md` before claiming or editing a task.
3. Read `AGENTS.md` for project rules and `SKILL_DISCOVERY.md` for runtime-native skill discovery.
4. Story work uses `STORY_WORKSHOP.md`, `STORY_BIBLE.md` and `EXPERIENCE_BLUEPRINT.md`.
5. Technical work uses `TECHNICAL_RESEARCH_PLAN.md`, `ARCHITECTURE_PROPOSAL.md` and `AGENT_SYSTEM_PLAN.md`.
6. `TEAM_DISPATCH.md` describes the initial parallel batch; roles remain dynamic.
7. Canonical project skills live in `.agents/skills/`. They are mirrored into `.claude/skills/` for Claude Code and OmniRush.

## Automatic skills
Agents must inspect the repo's skills, select relevant ones for the current task, and load them automatically. If a needed skill is missing, they may add a focused project skill after reviewing its source, licence, instructions and scripts. See `SKILL_DISCOVERY.md`.

Validate skill setup:

```bash
node scripts/sync-skills.mjs
node scripts/check-agent-skills.mjs
```

## Team and tools (user-provided; re-confirm at session start)
- **Abi:** OpenCode, Antigravity Pro and OmniRush.
- **Arpita:** Claude Pro / Claude Code.
- **Kishore:** Antigravity and OpenCode.

These are available sessions, not permanent jobs. Assign tasks by capability, permissions, context, independent verification, availability and quota.

## Important status
This repository is currently a planning and pre-production package, not a claim of completed game implementation. Story and engine choices remain proposals until approved and technically verified.
