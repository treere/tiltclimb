# Design

## Context

See `proposal.md` for the why. Today `main.ts` builds an `ex.Loader` with 32 images, 15 sounds and 96 explosion frames; during loading Excalibur draws its own screen (blue background, logo, bar), which is the first thing visible on open.

The technical point that decides everything, verified in the Excalibur 1.0.1 source: `Loader extends DefaultLoader`, and `DefaultLoader` builds an `ex.Canvas` with `draw: this.onDraw.bind(this)`. So **`onDraw(ctx)` is a public hook** that receives a 2D context and has access to `this.progress` (0–1 ratio between loaded and total resources) and to `this.engine` for the dimensions. The default loader uses the same hook to draw logo and bar: replacing it means overriding a method, not fighting the engine.

## Goals / Non-Goals

**Goals:**

- a screen that draws itself without depending on what it is loading;
- real and legible progress, with a minimum stay time;
- no impact on the loading itself: only 2D drawing every frame.

**Non-Goals:**

- transition screens between scenes, tutorials, hints;
- third-party logos or credits on the loading screen;
- loading sounds (audio is not unlocked before the first gesture).

## Decisions

### 1. A subclass of `ex.Loader` with `onDraw`

`src/ui/loading-screen.ts` exports `class ThemedLoader extends ex.Loader` that:
- in `onDraw(ctx)` draws background, stars, chase, bar and percentage;
- exposes `show(): Promise<void>` to be awaited after `engine.start(loader)`, which resolves when the fade is over.

Inside `onDraw` you cannot use `ex.Text` (it is a graphic that requires the renderer, not the loader's 2D context): the text is written with `ctx.fillText` and the bar with `ctx.fillRect`/hand-made `roundRect`. It is the same approach already used for the interface buttons and texts, so it does not introduce a new language.

### 2. Chase drawn with primitives

Two stylized ships: a larger chevron (the hero, color `#4fb3ff`) chases a smaller, darker chevron (the enemy) along a sine wave crossing the screen. The enemy is always a bit ahead and a bit faster: when it reaches the edge, it comes back in from the other side. The stars are 40 dots at three different speeds, as in the game.

Why not the real sprites: they would be exactly the assets being loaded, and the screen must work on the first frame. Drawing two chevrons costs twenty lines and cannot fail.

### 3. Minimum time and fade, without global timers

`onBeforeLoad()` records `performance.now()`. `show()` waits for `progress` to reach 1, then waits the rest of the 700 ms minimum and finally drives a 250 ms fade with `requestAnimationFrame` (the screen is drawn by the loader, so it is the only place where a frame loop makes sense). The fade reduces an `alpha` that `onDraw` applies to every element through `ctx.globalAlpha`.

Rejected alternative: letting the scenes handle the fade. It would be a "loading" scene with its own logic, when the loader is already the place where loading lives.

### 4. Reduced motion

`window.matchMedia('(prefers-reduced-motion: reduce)')` read once at startup: if active, ships and stars stay in a fixed position and only the bar changes. No other difference: the screen remains recognizable.

### 5. Integration in `main.ts`

```ts
const loader = new ThemedLoader([...resources]);
await engine.start(loader);
await loader.show();
await engine.goToScene('menu');
```

`engine.start(loader)` draws the screen and loads; `loader.show()` waits for minimum time and fade; only then does the menu become active. If `show()` were forgotten, the game would work but the menu would appear under the loading screen: the sequence is the only thing not to get wrong.

## Risks / Trade-offs

- **Short screens (landscape)** → the composition uses fractions of the usable height and a bar at most 70% of the width: nothing goes off the edge. To be verified in testing.
- **Very slow loading** (phone network) → the screen stays animated and the percentage advances slowly; no timeout that hides the error, but if an asset failed Excalibur's loader logs and continues, and the bar would reach 100% anyway.
- **Double frame loop** (loader and then engine) → the fade uses `requestAnimationFrame` for only 250 ms and then stops; nothing stays active afterwards.
- **`onDraw` is an internal API** → it is documented in the class but is not a stability promise: if an Excalibur update changed it, the symptom would be evident (blank screen at loading) and the fix is contained in one file.
- **Artificial minimum time** → 700 ms on a fast connection is an imposed wait. It is the compromise to avoid flashing the screen; the value lives in a constant.

## Migration Plan

No data migration. `main.ts` goes from `new ex.Loader([...])` to `new ThemedLoader([...])`; if the screen caused problems, going back to the default loader is a two-line revert.
