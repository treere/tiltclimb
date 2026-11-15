# Tasks

## 1. Foundations: engine, scene, constants

- [x] 1.1 Create `src/game/constants.ts` with the design constants (world, speeds, tilt, pool) and check that `npm run typecheck` passes without errors
- [x] 1.2 Instantiate the engine in `src/main.ts` with `fixedUpdateFps: 60`, `displayMode: ex.DisplayMode.FitScreen` and canvas `#game`; check: `npm run build` green and a page showing a full-screen black canvas from a phone
- [x] 1.3 Create `src/game/climb-scene.ts` with an empty scene, a solid color background and a portrait lock (CSS `orientation` + non-blocking `screen.orientation.lock` attempt); check: `npm run dev` and canvas visible with no console errors

## 2. Player and camera

- [x] 2.1 Add the player as an `Actor` with `ex.Rectangle` graphics and a collision body reduced to 80%; check: the rectangle appears and the world edges stop it
- [x] 2.2 Apply the automatic climb (`vel.y = -CLIMB_SPEED`) with `fixedUpdateFps` active; check: comparing two screenshots 2 s apart the scrolling is constant and independent of the refresh rate
- [x] 2.3 Hook the camera with `lockToActorAxis(player, ex.Axis.Y)`; check: moving the player horizontally with the keyboard the background stays still, climbing the camera follows it

## 3. Obstacles: pool, generation, recycling

- [x] 3.1 Implement `src/game/obstacle-pool.ts` with N preallocated actors and the API `spawnAbove()` / `releaseBelow()`; check: no allocation after init (instance counter stable in the console)
- [x] 3.2 Generate an obstacle every `SPAWN_GAP` pixels of scrolling, at a random X position with margins; check: playing for 30 s the obstacles arrive regularly and never overlapping the edge
- [x] 3.3 Recycle the obstacles that exit below the bottom edge; check: after 60 s the number of active obstacles is constant and the pool does not grow

## 4. Run: collision, score, states

- [x] 4.1 Handle the player-obstacle collision that leads to the `gameover` state with the world stopped; check: touching an obstacle the scrolling stops and no new obstacles are born
- [x] 4.2 Show a score based on the maximum height with `ex.Label` on `ex.ScreenElement`; check: the number grows while climbing and never goes back
- [x] 4.3 Implement the restart with a single action that resets pool, positions, score and tilt zero; check: after the restart it starts from zero without reloading the page

## 5. Tilt input

- [x] 5.1 Create `src/input/tilt-source.ts` with passive reading of `deviceorientation`, zero computed on the first touch and the API `axis()`; check: tilting the phone `axis()` follows the expected sign (positive to the right) and is 0 with the phone still
- [x] 5.2 Apply dead zone, normalization on `TILT_RANGE` and smoothing depending on `dt`; check: with the phone still the player does not vibrate and at full tilt the speed saturates
- [x] 5.3 Connect `axis()` to the player's horizontal speed; check: on a phone the character steers proportionally and stops at the center

## 6. Fallback without sensors

- [x] 6.1 Handle the permission request inside the first touch and mark the source unavailable if denied or if no event arrives within 1.5 s; check: denying the permission the game starts anyway
- [x] 6.2 Add keyboard control (left/right arrows) as the active source on desktop; check: on PC the player steers with the arrows
- [x] 6.3 Add horizontal drag via `engine.input.pointers` based on delta; check: dragging the finger the character follows without the finger having to stay on top of it

## 7. Tuning and final check

- [ ] 7.1 Tune `CLIMB_SPEED`, `MAX_HORIZONTAL_SPEED`, `TILT_RANGE`, `TILT_DEAD_ZONE` and `SMOOTH_TAU` by playing at least three runs from a phone; check: the steering is controllable and the climb is neither boring nor unmanageable
- [ ] 7.2 Run the full round on a phone via quick tunnel: first touch, permission, run, death, restart; check: no console errors and no stuck state
- [x] 7.3 Run `npm run check` (typecheck + Biome + build) and update `README.md` with the start commands and the note on the HTTPS tunnel; check: green command and no warnings

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas into `openspec/specs/`
