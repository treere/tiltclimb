# Proposal

## Why

Firing is free and unlimited: the only limit is a 150 ms guard between taps, so the player can hold
the rhythm and shoot at everything without ever choosing. Against enemies that spawn every 3.5 s and
die to one hit, that removes the decision the game is built on — when to shoot, when to climb.

## What Changes

- **The cannon heats up when it fires**: every shot adds 30 of heat against a maximum of 100 — four
  quick shots — and the heat falls at 30 per second when it is idle.
- **Overheating locks it**: at the maximum the cannon jams and fires nothing until it has cooled to a
  reset threshold — short, but long enough that spraying costs something.
- **The state is visible**: a colour-coded heat bar above the fire button, and the button changes
  label and dims while jammed.
- **Heat is part of the run**: it cools while climbing, freezes while paused, resets at every start.
  Score, levels and record are untouched.
- Out of scope: upgrades, heat as a resource for a special shot, cooldown sounds, ship damage on
  overheat, other weapons, changes to enemy rate or health.

## Capabilities

### New Capabilities

- `gameplay/weapon-heat`: how firing heats the cannon, how it cools, what happens when it jams and
  how the player sees it.

### Modified Capabilities

- `gameplay/combat`: a shot is fired only when the cannon is not jammed, and the fire control reflects
  the heat state.

## Impact

- New `src/game/weapon-heat.ts` (pure: heat in, heat out, jammed or not), used by `climb-scene.ts`
  where the fire command and the HUD live; constants in `constants.ts`.
- The fire button already knows how to look disabled, so the visual part is a label change plus a bar.
- Risk: too short a lockout changes nothing, too long a one makes the cannon useless against several
  ships at once. The first numbers are chosen to allow four quick shots and then about two seconds of
  forced pause; they are four constants and one play test.
- Risk: the button is also disabled while paused and at the end of the run; three reasons to be
  disabled must not fight, so one function decides the state from heat, pause and run status.
