# Proposal

## Why

On startup the default Excalibur loading screen appears: blue background, engine logo, empty bar. It is the first thing the user sees and it says nothing about the game — it looks like an error, not a wait. With music, images and explosions to load the wait is not instant, so it may as well be used to tell the same story: a chase between ships in space.

## What Changes

- **Themed loading screen**: moving starfield, two stylized spaceships chasing each other (the hero behind, an enemy ahead), progress bar and percentage, in the game's palette.
- **No dependency on assets**: the screen is drawn with 2D primitives (polygons, circles, rectangles), because the game's images are exactly what is being loaded.
- **Minimum duration and fade**: the screen stays visible for at least ~700 ms even when loading is instant, so it does not flash, and it fades towards the menu instead of vanishing abruptly.
- **Respect for system preferences**: with `prefers-reduced-motion` the ships and stars stand still and only the bar remains.
- **Real bar**: the percentage reflects the assets actually loaded, not a fake animation.
- Out of scope: loading bar per bundle, loading screen between scenes, hints or tutorials during the wait, loading sounds, third-party logos.

## Capabilities

### New Capabilities

- `presentation/loading`: themed waiting screen with real progress, minimum duration, fade and static behavior when the system asks for fewer animations.

### Modified Capabilities

None: once loading is finished the game behaves as before, and the menu remains the first interactive screen.

## Impact

- Code: new `src/ui/loading-screen.ts` (subclass of `ex.Loader` with `onDraw`), used in `src/main.ts` in place of the default loader, palette and timing constants in `constants.ts`.
- No new assets: the screen is drawn by hand with the 2D context.
- Main risk: the hand-drawn bar must stay legible on very small screens and in landscape, where the usable area is short.
