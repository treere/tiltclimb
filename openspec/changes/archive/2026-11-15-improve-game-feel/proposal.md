# Proposal

## Why

Playing on the phone the game feels mushy, and three separate causes line up:

1. The canvas is 720 px wide and nothing sets the pixel ratio: on a 3× phone the image is stretched 1.6× with a smoothing filter, and softness reads as sluggish.
2. Steering stacks two delays: a 3° dead zone swallowing 23% of a 13° full scale, then a 90 ms low-pass filter. Corrections arrive late, and crossing the screen takes 2.4 s.
3. Background tiles scroll at 0.25× the climb speed — 48 px/s. The largest surface on screen barely moves, so everything reads as slow.

The game also runs a fixed 60 Hz step, so on a 90 or 120 Hz phone every update is drawn twice.

## What Changes

- **Render at device density, capped**: pixel ratio `min(devicePixelRatio, 2.5)`, no antialiasing, pixel-art sampling.
- **Motion follows the device refresh rate**: drop the fixed 60 Hz step, keep every speed in pixels per second so physics does not change.
- **Steering with bite**: dead zone 3° → 1.5° and from hard cutoff to continuous ramp, smoothing tau 90 → 45 ms, full-scale speed 300 → 380 px/s.
- **Faster world**: tile parallax 0.25 → 0.55, background at ~105 px/s at the start.
- Out of scope: new art, archetypes and combat balance, the difficulty ramp, scoring, PWA, loading screen, menu layout.

## Capabilities

### New Capabilities

- `presentation/rendering`: pixel density, filter policy and frame pacing — how sharp and how smooth the game has to look.

### Modified Capabilities

- `input/tilt-control`: the dead zone becomes a continuous ramp with a smaller threshold, and the full-scale horizontal speed gets a stated target.
- `presentation/space-theme`: the starfield must move at a meaningful fraction of the climb speed, not a decorative crawl.

## Impact

- `src/main.ts`, `src/input/tilt-source.ts`, `src/game/constants.ts`, `src/game/starfield.ts`. No assets, no dependencies.
- Risk: rendering up to 2.5× costs fill rate on a low-end phone; the cap is one number.
- Risk: without the fixed step, a 620 px/s projectile moves 10 px per frame at 60 Hz against a 7 px radius — safe for the sizes in use, but measured, not assumed.
