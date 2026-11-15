# Proposal

## Why

The game is silent: a shot without sound is an animation, an explosion without a bang is a rectangle that disappears. Audio is what makes audible what happens off screen (an enemy firing upwards) and what reports the outcome of a run without having to read it. On top of that, the four enemy archetypes today differ only in shape and movement: a timbre of its own for each one makes them recognizable even when they are off screen.

## What Changes

- **Music**: two tracks, one for the menu and one for the run, looping. Track switch on scene change, with a short fade.
- **Effects**: hero shot, shot of **every** enemy archetype (four different timbres), explosion when an enemy is destroyed (**different per type**), hero hit/death.
- **Animated collisions**: explosions are frame animations, not disappearances. A small one for enemies, a large one for the hero; asteroids stay immune to shots and do not explode.
- **End of run**: a sound when you lose, and a **different sound if you have beaten your own** session best score.
- **Muting**: an audio switch in the menu (small icon, not an extra button), with the state remembered across sessions; without it a game with music is unusable on a phone in public.
- **Licenses**: CC0 material only, with provenance and license documented next to the files, as already done for the graphics.
- Out of scope: voices, voice-over, adaptive music that changes with difficulty, spatial effects (panning by position), audio for asteroids, mixer with separate volumes, sounds for the menu buttons.

## Capabilities

### New Capabilities

- `presentation/audio`: menu and run music, effects tied to game events, distinct timbres per archetype, defeat sound and best-score sound, mute switch and the rule that nothing plays before a user gesture.

### Modified Capabilities

- `presentation/space-theme`: collisions are no longer silent disappearances but frame animations; the rule on asset provenance and license extends explicitly to audio as well, not just graphics.

## Impact

- Assets: about 20 audio files are added (short effects, cut from Juhani Junkala's CC0 package), 2 CC0 music tracks re-encoded to phone-friendly size, and the frames of 1–2 CC0 explosion sheets resized (the originals are 4096×4096, unusable as they are).
- Code: new `src/audio/audio.ts` (bus, volumes, mute, unlock on first gesture), `src/audio/sfx.ts` (event → sound map, per archetype), `src/game/explosion.ts` (animation pool), tweaks to menu, run, session, loader and `README`.
- Main risk: browsers block audio until there is a user gesture. Music must start on the first touch, not on load, and must not produce errors if audio permission is refused.
