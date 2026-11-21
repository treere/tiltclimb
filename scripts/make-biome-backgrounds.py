#!/usr/bin/env python3
"""Derives the biome backgrounds from the CC0 original.

Excalibur 1.0.1 does not tint a sprite, and hue-rotated copies are exact and testable where a runtime
tint is not. Each biome is the same starfield in a different palette, so the change is visible from
level 6 without a single new artwork file.

The hues are chosen far apart on purpose: nearby shades read as a graphics bug, not as a place.

The source is purple (hue ≈ 282°). Each variant names the hue it wants to land on, and the shift is
computed from the source's own average hue — writing raw shifts by hand produced a "rust" that was
green and a "cobalt" that was pink, because 282° is not the zero anyone has in mind.

Usage: python3 scripts/make-biome-backgrounds.py
"""

import colorsys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'public' / 'assets' / 'kenney'
SOURCE = ASSETS / 'darkPurple.png'

# file -> (target hue in degrees, saturation multiplier, lightness multiplier)
VARIANTS = {
    'bgCobalt.png': (230, 1.05, 1.0),
    'bgTeal.png': (175, 1.0, 0.94),
    'bgRust.png': (18, 1.1, 0.95),
}

# Pixels this dark are the backdrop, this light are the bright stars: they stay as they are, or every
# biome ends up the same grey noise.
DARK_FLOOR = 0.06
LIGHT_CEILING = 0.93


def source_hue(image: Image.Image) -> float:
    """Average hue of the tinted mid-tones: the colour the palette is built on."""
    total = 0.0
    count = 0
    for red, green, blue in image.convert('RGB').getdata():
        hue, lightness, sat = colorsys.rgb_to_hls(red / 255, green / 255, blue / 255)
        if DARK_FLOOR < lightness < LIGHT_CEILING and sat > 0.15:
            total += hue * 360
            count += 1
    if count == 0:
        raise SystemExit('no tinted mid-tones in the source: cannot measure its hue')
    return total / count


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f'background not found: {SOURCE}')

    source = Image.open(SOURCE).convert('RGBA')
    width, height = source.size
    base_hue = source_hue(source)
    print(f'source hue: {base_hue:.0f}°')

    for name, (target_hue, saturation, lightness_scale) in VARIANTS.items():
        shift = target_hue - base_hue
        out = Image.new('RGBA', (width, height))
        src_px = source.load()
        out_px = out.load()
        for y in range(height):
            for x in range(width):
                red, green, blue, alpha = src_px[x, y]
                if alpha == 0:
                    out_px[x, y] = (0, 0, 0, 0)
                    continue
                hue, lightness, sat = colorsys.rgb_to_hls(red / 255, green / 255, blue / 255)
                if lightness < DARK_FLOOR or lightness > LIGHT_CEILING:
                    out_px[x, y] = (red, green, blue, alpha)
                    continue
                hue = (hue + shift / 360) % 1
                sat = min(1.0, sat * saturation)
                lightness = min(1.0, lightness * lightness_scale)
                new_red, new_green, new_blue = colorsys.hls_to_rgb(hue, lightness, sat)
                out_px[x, y] = (
                    round(new_red * 255),
                    round(new_green * 255),
                    round(new_blue * 255),
                    alpha,
                )
        out.save(ASSETS / name)
        print(f'{name}: {width}x{height}, hue -> {target_hue}°, saturation ×{saturation}, lightness ×{lightness_scale}')


if __name__ == '__main__':
    main()
