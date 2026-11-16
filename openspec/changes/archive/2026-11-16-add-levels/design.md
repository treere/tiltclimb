# Design

## Context

See `proposal.md`. Values today, from the code:

- `CLIMB_SPEED_START = 190`, `CLIMB_SPEED_MAX = 320`, `CLIMB_SPEED_PER_PX = 0.0135`: the speed grows
  continuously with height and hits the cap around 9,600 px.
- `SPAWN_GAP_PX = 260`, constant.
- Enemy limit: `ENEMY_MAX_ALIVE_EARLY = 2`, `ENEMY_MAX_ALIVE_LATE = 3` from the hunter's unlock
  height (6,000 px); archetypes unlock at 0 / 2,500 / 6,000 / 10,000 px.
- The level must not touch the score, which is `climbScore(height, killPoints)` and already the
  record.

## Goals / Non-Goals

**Goals:** the run gains structure and a beat every 1,500 px, difficulty becomes legible, the record
stays the score.

**Non-Goals:** a finite number of levels, victory, level select, per-level scores, names, story beats.

## Decisions

### 1. Level is a pure function of height

```ts
export const LEVEL_PX = 1500;
export const levelAt = (heightPx: number): number => Math.floor(Math.max(0, heightPx) / LEVEL_PX) + 1;
```

Pure and testable, like `speed.ts` and `records.ts`. A level boundary is `height % 1500 === 0`, so it
is crossed by climbing and never by waiting.

### 2. Everything a level changes lives on one object

```ts
export type LevelSpec = { level: number; climbSpeed: number; maxAlive: number; obstacleGap: number };
export const specForLevel = (level: number): LevelSpec => ({
  level,
  climbSpeed: Math.min(CLIMB_SPEED_MAX, CLIMB_SPEED_START + (level - 1) * CLIMB_SPEED_STEP),
  maxAlive: Math.min(ENEMY_POOL_SIZE, ENEMY_MAX_ALIVE_EARLY + (level >= HUNTER_LEVEL ? 1 : 0) + (level >= UFO_LEVEL ? 1 : 0)),
  obstacleGap: Math.max(OBSTACLE_GAP_FLOOR, SPAWN_GAP_PX - (level - 1) * OBSTACLE_GAP_STEP),
});
```

| Level | Climb speed | Max alive | Obstacle gap |
| --- | --- | --- | --- |
| 1 | 190 | 2 | 260 |
| 3 (diver) | 216 | 2 | 250 |
| 4 | 229 | 3 | 245 |
| 6 (hunter) | 255 | 3 | 235 |
| 9 (UFO) | 294 | 4 | 220 |
| 11 | 320 (cap) | 4 | 210 (floor) |

`CLIMB_SPEED_STEP = 13` puts the cap at level 11 (15,000 px); `OBSTACLE_GAP_STEP = 5` with a floor of
210 keeps the density increase under 25% overall. The continuous ramp disappears: inside a level the
speed is constant.

**Why steps and not a curve**: the whole point of the request is that a level is a thing you can feel
and name. A continuous curve would give boundaries nothing to change.

### 3. The scene holds the current level and reacts on change

`ClimbScene` computes the level each frame from `climbedHeight()`. When it differs from the stored one
it applies the new spec (speed is read from it every frame anyway), updates the HUD label, and shows
the banner. The banner is a `UiText` that fades after 1.2 s, separate from the existing score banner so
the two cannot fight.

### 4. HUD: score first, level second

The score keeps its 44 px at the top left. The level goes right below it as `LV 3` at 26 px, muted
colour — visible, but clearly secondary. The banner is a one-line `LEVEL 3` at mid height for 1.2 s, on
the same layer as the score, never over the ship's lane.

### 5. Archetypes unlock by level, not height

`unlockHeight` becomes `unlockLevel` (diver 3, hunter 6, UFO 9) and `kindsAvailableAt` takes the level.
It keeps the existing behaviour — a type appears from that point on — but the thresholds now sit exactly
on the boundaries the player is told about, which is what makes the announcement meaningful.

### 6. The score and the record are untouched

`climbScore` does not read the level. The record keys and the persistence stay as they are: the level
is a stage in the HUD, not a ranking. This is the requirement the request was explicit about.

## Risks / Trade-offs

- **A wall every 1,500 px** → 13 px/s is a 7% jump, announced by the banner; if it feels abrupt the
  step is one constant.
- **Obstacle density at the floor** → 210 px against 260 is 24% more rows; checked by counting rows per
  1,000 px at level 1 and at level 11.
- **Enemy pool of four** → the UFO level asks for four alive, which is exactly the pool size; if the pool
  is exhausted the spawn is skipped, which is the existing behaviour.
- **Removing the continuous ramp** changes the feel of long runs: they are now flat inside a level. That
  is the intent, and the reason the spec for `difficulty-ramp` changes with it.
