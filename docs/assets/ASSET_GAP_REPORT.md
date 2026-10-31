# Asset Source & Fallback Report: Audio Pipeline

**Report Date:** 2026-10-31  
**Target:** ECHO//CHAMBER (v0.1.0)  
**Specification:** Priority resolution `assets/audio/` with fallback to `public/assets/audio/`.

---

## 1. Directory Structure & Fallback Strategy

The audio director implements a resilient multi-path loader (`AudioDirector.loadSample`):
1. Primary path: `assets/audio/<asset-name>`
2. Dedicated subdirectories:
   - `assets/audio/voice-overs/<asset-name>`
   - `assets/audio/sound-effects/<asset-name>`
3. Public fallback:
   - `public/assets/audio/<asset-name>`
   - `public/assets/audio/voice-overs/<asset-name>`

If an asset is missing across all candidate paths, the game logs a console warning (`[Audio] Asset missing from assets/audio: <filename>`) and gracefully falls back to WebAudio synthesis where applicable.

---

## 2. Ingested Voice Recordings & Iteration Whispers

All 7 priority voice lines are present in both `assets/audio/voice-overs/` and `public/assets/audio/`:

| Cue ID | Filename | Target Role / Scene | Status | Duration | Source |
|---|---|---|---|---|---|
| REC_01 | `vo-voss-rec01.ogg` | Voss Lab Desk Tape | IMPLEMENTED | 31.1s | Synced & Audited |
| REC_03 | `vo-mira-rec03.ogg` | Mira Quarters Recorder | IMPLEMENTED | 57.2s | Synced & Audited |
| REC_04 | `vo-voss-rec04.ogg` | Core Archive Console | IMPLEMENTED | 45.9s | Synced & Audited |
| REC_05 | `vo-mira-rec05.ogg` | Lethe Cascade Ending | IMPLEMENTED | 15.3s | Synced & Audited |
| VO_UNREG_01 | `vo-iter-open-01.ogg` | Cold Open Iteration Wake | IMPLEMENTED | 4.0s | Synced & Audited |
| VO_UNREG_02 | `vo-iter-locker.ogg` | Locker Memory Echo Whisper | IMPLEMENTED | 3.7s | Synced & Audited |
| VO_UNREG_03 | `vo-iter-no.ogg` | Core Door Ghost Warning | IMPLEMENTED | 1.1s | Synced & Audited |

---

## 3. Production SFX & BGM Assets (34 Cues)

All 34 production cues scouted and ingested from CC0 sources are available in both `assets/audio/` and `public/assets/audio/`:

- **SFX (19/19):**
  - `sfx-footstep-metal.ogg`
  - `sfx-card-pickup.ogg`
  - `sfx-door-locked.ogg`
  - `sfx-locker-open.ogg`
  - `sfx-contested-tick.ogg`
  - `sfx-memory-reveal.ogg`
  - `sfx-ghost-appear.ogg`
  - `sfx-ghost-disappear.ogg`
  - `sfx-echo-overload.ogg`
  - `sfx-puzzle-solved.ogg`
  - `sfx-tender-skitter.ogg`
  - `sfx-pod-pump.ogg`
  - `amb-storm-window-01.ogg`
  - `amb-vent-01.ogg`
  - `amb-relay-random-01.ogg`
  - `amb-sixteen-breaths-01.ogg`
  - `cine-lethe-cascade-01.ogg`
  - `cine-door-dim-01.ogg`
  - `cine-ending-transition-01.ogg`

- **BGM (11/11):**
  - `bgm-title-01.ogg`
  - `bgm-station-01.ogg`
  - `bgm-echo-01.ogg`
  - `bgm-tension-01.ogg`
  - `bgm-well-01.ogg`
  - `bgm-reveal-01.ogg`
  - `bgm-decision-01.ogg`
  - `bgm-end-hername-01.ogg`
  - `bgm-end-lethe-01.ogg`
  - `bgm-end-cycle-01.ogg`
  - `bgm-end-yourname-01.ogg`

- **P2 Backlog (4/4):**
  - `sfx-pause-resume.ogg`
  - `sfx-terminal-boot.ogg`
  - `amb-hull-creak-01.ogg`
  - `bgm-credits-01.ogg`

---

## 4. Verification

- `npm run build`: **PASSED** (TypeScript compile + Vite bundle 0 errors)
- `npm run plan:validate`: **PASSED** (All 29 plan criteria & manifests valid)
