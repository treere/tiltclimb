# Tasks

## 1. Rendering at device density

- [x] 1.1 Set `pixelRatio` in the engine options to `min(devicePixelRatio, 2.5)` and expose it as a named constant; check: `npm run check` green and, on a 3× emulated viewport, the canvas backing store width matches the physical width up to the cap
- [x] 1.2 Add `antialiasing: false` and `pixelArt: true`; check: `npm run check` green and a screenshot shows hard sprite edges
- [x] 1.3 Verify the UI text and button labels are still crisp and centred after the change; check: screenshot of the menu and of the game compared against the previous one

## 2. Frame pacing

- [x] 2.1 Replace `fixedUpdateFps: 60` with real elapsed time and update the comment that justified it; check: `npm run check` green and two consecutive frames at 120 Hz show different positions
- [x] 2.2 Measure collision safety with a simulated 8 ms frame: a 620 px/s projectile against a 20 px hit radius must still register; check: numeric probe in Node, no tunneling for the sizes in use
- [x] 2.3 Confirm the same distance per second on a 60 Hz and a 120 Hz simulation; check: numeric probe comparing integrated distance over one second

## 3. Steering

- [x] 3.1 Turn the dead zone into a continuous ramp with a 1.5° threshold; check: numeric probe showing axis 0 at the threshold and no jump just above it
- [x] 3.2 Lower the smoothing tau to 45 ms; check: numeric probe showing 63% of target speed within 50 ms, 90% within 110 ms
- [x] 3.3 Raise the full-scale horizontal speed to 380 px/s; check: 720 px of logical width crossed in about 1.9 s in the probe, and a screenshot showing the ship reaching the wall

## 4. Sense of speed

- [x] 4.1 Raise the tile parallax factor to 0.55 and confirm it follows the current climb speed; check: `npm run check` green and a numeric probe of tile travel at the start and at the speed cap
- [x] 4.2 Check the background still covers the screen with no seams at the new factor, at low and high speed; check: two screenshots a few seconds apart

## 5. Docs and device check

- [x] 5.1 Update `README.md` with the new values and the rendering policy; check: `npm run check` green
- [x] 5.2 Play on the phone through the tunnel: verify sharpness, steering bite, world speed; check: judgement by hand, and a note of any value that needs tuning
- [x] 5.3 If the phone drops frames, lower the pixel-ratio cap and re-check; check: smooth motion at the chosen cap

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the device check, syncing the spec deltas
