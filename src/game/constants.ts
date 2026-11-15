/**
 * Tunable constants for Tiltclimb. Values come from the design document
 * (openspec/changes/add-endless-climb-core/design.md) and are meant to be
 * adjusted by playing on a real phone, not by reasoning about them.
 */

/** Logical resolution. The engine scales it to the screen via DisplayMode.FitScreen. */
export const WORLD_WIDTH = 720;
export const WORLD_HEIGHT = 1280;

/** How fast the player climbs, in logical pixels per second. */
export const CLIMB_SPEED = 190;

/** Horizontal speed at full tilt, in logical pixels per second. */
export const MAX_HORIZONTAL_SPEED = 300;

/** Tilt below this many degrees is treated as zero, so a still hand does not drift. */
export const TILT_DEAD_ZONE_DEG = 3;

/** Tilt at which the horizontal speed saturates. */
export const TILT_RANGE_DEG = 22;

/** Time constant of the exponential smoothing applied to the tilt axis (ms). */
export const TILT_SMOOTH_TAU_MS = 90;

/** If no deviceorientation event arrives within this window, the sensor is written off. */
export const TILT_TIMEOUT_MS = 1500;

export const OBSTACLE_POOL_SIZE = 24;

/** World distance between two consecutive obstacle rows. */
export const SPAWN_GAP_PX = 260;

export const PLAYER_WIDTH = 44;
export const PLAYER_HEIGHT = 56;

export const OBSTACLE_WIDTH = 120;
export const OBSTACLE_HEIGHT = 28;

/** Collider smaller than the sprite, so near misses feel fair. */
export const HITBOX_SCALE = 0.8;

/** World pixels per score point. */
export const PIXELS_PER_POINT = 20;

/** Legacy favicon-less canvas background, keeps the frame from flashing white. */
export const BACKGROUND_COLOR = '#0e1116';
