# Tasks

## 1. The dying phase

- [x] 1.1 Add `DEATH_TIMESCALE = 0.25` and `DEATH_SLOWMO_MS = 400` to the constants; check: `npm run check` green
- [x] 1.2 Add the `dying` flag and its `onPreUpdate` branch (blast and starfield only); check: Node probe on the branch decision — running, dying, gone — reports which systems tick
- [x] 1.3 Set the phase in `endRun()` together with `engine.timescale`; check: browser test reads `engine.timescale` right after the collision and gets 0.25

## 2. Restoring time

- [x] 2.1 Restore the timescale in the exit timer, then change scene; check: browser test reads 1 at the menu
- [x] 2.2 Restore it in `onDeactivate`; check: browser test leaves the scene mid-beat and reads 1
- [x] 2.3 Restore it in the `visibilitychange` handler; check: browser test hides the page mid-beat, comes back, reads 1

## 3. What must not happen during the beat

- [x] 3.1 No spawns: play the beat and count obstacles, enemies and projectiles before and after; check: browser test, counts equal
- [x] 3.2 No score: read the score during and after the beat; check: browser test, value unchanged
- [x] 3.3 The blast actually animates during the beat: sample the explosion's frame index twice; check: browser test, second sample higher

## 4. Second run and edges

- [x] 4.1 A second run after a death scrolls at normal speed; check: browser test reading the climb speed and `engine.timescale` after restarting
- [x] 4.2 Pausing during the beat, and the pause control while dying, do not strand the timescale; check: browser test
- [x] 4.3 Reaching the menu mid-beat by another path (scene change from the menu itself) leaves time at 1; check: browser test

## 5. Feel

- [x] 5.1 Tune `DEATH_TIMESCALE` and `DEATH_SLOWMO_MS` on the phone; check: judgement by hand, constants updated
- [x] 5.2 Decide whether the verdict sting at 420 ms fights the blast; check: move it to 520 ms or leave it, with a note in `README.md`

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing both spec deltas
