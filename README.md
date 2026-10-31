# ECHO//CHAMBER — Full Production & Agent Plan

> **A memory can be evidence. It can also be a lie.**

A GitHub-ready planning pack for a short, cinematic 2D pixel-art psychological sci-fi thriller. This pack separates **the player-experience/story workshop** from **technical and agent-system research**, so several contributors can work in parallel without silently changing the story or colliding in the same files.

## Start here

1. Read [`START_HERE.md`](START_HERE.md).
2. Every agent must follow [`AGENT_SYNC.md`](AGENT_SYNC.md) before claiming or editing a task.
3. The story team works from [`STORY_WORKSHOP.md`](STORY_WORKSHOP.md), [`STORY_BIBLE.md`](STORY_BIBLE.md) and [`EXPERIENCE_BLUEPRINT.md`](EXPERIENCE_BLUEPRINT.md).
4. The technical team works from [`TECHNICAL_RESEARCH_PLAN.md`](TECHNICAL_RESEARCH_PLAN.md), [`ARCHITECTURE_PROPOSAL.md`](ARCHITECTURE_PROPOSAL.md) and [`AGENT_SYSTEM_PLAN.md`](AGENT_SYSTEM_PLAN.md).
5. See [`TEAM_DISPATCH.md`](TEAM_DISPATCH.md) for the first parallel work batch.
6. Skills live canonically in `.agents/skills/`. Use `scripts/sync-skills.mjs` to mirror them into `.claude/skills/` for Claude Code.
7. The human project lead approves story canon, scope changes and production decisions.

## Important status

This is a **planning and pre-production package**, not a completed game implementation. Engine choices and story beats are proposals until verified or approved. It deliberately does not claim that any assets have been downloaded, licences audited, code implemented or browser tests passed.

## Team and tool availability (user-provided; re-confirm at session start)

- **Abi:** OpenCode + Antigravity Pro (Gemini model configured by user) + OmniRush (user-reported 10M allowance).
- **Arpita:** Claude Pro / Claude Code.
- **Kishore:** Antigravity + OpenCode.

People and tool seats are known; task roles are **dynamic**. No contributor is permanently the writer, coder, artist or QA person. Route tasks using capability, model fit, context, permissions, remaining quota, availability and independent-verification value.

## Proposed first milestone

Before committing to full implementation, produce an approved story and a proven vertical-slice architecture. The first playable slice should include movement, collision, one room, one interactable clue and a working ECHO past-state reveal.
