import * as ex from 'excalibur';

const SIZE = 96;
const PLATE = '#0b1a2e';
const EDGE = '#7fd4ff';
const ICON = '#dbeafe';

/**
 * Round pause control, drawn with the 2D canvas API like the audio toggle in the menu: a 96 px
 * touch area with a 40 px icon. It is deliberately **visual only**: the tap is resolved by the
 * scene from the pointer position, because Excalibur delivers the same pointerup to several actors
 * at once and a per-actor handler here paused and unpaused inside the same gesture.
 */
export class PauseToggle extends ex.ScreenElement {
  private paused = false;

  constructor(x: number, y: number) {
    super({ name: 'pause-toggle', x: x - SIZE / 2, y: y - SIZE / 2, width: SIZE, height: SIZE });

    this.graphics.use(
      new ex.Canvas({
        width: SIZE,
        height: SIZE,
        draw: (ctx: CanvasRenderingContext2D) => this.paint(ctx),
      }),
    );
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
  }

  private paint(ctx: CanvasRenderingContext2D): void {
    const center = SIZE / 2;

    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.fillStyle = PLATE;
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = EDGE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, center - 3.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = ICON;
    if (this.paused) {
      // Play triangle, nudged right so it looks centred inside the circle.
      ctx.beginPath();
      ctx.moveTo(center - 8, center - 14);
      ctx.lineTo(center + 16, center);
      ctx.lineTo(center - 8, center + 14);
      ctx.closePath();
      ctx.fill();
      return;
    }

    // Pause: two bars, symmetric around the centre.
    ctx.fillRect(center - 13, center - 14, 9, 28);
    ctx.fillRect(center + 4, center - 14, 9, 28);
  }
}
