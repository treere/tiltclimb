# Tasks

## 1. Storage helpers

- [x] 1.1 Create `src/game/records.ts` with `readStoredCount` / `writeStoredCount` taking the storage as a parameter, plus the named wrappers for score and kills; check: unit probe in Node covering missing key, garbage value, negative, round trip and a storage that throws on read and on write
- [x] 1.2 Confirm a `NaN` or an invalid value never comes back from a read; check: the same probe asserts every bad input returns 0

## 2. Session

- [x] 2.1 Load the stored best score and best kills when the singleton is created; check: with a fake storage seeded at 500, a fresh import reports 500 as the best
- [x] 2.2 Write the new values inside `recordScore`, in the same branch that updates the in-memory values, and drop the `hasPlayed` condition from the record rule; check: probe showing a run of 600 against a stored 500 is a record and stores 600, a run of 400 is not and leaves the storage alone

## 3. Menu

- [x] 3.1 Show three cases in the result line — after a run (`Last`, `Best`, `Kills`), opened with a stored record (`Best`, `Best kills`), nothing stored (empty); check: browser test reloading the page with a seeded storage and reading the line
- [x] 3.2 Keep the new record distinguishable from a normal run; check: screenshot after a record and after a worse run

## 4. Real behaviour

- [x] 4.1 Browser test: play, force a score, end the run, reload the page, confirm the menu shows the same best; check: the test reads `localStorage` and the rendered line on both sides of the reload
- [x] 4.2 Confirm the success sting still plays when a stored record is beaten and the defeat sting when it is not; check: browser test on the two cases, reading which sting was requested
- [x] 4.3 Confirm nothing breaks with storage disabled (browser context with `localStorage` throwing); check: the game boots, plays and shows a session best

## 5. Docs and device check

- [x] 5.1 Update `README.md` with the record keys and the new rule; check: `npm run check` green
- [x] 5.2 Play on the phone: beat the record, close the tab, reopen, confirm the value is still there; check: judgement by hand

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec deltas
