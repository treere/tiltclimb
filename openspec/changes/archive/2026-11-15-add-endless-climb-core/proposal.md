# Proposal

## Why

We want a small 2D game playable on PC and on a phone from the browser, using the phone as a controller: you climb vertically forever and you steer by tilting the device. It is the first game of the project, and a playable core is needed quickly to understand whether the tilt control is fun or just annoying: until you try it in your hand, every other choice (graphics, levels, scores) is premature.

## What Changes

- New game scene with an infinite vertical scrolling world: the player climbs automatically, the camera follows only on the Y axis, obstacles are generated above the screen and recycled below through a pool.
- New tilt input: `deviceorientation` → `gamma` with zero calibration on the first touch, smoothing filter and central dead zone.
- Mandatory fallback without sensors: arrows/AD on desktop, horizontal drag on touch (permission denied or device without accelerometer).
- Collision with obstacles that ends the run, score based on the height reached, immediate restart.
- Mobile-first layout: locked portrait, full-screen canvas with `contentArea`/`unsafeArea` respected, first touch asking for the sensor permissions and calling `enterFullscreen()`.
- Out of scope: graphics and audio (only shapes drawn in code), levels or curated progressive difficulty, best score persistence (in memory for now), installable PWA, static hosting deploy, leaderboard, any backend.

## Capabilities

### New Capabilities

- `gameplay/endless-climb`: infinite vertical scrolling world with a single-axis camera, obstacle generation and recycling, collision, score by height and run cycle (play → die → restart).
- `input/tilt-control`: translation of the tilt into horizontal movement with calibration, smoothing and dead zone, plus keyboard and drag fallback when the sensor is not available.

### Modified Capabilities

None: the project has no specs yet.

## Impact

- Code: `src/` (new `game/`, `input/` modules), `index.html`, `vite.config.ts`.
- Dependencies: none new; Excalibur 1.0.1, TypeScript and Vite are already installed.
- Platforms: Android Chrome (primary target) and desktop Chrome/Firefox; iOS not tested, but the permission path is the same.
- Preview: quick cloudflared tunnel, so HTTPS is mandatory for the sensors and HMR is already configured on `wss:443`.
