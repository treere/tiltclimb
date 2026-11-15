import * as ex from 'excalibur';
import { audio } from '../audio/audio';
import { KILL_BY_KIND, SHOT_BY_KIND } from '../audio/sounds';
import { InputRouter } from '../input/input-router';
import { Button } from '../ui/button';
import { UiText } from '../ui/ui-text';
import { circlesOverlap, climbScore } from './combat-math';
import {
  ENEMY_POOL_SIZE,
  ENEMY_SPAWN_INTERVAL_MS,
  ENEMY_SPAWN_MARGIN,
  FIRE_BUTTON_HEIGHT,
  FIRE_BUTTON_WIDTH,
  HERO_HIT_RADIUS,
  HERO_SHOT_SPEED,
  MAX_HORIZONTAL_SPEED,
  OBSTACLE_POOL_SIZE,
  OBSTACLE_RADIUS,
  PLAYER_HITBOX_WIDTH,
  PLAYER_SCREEN_FRACTION,
  PLAYER_VISUAL_HEIGHT,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_POOL_SIZE,
  SHOT_MIN_INTERVAL_MS,
  SPAWN_GAP_PX,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { EnemyPool } from './enemy';
import { ARCHETYPES, kindsAvailableAt, maxAliveAt } from './enemy-archetypes';
import { ExplosionPool } from './explosion';
import { ObstaclePool } from './obstacle-pool';
import { PlayerShip } from './player';
import { ProjectilePool } from './projectile';
import { session } from './session';
import { CLIMB_SPEED_START, climbSpeedAt } from './speed';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const MARGIN_X = 24;
const OBSTACLE_EDGE_MARGIN = 48;
const EXIT_DELAY_MS = 500;
const FIRE_BUTTON_Y = WORLD_HEIGHT - 96;
const ENEMY_EDGE_MARGIN = 24;

/** Which blast sheet belongs to which ship: patrol, diver, hunter, ufo. */
const BLAST_BY_KIND = { patrol: 0, diver: 1, hunter: 2, ufo: 3 } as const;

/**
 * The run: the ship climbs through an asteroid field while enemy ships weave downwards and
 * shoot. Bullets and ships stay out of the engine's collision system on purpose — the scene
 * resolves them by hand, which is what keeps asteroids immune to gunfire.
 */
export class ClimbScene extends ex.Scene {
  private inputRouter!: InputRouter;
  private obstacles!: ObstaclePool;
  private projectiles!: ProjectilePool;
  private enemies!: EnemyPool;
  private player!: PlayerShip;
  private starfield!: Starfield;
  private scoreText!: UiText;
  private bannerText!: UiText;
  private fireButton!: Button;
  private explosions!: ExplosionPool;
  private stingTimer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private leaving = false;
  private score = 0;
  private kills = 0;
  private killPoints = 0;
  private nextSpawnY = 0;
  private enemySpawnAccumulator = 0;
  /** Current climb speed: grows with the height climbed, and everything that scrolls uses it. */
  private speed = CLIMB_SPEED_START;
  private lastShotAt = 0;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  override onInitialize(engine: ex.Engine): void {
    this.starfield = new Starfield(this, 1);

    this.player = new PlayerShip();
    this.player.pos.x = WORLD_WIDTH / 2;
    this.player.pos.y = 0;
    this.add(this.player);

    // The camera is placed by hand instead of a strategy: the ship must sit low on screen,
    // not in the middle, and the offset has to stay constant while the world scrolls.
    this.alignCamera();

    this.obstacles = new ObstaclePool(this, OBSTACLE_POOL_SIZE);
    this.projectiles = new ProjectilePool(this, PROJECTILE_POOL_SIZE);
    this.enemies = new EnemyPool(this, ENEMY_POOL_SIZE);
    this.inputRouter = new InputRouter(engine, session.tilt);
    // Dragging must not start on the fire button, or steering would fight the thumb.
    this.inputRouter.setDragStartLimit(FIRE_BUTTON_Y - FIRE_BUTTON_HEIGHT / 2 - 12);

    this.player.on('collisionstart', () => {
      this.endRun();
    });

    this.createHud();
    this.explosions = new ExplosionPool(this);
  }

  override onActivate(_context: SceneContext): void {
    audio.syncMusic('game');
    this.startRun();
  }

  override onDeactivate(_context: SceneContext): void {
    this.running = false;
    this.leaving = false;
    this.player.stopExhaust();
    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
    }
    if (this.stingTimer !== null) {
      clearTimeout(this.stingTimer);
      this.stingTimer = null;
    }
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    if (!this.running) {
      return;
    }

    this.speed = climbSpeedAt(this.climbedHeight());
    this.player.vel.y = -this.speed;

    this.starfield.update(elapsed, this.speed);
    this.explosions.tick(elapsed);

    this.player.vel.x = this.inputRouter.axis(elapsed) * MAX_HORIZONTAL_SPEED;

    const drag = this.inputRouter.consumeDragDelta();
    if (drag !== 0) {
      this.player.pos.x = this.clampX(this.player.pos.x + drag);
    }

    this.spawnAhead();
    this.obstacles.recycleBelow(this.cameraBottom());
    this.updateEnemies(elapsed);
    this.projectiles.recycleOutside(this.topEdge() - 200, this.cameraBottom());
    this.resolveHits();
    this.updateScore();
  }

  override onPostUpdate(): void {
    this.alignCamera();
    if (this.running) {
      this.player.pos.x = this.clampX(this.player.pos.x);
    }
  }

  /** Keeps the ship in the lower part of the screen: the camera sits above it. */
  private alignCamera(): void {
    this.camera.pos.x = WORLD_WIDTH / 2;
    this.camera.pos.y = this.player.pos.y - WORLD_HEIGHT * (PLAYER_SCREEN_FRACTION - 0.5);
  }

  private startRun(): void {
    this.obstacles.releaseAll();
    this.projectiles.releaseAll();
    this.enemies.releaseAll();

    this.player.pos.x = WORLD_WIDTH / 2;
    this.player.pos.y = 0;
    this.player.vel.x = 0;
    this.speed = climbSpeedAt(0);
    this.player.vel.y = -this.speed;
    this.player.startExhaust();

    this.score = 0;
    this.kills = 0;
    this.killPoints = 0;
    this.scoreText.setText('0');
    this.bannerText.setText('');
    this.nextSpawnY = -WORLD_HEIGHT * PLAYER_SCREEN_FRACTION - SPAWN_GAP_PX * 0.5;
    this.enemySpawnAccumulator = 0;
    this.lastShotAt = 0;

    this.leaving = false;
    this.running = true;
    this.setFireEnabled(true);
  }

  private endRun(): void {
    if (!this.running || this.leaving) {
      return;
    }

    this.leaving = true;
    this.running = false;
    this.player.vel = ex.Vector.Zero;
    this.player.stopExhaust();
    this.projectiles.freezeAll();
    this.enemies.freezeAll();

    const isRecord = session.recordScore(this.score, this.kills);
    this.bannerText.setText(`${this.score}`);

    this.explosions.burst(this.player.pos.x, this.player.pos.y, 0, 2.2);
    audio.playSfx('death-hero');
    audio.playSfx('death-impact');

    // The verdict lands after the explosion, not on top of it.
    this.stingTimer = setTimeout(() => {
      this.stingTimer = null;
      audio.playSfx(isRecord ? 'record' : 'lose');
    }, 420);
    this.setFireEnabled(false);

    // Short pause so the collision is readable before the scene changes.
    this.exitTimer = setTimeout(() => {
      this.exitTimer = null;
      void this.engine.goToScene('menu');
    }, EXIT_DELAY_MS);
  }

  private updateScore(): void {
    const total = climbScore(this.climbedHeight(), this.killPoints);
    if (total > this.score) {
      this.score = total;
      this.scoreText.setText(String(total));
    }
  }

  private updateEnemies(elapsed: number): void {
    const context = {
      heroX: this.player.pos.x,
      topEdge: this.topEdge(),
      viewHeight: WORLD_HEIGHT,
      speed: this.speed,
    };

    for (const enemy of [...this.enemies.active]) {
      const angles = enemy.behave(elapsed, context);
      if (angles) {
        audio.playSfx(SHOT_BY_KIND[enemy.kind]);
        this.projectiles.spawnVolley('enemy', enemy.pos.x, enemy.pos.y + enemy.hitRadius, {
          speed: ARCHETYPES[enemy.kind].fire.speed,
          angles,
        });
      }
    }

    this.enemies.recycleBelow(this.cameraBottom());

    const height = this.climbedHeight();
    this.enemySpawnAccumulator += elapsed;
    if (this.enemySpawnAccumulator < ENEMY_SPAWN_INTERVAL_MS) {
      return;
    }
    if (this.enemies.aliveCount >= maxAliveAt(height)) {
      return;
    }

    this.enemySpawnAccumulator = 0;
    const kinds = kindsAvailableAt(height);
    const kind = kinds[Math.floor(Math.random() * kinds.length)] ?? 'patrol';
    const margin = ENEMY_SPAWN_MARGIN + ENEMY_EDGE_MARGIN;
    const x = margin + Math.random() * (WORLD_WIDTH - margin * 2);
    this.enemies.spawn(kind, x, this.topEdge() - ARCHETYPES[kind].visualWidth);
  }

  /**
   * Hand-rolled collisions: hero bullets hit enemy ships, enemy bullets and ships hit the hero,
   * asteroids hit nobody. Explicit beats three layers of collision groups.
   */
  private resolveHits(): void {
    const hero = { x: this.player.pos.x, y: this.player.pos.y, r: HERO_HIT_RADIUS };

    for (const projectile of [...this.projectiles.active]) {
      const bullet = { x: projectile.pos.x, y: projectile.pos.y, r: PROJECTILE_HIT_RADIUS };

      if (projectile.faction === 'hero') {
        const target = [...this.enemies.active].find((enemy) =>
          circlesOverlap(bullet, { x: enemy.pos.x, y: enemy.pos.y, r: enemy.hitRadius }),
        );
        if (target) {
          this.projectiles.release(projectile);
          this.enemies.release(target);
          audio.playSfx(KILL_BY_KIND[target.kind]);
          this.explosions.burst(target.pos.x, target.pos.y, BLAST_BY_KIND[target.kind]);
          this.kills += 1;
          this.killPoints += target.points;
          this.updateScore();
        }
        continue;
      }

      if (circlesOverlap(bullet, hero)) {
        this.projectiles.release(projectile);
        this.endRun();
        return;
      }
    }

    if (!this.running) {
      return;
    }

    const rammed = [...this.enemies.active].find((enemy) =>
      circlesOverlap({ x: enemy.pos.x, y: enemy.pos.y, r: enemy.hitRadius }, hero),
    );
    if (rammed) {
      this.endRun();
    }
  }

  private fireHero(): void {
    if (!this.running) {
      return;
    }

    const now = performance.now();
    if (now - this.lastShotAt < SHOT_MIN_INTERVAL_MS) {
      return;
    }
    this.lastShotAt = now;
    audio.playSfx('shot-hero');

    this.projectiles.spawn('hero', this.player.pos.x, this.player.pos.y - PLAYER_VISUAL_HEIGHT, {
      speed: HERO_SHOT_SPEED,
    });
  }

  private setFireEnabled(enabled: boolean): void {
    this.fireButton.setEnabled(enabled);
  }

  /** Keeps asteroids waiting above the viewport, one SPAWN_GAP apart. */
  private spawnAhead(): void {
    const topEdge = this.topEdge();
    while (this.nextSpawnY > topEdge - SPAWN_GAP_PX) {
      this.obstacles.acquire(this.randomObstacleX(), this.nextSpawnY);
      this.nextSpawnY -= SPAWN_GAP_PX;
    }
  }

  private randomObstacleX(): number {
    const half = OBSTACLE_RADIUS + 8;
    const min = half + OBSTACLE_EDGE_MARGIN;
    const max = WORLD_WIDTH - half - OBSTACLE_EDGE_MARGIN;
    return min + Math.random() * (max - min);
  }

  /** Top edge of the visible world, given where the camera sits above the ship. */
  private topEdge(): number {
    return this.player.pos.y - WORLD_HEIGHT * PLAYER_SCREEN_FRACTION;
  }

  /** How far the ship has climbed, in world px. Never negative. */
  private climbedHeight(): number {
    return Math.max(0, -this.player.pos.y);
  }

  private cameraBottom(): number {
    return this.player.pos.y + WORLD_HEIGHT * (1 - PLAYER_SCREEN_FRACTION) + SPAWN_GAP_PX;
  }

  private clampX(x: number): number {
    const half = PLAYER_HITBOX_WIDTH / 2;
    return Math.min(WORLD_WIDTH - half, Math.max(half, x));
  }

  private createHud(): void {
    this.scoreText = new UiText(this, {
      x: MARGIN_X,
      y: MARGIN_X,
      size: 44,
      color: '#e6edf3',
      align: 'left',
      valign: 'top',
      z: 100,
    });
    this.scoreText.setText('0');

    this.bannerText = new UiText(this, {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      size: 96,
      color: '#e6edf3',
      z: 100,
    });
    this.bannerText.setText('');

    this.fireButton = new Button({
      x: WORLD_WIDTH / 2,
      y: FIRE_BUTTON_Y,
      width: FIRE_BUTTON_WIDTH,
      height: FIRE_BUTTON_HEIGHT,
      label: 'FIRE',
      onPress: () => {
        this.fireHero();
      },
    });
    this.fireButton.z = 100;
    this.add(this.fireButton);
  }
}
