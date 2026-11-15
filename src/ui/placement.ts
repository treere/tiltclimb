import * as ex from 'excalibur';

/**
 * Places a graphic so that its bounding box is centred on (centerX, centerY).
 *
 * Excalibur draws a graphic from its top-left corner and only uses `origin` for rotation, so
 * an actor anchor of 0.5 shifts the drawing by half the graphic size — which is how labels end
 * up off-centre. Here the anchor stays at zero and the offset is computed from the measured
 * size, so the placement is exact for text, rectangles and canvas graphics alike.
 */
export function addCenteredGraphic(
  scene: ex.Scene,
  graphic: ex.Graphic,
  centerX: number,
  centerY: number,
  z = 5,
): ex.ScreenElement {
  return addGraphicAt(scene, graphic, centerX - graphic.width / 2, centerY - graphic.height / 2, z);
}

/** Places a graphic at an explicit top-left position, anchor zero. */
export function addGraphicAt(
  scene: ex.Scene,
  graphic: ex.Graphic,
  left: number,
  top: number,
  z = 5,
): ex.ScreenElement {
  const holder = new ex.ScreenElement({ x: left, y: top, z });
  holder.graphics.use(graphic);
  scene.add(holder);
  return holder;
}
