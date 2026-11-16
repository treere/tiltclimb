# Proposal

## Why

A run cannot be interrupted. Glancing at a message, taking a call or switching app means coming
back to a dead ship, and a run is the only thing the game has. There is no way to stop and resume,
and nothing protects the run when the page goes to the background.

## What Changes

- **Pause control**: a round button in the top right of the run, same size and style as the audio
  toggle in the menu, reachable with a thumb and clear of the score and the fire button.
- **Frozen run**: while paused nothing advances — no scrolling, no obstacle or enemy generation,
  no projectile movement, no score growth — and no collision is evaluated, so a ship overlapping an
  asteroid while paused does not die.
- **Overlay**: a dark cover over the frozen world, the word `PAUSED` and a `RESUME` button; the same
  control that paused the run resumes it.
- **Auto-pause on a hidden page**: a phone call or a tab switch pauses the run, and it never
  resumes on its own.
- **The run always starts unpaused**, with no overlay on screen: the cover must be hidden explicitly
  when the scene starts, not left to a default.
- Out of scope: records, haptics, slow motion, tap to shoot, lives, a pause menu with settings,
  pausing from the menu or the credits.

## Capabilities

### New Capabilities

- `gameplay/pause`: stopping and resuming a run — the control, the frozen state, the overlay and
  what must not advance while paused.

## Impact

- New `src/ui/pause-toggle.ts`; changes in `src/game/climb-scene.ts` (paused state, freeze and thaw,
  overlay, visibility listener) and a few constants in `src/game/constants.ts`.
- No assets, no dependencies, no persistence: nothing is written to the device.
- Risk already seen in a first attempt: the overlay is a `ScreenElement` whose graphics component
  starts **visible**, so a run opens with the cover drawn over a live world and looks frozen. The
  fix is explicit visibility on creation and on every state change, and the first task in the list
  is a regression check for exactly that.
- Risk: freezing by stopping the engine clock also stops rendering, so the overlay would never be
  drawn. Velocities are frozen by hand instead.
