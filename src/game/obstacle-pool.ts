import type * as ex from 'excalibur';
import { Obstacle } from './obstacle';

/**
 * Fixed-size pool of obstacles. Actors are allocated once in the constructor and then
 * add/removed from the scene as they are needed, so a run never allocates.
 */
export class ObstaclePool {
  private readonly scene: ex.Scene;
  private readonly free: Obstacle[] = [];
  private readonly inUse: Obstacle[] = [];

  constructor(scene: ex.Scene, size: number) {
    this.scene = scene;
    for (let index = 0; index < size; index++) {
      this.free.push(new Obstacle());
    }
  }

  /** Takes an obstacle out of the pool and places it at (x, y). */
  acquire(x: number, y: number): Obstacle | undefined {
    const obstacle = this.free.pop();
    if (!obstacle) {
      return undefined;
    }

    obstacle.pos.x = x;
    obstacle.pos.y = y;
    obstacle.randomize();
    this.scene.add(obstacle);
    this.inUse.push(obstacle);
    return obstacle;
  }

  /** Returns obstacles below `minY` to the pool; call once per update. */
  recycleBelow(minY: number): void {
    for (let index = this.inUse.length - 1; index >= 0; index--) {
      const obstacle = this.inUse[index];
      if (!obstacle || obstacle.pos.y <= minY) {
        continue;
      }
      this.inUse.splice(index, 1);
      this.scene.remove(obstacle);
      this.free.push(obstacle);
    }
  }

  /** Empties the pool, used when a run restarts. */
  releaseAll(): void {
    for (const obstacle of this.inUse) {
      this.scene.remove(obstacle);
      this.free.push(obstacle);
    }
    this.inUse.length = 0;
  }

  get activeCount(): number {
    return this.inUse.length;
  }

  get capacity(): number {
    return this.free.length + this.inUse.length;
  }
}
