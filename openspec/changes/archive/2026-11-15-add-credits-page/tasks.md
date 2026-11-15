# Tasks

## 1. Content

- [x] 1.1 Create `src/game/credits-text.ts` with the hero's story (four lines) and the list of credits (Kenney assets with license, game author with role); check: `npm run check` green and no hard-coded text in the scene
- [x] 1.2 Add a contrast test in Node on the button and text colors, checking the 7:1 ratio; check: the check passes and fails if the background is darkened below the threshold

## 2. Buttons and legibility

- [x] 2.1 Make the button background opaque, brighter border, white label at size 38 with font shadow; check: the calculated contrast stays above 7:1 in all states
- [x] 2.2 Apply the shadow to the menu and HUD texts (title, tilt, summary, score during the run); check: the texts stay legible with the starfield in motion

## 3. Credits page

- [x] 3.1 Create `src/game/credits-scene.ts` with slow starfield, illustrative ship, title, story, credits and an BACK button that returns to the menu; check: the page opens, the text wraps within the margins and the return to the menu works
- [x] 3.2 Register the scene in `src/main.ts` and wire the CREDITS button of the menu; check: from menu to credits and back without starting runs and with calibration unchanged

## 4. Menu layout with three commands

- [x] 4.1 Reorganize the menu layout for the three buttons (0.66 / 0.77 / 0.88) moving the reading, bar, summary and warning; check: the three commands are all visible and do not overlap the illustration or each other
- [x] 4.2 Check the layout on a short screen (simulating a reduced usable height) and adjust the heights if needed; check: nothing ends up below the edge or above the navigation

## 5. Final check

- [x] 5.1 Round on a phone: menu with three buttons, readable credits, return to the menu, run startable after the return; check: no stuck state and no clipped text
- [x] 5.2 Judgment on legibility: texts readable over the stars in menu, credits and HUD; check: visual judgment on a small screen
- [x] 5.3 Update `README.md` (credits page, story, credits) and run `npm run check`; check: green command and consistent documentation

## Workflow follow-up

- Archive the change with `openspec-archive-change` after the check, syncing the spec deltas
