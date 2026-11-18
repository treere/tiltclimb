# Proposal

## Why

A run ends the instant the obstacle touches the ship: the explosion spawns, everything freezes, and
500 ms later the menu is already there. The hardest moment of the game — the one that decides whether
the player tries again — is also the one that goes by fastest. Slowing the world down for a beat makes
the impact readable and gives the loss a shape.

## What Changes

- **The world decelerates on death**: for a short window after the collision, time runs at a quarter
  speed. The starfield and the scrolling crawl, while the blast plays out in front of them at its own
  speed — slowing the explosion too would show it one frame at a time, which reads as frozen.
- **Nothing new happens during the beat**: no spawns, no collisions, no score. The world is slowing,
  not continuing — a death must never be a chance to gain a point.
- **The beat is fixed and short**: 400 ms of wall-clock time, then normal speed for the rest of the
  exit and the menu as today. It is a beat, not a cutscene, and it does not depend on frame rate.
- **The effect always ends**: restoring the timescale happens on the exit path, on a scene change and
  when the page is hidden mid-beat, so a run can never start at a slowed speed.
- Out of scope: slow motion for kills, a slow-motion button, camera zoom on the blast, desaturation or
  other post-processing.

## Capabilities

### New Capabilities

- `presentation/death-beat`: the short deceleration that plays between the fatal impact and the menu.

### Modified Capabilities

- `gameplay/endless-climb`: the world still stops at the end of a run, but a brief deceleration
  precedes the stop.

## Impact

- `src/game/climb-scene.ts`: a `dying` phase in the update loop (tick the blast and the starfield, skip
  the rest) plus `engine.timescale`;
- `src/game/constants.ts`: the two values, timescale and duration;
- no assets, no audio, no storage.

- Risk: a timescale left behind at 0.25 would make the next run crawl — hence the three restore points
  and a browser check that starts a second run after a death.
- Risk: with slow motion the blast is on screen longer, so the verdict sting at 420 ms now lands on an
  explosion still in progress. It may need to move after the beat.
