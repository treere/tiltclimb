# Tasks

## 1. Assets and archetype table

- [x] 1.1 Copy the assets `enemyRed1`, `enemyBlue4`, `enemyGreen2` and `ufoYellow` (the latter not yet in the repo) adding them to the loader; check: no 404 and `npm run check` green
- [x] 1.2 Create `src/game/enemy-archetypes.ts` with the `EnemyKind` type, the `ARCHETYPES` table (sprite, points, threshold, movement and fire parameters) and a function `kindsAvailableAt(height)`; check: the four types are described only by the table, no magic number in `enemy.ts`

## 2. Projectiles with an angle

- [x] 2.1 Extend `Projectile.launch` with an optional angle in radians and make `isOutside` check the X axis too; check: a shot launched at 18° travels obliquely and is recycled when exiting sideways
- [x] 2.2 Add a helper to the pool for multiple bursts (n shots with delay); check: a burst of 4 produces four distinct projectiles, not a single one overwritten

## 3. Behaviors of the four types

- [x] 3.1 Rewrite `Enemy` so that it uses the archetype: sprite and points from the type, `weave` only for the patrol, fast descent and drift for the striker, horizontal chase for the hunter, mid-height stationing for the turret; check: each type moves as described in the table
- [x] 3.2 Implement the four fire patterns (single, burst of 2, fan of 3, burst of 4 with a long pause) with the rates from the table; check: watching each type for a full cycle, the expected number of shots is counted
- [x] 3.3 Select the type at spawn drawing only among those unlocked at the current height; check: below 2500 px only patrols appear

## 4. Difficulty and score

- [x] 4.1 Make the limit of alive enemies dynamic (2, then 3 once the hunter is unlocked); check: before the threshold three ships are never seen together, after it they are
- [x] 4.2 Replace `KILL_POINTS` with the archetype points, adding into an accumulated counter; check: destroying a patrol adds 25 points, a turret 60, and the total never goes back
- [x] 4.3 Update `climbScore` so that it receives the accumulated points instead of the count times a fixed constant; check: `npm run check` green and no reference to `KILL_POINTS`

## 5. Documentation

- [x] 5.1 Update `README.md` with the four types, the unlock thresholds and the score per type; check: the information matches the table in the code

## 6. Final check

- [x] 6.1 Round on a phone: play until passing the three thresholds and recognize the four types by eye; check: each type is distinguishable by shape and behavior
- [x] 6.2 Judgment on difficulty: the hunter must be escapable laterally and the fan must not close the space; check: three runs without a death perceived as unfair
- [x] 6.3 Check that the difficulty growth is felt: the first phases must be calm and the last ones tense; check: judgment after at least one long run

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
