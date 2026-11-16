# Design

## Context

See `proposal.md`. Current state of the code:

- `src/game/session.ts` is a module singleton holding `bestScore`, `lastScore`, `lastKills` and
  `hasPlayed`, all in memory. `recordScore(points, kills)` decides whether a run is a record and
  returns it — the scene uses that to pick the success or the defeat sting.
- The record rule today is `hasPlayed && points > bestScore`: the first run of a session is never a
  record, because there is nothing to beat.
- `localStorage` is already used by the audio mute (`tiltclimb.muted`) and by the steering
  sensitivity (`tiltclimb.tiltLevel`), both wrapped in `try/catch` with a fallback.

## Goals / Non-Goals

**Goals:** the record survives the session; the menu shows last run and record without ambiguity;
nothing breaks when storage is missing.

**Non-Goals:** leaderboards, other statistics, dates, reset, cross-device sync.

## Decisions

### 1. Two small pure helpers instead of logic inside the singleton

`src/game/records.ts` exports `readStoredCount(key, storage?)` and `writeStoredCount(key, value,
storage?)`, plus the four named wrappers for score and kills. The storage is a parameter with a
default, so the helpers can be checked in Node with a fake storage that returns garbage, throws, or
answers normally — no browser needed.

Validation on read: integer, finite, `> 0`, otherwise `0`. Validation on write: finite and `>= 0`,
stored as an integer. A `NaN` must never reach the HUD.

### 2. The singleton loads at construction and writes inside `recordScore`

```ts
bestScore = readBestScore();
bestKills = readBestKills();

recordScore(points, kills) {
  const isRecord = points > this.bestScore;
  ...
  if (isRecord) { this.bestScore = points; writeBestScore(points); }
  if (kills > this.bestKills) { this.bestKills = kills; writeBestKills(kills); }
  return isRecord;
}
```

One place mutates both the memory and the storage, so they cannot disagree. `hasPlayed` is no longer
part of the record rule: the rule is now "beat the best that exists", and with no stored best the bar
is zero — which is exactly the "first run is not a record if you score nothing" behaviour, without a
special case.

**Consequence to be aware of**: the very first run of a fresh install now *can* be a record (any
score above zero), and plays the success sting. That is the intended meaning of a record once a
record can be stored.

### 3. The menu distinguishes run and record

`session.hasPlayed` still decides whether there is a run to report:

- after a run: `Last: 120   Best: 340   Kills: 5`
- opened with a stored record, no run yet: `Best: 340   Best kills: 12`
- nothing at all: empty line.

Labels are explicit on purpose: the earlier version showed `Best: 777   Kills: 3`, where "Kills"
could be read as the last run's kills. This is the same mistake the pause change taught in another
form — two different ideas must not share one unlabelled row.

### 4. No versioning, no migration

There is nothing to migrate: the keys did not exist before, and an absent key reads as zero. A stored
value from a future version with a different meaning would read as a number; the worst case is a
record that is too high, which the player can beat or which they can clear from the browser.

## Risks / Trade-offs

- **`NaN` or negative on screen** → validation on read; a unit probe covers missing, garbage,
  negative and throwing storage.
- **Storage silently full** → the write is wrapped; the session value still updates, so the run is
  still reported, only persistence fails.
- **Record rule change** → the first run of a fresh install counts as a record; documented in the
  spec as a scenario so it is a decision, not an accident.
- **Two sources of truth** (memory and storage) → both are written in the same method and only there.
