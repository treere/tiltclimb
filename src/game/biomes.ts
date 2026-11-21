/**
 * Biomes: the run painted in five-level stretches.
 *
 * A biome depends only on the level, which depends only on the distance climbed, so the same level
 * always shows the same sky and nothing has to be stored. Biomes are presentation only: no gameplay
 * constant may be read from here, or the record would stop being comparable across skies.
 */

/** Levels per biome. */
export const BIOME_LEVELS = 5;

export type Biome = {
  id: string;
  /** Shown in the banner when the biome begins. */
  name: string;
  /** Background tile image, relative to the Kenney asset folder. */
  background: string;
};

/**
 * The four skies, in the order the run meets them. Hues are deliberately far apart — purple, cobalt,
 * teal, rust — because nearby shades read as a graphics bug rather than as a different place.
 */
export const BIOMES: readonly Biome[] = [
  { id: 'orbit', name: 'LOW ORBIT', background: 'darkPurple.png' },
  { id: 'belt', name: 'ASTEROID BELT', background: 'bgCobalt.png' },
  { id: 'freeze', name: 'FROZEN DRIFT', background: 'bgTeal.png' },
  { id: 'rust', name: 'RUST CLOUD', background: 'bgRust.png' },
];

/** Index of the biome for a level, wrapped into the table. Level 1 is the first biome. */
export function biomeIndexAt(level: number): number {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  return Math.floor((safeLevel - 1) / BIOME_LEVELS) % BIOMES.length;
}

/** The biome for a level. */
export function biomeAt(level: number): Biome {
  return BIOMES[biomeIndexAt(level)] as Biome;
}

/** True on the first level of a biome: the moment the sky changes and the sector is announced. */
export function isBiomeBoundary(level: number): boolean {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  return (safeLevel - 1) % BIOME_LEVELS === 0;
}

/** Sector number for the banner: counts inside the cycle, so it restarts with the palette. */
export function sectorNumber(level: number): number {
  return biomeIndexAt(level) + 1;
}
