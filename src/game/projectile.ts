import * as ex from 'excalibur';
import {
  ENEMY_SHOT_SPEED,
  HERO_SHOT_SPEED,
  PROJECTILE_HIT_RADIUS,
  WORLD_HEIGHT,
} from './constants';
import { enemyLaserImage, heroLaserImage } from './sprites';

export type Faction = 'hero' | 'enemy';

const LASER_LENGTH = 28;

/**
 * A bullet. One class for both sides: the faction decides sprite, direction and who it can
 * hurt. Collisions are resolved by hand in the scene, so the collider is only a shape hint
 * and the actor never takes part in engine collisions — that is what lets hero bullets fly
 * straight through asteroids.
 */
export class Projectile extends ex.Actor {
  faction: Faction = 'hero';

  constructor() {
    super({
      name: 'projectile',
      width: PROJECTILE_HIT_RADIUS * 2,
      height: PROJECTILE_HIT_RADIUS * 2,
      collisionType: ex.CollisionType.PreventCollision,
      z: 30,
    });
  }

  launch(faction: Faction, x: number, y: number): void {
    this.faction = faction;
    this.pos = ex.vec(x, y);

    const source = faction === 'hero' ? heroLaserImage : enemyLaserImage;
    const sprite = source.toSprite();
    const scale = LASER_LENGTH / sprite.height;
    sprite.scale = ex.vec(scale, scale);
    this.graphics.use(sprite);

    // Kenney lasers point up: enemy bullets are the same sprite turned around.
    this.rotation = faction === 'enemy' ? Math.PI : 0;
    this.vel = ex.vec(0, faction === 'hero' ? -HERO_SHOT_SPEED : ENEMY_SHOT_SPEED);
  }

  freeze(): void {
    this.vel = ex.Vector.Zero;
  }

  /** True when the bullet has left the visible world range. */
  isOutside(top: number, bottom: number): boolean {
    return this.pos.y < top - LASER_LENGTH || this.pos.y > bottom + WORLD_HEIGHT * 0.1;
  }
}

/** Fixed pool: bullets are created once and recycled, never allocated during a run. */
export class ProjectilePool {
  private readonly scene: ex.Scene;
  private readonly free: Projectile[] = [];
  private readonly inUse: Projectile[] = [];

  constructor(scene: ex.Scene, size: number) {
    this.scene = scene;
    for (let index = 0; index < size; index++) {
      this.free.push(new Projectile());
    }
  }

  spawn(faction: Faction, x: number, y: number): Projectile | undefined {
    const projectile = this.free.pop();
    if (!projectile) {
      return undefined;
    }

    projectile.launch(faction, x, y);
    this.scene.add(projectile);
    this.inUse.push(projectile);
    return projectile;
  }

  /** Recycles bullets outside the given vertical range. */
  recycleOutside(top: number, bottom: number): void {
    for (let index = this.inUse.length - 1; index >= 0; index--) {
      const projectile = this.inUse[index];
      if (!projectile?.isOutside(top, bottom)) {
        continue;
      }
      this.releaseAt(index);
    }
  }

  release(projectile: Projectile): void {
    const index = this.inUse.indexOf(projectile);
    if (index >= 0) {
      this.releaseAt(index);
    }
  }

  freezeAll(): void {
    for (const projectile of this.inUse) {
      projectile.freeze();
    }
  }

  releaseAll(): void {
    for (const projectile of this.inUse) {
      this.scene.remove(projectile);
      this.free.push(projectile);
    }
    this.inUse.length = 0;
  }

  get active(): readonly Projectile[] {
    return this.inUse;
  }

  private releaseAt(index: number): void {
    const projectile = this.inUse[index];
    if (!projectile) {
      return;
    }
    this.inUse.splice(index, 1);
    this.scene.remove(projectile);
    this.free.push(projectile);
  }
}
