# Tasks

## 1. The run starts unpaused (regression first)

- [x] 1.1 Create the pause UI hidden by default: `graphics.isVisible = false` on the plate, the `PAUSED` text and the `RESUME` button right after creating them; check: start a run and confirm no overlay covers the play area and the ship climbs within a second
- [x] 1.2 Put the three visibility writes behind a single `applyPauseVisibility(visible)` used by every state change; check: `npm run check` green and no other line in the scene sets `isVisible` on those three elements

## 2. Pause control

- [x] 2.1 Add `src/ui/pause-toggle.ts`: round control, 96 px touch area, hand-drawn pause bars that become a play triangle when paused, `pointerup` callback; check: screenshot in both states shows a centred icon inside the circle
- [x] 2.2 Place it in the top right of the run, 56 px from the safe area, above the HUD; check: on a 360 px wide screen it does not overlap the score or the fire button, verified by screenshot

## 3. Frozen state

- [x] 3.1 Return early from `onPreUpdate` while paused and implement `freeze()` / `thaw()` that zero and restore the velocities of the player, active projectiles and active enemies; check: browser test sampling the ship position over 30 frames while paused — same value before and after — and moving again after resume
- [x] 3.2 Verify nothing dies and nothing grows while paused: no score change, no spawns, `resolveHits` not evaluated; check: browser test with an asteroid overlapping the ship while paused, run still alive
- [x] 3.3 Block firing while paused; check: browser test pressing the fire button in pause and counting projectiles before and after

## 4. Overlay and resume

- [x] 4.1 Add the plate, the `PAUSED` text and the `RESUME` button above the HUD, all hidden at start, all toggled by the single visibility helper; check: screenshot of a paused run shows the cover, the word and the button, with the world still visible underneath
- [x] 4.2 Resume from the overlay, the button and the corner control, and switch the corner icon accordingly; check: browser test toggling twice returns to `paused = false` and the world moves again

## 5. Hidden page

- [x] 5.1 Add the `visibilitychange` listener in `onActivate` and remove it in `onDeactivate`; check: browser test that hides the page mid-run, confirms the run pauses, comes back and confirms it is still paused, then leaves to the menu and back and confirms no double handling
- [x] 5.2 Never resume on return; check: the same test asserts `paused` stays true after the page becomes visible

## 6. Docs and device check

- [x] 6.1 Update `README.md` with the pause behaviour; check: `npm run check` green
- [x] 6.2 Play on the phone: pause, resume, take a call mid-run, come back; check: judgement by hand, no run lost
- [x] 6.3 Confirm the very first run after a hard reload starts unpaused; check: hand check on the phone, since this is exactly what failed the first time

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec delta
