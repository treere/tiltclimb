# Design

## Context

See `proposal.md`. Starting numbers, from the current code:

- `CLIMB_SPEED = 190` px/s, constant, used by the player (`player.vel.y = -CLIMB_SPEED`), by the starfield (parallax) and by the enemies, which derive the relative descent from it.
- `TILT_RANGE_DEG = 22` as full scale, `TILT_DEAD_ZONE_DEG = 3`, `TILT_SMOOTH_TAU_MS = 90`.
- The obstacles are positioned in steps of `SPAWN_GAP_PX = 260` pixels of climb.
- Preferences already persisted with `localStorage` (`tiltclimb.muted` in `src/audio/audio.ts`): there is a precedent to follow.

## Goals / Non-Goals

**Goals:**

- difficulty that grows on its own, predictably and without jumps;
- steering more responsive by default but adjustable, with the choice surviving a restart;
- no regression on parallax, obstacles and enemies when the world accelerates.

**Non-Goals:**

- difficulty selectable by hand (easy/normal/hard);
- saved progress, leaderboards, unlocks;
- changes to score, archetypes, enemy spawn rate.

## Decisions

### 1. Speed is a pure function of height

`src/game/speed.ts`:

```ts
export const CLIMB_SPEED_START = 190;
export const CLIMB_SPEED_MAX = 320;
/** How much the speed rises for every pixel of height gained. */
export const CLIMB_SPEED_PER_PX = 0.0135;

export function climbSpeedAt(heightPx: number): number {
  return Math.min(CLIMB_SPEED_MAX, CLIMB_SPEED_START + Math.max(0, heightPx) * CLIMB_SPEED_PER_PX);
}
```

With these numbers: 200 px/s at ~740 px, 260 px/s at ~5,200 px, cap at ~9,600 px (a little less than 55 seconds of full climb). Pure function → testable in Node without a browser, as already done for `combat-math.ts` and `enemy-archetypes.ts`.

Why tied to height and not to time: time rewards those who stay alive without climbing (not possible here) and above all makes the difficulty different between two runs over the same path. With height, "you got to 6,000 px" always implies the same speed.

### 2. The current speed is a value of the scene, not an imported constant

`climb-scene.ts` computes `const speed = climbSpeedAt(this.score.distance)` once per update and passes it to whoever needs it:

- `player.vel.y = -speed`;
- `starfield.update(elapsed, speed)` — today `Starfield` imports `CLIMB_SPEED`, which becomes a parameter;
- `EnemyContext.speed` — `enemy.ts` computes `-(speed - archetype.descent)` instead of `-(CLIMB_SPEED - ...)`.

Rejected alternative: leaving `CLIMB_SPEED` as a constant and adding a global multiplier. It would be a hidden value that everyone reads, that is the same coupling as today with one more level of indirection.

### 3. Obstacles: the distance stays in climb pixels

Generation already works in steps of `SPAWN_GAP_PX` on the world Y axis, so accelerating does not change the spatial density: the obstacles are farther apart in time, not closer in space. It is the right behavior — the game becomes faster, not more unfair — and it requires no new code. The check is that the number of obstacles per 1,000 px stays constant.

### 4. Sensitivity at five levels

`src/input/tilt-settings.ts`:

```ts
export const TILT_RANGES_DEG = [22, 17, 13, 10, 8]; // from the softest to the twitchiest
export const DEFAULT_TILT_LEVEL = 2;                // 13°, the more responsive default
export function rangeForLevel(level: number): number;
export function loadTiltLevel(): number;             // localStorage, with clamp
export function saveTiltLevel(level: number): void;
```

Sensitivity is only the amplitude (`TILT_RANGE_DEG`), applied inside `TiltSource` as a mutable property: dead zone and damping do not change, so the center stays stable even at the twitchiest level — that is why I did not touch the 3° dead zone.

**Why changing sensitivity does not require recalibrating**: calibration is an offset on the zero, sensitivity is a scale factor. They are independent by construction; it is worth saying so in the code because it is the kind of thing that gets "fixed" by mistake by adding an automatic recalibration.

### 5. Control in the menu: `−` and `+` with a central label

The menu already has `Button` (Canvas 2D) and `addCenteredGraphic`. The control is a row: `−` button on the left, central value, `+` button on the right, with the caption `SENSITIVITY · 13°` above. At the limits the corresponding button goes into the disabled state, which `Button` already supports.

Rejected alternative: a slider. On a small screen it requires precise dragging, and with five discrete values the two buttons are more reliable (and simpler to center, given the history).

The row is positioned above the existing buttons with measured space, not by eye: the check is that on 720×1280 and on 360×640 nothing overlaps.

### 6. Immediate application

The menu writes the level both to `localStorage` and to a shared object read by the `TiltSource` of the next run (`TiltSource` is created by the scene, so it reads the value at the right moment). No restart, no reload: the change applies from the run after the touch, which is what is needed.

## Risks / Trade-offs

- **Too hard at the top** → cap at 320 px/s (1.7× the start) and a slow ramp; if in testing it turns out unmanageable, `CLIMB_SPEED_MAX` or `CLIMB_SPEED_PER_PX` is lowered, two constants.
- **More sensitive default = more errors for those with an unsteady hand** → level 1 (22°) reproduces exactly the past behavior, so there is always a way back. The default was tuned a second time on request: from 16° to 13°, because 16° still felt tame.
- **Enemies that "escape" more** → with `-(speed - descent)` the relative descent stays the archetype's; if the game accelerates, the enemy descends more slowly relative to the screen but at the same speed in the world. To be verified by eye in a fast run.
- **Fragile persistence** (`localStorage` denied in incognito) → read in `try/catch` with fallback to the default, as already done for audio.

## Migration Plan

No data to migrate: those without saved settings start at level 2 (16°). Those with runs in progress have nothing to convert, because there are no saved runs.
