import * as ex from 'excalibur';
import { HITBOX_SCALE, OBSTACLE_HEIGHT, OBSTACLE_WIDTH } from './constants';

const OBSTACLE_COLOR = ex.Color.fromHex('#e05b4a');

/**
 * One obstacle. Instances are created once by the pool and reused: the actor's
 * collider is intentionally smaller than the sprite so near misses read as fair.
 */
export class Obstacle extends ex.Actor {
  constructor() {
    super({
      name: 'obstacle',
      width: OBSTACLE_WIDTH * HITBOX_SCALE,
      height: OBSTACLE_HEIGHT * HITBOX_SCALE,
      collisionType: ex.CollisionType.Active,
    });

    this.graphics.use(
      new ex.Rectangle({
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
        color: OBSTACLE_COLOR,
      }),
    );
  }
}
