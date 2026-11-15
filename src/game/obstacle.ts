import * as ex from 'excalibur';
import { OBSTACLE_RADIUS, OBSTACLE_VISUAL_WIDTH } from './constants';
import { meteorImages } from './sprites';

/**
 * One asteroid. The pool creates these once; `randomize()` gives each reuse a different
 * rock, a different angle and a slow spin, so the field never looks like a repeated stamp.
 *
 * The collider is a circle smaller than the sprite: near misses read as near misses, and
 * its area is comparable to the old rectangular obstacle so difficulty does not shift.
 */
export class Obstacle extends ex.Actor {
  constructor() {
    super({
      name: 'obstacle',
      radius: OBSTACLE_RADIUS,
      collisionType: ex.CollisionType.Active,
    });
    this.randomize();
  }

  randomize(): void {
    const source = meteorImages[Math.floor(Math.random() * meteorImages.length)];
    if (source) {
      const sprite = source.toSprite();
      const scale = OBSTACLE_VISUAL_WIDTH / sprite.width;
      sprite.scale = ex.vec(scale, scale);
      this.graphics.use(sprite);
    }

    this.rotation = Math.random() * Math.PI * 2;
    const spin = 0.25 + Math.random() * 0.6;
    this.angularVelocity = Math.random() < 0.5 ? -spin : spin;
  }
}
