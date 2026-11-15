/**
 * Tunable constants for Tiltclimb. Values come from the design documents
 * (openspec/changes/…/design.md) and are meant to be adjusted by playing on a real
 * phone, not by reasoning about them.
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

/**
 * The ship sprite is 112×75, i.e. wider than tall, so the collider follows that shape
 * instead of the old vertical bar. The collider is slightly smaller than the sprite.
 */
export const PLAYER_VISUAL_WIDTH = 64;
export const PLAYER_VISUAL_HEIGHT = 43;
export const PLAYER_HITBOX_WIDTH = 56;
export const PLAYER_HITBOX_HEIGHT = 34;

/** Asteroids are drawn 90 px wide; the circular collider is smaller, so near misses forgive. */
export const OBSTACLE_VISUAL_WIDTH = 90;
export const OBSTACLE_RADIUS = 33;

/** World pixels per score point. */
export const PIXELS_PER_POINT = 20;

export const BACKGROUND_COLOR = '#0e1116';

/** Parallax speed factors, relative to CLIMB_SPEED. */
export const STARFIELD_TILE_FACTOR = 0.25;
export const STARFIELD_NEAR_FACTOR = 1;
export const STARFIELD_FAR_FACTOR = 0.6;
export const MENU_STARFIELD_FACTOR = 0.12;
