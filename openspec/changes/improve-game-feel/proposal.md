# Proposal

## Why

Playing on the phone the game feels mushy, and three separate causes line up:

1. The canvas is 720 px wide and nothing sets the pixel ratio, so on a 3× phone the image is stretched 1.6× with a smoothing filter. Sprites are soft, and softness reads as sluggish.
2. Steering has two delays stacked: a 3° dead zone that swallows 23% of a 13° full scale, and a 90 ms low-pass filter on top. Small wrist corrections reach the game late, and at full tilt crossing the screen takes 2.4 s.
3. The background tiles scroll at 0.25× the climb speed, i.e. 48 px/s at the start. The largest thing on screen barely moves, so the eye reads the whole game as slow.

On top of that the game runs a fixed 60 Hz step: on a 90 or 120 Hz phone every update is drawn twice, so motion judders.

## What Changes

- **Render at device density, up to a cap**: pixel ratio `min(devicePixelRatio, 2.5)`, no antialiasing, pixel-art sampling. Hard edges from a real pixel density instead of a stretched buffer.
- **Motion follows the device refresh rate**: drop the fixed 60 Hz step, keep every speed expressed in pixels per second so the physics does not change.
- **Steering with bite**: dead zone 3° → 1.5° and, more importantly, from a hard cutoff to a continuous ramp — at the threshold the response starts from zero instead of jumping — plus smoothing tau 90 → 45 ms and full-scale speed 300 → 380 px/s (screen crossing ~1.9 s).
- **Faster world**: tile parallax 0.25 → 0.55, so the background moves at ~105 px/s at the start and grows with the climb speed instead of sitting still.
- Out of scope: new sprites or art, changes to the archetypes or the combat balance, the difficulty ramp itself, the scoring, PWA or offline mode, the loading screen and menu layout.

## Capabilities

### New Capabilities

- `presentation/rendering`: pixel density, filter policy and frame pacing — how sharp and how smooth the game has to look.

### Modified Capabilities

- `input/tilt-control`: the dead zone becomes a continuous ramp with a smaller threshold, and the full-scale horizontal speed gets a stated target.
- `presentation/space-theme`: the starfield must move at a meaningful fraction of the climb speed, not a decorative crawl.

## Impact

- `src/main.ts` (engine options), `src/input/tilt-source.ts` (dead zone math, tau), `src/game/constants.ts` (dead zone, tau, horizontal speed, parallax factor), `src/game/starfield.ts`, `src/ui/*` (labels unaffected).
- No asset changes, no new dependencies.
- Risk: rendering at up to 2.5× means ~2.5× the fragments on a low-end phone; if it costs frames the cap drops, it is one number.
- Risk: removing the fixed step could make collision resolution frame-dependent — bullets move 5 px per frame at 120 Hz and 10 px at 60 Hz against a 7 px hit radius, so the hit test stays safe, but it has to be measured, not assumed.
