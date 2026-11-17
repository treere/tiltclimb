import * as ex from 'excalibur';
import { pickupImage } from './sprites';

const SIZE = 44;
const SPIN_DEG_PER_SECOND = 90;

/**
 * The pickup: a spinning star that sits where the ship was destroyed and lets the world scroll past
 * it, so it falls towards the player at exactly the speed of everything else. One at a time — a
 * second drop replaces the first.
 */
export class Pickup extends ex.Actor {
  constructor() {
    super({
      name: 'pickup',
      width: SIZE,
      height: SIZE,
      z: 8,
      // The engine's collision system must ignore it: the player's `collisionstart` handler ends the
      // run, so an Active pickup blowing up on contact killed the ship that was trying to collect it.
      // Collection is a circle test in the scene.
      collisionType: ex.CollisionType.PreventCollision,
    });

    const sprite = pickupImage.toSprite();
    const scale = SIZE / sprite.width;
    sprite.scale = ex.vec(scale, scale);
    this.graphics.use(sprite);
    this.graphics.isVisible = false;
  }

  get isShown(): boolean {
    return this.graphics.isVisible;
  }

  show(x: number, y: number): void {
    this.pos = ex.vec(x, y);
    this.rotation = 0;
    this.graphics.isVisible = true;
  }

  hide(): void {
    this.graphics.isVisible = false;
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    if (!this.graphics.isVisible) {
      return;
    }
    this.rotation += ((SPIN_DEG_PER_SECOND * Math.PI) / 180) * (elapsed / 1000);
  }
}
