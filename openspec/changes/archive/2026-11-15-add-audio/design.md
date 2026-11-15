# Design

## Context

See `proposal.md` for the why. The game has no audio: no `Sound` in the loader, no gesture that unlocks the audio context. The scenes are `menu`, `credits`, `climb`, the loader is `createLoader()` in `src/game/sprites.ts`, and collisions are resolved by hand in `climb-scene.resolveHits()` — the exact point where explosions and sounds should hook in.

Research already done, verifying the downloaded files and not just the pages:

- **Music**, two CC0 tracks from OpenGameArt: `OutThere_0.ogg` ("Space Music: Out There", 3.9 MB) and `MyVeryOwnDeadShip.ogg` ("Background Space Track", 4.5 MB).
- **Effects**, "The Essential Retro Video Game Sound Effects Collection" by Juhani Junkala, CC0, 508 WAVs in five verified categories: `Weapons` (`sfx_wpn_laser*`, `sfx_weapon_singleshot*`), `Explosions` (`sfx_exp_cluster/double/long/medium/small*`), `General Sounds` (coin, powerup, alarm), plus `Death Screams`, `Movement` and the hits `sfx_damage_hit*`/`sfx_sounds_impact*`.
- **Explosions**, "Free - 2D Explosion Animations" CC0: 4 sheets 4096×4096 (plus half-size versions), with no readme: the license lives on the OGA page and we have to write it into the repository ourselves.

## Goals / Non-Goals

**Goals:**

- audio that does not weigh much: total traffic under 3 MB, music included;
- no sound before the user gesture, and no errors if audio is blocked;
- a recognizable timbre per archetype, so enemies are heard before they are seen.

**Non-Goals:**

- mixer with separate volumes exposed to the user, spatial panning, adaptive music;
- sounds for menu buttons, for asteroids, voices or voice-over;
- positional audio or reverbs.

## Decisions

### 1. An audio module with two buses and a single switch

`src/audio/audio.ts` exposes `audio.playSfx(key)`, `audio.playMusic('menu' | 'game')`, `audio.stopMusic()`, `audio.toggleMuted()`. Internally it keeps two volumes (music 0.35, effects 0.7), a master `muted` and an `unlocked` flag.

The mute state lives in `localStorage` (`tiltclimb.muted`): it is a device preference, not a run preference, and must survive a reload. The run and the menu do not know about `localStorage`: they go through the module.

### 2. Unlock on the first gesture, not on load

Browsers do not allow an `AudioContext` before a gesture. The module exposes `unlock()`, called from the first `pointerdown` (and the first key press) already listened to by the menu for sensor permissions. Before `unlock()` there is no call to `play()`: requests are queued and discarded if the unlock never arrives, so a browser that blocks audio produces no console errors and no freezes.

`ex.Sound` implements `Loadable`, so the tracks go into the existing loader: by the time the scene starts, the buffers are already decoded and the first shot does not arrive late.

### 3. Music: two tracks, switched with a short fade

One track per scene, `loop = true`. On a scene change the outgoing track fades out over 250 ms and the incoming one starts at zero volume rising over 250 ms, driven by the scene's `onPreUpdate` (no global timers to clean up). The run track restarts from the beginning on every run: that is what you expect from an arcade game, and it avoids resuming halfway through a passage.

The music is re-encoded to **OGG mono 80 kbps** with ffmpeg: from 3.9/4.5 MB to about 1 MB per track, with no audible difference on a phone speaker. The re-encoding commands live in `scripts/prepare-audio.sh` together with the effects, so the step from the sources to the repo files is reproducible.

### 4. Effects: event → file map, with the per-archetype variant

`src/audio/sfx.ts` contains a table:

| Event | File | Notes |
| --- | --- | --- |
| hero shot | `sfx_wpn_laser1` | dry, short |
| patrol shot | `sfx_wpn_laser10` | higher pitched |
| striker shot | `sfx_weapon_singleshot3` | fuller |
| hunter shot | `sfx_wpn_laser7` | longer |
| turret shot | `sfx_wpn_laser12` | lower |
| patrol destroyed | `sfx_exp_medium1` | small |
| striker destroyed | `sfx_exp_cluster2` | medium |
| hunter destroyed | `sfx_exp_double1` | medium |
| turret destroyed | `sfx_exp_long1` | longer |
| hero death | `sfx_exp_long3` + `sfx_damage_hit1` | two layers |
| defeat | `sfx_exp_long6` | low and long |
| best score | `sfx_sounds_powerup1` | rising |

The exact family names are verified; during apply the existence of the individual files is confirmed by listing the package, and swapping a timbre is one table row.

Overlap: `ex.Sound.play()` handles multiple instances with an internal cap; the turret bursts (4 shots in 600 ms) are the edge case to check in testing, with the option of lowering the per-instance volume instead of reducing the rate.

### 5. Explosions: animation pool, frames extracted from the sheets

The original sheets are 4096×4096 and cannot be loaded on a phone: `scripts/prepare-explosions.py` opens them, determines the frame grid, extracts 16 per sheet, resizes them to 128 px and saves them to `public/assets/effects/explosion/<n>/frame_00..15.png`. The script documents the assumed grid and fails if the sheet is not evenly divisible, instead of producing badly cropped frames.

`src/game/explosion.ts` is a pool of 6 actors: `burst(x, y, size)` takes a free actor, mounts the `ex.Animation` on it (50 ms per frame) and releases it when the animation ends. No allocation during the run; two explosions close together do not overwrite each other.

The hero's explosion uses the same pool at 2× scale and with a different sound.

### 6. Switch in the menu, not a fourth button

A 56×56 icon in the top right (`src/ui/audio-toggle.ts`), above the safe area, with two states drawn with the same canvas technique as the buttons (speaker with and without waves). It touches an area twice the size of the icon so it is reachable with a thumb. It does not affect the layout of the three buttons already measured.

## Risks / Trade-offs

- **Autoplay blocked** → queue of requests discarded before `unlock()`; no errors, no freeze. On iOS the first touch must be real, and the menu already has one for the sensors.
- **Audio weight** → re-encoded music (~1 MB per track) and only ~15 short effects: the total stays under 3 MB, less than half of a single original track.
- **Latency on Android** → buffers preloaded in the loader and no `AudioContext` creation per sound; if the first shot arrived late, the effects volume goes up and the number of instances goes down.
- **Too many sounds at once** (turret burst + explosion + music) → Excalibur's instance cap discards the new ones: in testing we check that the burst does not "eat" the explosion, possibly lowering the volume of enemy shots.
- **Huge explosion sheets** → offline extraction with a script, never at runtime; the repo only receives the reduced frames.
- **Licenses** → the audio packages do not contain a license file (verified: only a generic `INFO.txt` in the effects package): a `LICENSE.md` note is written per folder with author, URL and CC0 license, as already done for the graphics.

## Migration Plan

No migration. The existing scenes gain calls to `audio.*` at points that already exist (`fireHero`, `resolveHits`, `onActivate`, `endRun`). Rollback: revert of the apply commit; no existing file is rewritten.
