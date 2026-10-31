---
name: asset-ingestion
description: Safely validate and import approved third-party assets into a game project.
---

# Asset Ingestion

Only ingest assets with a recorded approval and licence proof. Download via the official route to quarantine. Verify file signature and MIME; enforce size/duration/decompression limits; inspect archives for path traversal; sanitize SVG and reject scripts/external references; validate image dimensions/frames and audio codec/duration. Compute SHA-256, add ASSET_REGISTER.csv row, preserve attribution notices and move approved files into the requested public/assets folder. Never execute downloaded files.
