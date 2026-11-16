# Proposal

## Why

Difficulty grows smoothly and nothing marks progress except a number in the corner: a run has no
shape, no "I got to level 5 last time", no moment where the game visibly changes.

## What Changes

- **Endless levels of 1,500 px**: level 1 is the first 1,500 px climbed, and so on with no upper
  bound. The level depends only on distance climbed, never on time or kills.
- **Each level is one step harder**, replacing the smooth ramp: climb speed +13 px/s per level up to
  320 (level 11), one more enemy alive from level 4, obstacle gap −5 px per level down to a floor.
  Difficulty stops at the ceilings; the counter does not.
- **The level is visible while playing**: a permanent `LV 3` under the score, plus a short `LEVEL 3`
  banner at each change. The score keeps the visual weight.
- **The score is untouched**: same formula, and the record is still the score. The level is a stage,
  not a ranking.
- **Archetypes unlock on boundaries**: diver at level 3, hunter at 6, UFO at 9, so what appears
  matches the step the player is on.
- Out of scope: a fixed number of levels, victory, level select, per-level bests, names, story beats,
  changes to the score formula or the record.

## Capabilities

### New Capabilities

- `gameplay/levels`: how the run is divided into steps, what triggers a step, what the step changes
  and how it is shown.

### Modified Capabilities

- `gameplay/difficulty-ramp`: the speed grows in level-sized steps instead of continuously.
- `gameplay/combat`: the number of ships alive at once and the appearance of the harder archetypes
  follow the level instead of raw height.

## Impact

- `src/game/levels.ts` (new, pure: level from height, and the values for a level), `speed.ts`,
  `enemy-archetypes.ts`, `climb-scene.ts` (level state, banner, HUD label), `constants.ts`.
- No asset changes, no storage changes: the record keeps its keys.
- Risk: stepwise difficulty can feel like a wall — every 1,500 px the speed jumps. Mitigated by small
  steps (13 px/s is ~7% of the starting speed) and a banner that announces the change.
- Risk: obstacle density must stay fair at the floor of the gap; verified by counting rows per
  1,000 px at level 1 and at the ceiling.
