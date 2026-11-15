import * as ex from 'excalibur';
import { WORLD_WIDTH } from './constants';
import { ARCHETYPES, type Archetype, type EnemyKind } from './enemy-archetypes';
import { CLIMB_SPEED_START } from './speed';
import { archetypeImages } from './sprites';

const EDGE_MARGIN = 12;

/** What a moving enemy needs to know about the world around it. */
export type EnemyContext = {
  heroX: number;
  /** Current climb speed, so the descent stays relative to the world and not to the screen. */
  speed: number;
  /** World y of the top edge of the view. */
  topEdge: number;
  viewHeight: number;
};

/**
 * An enemy ship. Its whole personality comes from the archetype table: sprite, descent,
 * weave / drift / tracking / hover, and the fire pattern. It stays out of the engine's
 * collision system, so asteroids cannot stop it.
 */
export class Enemy extends ex.Actor {
  private archetype: Archetype = ARCHETYPES.patrol;
  private baseX = 0;
  private phase = 0;
  private age = 0;
  private driftDirection = 1;
  private hovering = false;
  private volleysLeft = 0;
  private stepIn = 0;

  constructor() {
    super({
      name: 'enemy',
      radius: ARCHETYPES.patrol.hitRadius,
      collisionType: ex.CollisionType.PreventCollision,
      z: 20,
    });
  }

  get kind(): EnemyKind {
    return this.archetype.kind;
  }

  get points(): number {
    return this.archetype.points;
  }

  get hitRadius(): number {
    return this.archetype.hitRadius;
  }

  spawn(kind: EnemyKind, x: number, y: number): void {
    const archetype = ARCHETYPES[kind];
    this.archetype = archetype;

    const sprite = archetypeImages[kind].toSprite();
    const scale = archetype.visualWidth / sprite.width;
    sprite.scale = ex.vec(scale, scale);
    this.graphics.use(sprite);

    this.pos = ex.vec(x, y);
    this.baseX = x;
    this.phase = Math.random() * Math.PI * 2;
    this.age = 0;
    this.hovering = false;
    this.driftDirection = x < WORLD_WIDTH / 2 ? 1 : -1;
    this.volleysLeft = 0;

    // Placeholder: `behave` recomputes it every frame from the current speed, because the game
    // accelerates as the player climbs and a frozen value would make old ships fall behind.
    this.vel = ex.vec(0, -(CLIMB_SPEED_START - archetype.descent));

    // Stagger the first shot so two ships never fire on the same beat.
    this.stepIn = archetype.fire.intervalMs * (0.6 + Math.random() * 0.8);
  }

  /**
   * Advances the archetype behaviour for one frame and returns the directions (radians) of
   * the volley due this frame, or null when the ship is not firing.
   */
  behave(elapsedMs: number, context: EnemyContext): number[] | null {
    const archetype = this.archetype;
    const dt = elapsedMs / 1000;
    this.age += elapsedMs;

    this.applyMovement(archetype, dt, context);
    this.clampInsideWorld(archetype);

    return this.tickFire(elapsedMs);
  }

  freeze(): void {
    this.vel = ex.Vector.Zero;
  }

  private applyMovement(archetype: Archetype, dt: number, context: EnemyContext): void {
    // The screen rises with the camera at the current speed, so subtracting it turns world
    // velocity into a slow screen descent — recomputed every frame because the game accelerates.
    this.vel.y = -(context.speed - archetype.descent);

    if (archetype.weave) {
      const offset =
        Math.sin(this.phase + (this.age / 1000) * archetype.weave.omega) *
        archetype.weave.amplitude;
      this.pos.x = this.baseX + offset;
    }

    if (archetype.drift) {
      this.pos.x += this.driftDirection * archetype.drift * dt;
    }

    if (archetype.tracking) {
      const step = archetype.tracking * dt;
      const delta = Math.max(-step, Math.min(step, context.heroX - this.pos.x));
      this.pos.x += delta;
    }

    if (archetype.hover) {
      const targetScreenY = context.viewHeight * archetype.hover.screenFraction;
      const screenY = this.pos.y - context.topEdge;

      if (!this.hovering && screenY >= targetScreenY) {
        this.hovering = true;
      }

      if (this.hovering) {
        // Hover means "stay at this height on screen": the world must move with the camera.
        this.vel.y = 0;
        this.pos.y =
          context.topEdge +
          targetScreenY +
          Math.sin((this.age / 1000) * archetype.hover.bobOmega) * archetype.hover.bobAmplitude;
      }
    }
  }

  private clampInsideWorld(archetype: Archetype): void {
    const half = archetype.visualWidth / 2 + EDGE_MARGIN;
    const min = half;
    const max = WORLD_WIDTH - half;

    if (this.pos.x < min) {
      this.pos.x = min;
      this.driftDirection = 1;
    } else if (this.pos.x > max) {
      this.pos.x = max;
      this.driftDirection = -1;
    }
  }

  private tickFire(elapsedMs: number): number[] | null {
    const fire = this.archetype.fire;
    this.stepIn -= elapsedMs;
    if (this.stepIn > 0) {
      return null;
    }

    if (this.volleysLeft <= 0) {
      this.volleysLeft = fire.burst;
    }
    this.volleysLeft -= 1;
    this.stepIn = this.volleysLeft > 0 ? fire.burstGapMs : fire.intervalMs;

    return fire.angles;
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

  spawn(kind: EnemyKind, x: number, y: number): Enemy | undefined {
    const enemy = this.free.pop();
    if (!enemy) {
      return undefined;
    }
    enemy.spawn(kind, x, y);
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
