# ECHO//CHAMBER — Local browser save specification

## Current state

The inspected `main` code has no `localStorage`, `sessionStorage`, IndexedDB, or save/load implementation. A page reload returns to the title and starts the opening sequence again. This is a feature to implement; it must not be described as already available.

## Recommended v1

Use one automatic save slot in `window.localStorage`.

- No account, sign-in, backend, database, or network request.
- Save only compact game state as JSON.
- Scope the key to this game and version, for example `echo-chamber:save:v1`.
- Offer **Continue** and **New Game** on the title screen when a valid save exists.
- Autosave at safe checkpoints and periodically while the player is freely exploring.
- Keep the latest stable checkpoint if the player closes the tab during a dialogue or cinematic.

`localStorage` is appropriate because this save is small and should survive reloads and browser restarts. It is origin-specific: a save made on localhost, Vercel, and itch.io is not automatically shared between those different origins. It also remains local to that browser profile/device; clearing site data or using a private session can remove it. There is no cross-device sync without a server/account.

## Save schema

```ts
export interface EchoSaveV1 {
  version: 1;
  savedAt: number;
  step: 'card' | 'lab' | 'core' | 'final';
  player: { x: number; y: number };
  flags: string[];
  recallN: number;
  qaAsked: string[];
  samples: Array<{
    x: number;
    y: number;
    tex: string;
    flip: boolean;
  }>;
}
```

Persist stable story flags, not transient visual/cinematic flags such as `l_*`. Keep the movement `samples` because the R-017 self-replay uses the player's earlier path. Cap samples at the existing gameplay limit. Validate the schema and numeric coordinates before restoring it.

## Safe save moments

1. After the wake sequence completes and the player receives control (`card`).
2. After entering the Observation Lab (`lab`).
3. After entering the Well/Core (`core`).
4. After continuity is restored and the self-replay finishes.
5. After reading the restoration log and reaching the final decision (`final`).
6. After durable discoveries: card collected, lab door opened, memory corroborated, core door opened, evidence/recordings flags updated, storm marked, continuity solved, log read.
7. During free movement, debounce position saves to approximately every 3–5 seconds; do not save while a modal, dialogue, or cinematic is active.

The game should save the last completed safe checkpoint, not an arbitrary half-finished interaction.

## Restore requirements

Restoring flags alone is not sufficient. Reapply derived world state before returning control:

- Set `locker` to its open texture when `lockerOpen` is present.
- Restore the floor plate/card state when `cardTaken` is present.
- Restore the lab reader, open door texture, and collision when `labOpen` is present.
- Restore photograph and ECHO visibility when `photoSeen` is present.
- Restore the storm dot when `marked` is present.
- Restore the core door texture and collision when `coreOpen` is present.
- Restore Well/reflection/Lethe glass state when `reflection` or `letheOpen` is present.
- Restore `step`, player position, camera follow, room ambience, recall meter, evidence UI, and the saved self-replay samples.
- Always load with ECHO inactive, all modals closed, and player input enabled.

Do not replay the opening cinematic or reset already-completed puzzles when Continue is selected.

## Title screen behaviour

- If there is no valid save: show **Wake up** / New Game.
- If a valid save exists: show **Continue** and **New Game**.
- New Game must ask before replacing an existing save.
- Provide a small **Erase local save** option in a settings/confirmation area, not a prominent gameplay button.
- If storage is unavailable or quota is exceeded, let the player continue playing and show a non-blocking warning that progress could not be saved.

## QA acceptance tests

- Complete the first interaction, reload, choose Continue, and verify that the player resumes in Cradle Bay with the locker/card state intact.
- Save after opening the lab; reload and verify the lab remains open and collision is correct.
- Save after corroborating the memory; reload and verify the key-slot evidence and Core keypad progression remain correct.
- Save after entering the Core; reload and verify the Well puzzle and recordings are available.
- Save after reading the log; reload and verify the final decision and Lethe state are available.
- Verify the R-017 self-replay still has the earlier player path after a reload.
- Verify New Game cleanly resets flags, inventory, position, and saved samples.
- Verify malformed/old save data does not crash the game.
- Verify reload on the actual itch.io hosted page, not only localhost.

## Later, optional portability

A small **Export save** / **Import save** JSON feature can let players move progress between browsers or devices without creating accounts. Do not add cloud sync or a backend for v1; the current project scope explicitly avoids online accounts and backend services.
