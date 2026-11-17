/**
 * The invincibility power-up: a rare drop that turns the ship into the danger for a few seconds.
 *
 * Pure, like `levels.ts`, `weapon-heat.ts` and `records.ts`: the drop chance takes the random number
 * as an argument, so a test can repeat it, and the timer is a plain subtraction.
 */

/** One destroyed ship in ten leaves something behind. */
export const DROP_CHANCE = 0.1;

/** Eight seconds of invincibility. */
export const POWERUP_MS = 8000;

/** Last two seconds: the ship blinks to warn that the protection is running out. */
export const WARN_MS = 2000;

/** Blink period during the warning window, in milliseconds. */
export const BLINK_MS = 120;

export type PowerUpState = { remainingMs: number };

export const IDLE: PowerUpState = { remainingMs: 0 };

export const isActive = (state: PowerUpState): boolean => state.remainingMs > 0;

export const isWarning = (state: PowerUpState): boolean =>
  state.remainingMs > 0 && state.remainingMs <= WARN_MS;

/** A pickup always restarts the full duration: it never adds to what is left. */
export const afterPickup = (): PowerUpState => ({ remainingMs: POWERUP_MS });

/** Time passing on the game clock; pause and a finished run simply do not call it. */
export function afterTime(state: PowerUpState, dtMs: number): PowerUpState {
  if (!Number.isFinite(dtMs) || dtMs <= 0) {
    return state;
  }
  return { remainingMs: Math.max(0, state.remainingMs - dtMs) };
}

/** Draw for a drop; the caller passes `Math.random()` so the rate is testable. */
export function shouldDrop(random: number): boolean {
  return Number.isFinite(random) && random >= 0 && random < DROP_CHANCE;
}
