# Research References & Verification Notes

Use official documentation and exact item licence pages. Re-check current versions and terms on the day of use.

## Agent skills / orchestration

- OpenCode skills documentation: https://opencode.ai/docs/skills/
- Anthropic Claude Code skills documentation: https://docs.anthropic.com/en/docs/claude-code/skills
- Antigravity documentation: https://antigravity.google/docs
- Codebuff skills documentation: https://www.codebuff.com/docs/skills
- GitHub worktrees: https://git-scm.com/docs/git-worktree
- GitHub pull requests: https://docs.github.com/en/pull-requests

Compatibility must be tested in the team's installed versions. The shared `.agents/skills/` convention is intended as a common source, with `.claude/skills/` mirror for Claude Code. Do not assume all tool versions load skills automatically or share runtime context.

## Engine research

- Phaser documentation: https://docs.phaser.io/
- Phaser examples: https://phaser.io/examples
- Godot web export documentation: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html

Validate latest releases and browser behaviour at implementation time.

## Asset discovery / rights

- Pixabay API: https://pixabay.com/api/docs/
- Pixabay Content License: https://pixabay.com/service/license-summary/
- Freesound API: https://freesound.org/docs/api/
- Freesound API terms: https://freesound.org/help/developers/
- Kenney licences: https://kenney.nl/support
- OpenGameArt licences: https://opengameart.org/content/faq
- itch.io terms: https://itch.io/docs/legal/terms
- MyInstants terms: https://www.myinstants.com/terms/

An API's permission is not the same as a licence to redistribute each individual file. Inspect the exact file/pack licence and store evidence before import. MyInstants is not an approved bulk-download target. Prefer original recordings or assets explicitly licensed for redistribution in a game.

## Research evidence policy

Every technical recommendation includes official source links, date checked, tool/version and a reproducible test. Every asset import includes exact item page, licence and attribution evidence. If current documentation cannot be reached, mark `UNVERIFIED` and do not invent support.
