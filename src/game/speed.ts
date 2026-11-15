/**
 * Climb speed as a function of height. A pure function on purpose: it can be checked in Node
 * without a browser, and the scene cannot invent a different curve by accident.
 *
 * The speed is tied to pixels climbed, not to elapsed time: "6000 px" always means the same
 * difficulty, whatever the player did before getting there.
 */

/** Speed at the start of a run, in logical pixels per second. */
export const CLIMB_SPEED_START = 190;

/** Ceiling: about 1.7× the start, reached around 9600 px. */
export const CLIMB_SPEED_MAX = 320;

/** How much the speed grows per pixel climbed. */
export const CLIMB_SPEED_PER_PX = 0.0135;

export function climbSpeedAt(heightPx: number): number {
  const climbed = Number.isFinite(heightPx) ? Math.max(0, heightPx) : 0;
  return Math.min(CLIMB_SPEED_MAX, CLIMB_SPEED_START + climbed * CLIMB_SPEED_PER_PX);
}

/** Height at which the speed stops growing. Useful for documentation and tests. */
export const CLIMB_SPEED_CAP_PX = (CLIMB_SPEED_MAX - CLIMB_SPEED_START) / CLIMB_SPEED_PER_PX;
