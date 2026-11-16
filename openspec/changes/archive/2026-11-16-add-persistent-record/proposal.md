# Proposal

## Why

The best score lives in memory only: close the tab or reload the page and the record is gone. A game
whose only reward is a number in the corner needs that number to survive, otherwise there is nothing
to come back to and nothing to beat.

## What Changes

- **The best result is stored in the browser** (`localStorage`, same mechanism already used for the
  audio toggle and the steering sensitivity) and read back at startup, so it survives a reload, a
  closed tab and a phone reboot.
- **Two values**: best score, which is the record, and best kill count — same mechanism, one extra
  key, and the menu already shows kills next to the score.
- **Written when beaten**, in the same method that already decides whether a run is a record, so the
  in-memory value and the stored one cannot disagree.
- **The menu separates the two ideas**: the result of the last run and the best ever, so a good run
  is not confused with the record.
- **Tolerant storage**: if the browser denies or throws on `localStorage`, or the stored value is
  garbage, the game keeps working with a best that lasts the session and no error reaches the player.
- Out of scope: online leaderboards, more statistics (average, runs played, distance), dates on the
  record, a reset button, syncing between devices.

## Capabilities

### New Capabilities

- `gameplay/records`: the best result persists on the device across sessions.

### Modified Capabilities

- `ui/start-menu`: the menu shows the last run and the stored best as two distinct values.

## Impact

- New `src/game/records.ts` with small, testable read/write helpers; `src/game/session.ts` loads at
  startup and writes when a record is beaten; `src/game/menu-scene.ts` for the result line.
- Two keys: `tiltclimb.bestScore` and `tiltclimb.bestKills`.
- Risk: a corrupted or unavailable storage must never produce `NaN` on screen — the helpers validate
  and fall back to zero.
- Risk: the meaning of "record" changes slightly. Today the first run of a session is never a record
  because there is no best to beat; now there is one, and the first run that beats the stored value
  is a record and plays the success sting.
