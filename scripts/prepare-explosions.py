#!/usr/bin/env python3
"""Builds public/assets/effects/explosion from the CC0 explosion sheets.

Source: "Free - 2D Explosion Animations" — https://opengameart.org/content/2d-explosion-animations-frame-by-frame
License: CC0 1.0.

The sheets are 4096×4096 with an 8×8 grid of 512 px cells and a lot of empty space: loading
them at runtime on a phone is not an option. This script slices each sheet, keeps up to
FRAMES_PER_SHEET non-empty cells (sampled evenly so the animation covers the whole blast),
crops each frame to its own content, scales it to FRAME_SIZE and writes it as a separate PNG.

Usage: python3 scripts/prepare-explosions.py [--cache DIR]
"""
from __future__ import annotations

import argparse
import io
import shutil
import sys
import urllib.request
import zipfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets' / 'effects' / 'explosion'
ZIP_URL = 'https://opengameart.org/sites/default/files/Free%20-%202D%20Explosion%20Animations.zip'

SHEETS = {
    'blast-1': 'Free - 2D Explosion Animations/explosion 1.png',
    'blast-2': 'Free - 2D Explosion Animations/explosion 2.png',
    'blast-3': 'Free - 2D Explosion Animations/explosion 3.png',
    'blast-4': 'Free - 2D Explosion Animations/explosion 4.png',
}

GRID = 8
FRAME_SIZE = 128
FRAMES_PER_SHEET = 24

LICENSE = """# Licenze effetti visivi

- Pacchetto: «Free - 2D Explosion Animations»
- Fonte: https://opengameart.org/content/2d-explosion-animations-frame-by-frame
- Licenza: CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/

Frame estratti dai fogli originali (4096×4096) e ridimensionati a 128 px da
`scripts/prepare-explosions.py`.
"""


def download(url: str, target: Path) -> Path:
    if target.exists() and target.stat().st_size > 0:
        return target
    target.parent.mkdir(parents=True, exist_ok=True)
    print(f'scarico {url}')
    with urllib.request.urlopen(url, timeout=180) as response, target.open('wb') as handle:
        shutil.copyfileobj(response, handle)
    return target


def frames_of(sheet: Image.Image) -> list[Image.Image]:
    """Slices the sheet in GRID×GRID cells and returns the non-empty ones, in order."""
    width, height = sheet.size
    cell_w, cell_h = width // GRID, height // GRID
    if width % GRID or height % GRID:
        raise SystemExit(f'foglio {width}x{height} non divisibile in {GRID}x{GRID} celle')

    frames: list[Image.Image] = []
    for row in range(GRID):
        for column in range(GRID):
            box = (column * cell_w, row * cell_h, (column + 1) * cell_w, (row + 1) * cell_h)
            cell = sheet.crop(box)
            content = cell.getchannel('A').getbbox()
            if content is None:
                continue
            frames.append(cell.crop(content))
    return frames


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache', default='/opt/data/cache/scratch/explosion-src')
    args = parser.parse_args()

    archive = download(ZIP_URL, Path(args.cache) / 'explosions.zip')
    OUT.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(archive) as bundle:
        for name, member in SHEETS.items():
            sheet = Image.open(io.BytesIO(bundle.read(member))).convert('RGBA')
            frames = frames_of(sheet)
            if not frames:
                raise SystemExit(f'nessun frame trovato in {member}')

            # Sample evenly across the blast so 16 frames tell the whole story.
            step = max(1, len(frames) // FRAMES_PER_SHEET)
            chosen = frames[::step][:FRAMES_PER_SHEET]
            folder = OUT / name
            if folder.exists():
                shutil.rmtree(folder)
            folder.mkdir(parents=True)

            for index, frame in enumerate(chosen):
                frame.thumbnail((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
                canvas = Image.new('RGBA', (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                canvas.paste(frame, ((FRAME_SIZE - frame.width) // 2, (FRAME_SIZE - frame.height) // 2))
                canvas.save(folder / f'frame_{index:02d}.png')

            print(f'{name}: {len(chosen)} frame da {len(frames)} disponibili')

    (OUT / 'LICENSE.md').write_text(LICENSE, encoding='utf-8')
    total = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file()) / 1024
    print(f'totale cartella esplosioni: {total:.0f} kB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
