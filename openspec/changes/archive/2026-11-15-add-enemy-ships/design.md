# Design

## Context

See `proposal.md` for the why. The game today has one scene (`ClimbScene`) with a pool of 24 asteroids, a manual camera that keeps the hero at 72% of the height, screen parallax and two themed buttons in the menu. There are no projectiles and no entities that move independently: everything scrolls because the camera climbs.

Assets available in the pack already in the repo (CC0, same `license.txt`): enemy ships `enemyRed1`–`enemyRed5`, lasers `laserBlue01…16` and `laserRed01…16`. **There are no explosion frames**: verified by scanning the archive, the pack contains `shield`, `star` and `fire`, not explosions.

## Goals / Non-Goals

**Goals:**

- combat that is readable on a phone screen: few projectiles, few enemies, all immunity rules explicit;
- no allocation during the run: fixed pools for projectiles and enemies;
- monotonic score (height + kills), so the summary never goes back.

**Non-Goals:**

- lives, shields, ammo, power-ups, bosses, chasing enemies;
- explosion effects with dedicated assets (they do not exist in the pack);
- changes to tilt, camera, menu or scene cycle.

## Decisions

### 1. Projectile and ship collisions: our own geometry, not the engine

The engine keeps handling only hero ↔ asteroid, as today. Projectiles and enemy ships are `CollisionType.PreventCollision` and collisions are resolved in `onPreUpdate` with circle-circle tests (and circle-hero for the ships).

The reason is the required immunity: a shot must pass through asteroids, and an enemy ship must pass through them. Delegating this to collision groups means three configurations that must stay consistent with each other and that the engine re-evaluates for every pair; with twenty projectiles in flight the explicit test costs nothing and is readable in a single place. On top of that it makes the rule verifiable: if one day an asteroid had to stop shots, one row changes, not a hierarchy of groups.

### 2. A single projectile pool with the faction as data

`src/game/projectile.ts` exposes `Projectile` with `faction: 'hero' | 'enemy'`. A single pool of 40 elements serves both types: upwards and blue sprite for the hero, downwards and red sprite for the enemies. Recycled when they exit the screen.

Rejected alternative: two separate pools. It doubles the fields to keep aligned without adding anything: the constraint is "max N projectiles in flight", not "max N per faction".

### 3. Enemy trajectory: slow descent in the world, wave horizontally

The camera climbs at `CLIMB_SPEED`; an enemy with world speed `-(CLIMB_SPEED - ENEMY_SCREEN_DESCENT)` descends **on screen** at `ENEMY_SCREEN_DESCENT` (120 px/s), that is it stays visible for about ten seconds instead of zipping past. The oscillation is `pos.x = baseX + amplitude × sin(phase + ω·t)`, with `amplitude 110 px`, `ω 1.8 rad/s`, random `baseX` and limits at the world edges.

Initial values in `constants.ts`: `ENEMY_SCREEN_DESCENT 120`, `ENEMY_WEAVE_AMPLITUDE 110`, `ENEMY_WEAVE_OMEGA 1.8`, `ENEMY_MAX_ALIVE 2`, `ENEMY_SPAWN_INTERVAL_MS 3500`, `ENEMY_FIRE_INTERVAL_MS 2200`.

### 4. Fire: one touch, one shot, with a double-event guard

The button uses the already themed `Button`, positioned at the bottom above the safe area and away from the ship (which sits at 72%). The touch calls `fire()`: if less than `SHOT_MIN_INTERVAL_MS` (150) have passed since the last shot, the touch is ignored. It is not a burst — no timer fires on its own — but it prevents a double browser event from producing two shots from a single touch.

`HERO_SHOT_SPEED 620` px/s upwards, `ENEMY_SHOT_SPEED 320` px/s downwards: the enemy shot is slower and therefore dodgeable, as requested.

### 5. Score: two sources, one monotonic sum

`score = floor(height / PIXELS_PER_POINT) + kills × KILL_POINTS` with `KILL_POINTS = 25`. Both components are monotonic, so the score never goes back (a requirement that already existed). `session.kills` is saved at the end of the run for the menu summary, which will show "Last: N · Best: M · Destroyed: K".

### 6. Draw layers: enemies above asteroids

Z: asteroids 0, enemies 20, projectiles 30, hero 40, HUD 100. Enemy ships **go above** the asteroids: it is the cleanest reading, because underneath they would look hidden and indestructible, while the real rule is "they do not interact". The spec says "above or below" and this is the choice.

### 7. No death effect in this iteration

The pack has no explosions. Instead of inventing an effect with flame frames (which would look like an engine left on), the enemy ship disappears. It is declared out of scope in the proposal, and when a pack with explosions arrives it will be added as a delta of the `gameplay/combat` spec.

## Risks / Trade-offs

- **Crowding** → at most 2 enemies, 40 projectiles total, and the ship sits low: if it becomes unplayable, `ENEMY_SPAWN_INTERVAL_MS` is increased (more pause) or the fire rate is lowered, not the speed.
- **"Dirty" projectiles** between runs → the pool is emptied in `startRun`, as already happens for asteroids.
- **Reaction time** → the hero is at 72% of the height, so they see 920 px of field: an enemy shot at 320 px/s gives almost 3 seconds. If it turned out too easy, the rate is increased, not the speed.
- **Approximate circle-circle tests** → the hero is a 56×34 rectangle: a centered circle of radius 20 is used, slightly forgiving. Acceptable, but it must be tuned by hand.
- **Score that jumps** → if a kill arrives while the height grows, the sum can increase by 25 in one frame: it is intended and must be shown as it is.

## Migration Plan

No data to migrate, no persistence. The rollback is the revert of the apply commit: the previous specs are already in `openspec/specs/` and describe the game without combat.
