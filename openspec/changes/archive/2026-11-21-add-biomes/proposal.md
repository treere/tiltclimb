# Proposal

## Why

From level 5 onward the run looks exactly like level 1: same purple sky, same stars, same asteroid
field. Distance is a number in the corner and nothing else tells the player they have travelled. Levels
make the game harder, but they do not make it feel further away. Biomes fix that with colours instead
of new mechanics — the cheapest way to give a climb a sense of place.

## What Changes

- **A biome spans five levels**: levels 1–5 are the first, 6–10 the second, and so on. A run cycles
  through four biomes and starts over, so an endless climb keeps naming new sectors.
- **Each biome is the same starfield in a different palette**: the background tiles are the existing CC0
  texture rotated in hue, generated at build time. No new artwork and nothing to download beyond four
  small variants.
- **The swap is a crossfade**, about 600 ms, so the sky changes rather than pops.
- **The sector is announced**: crossing into a new biome, the banner shows its name instead of the level
  number — `SECTOR 2 · ASTEROID BELT`. Inside a biome the banner keeps showing the level.
- **Biomes change nothing you can score**: speed, spawn rate, points and archetypes stay exactly as the
  levels define them. The record has to stay comparable across biomes, and "the sky is green" must never
  mean "it is harder now".
- Out of scope: biome-specific obstacles or enemies, weather, hazards, music changes, a biome selector.

## Capabilities

### New Capabilities

- `presentation/biomes`: the five-level palette cycle, its names and the announcement.

### Modified Capabilities

- `presentation/space-theme`: the background is no longer one fixed palette; the starfield requirement
  stands unchanged, but the tiles it scrolls now come from the current biome.

## Impact

- `src/game/biomes.ts` (pure table and `biomeAt(level)`), a generation script for the four backgrounds,
  `src/game/starfield.ts` (two tile sets and the crossfade), `src/game/climb-scene.ts` (banner),
  `src/game/sprites.ts` and the loader resources.
- No storage, no audio, no gameplay constants touched.
- Risk: hue rotation is cheap and can look cheap — the four hues have to be clearly distinct (purple,
  cobalt, deep teal, rust) and must not swallow the asteroids or the amber powered ship.
- Risk: the crossfade doubles the tile actors from three to six; that is the whole cost of the effect.
