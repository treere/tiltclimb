# Tasks

## 1. The table, as a pure function

- [x] 1.1 Create `src/game/biomes.ts` with `BIOME_LEVELS`, `BIOMES`, `biomeAt` and `isBiomeBoundary`; check: Node probe over levels 1, 5, 6, 20, 21, 25, 0 and NaN
- [x] 1.2 Confirm the cycle repeats with the fourth biome; check: probe reads level 21 → first biome, level 26 → second
- [x] 1.3 Confirm nothing in gameplay imports `biomes.ts`; check: grep over `src/game`, only the starfield and the scene appear

## 2. The palettes

- [x] 2.1 Write `scripts/make-biome-backgrounds.py` to rotate the hue of `darkPurple.png` into cobalt, teal and rust; check: three files written, same size, and a pixel diff against the source proving they changed
- [x] 2.2 Register the three images in `src/game/sprites.ts` and in the loader resources; check: `npm run check` green and a browser test listing the loaded images without 404
- [x] 2.3 Look at a screenshot of each biome with asteroids, enemies and the powered amber ship; check: contrast holds, no hue swallows a hazard, judged by eye

## 3. The crossfade

- [x] 3.1 Add the second tile set to `Starfield`, invisible, with the same travel; check: browser test reads six tiles, three visible
- [x] 3.2 Add `setBackground(source, fadeMs = 600)` driven by `update`; check: browser test samples tile opacities and sees them cross within ~600 ms of game time
- [x] 3.3 Confirm the crossfade pauses with the game and leaves no gap; check: browser test screenshots during the fade in each biome

## 4. The announcement

- [x] 4.1 `enterLevel` branches on `isBiomeBoundary`: `SECTOR n · NAME` at a boundary, `LEVEL n` inside; check: browser test reads the banner text at levels 5, 6 and 7
- [x] 4.2 The swap is triggered on the same boundary and only once; check: browser test jumps the ship 7.500 px and reads the background source once
- [x] 4.3 A new run starts in the first biome with time and palette restored; check: browser test plays to level 6, returns to the menu, starts again and reads the first palette

## 5. Docs and device check

- [x] 5.1 Document the four biomes, their levels and the hue derivation in `README.md` and the credits; check: `npm run check` green
- [x] 5.2 Play on the phone across a boundary: does the change read as travelling, is the announcement legible; check: judgement by hand
- [x] 5.3 Tune hues or fade duration if needed; check: constants and the script updated, probes still green

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing both spec deltas
