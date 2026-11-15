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

/**
 * Where the ship sits on screen, 0 = top, 1 = bottom. Below the centre on purpose: the user
 * must see the asteroid field it is flying into, not the empty space behind it.
 */
export const PLAYER_SCREEN_FRACTION = 0.72;

/** World pixels per score point. */
export const PIXELS_PER_POINT = 20;

/** Combat. All speeds in world px/s, all intervals in ms. */
export const PROJECTILE_POOL_SIZE = 40;
export const PROJECTILE_HIT_RADIUS = 6;
export const HERO_SHOT_SPEED = 620;
export const ENEMY_SHOT_SPEED = 320;
export const SHOT_MIN_INTERVAL_MS = 150;
export const KILL_POINTS = 25;

export const ENEMY_VISUAL_WIDTH = 72;
export const ENEMY_HIT_RADIUS = 26;
export const ENEMY_POOL_SIZE = 4;
export const ENEMY_MAX_ALIVE = 2;
/** How fast an enemy crosses the screen downwards, once the rising camera is accounted for. */
export const ENEMY_SCREEN_DESCENT = 120;
export const ENEMY_WEAVE_AMPLITUDE = 110;
export const ENEMY_WEAVE_OMEGA = 1.8;
export const ENEMY_SPAWN_INTERVAL_MS = 3500;
export const ENEMY_FIRE_INTERVAL_MS = 2200;

/** Collider used for the hero when cheking bullet and ship hits: forgiving by design. */
export const HERO_HIT_RADIUS = 20;

export const FIRE_BUTTON_WIDTH = 200;
export const FIRE_BUTTON_HEIGHT = 84;

export const BACKGROUND_COLOR = '#0e1116';

/** Parallax speed factors, relative to CLIMB_SPEED. */
export const STARFIELD_TILE_FACTOR = 0.25;
export const STARFIELD_NEAR_FACTOR = 1;
export const STARFIELD_FAR_FACTOR = 0.6;
export const MENU_STARFIELD_FACTOR = 0.12;
