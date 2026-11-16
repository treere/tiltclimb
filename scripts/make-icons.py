#!/usr/bin/env python3
"""Generates the app icons from the ship sprite already in the repository.

Committed so the icons are reproducible if the art changes: run it from the repo root with Pillow
available (`python3 scripts/make-icons.py`). The maskable variant keeps the ship inside the safe
circle, so a launcher that crops the icon to a round shape does not cut it.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHIP = ROOT / 'public' / 'assets' / 'kenney' / 'playerShip2_blue.png'
OUT = ROOT / 'public' / 'icons'
BACKGROUND = (14, 17, 22, 255)
GLOW = (79, 179, 255, 40)

# canvas size -> ship width as a fraction of the canvas
VARIANTS = {
    'icon-192.png': (192, 0.62),
    'icon-512.png': (512, 0.62),
    'icon-512-maskable.png': (512, 0.46),
    'apple-touch-icon.png': (180, 0.62),
}


def build(size: int, fraction: float) -> Image.Image:
    canvas = Image.new('RGBA', (size, size), BACKGROUND)

    # Soft halo behind the ship, so the icon is not a sticker on a flat square.
    halo = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    radius = int(size * 0.34)
    centre = (size // 2, int(size * 0.5))
    from PIL import ImageDraw

    draw = ImageDraw.Draw(halo)
    for step in range(6, 0, -1):
        r = radius * step // 6
        draw.ellipse(
            [centre[0] - r, centre[1] - r, centre[0] + r, centre[1] + r],
            fill=GLOW,
        )
    canvas.alpha_composite(halo)

    ship = Image.open(SHIP).convert('RGBA')
    width = int(size * fraction)
    height = round(ship.height * width / ship.width)
    ship = ship.resize((width, height), Image.Resampling.NEAREST)

    x = (size - width) // 2
    y = (size - height) // 2
    canvas.alpha_composite(ship, (x, y))
    return canvas


def main() -> None:
    if not SHIP.exists():
        raise SystemExit(f'sprite not found: {SHIP}')

    OUT.mkdir(parents=True, exist_ok=True)
    for name, (size, fraction) in VARIANTS.items():
        icon = build(size, fraction)
        icon.save(OUT / name, optimize=True)
        print(f'{name}: {size}x{size}, {fraction:.0%} ship width')


if __name__ == '__main__':
    main()
