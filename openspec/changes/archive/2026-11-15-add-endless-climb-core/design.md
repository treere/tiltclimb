# Design

## Context

See `proposal.md` for the why. The current state is only scaffolding: Vite 8 with TypeScript 7 (note: `erasableSyntaxOnly` is active, so no `enum` and no parameter properties in classes), Excalibur 1.0.1 installed, `npm run build` green, dev server already configured for the tunnel (`allowedHosts: ['.trycloudflare.com']`, HMR on `wss:443`). There is no game code yet.

Constraints that guide the design:

- the specs (`specs/gameplay/endless-climb`, `specs/input/tilt-control`) describe the observable behavior; here we decide how to obtain it.
- the game is vertical and portrait: the Y axis is the direction of travel, the X axis is the only control.
- Excalibur has no sensor API: the tilt stays our own code, isolated behind a minimal interface.
- no assets: only shapes drawn in code (`ex.Rectangle`, `ex.Circle`).

## Goals / Non-Goals

**Goals:**

- a playable core in which the tilt input is replaceable without touching the game logic (and therefore testable with a fake input);
- stable frame rate on a phone: no per-frame allocation in the game loop;
- identical behavior on desktop, where sensors do not exist.

**Non-Goals:**

- fine difficulty balancing, progression, power-ups, audio, best score persistence;
- landscape support, tested iOS, PWA, deploy.

## Decisions

### 1. Clean separation between input source and game

`src/input/tilt-source.ts` exposes one thing only: `axis(): number` in [-1, 1], already calibrated, filtered and with the dead zone applied. `src/input/input-router.ts` chooses the active source (tilt if available, otherwise keyboard or drag) and composes it: if the tilt is active, keyboard and drag stay available as a manual override.

Rejected alternative: reading `window.addEventListener('deviceorientation')` inside the scene. It would be ten lines shorter, but it couples sensor and gameplay and makes it impossible to test the scene with a fake input.

### 2. Camera locked to a single axis

`scene.camera.strategy.lockToActorAxis(player, ex.Axis.Y)`, with the player climbing through a constant vertical speed (`vel.y` negative: in Excalibur Y grows downwards). The player's horizontal position is free within the world edges, so the camera does not have to follow it.

Rejected alternative: moving the world instead of the camera. It costs one update per obstacle per frame, while the camera is a single transform applied by the renderer.

### 3. Fixed-size obstacle pool

An array of N actors created once in `onInitialize` (N = 24, enough for two screens of obstacles), reused in rotation: whoever exits below the bottom edge goes back to the queue. No `new` during the run.

Rejected alternative: creating an `Obstacle` on every spawn and letting the GC collect it. On Android the garbage collector produces visible micro pauses in a continuously scrolling game.

### 4. Fixed timestep for physics

`new ex.Engine({ fixedUpdateFps: 60, displayMode: ex.DisplayMode.FitScreen, ... })`, so that the climb speed does not depend on the screen refresh (60, 90 or 120 Hz).

### 5. Tilt math

Readings from `deviceorientation`, field `gamma` (degrees, -90..90, positive = tilted right in portrait). Transformation chain, in order:

1. **zero**: on the first touch of the run `zero = gamma` is stored; every reading becomes `g = gamma - zero`;
2. **dead zone**: `if (|g| < TILT_DEAD_ZONE) g = 0`;
3. **normalization**: `raw = clamp(g / TILT_RANGE, -1, 1)` — beyond `TILT_RANGE` it saturates;
4. **frame-rate independent smoothing**: `axis = lerp(axis, raw, 1 - exp(-dt / SMOOTH_TAU))`. The classic per-frame `lerp(a, b, 0.2)` was rejected because at 30 Hz the movement is slower than at 60 Hz: the settling time would change with the device;
5. **speed**: `player.vel.x = axis * MAX_HORIZONTAL_SPEED`.

Gamma is read in a passive handler that only stores the last value; the conversion happens in the game loop, so events at 100 Hz do not produce 100 physics updates.

Initial constants, to be tuned in hand (in `src/game/constants.ts`):

- `WORLD_WIDTH = 720`, `WORLD_HEIGHT = 1280` (logical resolution, scale handled by `DisplayMode.FitScreen` (in 1.0.1 `FullScreen` does not exist: the value is called `FitScreen`, which keeps the proportions with black bars))
- `CLIMB_SPEED = 190` px/s (world climb speed)
- `MAX_HORIZONTAL_SPEED = 300` px/s
- `TILT_DEAD_ZONE = 3` °
- `TILT_RANGE = 22` ° (tilt at which maximum speed is reached)
- `SMOOTH_TAU = 90` ms
- `OBSTACLE_POOL_SIZE = 24`, `SPAWN_GAP = 260` px of scrolling
- `PLAYER_SIZE = 44x56`, `OBSTACLE_SIZE = 120x28`

### 6. Permissions and fallback

On the first touch: if `DeviceOrientationEvent.requestPermission` exists it is called inside the gesture and the outcome is stored. If the permission is missing, denied, or after 1.5 s no `deviceorientation` event arrives, the tilt source is marked unavailable and the game continues with keyboard/drag. The drag measures the horizontal displacement of the pointer relative to the grab point (delta, not absolute position), so the finger does not have to stay on top of the character.

`ex.Input` normalizes mouse and touch into a single pointer: drag with a single code path.

### 7. HUD and game states

`ex.Label` mounted on `ex.ScreenElement` for the score and the end-of-run message; a single explicit state (`idle | playing | gameover`) in the scene avoids impossible transitions. The restart reuses the same scene resetting pool, positions and score: no page reload.

## Risks / Trade-offs

- **Tilt feel too sensitive or too slow** → all the tilt constants are in a single file and the test page already measured gives the real range of that phone; tuning is a change of numbers, not of structure.
- **Orientation events missing or at low frequency on some Android devices** → time-independent smoothing and declared fallback: the game never freezes waiting for the sensor.
- **`gamma` behaves differently if the phone rotates** → portrait forced via CSS and attempt at `screen.orientation.lock('portrait')` after the first touch in fullscreen, without failing the game if the lock is refused.
- **Collisions perceived as unfair** (thin obstacles at 190 px/s) → hitbox smaller than the sprite (about 80% of the rectangle), and climb speed among the constants to tune first.
- **TypeScript 7 with `erasableSyntaxOnly`** → no `enum`, no parameter properties: string unions and explicit fields are used. If the restriction becomes annoying we consider disabling it, but it is not necessary for this core.
- **Fixed-size pool** → if in the future the obstacles became much more frequent, `OBSTACLE_POOL_SIZE` must be raised; once the size is exhausted the pool recycles the oldest, so it does not break, it behaves strangely.

## Migration Plan

There is nothing to migrate: first game code of the project. Work order: constants and empty scene → player and camera → pool and generation → collision and states → tilt input → fallback → tuning on the phone. Each step leaves the game startable and `npm run build` green. Rollback: the repository is at a committed scaffold state, so `git revert` of the apply commit returns to the scaffolding.
