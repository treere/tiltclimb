# Tasks

## 1. Shared session and two scenes

- [x] 1.1 Create `src/game/session.ts` with the unique instance of `TiltSource`, `lastScore`, `bestScore` and `sensorPromptDone`, and import it in the scenes; check: `npm run check` green and no second instance of `TiltSource` in the code (grep)
- [x] 1.2 Remove `TiltSource` from `ClimbScene` and receive it from the session module; check: the run still plays and the steering responds
- [x] 1.3 Register `MenuScene` and `ClimbScene` on the engine and make `menu` the initial scene (empty menu skeleton with only a title); check: on open the menu appears and not the run
- [x] 1.4 Move into `ClimbScene`'s `onActivate` the reset of state, pool and positions, and clear the pending timers in `onDeactivate`; check: entering and leaving the scene twice the run always restarts clean

## 2. Button component

- [x] 2.1 Create `src/ui/button.ts` with a `Rectangle` background, `Text` label, actor pointer events and normal/pressed/disabled states; check: `npm run check` green and types without `any`
- [x] 2.2 Add to the button the API `setEnabled`, `setLabel` and the `onPress` callback; check: a disabled button does not invoke `onPress` on touch (manual test from a phone)

## 3. Menu: layout and live reading

- [x] 3.1 Compose the menu layout (title, calibration block, buttons at the bottom) using `screen.contentArea` as the reference; check: nothing is clipped by notch or corners on a phone
- [x] 3.2 Show the live reading of the relative tilt in degrees, updated every frame by the session `TiltSource`; check: tilting the phone the number changes with the expected sign and stays still with the phone still
- [x] 3.3 Add the horizontal bar that represents the same tilt; check: the bar moves in the same direction as the number and saturates at the extremes

## 4. Calibration with confirmation

- [x] 4.1 Wire **Calibrate** to `tilt.calibrate()` with a visible `Calibrated ✓` confirmation for 1.2 s and a button flash; check: after pressing, the reading goes back to zero in the held position
- [x] 4.2 Handle the sensor-unavailable case: the button shows `Sensor unavailable` and produces no confirmation; check: with the sensor denied the menu does not show the calibration successful message
- [x] 4.3 Check that **Start game** does not recalibrate: start the run after tilting the phone and check that the zero stays the menu's one; check: the player does not drift at the start of the run

## 5. Permissions and warning in the menu

- [x] 5.1 Request the permission on the first of the two buttons pressed, recording the outcome in the session and subscribing `listen()` only once; check: the request appears once and is not repeated during the run
- [x] 5.2 Show the warning in the menu when the permission is denied, the sensor is missing or no data arrives; check: denying the permission the warning appears and **Start game** stays active
- [x] 5.3 Hide the warning when the sensor data becomes available again; check: after granting the permission the warning disappears without reloading the page

## 6. Return to the menu at the end of the run

- [x] 6.1 In `ClimbScene.endRun()` write `lastScore` and update `bestScore` in the session, then return to `menu` after 500 ms; check: dying returns to the menu and the score shown is the one of the run just ended
- [x] 6.2 Prevent double scene changes with a flag and clear the timer in `onDeactivate`; check: two close collisions produce a single return to the menu
- [x] 6.3 Show in the menu the score just made and the session best, updating the best only if beaten; check: a run of 10 points after one of 40 leaves the best at 40

## 7. Final check

- [x] 7.1 Full round on a phone via HTTPS tunnel: menu → calibrate → start → die → menu with summary → start again; check: no stuck state and no console errors
- [x] 7.2 Fallback test: permission denied, warning visible, run playable with drag; check: the game stays controllable without a sensor
- [x] 7.3 Update `README.md` (menu, calibration, summary) and run `npm run check`; check: green command and documentation consistent with the behavior

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
