# Proposal

## Why

Today the asteroid field is a passive obstacle: the only decision is where to pass, and there is nothing that responds to the player. With enemy ships descending in zigzags and firing downwards, the hero has to dodge two things at once and has an active answer — a fire button. It is the step from "avoiding" to "fighting", without changing the structure of the game (you climb, you die, you return to the menu).

## What Changes

- **Enemy ships**: they descend from above with a **wavy** trajectory (zigzag among the asteroids), firing downwards. At most two appear at a time, at regular intervals.
- **Hero fire**: themed button at the bottom of the screen; **one touch = one shot**, no burst. The shot leaves the spaceship and travels up.
- **Enemy projectiles**: they descend straight, slower than the hero's, and kill on contact.
- **Collisions**: one hero shot destroys an enemy ship (a single shot) and awards points; an enemy ship or enemy projectile touching the hero ends the run, like an asteroid.
- **Asteroids**: immune to projectiles (shots pass through them) and passable by enemy ships, which go over or under them without interacting.
- **Score**: points from kills are added to the score by height.
- Out of scope: multiple lives or shields, limited ammo, power-ups, bosses, enemies that chase the player, animated explosions with dedicated assets (the pack has none), progressive difficulty, audio, changes to the tilt or to the menu → run → menu cycle.

## Capabilities

### New Capabilities

- `gameplay/combat`: hero fire from the bottom button, projectiles of the two factions, wavy movement and fire of the enemy ships, collision rules (including the asteroids' immunities) and score per kill.

### Modified Capabilities

- `gameplay/endless-climb`: the collision that ends the run is no longer only with obstacles but also with enemy ships and projectiles; the score is no longer only height but height plus kills.

## Impact

- Assets: enemy ships (`enemyRed1`–`enemyRed5`), lasers `laserBlue*` and `laserRed*` from the Kenney pack already present are added, under the same CC0 license and the same `license.txt`.
- Code: new `src/game/enemy.ts`, `src/game/projectile.ts` (pool shared by the two types), `src/game/combat.ts` (fire, collisions, score); tweaks to `climb-scene.ts` (enemy spawn, projectile update), `ui/button.ts` (fire button, already themed), `constants.ts`, `session.ts` (kill counter for the summary).
- Main risk: the field becomes crowded and the game can be unplayable on a small screen; the rate and speeds must be tuned taking into account that the ship sits in the lower third of the screen.
