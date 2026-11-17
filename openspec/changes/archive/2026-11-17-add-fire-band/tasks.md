# Tasks

## 1. Gesture maths

- [x] 1.1 Create `src/input/tap-gesture.ts` with `TAP_SLOP_PX`, `TAP_MAX_MS` and the four methods; check: Node probe covering tap, a few pixels of travel, a real drag, a long press and a cancelled gesture
- [x] 1.2 Confirm the travel accumulates across several moves; check: the probe feeds five small moves that together pass the slop and expects a drag

## 2. Stable coordinates

- [x] 2.1 Replace `event.screenPos` in `InputRouter` with page position converted against the canvas rectangle; check: browser test tapping the same physical point at level 1 and after climbing 10,000 px reports the same resolution coordinates
- [x] 2.2 Confirm the drag limit still stops steering on the fire button; check: browser test dragging from inside the button and reading the ship's x displacement

## 3. The band

- [x] 3.1 Add `FIRE_BAND_HEIGHT = 220` and a `onFireTap` subscription in `InputRouter`: a tap whose position is inside the band and outside the button rectangle reports a fire; check: probe on five positions — above the band, inside it, on the button, below the band, and at the band edge
- [x] 3.2 Wire it in `ClimbScene` to `fireHero`; check: browser test with real mouse taps at those positions counting projectiles
- [x] 3.3 Confirm one tap on the button fires once and not twice; check: browser test counting projectiles for a single click on the button
- [x] 3.4 Confirm a drag inside the band steers and does not fire; check: browser test dragging 120 px and reading ship displacement and projectile count

## 4. Existing rules still hold

- [x] 4.1 Tapping the band while paused, jammed or after the run ends does nothing; check: browser test on the three states reading projectile count
- [x] 4.2 Heat is added by band shots exactly as by button shots; check: four band taps reach a jam

## 5. Docs and device check

- [x] 5.1 Update `README.md` with the band, its height and the tap-versus-drag rule; check: `npm run check` green
- [x] 5.2 Play on the phone: does the thumb find the band without looking, does steering still feel safe; check: judgement by hand
- [x] 5.3 Tune `FIRE_BAND_HEIGHT` or the slop if it feels wrong; check: constants updated, probes still green

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec delta
