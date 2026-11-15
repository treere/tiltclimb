# Design

## Context

See `proposal.md` for the why. Today the scene draws everything with `ex.Rectangle` (`PLAYER_WIDTH 44`, `PLAYER_HEIGHT 56`, `OBSTACLE_WIDTH 120`, `OBSTACLE_HEIGHT 28`) and the menu is text on a black background. There is no loader yet: no external asset has ever been loaded.

Research already done on the assets, verifying the real content of the zip and not just the page that advertises it:

- **Kenney "Space Shooter Redux"**, CC0 1.0 license declared in the included `license.txt` (`Space Shooter (Redux, plus fonts and sounds) by Kenney Vleugels (www.kenney.nl)`), downloaded from `opengameart.org/content/space-shooter-redux` (official mirror of the pack). It contains 301 PNGs: 12 ships including `playerShip2_blue.png` (112×75), 21 meteors (`meteorBrown_*`, `meteorGrey_*`, from tiny to big, e.g. `meteorBrown_big1` 101×84), 20 flame frames `Effects/fire00–fire19` (16×40), stars `Effects/star1–3` (about 25×24) and 256×256 background tiles (`Backgrounds/darkPurple.png`, verified: starfield, 67 distinct colors out of 65536 pixels, base `#3a2e3f`).
- The CC-BY licensed alternatives require visible attribution in the game: rejected because they add a permanent obligation for no aesthetic gain compared to CC0. "Free" assets without an explicit license: rejected by definition.

## Goals / Non-Goals

**Goals:**

- replace every visible rectangle with a licensed asset, without touching the game logic;
- download into the repo only the files used (not the whole pack), with license and credit;
- cheap parallax: two layers, dozens of sprites, no per-frame allocation.

**Non-Goals:**

- weapons, enemies, power-ups, audio, impact particles;
- redoing the HUD beyond what is needed for legibility;
- tuning of speed, spacing or difficulty.

## Decisions

### 1. A single pack, CC0 license, minimal file set

Only Kenney Space Shooter Redux assets are used. About 20 files enter the repo: 1 ship, 10 flame frames, 6 meteors (3 brown + 3 grey, different sizes), 3 stars, 1 background tile, plus `license.txt` in `public/assets/kenney/` and a **Credits** section in `README.md` with author, license and URL.

Rejected alternative: keeping the complete pack (301 PNGs, 1.1 MB) in the repo. It is not needed, it weighs down the diffs and it makes opaque which files are really in use.

### 2. Hitbox with the same area, not the same shape

The meteor is approximately square (101×84), the current obstacle is a 120×28 bar: if I kept the bar, the visible silhouette would be much larger than the collider and the impact would look random. I switch to a **circular collider of radius ~33 px** (area ≈ 3420 px² against the 3360 px² of the bar) centered on the sprite: identical area, therefore comparable difficulty, shape consistent with the asteroid and a slightly generous visual margin — a forgiven near miss is better than an inexplicable death.

The vertical spacing (`SPAWN_GAP_PX = 260`) stays unchanged.

### 3. Trail as a 10-frame animation, child of the actor

`ex.Animation` built from 10 `ex.ImageSource` (`fire00`–`fire09`), 60 ms per frame, looping, mounted on an actor child of the spaceship (offset below the fuselage). Being a child means it follows position and rotation without synchronization code.

Rejected alternative: 20 frames. It doubles the weight with no perceptible difference at 60 px of height.

### 4. Background: tile repeated in a pool, not a giant texture

The visible world is 720×1280; with 256 px tiles you need 3 columns × 5 rows = 15 sprites, recycled when they exit below and repositioned above. Speeds: far layer at `0.25 × CLIMB_SPEED`, star layer at `0.6 ×` and `1.0 ×` for the two depths. All sprites are created once and never destroyed.

Rejected alternative: a single background image as tall as needed. It grows without limit while climbing and takes memory.

### 5. Loading in the scene loader, not lazy

The images sit behind a shared `ex.Loader` (defined in `src/game/sprites.ts`) and are loaded before the scene is playable: an asset that arrives late produces a frame with an empty rectangle instead of the spaceship. The file names live in a single module, so renaming an asset is a single change.

### 6. Menu: same background, ship as illustration, buttons unchanged

The menu reuses the parallax at reduced speed (`0.1 ×`) and shows the spaceship as an illustration (still, with the animated trail: it costs nothing and gives life). Reading, warnings and commands stay where they are: the layout does not change, the skin does.

**On label centering**: after the last fix the graphic group has centered anchors and zero offset, so the text is centered; the residual risk is that a label wider than the background widens the bounds of the group and moves the background. Defense: `useBounds: false` on the text member, so that only the rectangle defines the bounds of the group, plus a check with the longest label the game produces ("Sensor unavailable").

### 7. Player hitbox unchanged

The collider stays the current one (`44×56 × 0.8`); the ship sprite is scaled to fill it, with the anchor at the center. The ship is 112×75, so the scale is about 0.45: no change of feel, and the elongated vertical shape stays consistent with the silhouette.

## Risks / Trade-offs

- **Weight of the assets in the repo** → ~200 kB in `public/assets/kenney/`, served as files and not inlined in the build.
- **Parallax on slow phones** → 15 + 12 sprites and no per-frame allocation; if it weighs too much, the pool is reduced to 2 columns × 4 rows.
- **Sharpness**: Kenney is vector drawing, not pixel art → antialiasing is left on (no `pixelArt: true`) and scaling is non-integer; at 0.45 the ship can look slightly soft, acceptable on screen.
- **Perceived difficulty different** with a circular collider → equivalent area and generous margin; if in hand it turns out too easy, the radius is raised, not the speed.
- **Attribution**: CC0 does not require it, but the README cites author and license anyway; if one day a CC-BY asset arrived, the credit must also go in the game, not only in the README.
- **`useBounds: false`** changes the bounds of the group: if in the future a button had an icon outside the rectangle, it would have to be handled explicitly.

## Migration Plan

No data to migrate. The assets are new files, the game logic does not change; the rollback is the revert of the apply commit, which brings back the rectangles without touching the already archived specs.
