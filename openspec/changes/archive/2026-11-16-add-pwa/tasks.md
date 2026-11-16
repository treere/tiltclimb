# Tasks

## 1. Icons and manifest

- [x] 1.1 Write `scripts/make-icons.py` generating 192, 512 and maskable 512 PNGs from the ship sprite on the game background; check: `python3 scripts/make-icons.py` writes three files and they open as valid images
- [x] 1.2 Add `public/manifest.webmanifest` with name, short name, `start_url: "./"`, `scope: "./"`, standalone, portrait, theme and background colour, and the three icon entries; check: the file is valid JSON and is served from the built site
- [x] 1.3 Link the manifest and the theme colour in `index.html`; check: browser devtools detects the manifest with no warnings and offers to install

## 2. Service worker

- [x] 2.1 Add the Vite plugin that writes `sw.js` at build time with the cache name derived from the build hash and the list of every file in `dist` except the worker itself; check: `npm run build` produces `dist/sw.js` and its precache list matches the files on disk
- [x] 2.2 Implement install / activate / fetch as designed (network-first for navigations, cache-first for assets, old caches deleted on activate); check: a probe reads the generated file and asserts the three handlers and the cache-name pattern
- [x] 2.3 Register the worker from `src/main.ts` after `load`, silently on failure; check: registering works on the deployed site and the game still boots with registration forced to fail

## 3. Offline

- [x] 3.1 Browser test with the network cut after the first visit: the game opens, the loading screen completes, the menu appears and a run starts; check: Playwright with `context.setOffline(true)` after a first load
- [x] 3.2 Confirm audio and explosion frames come from the cache offline; check: no failed requests in the offline run

## 4. No stale build

- [x] 4.1 Deploy a change, reopen online and confirm the page loads the new bundle name and the old cache is gone; check: compare the bundle hash in the page with the one in `dist`, and list the cache keys in the worker
- [x] 4.2 Confirm an open tab is not reloaded by a new version; check: with the page open, deploy and observe no reload and no console error

## 5. Docs and device check

- [x] 5.1 Update `README.md` with install and offline behaviour; check: `npm run check` green
- [x] 5.2 Install on the phone, play once, go offline and reopen; check: judgement by hand, plus a note on the icon on the home screen

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec delta
