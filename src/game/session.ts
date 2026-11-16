import { TiltSource } from '../input/tilt-source';
import { readBestKills, readBestScore, writeBestKills, writeBestScore } from './records';

/**
 * State that outlives a single run: the calibrated sensor and the numbers shown by the menu.
 * It is deliberately a module singleton — if every scene built its own TiltSource, the zero
 * calibrated in the menu would be lost the moment the game scene starts.
 */
class Session {
  readonly tilt = new TiltSource();

  /** Sensor permission has already been asked, whatever the outcome. */
  sensorPromptDone = false;

  hasPlayed = false;
  lastScore = 0;
  lastKills = 0;

  /** Read from the device once at startup, written whenever they are beaten. */
  bestScore = readBestScore();
  bestKills = readBestKills();

  /**
   * Stores the run result and reports whether it beat the best on record.
   *
   * The rule is simply "beat the best that exists": with nothing stored the bar is zero, so a first
   * run that scores anything is a record — the old "first run of the session never counts" rule
   * only existed because there was nothing to beat.
   */
  recordScore(points: number, kills: number): boolean {
    const isRecord = points > this.bestScore;

    this.lastScore = points;
    this.lastKills = kills;
    this.hasPlayed = true;

    if (isRecord) {
      this.bestScore = points;
      writeBestScore(points);
    }
    if (kills > this.bestKills) {
      this.bestKills = kills;
      writeBestKills(kills);
    }

    return isRecord;
  }
}

export const session = new Session();
