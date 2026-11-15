import * as ex from 'excalibur';
import { audio } from '../audio/audio';
import { Button } from '../ui/button';
import { UiText } from '../ui/ui-text';
import { MENU_STARFIELD_FACTOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { CREDITS, STORY } from './credits-text';
import { createMenuShip } from './player';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const TITLE = '#e6edf3';
const BODY = '#d6e2ef';
const MUTED = '#8b98a8';

/**
 * The credits page: the story that explains the climb, then who made what. It only reads
 * session-independent data, so going back and forth never disturbs the calibrated sensor.
 */
export class CreditsScene extends ex.Scene {
  private starfield!: Starfield;

  override onInitialize(engine: ex.Engine): void {
    const safe = engine.screen.contentArea;
    const height = safe.height > 0 ? safe.height : WORLD_HEIGHT;
    const width = safe.width > 0 ? safe.width : WORLD_WIDTH;
    const centerX = width / 2;
    const at = (fraction: number): number => safe.top + height * fraction;

    this.starfield = new Starfield(this, MENU_STARFIELD_FACTOR);

    const ship = createMenuShip();
    ship.pos.x = centerX;
    ship.pos.y = at(0.1);
    ship.z = 6;
    this.add(ship);

    new UiText(this, { x: centerX, y: at(0.2), size: 56, color: TITLE, weight: 700 }).setText(
      'CREDITI',
    );

    const wrap = Math.min(width - 80, 620);
    new UiText(this, {
      x: centerX,
      y: at(0.42),
      size: 26,
      color: BODY,
      weight: 400,
      lineHeight: 36,
      maxWidth: wrap,
    }).setLines(STORY);

    new UiText(this, {
      x: centerX,
      y: at(0.7),
      size: 22,
      color: MUTED,
      weight: 500,
      lineHeight: 32,
      maxWidth: wrap,
    }).setLines(CREDITS.map((line) => `${line.label}: ${line.value}`));

    const back = new Button({
      x: centerX,
      y: at(0.88),
      width: 300,
      height: 92,
      label: 'INDIETRO',
      onPress: () => {
        void this.engine.goToScene('menu');
      },
    });
    back.z = 10;
    this.add(back);
  }

  override onActivate(_context: SceneContext): void {
    audio.syncMusic('menu');
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    this.starfield.update(elapsed);
  }
}
