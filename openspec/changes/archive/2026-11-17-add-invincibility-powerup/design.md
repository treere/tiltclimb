# Design

## Context

See `proposal.md`. What the code offers today:

- `ClimbScene.resolveHits()` is hand-rolled: hero shots destroy ships, enemy shots and ships end the
  run, asteroids end the run through the engine's `collisionstart` on the player actor.
- The hero sprite comes from `imageSources()` in `sprites.ts` (`playerShip2_blue`), and `PlayerShip`
  sets it through `graphics.use(...)`.
- Audio effects are a table in `audio/sounds.ts` (`SHOT_BY_KIND`, `KILL_BY_KIND`, plus a few named
  ones), with files built by `scripts/prepare-audio.py` from a CC0 pack already downloaded.
- The level, the heat and the score already show the pattern to follow: a pure module, wired into the
  scene, with the HUD reading it.

## Goals / Non-Goals

**Goals:** a rare, unmistakable window where the hero becomes the danger; visible and audible; frozen
by pause; no stacking.

**Non-Goals:** other power-ups, loops or new music tracks, permanent upgrades, drops from asteroids.

## Decisions

### 1. `src/game/powerups.ts` is pure

```ts
export const DROP_CHANCE = 0.1;          // one ship in ten leaves something
export const POWERUP_MS = 8000;          // eight seconds of invincibility
export const WARN_MS = 2000;             // last two seconds: blinking

export type PowerUpState = { remainingMs: number };
export const IDLE: PowerUpState = { remainingMs: 0 };

export const isActive = (state: PowerUpState): boolean => state.remainingMs > 0;
export const isWarning = (state: PowerUpState): boolean =>
  state.remainingMs > 0 && state.remainingMs <= WARN_MS;

/** Taking a pickup restarts the timer: it never adds to what is left. */
export const afterPickup = (): PowerUpState => ({ remainingMs: POWERUP_MS });
export const afterTime = (state: PowerUpState, dtMs: number): PowerUpState =>
  ({ remainingMs: Math.max(0, state.remainingMs - Math.max(0, dtMs)) });

export function shouldDrop(random: number): boolean {
  return random < DROP_CHANCE;
}
```

`shouldDrop` takes the random number instead of calling `Math.random()`: the drop is the one thing a
test cannot repeat otherwise.

### 2. The pickup is an actor that falls with the world

`src/game/pickup.ts`: a `Pickup extends ex.Actor` using `star1.png` scaled to ~40 px with a slow
rotation, spawned at the position of the destroyed ship. It has no velocity of its own: the world
scrolls past it, exactly like an asteroid, so it stays where the kill happened and the player has the
time between there and the bottom of the screen to reach it. One instance at a time — a second drop
while one is falling replaces the first, so the screen cannot fill with pickups.

Collection is a circle test against the hero in `resolveHits`, next to the other hand-rolled
collisions; a pickup below the camera is released.

### 3. Invincibility changes only the collision rules

In `resolveHits`, when `isActive(powerUp)`:

- hero shot vs ship: unchanged;
- enemy shot vs hero: the projectile is released and the run continues;
- ship vs hero: the ship is destroyed with `explosions.burst`, `KILL_BY_KIND`, points and a kill, and
  the run continues;
- asteroid vs hero: the engine's `collisionstart` handler checks the state and does nothing when
  powered.

That last one is the reason the handler becomes a method instead of an inline arrow: it now has a
condition.

### 4. The timer runs on the game clock

`onPreUpdate` decrements it with `elapsed`, which already freezes on pause and stops after the run
ends. `startRun` resets it to `IDLE`.

### 5. Visuals: a recoloured copy of the same sprite, and a blink

The powered look is a second PNG derived from the CC0 original by `scripts/make-ship-variant.py`
(a hue shift towards amber, same silhouette), because tinting a sprite is not something Excalibur
1.0.1 exposes and swapping textures is exact and testable. `PlayerShip` gets `setPowered(on)` which
does `graphics.use(amber ? amberSprite : normalSprite)`; while `isWarning`, the scene toggles it every
120 ms with a wall-clock timer, and on expiry forces the normal sprite back.

### 6. Audio: one more effect, no new music

`prepare-audio.py` gains `'pickup': 'sfx_sounds_powerup2.wav'`; `audio/sounds.ts` gains
`effectSounds.pickup` and `audio.playSfx('pickup')` runs when the pickup is collected. A looping
power theme is deliberately out of scope: it would mean a third music track and a crossfade path.

## Risks / Trade-offs

- **Too common** → 10% per kill; a `shouldDrop` probe sweeps 10,000 draws and checks the rate.
- **Too strong** → eight seconds against a spawn interval of 3.5 s is about two extra kills; the
  duration is one constant.
- **Blink stuck on** → the scene forces the normal sprite when the timer hits zero *and* in `startRun`,
  and the probe checks the state after a forced expiry.
- **Pickup unreachable at high levels** → it spawns where the ship died, which is above the hero: with
  the fastest scroll that is still ~2 s.
- **Second sprite not loading** → the amber PNG is committed, not generated at build time, and its
  dimensions are checked against the original.
