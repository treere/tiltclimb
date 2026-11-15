/**
 * Steering sensitivity, stored as the inclination (in degrees) needed to reach full scale.
 *
 * Sensitivity is a scale factor applied to the tilt, not an offset: changing it does not
 * invalidate the calibrated zero. That is why nothing here touches `calibrate()`.
 */

/** From the softest to the most nervous. */
export const TILT_RANGES_DEG = [22, 17, 13, 10, 8] as const;

/**
 * 13°: the previous build used 22°, which needed a lot of wrist for little movement. The first
 * pass used 16° and still felt tame, so the default moved one step further down.
 */
export const DEFAULT_TILT_LEVEL = 2;

const STORAGE_KEY = 'tiltclimb.tiltLevel';

const clampLevel = (level: number): number =>
  Math.min(TILT_RANGES_DEG.length - 1, Math.max(0, Math.round(level)));

export function rangeForLevel(level: number): number {
  return TILT_RANGES_DEG[clampLevel(level)] ?? TILT_RANGES_DEG[DEFAULT_TILT_LEVEL];
}

/** Reads the stored level, falling back to the default when storage is missing or garbage. */
export function loadTiltLevel(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return DEFAULT_TILT_LEVEL;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? clampLevel(parsed) : DEFAULT_TILT_LEVEL;
  } catch {
    // Private mode, or storage denied: the default is fine, the setting is just not remembered.
    return DEFAULT_TILT_LEVEL;
  }
}

function persist(level: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(level));
  } catch {
    // Nothing to do: the level still applies to this session.
  }
}

/**
 * Live setting shared by the menu (which writes it) and the tilt source (which reads it).
 * A tiny module-level store instead of a state library: there are exactly two readers.
 */
class TiltSettings {
  private level = loadTiltLevel();

  get tiltLevel(): number {
    return this.level;
  }

  get rangeDeg(): number {
    return rangeForLevel(this.level);
  }

  get isNervous(): boolean {
    return this.level === TILT_RANGES_DEG.length - 1;
  }

  get isSoft(): boolean {
    return this.level === 0;
  }

  /** Human-readable position, 1-based: "3/5". */
  get label(): string {
    return `${this.level + 1}/${TILT_RANGES_DEG.length}`;
  }

  setLevel(level: number): void {
    this.level = clampLevel(level);
    persist(this.level);
  }
}

export const tiltSettings = new TiltSettings();
