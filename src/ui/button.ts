import * as ex from 'excalibur';

// Space palette: an opaque hull inside a glowing edge. Opaque on purpose — a translucent
// plate lets the star field show through and the label loses contrast in patches.
const FILL_IDLE = '#0b1a2e';
const FILL_HOVER = '#16324e';
const FILL_PRESSED = '#1f4a6e';
const FILL_DISABLED = '#131a22';

const EDGE_IDLE = '#7fd4ff';
const EDGE_HOVER = '#a8e4ff';
const EDGE_PRESSED = '#ffffff';
const EDGE_DISABLED = '#2a3442';

const TEXT_COLOR = '#ffffff';
const TEXT_HOVER = '#ffffff';
// Disabled text stays light enough to keep 7:1 on the disabled fill.
const TEXT_DISABLED = '#93a7bb';

const EDGE_WIDTH = 3;

/** Default label size: large enough to read on a phone without leaning in. */
const DEFAULT_FONT_SIZE = 38;

export type ButtonOptions = {
  /** Centre of the button, in screen space. */
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fontSize?: number;
  onPress: () => void;
};

/**
 * A button drawn with the 2D canvas API inside a single `ex.Canvas` graphic.
 *
 * Deliberately not assembled from Excalibur shapes and labels: the plate, the border and the
 * text come from `fillRect` / `strokeRect` / `fillText` with `textAlign: center`, so the label
 * is centred by the same call that centres the plate. No actor anchor, no graphics group,
 * nothing that can be off by half a size.
 */
export class Button extends ex.ScreenElement {
  private label: string;
  private readonly fontSize: number;
  private readonly plateWidth: number;
  private readonly plateHeight: number;
  private readonly pressHandler: () => void;
  private enabled = true;
  private armed = false;
  private hovering = false;
  private flashing = false;

  constructor(options: ButtonOptions) {
    super({
      // Anchor stays at zero: the actor position is the plate's top-left corner.
      x: options.x - options.width / 2,
      y: options.y - options.height / 2,
      width: options.width,
      height: options.height,
    });

    this.label = options.label;
    this.fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    this.plateWidth = options.width;
    this.plateHeight = options.height;
    this.pressHandler = options.onPress;

    // The draw handler runs on every draw and reads live state, so there is nothing to invalidate.
    this.graphics.use(
      new ex.Canvas({
        width: this.plateWidth,
        height: this.plateHeight,
        draw: (ctx: CanvasRenderingContext2D) => this.paint(ctx),
      }),
    );

    this.on('pointerenter', () => {
      this.hovering = true;
    });

    this.on('pointerleave', () => {
      this.hovering = false;
      this.armed = false;
    });

    this.on('pointerdown', () => {
      if (this.enabled) {
        this.armed = true;
      }
    });

    this.on('pointerup', () => {
      const wasArmed = this.armed;
      this.armed = false;
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
  }

  setLabel(label: string): void {
    this.label = label;
  }

  /** Brief highlight, used by the calibration confirmation. */
  flash(): void {
    this.flashing = true;
    setTimeout(() => {
      this.flashing = false;
    }, 160);
  }

  private paint(ctx: CanvasRenderingContext2D): void {
    const w = this.plateWidth;
    const h = this.plateHeight;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = this.fillColor();
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = this.edgeColor();
    ctx.lineWidth = EDGE_WIDTH;
    // Half a stroke inset keeps the whole border inside the plate.
    ctx.strokeRect(EDGE_WIDTH / 2, EDGE_WIDTH / 2, w - EDGE_WIDTH, h - EDGE_WIDTH);

    ctx.font = `600 ${this.fittedFontSize(w)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 0;
    ctx.fillStyle = this.textColor();
    ctx.fillText(this.label, w / 2, h / 2);
  }

  /** Shrinks the label until it fits the plate, so a long label never overflows the border. */
  private fittedFontSize(plateWidth: number): number {
    const scratch = document.createElement('canvas').getContext('2d');
    if (!scratch) {
      return this.fontSize;
    }
    const available = plateWidth - EDGE_WIDTH * 4;
    let size = this.fontSize;
    while (size > 18) {
      scratch.font = `600 ${size}px ui-sans-serif, system-ui, sans-serif`;
      if (scratch.measureText(this.label).width <= available) {
        return size;
      }
      size -= 2;
    }
    return size;
  }

  private fillColor(): string {
    if (!this.enabled) {
      return FILL_DISABLED;
    }
    if (this.armed) {
      return FILL_PRESSED;
    }
    return this.hovering || this.flashing ? FILL_HOVER : FILL_IDLE;
  }

  private edgeColor(): string {
    if (!this.enabled) {
      return EDGE_DISABLED;
    }
    if (this.armed) {
      return EDGE_PRESSED;
    }
    return this.hovering ? EDGE_HOVER : EDGE_IDLE;
  }

  private textColor(): string {
    if (!this.enabled) {
      return TEXT_DISABLED;
    }
    return this.hovering || this.armed || this.flashing ? TEXT_HOVER : TEXT_COLOR;
  }
}
