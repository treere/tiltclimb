import * as ex from 'excalibur';

const COLOR_IDLE = ex.Color.fromHex('#1f6feb');
const COLOR_HOVER = ex.Color.fromHex('#2f81f7');
const COLOR_PRESSED = ex.Color.fromHex('#17479b');
const COLOR_DISABLED = ex.Color.fromHex('#232b36');
const TEXT_COLOR = ex.Color.fromHex('#e6edf3');
const TEXT_DISABLED = ex.Color.fromHex('#5d6b7d');

export type ButtonOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fontSize?: number;
  onPress: () => void;
};

/**
 * A tappable button built from a rectangle and a text graphic, driven by the actor's own
 * pointer events. No UI library: Excalibur already gives per-actor pointer bounds.
 */
export class Button extends ex.ScreenElement {
  private readonly plate: ex.Rectangle;
  private readonly caption: ex.Text;
  private readonly group: ex.GraphicsGroup;
  private readonly pressHandler: () => void;
  private enabled = true;
  private armed = false;
  private hovering = false;

  constructor(options: ButtonOptions) {
    super({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      anchor: ex.Vector.Half,
    });

    this.pressHandler = options.onPress;
    this.plate = new ex.Rectangle({
      width: options.width,
      height: options.height,
      color: COLOR_IDLE,
    });
    this.caption = new ex.Text({
      text: options.label,
      color: TEXT_COLOR,
      font: new ex.Font({
        size: options.fontSize ?? 34,
        family: 'sans-serif',
        color: TEXT_COLOR,
      }),
    });

    // Graphic origins are centred by default and the group anchors the combined bounds,
    // so zero offsets make the caption concentric with the plate.
    this.group = new ex.GraphicsGroup({
      members: [
        { graphic: this.plate, offset: ex.vec(0, 0) },
        { graphic: this.caption, offset: ex.vec(0, 0) },
      ],
    });
    this.graphics.use(this.group);

    this.on('pointerenter', () => {
      this.hovering = true;
      this.refresh();
    });

    this.on('pointerleave', () => {
      this.hovering = false;
      this.armed = false;
      this.refresh();
    });

    this.on('pointerdown', () => {
      if (!this.enabled) {
        return;
      }
      this.armed = true;
      this.refresh();
    });

    this.on('pointerup', () => {
      const wasArmed = this.armed;
      this.armed = false;
      this.refresh();
      if (this.enabled && wasArmed) {
        this.pressHandler();
      }
    });
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.armed = false;
    }
    this.refresh();
  }

  setLabel(label: string): void {
    this.caption.text = label;
  }

  /** Brief visual feedback, used by the calibration confirmation. */
  flash(): void {
    this.plate.color = COLOR_HOVER;
    setTimeout(() => this.refresh(), 140);
  }

  private refresh(): void {
    if (!this.enabled) {
      this.plate.color = COLOR_DISABLED;
      this.caption.color = TEXT_DISABLED;
      return;
    }

    this.caption.color = TEXT_COLOR;
    if (this.armed) {
      this.plate.color = COLOR_PRESSED;
    } else if (this.hovering) {
      this.plate.color = COLOR_HOVER;
    } else {
      this.plate.color = COLOR_IDLE;
    }
  }
}
