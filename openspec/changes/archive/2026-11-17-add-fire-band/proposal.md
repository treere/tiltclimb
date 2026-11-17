# Proposal

## Why

Firing needs the thumb to land on a 200×84 button in the middle of the bottom edge. While steering with
the whole phone that is one more thing to aim at: missing it costs a shot, or the thumb slides and
steers instead. The bottom strip is already reserved for controls, so it may as well all be a trigger.

## What Changes

- **The whole bottom band fires**: a tap anywhere in the bottom strip fires one shot, exactly like the
  button. The band has a fixed height in logical pixels, the same on every phone.
- **Taps and drags do not fight**: the gesture is judged when the finger lifts — short and still is a
  tap that fires, longer or moving is a steering drag that never fires.
- **The button stays the visual cue**: same look, same pressed feedback, and the band ignores taps on
  it, so one tap cannot fire twice.
- **Coordinates fixed on the way**: the router reads Excalibur's `screenPos`, which drifts with the
  camera; the band and the existing drag limit move to the page position converted against the canvas.
- Out of scope: a highlight while pressed, auto-fire on hold, shooting from mid screen, heat and rate
  changes.

## Capabilities

### Modified Capabilities

- `gameplay/combat`: firing also happens by tapping the bottom band, and a steering drag must never
  fire.

## Impact

- `src/input/input-router.ts`, a new pure `src/input/tap-gesture.ts`, `src/game/climb-scene.ts`, one
  constant for the band height.
- No new assets. Heat, the single-shot guard and the pause checks apply unchanged, because every path
  still goes through `fireHero`.
- Risk: habit taps above the band do nothing — the top of the screen stays inert, which keeps steering
  safe.
- Risk: fixing the coordinates changes drag behaviour subtly near the bottom; tested at level 1 and
  deep in a run.
