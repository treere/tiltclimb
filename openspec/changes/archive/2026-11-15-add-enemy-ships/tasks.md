# Tasks

## 1. Assets and constants

- [x] 1.1 Copy the enemy ships `enemyRed1`–`enemyRed5` and the lasers `laserBlue01`/`laserRed01` from the pack already present into the repo, updating `license.txt` and the credits if needed; check: the files are in `public/assets/kenney/`, `npm run check` green and no 404 at runtime
- [x] 1.2 Add to `constants.ts` the combat constants (shot speeds, enemy rate and limits, wave amplitude, points per kill); check: `npm run typecheck` green and no magic number in the new code

## 2. Projectiles

- [x] 2.1 Create `src/game/projectile.ts` with `Projectile` (faction, sprite, speed, `CollisionType.PreventCollision`) and a pool of 40 with `spawn(faction, x, y)` and recycling off screen; check: firing repeatedly the number of actors stays constant
- [x] 2.2 Update the projectiles every frame and recycle those that exit the edges; check: after 30 seconds of continuous fire no projectile stands still or is visible off screen

## 3. Hero fire

- [x] 3.1 Add the fire button at the bottom of the screen, with the themed `Button` and a position that does not cover the ship or the asteroids; check: the button is reachable with the thumb and does not overlap the hero
- [x] 3.2 Wire the touch to a single shot with a double-event guard (`SHOT_MIN_INTERVAL_MS`), without any automatic timer; check: a long press produces a single shot, repeated touches produce one shot each
- [x] 3.3 Make the shot leave from the nose of the spaceship and travel upwards; check: the shot is born in front of the ship and climbs straight

## 4. Enemy ships

- [x] 4.1 Create `src/game/enemy.ts` with `Enemy` (random sprite among the five, pool, `PreventCollision`) and the slow descent + horizontal wave logic; check: the ship descends slowly and its x oscillates continuously staying within the edges
- [x] 4.2 Add the periodic spawn with a limit of simultaneous ships; check: never more than `ENEMY_MAX_ALIVE` ships together and new ones arrive at regular intervals
- [x] 4.3 Make each ship fire downwards at regular intervals, only while visible; check: the ship produces red projectiles that descend and disappear below the edge

## 5. Collisions and score

- [x] 5.1 Implement the circle-circle tests between projectiles and targets: hero shot × enemy ship (ship destroyed, shot consumed), hero shot × asteroid (no effect), enemy shot × hero (end of run); check: the three cases behave as per spec
- [x] 5.2 End the run also on hero × enemy ship contact; check: touching a ship the run ends as with an asteroid
- [x] 5.3 Add the points per kill to the score and record the counter in `session`; check: the score rises by `KILL_POINTS` on every kill and never drops

## 6. Summary and cleanup

- [x] 6.1 Show in the menu the number of ships destroyed next to the last and best score; check: after a run with two kills the menu shows 2
- [x] 6.2 Reset projectiles, enemies and kill counter in `startRun` and in `onDeactivate`; check: two consecutive runs do not inherit projectiles or enemies from the previous one
- [x] 6.3 Update `README.md` with combat (fire button, enemies, asteroid immunity) and run `npm run check`; check: green command and consistent documentation

## 7. Final check

- [x] 7.1 Round on a phone via tunnel: fire, destroy a ship, get hit by a projectile, get hit by a ship, check whether asteroids stop shots or not; check: every case behaves as described
- [x] 7.2 Judgment on difficulty: two enemies together must be challenging but manageable, and the ships must be killable while they oscillate; check: three trial runs without a feeling of unplayability
- [x] 7.3 Check that the fire button does not steal space from the game and stays comfortable for the thumb of the hand holding the phone; check: visual judgment on a small screen

## 8. Tweaks requested after the test

- [x] 8.1 Make the projectiles readable on a phone: the Kenney lasers (9×54) were scaled to 28 px of length and 4.7 px of width, invisible on a small screen; check: they are now 46×12 logical px with a radius-7 collider and they are visible in the run

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
