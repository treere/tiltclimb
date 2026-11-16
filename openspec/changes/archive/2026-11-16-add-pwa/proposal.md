# Proposal

## Why

The game is a web page: a browser bar, tabs, and a pull-to-refresh gesture that fires by accident
while steering and costs the run. Without a signal there is no game at all, though the whole thing is
a static bundle of a few megabytes.

## What Changes

- **Installable**: a web app manifest with name, colours, orientation portrait and icons, so the game
  can be added to the home screen and opens full screen, without browser chrome.
- **Icons** generated from the ship sprite already in the repository: 192, 512 and a maskable 512
  with safe padding, on the game's background colour.
- **Offline** after the first visit: a service worker precaches the bundle, images, audio and the
  explosion frames, so the game opens and plays with no network.
- **Cache versioned by build**: the service worker is generated at build time with the list of hashed
  assets, and activating a new version deletes the old cache. `index.html` is network-first with a
  cache fallback, so a new deploy is picked up as soon as the phone is online.
- **No new dependency**: a small Vite plugin writes the manifest and the service worker from the
  build output. The alternative, `vite-plugin-pwa`, would add Workbox to a project that has exactly
  one runtime dependency today.
- Out of scope: push notifications, background sync, a custom install button, offline analytics,
  updates pushed to an open tab (a new version is picked up on the next open).

## Capabilities

### New Capabilities

- `presentation/pwa`: installability, offline availability and cache invalidation for the game.

## Impact

- New `public/manifest.webmanifest`, `public/icons/*`, a Vite plugin in `vite.config.ts`, a
  registration call in `src/main.ts`, and the manifest link plus theme colour in `index.html`.
- The worker caches the whole `dist` output: a few megabytes, fine for a game installed on purpose.
- Risk, and the main reason this needs care: a stale service worker serving an old bundle — the same
  class of problem already met with the dev server. The cache name carries the build hash, activation
  clears the previous one, and the workers scope excludes itself.
- Risk: iOS Safari installs from "Share → Add to Home Screen" and has a smaller offline quota; the
  game must behave exactly as before when the worker is absent or refuses to register.
