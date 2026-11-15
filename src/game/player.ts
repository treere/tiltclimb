import * as ex from 'excalibur';
import {
  PLAYER_HITBOX_HEIGHT,
  PLAYER_HITBOX_WIDTH,
  PLAYER_VISUAL_HEIGHT,
  PLAYER_VISUAL_WIDTH,
} from './constants';
import { createFlameAnimation, shipImage } from './sprites';

/** The ship sprite scaled to the size the game expects. */
export function createShipSprite(): ex.Sprite {
  const sprite = shipImage.toSprite();
  const scale = PLAYER_VISUAL_WIDTH / sprite.width;
  sprite.scale = ex.vec(scale, scale);
  return sprite;
}

/** The player: the ship sprite with the exhaust plume as a child actor, so it follows. */
export class PlayerShip extends ex.Actor {
  private readonly exhaust: ex.Animation;
  private readonly plume: ex.Actor;

  constructor() {
    super({
      name: 'player',
      width: PLAYER_HITBOX_WIDTH,
      height: PLAYER_HITBOX_HEIGHT,
      collisionType: ex.CollisionType.Active,
    });

    this.graphics.use(createShipSprite());

    this.exhaust = createFlameAnimation();
    this.plume = new ex.Actor({
      pos: ex.vec(0, PLAYER_VISUAL_HEIGHT / 2 + 8),
      z: -1,
    });
    this.plume.graphics.use(this.exhaust);
    this.addChild(this.plume);

    this.exhaust.play();
  }

  startExhaust(): void {
    this.plume.graphics.isVisible = true;
    this.exhaust.play();
  }

  stopExhaust(): void {
    this.exhaust.pause();
    this.plume.graphics.isVisible = false;
  }
}

/** Static ship with a live plume, used as illustration by the menu. */
export function createMenuShip(): ex.ScreenElement {
  const holder = new ex.ScreenElement({ x: 0, y: 0, anchor: ex.Vector.Half });
  holder.graphics.use(createShipSprite());

  const exhaust = createFlameAnimation();
  const plume = new ex.Actor({
    pos: ex.vec(0, PLAYER_VISUAL_HEIGHT / 2 + 8),
    z: -1,
  });
  plume.graphics.use(exhaust);
  holder.addChild(plume);
  exhaust.play();

  return holder;
}
