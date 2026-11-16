# Tasks

## 1. Heat maths

- [x] 1.1 Create `src/game/weapon-heat.ts` with the constants, `HeatState`, `heatAfterShot`, `heatAfterCooling`, `canFire`; check: numeric probe in Node on four quick shots reaching a jam, on the cooling curve, and on the reset at 35
- [x] 1.2 Confirm tapping while jammed adds no heat and does not delay the reset; check: the same probe fires twenty times while jammed and asserts the heat only goes down
- [x] 1.3 Confirm cooling is frame-rate independent; check: the probe cools 500 ms in 30 steps of 16.6 ms and in 5 steps of 100 ms and compares the results

## 2. Wiring the fire command

- [x] 2.1 Make `fireHero` ask the heat state before spawning and add heat on a successful shot, keeping the 150 ms guard; check: browser test showing four shots then no fifth, and projectiles counted
- [x] 2.2 Cool in `onPreUpdate` with the frame elapsed time, so pause and end of run freeze it; check: browser test pausing mid-jam and confirming the heat does not move
- [x] 2.3 Reset the heat in `startRun`; check: end a run with a jammed cannon, restart, and the first shot is available

## 3. Fire control and bar

- [x] 3.1 Add `src/ui/heat-bar.ts`: 140 × 12 canvas bar with a colour for cold, hot and jammed; check: screenshot in the three states
- [x] 3.2 Place it 24 px above the fire button, clear of the ship and inside the safe area; check: screenshot on 360 px wide, nothing overlapping
- [x] 3.3 Collapse the button state into one `refreshFireState()` that reads heat, pause and run status, and change the label to `COOLING` while jammed; check: `npm run check` green and a browser test asserting enabled + label in each of the three states

## 4. Behaviour end to end

- [x] 4.1 Browser test: fire until the jam, confirm the bar is full and red, the label says COOLING, taps do nothing, then it recovers on its own; check: the test reads enemies killed, heat and button state across the sequence
- [x] 4.2 Confirm the score, the levels and the record do not read the heat; check: two runs with the same height and kills score the same, and the stored record is unchanged in format

## 5. Docs and device check

- [x] 5.1 Update `README.md` with the heat rules and the numbers; check: `npm run check` green
- [x] 5.2 Play on the phone: is the rhythm readable, is the jam long enough to matter but not to annoy; check: judgement by hand
- [x] 5.3 Tune `HEAT_PER_SHOT`, `COOL_PER_SECOND` or `RESET_HEAT` if it feels wrong; check: constants updated, probes still green

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec deltas
