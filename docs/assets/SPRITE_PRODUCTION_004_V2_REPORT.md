# VALIDATION_REPORT.md

## Results

All eight final atlases are emitted as transparent RGBA PNGs at the requested native dimensions. Frames were cropped from preserved generated source sheets, fitted individually with nearest-neighbour resampling, and assembled without resizing any completed sheet.

| Asset | Dimensions | Frames | Dimensions | Count | RGBA | Bounds | Baseline | Frame PNGs | Result |
|---|---:|---:|---|---|---|---|---|---|---|
| player | 80×128 | 20 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| actions | 96×160 | 17 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| ghost | 80×128 | 20 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| kneel | 128×32 | 8 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| mira | 80×64 | 10 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| mira-cane | 80×32 | 5 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| voss | 80×64 | 10 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| tender | 64×32 | 8 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

## Alignment and atlas layout

- Humanoid frames are placed so the non-transparent content ends at y=31; Tender frames end at y=15.
- Player and ghost use 5×4 atlases: rows S/N/E/W, columns idle + four walk frames.
- Player actions use a 6×5 atlas with 17 populated frames in the requested sequence groups; unused cells remain transparent.
- Iteration kneel uses 8×1; Mira and Voss use 5×2; Mira-cane uses 5×1; Tender uses 4×2.
- Each individual frame PNG is cell-sized and checked for non-overflow.

## Visual and provenance notes

- The Concept-C character concept was viewed from the supplied reference. The generated sprites approximate its graphite/steel clothing, bun silhouette, asymmetrical slate panel, cyan wrist device, and amber hardware; they are not pixel-for-pixel crops of the concept image.
- The source concept and existing repository character/previews assets could not be materialized from the remote repo in this runtime, so exact pixel-level preservation against the reference was not verifiable. Original generated sprite-sheet sources used for this V2 package are preserved unmodified under `source_generations/`.
- The `write_dont_answer` frame represents the writing gesture; literal lettering is intentionally omitted from the sprite pixels to preserve the no-text sprite-sheet requirement.
- Mira/Voss 5th column is treated as a three-quarter pose to fill the requested 5-column grids. Mira-cane 5th frame is a faceless memory variant.

## Defects

None in structural validation.
Visual fidelity remains an approximation to Concept C pending direct pixel-level comparison with the original repository source.
