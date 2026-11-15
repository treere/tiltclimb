import * as ex from 'excalibur';
// The game's real sprites, inlined in the bundle as data URLs: they cost a few KB each and are
// available immediately, while the images the loader is fetching are not there yet.
import enemyShipUrl from '../assets/ships/enemyRed1.png?inline';
import heroShipUrl from '../assets/ships/playerShip2_blue.png?inline';

/** How long the screen stays even when everything is already cached. */
const MIN_VISIBLE_MS = 700;

const BACKGROUND = '#0e1116';
const HERO = '#4fb3ff';
const ENEMY = '#e05b4a';
const STAR = '#dbeafe';
const BAR_TRACK = '#232b36';
const BAR_FILL = '#7fd4ff';
const TEXT = '#e6edf3';
const MUTED = '#8b98a8';

const FAMILY = 'ui-sans-serif, system-ui, sans-serif';

const STAR_COUNT = 40;

const HERO_SPRITE = new Image();
HERO_SPRITE.src = heroShipUrl;
const ENEMY_SPRITE = new Image();
ENEMY_SPRITE.src = enemyShipUrl;

type Star = { x: number; y: number; size: number; speed: number };

/**
 * Loading screen drawn by the loader itself.
 *
 * Excalibur's `Loader` draws through `onDraw(ctx)` with `this.progress` already available, so
 * replacing the default blue screen is a subclass, not a hack. Everything here is drawn with
 * 2D primitives on purpose: the images and sounds are exactly what is being loaded.
 */
export class ThemedLoader extends ex.Loader {
  private startedAt = 0;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly stars: Star[] = [];

  constructor(resources: ex.Loadable<unknown>[]) {
    super(resources);

    // Fixed pseudo-random field: the same sky every launch, no dependency on Math.random order.
    let seed = 1337;
    const next = (): number => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let index = 0; index < STAR_COUNT; index++) {
      this.stars.push({
        x: next(),
        y: next(),
        size: 1 + next() * 2.2,
        speed: 0.3 + next() * 0.9,
      });
    }
  }

  override async onBeforeLoad(): Promise<void> {
    this.startedAt = performance.now();
  }

  /**
   * Holds the screen until loading is done and the minimum time has passed. The fade belongs to
   * the menu: once loading ends the engine stops drawing this canvas, so fading it here would
   * only fade to the background.
   */
  async show(): Promise<void> {
    await new Promise<void>((resolve) => {
      const tick = (): void => {
        const elapsed = performance.now() - this.startedAt;
        if (this.progress >= 1 && elapsed >= MIN_VISIBLE_MS) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  override onDraw(ctx: CanvasRenderingContext2D): void {
    const width = this.engine.screen.resolution.width;
    const height = this.engine.screen.resolution.height;
    const time = this.reducedMotion ? 0 : (performance.now() - this.startedAt) / 1000;

    ctx.save();

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    this.drawStars(ctx, width, height, time);
    this.drawChase(ctx, width, height, time);
    this.drawTitle(ctx, width, height);
    this.drawProgress(ctx, width, height);

    ctx.restore();
  }

  private drawStars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ): void {
    ctx.fillStyle = STAR;
    for (const star of this.stars) {
      const travel = this.reducedMotion ? 0 : (time * 40 * star.speed) % height;
      const y = (star.y * height + travel) % height;
      ctx.globalAlpha = 0.25 + star.speed * 0.6;
      ctx.fillRect(star.x * width, y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  /** Two chevrons: the hero chasing an enemy that is always a little ahead. */
  private drawChase(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ): void {
    const baseY = height * 0.44;
    const swing = Math.min(width * 0.3, 240);
    // The enemy is almost a quarter wave ahead and higher up: with the real sprites, wide as
    // they are, a shorter lead would make them look like a single ship.
    const enemyX = width / 2 + Math.sin(time * 0.9) * swing;
    const enemyY = baseY - height * 0.05 + Math.sin(time * 1.4) * height * 0.02;
    const heroX = width / 2 + Math.sin(time * 0.9 - 0.85) * swing;
    const heroY = baseY + height * 0.05 + Math.sin(time * 1.4 - 0.85) * height * 0.02;

    // Trail and pitch follow the derivative of the sine, so the ships lean into the wave
    // instead of sliding rigidly.
    const heroDir = Math.cos(time * 0.9 - 0.85);
    const enemyDir = Math.cos(time * 0.9);
    const heroWidth = Math.min(width * 0.4, 170);
    const enemyWidth = heroWidth * 0.66;

    this.drawShip(ctx, heroX, heroY, heroWidth, HERO_SPRITE, HERO, -heroDir * 0.18);
    this.drawShip(ctx, enemyX, enemyY, enemyWidth, ENEMY_SPRITE, ENEMY, -enemyDir * 0.18);
  }

  /**
   * Draws the game sprite, tilted and with two faint copies trailing behind. Until the inlined
   * image has decoded (a few milliseconds) it falls back to the plain chevron, so the screen is
   * never empty.
   */
  private drawShip(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    sprite: HTMLImageElement,
    fallbackColor: string,
    angle: number,
  ): void {
    const ready = sprite.complete && sprite.naturalWidth > 0;
    const trailOffset = width * 0.16;

    for (let step = 2; step >= 1; step--) {
      ctx.save();
      ctx.globalAlpha = 0.22 / step;
      ctx.translate(x + Math.sin(angle) * step * trailOffset * 4, y + step * trailOffset);
      ctx.rotate(angle);
      if (ready) {
        const height = (width * sprite.naturalHeight) / sprite.naturalWidth;
        ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
      } else {
        this.drawChevron(ctx, 0, 0, width * 0.32, fallbackColor);
      }
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (ready) {
      const height = (width * sprite.naturalHeight) / sprite.naturalWidth;
      ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
    } else {
      this.drawChevron(ctx, 0, 0, width * 0.32, fallbackColor);
    }
    ctx.restore();
  }

  private drawChevron(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.72, size * 0.62);
    ctx.lineTo(0, size * 0.24);
    ctx.lineTo(-size * 0.72, size * 0.62);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawTitle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = TEXT;
    ctx.font = `700 ${Math.round(height * 0.045)}px ${FAMILY}`;
    ctx.fillText('TILTCLIMB', width / 2, height * 0.26);

    ctx.fillStyle = MUTED;
    ctx.font = `400 ${Math.round(height * 0.018)}px ${FAMILY}`;
    ctx.fillText('the squad is further ahead', width / 2, height * 0.31);
  }

  private drawProgress(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const barWidth = Math.min(width * 0.7, 520);
    const barHeight = Math.max(10, Math.round(height * 0.012));
    const x = (width - barWidth) / 2;
    const y = height * 0.78;
    const progress = Math.max(0, Math.min(1, this.progress));

    ctx.fillStyle = BAR_TRACK;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = BAR_FILL;
    ctx.fillRect(x, y, barWidth * progress, barHeight);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = MUTED;
    ctx.font = `500 ${Math.round(height * 0.016)}px ${FAMILY}`;
    ctx.fillText(`${Math.round(progress * 100)}%`, width / 2, y + barHeight + height * 0.028);
  }
}
