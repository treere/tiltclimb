# Tasks

## 1. Level maths

- [x] 1.1 Create `src/game/levels.ts` with `LEVEL_PX`, `levelAt(height)`, `specForLevel(level)` and the constants for speed step, gap step and floors; check: numeric probe in Node on three levels (1, 3, 11) covering speed, gap, max alive and the ceilings
- [x] 1.2 Verify the boundaries: level 1 from 0 to 1,499, level 2 from 1,500, level unchanged while standing still; check: the same probe asserts `levelAt(1499) === 1`, `levelAt(1500) === 2`, `levelAt(-10) === 1`

## 2. Speed and obstacles follow the level

- [x] 2.1 Replace the continuous ramp in `speed.ts` with the level spec, keeping the same cap; check: `npm run check` green and the probe shows a constant speed inside a level and a jump only at the boundary
- [x] 2.2 Make the obstacle gap read from the current level while rows already on screen keep their spacing; check: probe counting rows per 1,000 px at level 1 and at the cap level

## 3. Enemies

- [x] 3.1 Replace `unlockHeight` with `unlockLevel` (diver 3, hunter 6, UFO 9) and make `kindsAvailableAt` take the level; check: the probe lists the available kinds at levels 1, 3, 6 and 9
- [x] 3.2 Make the alive limit grow with the level within the pool size; check: the probe asserts 2 at level 1, 3 from level 6, 4 from level 9 and never more than the pool

## 4. On screen

- [x] 4.1 Add the persistent `LV n` label under the score, smaller and muted; check: screenshot shows both, score dominant, no overlap with the fire button or the pause control
- [x] 4.2 Add the `LEVEL n` banner on change, fading after about a second, without covering the ship; check: browser test crossing a boundary shows the banner and then its disappearance
- [x] 4.3 Confirm the banner cannot collide with the end-of-run score banner; check: end a run within a second of a level change and read both texts

## 5. Score and record untouched

- [x] 5.1 Confirm the score formula and the stored record do not read the level; check: two runs with the same height and kills at different levels produce the same score, and the record keys are unchanged
- [x] 5.2 Browser test: play across a boundary, end the run, reload, the stored best is the score as before; check: values in `localStorage` and the menu line

## 6. Docs and device check

- [x] 6.1 Update `README.md` with the level rules and the per-level values; check: `npm run check` green
- [x] 6.2 Play on the phone: is the step noticeable but fair, is the level readable while steering, is the banner visible without covering the play area; check: judgement by hand
- [x] 6.3 Tune `LEVEL_PX`, the speed step or the gap floor if the steps feel wrong; check: constants updated, probes still green

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec deltas
