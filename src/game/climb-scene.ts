import * as ex from 'excalibur';
import { audio } from '../audio/audio';
import { KILL_BY_KIND, SHOT_BY_KIND } from '../audio/sounds';
import { InputRouter } from '../input/input-router';
import { Button } from '../ui/button';
import { HeatBar } from '../ui/heat-bar';
import { PauseToggle } from '../ui/pause-toggle';
import { UiText } from '../ui/ui-text';
import { circlesOverlap, climbScore } from './combat-math';
import {
  ENEMY_POOL_SIZE,
  ENEMY_SPAWN_INTERVAL_MS,
  ENEMY_SPAWN_MARGIN,
  FIRE_BAND_HEIGHT,
  FIRE_BUTTON_HEIGHT,
  FIRE_BUTTON_WIDTH,
  HERO_HIT_RADIUS,
  HERO_SHOT_SPEED,
  MAX_HORIZONTAL_SPEED,
  OBSTACLE_POOL_SIZE,
  OBSTACLE_RADIUS,
  PAUSE_TOGGLE_MARGIN,
  PLAYER_HITBOX_WIDTH,
  PLAYER_SCREEN_FRACTION,
  PLAYER_VISUAL_HEIGHT,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_POOL_SIZE,
  SHOT_MIN_INTERVAL_MS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { type Enemy, EnemyPool } from './enemy';
import { ARCHETYPES, kindsAvailableAt, maxAliveAt } from './enemy-archetypes';
import { ExplosionPool } from './explosion';
import { levelAt, specForLevel } from './levels';
import { ObstaclePool } from './obstacle-pool';
import { Pickup } from './pickup';
import { PlayerShip } from './player';
import {
  afterPickup,
  afterTime,
  BLINK_MS,
  IDLE,
  isActive,
  isWarning,
  type PowerUpState,
  shouldDrop,
} from './powerups';
import { ProjectilePool } from './projectile';
import { session } from './session';
import { CLIMB_SPEED_START } from './speed';
import { Starfield } from './starfield';
import {
  COLD,
  canFire,
  HEAT_MAX,
  type HeatState,
  heatAfterCooling,
  heatAfterShot,
} from './weapon-heat';

type SceneContext = ex.SceneActivationContext<unknown>;

const MARGIN_X = 24;
const OBSTACLE_EDGE_MARGIN = 48;
const EXIT_DELAY_MS = 500;
/** How long the level announcement stays on screen. */
const LEVEL_BANNER_MS = 1200;
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
  private heat: HeatState = { ...COLD };
  private powerUp: PowerUpState = { ...IDLE };
  private pickup!: Pickup;
  private blinkOn = false;
  private nextBlinkAt = 0;
  private heatBar!: HeatBar;
  private level = 1;
  private levelSpec = specForLevel(1);
  private levelText!: UiText;
  private levelBanner!: UiText;
  /** Wall clock: the banner must fade after a second of real time, not of game clock. */
  private levelBannerUntil = 0;
  private lastShotAt = 0;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;
  private paused = false;
  /** Velocities stored on pause and restored on resume: Excalibur integrates them every frame. */
  private frozenMotion: { actor: ex.Actor; vel: ex.Vector }[] = [];
  private pauseToggle!: PauseToggle;
  private pauseOverlay!: ex.ScreenElement;
  private pauseText!: UiText;
  private resumeHint!: UiText;

  private canvasElement: HTMLCanvasElement | null = null;

  private readonly onCanvasPointerUp = (event: PointerEvent): void => {
    const canvas = this.canvasElement;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const scale = this.engine.screen.resolution.width / rect.width;
    this.handlePauseTap((event.clientX - rect.left) * scale, (event.clientY - rect.top) * scale);
  };

  /** Leaving the page mid-run pauses it: a notification must not cost the run. */
  private readonly onVisibilityChange = (): void => {
    if (document.hidden && this.running && !this.leaving) {
      this.setPaused(true);
    }
  };

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
    // The whole bottom strip fires on a tap; the button keeps its own handler and is excluded here,
    // so one tap cannot fire twice.
    this.inputRouter.setFireBandHeight(FIRE_BAND_HEIGHT);
    this.inputRouter.setFireButtonRect({
      left: WORLD_WIDTH / 2 - FIRE_BUTTON_WIDTH / 2,
      top: FIRE_BUTTON_Y - FIRE_BUTTON_HEIGHT / 2,
      width: FIRE_BUTTON_WIDTH,
      height: FIRE_BUTTON_HEIGHT,
    });
    this.inputRouter.onFireTap(() => {
      this.fireHero();
    });

    this.player.on('collisionstart', () => {
      // Powered means invincible: asteroids pass through, everything else still applies.
      if (isActive(this.powerUp)) {
        return;
      }
      this.endRun();
    });

    this.pickup = new Pickup();
    this.add(this.pickup);

    this.createHud();
    this.createPauseUi(engine);
    this.explosions = new ExplosionPool(this);
  }

  override onActivate(_context: SceneContext): void {
    audio.syncMusic('game');
    this.startRun();
    // A run always opens running: the state is set first, then the UI is forced in line with it.
    this.paused = false;
    this.setPaused(false);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    // onActivate can run again after a scene switch: attach once, not once per run.
    this.canvasElement?.removeEventListener('pointerup', this.onCanvasPointerUp);
    if (this.canvasElement) {
      this.canvasElement.addEventListener('pointerup', this.onCanvasPointerUp);
    }
  }

  override onDeactivate(_context: SceneContext): void {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.canvasElement?.removeEventListener('pointerup', this.onCanvasPointerUp);
    this.running = false;
    this.leaving = false;
    this.paused = false;
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
    // Paused means paused: no scroll, no spawning, no score, and no collision evaluation — a ship
    // overlapping an asteroid while paused does not die.
    if (!this.running || this.paused) {
      return;
    }

    const level = levelAt(this.climbedHeight());
    if (level !== this.level) {
      this.enterLevel(level);
    }
    if (this.levelBannerUntil > 0 && performance.now() > this.levelBannerUntil) {
      this.levelBannerUntil = 0;
      this.levelBanner.setText('');
    }

    this.speed = this.levelSpec.climbSpeed;
    this.player.vel.y = -this.speed;

    this.heat = heatAfterCooling(this.heat, elapsed);
    this.refreshFireState();
    this.updatePowerUp(elapsed);

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
    this.heat = { ...COLD };
    this.powerUp = { ...IDLE };
    this.blinkOn = false;
    this.nextBlinkAt = 0;
    this.pickup?.hide();
    this.player.setPowered(false);
    this.level = 1;
    this.levelSpec = specForLevel(1);
    this.speed = this.levelSpec.climbSpeed;
    this.player.vel.y = -this.speed;

    this.refreshFireState();
    this.levelText.setText(`LV ${this.level}`);
    this.levelBanner.setText('');
    this.levelBannerUntil = 0;
    this.player.startExhaust();

    this.score = 0;
    this.kills = 0;
    this.killPoints = 0;
    this.scoreText.setText('0');
    this.bannerText.setText('');
    this.nextSpawnY = -WORLD_HEIGHT * PLAYER_SCREEN_FRACTION - this.levelSpec.obstacleGap * 0.5;
    this.enemySpawnAccumulator = 0;
    this.lastShotAt = 0;

    this.leaving = false;
    this.running = true;
    this.refreshFireState();
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
    this.refreshFireState();

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

    this.enemySpawnAccumulator += elapsed;
    if (this.enemySpawnAccumulator < ENEMY_SPAWN_INTERVAL_MS) {
      return;
    }
    if (this.enemies.aliveCount >= maxAliveAt(this.level)) {
      return;
    }

    this.enemySpawnAccumulator = 0;
    const kinds = kindsAvailableAt(this.level);
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
          this.destroyShip(target);
        }
        continue;
      }

      if (circlesOverlap(bullet, hero)) {
        this.projectiles.release(projectile);
        // Powered means invincible: the projectile is consumed and nothing else happens.
        if (isActive(this.powerUp)) {
          continue;
        }
        this.endRun();
        return;
      }
    }

    if (!this.running) {
      return;
    }

    if (this.pickup.isShown) {
      const reached = circlesOverlap(
        { x: this.pickup.pos.x, y: this.pickup.pos.y, r: this.pickup.width / 2 },
        hero,
      );
      if (reached) {
        this.collectPickup();
      }
    }

    const rammed = [...this.enemies.active].find((enemy) =>
      circlesOverlap({ x: enemy.pos.x, y: enemy.pos.y, r: enemy.hitRadius }, hero),
    );
    if (rammed) {
      if (isActive(this.powerUp)) {
        this.destroyShip(rammed);
      } else {
        this.endRun();
      }
    }
  }

  /** One ship destroyed, by a shot or by a powered hero: same explosion, same points, same drop. */
  private destroyShip(enemy: Enemy): void {
    this.enemies.release(enemy);
    audio.playSfx(KILL_BY_KIND[enemy.kind]);
    this.explosions.burst(enemy.pos.x, enemy.pos.y, BLAST_BY_KIND[enemy.kind]);
    this.kills += 1;
    this.killPoints += enemy.points;
    this.updateScore();

    if (shouldDrop(Math.random())) {
      this.pickup.show(enemy.pos.x, enemy.pos.y);
    }
  }

  private collectPickup(): void {
    this.pickup.hide();
    this.powerUp = afterPickup();
    this.blinkOn = false;
    this.nextBlinkAt = 0;
    this.player.setPowered(true);
    audio.playSfx('pickup');
  }

  /** Timer, warning blink and the return to normal colour, all on the game clock. */
  private updatePowerUp(elapsed: number): void {
    if (!isActive(this.powerUp)) {
      return;
    }

    this.powerUp = afterTime(this.powerUp, elapsed);

    if (!isActive(this.powerUp)) {
      this.blinkOn = false;
      this.player.setPowered(false);
      return;
    }

    if (!isWarning(this.powerUp)) {
      if (this.blinkOn) {
        this.blinkOn = false;
        this.player.setPowered(true);
      }
      return;
    }

    const now = performance.now();
    if (now >= this.nextBlinkAt) {
      this.nextBlinkAt = now + BLINK_MS;
      this.blinkOn = !this.blinkOn;
      this.player.setPowered(!this.blinkOn);
    }
  }

  private fireHero(): void {
    if (!this.running || this.paused || this.leaving || !canFire(this.heat)) {
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

    // Heat is added only on a shot that actually happened, so tapping while jammed cannot slow the
    // cooldown down.
    this.heat = heatAfterShot(this.heat);
    this.refreshFireState();
  }

  /** Round control in the corner plus the cover that says how to get back. */
  private createPauseUi(engine: ex.Engine): void {
    this.pauseOverlay = new ex.ScreenElement({
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      z: 150,
    });
    this.pauseOverlay.graphics.use(
      new ex.Rectangle({
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        color: ex.Color.fromHex('#0e1116'),
      }),
    );
    this.pauseOverlay.graphics.opacity = 0.82;
    this.add(this.pauseOverlay);

    this.pauseText = new UiText(this, {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT * 0.42,
      size: 64,
      color: '#e6edf3',
      z: 151,
    });
    this.pauseText.setText('PAUSED');

    this.resumeHint = new UiText(this, {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT * 0.56,
      size: 34,
      color: '#8b98a8',
      z: 151,
    });
    this.resumeHint.setText('tap here to resume');

    // Plain DOM listener on the canvas, not a per-actor handler: Excalibur dispatches the same
    // pointerup to several actors at once (so the cover unpaused what the control had just
    // paused), and its `screenPos` drifts with the camera, which made the control unusable once
    // the world had scrolled. clientX/clientY against the canvas rect is boring and exact.
    this.canvasElement = engine.canvas;
    this.canvasElement.addEventListener('pointerup', this.onCanvasPointerUp);
    this.pauseToggle = new PauseToggle(WORLD_WIDTH - PAUSE_TOGGLE_MARGIN, PAUSE_TOGGLE_MARGIN);
    this.pauseToggle.z = 160;
    this.add(this.pauseToggle);

    // Graphics components start visible: without this the very first run opens with the cover
    // already drawn over a world that is running fine underneath.
    this.applyPauseVisibility(false);
  }

  /** The only place that decides whether the cover is on screen. */
  private applyPauseVisibility(visible: boolean): void {
    this.pauseOverlay.graphics.isVisible = visible;
    this.pauseText.actor.graphics.isVisible = visible;
    this.resumeHint.actor.graphics.isVisible = visible;
  }

  /**
   * Where a tap resumes the run.
   *
   * Deliberately not the whole cover: a tap anywhere also reaches the fire band, and resuming on the
   * same gesture fired a shot the instant the pause lifted. The resume target and the pause control
   * are the only two places that change the paused state.
   */
  private isOnResumeArea(x: number, y: number): boolean {
    const halfWidth = 260;
    const halfHeight = 70;
    const centerX = WORLD_WIDTH / 2;
    const centerY = WORLD_HEIGHT * 0.56;
    return Math.abs(x - centerX) <= halfWidth && Math.abs(y - centerY) <= halfHeight;
  }

  /** Position test against the round control, in screen coordinates. */
  private isOnPauseControl(x: number, y: number): boolean {
    const half = this.pauseToggle.width / 2;
    const centerX = this.pauseToggle.pos.x + half;
    const centerY = this.pauseToggle.pos.y + half;
    return Math.hypot(x - centerX, y - centerY) <= half;
  }

  private handlePauseTap(x: number, y: number): void {
    if (!this.running || this.leaving) {
      return;
    }
    if (this.paused) {
      if (this.isOnResumeArea(x, y) || this.isOnPauseControl(x, y)) {
        this.setPaused(false);
      }
      // A tap elsewhere while paused does nothing at all: not resume, not fire.
      return;
    }
    if (this.isOnPauseControl(x, y)) {
      this.setPaused(true);
    }
  }

  private setPaused(paused: boolean): void {
    if (this.leaving) {
      return;
    }

    const next = paused && this.running;
    const changed = next !== this.paused;
    this.paused = next;

    if (changed) {
      if (this.paused) {
        this.freezeMotion();
      } else {
        this.thawMotion();
      }
    }

    // Applied even when the state did not change: the UI must never depend on how it got here.
    this.applyPauseVisibility(this.paused);
    this.pauseToggle.setPaused(this.paused);
    this.refreshFireState();
  }

  /**
   * Freezing by hand instead of stopping the engine clock: the clock also drives rendering, and a
   * stopped loop would never draw the pause cover. Zeroing velocities keeps the picture live while
   * nothing moves.
   */
  private freezeMotion(): void {
    this.frozenMotion = [];
    const freeze = (actor: ex.Actor): void => {
      this.frozenMotion.push({ actor, vel: actor.vel.clone() });
      actor.vel = ex.Vector.Zero;
    };

    freeze(this.player);
    for (const projectile of this.projectiles.active) {
      freeze(projectile);
    }
    for (const enemy of this.enemies.active) {
      freeze(enemy);
    }
  }

  private thawMotion(): void {
    for (const entry of this.frozenMotion) {
      entry.actor.vel = entry.vel;
    }
    this.frozenMotion = [];
    // The climb speed may have changed while paused; this is the authoritative value.
    this.player.vel.y = -this.speed;
  }

  /**
   * The single place that decides how the fire control looks: three reasons can disable it — paused,
   * run over, cannon jammed — and three call sites writing the button separately is how they end up
   * disagreeing.
   */
  private refreshFireState(): void {
    const available = this.running && !this.paused && canFire(this.heat);
    this.fireButton.setEnabled(available);
    this.fireButton.setLabel(this.heat.jammed ? 'COOLING' : 'FIRE');
    this.heatBar?.setValue(this.heat.heat / HEAT_MAX, this.heat.jammed);
  }

  /**
   * Keeps asteroids waiting above the viewport, one gap apart, where the gap belongs to the current
   * level: rows already on screen keep their spacing, new ones adopt the tighter one.
   */
  private spawnAhead(): void {
    const topEdge = this.topEdge();
    const gap = this.levelSpec.obstacleGap;
    while (this.nextSpawnY > topEdge - gap) {
      this.obstacles.acquire(this.randomObstacleX(), this.nextSpawnY);
      this.nextSpawnY -= gap;
    }
  }

  /** Applies what a new level changes: read by the rest of the scene, and announced on screen. */
  private enterLevel(level: number): void {
    this.level = level;
    this.levelSpec = specForLevel(level);
    this.levelText.setText(`LV ${level}`);
    this.levelBanner.setText(`LEVEL ${level}`);
    this.levelBannerUntil = performance.now() + LEVEL_BANNER_MS;
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
    return (
      this.player.pos.y + WORLD_HEIGHT * (1 - PLAYER_SCREEN_FRACTION) + this.levelSpec.obstacleGap
    );
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

    this.levelText = new UiText(this, {
      x: MARGIN_X,
      y: MARGIN_X + 54,
      size: 26,
      color: '#8b98a8',
      weight: 500,
      align: 'left',
      valign: 'top',
      z: 100,
    });
    this.levelText.setText('LV 1');

    this.levelBanner = new UiText(this, {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT * 0.3,
      size: 56,
      color: '#7fd4ff',
      z: 100,
    });
    this.levelBanner.setText('');

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

    this.heatBar = new HeatBar(WORLD_WIDTH / 2, FIRE_BUTTON_Y - FIRE_BUTTON_HEIGHT / 2 - 24);
    this.heatBar.z = 100;
    this.add(this.heatBar);
    this.heatBar.setValue(0, false);
  }
}
