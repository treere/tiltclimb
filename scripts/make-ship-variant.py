#!/usr/bin/env python3
"""Derives the powered ship sprite from the CC0 original.

Excalibur 1.0.1 does not tint a sprite, and two textures are exact and testable where a runtime tint
is not. The variant keeps the silhouette and shifts the hull towards amber, so the powered state is
recognisable at a glance without new art.

Usage: python3 scripts/make-ship-variant.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'public' / 'assets' / 'kenney' / 'playerShip2_blue.png'
TARGET = ROOT / 'public' / 'assets' / 'kenney' / 'playerShip2_amber.png'

# Hue rotation in degrees and a small saturation boost: enough to read as "charged", not a new ship.
HUE_SHIFT = 205
SATURATION = 1.15


def rotate_hue(pixel: tuple[int, int, int]) -> tuple[int, int, int]:
    red, green, blue = (channel / 255 for channel in pixel)
    import colorsys

    hue, lightness, saturation = colorsys.rgb_to_hls(red, green, blue)
    hue = (hue + HUE_SHIFT / 360) % 1
    saturation = min(1.0, saturation * SATURATION)
    red, green, blue = colorsys.hls_to_rgb(hue, lightness, saturation)
    return (round(red * 255), round(green * 255), round(blue * 255))


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f'sprite not found: {SOURCE}')

    source = Image.open(SOURCE).convert('RGBA')
    pixels = source.load()
    width, height = source.size

    for x in range(width):
        for y in range(height):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            pixels[x, y] = (*rotate_hue((red, green, blue)), alpha)

    source.save(TARGET, optimize=True)
    print(f'{TARGET.name}: {width}x{height}, hue {HUE_SHIFT}° from {SOURCE.name}')


if __name__ == '__main__':
    main()
