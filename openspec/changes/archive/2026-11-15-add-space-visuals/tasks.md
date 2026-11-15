# Tasks

## 1. Assets and licenses

- [x] 1.1 Copy the used files from the Kenney Space Shooter Redux pack (ship, 10 flame frames, 6 meteors, 3 stars, background tile) into `public/assets/kenney/` keeping the original names; check: the folder contains the expected files and `npm run check` stays green
- [x] 1.2 Copy the pack's `license.txt` next to the assets and add the **Credits** section in `README.md` with author, CC0 license and provenance URL; check: author, license and provenance reconstructable offline

## 2. Loading

- [x] 2.1 Create `src/game/sprites.ts` with the references to the assets and a single `ex.Loader` that preloads them; check: no 404 errors in console and `npm run check` green
- [x] 2.2 Connect the loader to the engine startup and block entry into the scene until the images are ready; check: the ship appears already in the first visible frame, without placeholder rectangles

## 3. Spaceship and trail

- [x] 3.1 Replace the player rectangle with the ship sprite, scaled to fill the existing collider (hitbox unchanged); check: the ship moves and collides as before, and the collider dimensions stay 44×56×0.8
- [x] 3.2 Add the animated trail as a child actor with a 10-frame `ex.Animation` at 60 ms, looping, below the fuselage; check: the flame animates in the run and stays aligned with the ship while it steers
- [x] 3.3 Stop the trail animation at the end of the run and restart it on the next run; check: after death the trail does not keep scrolling

## 4. Asteroids

- [x] 4.1 Replace the obstacle rectangle with meteor sprites chosen at random among the 6 available; check: two consecutive obstacles are not always the same sprite
- [x] 4.2 Assign a random initial orientation and a slow continuous rotation to each asteroid, with random speed and direction; check: the asteroids rotate while they scroll and do not all have the same angle
- [x] 4.3 Replace the rectangular collider with a circular collider of radius ~33 px and check that the area stays comparable; check: a meteor hit at the center kills, a grazing pass without visual contact does not

## 5. Parallax background

- [x] 5.1 Create `src/game/starfield.ts` with the pool of 256×256 tiles that scrolls and recycles; check: climbing for at least two screens no empty bands or seams appear
- [x] 5.2 Add the stars as a layer at intermediate speeds (0.6× and 1.0× the climb) for depth; check: the far elements scroll slower than the near ones
- [x] 5.3 Check that the parallax does not allocate during the run and that the frame rate stays stable on a phone; check: constant number of sprites over time and no perceptible stutter

## 6. Menu and buttons

- [x] 6.1 Apply the starfield at reduced speed and the spaceship with trail as an illustration in the menu; check: the menu is legible and the commands stay in their current positions
- [x] 6.2 Set `useBounds: false` on the button text so that only the rectangle defines the bounds of the group; check: with the label "Sensor unavailable" the background does not move and the text stays centered
- [x] 6.3 Check that changing the label at runtime (`Calibrate` ↔ `Sensor unavailable`) does not produce position jumps; check: no visible movement of the background on the change

## 7. Final check

- [x] 7.1 Full round on a phone via tunnel: themed menu → calibrate → run with ship, trail and asteroids → death → return to the menu; check: no missing asset and no console errors
- [x] 7.2 Check legibility in the run (ship distinguishable from the asteroids, HUD legible on the starfield); check: visual judgment on a small screen
- [x] 7.3 Update `README.md` (look, credits) and run `npm run check`; check: green command and consistent documentation

## 8. Tweaks requested after the test

- [x] 8.1 Move the spaceship to the lower part of the screen, with the camera following it at a fixed height; check: in the run the ship sits below the center and the position stays stable while climbing
- [x] 8.2 Redesign the buttons in a space palette (dark background, glowing border) with normal, pressed and disabled states; check: the borders stand out from the starfield and the text stays legible in all states
- [x] 8.3 Trial round on a phone: menu with themed buttons, run with the ship low, death and return to the menu; check: no clipped element and no position jump

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
