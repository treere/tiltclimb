# Proposal

## Why

With the cannon heat under control a run is a straight line: dodge, shoot, climb. Nothing ever changes
the rules for a moment, and a destroyed ship only gives points. A rare, short window where the ship
becomes the danger instead of the target would give the run a story.

## What Changes

- **Rare drop**: a destroyed ship may leave a pickup, which falls with the world and is collected by
  touching it; if it leaves the screen it is gone.
- **Invincibility for a few seconds**: asteroids and projectiles do nothing, and **touching an enemy
  ship destroys it** — explosion and points of a normal kill.
- **The timer resets, it does not stack**: a second pickup restarts the full duration.
- **It looks and sounds different**: the ship changes colour, a short jingle plays on pickup, and in
  the last two seconds the ship blinks between the two colours.
- **The state belongs to the run**: the timer runs on the game clock, freezes while paused, is cleared
  at the start of a run. Score, levels and the record do not change.
- Out of scope: other power-ups, stacking, a looping theme while powered, invincibility on demand,
  drops from asteroids, upgrades, faster firing while powered.

## Capabilities

### New Capabilities

- `gameplay/powerups`: how a pickup is dropped, collected, how long it lasts, what it does and how the
  player sees and hears it.

### Modified Capabilities

- `gameplay/combat`: the collision rules gain the invincible case — a ship touching a powered hero is
  destroyed instead of ending the run.
- `presentation/audio`: a pickup jingle joins the effect set.

## Impact

- New `src/game/powerups.ts` (pure), `src/game/pickup.ts`, an amber ship variant generated from the
  CC0 original by a script, one new sound from the CC0 pack already in use, wiring in `climb-scene.ts`.
- `prepare-audio.py` gains one line; `make-ship-variant.py` keeps the sprite reproducible.
- Risk: a pickup falling with the world gives under two seconds to reach it at level 11, so it spawns
  where the ship died, above the hero.
- Risk: too common makes the run trivial; the chance is one constant, checked by counting drops.
