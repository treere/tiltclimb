# Tasks

## 1. Rules in one pure module

- [x] 1.1 Create `src/game/powerups.ts` with `DROP_CHANCE`, `POWERUP_MS`, `WARN_MS`, `IDLE`, `isActive`, `isWarning`, `afterPickup`, `afterTime`, `shouldDrop`; check: numeric probe in Node on the timer, the warning window, the reset-not-add rule and a 10,000-draw sweep of the drop chance
- [x] 1.2 Confirm the timer cannot go negative or backwards; check: the probe feeds negative and `NaN` deltas and asserts the state is unchanged

## 2. Assets

- [x] 2.1 Write `scripts/make-ship-variant.py` producing an amber copy of the CC0 ship with the same dimensions; check: the PNG exists, is the same size as the original and differs in colour
- [x] 2.2 Add the pickup sound to `scripts/prepare-audio.py` and regenerate; check: `public/assets/audio/pickup.ogg` exists, is OGG, and `LICENSE.md` still lists the pack
- [x] 2.3 Load both in `sprites.ts` and `audio/sounds.ts`; check: `npm run check` green and both files requested 200 on the built site

## 3. The pickup in the run

- [x] 3.1 Create `src/game/pickup.ts`: falling item with a rotating sprite, one at a time, released below the screen; check: browser test showing one pickup after a forced drop and none after it leaves
- [x] 3.2 Drop on kill with `shouldDrop(Math.random())`, at the destroyed ship's position; check: browser test firing many forced kills and counting drops
- [x] 3.3 Collect on contact with the hero; check: browser test placing the hero onto a pickup and reading the timer

## 4. Invincibility

- [x] 4.1 Make the collision handler ignore asteroids while powered, and make `resolveHits` destroy a ship that touches the powered hero, with explosion, points and kill counted; check: browser test with each of the three contacts — asteroid, projectile, ship — reading `running`, kills and score
- [x] 4.2 Decrement the timer in `onPreUpdate` and reset it in `startRun`; check: browser test pausing mid-effect (timer frozen) and restarting the run (timer zero)
- [x] 4.3 Second pickup restarts instead of adding; check: browser test taking one with two seconds left and reading the timer at the full duration

## 5. Look and sound

- [x] 5.1 `setPowered` on the ship: amber while powered, normal after expiry, and blinking every 120 ms in the warning window; check: browser test sampling the active texture across the states
- [x] 5.2 Play the pickup jingle on collection without touching the music; check: browser test reading which sounds were requested and that the music voice count does not change
- [x] 5.3 Screenshot the powered state and the warning blink; check: the ship is visibly amber, and in warning it alternates

## 6. Docs and device check

- [x] 6.1 Update `README.md` with the power-up rules, the numbers and the new asset; check: `npm run check` green
- [x] 6.2 Play on the phone: is it rare enough to be a surprise, is the eight seconds right, does the blink warn without confusing; check: judgement by hand
- [x] 6.3 Tune `DROP_CHANCE`, `POWERUP_MS` or `WARN_MS` if needed; check: constants updated, probes still green

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec deltas
