/**
 * Tunable constants for Tiltclimb. Values come from the design documents
 * (openspec/changes/…/design.md) and are meant to be adjusted by playing on a real
 * phone, not by reasoning about them.
 */

/** Logical resolution. The engine scales it to the screen via DisplayMode.FitScreen. */
export const WORLD_WIDTH = 720;
export const WORLD_HEIGHT = 1280;

/* Climb speed is no longer a constant: see `speed.ts` (it grows with height). */

/** Horizontal speed at full tilt, in logical pixels per second: 720 px in ~1.9 s. */
export const MAX_HORIZONTAL_SPEED = 380;

/**
 * Tilt below this many degrees is ignored, so a still hand does not drift. The response grows
 * continuously from here instead of jumping, which is why the threshold can stay this small.
 */
export const TILT_DEAD_ZONE_DEG = 1.5;

/** Fallback saturation angle. The live value comes from `input/tilt-settings.ts`. */
export const TILT_RANGE_DEG = 13;

/** Time constant of the exponential smoothing applied to the tilt axis (ms). */
export const TILT_SMOOTH_TAU_MS = 45;

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
export const PROJECTILE_HIT_RADIUS = 7;
/** Laser sprite drawn size. Kenney's laser is 9×54, so it gets scaled unevenly to read on a phone. */
export const LASER_VISUAL_WIDTH = 12;
export const LASER_VISUAL_LENGTH = 46;
export const HERO_SHOT_SPEED = 620;
export const ENEMY_SHOT_SPEED = 320;
export const SHOT_MIN_INTERVAL_MS = 150;

export const ENEMY_POOL_SIZE = 4;
/** Alive limit: two at the start, three once the hunter is unlocked. */
export const ENEMY_MAX_ALIVE_EARLY = 2;
export const ENEMY_MAX_ALIVE_LATE = 3;
export const ENEMY_SPAWN_INTERVAL_MS = 3500;
/** Horizontal margin kept free when an enemy enters from above. */
export const ENEMY_SPAWN_MARGIN = 60;

/** Collider used for the hero when cheking bullet and ship hits: forgiving by design. */
export const HERO_HIT_RADIUS = 20;

export const FIRE_BUTTON_WIDTH = 200;
export const FIRE_BUTTON_HEIGHT = 84;

/**
 * Bottom strip, in logical pixels, where a tap fires. A logical height rather than a fraction of the
 * screen: the band has to be the same on every phone, because that is what the thumb learns.
 */
export const FIRE_BAND_HEIGHT = 220;

/** Tap versus drag: under this travel and this duration the gesture is a tap. */
export const TAP_SLOP_PX = 12;
export const TAP_MAX_MS = 300;

/** Round pause control, same size as the audio toggle in the menu. */
export const PAUSE_TOGGLE_MARGIN = 56;

export const BACKGROUND_COLOR = '#0e1116';

/** Parallax speed factors, relative to the current climb speed. */
export const STARFIELD_TILE_FACTOR = 0.55;
export const STARFIELD_NEAR_FACTOR = 1;
export const STARFIELD_FAR_FACTOR = 0.6;
export const MENU_STARFIELD_FACTOR = 0.12;
