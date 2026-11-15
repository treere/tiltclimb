#!/usr/bin/env python3
"""Builds public/assets/audio from the CC0 sources.

Sources (all CC0 1.0, verified on the pages before use):
  - effects: "The Essential Retro Video Game Sound Effects Collection [512 sounds]"
    by Juhani Junkala — https://opengameart.org/content/512-sound-effects-8-bit-style
  - menu music: "Space Music: Out There" — https://opengameart.org/content/space-music-out-there
  - game music: "Background Space Track" — https://opengameart.org/content/background-space-track

The script downloads what it needs into a cache directory (default: scratch), picks the files
listed in SOUNDS, copies the effects and transcodes the music to OGG mono 80 kbps with ffmpeg
(set FFMPEG to override the binary). Re-running is safe and idempotent.

Usage:
  FFMPEG=/path/to/ffmpeg python3 scripts/prepare-audio.py [--cache /tmp/tiltclimb-audio]
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets' / 'audio'

SFX_URL = (
    'https://opengameart.org/sites/default/files/'
    'The%20Essential%20Retro%20Video%20Game%20Sound%20Effects%20Collection%20%5B512%20sounds%5D.zip'
)
MUSIC = {
    'music-menu.ogg': 'https://opengameart.org/sites/default/files/MyVeryOwnDeadShip.ogg',
    'music-game.ogg': 'https://opengameart.org/sites/default/files/OutThere_0.ogg',
}

# Repo file name -> file name inside the effects pack.
SOUNDS = {
    'shot-hero': 'sfx_wpn_laser1.wav',
    'shot-patrol': 'sfx_wpn_laser10.wav',
    'shot-diver': 'sfx_weapon_singleshot3.wav',
    'shot-hunter': 'sfx_wpn_laser7.wav',
    'shot-ufo': 'sfx_wpn_laser12.wav',
    'kill-patrol': 'sfx_exp_medium1.wav',
    'kill-diver': 'sfx_exp_cluster2.wav',
    'kill-hunter': 'sfx_exp_double1.wav',
    'kill-ufo': 'sfx_exp_long1.wav',
    'death-hero': 'sfx_exp_long3.wav',
    'death-impact': 'sfx_damage_hit1.wav',
    'lose': 'sfx_exp_long6.wav',
    'record': 'sfx_sounds_powerup1.wav',
}

LICENSE = """# Audio licences

All the audio assets in this folder are **CC0 1.0** (public domain) and come from
OpenGameArt. Files built by `scripts/prepare-audio.py`.

## Effects (`*.wav`)

- Author: **Juhani Junkala**
- Pack: "The Essential Retro Video Game Sound Effects Collection [512 sounds]"
- Source: https://opengameart.org/content/512-sound-effects-8-bit-style
- Licence: CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/

## Music

- `music-menu.ogg` — "Background Space Track", source
  https://opengameart.org/content/background-space-track — CC0 1.0
- `music-game.ogg` — "Space Music: Out There", source
  https://opengameart.org/content/space-music-out-there — CC0 1.0

Music re-encoded to OGG mono 80 kbps to keep the weight down on a phone.
"""


def download(url: str, target: Path) -> Path:
    if target.exists() and target.stat().st_size > 0:
        return target
    target.parent.mkdir(parents=True, exist_ok=True)
    print(f'downloading {url}')
    with urllib.request.urlopen(url, timeout=180) as response, target.open('wb') as handle:
        shutil.copyfileobj(response, handle)
    return target


def extract_sounds(archive: Path, ffmpeg: str) -> None:
    """Effects are trimmed to 1.2 s and encoded to OGG mono 64 kbps: a 400 kB tail of a long
    explosion is wasted bandwidth on a phone, and nothing in the game plays past a second."""
    with zipfile.ZipFile(archive) as bundle:
        by_name = {Path(name).name: name for name in bundle.namelist() if name.endswith('.wav')}
        missing = [src for src in SOUNDS.values() if src not in by_name]
        if missing:
            raise SystemExit(f'files missing from the effects pack: {missing}')

        for out_name, src_name in SOUNDS.items():
            raw = archive.parent / src_name
            raw.write_bytes(bundle.read(by_name[src_name]))
            target = OUT / f'{out_name}.ogg'
            subprocess.run(
                [
                    ffmpeg, '-y', '-loglevel', 'error',
                    '-i', str(raw),
                    '-t', '1.2',
                    '-ac', '1',
                    '-b:a', '64k',
                    '-c:a', 'libvorbis',
                    str(target),
                ],
                check=True,
            )
            raw.unlink()
            print(f'  {target.name}: {target.stat().st_size / 1024:.0f} kB')


def transcode_music(ffmpeg: str, cache: Path) -> None:
    for out_name, url in MUSIC.items():
        source = download(url, cache / out_name.replace('.ogg', '-source.ogg'))
        subprocess.run(
            [
                ffmpeg,
                '-y',
                '-loglevel',
                'error',
                '-i',
                str(source),
                '-ac',
                '1',
                '-b:a',
                '80k',
                '-c:a',
                'libvorbis',
                str(OUT / out_name),
            ],
            check=True,
        )
        size = (OUT / out_name).stat().st_size / 1024 / 1024
        print(f'  {out_name}: {size:.2f} MB')


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache', default='/opt/data/cache/scratch/audio-src')
    args = parser.parse_args()

    ffmpeg = os.environ.get('FFMPEG', 'ffmpeg')
    cache = Path(args.cache)
    OUT.mkdir(parents=True, exist_ok=True)

    archive = download(SFX_URL, cache / 'sfx-512.zip')
    print('effects:')
    extract_sounds(archive, ffmpeg)

    print('music:')
    transcode_music(ffmpeg, cache)

    (OUT / 'LICENSE.md').write_text(LICENSE, encoding='utf-8')

    total = sum(f.stat().st_size for f in OUT.iterdir() if f.is_file()) / 1024 / 1024
    print(f'audio folder total: {total:.2f} MB')
    for file in sorted(OUT.iterdir()):
        print(f'  {file.name}: {file.stat().st_size / 1024:.0f} kB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
