/**
 * Climb speed bounds. The value for a level lives in `levels.ts`: the speed now grows in level-sized
 * steps instead of continuously, so there is no per-pixel ramp any more.
 */

/** Speed at the start of a run, in logical pixels per second. */
export const CLIMB_SPEED_START = 190;

/** Ceiling, reached at the level where the steps add up to it. */
export const CLIMB_SPEED_MAX = 320;
