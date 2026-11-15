import * as ex from 'excalibur';

// Space palette: dark translucent hull inside a glowing edge, so a button reads as a panel
// floating on the star field rather than a bright solid block.
const FILL_IDLE = new ex.Color(14, 26, 43, 0.88);
const FILL_HOVER = new ex.Color(20, 44, 68, 0.92);
const FILL_PRESSED = new ex.Color(30, 66, 100, 0.95);
const FILL_DISABLED = new ex.Color(14, 19, 26, 0.75);

const EDGE_IDLE = ex.Color.fromHex('#2f6f9e');
const EDGE_HOVER = ex.Color.fromHex('#4fb3ff');
const EDGE_PRESSED = ex.Color.fromHex('#8fdcff');
const EDGE_DISABLED = ex.Color.fromHex('#2a3442');

const TEXT_COLOR = ex.Color.fromHex('#dbeafe');
const TEXT_HOVER = ex.Color.fromHex('#ffffff');
const TEXT_DISABLED = ex.Color.fromHex('#5d6b7d');

/** Border thickness in logical pixels. Excalibur rasters only expose a stroke colour,
 *  so the border is a second rectangle inset inside the first. */
const EDGE_WIDTH = 3;

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
        size: options.fontSize ?? 34,
        family: 'sans-serif',
        color: TEXT_COLOR,
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
