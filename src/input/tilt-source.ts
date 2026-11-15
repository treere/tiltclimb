import {
  TILT_DEAD_ZONE_DEG,
  TILT_RANGE_DEG,
  TILT_SMOOTH_TAU_MS,
  TILT_TIMEOUT_MS,
} from '../game/constants';
import { tiltSettings } from './tilt-settings';

/** Lifecycle of the tilt source as the scene sees it. */
export type TiltStatus = 'pending' | 'active' | 'unavailable';

type PermissionCapableEvent = {
  requestPermission?: () => Promise<string>;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Asks for the sensors permission. Must run inside a user gesture: browsers reject
 * the request otherwise. Resolves true when the tilt source can be trusted to deliver
 * data, false when the caller has to fall back to keyboard or drag.
 */
export async function requestSensorPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
    return false;
  }

  const ctor = DeviceOrientationEvent as unknown as PermissionCapableEvent;
  if (typeof ctor.requestPermission !== 'function') {
    // Android and desktop expose the event without any prompt.
    return true;
  }

  try {
    return (await ctor.requestPermission()) === 'granted';
  } catch {
    return false;
  }
}

/**
 * Reads device orientation and turns left/right tilt into an axis in [-1, 1].
 *
 * The pipeline is: subtract the calibrated zero, apply the dead zone, normalise on the
 * configured range (the sensitivity), then smooth with a time constant so the result behaves
 * the same at 30 Hz and 120 Hz. Raw sensor values never reach the game loop.
 *
 * Sensitivity is only the range: the dead zone and the smoothing are fixed, so a nervous
 * setting does not make the ship twitch around the centre, and the calibrated zero stays
 * valid when the range changes.
 */
export class TiltSource {
  private gamma: number | null = null;
  private lastEventAt = 0;
  private zero: number | null = null;
  private smoothed = 0;
  private status: TiltStatus = 'pending';
  private startedAt = 0;
  private listening = false;
  private rangeDeg = tiltSettings.rangeDeg;

  private readonly onOrientation = (event: DeviceOrientationEvent): void => {
    if (event.gamma === null) {
      this.status = 'unavailable';
      return;
    }
    this.gamma = event.gamma;
    this.lastEventAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.status = 'active';
  };

  get currentStatus(): TiltStatus {
    return this.status;
  }

  /** Degrees needed for full scale. Changing it keeps the calibrated zero untouched. */
  get sensitivityDeg(): number {
    return this.rangeDeg;
  }

  setSensitivityDeg(degrees: number): void {
    this.rangeDeg = degrees > 0 ? degrees : TILT_RANGE_DEG;
  }

  get isAvailable(): boolean {
    return this.status === 'active';
  }

  /** Subscribes to the sensor. Safe to call twice. */
  listen(): void {
    if (this.listening || typeof window === 'undefined') {
      return;
    }
    this.listening = true;
    this.startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    window.addEventListener('deviceorientation', this.onOrientation);
  }

  stop(): void {
    if (!this.listening || typeof window === 'undefined') {
      return;
    }
    this.listening = false;
    window.removeEventListener('deviceorientation', this.onOrientation);
  }

  /**
   * Freezes the current inclination as the neutral position and clears the smoothing
   * history, so a new run starts from rest instead of inheriting the previous drift.
   */
  calibrate(): void {
    this.zero = this.gamma ?? 0;
    this.smoothed = 0;
  }

  /** Gives up on the sensor when nothing has arrived within the timeout. */
  tick(): void {
    if (this.status === 'pending' && this.lastEventAt === 0) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (now - this.startedAt > TILT_TIMEOUT_MS) {
        this.status = 'unavailable';
      }
    }
  }

  /** Inclination relative to the calibrated zero, in degrees. 0 when unavailable. */
  get relativeDegrees(): number {
    if (this.gamma === null) {
      return 0;
    }
    return this.gamma - (this.zero ?? 0);
  }

  /** Marks the sensor as unusable, e.g. after the permission was denied. */
  markUnavailable(): void {
    this.status = 'unavailable';
  }

  /** Current steering axis in [-1, 1], smoothed and dead-zoned. */
  axis(deltaMs: number): number {
    if (this.status !== 'active' || this.gamma === null) {
      return 0;
    }

    if (this.zero === null) {
      this.zero = this.gamma;
    }

    const relative = this.gamma - this.zero;

    // The threshold decides where the response starts, not how big the first step is: the
    // magnitude is reduced by the dead zone and grows from zero, so there is no jump at the
    // boundary and a deliberate small correction still registers.
    const usableRange = Math.max(1, this.rangeDeg - TILT_DEAD_ZONE_DEG);
    const magnitude = Math.max(0, Math.abs(relative) - TILT_DEAD_ZONE_DEG);
    const normalized = clamp((Math.sign(relative) * magnitude) / usableRange, -1, 1);

    // Frame-rate independent smoothing: the time to settle depends on tau, not on fps.
    const alpha = 1 - Math.exp(-clamp(deltaMs, 0, 100) / TILT_SMOOTH_TAU_MS);
    this.smoothed += (normalized - this.smoothed) * alpha;

    return this.smoothed;
  }
}
