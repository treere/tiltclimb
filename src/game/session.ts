import { TiltSource } from '../input/tilt-source';

/**
 * State that outlives a single run: the calibrated sensor and the two score numbers
 * shown by the menu. It is deliberately a module singleton — if every scene built its
 * own TiltSource, the zero calibrated in the menu would be lost the moment the game
 * scene starts, which is the bug this design exists to prevent.
 */
class Session {
  readonly tilt = new TiltSource();

  /** Sensor permission has already been asked, whatever the outcome. */
  sensorPromptDone = false;

  hasPlayed = false;
  lastScore = 0;
  bestScore = 0;

  recordScore(points: number): void {
    this.lastScore = points;
    this.hasPlayed = true;
    if (points > this.bestScore) {
      this.bestScore = points;
    }
  }
}

export const session = new Session();
