# Proposal

## Why

The game works but is made of rectangles: it does not communicate what you are playing nor why you steer. With a spaceship, an asteroid field and a scrolling starfield, the theme becomes legible at a glance and the tilt gains a physical meaning ("I am piloting"). A graphic base with a clean license, documented in the repo, is also needed so it does not have to be redone when the project grows.

## What Changes

- **Hero**: the rectangle becomes a spaceship (Kenney sprite `playerShip2_blue`, 112×75) with an **animated trail** at the engines (20 frames `fire00–fire19`, 16×40) drawn under the ship.
- **Obstacles**: the rectangles become **asteroids** (21 Kenney meteors brown/grey, from tiny to big), each with a random size and **rotation** that keeps turning while it scrolls: the movement provides the animation.
- **Background**: **two-layer parallax** starfield scrolling downwards while the ship climbs — `darkPurple.png` 256×256 tile repeated for the base, plus small stars drawn at various speeds for depth.
- **Menu**: same atmosphere (starfield still or very slow, the ship as an illustration, coherent colors), **button labels centered** — the current bug is that long text widens the bounds of the graphic group and moves the background.
- **Licenses**: the assets enter `public/assets/kenney/` with the original `license.txt` next to them, provenance and credit (CC0, Kenney) in `README.md`.
- Out of scope: shots, lasers, enemies, power-ups, scores per destruction, impact particles, audio/music, changes to physics, speed or difficulty, menu animation other than the one described.

## Capabilities

### New Capabilities

- `presentation/space-theme`: visual identity of space — spaceship with animated trail instead of the player, asteroids instead of the obstacles, parallax starfield, menu consistent with the same universe, labels centered in the buttons and provenance/license of every asset documented.

### Modified Capabilities

None: the game behavior (climb, collision, score, menu → run → menu cycle) does not change; only how it looks.

## Impact

- Assets: ~20–30 PNGs in `public/assets/kenney/` (about 200 kB) plus `license.txt`; no new npm dependency.
- Code: new `src/game/sprites.ts` (definitions and loading), `src/game/player.ts` (spaceship + trail), `src/game/obstacle.ts` (sprite + rotation), `src/game/starfield.ts` (parallax), tweaks to `menu-scene.ts`, `climb-scene.ts`, `constants.ts` and `src/ui/button.ts` (label centering).
- Main risk: the hitboxes must not change — the collider stays the current one, the sprite is scaled to fill it, so the game stays identical to play.
