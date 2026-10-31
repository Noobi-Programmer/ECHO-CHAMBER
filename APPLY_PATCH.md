# Apply this skill auto-discovery patch

This patch updates the repository's agent instructions so agents inspect and use skills according to their actual runtime, and safely expand the project's skills when a task requires a missing capability.

## Files to replace
- `AGENTS.md`
- `CLAUDE.md`
- `AGENT_SYNC.md`
- `AGENT_PROMPTS.md`
- `SKILLS_PLAN.md`
- `README.md`
- `scripts/sync-skills.mjs`

## Files to add
- `SKILL_DISCOVERY.md`
- `scripts/check-agent-skills.mjs`

## Optional package scripts
Merge `package-plan-scripts.json` entries into the existing project `package.json` manually. Do not replace the existing `package.json`.

## Apply with Git

Copy the patch contents into the matching repository paths, then:

```bash
git switch -c chore/agent-native-skill-discovery
git add AGENTS.md CLAUDE.md AGENT_SYNC.md AGENT_PROMPTS.md SKILLS_PLAN.md README.md SKILL_DISCOVERY.md scripts/sync-skills.mjs scripts/check-agent-skills.mjs
git commit -m "chore: add runtime-aware automatic skill discovery"
git push -u origin chore/agent-native-skill-discovery
```

Open a PR and review it before merging.

## After applying

```bash
node scripts/sync-skills.mjs
node scripts/check-agent-skills.mjs
```

Then restart Claude Code or the OmniRush/OpenCode workspace engine if newly added skills do not appear in the current cached session.
