# Proposal

## Why

The game is readable but too slow and too "stiff": with 22° of tilt to reach full scale, on a phone you end up rotating your wrist a lot to move a little, and the climb at 190 px/s stays identical for the whole run. The two things together remove the curve: no moment in which the game asks for more, and no way to adapt the steering to your own hand.

## What Changes

- **Higher sensitivity by default**: full scale drops from 22° to 13° of tilt, so the same tilt moves the ship much more. With the same 3° dead zone, to keep the center from becoming twitchy.
- **Sensitivity configurable from the home**: five levels (22°, 17°, 13°, 10°, 8°, so from "soft" to "twitchy"), selectable with `−` and `+` in the menu, shown as level and as degrees. The choice is remembered on the device.
- **Change without recalibrating**: sensitivity only scales the amplitude, not the zero, so changing it does not require redoing the calibration.
- **Progressive climb speed**: the climb starts at 190 px/s and grows with the height gained, up to a cap of 320 px/s. The growth is tied to pixels scrolled, not to time: two runs over the same path have the same difficulty.
- **Coherent scrolling**: parallax, enemies and obstacles follow the current speed instead of the constant, so the world does not drift when the game accelerates.
- Out of scope: difficulty selectable by hand, waves, bosses, changes to the enemy rate, new obstacles, changes to the score.

## Capabilities

### New Capabilities

- `gameplay/difficulty-ramp`: the climb speed grows with height, with a cap, deterministically and consistently with everything that scrolls.

### Modified Capabilities

- `input/tilt-control`: sensitivity becomes a leveled setting, with a more responsive default and persistence; calibration does not depend on it.
- `ui/start-menu`: the menu hosts the sensitivity control, visible with the current level and the corresponding degrees.

## Impact

- Code: new `src/game/speed.ts` (pure function of the speed based on height), `src/input/tilt-settings.ts` (levels and persistence), used in `climb-scene.ts`, `player.ts`, `starfield.ts`, `enemy.ts`, and a new control in `menu-scene.ts`.
- Constants: `TILT_RANGE_DEG` becomes the default level (16°), `CLIMB_SPEED` stays as the initial speed and `CLIMB_SPEED_MAX` is born.
- The sensitivity change touches the feel of every run: it must be tried by hand on the phone, not just measured.
- Main risk: with more sensitivity and more speed together, the late part of the run can become unmanageable; that is why the speed cap is low and the maximum sensitivity is the user's choice.
