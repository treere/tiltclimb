# Tasks

## 1. Themed screen

- [x] 1.1 Create `src/ui/loading-screen.ts` with `ThemedLoader extends ex.Loader` and an `onDraw(ctx)` that draws background, starfield and the two chevrons chasing each other; check: `npm run check` green and no dependency on assets in the file
- [x] 1.4 Use the game's real sprites embedded with `?inline` (data URL in the bundle) instead of the chevrons, with a chevron fallback until the image is decoded; check: on screen the light-blue ship and the orange enemy are visible, separated
- [x] 1.2 Add a progress bar and percentage tied to `this.progress`; check: the percentage grows during loading and reaches 100 only at the end
- [x] 1.3 Compose the layout with fractions of the usable height and a bar at most 70% of the width; check: in portrait and landscape nothing goes off screen

## 2. Timing and exit

- [x] 2.1 Implement the 700 ms minimum time with `onBeforeLoad` and a `show()` that waits for progress, minimum time and a 250 ms fade; check: with the assets in cache the screen stays visible for at least 700 ms
- [x] 2.2 Exit fade implemented as a menu curtain (the loader cannot fade over the game, because the engine stops drawing it): black `ScreenElement` going from opacity 1 to 0 in 320 ms; check: no intermediate black frame between loading and menu
- [x] 2.3 Respect `prefers-reduced-motion`: ships and stars still, bar and percentage active; check: with the emulation active the screen stays legible and static

## 3. Integration

- [x] 3.1 Replace the default loader in `src/main.ts` with `ThemedLoader` and await `show()` before entering the menu; check: on startup the themed screen is seen and only then the menu
- [x] 3.2 Check that the real loading (images, audio, frames) shows consistent progress and no console errors; check: no 404 and a bar that reaches 100%

## 4. Documentation and check

- [x] 4.1 Update `README.md` with the loading screen and run `npm run check`; check: green command and consistent documentation
- [x] 4.2 Test on a phone via tunnel, with cache cleared to see the slow loading again; check: legible screen, ships moving, fade-out exit
- [x] 4.3 Aesthetic judgment: the two ships read as a chase and the screen no longer looks like "an error"; check: visual judgment on a small screen

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
