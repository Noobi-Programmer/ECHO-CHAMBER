# Automated Asset Discovery & Ingestion Pipeline

## Objective

Build a dynamic web-asset scout system for images, pixel-art sprites, tilesets, SVGs, GIFs, sprite animations, fonts, sound effects, ambience and music. The system should discover and recommend assets—not blindly scrape sites or automatically import arbitrary downloads.

## End-to-end flow

1. **Request:** Create an asset task with type, use, mood, duration/dimensions, format, target folder, allowed licence classes and budget.
2. **Scout:** One or more browser/API-enabled agents search approved sources in parallel. They return 3–8 relevant candidates each.
3. **Deduplicate:** Compare title, creator, source URL and file checksum; avoid duplicate work.
4. **Licence audit:** An independent agent verifies exact item/pack licence, attribution requirements, commercial-use restrictions, modification rules, API terms and source provenance. Site-wide assumptions are not sufficient.
5. **Human gate:** Abi or delegated rights approver approves the candidate before download/import. No bypass for “free download”.
6. **Download to quarantine:** Use official download routes/API only. Store in `artifacts/asset-inbox/<task-id>/<asset-id>/` outside the shipped asset directory.
7. **Validate:** Check file signature/MIME, archive paths, decompression size, dimensions, frame count, SVG safety, audio codec/duration/sample rate and checksum.
8. **Register:** Add metadata and licence proof to `ASSET_REGISTER.csv`.
9. **Import:** Move approved assets to `public/assets/<category>/`; normalize names and formats without removing required attribution.
10. **Verify in game:** Check actual scale, palette, transparency, loop, audio level, file size, legibility and rendering.

## Candidate record required

Every suggestion must include title, creator, provider, exact item page URL, official download/API URL (not guessed), exact licence name, licence URL, API terms URL, attribution text, format, dimensions/duration, modification plan, proof screenshot/text, scout agent and confidence. Unknown licence = `HOLD`, not approved.

## Source discovery examples

- Pixabay official API for image/video discovery where API terms permit the intended request. Do not scrape the website or mass-download. Verify current API availability for requested media type; do not assume the image API covers audio/music.
- Freesound API for sound search and retrieval. API terms and individual sound licence are separate checks; review exact item licence and attribution.
- Kenney packs where a specific asset page states CC0; preserve evidence and any bundled notices.
- OpenGameArt and itch.io asset pages/packs: assess each pack's own licence and included third-party components.
- MyInstants: do not build a bulk-downloader/scraper or assume a clip is redistributable. Prefer official licensed sound libraries or record/create an original equivalent. A public play button is not a game-asset licence.

## Security and integrity

- Download only from approved official sources, no arbitrary redirects.
- Never execute downloaded content, scripts, installers or macros.
- Reject path traversal, symlinks escaping the quarantine folder and unexpected executables.
- Sanitize SVG; do not render untrusted embedded scripts/external references.
- Treat HTML/JS/archives from asset pages as untrusted.
- Limit file size, decompression ratio and media duration.
- Store API keys in environment variables; never commit keys.
- Do not circumvent captchas, paywalls, access controls or rate limits.

## Folder convention

`artifacts/asset-inbox/` (quarantine, gitignored) → `public/assets/{characters,environments,ui,vfx,audio,music,fonts}/` (approved only).

## Definition of done

No imported file without an asset-register row and licence evidence. A reviewer can reproduce the source page, identify the creator and understand permitted use. The asset works in the target runtime and does not cause a build or performance regression.
