# ECHO//CHAMBER — Iteration 017

> **A memory can be evidence. It can also be a lie.**

A short, browser-first psychological sci-fi thriller about memory, identity, and the choices that make a person.

You wake aboard **Asphodel**, an isolated research station orbiting an ice giant. The station's caretaker, ORPHEUS, asks you to help restore its incomplete records. But the rooms remember things the station's logs do not—and those memories do not always agree.

Use **ECHO** to reveal fragments of the past, compare them with the physical evidence in front of you, and discover why someone has been leaving clues for the next person to wake.

## The experience

- Explore three connected spaces: Cradle Bay, the Observation Lab, and the Well.
- Hold ECHO to reveal authored memories layered over the present.
- Investigate objects, recordings, terminals, and conflicting accounts.
- Corroborate memories using evidence in the physical world.
- Solve environmental puzzles, reconstruct a sequence of events, and make a final choice.
- Follow a compact, atmospheric story designed around discovery rather than combat or jump scares.

## Controls

| Key | Action |
|---|---|
| `W A S D` / Arrow keys | Move |
| `Shift` | Run |
| `E` / `Space` | Inspect, interact, or continue dialogue |
| Hold `Q` | Activate ECHO and reveal the past |
| `Tab` | Open inventory / evidence |
| `?` | Show keyboard shortcuts |
| `M` | Mute / unmute audio |
| `Esc` | Close an interface / pause where supported |

Headphones recommended. The current title screen estimates a 6–8 minute playthrough; exploration and reading pace may change that.

## Play in the browser

The project is built as a static web game with Phaser 3, TypeScript, and Vite. Once a browser build is published, it is intended to run directly on itch.io without a separate download.

**Current publication status:** in development. This repository is not yet a claim that a final public release has been shipped.

## Run locally

Requirements: Node.js and a package manager.

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Type-check and create a production build
npm run build

# Preview the production build locally
npm run preview
```

Useful repository checks:

```bash
npm run plan:validate
npm run skills:check
```

`npm run test:e2e` runs the Playwright playthrough script; Playwright and its browser need to be available in the development environment.

The production build is written to `dist/`. For an itch.io HTML build, ZIP the **contents** of `dist/` so `index.html` is at the root of the ZIP—not inside an extra `dist/` folder.

## Progress and saves

**Browser-local saving is not implemented in the inspected build.** Reloading the page currently starts the experience again. There is no account system, cloud save, or cross-device synchronisation.

The recommended first save implementation is a single automatic save slot in the browser's `localStorage`. It should preserve story flags, the current safe checkpoint, player position, recall/evidence state, and the movement samples needed for the self-replay. A Continue / New Game choice can then be shown on the title screen. This requires no backend or player account; saves remain local to that browser profile and device.

## Technical overview

- **Engine:** Phaser 3.90
- **Language:** TypeScript
- **Build tool:** Vite 8
- **Rendering:** 320 × 180 internal resolution, scaled to a 16:9 game stage with pixel-art rendering
- **Architecture:** one primary Station scene, DOM-based interface overlays, and an audio director with sample playback and procedural fallbacks
- **Backend:** none required for the current game

The game currently creates its main runtime textures through `generateTextures()` in `src/art/textures.ts`. The repository also contains separate illustration, character, audio, and voice-over asset directories; check the manifests and actual scene references before assuming every staged asset is already used in gameplay.

## Project structure

```text
src/
  main.ts                 # Phaser bootstrap
  art/textures.ts         # Runtime texture generation
  data/story.ts           # Dialogue, recordings, puzzle fragments and endings
  scenes/StationScene.ts  # Exploration, ECHO, interactions and story flow
  systems/audio.ts        # Audio director
  systems/ui.ts           # Dialogue, terminals, keypad and interface overlays
  style.css               # Game and UI styling
  world/                  # Map, rooms and coordinates
public/assets/            # Static assets served by Vite
assets/                   # Staged source audio and voice-over material
docs/                     # Design, narrative, coordination and asset documentation
tests/                    # Browser playthrough test
```

## Development notes

- The narrative and story bible are marked provisional in the project documentation; story changes should follow the approval process documented in `docs/coordination/AGENT_SYNC.md`.
- The inspection-illustration bundle is catalogued in `docs/assets/ILLUSTRATION_MANIFEST.csv`.
- Voice-over source files are staged separately. The inspected runtime audio code does not yet demonstrate that those MP3 voice files are played in-game, so this README does not describe the current build as fully voice acted.
- The game is designed around keyboard controls and desktop browser play. Mobile support has not been established.

## Credits

Created for CodeDay Bengaluru 2026. Built by the ECHO//CHAMBER team.

Repository: <https://github.com/Noobi-Programmer/ECHO-CHAMBER>
