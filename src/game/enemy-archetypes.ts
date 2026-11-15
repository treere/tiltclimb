import { ENEMY_MAX_ALIVE_EARLY, ENEMY_MAX_ALIVE_LATE } from './constants';

export type EnemyKind = 'patrol' | 'diver' | 'hunter' | 'ufo';

export type FirePattern = {
  /** Pause between one burst and the next. */
  intervalMs: number;
  /** Volleys fired in a single burst. */
  burst: number;
  /** Pause between volleys inside a burst. */
  burstGapMs: number;
  /** Bullet speed, px/s. */
  speed: number;
  /** Directions in radians, 0 = straight down. */
  angles: number[];
};

export type HoverBehaviour = {
  /** Height on screen where the ship stops, as a fraction of the view (0 = top). */
  screenFraction: number;
  bobAmplitude: number;
  bobOmega: number;
};

export type Archetype = {
  kind: EnemyKind;
  label: string;
  /** File under public/assets/kenney. A string, not an ImageSource, so this table stays pure. */
  spriteFile: string;
  points: number;
  /** Climb height, in world px, from which this kind may appear. */
  unlockHeight: number;
  visualWidth: number;
  hitRadius: number;
  /** Descent speed on screen, px/s. The camera rising is accounted for by the actor. */
  descent: number;
  weave?: { amplitude: number; omega: number };
  /** Constant horizontal drift, px/s (sign is chosen at spawn). */
  drift?: number;
  /** Max horizontal speed while chasing the hero, px/s. */
  tracking?: number;
  hover?: HoverBehaviour;
  fire: FirePattern;
};

/**
 * The four enemy types. Everything that distinguishes them lives here: adding a fifth
 * archetype is a new entry in this table, not a new class.
 */
export const ARCHETYPES: Record<EnemyKind, Archetype> = {
  patrol: {
    kind: 'patrol',
    label: 'pattuglia',
    spriteFile: 'enemyRed1.png',
    points: 25,
    unlockHeight: 0,
    visualWidth: 72,
    hitRadius: 26,
    descent: 120,
    weave: { amplitude: 110, omega: 1.8 },
    fire: { intervalMs: 2200, burst: 1, burstGapMs: 0, speed: 320, angles: [0] },
  },
  diver: {
    kind: 'diver',
    label: 'picchiatore',
    spriteFile: 'enemyBlue4.png',
    points: 35,
    unlockHeight: 2500,
    visualWidth: 66,
    hitRadius: 24,
    descent: 260,
    drift: 120,
    fire: { intervalMs: 2600, burst: 2, burstGapMs: 200, speed: 340, angles: [0] },
  },
  hunter: {
    kind: 'hunter',
    label: 'cacciatore',
    spriteFile: 'enemyGreen2.png',
    points: 45,
    unlockHeight: 6000,
    visualWidth: 76,
    hitRadius: 26,
    descent: 100,
    tracking: 150,
    fire: { intervalMs: 2400, burst: 1, burstGapMs: 0, speed: 300, angles: [-0.31, 0, 0.31] },
  },
  ufo: {
    kind: 'ufo',
    label: 'torretta',
    spriteFile: 'ufoYellow.png',
    points: 60,
    unlockHeight: 10000,
    visualWidth: 76,
    hitRadius: 28,
    descent: 150,
    hover: { screenFraction: 0.42, bobAmplitude: 24, bobOmega: 1.2 },
    fire: { intervalMs: 5000, burst: 4, burstGapMs: 200, speed: 260, angles: [0] },
  },
};

/** Ordered from easiest to hardest: used both for unlocks and for reading the table. */
export const ARCHETYPE_ORDER: EnemyKind[] = ['patrol', 'diver', 'hunter', 'ufo'];

/** Kinds unlocked at a given climb height. Patrol is always there, so this never returns empty. */
export function kindsAvailableAt(heightPx: number): EnemyKind[] {
  return ARCHETYPE_ORDER.filter((kind) => heightPx >= ARCHETYPES[kind].unlockHeight);
}

/** How many enemies may be alive at once: more pressure once the hunter shows up. */
export function maxAliveAt(heightPx: number): number {
  return heightPx >= ARCHETYPES.hunter.unlockHeight ? ENEMY_MAX_ALIVE_LATE : ENEMY_MAX_ALIVE_EARLY;
}
