# Sprite Production 001 — Block 1 Handoff

## Delivered

- `CHAR-PLAYER-001` comparison concept sheet: `public/assets/characters/char-player-001-concepts-v1.png`.
- Recommended **A: high-collar graphite jumpsuit** — it retains the cleanest 12-pixel-wide silhouette, keeps the wrist device legible, and avoids the coat bulk of B and tactical visual noise of C.
- Native test spritesheet, 15 individual frames, JSON metadata, looping GIF, and 320×180 scene mockup.

This is a **concept-review gate**, not a character-canon decision. Do not begin the ghost variation or supporting characters until Abi approves a direction.

## Files and contract

| Artifact | Purpose |
|---|---|
| `char-player-001-test-spritesheet-v1.png` | 80×96 PNG: rows south/north/east; columns idle, walk-0..3. |
| `char-player-001-test-frames-v1/` | 15 transparent 16×32 individual PNG frames. |
| `char-player-001-test-metadata-v1.json` | Frame order, 8 FPS, loop, `(8,31)` pivot, and hardcoded-key mapping. |
| `char-player-001-test-preview-v1.gif` | Four-frame east walk preview. |
| `char-player-001-native-preview-v1.png` | 320×180 nearest-neighbour scene mockup for native-scale readability. |
| `scripts/generate-player-test-assets.mjs` | Original asset source; rerun to reproduce the test outputs. |

## Verification actually performed

- Parsed the written PNG headers: spritesheet is **80×96**, native preview is **320×180**.
- Decoded the generated GIF through .NET image loading: **64×128**, **4 time frames**; it also has a `GIF89a` header and trailer.
- Confirmed all **15** individual PNG frames were written.
- Visually inspected the spritesheet and native-resolution scene mockup after generation. The character maintains a single bottom baseline and uses hard, non-interpolated pixels.

## Source and rights

- The comparison sheet was generated using the built-in image-generation tool solely for non-shipping concept selection. It is retained as an iteration record, not a licence-cleared production sprite source.
- The test sheet, frames, GIF, preview, metadata, and generation script are original native-pixel work authored in this repository. No downloaded or third-party asset is included.
- LPC and AutoSprite are recorded as **HOLD** in the audit; nothing was imported from either.

## Next owner checklist

1. Obtain Abi's approval for a concept direction (recommended A or an explicit revision).
2. Promote the selected visual direction into a versioned production sheet; preserve this v1 test set.
3. Create `CHAR-ITERATION-GHOST-001` as a mechanically matching variation, then validate its key poses against the exact player frame anchors.
4. Assign a gameplay owner to add a file loader and replace hardcoded keys only after both art and collision review.

## Known limits

- The 320×180 preview is a static native-resolution art mockup, not a running Phaser integration; this respects the no-gameplay-code write boundary.
- The generated comparison sheet is more detailed than the 16×32 target and must not be directly downscaled into the game.
- No full animation library, ghost, Mira, Voss, drone, props, tiles, VFX, or environment assets are claimed as complete.
