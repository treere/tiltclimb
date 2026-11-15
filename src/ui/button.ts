import * as ex from 'excalibur';

// Space palette: an opaque hull inside a glowing edge. Opaque on purpose — a translucent
// plate lets the star field show through and the label loses contrast in patches.
const FILL_IDLE = ex.Color.fromHex('#0b1a2e');
const FILL_HOVER = ex.Color.fromHex('#16324e');
const FILL_PRESSED = ex.Color.fromHex('#1f4a6e');
const FILL_DISABLED = ex.Color.fromHex('#131a22');

const EDGE_IDLE = ex.Color.fromHex('#7fd4ff');
const EDGE_HOVER = ex.Color.fromHex('#a8e4ff');
const EDGE_PRESSED = ex.Color.fromHex('#ffffff');
const EDGE_DISABLED = ex.Color.fromHex('#2a3442');

const TEXT_COLOR = ex.Color.fromHex('#ffffff');
const TEXT_HOVER = ex.Color.fromHex('#ffffff');
// Disabled text stays light enough to keep 7:1 on the disabled fill.
const TEXT_DISABLED = ex.Color.fromHex('#93a7bb');

const EDGE_WIDTH = 3;

/** Default label size: large enough to read on a phone without leaning in. */
const DEFAULT_FONT_SIZE = 38;

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
 * A tappable button built from two rectangles and a text graphic, driven by the actor's own
 * pointer events. No UI library: Excalibur already gives per-actor pointer bounds.
 */
export class Button extends ex.ScreenElement {
  private readonly edge: ex.Rectangle;
  private readonly fill: ex.Rectangle;
  private readonly caption: ex.Text;
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
    this.edge = new ex.Rectangle({
      width: options.width,
      height: options.height,
      color: EDGE_IDLE,
    });
    this.fill = new ex.Rectangle({
      width: options.width - EDGE_WIDTH * 2,
      height: options.height - EDGE_WIDTH * 2,
      color: FILL_IDLE,
    });
    this.caption = new ex.Text({
      text: options.label,
      color: TEXT_COLOR,
      font: new ex.Font({
        size: options.fontSize ?? DEFAULT_FONT_SIZE,
        family: 'sans-serif',
        color: TEXT_COLOR,
        // The shadow keeps the label readable even if the plate is bleached by a star behind it.
        shadow: { offset: ex.vec(2, 2), color: ex.Color.Black, blur: 0 },
      }),
    });

    // Graphic origins are centred by default, so zero offsets stack the three layers
    // concentrically; the smaller fill rectangle is what leaves the border visible.
    const group = new ex.GraphicsGroup({
      members: [
        { graphic: this.edge, offset: ex.vec(0, 0) },
        { graphic: this.fill, offset: ex.vec(0, 0) },
        // useBounds: false keeps a long label from widening the group and shifting the plate.
        { graphic: this.caption, offset: ex.vec(0, 0), useBounds: false },
      ],
    });
    this.graphics.use(group);

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
    this.fill.color = FILL_HOVER;
    this.edge.color = EDGE_PRESSED;
    setTimeout(() => this.refresh(), 140);
  }

  private refresh(): void {
    if (!this.enabled) {
      this.fill.color = FILL_DISABLED;
      this.edge.color = EDGE_DISABLED;
      this.caption.color = TEXT_DISABLED;
      return;
    }

    if (this.armed) {
      this.fill.color = FILL_PRESSED;
      this.edge.color = EDGE_PRESSED;
      this.caption.color = TEXT_HOVER;
      return;
    }

    if (this.hovering) {
      this.fill.color = FILL_HOVER;
      this.edge.color = EDGE_HOVER;
      this.caption.color = TEXT_HOVER;
      return;
    }

    this.fill.color = FILL_IDLE;
    this.edge.color = EDGE_IDLE;
    this.caption.color = TEXT_COLOR;
  }
}
