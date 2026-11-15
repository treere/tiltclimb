import * as ex from 'excalibur';
import { requestSensorPermission } from '../input/tilt-source';
import { Button } from '../ui/button';
import { MENU_STARFIELD_FACTOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { createMenuShip } from './player';
import { session } from './session';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const TITLE_COLOR = ex.Color.fromHex('#e6edf3');
const MUTED_COLOR = ex.Color.fromHex('#8b98a8');
const WARN_COLOR = ex.Color.fromHex('#ffb4a2');
const OK_COLOR = ex.Color.fromHex('#7ee787');
const TRACK_COLOR = ex.Color.fromHex('#232b36');
const NEEDLE_COLOR = ex.Color.fromHex('#4fb3ff');

const BUTTON_WIDTH = 440;
const BUTTON_HEIGHT = 96;
const BAR_WIDTH = 520;
const BAR_HEIGHT = 18;

const CONFIRM_MS = 1200;

/**
 * First screen of the game: shows what the sensor is reading, lets the player fix the
 * neutral inclination, and starts a run. It also receives the player back after a run,
 * with the score of that run and the best of the session.
 */
export class MenuScene extends ex.Scene {
  private angleGraphic!: ex.Text;
  private resultGraphic!: ex.Text;
  private warningGraphic!: ex.Text;
  private confirmGraphic!: ex.Text;
  private needle!: ex.ScreenElement;
  private calibrateButton!: Button;
  private startButton!: Button;
  private starfield!: Starfield;
  private confirmTimer: ReturnType<typeof setTimeout> | null = null;
  private sensorPromptInFlight = false;

  override onInitialize(engine: ex.Engine): void {
    // Listening early is free and harmless: without permission no event arrives, and
    // the permission prompt itself happens inside the first user gesture.
    session.tilt.listen();

    const safe = engine.screen.contentArea;
    const height = safe.height > 0 ? safe.height : WORLD_HEIGHT;
    const top = safe.top;
    const centerX = (safe.width > 0 ? safe.width : WORLD_WIDTH) / 2;
    const at = (fraction: number): number => top + height * fraction;

    this.starfield = new Starfield(this, MENU_STARFIELD_FACTOR);

    const ship = createMenuShip();
    ship.pos.x = centerX;
    ship.pos.y = at(0.235);
    ship.z = 6;
    this.add(ship);

    const title = new ex.Text({
      text: 'TILTCLIMB',
      color: TITLE_COLOR,
      font: new ex.Font({ size: 72, family: 'sans-serif', color: TITLE_COLOR }),
    });
    this.addCenteredText(title, centerX, at(0.1));

    const subtitle = new ex.Text({
      text: 'inclina il telefono per sterzare',
      color: MUTED_COLOR,
      font: new ex.Font({ size: 28, family: 'sans-serif', color: MUTED_COLOR }),
    });
    this.addCenteredText(subtitle, centerX, at(0.17));

    const label = new ex.Text({
      text: 'INCLINAZIONE',
      color: MUTED_COLOR,
      font: new ex.Font({ size: 26, family: 'sans-serif', color: MUTED_COLOR }),
    });
    this.addCenteredText(label, centerX, at(0.28));

    this.angleGraphic = new ex.Text({
      text: '—',
      color: TITLE_COLOR,
      font: new ex.Font({ size: 88, family: 'sans-serif', color: TITLE_COLOR }),
    });
    this.addCenteredText(this.angleGraphic, centerX, at(0.34));

    const track = new ex.ScreenElement({
      x: centerX,
      y: at(0.44),
      anchor: ex.Vector.Half,
    });
    track.graphics.use(
      new ex.Rectangle({ width: BAR_WIDTH, height: BAR_HEIGHT, color: TRACK_COLOR }),
    );
    this.add(track);

    this.needle = new ex.ScreenElement({
      x: centerX,
      y: at(0.44),
      anchor: ex.Vector.Half,
    });
    this.needle.graphics.use(new ex.Rectangle({ width: 10, height: 44, color: NEEDLE_COLOR }));
    this.needle.z = 10;
    this.add(this.needle);

    this.resultGraphic = new ex.Text({
      text: '',
      color: TITLE_COLOR,
      font: new ex.Font({ size: 34, family: 'sans-serif', color: TITLE_COLOR }),
    });
    this.addCenteredText(this.resultGraphic, centerX, at(0.53));

    this.warningGraphic = new ex.Text({
      text: '',
      color: WARN_COLOR,
      maxWidth: BUTTON_WIDTH + 120,
      font: new ex.Font({ size: 26, family: 'sans-serif', color: WARN_COLOR }),
    });
    this.addCenteredText(this.warningGraphic, centerX, at(0.62));

    this.calibrateButton = new Button({
      x: centerX,
      y: at(0.73),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: 'Calibra',
      onPress: () => {
        void this.onCalibrate();
      },
    });
    this.add(this.calibrateButton);

    this.startButton = new Button({
      x: centerX,
      y: at(0.85),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: 'Inizia gioco',
      onPress: () => {
        void this.onStart();
      },
    });
    this.add(this.startButton);

    this.confirmGraphic = new ex.Text({
      text: '',
      color: OK_COLOR,
      font: new ex.Font({ size: 30, family: 'sans-serif', color: OK_COLOR }),
    });
    this.addCenteredText(this.confirmGraphic, centerX, at(0.93));

    // Any tap on the menu counts as the gesture that can ask for sensor permission.
    engine.input.pointers.primary.on('down', () => {
      void this.ensureSensor();
    });
  }

  override onActivate(_context: SceneContext): void {
    this.refreshResult();
    this.refreshWarning();
    this.confirmGraphic.text = '';
  }

  override onDeactivate(_context: SceneContext): void {
    this.clearConfirmTimer();
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    this.starfield.update(elapsed);

    if (session.sensorPromptDone) {
      session.tilt.tick();
    }

    this.refreshWarning();
    this.refreshReadout(elapsed);
  }

  private addCenteredText(graphic: ex.Text, x: number, y: number): void {
    const holder = new ex.ScreenElement({ x, y, anchor: ex.Vector.Half });
    holder.graphics.use(graphic);
    holder.z = 5;
    this.add(holder);
  }

  private refreshReadout(elapsed: number): void {
    const available = session.tilt.isAvailable;

    this.angleGraphic.text = available
      ? `${session.tilt.relativeDegrees >= 0 ? '+' : ''}${session.tilt.relativeDegrees.toFixed(1)}°`
      : '—';

    const axis = available ? session.tilt.axis(elapsed) : 0;
    const safe = this.engine.screen.contentArea;
    const centerX = (safe.width > 0 ? safe.width : WORLD_WIDTH) / 2;
    this.needle.pos.x = centerX + (axis * (BAR_WIDTH - 20)) / 2;
  }

  private refreshWarning(): void {
    const available = session.tilt.isAvailable;
    if (available) {
      this.warningGraphic.text = '';
      this.calibrateButton.setLabel('Calibra');
      return;
    }

    this.calibrateButton.setLabel('Sensore non disponibile');
    if (session.sensorPromptDone) {
      this.warningGraphic.text =
        'Sensore non disponibile: si gioca con il trascinamento o con le frecce.';
    } else {
      this.warningGraphic.text = 'Tocca lo schermo per attivare i sensori.';
    }
  }

  private refreshResult(): void {
    if (!session.hasPlayed) {
      this.resultGraphic.text = '';
      return;
    }
    this.resultGraphic.text = `Ultimo: ${session.lastScore}   Migliore: ${session.bestScore}   Abbattuti: ${session.lastKills}`;
  }

  private async ensureSensor(): Promise<void> {
    if (session.sensorPromptDone || this.sensorPromptInFlight) {
      return;
    }

    this.sensorPromptInFlight = true;
    session.sensorPromptDone = true;
    const granted = await requestSensorPermission();
    if (granted) {
      session.tilt.listen();
    } else {
      session.tilt.markUnavailable();
    }
    this.sensorPromptInFlight = false;
  }

  private async onCalibrate(): Promise<void> {
    await this.ensureSensor();

    if (!session.tilt.isAvailable) {
      this.showConfirm('Niente da calibrare: sensore non disponibile', WARN_COLOR);
      return;
    }

    session.tilt.calibrate();
    this.calibrateButton.flash();
    this.showConfirm('Calibrato ✓', OK_COLOR);
  }

  private async onStart(): Promise<void> {
    void this.ensureSensor();
    await this.engine.goToScene('climb');
  }

  private showConfirm(text: string, color: ex.Color): void {
    this.clearConfirmTimer();
    this.confirmGraphic.text = text;
    this.confirmGraphic.color = color;
    this.confirmTimer = setTimeout(() => {
      this.confirmTimer = null;
      this.confirmGraphic.text = '';
    }, CONFIRM_MS);
  }

  private clearConfirmTimer(): void {
    if (this.confirmTimer !== null) {
      clearTimeout(this.confirmTimer);
      this.confirmTimer = null;
    }
  }
}
