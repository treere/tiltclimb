# Tasks

## 1. Audio assets and licenses

- [x] 1.1 Extract the ~15 chosen effects from the 512 package, re-encode the two music tracks to OGG mono 80 kbps with the scripts in `scripts/`, and save everything to `public/assets/audio/`; check: the files exist, the total size stays under 3 MB and `file` recognizes valid OGG/WAV
- [x] 1.2 Write `public/assets/audio/LICENSE.md` with author, URL and CC0 license for each package (Juhani Junkala effects, music from OpenGameArt) and update the credits in `README.md`; check: author, license and provenance reconstructable offline

## 2. Audio module

- [x] 2.1 Create `src/audio/audio.ts` with music/effects bus, volumes, `muted` persisted in `localStorage`, request queue before unlock and `unlock()`; check: `npm run check` green and no call to `play()` succeeds before `unlock()`
- [x] 2.2 Load the tracks and the effects into the existing loader and check that no file is requested twice; check: on the network one request per file and no 404
- [x] 2.3 Create `src/audio/sfx.ts` with the event → file table, including the per-archetype variants; check: every key in the table points to a file present in `public/assets/audio/`
- [x] 2.4 Implement the music switch with a fade driven by `onPreUpdate`, without global timers; check: going menu → run → menu leaves no two overlapping tracks

## 3. Unlock and switch

- [x] 3.1 Hook `unlock()` to the first gesture (pointer and keyboard) in `main.ts` and start the menu music only after that; check: on the first touch the music starts and no console errors appear
- [x] 3.2 Create `src/ui/audio-toggle.ts` with the two-state icon in the top right of the menu, touch area 56×56 (twice the icon); check: the touch changes state, silences everything and does not move the layout of the three buttons

## 4. Animated explosions

- [x] 4.1 Write `scripts/prepare-explosions.py` that extracts 16 frames per sheet at 128 px and saves them to `public/assets/effects/explosion/`; check: the script fails on sheets that are not evenly divisible and produces visually correct frames
- [x] 4.2 Create `src/game/explosion.ts` with a pool of 6 animations and `burst(x, y, scale)`, releasing the actor at the end of the animation; check: two explosions close together are both visible and the number of actors stays constant
- [x] 4.3 Hook the explosion to the destruction of a ship and to the hero's death (double scale); check: no explosion when a shot passes through an asteroid

## 5. Sounds in the right places

- [x] 5.1 Hero shot sound in `fireHero()` and a shot sound for every archetype when the ship fires; check: four different types produce four distinct timbres
- [x] 5.2 Kill sound per type, hero death sound, defeat sound and best-score sound (the latter only if the score beats the previous best); check: a run without a best score plays the defeat, one with a best score plays the success
- [x] 5.3 Check the worst case of overlap (turret burst + explosion + music): no missing or distorted sound; check: test on a phone at medium volume

## 6. Documentation and final check

- [x] 6.1 Update `README.md` (audio, credits, preparation script commands) and run `npm run check`; check: green command and consistent documentation
- [x] 6.2 Round on a phone via tunnel: music in the menu, music in the run, shots, explosions, defeat, best score, audio switch and reload with audio disabled; check: every point of the spec behaves as described
- [x] 6.3 Judgment on the mix: music that does not cover the effects, effects that do not deafen, and no perceptible delay on the first shot; check: three trial runs

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
