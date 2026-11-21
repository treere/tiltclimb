import * as ex from 'excalibur';
import {
  STARFIELD_FAR_FACTOR,
  STARFIELD_NEAR_FACTOR,
  STARFIELD_TILE_FACTOR,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './constants';
import { CLIMB_SPEED_START } from './speed';
import { backgroundImage, starImages } from './sprites';

const STAR_COUNT = 26;
const TILE_ROWS = 3;

/** How long a palette change takes, in milliseconds of game time. */
export const BIOME_FADE_MS = 600;

type Tile = { actor: ex.ScreenElement; size: number };
type Star = { actor: ex.ScreenElement; depth: number; half: number };

/**
 * Scrolling star field. Everything lives in screen space and is scrolled by hand, so it
 * does not care about the camera: a fixed pool of tiles and stars cycles downwards and
 * wraps back to the top. No allocation after construction.
 *
 * `factor` scales the whole thing: 1 while playing, a small value for a calm menu backdrop.
 */
export class Starfield {
  private readonly factor: number;
  /**
   * Two tile sets: one showing, one waiting for the next biome. The waiting set is invisible and
   * still scrolling, so a palette change can cross-fade instead of popping.
   */
  private readonly tileSets: Tile[][] = [[], []];
  private activeSet = 0;
  /** Milliseconds of fade already played, or null when the palette is settled. */
  private fadeElapsed = 0;
  private fadeDuration = 0;
  private readonly stars: Star[] = [];

  constructor(scene: ex.Scene, factor = 1) {
    this.factor = factor;
    this.buildTiles(scene, 0);
    this.buildTiles(scene, 1);
    this.hideSet(1);
    this.buildStars(scene);
  }

  /** True while a palette change is crossing over. */
  get fading(): boolean {
    return this.fadeDuration > 0;
  }

  /** The set currently showing, for tests and debugging. */
  get visibleSet(): number {
    return this.activeSet;
  }

  /**
   * Changes the sky. `fadeMs` of 0 swaps instantly, which is what a new run wants: the player must not
   * start a climb inside a half-faded palette.
   */
  setBackground(source: ex.ImageSource, fadeMs = BIOME_FADE_MS): void {
    if (this.fadeDuration > 0) {
      // A second change mid-fade: finish the first instantly, then start from there.
      this.settleFade();
    }

    const incoming = 1 - this.activeSet;
    const set = this.tileSets[incoming] ?? [];
    if (set.length === 0) {
      return;
    }

    for (const tile of set) {
      applySource(tile.actor, source);
    }

    if (fadeMs <= 0) {
      this.hideSet(this.activeSet);
      this.showSet(incoming, 1);
      this.activeSet = incoming;
      return;
    }

    this.showSet(incoming, 0);
    this.fadeElapsed = 0;
    this.fadeDuration = fadeMs;
  }

  /**
   * `speed` is the current climb speed: the field has to follow the game when it accelerates,
   * otherwise the background and the ship drift apart and the world looks like it is sliding.
   */
  update(elapsedMs: number, speed = CLIMB_SPEED_START): void {
    const dt = (elapsedMs / 1000) * this.factor;

    const tileTravel = speed * STARFIELD_TILE_FACTOR * dt;
    for (const set of this.tileSets) {
      for (const tile of set) {
        tile.actor.pos.y += tileTravel;
        if (tile.actor.pos.y - tile.size / 2 > WORLD_HEIGHT) {
          tile.actor.pos.y -= tile.size * TILE_ROWS;
        }
      }
    }

    // The cross-fade is driven by elapsed game time, so it pauses with the game and survives a
    // hidden tab instead of running on a wall-clock timer.
    if (this.fadeDuration > 0) {
      this.fadeElapsed += elapsedMs;
      const progress = Math.min(1, this.fadeElapsed / this.fadeDuration);
      const incoming = 1 - this.activeSet;
      this.showSet(this.activeSet, 1 - progress);
      this.showSet(incoming, progress);
      if (progress >= 1) {
        this.settleFade();
      }
    }

    for (const star of this.stars) {
      star.actor.pos.y += speed * star.depth * dt;
      if (star.actor.pos.y - star.half > WORLD_HEIGHT) {
        star.actor.pos.y = -star.half;
        star.actor.pos.x = Math.random() * WORLD_WIDTH;
      }
    }
  }

  private buildTiles(scene: ex.Scene, setIndex: number): void {
    const base = backgroundImage.toSprite();
    const scale = WORLD_WIDTH / base.width;
    const size = base.height * scale;
    const tiles = this.tileSets[setIndex];
    if (!tiles) {
      return;
    }

    for (let row = 0; row < TILE_ROWS; row++) {
      const sprite = backgroundImage.toSprite();
      sprite.scale = ex.vec(scale, scale);

      const actor = new ex.ScreenElement({
        x: WORLD_WIDTH / 2,
        y: row * size,
        anchor: ex.Vector.Half,
        // The waiting set sits a hair above the showing one, so the fade is visible.
        z: (setIndex === this.activeSet ? -100 : -99) + row,
      });
      actor.graphics.use(sprite);
      scene.add(actor);
      tiles.push({ actor, size });
    }
  }

  private showSet(index: number, opacity: number): void {
    for (const tile of this.tileSets[index] ?? []) {
      tile.actor.graphics.isVisible = opacity > 0;
      tile.actor.graphics.opacity = opacity;
    }
  }

  private hideSet(index: number): void {
    for (const tile of this.tileSets[index] ?? []) {
      tile.actor.graphics.isVisible = false;
    }
  }

  /** Ends the fade where it is: the incoming set becomes the showing one. */
  private settleFade(): void {
    const incoming = 1 - this.activeSet;
    this.hideSet(this.activeSet);
    this.showSet(incoming, 1);
    this.activeSet = incoming;
    this.fadeElapsed = 0;
    this.fadeDuration = 0;
  }

  private buildStars(scene: ex.Scene): void {
    for (let index = 0; index < STAR_COUNT; index++) {
      const source = starImages[index % starImages.length];
      if (!source) {
        continue;
      }

      // Depth between "far" and "near": far stars are slower and smaller.
      const depth =
        STARFIELD_FAR_FACTOR + Math.random() * (STARFIELD_NEAR_FACTOR - STARFIELD_FAR_FACTOR);

      const sprite = source.toSprite();
      const scale = 0.5 + depth * 0.9;
      sprite.scale = ex.vec(scale, scale);

      const actor = new ex.ScreenElement({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        anchor: ex.Vector.Half,
        z: -80,
      });
      actor.graphics.use(sprite);
      scene.add(actor);

      this.stars.push({
        actor,
        depth,
        half: (sprite.height * scale) / 2,
      });
    }
  }
}

/** Points a tile at a new background image, keeping its scale. */
function applySource(actor: ex.ScreenElement, source: ex.ImageSource): void {
  const sprite = source.toSprite();
  const scale = WORLD_WIDTH / sprite.width;
  sprite.scale = ex.vec(scale, scale);
  actor.graphics.use(sprite);
}
