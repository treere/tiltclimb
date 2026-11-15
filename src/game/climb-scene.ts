import * as ex from 'excalibur';
import { InputRouter } from '../input/input-router';
import { requestSensorPermission, TiltSource } from '../input/tilt-source';
import {
  CLIMB_SPEED,
  HITBOX_SCALE,
  MAX_HORIZONTAL_SPEED,
  OBSTACLE_POOL_SIZE,
  OBSTACLE_WIDTH,
  PIXELS_PER_POINT,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  SPAWN_GAP_PX,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { ObstaclePool } from './obstacle-pool';

type GameState = 'idle' | 'playing' | 'gameover';

const PLAYER_COLOR = ex.Color.fromHex('#4fb3ff');
const TEXT_COLOR = ex.Color.fromHex('#e6edf3');
const MUTED_COLOR = ex.Color.fromHex('#8b98a8');
const MARGIN_X = 24;
const OBSTACLE_EDGE_MARGIN = 48;

/**
 * The whole game: a player that climbs forever, obstacles recycled from a pool, and a
 * single explicit state machine (idle -> playing -> gameover). Input arrives through
 * InputRouter, so nothing here knows whether the tilt, the keyboard or a drag produced
 * the movement.
 */
export class ClimbScene extends ex.Scene {
  private readonly tilt = new TiltSource();
  private inputRouter!: InputRouter;
  private pool!: ObstaclePool;
  private player!: ex.Actor;
  private scoreGraphic!: ex.Text;
  private bannerGraphic!: ex.Text;
  private state: GameState = 'idle';
  private score = 0;
  private nextSpawnY = 0;
  private permissionResolved = false;

  override onInitialize(engine: ex.Engine): void {
    this.player = new ex.Actor({
      name: 'player',
      x: WORLD_WIDTH / 2,
      y: 0,
      width: PLAYER_WIDTH * HITBOX_SCALE,
      height: PLAYER_HEIGHT * HITBOX_SCALE,
      collisionType: ex.CollisionType.Active,
    });
    this.player.graphics.use(
      new ex.Rectangle({
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        color: PLAYER_COLOR,
      }),
    );
    this.add(this.player);

    // The camera only follows the vertical axis: horizontal movement must not drag the world.
    this.camera.strategy.lockToActorAxis(this.player, ex.Axis.Y);

    this.pool = new ObstaclePool(this, OBSTACLE_POOL_SIZE);
    this.inputRouter = new InputRouter(engine, this.tilt);

    this.player.on('collisionstart', () => {
      this.endRun();
    });

    this.createHud();
    engine.input.pointers.primary.on('down', () => {
      void this.handleTap();
    });

    this.enterIdle();
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    this.tilt.tick();

    if (this.state !== 'playing') {
      return;
    }

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
    if (this.state === 'playing') {
      this.player.pos.x = this.clampX(this.player.pos.x);
    }
  }

  /** Called by main on load, and by nothing else: the scene owns its own input wiring. */
  get tiltSource(): TiltSource {
    return this.tilt;
  }

  private async handleTap(): Promise<void> {
    if (this.state === 'playing') {
      return;
    }

    if (!this.permissionResolved) {
      this.permissionResolved = true;
      // Must be inside the gesture: the browser refuses the prompt otherwise.
      const granted = await requestSensorPermission();
      if (granted) {
        this.tilt.listen();
      }
    }

    this.startRun();
  }

  private enterIdle(): void {
    this.state = 'idle';
    this.player.vel = ex.Vector.Zero;
    this.showBanner('Tocca per iniziare');
  }

  private startRun(): void {
    this.pool.releaseAll();
    this.tilt.calibrate();

    this.player.pos.x = WORLD_WIDTH / 2;
    this.player.pos.y = 0;
    this.player.vel.x = 0;
    this.player.vel.y = -CLIMB_SPEED;

    this.score = 0;
    this.scoreGraphic.text = '0';
    this.nextSpawnY = -WORLD_HEIGHT / 2 - SPAWN_GAP_PX * 0.5;

    this.state = 'playing';
    this.hideBanner();
  }

  private endRun(): void {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'gameover';
    this.player.vel = ex.Vector.Zero;
    this.showBanner(`Sei arrivato a ${this.score} · tocca per riprovare`);
  }

  private updateScore(): void {
    const climbed = Math.max(0, -this.player.pos.y);
    const points = Math.floor(climbed / PIXELS_PER_POINT);
    if (points > this.score) {
      this.score = points;
      this.scoreGraphic.text = String(points);
    }
  }

  /** Keeps a fresh obstacle waiting above the viewport, one SPAWN_GAP apart. */
  private spawnAhead(): void {
    const topEdge = this.player.pos.y - WORLD_HEIGHT / 2;
    while (this.nextSpawnY > topEdge - SPAWN_GAP_PX) {
      const x = this.randomObstacleX();
      this.pool.acquire(x, this.nextSpawnY);
      this.nextSpawnY -= SPAWN_GAP_PX;
    }
  }

  private randomObstacleX(): number {
    const half = OBSTACLE_WIDTH / 2;
    const min = half + OBSTACLE_EDGE_MARGIN;
    const max = WORLD_WIDTH - half - OBSTACLE_EDGE_MARGIN;
    return min + Math.random() * (max - min);
  }

  private cameraBottom(): number {
    return this.player.pos.y + WORLD_HEIGHT / 2 + SPAWN_GAP_PX;
  }

  private clampX(x: number): number {
    const half = (PLAYER_WIDTH * HITBOX_SCALE) / 2;
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
      color: MUTED_COLOR,
      font: new ex.Font({ size: 34, family: 'sans-serif', color: MUTED_COLOR }),
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

  private showBanner(text: string): void {
    this.bannerGraphic.text = text;
  }

  private hideBanner(): void {
    this.bannerGraphic.text = '';
  }
}
