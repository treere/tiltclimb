# Tasks

## 1. Progressive speed

- [x] 1.1 Create `src/game/speed.ts` with `climbSpeedAt(heightPx)`, start 190, cap 320; check: 5 numeric checks in Node (start, growth, cap, negative heights, monotonicity)
- [x] 1.2 Replace the constant with the current speed in `climb-scene.ts`, `player.ts`, `starfield.ts` and `enemy.ts` (relative descent); check: `npm run check` green and no leftover import of `CLIMB_SPEED` outside `speed.ts`
- [x] 1.3 Check that the distance between obstacles stays 260 px of climb even in a fast run; check: obstacle count per 1,000 px constant at the start and at the end of the ramp
- [x] 1.4 Check by eye, in headless, that parallax and enemies accelerate together without jumps; check: two screenshots 10 s apart at different speeds and no "hanging" element

## 2. Sensitivity

- [x] 2.1 Create `src/input/tilt-settings.ts` with the five levels, default 16°, error-tolerant read and write; check: Node test on clamp, default without storage and save round-trip
- [x] 2.2 Make sensitivity a mutable property of `TiltSource`, with dead zone and damping unchanged; check: with the same angle the horizontal speed grows going from level 1 to 5
- [x] 2.3 Apply the saved level at the start of the run; check: level 5 saved → full scale is reached at 10°

## 3. Control in the menu

- [x] 3.1 Add the row `−` / label / `+` with level and degrees, above the existing buttons; check: centered label and no overlap on 720×1280
- [x] 3.2 Disable `−` at the minimum and `+` at the maximum; check: at the limits the touch does not change the value and the button appears off
- [x] 3.3 Apply and save the choice on touch; check: after the touch the value stays after a page reload
- [x] 3.4 Check the layout on a small screen (360×640) and in landscape; check: nothing clipped, nothing overlapping

## 4. Documentation and check

- [x] 4.1 Update `README.md` with the speed ramp and the configurable sensitivity; check: `npm run check` green
- [x] 4.2 Test on a phone: steering feel at levels 1, 3 and 5 and difficulty after a minute of climbing; check: judgment by hand
- [x] 4.3 Tune `CLIMB_SPEED_MAX`, `CLIMB_SPEED_PER_PX` or the degrees of the levels if needed based on the test; check: values updated in the design too

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
