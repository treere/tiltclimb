import { PIXELS_PER_POINT } from './constants';

/** A body reduced to what collisions need: centre and radius. */
export type Circle = { x: number; y: number; r: number };

/** True when two circles touch or overlap. */
export function circlesOverlap(a: Circle, b: Circle): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const reach = a.r + b.r;
  return dx * dx + dy * dy <= reach * reach;
}

/**
 * Score for a run: height points plus kills. Both terms only grow, so the total is monotone
 * and the HUD never has to go backwards.
 */
export function climbScore(climbedPixels: number, killPoints: number): number {
  const heightPoints = Math.floor(Math.max(0, climbedPixels) / PIXELS_PER_POINT);
  return heightPoints + Math.max(0, killPoints);
}
