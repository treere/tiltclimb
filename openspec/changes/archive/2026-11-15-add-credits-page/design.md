# Design

## Context

See `proposal.md` for the why. Today the menu has two buttons centered at fractions 0.73 and 0.85 of the usable height, a calibration block above them, and the `Button` is a panel with a `rgba(14,26,43,0.88)` background and a 3 px border obtained with two concentric rectangles. The scenes are registered in `main.ts` and navigation uses `engine.goToScene`.

The measured weak point: the button background is 88% transparent, so the stars pass underneath it. The light text (`#dbeafe`) on a background that varies between `#0e1a2b` and the brightness of a star loses contrast in patches — it is exactly the feeling of "text you cannot read".

## Goals / Non-Goals

**Goals:**

- a credits page that reads well, with a short story and the credits in the right place;
- **verifiable** contrast, not "by eye": 7:1 text/background threshold, calculated and checked;
- menu with three commands and no layout collisions on short screens.

**Non-Goals:**

- audio, page animations, external links;
- changes to gameplay, enemies, scores, calibration;
- text scrolling: the story fits in one screen.

## Decisions

### 1. A separate scene for the credits

`src/game/credits-scene.ts`, registered as `credits`, with the same `Starfield` at reduced speed as the menu, the ship as an illustration and two buttons: **BACK** and nothing else.

Rejected alternative: a panel inside `MenuScene`. The menu already handles sensor, permissions, calibration and summary; adding a panel with its own state would mean more guards in `onPreUpdate` and the same "go back" logic written twice.

### 2. Content in a module, not scattered in the layout

`src/game/credits-text.ts` exports `STORY: string[]` and `CREDITS: {label, value}[]`. The scene only lays them out. That way rewriting the story does not touch the layout code, and the texts are in a place you can read without opening a scene.

### 3. Legibility measured, not estimated

The `Button` changes in three places:

- **opaque background** `#0b1a2e` (no alpha): the stars no longer pass under the label;
- **border** brighter `#7fd4ff` at 3 px, still with two concentric rectangles;
- **label** white `#ffffff`, size 38 (was 34), with the font `shadow` (offset 2,2, blur 0, black) to lift it from the background even below 60 px of height.

The values are chosen so that the calculated contrast exceeds 7:1: white on `#0b1a2e` is around 16:1, and the border on `#0b1a2e` is well beyond the 3:1 threshold required for non-text elements. The check is a calculation done in Node on the real colors in the code, not a statement.

Outside the buttons, the same shadow goes on the HUD and on the menu texts, because there the background remains the starfield and there is no way to make it opaque without losing the effect.

### 4. Menu layout with three commands

The menu moves to: ship illustration at 0.20, tilt label and value at 0.30/0.36, bar at 0.44, summary at 0.50, warning at 0.56, and the three buttons at 0.66 / 0.77 / 0.88, with height 92 and a gap of 8 px. The calibration confirmation moves down to 0.95.

The fraction 0.88 × 1280 ≈ 1126 px, which leaves 154 px below: enough for the 92-high button and for the safe area. With a third button there is no room to keep the previous distances: two commands at 0.73/0.85 would become three at 0.66/0.77/0.88.

### 5. Going back does not touch the session state

`CreditsScene` neither reads nor writes `session`: calibration lives in the singleton and stays intact. The **BACK** button calls `engine.goToScene('menu')`, and `MenuScene.onActivate` redraws the summary, so you return to the menu exactly as it was.

## Risks / Trade-offs

- **Three buttons on short screens**: 0.66–0.88 are fractions of the usable height (which respects `contentArea`), so on a short phone the commands compress but stay inside; if in hand they feel tight, the button height is reduced to 84, not the distances.
- **Text with a shadow that "smudges"**: too strong a shadow at size 38 looks like a printing error; 2 px offset and 0 blur keep the edge sharp.
- **7:1 threshold**: it is strict; if in the future a colored text is wanted instead of white, it must be recalculated — a test is better than an opinion.
- **Credits page that ages**: the story is in a dedicated module, so it can be rewritten without touching the scene; but no test protects it, and a change to the game could make it inconsistent. Mitigation: the story talks about climbing and asteroids, not about mechanics that can change.
- **No external links**: the page is not clickable towards kenney.nl; those who want more have the README. It is a choice to avoid handling external URLs in a canvas.

## Migration Plan

No migration. `CreditsScene` is a new scene, the menu changes only by one more button. Rollback: revert of the apply commit.
