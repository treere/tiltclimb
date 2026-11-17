import { TAP_MAX_MS, TAP_SLOP_PX } from '../game/constants';

/**
 * Decides whether a pointer gesture was a tap or a drag.
 *
 * The decision is made when the finger lifts, not when it lands: the bottom band is used both to
 * steer (drag) and to fire (tap), so firing on press would fire on every steering gesture that
 * starts low.
 *
 * Pure and time-injected, so the four cases can be checked without a browser.
 */
export class TapGesture {
  private tracking = false;
  private startAt = 0;
  private lastX = 0;
  private lastY = 0;
  private travel = 0;
  private moved = false;

  /** True once the gesture has travelled far enough to be a drag. */
  get isDrag(): boolean {
    return this.moved;
  }

  begin(x: number, y: number, now: number): void {
    this.tracking = true;
    this.startAt = now;
    this.lastX = x;
    this.lastY = y;
    this.travel = 0;
    this.moved = false;
  }

  move(x: number, y: number): void {
    if (!this.tracking) {
      return;
    }
    this.travel += Math.hypot(x - this.lastX, y - this.lastY);
    this.lastX = x;
    this.lastY = y;
    if (this.travel > TAP_SLOP_PX) {
      this.moved = true;
    }
  }

  /** Closes the gesture and reports whether it counts as a tap. */
  end(now: number): boolean {
    if (!this.tracking) {
      return false;
    }
    this.tracking = false;
    return !this.moved && now - this.startAt <= TAP_MAX_MS;
  }

  cancel(): void {
    this.tracking = false;
    this.moved = true;
  }
}
