/**
 * Cannon heat: firing costs something, and spraying costs more than it looks.
 *
 * Pure on purpose. The interesting part is the transition — when a jam ends, and what a tap does in
 * the same frame as the reset — which is far easier to check as a function than through a button.
 */

/** Heat at which the cannon jams. */
export const HEAT_MAX = 100;

/**
 * Added by every shot. 30 rather than 25: with the 150 ms guard the cannon also cools between shots,
 * and at 25 four shots in a row peak at 86 — not enough to jam. At 30 the fourth shot arrives at
 * 104 and jams, which is what "four quick shots" is supposed to mean.
 */
export const HEAT_PER_SHOT = 30;

/** Cooling rate while idle, so the cooldown does not depend on the frame rate. */
export const COOL_PER_SECOND = 30;

/** The cannon fires again once the heat has dropped to this: about 2.2 s from a jam. */
export const RESET_HEAT = 35;

export type HeatState = {
  heat: number;
  jammed: boolean;
};

export const COLD: HeatState = { heat: 0, jammed: false };

const clampHeat = (heat: number): number => Math.min(HEAT_MAX, Math.max(0, heat));

export function canFire(state: HeatState): boolean {
  return !state.jammed;
}

/**
 * Heat after a shot. A shot that reaches the maximum still fires and jams the cannon; a shot while
 * jammed is not fired at all, so tapping cannot slow the cooldown down.
 */
export function heatAfterShot(state: HeatState): HeatState {
  if (state.jammed) {
    return state;
  }
  const heat = clampHeat(state.heat + HEAT_PER_SHOT);
  return { heat, jammed: heat >= HEAT_MAX };
}

/** Heat after `dtMs` of not firing. A jam clears when the heat is back at the reset threshold. */
export function heatAfterCooling(state: HeatState, dtMs: number): HeatState {
  if (!Number.isFinite(dtMs) || dtMs <= 0) {
    return state;
  }
  const heat = clampHeat(state.heat - (COOL_PER_SECOND * dtMs) / 1000);
  return { heat, jammed: state.jammed && heat > RESET_HEAT };
}

/** True when the bar should read as jammed: hot enough that the next shot is refused. */
export function isJammed(state: HeatState): boolean {
  return state.jammed;
}
