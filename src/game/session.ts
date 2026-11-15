import { TiltSource } from '../input/tilt-source';

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
  bestScore = 0;
  lastKills = 0;

  /** Stores the run result and reports whether it beat the previous session best. */
  recordScore(points: number, kills: number): boolean {
    const previousBest = this.bestScore;
    // The first run of a session is not a record: there was no best to beat yet.
    const isRecord = this.hasPlayed && points > previousBest;

    this.lastScore = points;
    this.lastKills = kills;
    this.hasPlayed = true;
    if (isRecord) {
      this.bestScore = points;
    }

    return isRecord;
  }
}

export const session = new Session();
