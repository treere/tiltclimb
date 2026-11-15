# Design

## Context

See `proposal.md` for the why. Today `Enemy` is a single class with a fixed sine wave and `wantsToFire()` returning a boolean: the type does not exist, the sprite is chosen at random among five red ones, and the shot is always vertical. The pool has 4 elements with a maximum of 2 alive, the kill score is a constant (`KILL_POINTS = 25`) used both by `combat-math` and by the HUD.

The pack already in the repo contains 20 ships (`enemy{Red,Blue,Green,Black}1…5`, ~82-104×84) and 4 UFOs (91×91). **No ship is reliably distinguishable by shape at a glance**: shapes 1-5 change silhouette, colors are four. So shape + color together are used as the archetype signature.

## Goals / Non-Goals

**Goals:**

- four behaviors that are readable and distinguishable by eye, without introducing a script engine;
- difficulty that grows with height, measurable and tunable from a single table;
- pool and collisions unchanged: no allocation during the run.

**Non-Goals:**

- bosses, formations, coordination between ships;
- new types beyond the four;
- changes to hero, tilt, asteroids, menu;
- adaptive AI: thresholds are fixed.

## Decisions

### 1. A type as data, not a class per archetype

`src/game/enemy-archetypes.ts` exposes a table `ARCHETYPES: Record<EnemyKind, Archetype>` with everything that distinguishes a type: sprite, points, unlock threshold, movement parameters and fire pattern. `Enemy` stays a single class that reads the table and applies the behavior with a `switch` on `kind`.

Rejected alternative: a subclass per archetype. Four files for four behaviors of twenty lines each, and every new type would require a class plus an instantiation branch; with the table, adding a type is one more entry.

### 2. The four archetypes

| Type | Sprite | Movement | Fire | Unlock | Points |
| --- | --- | --- | --- | --- | --- |
| `patrol` | `enemyRed1` (93×84) | wave, amplitude 110, ω 1.8, descent 120 px/s | 1 shot every 2200 ms, 320 px/s | 0 px | 25 |
| `diver` | `enemyBlue4` (82×84) | descent 260 px/s, horizontal drift 120 px/s towards the side opposite the entry | burst of 2 shots (200 ms between the two) every 2600 ms, 340 px/s | 2500 px | 35 |
| `hunter` | `enemyGreen2` (104×84) | horizontal chase with maximum speed 150 px/s, descent 100 px/s | fan of 3 shots at -18°/0°/+18° every 2400 ms, 300 px/s | 6000 px | 45 |
| `ufo` | `ufoYellow` (91×91) | descends to mid height, then oscillates slowly without descending | burst of 4 shots (200 ms) every 5000 ms, 260 px/s | 10000 px | 60 |

The thresholds are in height pixels, not points: the user chose this metric, and it has the advantage of not depending on kills (those who do not shoot do not fall behind). At 190 px/s they mean about 13, 32 and 53 seconds of climbing.

### 3. Dynamic limit

`ENEMY_MAX_ALIVE` becomes a function of height: 2 until the hunter is unlocked, 3 after. The pool stays at 4, so the limit can only rise up to 3 without growing memory.

### 4. Projectiles with an angle

`Projectile.launch(faction, x, y, angleRadians = 0)` rotates the base velocity. The sprite does not rotate (Kenney lasers are already tiltable with the actor, but rotating the single shot by 18° makes it harder to read): it stays vertical, and only the trajectory is oblique. `isOutside` also checks the X axis, otherwise an oblique shot stays "inside" forever while travelling sideways.

The hunter's fan uses ±18° (±0.31 rad) because at 300 px/s it produces about 93 px/s of lateral drift: it is visible, it can be dodged, and it does not leave the screen in half a second.

### 5. Score per type

`Archetype.points` replaces the single constant. `climbScore()` keeps its signature but receives the accumulated points instead of `kills × KILL_POINTS`: the scene adds `points` on every kill in `this.killPoints`, and the total stays monotonic as before.

### 6. Table as the single tuning source

All the numbers of the table live in `constants.ts` (or in the table itself, which imports the constants): changing the difficulty means changing one row, not hunting for scattered values. The thresholds are the first thing to touch if the game turns out too slow to become interesting.

## Risks / Trade-offs

- **Hunter too aggressive**: it chases exactly where you steer. Mitigation: maximum speed 150 px/s against the hero's 300, so you can escape laterally; if in hand it feels unfair it is lowered to 110.
- **Fan that traps**: three oblique shots can close the space. Mitigation: ±18° opening, 2400 ms rate, and a single burst at a time.
- **Turret that stations**: if it stays too high it is out of reach of the hero's shots. Mitigation: it stops at mid height, well within range, and its oscillation is slow.
- **Pressure at 3 enemies**: with a UFO and a hunter together the screen can become unreadable. Mitigation: limit 3 only after 6000 px, and the spawn rate stays 3500 ms.
- **Pool of 4** with limit 3 leaves only one element of margin: if in the future the limit rises to 4, the pool must be raised together. It is written here so it is not discovered at runtime.
- **Score per type** makes the value of kills uneven: it is intended, but it must be communicated in the README because the number that goes up is no longer "25 fixed".

## Migration Plan

No data migration. `KILL_POINTS` disappears in favor of `Archetype.points`; the menu summary stays based on the count, not on the points. Rollback: revert of the apply commit.
