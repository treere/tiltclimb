import * as ex from 'excalibur';
import {
  LASER_VISUAL_LENGTH,
  LASER_VISUAL_WIDTH,
  PROJECTILE_HIT_RADIUS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { enemyLaserImage, heroLaserImage } from './sprites';

export type Faction = 'hero' | 'enemy';

export type LaunchOptions = {
  /** Bullet speed in px/s. */
  speed: number;
  /** Direction offset in radians: 0 = straight along the faction's axis, positive = to the right. */
  angle?: number;
  /** When set, one bullet per direction is fired at once (a volley). */
  angles?: number[];
};

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

  launch(faction: Faction, x: number, y: number, options: LaunchOptions): void {
    this.faction = faction;
    this.pos = ex.vec(x, y);

    const source = faction === 'hero' ? heroLaserImage : enemyLaserImage;
    const sprite = source.toSprite();
    // Kenney's laser is tall and skinny (9×54): scaling it unevenly keeps it readable
    // without turning into a thin line that disappears on a phone.
    sprite.scale = ex.vec(LASER_VISUAL_WIDTH / sprite.width, LASER_VISUAL_LENGTH / sprite.height);
    this.graphics.use(sprite);

    // Kenney lasers point up: enemy bullets are the same sprite turned around. The sprite does
    // not follow the angle — a 18° rotation makes the bullet harder to read than the trajectory.
    this.rotation = faction === 'enemy' ? Math.PI : 0;

    const angle = options.angle ?? 0;
    const direction = faction === 'hero' ? -1 : 1;
    this.vel = ex.vec(Math.sin(angle) * options.speed, Math.cos(angle) * options.speed * direction);
  }

  freeze(): void {
    this.vel = ex.Vector.Zero;
  }

  /** True when the bullet has left the visible world range, on either axis. */
  isOutside(top: number, bottom: number): boolean {
    if (this.pos.y < top - LASER_VISUAL_LENGTH || this.pos.y > bottom + WORLD_HEIGHT * 0.1) {
      return true;
    }
    return this.pos.x < -LASER_VISUAL_WIDTH || this.pos.x > WORLD_WIDTH + LASER_VISUAL_WIDTH;
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

  spawn(faction: Faction, x: number, y: number, options: LaunchOptions): Projectile | undefined {
    const projectile = this.free.pop();
    if (!projectile) {
      return undefined;
    }

    projectile.launch(faction, x, y, options);
    this.scene.add(projectile);
    this.inUse.push(projectile);
    return projectile;
  }

  /** Fires one volley: several bullets at once, one per direction. */
  spawnVolley(faction: Faction, x: number, y: number, options: LaunchOptions): void {
    for (const angle of options.angles ?? [0]) {
      this.spawn(faction, x, y, { speed: options.speed, angle });
    }
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
