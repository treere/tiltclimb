# Design

## Context

See `proposal.md`. Facts that shape the work:

- The build is fully static: `dist/index.html`, one hashed JS bundle and `assets/**` copied from
  `public`. Deployed to GitHub Pages by a workflow, so the base path is `/tiltclimb/` while the app
  itself uses relative `base: './'`.
- The game has exactly one runtime dependency (Excalibur). Adding Workbox for this would triple the
  toolchain.
- Assets are a few megabytes (2.9 MB audio, 1.1 MB explosion frames, sprites, inline ships).
- A previous incident in this project: files served from disk were stale and produced 404s that
  looked like missing code. Any caching layer must be easy to reason about and to verify.

## Goals / Non-Goals

**Goals:** installable, full screen, offline after the first visit, no stale build, no new dependency.

**Non-Goals:** push notifications, background sync, an in-app install button, live update of an open
tab.

## Decisions

### 1. Manifest as a static file, icons generated offline

`public/manifest.webmanifest` is hand-written (about 20 lines) and copied as-is by Vite. Icons are
generated once by `scripts/make-icons.py` from `public/assets/kenney/playerShip2_blue.png` on the
`#0e1116` background: 192, 512 and a maskable 512 with the ship at ~55% of the canvas so a circular
crop does not cut it. The script is committed, so the icons can be regenerated if the art changes.

`display: standalone`, `orientation: portrait` (the game is portrait-only and shows a rotate hint
otherwise), `start_url: "./"` and `scope: "./"` so it works under `/tiltclimb/` without absolute
paths.

### 2. The service worker is generated at build time, not served from `public`

A small plugin in `vite.config.ts` (`closeBundle` hook) walks `dist`, writes `sw.js` with:

```js
const CACHE = 'tiltclimb-<hash of the build>';
const PRECACHE = ['index.html', 'assets/index-abc.js', ...]; // every file in dist except sw.js
```

- `install`: cache every precache URL, then `skipWaiting()`.
- `activate`: delete every cache whose name is not `CACHE`, then `clients.claim()`.
- `fetch`: `index.html` and navigations → network first, cache fallback; everything else → cache
  first, network as a fallback that also fills the cache.

Why generated and not hand-written in `public`: the bundle name is hashed by Vite, so a static
worker cannot know the file list, and a stale list is exactly the failure mode to avoid. The plugin
sees the real output.

Why no Workbox: the whole worker is about 40 lines and the interesting part — the cache name — is
ours, so the stale-cache question has a readable answer instead of a configuration option.

### 3. Updates land on the next open, never mid-run

`skipWaiting()` plus `clients.claim()` gives a fast update but would swap assets under an open page.
Instead the registration is plain: `navigator.serviceWorker.register('sw.js')` after `load`, and no
reload on `controllerchange`. The new worker activates when the last tab closes; the next open serves
the new build. A run in progress is never interrupted — that is a spec requirement, and this is the
cheapest way to honour it.

### 4. Registration is optional and silent

```ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => undefined);
  });
}
```

No UI, no error path: if it fails, the game is a normal web page, which is exactly today's
behaviour.

## Risks / Trade-offs

- **Stale build served from cache** → cache name carries the build hash, activation deletes the rest,
  and the document is network-first; verified by deploying a change and checking the bundle name the
  page loads.
- **Offline first visit** → nothing cached: the browser error is the only possible answer; the spec
  says so explicitly.
- **Storage quota on iOS** → the worker may be evicted; the game then behaves like a normal page.
- **`sw.js` must never be cached by itself** → excluded from the precache list and served from the
  network by the browser's own rule for the worker script.
- **Regenerating icons** → a script, not a manual export, so it stays reproducible.
