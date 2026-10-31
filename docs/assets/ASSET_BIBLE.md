# ASSET_BIBLE — index and rules

**Status:** Block 1 complete (inventories). Blocks 2-5 not started (see `AGENT_HANDOFF.md`).
**Do not confuse planned with created.** `public/` is empty; every current visual and sound is generated in code. `status` columns say which.

## Priority definitions
| Priority | Meaning | Ask of the owner |
|---|---|---|
| **P0** | Needed by the playable build **today**: every sprite/cue the game already uses. | Replace the code-generated placeholder with a file **only if it is clearly better**; the game already works without it. |
| **P1** | Cinematic polish that noticeably improves the experience. | Produce after P0 is stable. |
| **P2** | Future production. | Backlog only. |

## Owners
- **OmniRush**: sprites, spritesheets, tiles, props, VFX frames.
- **Neel (+ agents)**: music, ambience, SFX, voice.
- **Abi+Claude**: UI components, code-driven VFX, integration.

## Counts (from the manifests)
| File | Rows | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| `VISUAL_ASSET_MANIFEST.csv` | 70 | 53 | 14 | 3 |
| `ANIMATION_MANIFEST.csv` | 24 | 10 | 14 | 0 |
| `AUDIO_MANIFEST.csv` | 60 | 26 | 30 | 4 |
| `VOICE_RECORDING_MANIFEST.csv` | 19 | 0 | 17 | 2 |

Most P0 visual/audio rows are **already implemented as placeholders** (status `IMPLEMENTED-PLACEHOLDER`). The genuinely **missing** P0 work is small; see `ASSET_GAP_REPORT.md` (Block 5).

## The three things that matter most today
1. **`CHAR-PLAYER-001`**: replace the chibi protagonist with the approved adult design (3 concepts first). Frame 16x32, feet on the bottom row, same 3 directions + mirror; collision unchanged.
2. **Audio**: a better ambience bed and ECHO on/off are the biggest audio wins. Footsteps do not exist yet.
3. **Voice** is optional and every line is `PENDING-STORY-APPROVAL`. The game ships text-only and is complete without it.

## Naming
Provisional ID scheme `AREA-NAME-NNN`, e.g. `CHAR-PLAYER-001`, `PROP-MIRA-MUG-001`, `ANIM-PLAYER-WALK-SOUTH`, `SFX-ECHO-ACTIVATE`, `MUS-MOTIF-FIRST`, `VO-ORPHEUS-NAME-Q`. Block 2 finalises it and defines the manifest loader. The `current_game_key` column maps each ID to today's hardcoded key so the game team can migrate.

## Files
`VISUAL_ASSET_MANIFEST.csv` · `ANIMATION_MANIFEST.csv` · `AUDIO_MANIFEST.csv` · `VOICE_RECORDING_MANIFEST.csv` · `CINEMATIC_CUE_SHEET.md` · `AGENT_HANDOFF.md`
