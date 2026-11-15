import * as ex from 'excalibur';
import { InputRouter } from '../input/input-router';
import {
  CLIMB_SPEED,
  MAX_HORIZONTAL_SPEED,
  OBSTACLE_POOL_SIZE,
  OBSTACLE_RADIUS,
  PIXELS_PER_POINT,
  PLAYER_HITBOX_WIDTH,
  SPAWN_GAP_PX,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { ObstaclePool } from './obstacle-pool';
import { PlayerShip } from './player';
import { session } from './session';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const TEXT_COLOR = ex.Color.fromHex('#e6edf3');
const MARGIN_X = 24;
const OBSTACLE_EDGE_MARGIN = 48;
const EXIT_DELAY_MS = 500;

/**
 * The run itself: the ship climbs through an asteroid field, obstacles are recycled, the
 * camera follows one axis and the star field scrolls behind. The scene has no menu of its
 * own — it starts on activation and hands control back to the menu scene on a hit.
 */
export class ClimbScene extends ex.Scene {
  private inputRouter!: InputRouter;
  private pool!: ObstaclePool;
  private player!: PlayerShip;
  private starfield!: Starfield;
  private scoreGraphic!: ex.Text;
  private bannerGraphic!: ex.Text;
  private running = false;
  private leaving = false;
  private score = 0;
  private nextSpawnY = 0;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

  override onInitialize(engine: ex.Engine): void {
    this.starfield = new Starfield(this, 1);

    this.player = new PlayerShip();
    this.player.pos.x = WORLD_WIDTH / 2;
    this.player.pos.y = 0;
    this.add(this.player);

    // Vertical only: horizontal movement must not drag the world along.
    this.camera.strategy.lockToActorAxis(this.player, ex.Axis.Y);

    this.pool = new ObstaclePool(this, OBSTACLE_POOL_SIZE);
    this.inputRouter = new InputRouter(engine, session.tilt);

    this.player.on('collisionstart', () => {
      this.endRun();
    });

    this.createHud();
  }

  override onActivate(_context: SceneContext): void {
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
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    if (!this.running) {
      return;
    }

    this.starfield.update(elapsed);

    this.player.vel.x = this.inputRouter.axis(elapsed) * MAX_HORIZONTAL_SPEED;

    const drag = this.inputRouter.consumeDragDelta();
    if (drag !== 0) {
      this.player.pos.x = this.clampX(this.player.pos.x + drag);
    }

    this.spawnAhead();
    this.pool.recycleBelow(this.cameraBottom());
    this.updateScore();
  }

  override onPostUpdate(): void {
    if (this.running) {
      this.player.pos.x = this.clampX(this.player.pos.x);
    }
  }

  private startRun(): void {
    this.pool.releaseAll();

    this.player.pos.x = WORLD_WIDTH / 2;
    this.player.pos.y = 0;
    this.player.vel.x = 0;
    this.player.vel.y = -CLIMB_SPEED;
    this.player.startExhaust();

    this.score = 0;
    this.scoreGraphic.text = '0';
    this.bannerGraphic.text = '';
    this.nextSpawnY = -WORLD_HEIGHT / 2 - SPAWN_GAP_PX * 0.5;

    this.leaving = false;
    this.running = true;
  }

  private endRun(): void {
    if (!this.running || this.leaving) {
      return;
    }

    this.leaving = true;
    this.running = false;
    this.player.vel = ex.Vector.Zero;
    this.player.stopExhaust();

    session.recordScore(this.score);
    this.bannerGraphic.text = `${this.score}`;

    // Short pause so the collision is readable before the scene changes.
    this.exitTimer = setTimeout(() => {
      this.exitTimer = null;
      void this.engine.goToScene('menu');
    }, EXIT_DELAY_MS);
  }

  private updateScore(): void {
    const climbed = Math.max(0, -this.player.pos.y);
    const points = Math.floor(climbed / PIXELS_PER_POINT);
    if (points > this.score) {
      this.score = points;
      this.scoreGraphic.text = String(points);
    }
  }

  /** Keeps asteroids waiting above the viewport, one SPAWN_GAP apart. */
  private spawnAhead(): void {
    const topEdge = this.player.pos.y - WORLD_HEIGHT / 2;
    while (this.nextSpawnY > topEdge - SPAWN_GAP_PX) {
      this.pool.acquire(this.randomObstacleX(), this.nextSpawnY);
      this.nextSpawnY -= SPAWN_GAP_PX;
    }
  }

  private randomObstacleX(): number {
    const half = OBSTACLE_RADIUS + 8;
    const min = half + OBSTACLE_EDGE_MARGIN;
    const max = WORLD_WIDTH - half - OBSTACLE_EDGE_MARGIN;
    return min + Math.random() * (max - min);
  }

  private cameraBottom(): number {
    return this.player.pos.y + WORLD_HEIGHT / 2 + SPAWN_GAP_PX;
  }

  private clampX(x: number): number {
    const half = PLAYER_HITBOX_WIDTH / 2;
    return Math.min(WORLD_WIDTH - half, Math.max(half, x));
  }

  private createHud(): void {
    this.scoreGraphic = new ex.Text({
      text: '0',
      color: TEXT_COLOR,
      font: new ex.Font({ size: 44, family: 'sans-serif', color: TEXT_COLOR }),
    });

    const scoreHolder = new ex.ScreenElement({ x: MARGIN_X, y: MARGIN_X });
    scoreHolder.graphics.use(this.scoreGraphic);
    scoreHolder.z = 100;
    this.add(scoreHolder);

    this.bannerGraphic = new ex.Text({
      text: '',
      color: TEXT_COLOR,
      font: new ex.Font({ size: 96, family: 'sans-serif', color: TEXT_COLOR }),
    });

    const bannerHolder = new ex.ScreenElement({
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      anchor: ex.Vector.Half,
    });
    bannerHolder.graphics.use(this.bannerGraphic);
    bannerHolder.z = 100;
    this.add(bannerHolder);
  }
}
