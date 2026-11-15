import * as ex from 'excalibur';
import { MAX_HORIZONTAL_SPEED } from '../game/constants';
import type { TiltSource } from './tilt-source';

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

  constructor(engine: ex.Engine, tilt: TiltSource) {
    this.engine = engine;
    this.tilt = tilt;
    const pointer = engine.input.pointers.primary;

    pointer.on('down', (event: ex.PointerEvent) => {
      if (event.screenPos.y > this.dragStartLimit) {
        this.dragging = false;
        return;
      }
      this.dragging = true;
      this.lastPointerX = event.screenPos.x;
    });

    pointer.on('move', (event: ex.PointerEvent) => {
      if (!this.dragging) {
        return;
      }
      this.pendingDrag += event.screenPos.x - this.lastPointerX;
      this.lastPointerX = event.screenPos.x;
    });

    pointer.on('up', () => {
      this.dragging = false;
    });

    // Fires when the finger leaves the canvas, so the drag never sticks.
    pointer.on('cancel', () => {
      this.dragging = false;
    });
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
