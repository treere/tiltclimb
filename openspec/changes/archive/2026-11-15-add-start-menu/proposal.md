# Proposal

## Why

Today the run starts on the first touch and calibration happens silently: whoever holds the phone tilted discovers that the character slides sideways only after they have already lost, and has no way to understand whether the problem is the sensor, the permission or the setup. A screen is needed that shows the sensor before playing, allows fixing the zero and gives a sensible return point after death, instead of restarting everything with a blind touch.

## What Changes

- New initial menu, first state of the app: title, **live** reading of the calibration (relative tilt in degrees and a bar that moves as you tilt the phone), buttons **Calibrate** and **Start game**.
- **Calibrate** fixes the zero at the current tilt and shows a visible confirmation, so it is clear that it was applied.
- The **sensor permission** is requested by the menu, inside the touch that starts the action, no longer on the first touch during the run.
- If the permission is denied or the accelerometer is missing, the menu shows a **clear warning** and leaves **Start** enabled: you play with the keyboard/drag fallback.
- At the end of the run you return to the menu, which shows the **score just made** and the **session best**.
- **BREAKING** (behavior): the "touch to start" boot and the "touch to retry" restart disappear; the cycle becomes menu → run → menu.
- Out of scope: pause during a run and return to the menu from there, best score persistence across sessions, settings (difficulty, audio, sensitivity), new screens beyond menu and run, graphics and audio, changes to the game physics, tuning of the steering constants.

## Capabilities

### New Capabilities

- `ui/start-menu`: start screen with visible sensor calibration, calibration command, run start, warning when the sensors are unavailable and summary of the result on return from the run.

### Modified Capabilities

- `input/tilt-control`: the zero calibration and the permission request move from the first touch during the run to the menu; the run start no longer recalibrates implicitly.
- `gameplay/endless-climb`: the end of the run no longer restarts with a touch but returns to the menu, and the game state gains the initial menu state.

## Impact

- Code: new menu scene (`src/game/menu-scene.ts`), `src/game/climb-scene.ts` reduced to the game only, shared session state (score just made, best), `src/main.ts` for the initial scene, `src/game/constants.ts` for button colors and sizes.
- Dependencies: none new. The buttons are `ScreenElement` + `Rectangle`/`Text` already used for the HUD.
- Manual test: path menu → calibrate → start → die → menu, from a phone via HTTPS tunnel (the sensors require a secure context).
