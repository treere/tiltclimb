import * as ex from 'excalibur';
import {
  CLIMB_SPEED,
  ENEMY_FIRE_INTERVAL_MS,
  ENEMY_HIT_RADIUS,
  ENEMY_SCREEN_DESCENT,
  ENEMY_VISUAL_WIDTH,
  ENEMY_WEAVE_AMPLITUDE,
  ENEMY_WEAVE_OMEGA,
  WORLD_WIDTH,
} from './constants';
import { enemyImages } from './sprites';

const EDGE_MARGIN = 12;

/**
 * An enemy ship: descends slowly across the screen while weaving left and right, and fires
 * straight down on an interval. Like bullets, it does not take part in engine collisions —
 * the scene decides what it hits, which is how enemies can pass through asteroids untouched.
 */
export class Enemy extends ex.Actor {
  private baseX = 0;
  private phase = 0;
  private age = 0;
  private shotIn = ENEMY_FIRE_INTERVAL_MS;

  constructor() {
    super({
      name: 'enemy',
      radius: ENEMY_HIT_RADIUS,
      collisionType: ex.CollisionType.PreventCollision,
      z: 20,
    });
  }

  spawn(x: number, y: number): void {
    const source = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    if (source) {
      const sprite = source.toSprite();
      const scale = ENEMY_VISUAL_WIDTH / sprite.width;
      sprite.scale = ex.vec(scale, scale);
      this.graphics.use(sprite);
    }

    this.pos = ex.vec(x, y);
    this.baseX = x;
    this.phase = Math.random() * Math.PI * 2;
    this.age = 0;

    // The camera rises at CLIMB_SPEED, so this world velocity reads as a slow descent.
    this.vel = ex.vec(0, -(CLIMB_SPEED - ENEMY_SCREEN_DESCENT));

    // Stagger the first shot so two ships never fire in the same beat.
    this.shotIn = ENEMY_FIRE_INTERVAL_MS * (0.6 + Math.random() * 0.8);
  }

  /** Sine weave around the spawn column, clamped inside the world. */
  weave(elapsedMs: number): void {
    this.age += elapsedMs;
    const half = ENEMY_VISUAL_WIDTH / 2 + EDGE_MARGIN;
    const offset =
      Math.sin(this.phase + (this.age / 1000) * ENEMY_WEAVE_OMEGA) * ENEMY_WEAVE_AMPLITUDE;
    this.pos.x = Math.min(WORLD_WIDTH - half, Math.max(half, this.baseX + offset));
  }

  /** Returns true on the frames where the ship should fire. */
  wantsToFire(elapsedMs: number): boolean {
    this.shotIn -= elapsedMs;
    if (this.shotIn > 0) {
      return false;
    }
    this.shotIn = ENEMY_FIRE_INTERVAL_MS;
    return true;
  }

  freeze(): void {
    this.vel = ex.Vector.Zero;
  }
}

/** Fixed pool of enemy ships, same recycling scheme as the other actors. */
export class EnemyPool {
  private readonly scene: ex.Scene;
  private readonly free: Enemy[] = [];
  private readonly inUse: Enemy[] = [];

  constructor(scene: ex.Scene, size: number) {
    this.scene = scene;
    for (let index = 0; index < size; index++) {
      this.free.push(new Enemy());
    }
  }

  spawn(x: number, y: number): Enemy | undefined {
    const enemy = this.free.pop();
    if (!enemy) {
      return undefined;
    }
    enemy.spawn(x, y);
    this.scene.add(enemy);
    this.inUse.push(enemy);
    return enemy;
  }

  release(enemy: Enemy): void {
    const index = this.inUse.indexOf(enemy);
    if (index < 0) {
      return;
    }
    this.inUse.splice(index, 1);
    this.scene.remove(enemy);
    this.free.push(enemy);
  }

  /** Releases ships that have left the bottom of the view. */
  recycleBelow(limitY: number): void {
    for (let index = this.inUse.length - 1; index >= 0; index--) {
      const enemy = this.inUse[index];
      if (enemy && enemy.pos.y > limitY) {
        this.release(enemy);
      }
    }
  }

  freezeAll(): void {
    for (const enemy of this.inUse) {
      enemy.freeze();
    }
  }

  releaseAll(): void {
    for (const enemy of this.inUse) {
      this.scene.remove(enemy);
      this.free.push(enemy);
    }
    this.inUse.length = 0;
  }

  get active(): readonly Enemy[] {
    return this.inUse;
  }

  get aliveCount(): number {
    return this.inUse.length;
  }
}
