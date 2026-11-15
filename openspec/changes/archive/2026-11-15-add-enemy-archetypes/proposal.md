# Proposal

## Why

Today every enemy ship behaves the same way: wide wave and one straight shot. After a minute of play you have seen everything, and the difficulty does not grow because nothing new arrives. The sprites available in the pack are twenty ships plus four UFOs: enough to give each type a recognizable character and to bring in the nastiest ones as you climb.

## What Changes

- Four enemy **archetypes**, each with its own sprite, movement and fire:
  - **Patrol** (red): wide slow wave, one straight shot. It is today's one, the easiest.
  - **Striker** (blue): descends fast diagonally towards the opposite side, burst of two close shots.
  - **Hunter** (green): moves horizontally following the hero's position, fires a fan of three shots downwards.
  - **UFO Turret** (yellow): descends little and stations at mid height, burst of four shots in sequence, then a long pause.
- **Progressive appearance**: you start with the Patrol only; the other types unlock at increasing heights reached in the run, and do not appear before.
- **Growing pressure**: the limit of simultaneous enemies goes from 2 to 3 in the late phase, together with the unlock of the Hunter.
- **Score per type**: harder enemies are worth more points (25 / 35 / 45 / 60).
- **Angled projectiles**: the Hunter's fan requires shots with an oblique direction, so the projectile learns an angle; the other types keep firing straight downwards.
- Out of scope: bosses, coordinated formations between enemies, enemies that chase vertically, new types beyond the four, changes to the hero, the tilt, the menu or the asteroids.

## Capabilities

### New Capabilities

None: combat already exists as a capability and this change modifies its behavior.

### Modified Capabilities

- `gameplay/combat`: the trajectory of enemy ships is no longer a single wave equal for everyone but depends on the archetype; fire is no longer a regular single shot but depends on the archetype, including bursts and fans; progressive appearance by height and differentiated score per type are added.

## Impact

- Assets: new ships `enemyBlue4`, `enemyGreen2`, `enemyRed1`, `ufoYellow` from the Kenney pack already in the repo (same CC0 license, same `license.txt`).
- Code: `src/game/enemy.ts` becomes a small hierarchy of archetypes with a configuration table; `src/game/projectile.ts` accepts a launch angle; `src/game/combat-math.ts` gains the type choice based on height; `climb-scene.ts` changes the spawn and the dynamic limit; `constants.ts` collects the thresholds.
- Main risk: without tuning, the Hunter that follows the hero can be unplayable on a narrow screen, because it takes away lateral space exactly where you steer.
