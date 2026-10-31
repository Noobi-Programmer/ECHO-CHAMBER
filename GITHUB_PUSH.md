# Push This Plan to GitHub

This archive is designed to be extracted into the root of `Noobi-Programmer/ECHO-CHAMBER`. It is a planning pack and deliberately does not overwrite `src/`, `public/`, your current package manager lockfile or existing game implementation.

## Option A — clean new branch (recommended)

```bash
git clone https://github.com/Noobi-Programmer/ECHO-CHAMBER.git
cd ECHO-CHAMBER
git switch -c docs/story-first-agent-plan
```

Extract the archive into the repository root. Review all changes before staging:

```bash
git status --short
git diff --stat
git diff -- AGENT_SYNC.md AGENT_STATUS.md IDEA.md
```

If existing files conflict, compare rather than blindly overwrite. This pack may replace planning documents; preserve any newer human-approved content. Then:

```bash
git add README.md START_HERE.md PROJECT_CHARTER.md IDEA.md STORY_WORKSHOP.md STORY_BIBLE.md EXPERIENCE_BLUEPRINT.md NARRATIVE_SCRIPT_DRAFT.md STORY_DECISIONS.md STORY_REVIEW_RUBRIC.md TECHNICAL_RESEARCH_PLAN.md ARCHITECTURE_PROPOSAL.md IMPLEMENTATION_ROADMAP.md AGENT_SYSTEM_PLAN.md AGENT_SYNC.md AGENT_STATUS.md AGENT_ROUTER.md SKILLS_PLAN.md ASSET_PIPELINE.md ASSET_REGISTER.csv ASSET_SOURCES.md QA_PLAN.md GITHUB_WORKFLOW.md AGENTS.md CLAUDE.md AGENT_PROMPTS.md DECISION_LOG.md SOURCES_AND_RESEARCH.md research .agents .claude scripts

git commit -m "docs: add story-first production and dynamic agent plan"
git push -u origin docs/story-first-agent-plan
```

Open a PR and review carefully before merging. Do not commit private conversation exports, API keys, downloaded assets without licences, local caches or `.env` files.

## Option B — if this repository already has concurrent work

Do not merge this pack directly into main. Create a branch from latest main, ask the integration captain to compare conflicts, then merge the docs in small groups. Keep a single writer for `AGENT_STATUS.md`.

## After merge

1. Reopen/reload agent sessions so they discover the shared skills.
2. Run `node scripts/sync-skills.mjs` (or `bun scripts/sync-skills.mjs`) to mirror canonical skills to Claude Code.
3. Run `node scripts/validate-plan.mjs` to validate required files and skill frontmatter.
4. Ask each session to perform the universal startup handshake.
5. Dispatch Track A and Track B tasks from `AGENT_STATUS.md`.
