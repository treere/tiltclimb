/**
 * Best results that survive the session.
 *
 * Read once at startup, written when beaten. The storage is a parameter with a default so these
 * helpers can be checked with a fake that returns garbage or throws: private mode, disabled storage
 * and corrupted values must degrade to "no record", never to an error or a `NaN` in the HUD.
 */

export const BEST_SCORE_KEY = 'tiltclimb.bestScore';
export const BEST_KILLS_KEY = 'tiltclimb.bestKills';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Reads a stored count, falling back to 0 for missing, unreadable or invalid values. */
export function readStoredCount(
  key: string,
  storage: StorageLike | null = defaultStorage(),
): number {
  if (!storage) {
    return 0;
  }
  try {
    const raw = storage.getItem(key);
    if (raw === null) {
      return 0;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function writeStoredCount(
  key: string,
  value: number,
  storage: StorageLike | null = defaultStorage(),
): void {
  if (!storage || !Number.isFinite(value) || value < 0) {
    return;
  }
  try {
    storage.setItem(key, String(Math.floor(value)));
  } catch {
    // Nothing to do: the in-memory value still holds for this session.
  }
}

export const readBestScore = (storage?: StorageLike | null): number =>
  readStoredCount(BEST_SCORE_KEY, storage);

export const readBestKills = (storage?: StorageLike | null): number =>
  readStoredCount(BEST_KILLS_KEY, storage);

export const writeBestScore = (value: number, storage?: StorageLike | null): void =>
  writeStoredCount(BEST_SCORE_KEY, value, storage);

export const writeBestKills = (value: number, storage?: StorageLike | null): void =>
  writeStoredCount(BEST_KILLS_KEY, value, storage);
