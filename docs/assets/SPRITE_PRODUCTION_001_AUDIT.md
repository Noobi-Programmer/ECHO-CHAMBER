# Sprite Production 001 — Block 0 Audit

**Date:** 2026-10-31  
**Branch/worktree:** `agent/codex/sprite-production-001` at `C:\Users\abini\Projects\Codeday-sprite-production-001`  
**Runtime:** Codex Desktop / GPT-5.  
**Scope:** Block 0–1 only; no gameplay, collision, story, or Phaser-version change.

## Actual implementation

| Area | Confirmed state |
|---|---|
| Engine | Phaser 3.90.0, TypeScript, Vite; no imported production images were present before this block. |
| Render space | 320×180 internal resolution, nearest-neighbour `pixelArt` rendering, 16×16 tiles. |
| World | `44 × 35 × 16 px` = **704×560 px**, with Cradle Bay, Observation Lab, and the Well/Core. |
| Current art | `src/art/textures.ts` draws all room, prop, VFX, and character placeholder textures on canvases at boot. |
| Current player | `p_down_*`, `p_up_*`, and `p_side_*` are 12×16, two-frame, code-generated sprites — not the manifest's 16×32 production target. |
| Asset folders | `public/assets/` did not exist before this block. This block creates only `public/assets/characters/`; no asset is wired into the game. |

The source-of-truth inventory remains `VISUAL_ASSET_MANIFEST.csv` (70 rows) and `ANIMATION_MANIFEST.csv` (24 rows); this audit deliberately does not duplicate their inventory. The Block 1 deliverable addresses only `CHAR-PLAYER-001` and its six player animation records.

## Integration contract

The test sheet uses transparent 16×32 frames, 5 columns by 3 rows (80×96), and an `(8, 31)` bottom-centre pivot. Its mapping for a future integration pass is:

| Existing texture key | Test source |
|---|---|
| `p_down_0`, `p_down_1` | `char-player-001-test-spritesheet-v1.png`, south row, idle / walk-0 |
| `p_up_0`, `p_up_1` | same sheet, north row, idle / walk-0 |
| `p_side_0`, `p_side_1` | same sheet, east row, idle / walk-0; west mirrors east |

No texture keys, scene code, map, collisions, or story text were changed.

## Research and source decisions

| Candidate | What was verified | Decision |
|---|---|---|
| Universal LPC Generator | Browser UI exposes PNG sheet, credits TXT/CSV, split-animation/frame ZIP, JSON export, walk/idle previews, and attribution. Its visible default components mix OGA-BY 3.0, CC-BY-SA 3.0, and GPL 3.0. | **HOLD.** It is an isometric/modular baseline and not a safe import without a selected-component licence ledger and compatibility decision. No asset was downloaded. |
| AutoSprite | Official site documents directional/isometric animation, PNG sheet + atlas + individual-frame export, FPS/loop controls, Phaser workflow, and an MCP option. Its terms state the user owns outputs only subject to third-party rights and disclaim non-infringement. | **HOLD for production.** Potential animation workflow after account/tool/rights approval; no account, upload, prompt, or download was used. |
| Built-in image generation | Used once for a non-shipping comparison concept sheet; no third-party source image or style reference was supplied. | **Concept-only.** It informed the recommendation but is not the native sprite source. |
| Native pixel script | `scripts/generate-player-test-assets.mjs` creates the test sheet and previews from authored geometry and palette. | **Original / usable for review.** Requires character-design approval before integration. |

Official evidence: [LPC Generator](https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/), [LPC attribution notes](https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator/blob/master/README.md), [AutoSprite workflow](https://www.autosprite.io/), and [AutoSprite Terms](https://www.autosprite.io/terms).

## Findings and inconsistencies

1. The requested 704×560 map and 16×16 tile constraints match `src/world/map.ts` exactly.
2. The manifest's 16×32 player target conflicts with the live 12×16 placeholder; the test asset resolves the design target but intentionally leaves the live placeholder untouched.
3. The manifest assigns file paths, but no loader consumes them yet. A future gameplay-owned loader task is needed; this task must not rewrite hardcoded texture references.
4. Several manifest VFX/UI records designate DOM/code effects, not bitmap production assets. They should remain code-driven until an explicit visual pass says otherwise.
