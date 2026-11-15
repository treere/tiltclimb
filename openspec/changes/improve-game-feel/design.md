# Design

## Context

See `proposal.md`. Current values, from `src/game/constants.ts`, `src/game/speed.ts` and `src/main.ts`:

| What | Now | Proposed |
| --- | --- | --- |
| Canvas pixel ratio | none set (buffer 720 px wide) | `min(devicePixelRatio, 2.5)` |
| Antialiasing / sampling | smoothing on | `antialiasing: false`, `pixelArt: true` |
| Update pacing | `fixedUpdateFps: 60` | real delta time per frame |
| Dead zone | 3°, hard cutoff | 1.5°, continuous ramp |
| Smoothing tau | 90 ms | 45 ms |
| Full-scale horizontal speed | 300 px/s (2.4 s per screen) | 380 px/s (1.9 s per screen) |
| Tile parallax factor | 0.25 (48 px/s at start) | 0.55 (~105 px/s at start) |

## Goals / Non-Goals

**Goals:** the image should be sharp at native density, the ship should answer the wrist without lag, and the world should visibly move.

**Non-Goals:** new art, combat rebalance, difficulty curve changes, menu or loading work.

## Decisions

### 1. Render at device density, capped

```ts
const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
new ex.Engine({ width: WORLD_WIDTH, height: WORLD_HEIGHT, pixelRatio, antialiasing: false, pixelArt: true, ... });
```

Excalibur multiplies the backing store by `pixelRatio` and keeps the logical resolution at 720×1280, so all the existing geometry — hitboxes, positions, constants — stays valid; only the number of pixels changes. The cap exists because cost grows with the square: at 3× the fragment count is 1.44× that of 2.5×, and a phone that drops frames looks worse than one that is slightly less sharp.

`antialiasing: false` plus `pixelArt: true` also switches sprite sampling to nearest, which is what makes the Kenney art keep its edges. Without it, a sprite drawn at 64 px from a 112 px source and then upscaled is filtered twice.

**Why it feels "mushy"**: at 393 pt @3× the phone has 1179 physical pixels of width; the buffer had 720. A 1.64× bilinear upscale on 1-pixel details is exactly the "soft dough" look.

### 2. Real delta time instead of a fixed 60 Hz step

The original comment chose `fixedUpdateFps: 60` so the climb speed would not depend on the refresh rate. That concern is already solved by the physics: every speed is in px/s and integrated with `vel * dt`. What the fixed step actually buys is determinism, and what it costs is that on a 120 Hz phone every state is drawn twice — the motion looks like it advances in pairs.

Removing it means `onPreUpdate` receives the real elapsed time. Motion becomes as smooth as the screen allows, and the same run on 60 and 120 Hz covers the same distance per second.

**Collision safety**: the fastest thing in the world is the hero shot at 620 px/s. At 120 Hz that is 5.2 px per frame, at 60 Hz 10.3 px, against a projectile hit radius of 7 px and enemy colliders of 20–33 px. The hit test is a circle overlap evaluated once per frame, so a 10 px step can skip a 7 px radius on a small target — acceptable for enemy hits, but it must be measured rather than assumed: the task list checks it with a simulated fast frame.

### 3. Dead zone as a ramp, not a cutoff

Today the code is `|relative| < 3° ? 0 : relative`, then divides by the range. Two effects: everything under 3° does nothing (23% of a 13° throw), and at exactly 3° the axis jumps to a non-zero value.

```ts
const magnitude = Math.max(0, Math.abs(relative) - TILT_DEAD_ZONE_DEG);
const normalized = clamp((Math.sign(relative) * magnitude) / (this.rangeDeg - TILT_DEAD_ZONE_DEG), -1, 1);
```

Now the threshold only decides *where the response starts*, not how big the first step is: at 1.5° the axis is 0 and it grows from there. That is why the threshold can be halved without making the ship twitchy — the jitter rejection comes from the ramp plus the filter, not from a wide dead band.

### 4. Shorter filter, faster saturation

tau 90 → 45 ms: 63% of the target speed after 45 ms, 90% after 103 ms. Combined with the ramp, a deliberate correction is visible in about a tenth of a second — still filtered enough that a wobbling hand does not shake the ship.

Full-scale speed 300 → 380 px/s: crossing the 720 px logical width takes 1.9 s instead of 2.4 s. This is the "bite" number; it is a constant and one commit to change.

### 5. Tiles at 0.55× the climb speed

The tiles are the background layer the eye reads as "the world is moving". At 0.25× they crawl at 48 px/s while the ship climbs at 190, so the largest visual surface contradicts the speed. At 0.55× they move ~105 px/s at the start and scale with the climb speed, which is already passed into the starfield.

## Risks / Trade-offs

- **Fill rate on low-end phones** → cap at 2.5×; if frames drop, lower the cap first, not the gameplay.
- **No filter on text drawn in canvas** → the UI text is drawn with `fillText` into the same buffer; disabling smoothing does not change text rendering (it is rasterised at buffer resolution), but it must be checked on screen: the buttons have a history of centring issues.
- **Shorter tau exposes sensor noise** → dead zone ramp at 1.5° plus the 45 ms filter; if a phone's sensor is very noisy, tau is the knob to raise, not the dead zone.
- **Removing the fixed step changes the feel of collision** → verified by a numeric probe with a simulated 8 ms frame; if a projectile can tunnel, the fix is a swept check on that one path, not going back to fixed 60 Hz.

## Migration Plan

No data or save migration. The pixel ratio reads `window.devicePixelRatio` at start; the sensitivity level stored on the device keeps working unchanged, because the range still means "degrees to full scale".
