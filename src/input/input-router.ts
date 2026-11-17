import * as ex from 'excalibur';
import { FIRE_BAND_HEIGHT, MAX_HORIZONTAL_SPEED } from '../game/constants';
import { TapGesture } from './tap-gesture';
import type { TiltSource } from './tilt-source';

type Rectangle = { left: number; top: number; width: number; height: number };

/** Pointer travel (logical px) that maps to full drag deflection. */
const DRAG_FULL_RANGE_PX = 120;

/**
 * Chooses the control that drives the player: drag if the user is dragging right now,
 * keyboard if an arrow is held, tilt otherwise. Keeping the three side by side means
 * desktop and permission-denied cases need no special casing upstream.
 */
export class InputRouter {
  private readonly engine: ex.Engine;
  private readonly tilt: TiltSource;
  private dragging = false;
  private lastPointerX = 0;
  private pendingDrag = 0;
  /** Screen y below which a touch should not start a drag (the fire button lives there). */
  private dragStartLimit = Number.POSITIVE_INFINITY;
  private readonly gesture = new TapGesture();
  private fireTapHandler: (() => void) | null = null;
  private fireBandHeight = FIRE_BAND_HEIGHT;
  /** Taps inside this rectangle belong to the button, which has its own handler. */
  private fireButtonRect: Rectangle | null = null;

  constructor(engine: ex.Engine, tilt: TiltSource) {
    this.engine = engine;
    this.tilt = tilt;
    const pointer = engine.input.pointers.primary;

    pointer.on('down', (event: ex.PointerEvent) => {
      const point = this.toResolution(event);
      // Below the drag limit the touch may not steer, but it is still tracked: that strip is exactly
      // where the fire band lives, and cancelling the gesture there made every band tap a no-op.
      this.dragging = point.y <= this.dragStartLimit;
      this.lastPointerX = point.x;
      this.gesture.begin(point.x, point.y, performance.now());
    });

    pointer.on('move', (event: ex.PointerEvent) => {
      if (!this.dragging) {
        return;
      }
      const point = this.toResolution(event);
      this.pendingDrag += point.x - this.lastPointerX;
      this.lastPointerX = point.x;
      this.gesture.move(point.x, point.y);
    });

    pointer.on('up', (event: ex.PointerEvent) => {
      const point = this.toResolution(event);
      const wasTap = this.gesture.end(performance.now());
      this.dragging = false;
      if (wasTap && this.isInFireBand(point.x, point.y)) {
        this.fireTapHandler?.();
      }
    });

    // Fires when the finger leaves the canvas, so the drag never sticks.
    pointer.on('cancel', () => {
      this.dragging = false;
      this.gesture.cancel();
    });
  }

  /**
   * Pointer position in resolution coordinates.
   *
   * `screenPos` from Excalibur drifts with the camera as the world scrolls — the same physical tap
   * reported y = 56 at the start of a run and y = -84 a few seconds later — so a fixed band cannot
   * use it. The page position against the canvas rectangle does not move.
   */
  private toResolution(event: ex.PointerEvent): { x: number; y: number } {
    const rect = this.engine.canvas.getBoundingClientRect();
    const scale = rect.width > 0 ? this.engine.screen.resolution.width / rect.width : 1;
    const pageX = event.pagePos.x - window.scrollX;
    const pageY = event.pagePos.y - window.scrollY;
    return { x: (pageX - rect.left) * scale, y: (pageY - rect.top) * scale };
  }

  private isInFireBand(x: number, y: number): boolean {
    const height = this.engine.screen.resolution.height;
    if (y < height - this.fireBandHeight || y > height) {
      return false;
    }
    const button = this.fireButtonRect;
    if (!button) {
      return true;
    }
    const insideButton =
      x >= button.left &&
      x <= button.left + button.width &&
      y >= button.top &&
      y <= button.top + button.height;
    return !insideButton;
  }

  /** What to do when a tap lands in the bottom band, outside the button. */
  onFireTap(handler: () => void): void {
    this.fireTapHandler = handler;
  }

  /** Height of the strip that fires, in logical pixels. */
  setFireBandHeight(height: number): void {
    this.fireBandHeight = height;
  }

  /** Taps inside this rectangle are the button's business, not the band's. */
  setFireButtonRect(rect: Rectangle): void {
    this.fireButtonRect = rect;
  }

  /** Steering axis in [-1, 1]. Drag is applied as a position delta, so it reports 0 here. */
  axis(deltaMs: number): number {
    if (this.dragging) {
      return 0;
    }

    const keys = this.keyboardAxis();
    if (keys !== 0) {
      return keys;
    }

    return this.tilt.isAvailable ? this.tilt.axis(deltaMs) : 0;
  }

  /** Horizontal displacement requested by dragging since the last call, in logical px. */
  consumeDragDelta(): number {
    const delta = (this.pendingDrag / DRAG_FULL_RANGE_PX) * MAX_HORIZONTAL_SPEED * 0.016;
    this.pendingDrag = 0;
    return delta;
  }

  get isDragging(): boolean {
    return this.dragging;
  }

  /** Touches starting below `maxY` are left to the UI instead of steering the ship. */
  setDragStartLimit(maxY: number): void {
    this.dragStartLimit = maxY;
  }

  private keyboardAxis(): number {
    const keyboard = this.engine.input.keyboard;
    const left = keyboard.isHeld(ex.Keys.ArrowLeft) || keyboard.isHeld(ex.Keys.A);
    const right = keyboard.isHeld(ex.Keys.ArrowRight) || keyboard.isHeld(ex.Keys.D);

    if (left === right) {
      return 0;
    }
    return left ? -1 : 1;
  }
}
