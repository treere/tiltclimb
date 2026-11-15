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
  private readonly tiles: Tile[] = [];
  private readonly stars: Star[] = [];

  constructor(scene: ex.Scene, factor = 1) {
    this.factor = factor;
    this.buildTiles(scene);
    this.buildStars(scene);
  }

  /**
   * `speed` is the current climb speed: the field has to follow the game when it accelerates,
   * otherwise the background and the ship drift apart and the world looks like it is sliding.
   */
  update(elapsedMs: number, speed = CLIMB_SPEED_START): void {
    const dt = (elapsedMs / 1000) * this.factor;

    const tileTravel = speed * STARFIELD_TILE_FACTOR * dt;
    for (const tile of this.tiles) {
      tile.actor.pos.y += tileTravel;
      if (tile.actor.pos.y - tile.size / 2 > WORLD_HEIGHT) {
        tile.actor.pos.y -= tile.size * TILE_ROWS;
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

  private buildTiles(scene: ex.Scene): void {
    const base = backgroundImage.toSprite();
    const scale = WORLD_WIDTH / base.width;
    const size = base.height * scale;

    for (let row = 0; row < TILE_ROWS; row++) {
      const sprite = backgroundImage.toSprite();
      sprite.scale = ex.vec(scale, scale);

      const actor = new ex.ScreenElement({
        x: WORLD_WIDTH / 2,
        y: row * size,
        anchor: ex.Vector.Half,
        z: -100 + row,
      });
      actor.graphics.use(sprite);
      scene.add(actor);
      this.tiles.push({ actor, size });
    }
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
