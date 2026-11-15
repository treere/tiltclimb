import * as ex from 'excalibur';
import { audio } from '../audio/audio';

const SIZE = 96;
const ICON = 44;

const PLATE = '#0b1a2e';
const EDGE = '#7fd4ff';
const ICON_COLOR = '#dbeafe';
const ICON_OFF = '#93a7bb';

/**
 * Small speaker toggle in the corner of the menu. The drawn icon is 44 px inside a 96 px
 * touch area: big enough for a thumb, small enough not to compete with the three buttons.
 */
export class AudioToggle extends ex.ScreenElement {
  constructor(x: number, y: number) {
    super({ name: 'audio-toggle', x: x - SIZE / 2, y: y - SIZE / 2, width: SIZE, height: SIZE });

    this.graphics.use(
      new ex.Canvas({
        width: SIZE,
        height: SIZE,
        draw: (ctx: CanvasRenderingContext2D) => this.paint(ctx),
      }),
    );

    this.on('pointerup', () => {
      audio.toggleMuted();
    });
  }

  private paint(ctx: CanvasRenderingContext2D): void {
    const muted = audio.isMuted;

    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.fillStyle = PLATE;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = EDGE;
    ctx.lineWidth = 2;
    ctx.stroke();

    const color = muted ? ICON_OFF : ICON_COLOR;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const half = ICON / 2;

    // Speaker body: a small rectangle plus a triangle for the cone.
    ctx.beginPath();
    ctx.moveTo(cx - half, cy - 6);
    ctx.lineTo(cx - half + 8, cy - 6);
    ctx.lineTo(cx - half + 18, cy - 14);
    ctx.lineTo(cx - half + 18, cy + 14);
    ctx.lineTo(cx - half + 8, cy + 6);
    ctx.lineTo(cx - half, cy + 6);
    ctx.closePath();
    ctx.fill();

    if (muted) {
      ctx.beginPath();
      ctx.moveTo(cx + 4, cy - 9);
      ctx.lineTo(cx + 20, cy + 9);
      ctx.moveTo(cx + 20, cy - 9);
      ctx.lineTo(cx + 4, cy + 9);
      ctx.stroke();
      return;
    }

    ctx.beginPath();
    ctx.arc(cx + 2, cy, 8, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 2, cy, 15, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
  }
}
