# Design

## Context

See `proposal.md` for the why. The current state is a single scene (`ClimbScene`) that contains everything: player, pool, HUD, `TiltSource`, `InputRouter`, plus the states `idle | playing | gameover`. Calibration is implicit in `startRun()` and the permission is requested on the first touch during the run. The menu must read the same sensor and fix the same zero that the run then uses: this is the constraint that decides the architecture, more than graphics does.

## Goals / Non-Goals

**Goals:**

- a single `TiltSource` and a single zero for the whole session: menu and run read the same thing;
- menu and run as separate units, with free reset when moving from one scene to the other;
- touchable commands that work on a phone and with the mouse, without UI libraries.

**Non-Goals:**

- pause and return to the menu from a run in progress;
- persistence across sessions, settings, new screens;
- restyling of the game HUD or changes to the physics.

## Decisions

### 1. Two Excalibur scenes, not two states in the same scene

`MenuScene` and `ClimbScene` are separate scenes registered on the engine (`engine.add('menu', …)`, `engine.add('climb', …)`), and the initial scene becomes `menu`.

Rejected alternative: adding a `menu` state to the existing `ClimbScene`. It would cost zero new files but every `onPreUpdate` would have to start with a state guard, the pool would have to be torn down by hand and the menu would inherit camera, colliders and HUD of the run — that is, exactly the entropy we want to avoid.

### 2. `TiltSource` leaves the scene and becomes session state

New module `src/game/session.ts` that exposes a single shared instance of `TiltSource` and the two summary numbers (`lastScore`, `bestScore`). The scenes receive the instance, they do not create it.

It is the central decision: calibration is a property of the **session**, not of the run. If each scene created its own `TiltSource`, the zero pressed in the menu would be lost on the scene change, which is precisely the bug this change must close.

The initial zero (no explicit calibration yet) is fixed at the first sensor event that arrives while the menu is visible: `TiltSource.axis()` already does this when `zero === null`, so no new code is needed, only not calling `calibrate()` at the start of the run.

### 3. Buttons as a local component

`src/ui/button.ts`: a `ScreenElement` with an `ex.Rectangle` background and `ex.Text` above it, which listens to the actor's pointer events (`pointerdown`, `pointerup`, `pointerenter`, `pointerleave`) and changes color to give feedback. No additional UI dependency.

Rejected alternative: intercepting touches at engine level and hit-testing the rectangles. It would be the same thing written worse: Excalibur already exposes per-actor pointer events, with the graphic bounds as the sensitive area.

A disabled button simply does not subscribe to the events, and its appearance changes: no "disabled but clickable" state.

### 4. Calibration: explicit command, concrete confirmation

**Calibrate** calls `tilt.calibrate()` (zero = current gamma, smoothing reset) and shows `Calibrated ✓` for 1.2 seconds, plus a flash of the button. If `tilt.currentStatus === 'unavailable'`, the button shows `Sensor unavailable` instead and does not fake a confirmation.

**Start game** does not touch the zero. If the user has never calibrated, the zero fixed at menu open applies (decision 2), which is the behavior declared in the spec.

### 5. Permission requested in the menu, only once

The first of the two buttons pressed calls `requestSensorPermission()` inside the gesture and subscribes `tilt.listen()`. The outcome goes into `tilt` and into a session flag (`sensorPromptDone`), so no scene asks twice. If the outcome is negative, the menu shows the warning and `Start game` stays active: the keyboard/drag fallback is already implemented and requires no changes.

### 6. Return to the menu after death

In `ClimbScene.endRun()`: `session.lastScore = score`, `session.bestScore = max(bestScore, score)`, then `engine.goToScene('menu')` after 500 ms (`setTimeout`) — the pause is there to let the collision be read instead of teleporting the user. A `leaving` flag prevents double scene changes if a second collision event arrives.

The `setTimeout` is saved and cleared in `onDeactivate`, so a reactivated scene does not carry around a scene change pending from the previous run.

### 7. Menu layout

Coordinates in screen space, with `screen.contentArea` as the reference instead of the canvas corners, so notch and rounded corners do not eat the buttons. Sizes in `constants.ts` (`BUTTON_WIDTH = 420`, `BUTTON_HEIGHT = 96`, gap 24) expressed in the logical resolution 720×1280, not in screen pixels.

Vertical structure: title at the top, calibration block in the center (large value + bar), the two buttons at the bottom, sensor warning above the buttons.

## Risks / Trade-offs

- **Double sensor listener** (menu and run both calling `listen()`) → `listen()` is idempotent and the state lives in the singleton: the subscription happens once per session.
- **Touch on a button that "leaks" to the game** → the buttons exist only in the menu scene, and the scene has no global pointer handlers; the first pointerdown that starts the run is consumed by the scene change.
- **Double tap on Start starting two runs** → the scene change is idempotent and the game scene resets in `onActivate`, not in the constructor.
- **Text that overflows on narrow screens** → all sizes are in logical units 720×1280 and the text has `maxWidth`; if needed, the font size is reduced instead of moving the buttons.
- **`setTimeout` surviving the scene** → handled with `clearTimeout` in `onDeactivate` (decision 6); without this, dying twice in quick succession would produce two scene changes.
- **"Dirty" zero between menu and run** → explicit calibration is the only way to change the zero; if the user calibrates and then changes hold during the run, it drifts as before, and that is the expected behavior.

## Migration Plan

No data to migrate (no persistence). Behavior change declared BREAKING: the single-touch boot and restart disappear. The rollback is the revert of the apply commit: the previous change is archived and its specs are in `openspec/specs/`, so the previous state is reconstructable.
