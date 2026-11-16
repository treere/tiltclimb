import * as ex from 'excalibur';

const WIDTH = 140;
const HEIGHT = 12;

const TRACK = '#232b36';
const COOL = '#7fd4ff';
const HOT = '#ffb86b';
const JAMMED = '#ff6b6b';

/** Below this fraction the bar is cool, above it warm; jammed always wins. */
const HOT_FROM = 0.6;

/**
 * Thin heat bar drawn with the 2D canvas API, like the buttons: a track and a fill, no anchors.
 */
export class HeatBar extends ex.ScreenElement {
  private value = 0;
  private jammed = false;

  constructor(x: number, y: number) {
    super({ name: 'heat-bar', x: x - WIDTH / 2, y: y - HEIGHT / 2, width: WIDTH, height: HEIGHT });

    this.graphics.use(
      new ex.Canvas({
        width: WIDTH,
        height: HEIGHT,
        draw: (ctx: CanvasRenderingContext2D) => this.paint(ctx),
      }),
    );
  }

  /** `fraction` in [0, 1]; `jammed` forces the warning colour whatever the fraction. */
  setValue(fraction: number, jammed: boolean): void {
    this.value = Math.min(1, Math.max(0, Number.isFinite(fraction) ? fraction : 0));
    this.jammed = jammed;
  }

  private paint(ctx: CanvasRenderingContext2D): void {
    const radius = HEIGHT / 2;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = TRACK;
    ctx.beginPath();
    ctx.roundRect(0, 0, WIDTH, HEIGHT, radius);
    ctx.fill();

    const fillWidth = Math.max(this.value > 0 ? HEIGHT : 0, WIDTH * this.value);
    if (fillWidth > 0) {
      ctx.fillStyle = this.fillColor();
      ctx.beginPath();
      ctx.roundRect(0, 0, fillWidth, HEIGHT, radius);
      ctx.fill();
    }
  }

  private fillColor(): string {
    if (this.jammed) {
      return JAMMED;
    }
    return this.value >= HOT_FROM ? HOT : COOL;
  }
}
