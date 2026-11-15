import * as ex from 'excalibur';
import { audio } from '../audio/audio';
import { tiltSettings } from '../input/tilt-settings';
import { requestSensorPermission } from '../input/tilt-source';
import { AudioToggle } from '../ui/audio-toggle';
import { Button } from '../ui/button';
import { addCenteredGraphic } from '../ui/placement';
import { UiText } from '../ui/ui-text';
import { MENU_STARFIELD_FACTOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { createMenuShip } from './player';
import { session } from './session';
import { Starfield } from './starfield';

type SceneContext = ex.SceneActivationContext<unknown>;

const TEXT = '#e6edf3';
const MUTED = '#8b98a8';
const WARN = '#ffb4a2';
const OK = '#7ee787';
const TRACK = '#232b36';
const NEEDLE = '#4fb3ff';

const BUTTON_WIDTH = 440;
const BUTTON_HEIGHT = 92;
const BAR_WIDTH = 520;
const BAR_HEIGHT = 18;
const NEEDLE_WIDTH = 10;

const CONFIRM_MS = 1200;
/** Fade-in when the menu appears: the loading screen stops being drawn by the engine, so the
 *  curtain lives here and goes from black to transparent over the menu. */
const CURTAIN_MS = 320;

/**
 * First screen of the game: what the sensor is reading, the calibration command, and the two
 * ways out — start a run or read the credits. It also receives the player back after a run.
 *
 * All text goes through `UiText` (canvas-drawn, measured), so nothing depends on Excalibur's
 * lazily measured text bounds.
 */
export class MenuScene extends ex.Scene {
  private angleText!: UiText;
  private resultText!: UiText;
  private warningText!: UiText;
  private confirmText!: UiText;
  private needle!: ex.ScreenElement;
  private needleCenterX = 0;
  private calibrateButton!: Button;
  private starfield!: Starfield;
  private sensitivityCaption!: UiText;
  private sensitivityValue!: UiText;
  private decreaseButton!: Button;
  private increaseButton!: Button;
  private confirmTimer: ReturnType<typeof setTimeout> | null = null;
  private curtain!: ex.ScreenElement;
  private curtainLeft = 0;
  private sensorPromptInFlight = false;

  override onInitialize(engine: ex.Engine): void {
    // Listening early is free and harmless: without permission no event arrives, and
    // the permission prompt itself happens inside the first user gesture.
    session.tilt.listen();

    const safe = engine.screen.contentArea;
    const height = safe.height > 0 ? safe.height : WORLD_HEIGHT;
    const width = safe.width > 0 ? safe.width : WORLD_WIDTH;
    const centerX = width / 2;
    const at = (fraction: number): number => safe.top + height * fraction;

    this.starfield = new Starfield(this, MENU_STARFIELD_FACTOR);

    // Speaker toggle in the corner: a big touch area without a fourth row of buttons.
    this.add(new AudioToggle(width - 56, safe.top + 56));

    const ship = createMenuShip();
    ship.pos.x = centerX;
    ship.pos.y = at(0.19);
    ship.z = 6;
    this.add(ship);

    new UiText(this, { x: centerX, y: at(0.09), size: 72, color: TEXT, weight: 700 }).setText(
      'TILTCLIMB',
    );
    new UiText(this, { x: centerX, y: at(0.15), size: 26, color: MUTED, weight: 400 }).setText(
      'inclina il telefono per sterzare',
    );
    new UiText(this, { x: centerX, y: at(0.25), size: 24, color: MUTED, weight: 500 }).setText(
      'INCLINAZIONE',
    );

    this.angleText = new UiText(this, { x: centerX, y: at(0.32), size: 84, color: TEXT });

    addCenteredGraphic(
      this,
      new ex.Rectangle({ width: BAR_WIDTH, height: BAR_HEIGHT, color: ex.Color.fromHex(TRACK) }),
      centerX,
      at(0.39),
      2,
    );

    const needleGraphic = new ex.Rectangle({
      width: NEEDLE_WIDTH,
      height: 44,
      color: ex.Color.fromHex(NEEDLE),
    });
    this.needle = addCenteredGraphic(this, needleGraphic, centerX, at(0.39), 10);
    this.needleCenterX = centerX;

    this.resultText = new UiText(this, { x: centerX, y: at(0.45), size: 32, color: TEXT });
    this.warningText = new UiText(this, {
      x: centerX,
      y: at(0.51),
      size: 24,
      color: WARN,
      weight: 500,
      maxWidth: BUTTON_WIDTH + 100,
    });

    // Sensibilita': due pulsanti e un valore, niente slider — su schermo piccolo un
    // trascinamento preciso e' piu' facile sbagliarlo che centrarlo.
    this.sensitivityCaption = new UiText(this, {
      x: centerX,
      y: at(0.565),
      size: 22,
      color: MUTED,
      weight: 500,
    });

    this.decreaseButton = new Button({
      x: centerX - 118,
      y: at(0.63),
      width: 84,
      height: 76,
      label: '−',
      fontSize: 44,
      onPress: () => {
        this.changeSensitivity(-1);
      },
    });
    this.add(this.decreaseButton);

    this.sensitivityValue = new UiText(this, { x: centerX, y: at(0.63), size: 34, color: TEXT });

    this.increaseButton = new Button({
      x: centerX + 118,
      y: at(0.63),
      width: 84,
      height: 76,
      label: '+',
      fontSize: 44,
      onPress: () => {
        this.changeSensitivity(1);
      },
    });
    this.add(this.increaseButton);

    this.calibrateButton = new Button({
      x: centerX,
      y: at(0.72),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: 'Calibra',
      onPress: () => {
        void this.onCalibrate();
      },
    });
    this.add(this.calibrateButton);

    const startButton = new Button({
      x: centerX,
      y: at(0.81),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: 'Inizia gioco',
      onPress: () => {
        void this.onStart();
      },
    });
    this.add(startButton);

    const creditsButton = new Button({
      x: centerX,
      y: at(0.9),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      label: 'CREDITI',
      onPress: () => {
        void this.engine.goToScene('credits');
      },
    });
    this.add(creditsButton);

    this.confirmText = new UiText(this, { x: centerX, y: at(0.955), size: 28, color: OK });

    // Full-screen black cover, faded out on activation so the menu does not pop in.
    this.curtain = new ex.ScreenElement({
      x: 0,
      y: 0,
      width,
      height,
      z: 200,
    });
    this.curtain.graphics.use(new ex.Rectangle({ width, height, color: ex.Color.Black }));
    this.curtain.graphics.opacity = 0;
    this.add(this.curtain);

    // Any tap on the menu counts as the gesture that can ask for sensor permission.
    engine.input.pointers.primary.on('down', () => {
      void this.ensureSensor();
    });
  }

  override onActivate(_context: SceneContext): void {
    this.curtainLeft = CURTAIN_MS;
    this.curtain.graphics.opacity = 1;
    audio.syncMusic('menu');
    this.refreshResult();
    this.refreshWarning();
    this.refreshSensitivity();
    this.confirmText.setText('');
  }

  override onDeactivate(_context: SceneContext): void {
    this.clearConfirmTimer();
  }

  override onPreUpdate(_engine: ex.Engine, elapsed: number): void {
    this.starfield.update(elapsed);
    this.updateCurtain(elapsed);

    if (session.sensorPromptDone) {
      session.tilt.tick();
    }

    this.refreshWarning();
    this.refreshReadout(elapsed);
  }

  private updateCurtain(elapsed: number): void {
    if (this.curtainLeft <= 0) {
      return;
    }
    this.curtainLeft = Math.max(0, this.curtainLeft - elapsed);
    this.curtain.graphics.opacity = this.curtainLeft / CURTAIN_MS;
  }

  private refreshReadout(elapsed: number): void {
    const available = session.tilt.isAvailable;

    this.angleText.setText(
      available
        ? `${session.tilt.relativeDegrees >= 0 ? '+' : ''}${session.tilt.relativeDegrees.toFixed(1)}°`
        : '—',
    );

    const axis = available ? session.tilt.axis(elapsed) : 0;
    // The needle is drawn from its top-left corner, so subtract half its width.
    this.needle.pos.x = this.needleCenterX + (axis * (BAR_WIDTH - 20)) / 2 - NEEDLE_WIDTH / 2;
  }

  private refreshWarning(): void {
    if (session.tilt.isAvailable) {
      this.warningText.setText('');
      this.calibrateButton.setLabel('Calibra');
      return;
    }

    this.calibrateButton.setLabel('Sensore non disponibile');
    this.warningText.setText(
      session.sensorPromptDone
        ? 'Sensore non disponibile: si gioca con il trascinamento o con le frecce.'
        : 'Tocca lo schermo per attivare i sensori.',
    );
  }

  private refreshSensitivity(): void {
    this.sensitivityCaption.setText(`SENSIBILITÀ · ${tiltSettings.rangeDeg}°`);
    this.sensitivityValue.setText(tiltSettings.label);
    this.decreaseButton.setEnabled(!tiltSettings.isSoft);
    this.increaseButton.setEnabled(!tiltSettings.isNervous);
  }

  private changeSensitivity(step: number): void {
    tiltSettings.setLevel(tiltSettings.tiltLevel + step);
    // Applied to the live source too, so the needle in the menu reacts immediately. The
    // calibrated zero is untouched: sensitivity is a scale, the calibration is an offset.
    session.tilt.setSensitivityDeg(tiltSettings.rangeDeg);
    this.refreshSensitivity();
  }

  private refreshResult(): void {
    this.resultText.setText(
      session.hasPlayed
        ? `Ultimo: ${session.lastScore}   Migliore: ${session.bestScore}   Abbattuti: ${session.lastKills}`
        : '',
    );
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
      this.confirmText.setColor(WARN);
      this.showConfirm('Niente da calibrare: sensore non disponibile');
      return;
    }

    session.tilt.calibrate();
    this.calibrateButton.flash();
    this.confirmText.setColor(OK);
    this.showConfirm('Calibrato ✓');
  }

  private async onStart(): Promise<void> {
    void this.ensureSensor();
    await this.engine.goToScene('climb');
  }

  private showConfirm(text: string): void {
    this.clearConfirmTimer();
    this.confirmText.setText(text);
    this.confirmTimer = setTimeout(() => {
      this.confirmTimer = null;
      this.confirmText.setText('');
    }, CONFIRM_MS);
  }

  private clearConfirmTimer(): void {
    if (this.confirmTimer !== null) {
      clearTimeout(this.confirmTimer);
      this.confirmTimer = null;
    }
  }
}
