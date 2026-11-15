import * as ex from 'excalibur';

/**
 * UI text drawn with the 2D canvas API.
 *
 * Excalibur's `Text` measures itself lazily and reports a width that depends on when you ask,
 * which makes "centre this graphic" a moving target: the story block was placed using the
 * single-line width and ended up several hundred pixels off screen. Here the size is measured
 * once with the same font string used to draw, and every line is painted with
 * `textAlign: center`, so the box and the ink agree by construction.
 */
export type UiTextOptions = {
  x: number;
  y: number;
  size: number;
  color: string;
  weight?: number;
  lineHeight?: number;
  /** Wrap width. Lines are broken on spaces; null means no wrapping. */
  maxWidth?: number;
  align?: 'center' | 'left';
  /** 'center' places the box centre on y, 'top' places its top edge on y. */
  valign?: 'center' | 'top';
  z?: number;
  shadow?: boolean;
};

const FAMILY = 'ui-sans-serif, system-ui, sans-serif';

export class UiText {
  readonly actor: ex.ScreenElement;
  private readonly options: Required<Omit<UiTextOptions, 'maxWidth'>> & { maxWidth: number | null };
  private current = '';
  private lines: string[] = [''];

  constructor(scene: ex.Scene, options: UiTextOptions) {
    this.options = {
      x: options.x,
      y: options.y,
      size: options.size,
      color: options.color,
      weight: options.weight ?? 600,
      lineHeight: options.lineHeight ?? Math.round(options.size * 1.3),
      maxWidth: options.maxWidth ?? null,
      align: options.align ?? 'center',
      valign: options.valign ?? 'center',
      z: options.z ?? 5,
      shadow: options.shadow ?? true,
    };

    this.actor = new ex.ScreenElement({ x: 0, y: 0, z: this.options.z });
    scene.add(this.actor);
    this.setLines(['']);
  }

  setText(text: string): void {
    this.setLines([text]);
  }

  /** Changes the colour; the graphic is rebuilt with the same content. */
  setColor(color: string): void {
    this.options.color = color;
    this.current = '';
    this.setLines(this.lines);
  }

  setLines(lines: string[]): void {
    this.lines = lines;
    const joined = lines.join('\n');
    if (joined === this.current) {
      return;
    }
    this.current = joined;

    const ctx = measuringContext();
    ctx.font = this.fontSpec();

    const wrapped = lines.flatMap((line) => this.wrap(ctx, line));
    const width = Math.max(
      1,
      Math.ceil(Math.max(0, ...wrapped.map((l) => ctx.measureText(l).width))),
    );
    const height = Math.max(1, Math.ceil(wrapped.length * this.options.lineHeight));
    const drawLines = wrapped;
    const { lineHeight, color, align, shadow, weight, size } = this.options;

    const canvas = new ex.Canvas({
      width,
      height,
      draw: (target: CanvasRenderingContext2D) => {
        target.clearRect(0, 0, width, height);
        target.font = `${weight} ${size}px ${FAMILY}`;
        target.textBaseline = 'middle';
        target.textAlign = align === 'center' ? 'center' : 'left';
        target.fillStyle = color;
        if (shadow) {
          target.shadowColor = 'rgba(0, 0, 0, 0.75)';
          target.shadowOffsetX = 2;
          target.shadowOffsetY = 2;
          target.shadowBlur = 0;
        }
        drawLines.forEach((line, index) => {
          const x = align === 'center' ? width / 2 : 0;
          target.fillText(line, x, lineHeight * (index + 0.5));
        });
      },
    });

    this.actor.graphics.use(canvas);

    // The actor is anchored top-left, so the box is positioned from the configured centre.
    this.actor.pos.x = align === 'center' ? this.options.x - width / 2 : this.options.x;
    this.actor.pos.y = this.options.valign === 'top' ? this.options.y : this.options.y - height / 2;
  }

  /** Keeps the text centred on its anchor after the layout changed underneath. */
  setAnchor(x: number, y: number): void {
    this.options.x = x;
    this.options.y = y;
    const width = this.actor.graphics.current?.width ?? 1;
    const height = this.actor.graphics.current?.height ?? 1;
    this.actor.pos.x = this.options.align === 'center' ? x - width / 2 : x;
    this.actor.pos.y = this.options.valign === 'top' ? y : y - height / 2;
  }

  private fontSpec(): string {
    return `${this.options.weight} ${this.options.size}px ${FAMILY}`;
  }

  private wrap(ctx: CanvasRenderingContext2D, line: string): string[] {
    const maxWidth = this.options.maxWidth;
    if (!maxWidth || ctx.measureText(line).width <= maxWidth) {
      return [line];
    }

    const words = line.split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !current) {
        current = candidate;
        continue;
      }
      lines.push(current);
      current = word;
    }

    if (current) {
      lines.push(current);
    }
    return lines;
  }
}

let sharedContext: CanvasRenderingContext2D | null = null;

function measuringContext(): CanvasRenderingContext2D {
  if (!sharedContext) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('no 2D context available to measure the text');
    }
    sharedContext = ctx;
  }
  return sharedContext;
}
