import * as ex from 'excalibur';
import { Button } from '../ui/button';
import { MENU_STARFIELD_FACTOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { CREDITS, STORY } from './credits-text';
import { createMenuShip } from './player';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const TITLE_COLOR = ex.Color.fromHex('#e6edf3');
const BODY_COLOR = ex.Color.fromHex('#d6e2ef');
const MUTED_COLOR = ex.Color.fromHex('#8b98a8');

/** Shadow behind text shown over the star field: without it the glyphs lose their edges. */
const TEXT_SHADOW = { offset: ex.vec(2, 2), color: ex.Color.Black, blur: 0 };

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

    const title = new ex.Text({
      text: 'CREDITI',
      color: TITLE_COLOR,
      font: new ex.Font({
        size: 60,
        family: 'sans-serif',
        color: TITLE_COLOR,
        textAlign: ex.TextAlign.Center,
        shadow: TEXT_SHADOW,
      }),
    });
    this.addCentered(title, centerX, at(0.21));

    const story = new ex.Text({
      text: STORY.join('\n\n'),
      color: BODY_COLOR,
      maxWidth: Math.min(width - 80, 620),
      font: new ex.Font({
        size: 28,
        family: 'sans-serif',
        color: BODY_COLOR,
        lineHeight: 38,
        textAlign: ex.TextAlign.Center,
        shadow: TEXT_SHADOW,
      }),
    });
    this.addCentered(story, centerX, at(0.4));

    const credits = new ex.Text({
      text: CREDITS.map((line) => `${line.label}: ${line.value}`).join('\n'),
      color: MUTED_COLOR,
      maxWidth: Math.min(width - 80, 620),
      font: new ex.Font({
        size: 24,
        family: 'sans-serif',
        color: MUTED_COLOR,
        lineHeight: 34,
        textAlign: ex.TextAlign.Center,
        shadow: TEXT_SHADOW,
      }),
    });
    this.addCentered(credits, centerX, at(0.68));

    const back = new Button({
      x: centerX,
      y: at(0.87),
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
    // Nothing to reset: the page is read-only by design.
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    this.starfield.update(elapsed);
  }

  private addCentered(graphic: ex.Text, x: number, y: number): void {
    const holder = new ex.ScreenElement({ x, y, anchor: ex.Vector.Half });
    holder.graphics.use(graphic);
    holder.z = 5;
    this.add(holder);
  }
}
