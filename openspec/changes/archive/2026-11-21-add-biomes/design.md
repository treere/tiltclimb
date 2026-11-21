# Design

## Context

See `proposal.md`. The starfield (`src/game/starfield.ts`) owns three `ScreenElement` tiles that scroll
and wrap, each showing `backgroundImage` (`darkPurple.png`) scaled to the world width, plus 26 stars from
three star sprites. Tiles are at `z: -100 + row`.

`levels.ts` already derives everything a level changes from the climbed height through pure functions
(`levelAt`, `specForLevel`); levels are 1500 px and the level banner is set by `enterLevel(level)`.

Excalibur 1.0.1 has no sprite tint, which is why the amber ship variant exists as a generated image —
biome palettes follow the same route.

## Goals / Non-Goals

**Goals:** four clearly different skies, a five-level rhythm, an announced sector, no gameplay change,
no new artwork.

**Non-Goals:** biome-specific hazards or enemies, generated textures per level, a biome selector, music
changes.

## Decisions

### 1. Biomes are a pure table plus one function

```ts
export const BIOME_LEVELS = 5;

export type Biome = { id: string; name: string; background: string };

export const BIOMES: Biome[] = [
  { id: 'orbit',    name: 'LOW ORBIT',       background: 'darkPurple.png' },
  { id: 'belt',     name: 'ASTEROID BELT',   background: 'bgCobalt.png' },
  { id: 'nebula',   name: 'COBALT NEBULA',   background: 'bgTeal.png' },
  { id: 'ice',      name: 'FROZEN BELT',     background: 'bgRust.png' },
];

export function biomeAt(level: number): Biome;
export function isBiomeBoundary(level: number): boolean;
```

`biomeAt` is `Math.floor((max(1, level) - 1) / BIOME_LEVELS) % BIOMES.length`: the same level always shows
the same biome, and nothing is stored, so a run started at level 1 and one reached after a long climb
agree.

The existing `darkPurple.png` stays the first biome, so the beginning of the game looks like the game we
already shipped and the change is visible only where it should be — from level 6.

### 2. Palettes are hue-rotated copies generated at build time

`scripts/make-biome-backgrounds.py`, in the style of `scripts/make-ship-variant.py`, rotates the hue of
`darkPurple.png` by fixed amounts to produce cobalt, teal and rust, then writes them next to it. The
source is CC0, the derivatives are documented in the credits next to the originals.

The four hues are chosen far apart on purpose: hue rotation is cheap, and four shades of purple would
read as a graphics bug rather than four places. The palette must keep the asteroids — brown — separated
from the background, so no biome may be brown or red at a similar lightness.

### 3. Two tile sets and one crossfade

`Starfield` gains `setBackground(source: ex.ImageSource, fadeMs = 600)`:

- three extra tiles are created once, in the constructor, invisible, at `z: -99 + row`;
- on `setBackground`, the incoming set is pointed at the new source, made visible at opacity 0 and
  faded to 1 while the outgoing set fades to 0;
- when the fade ends, the roles swap and the old set becomes invisible.

Six tiles instead of three, allocated once: no allocation during a run, which is the rule this project
follows for pools. The `update` loop moves every visible tile, so both sets keep scrolling during the
fade and no seam appears.

The crossfade is driven by the scene's `elapsed` in `starfield.update`, not by a timer, so it pauses with
the game and survives a hidden tab.

### 4. The banner: sector at a boundary, level inside

`enterLevel` gains one branch: if `isBiomeBoundary(level)`, the banner reads `SECTOR n · NAME` and the
background swap is triggered; otherwise `LEVEL n` as today. The same banner is already used for archetype
announcements, so nothing new appears on screen.

The sector number is the biome index plus one (`SECTOR 1` to `SECTOR 4`), counted in the cycle, so it
restarts with the cycle rather than growing forever. A run that cycles shows `SECTOR 1` again — the name
is what the player recognises.

### 5. Nothing else reads the biome

No gameplay code calls `biomeAt`. That is the guarantee that the record stays comparable: the biome is a
presentation concern, and the only listeners are the starfield and the banner.

## Risks / Trade-offs

- **A hue-rotated sky can clash with hazards** → pick hues, then look at a screenshot of each biome with
  asteroids, enemies and the amber powered ship on screen, and check contrast before shipping.
- **The crossfade needs both sets scroll-locked**, or the horizon jumps mid-fade → both sets are moved by
  the same travel in the same update.
- **Frequent boundaries feel chatty** → five levels is about 7.500 px, roughly a minute of play: one
  announcement per minute is a beat, not noise. The banner keeps the existing duration.
- **Level 11–15 and 16–20 use generated names from a shared list** → the table has exactly four entries,
  so there is nothing to drift.
