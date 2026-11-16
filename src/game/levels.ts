/**
 * Levels: the run divided into steps of fixed length, each one a bit harder.
 *
 * A level depends only on the distance climbed — never on time or on enemies destroyed — so "level 3"
 * always means the same stretch of the run. Pure functions, checkable without a browser.
 */

import { ENEMY_MAX_ALIVE_EARLY, ENEMY_POOL_SIZE, SPAWN_GAP_PX } from './constants';
import { CLIMB_SPEED_MAX, CLIMB_SPEED_START } from './speed';

/** Length of a level in climbed pixels. */
export const LEVEL_PX = 1500;

/** Speed added at every level boundary: 13 px/s is about 7% of the starting speed. */
export const CLIMB_SPEED_STEP = 13;

/** Obstacle rows get this much closer at every level… */
export const OBSTACLE_GAP_STEP = 5;

/** …but never closer than this, or the field stops being readable. */
export const OBSTACLE_GAP_FLOOR = 210;

/** Levels that introduce an archetype, so the announcement matches something real. */
export const DIVER_LEVEL = 3;
export const HUNTER_LEVEL = 6;
export const UFO_LEVEL = 9;

/** Level from which a third ship may be alive at once, and one from which a fourth may. */
export const THIRD_SHIP_LEVEL = 4;
export const FOURTH_SHIP_LEVEL = UFO_LEVEL;

export type LevelSpec = {
  level: number;
  climbSpeed: number;
  maxAlive: number;
  obstacleGap: number;
};

/** Level for a height: level 1 covers 0–1499 px, level 2 starts at 1500. */
export function levelAt(heightPx: number): number {
  const height = Number.isFinite(heightPx) ? Math.max(0, heightPx) : 0;
  return Math.floor(height / LEVEL_PX) + 1;
}

/** Everything a level changes, in one place. */
export function specForLevel(level: number): LevelSpec {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  const steps = safeLevel - 1;

  const extraEnemies =
    (safeLevel >= THIRD_SHIP_LEVEL ? 1 : 0) + (safeLevel >= FOURTH_SHIP_LEVEL ? 1 : 0);

  return {
    level: safeLevel,
    climbSpeed: Math.min(CLIMB_SPEED_MAX, CLIMB_SPEED_START + steps * CLIMB_SPEED_STEP),
    maxAlive: Math.min(ENEMY_POOL_SIZE, ENEMY_MAX_ALIVE_EARLY + extraEnemies),
    obstacleGap: Math.max(OBSTACLE_GAP_FLOOR, SPAWN_GAP_PX - steps * OBSTACLE_GAP_STEP),
  };
}

/** Convenience for callers that only have a height. */
export const specAt = (heightPx: number): LevelSpec => specForLevel(levelAt(heightPx));
