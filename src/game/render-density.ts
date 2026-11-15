/**
 * Render density for the canvas backing store.
 *
 * `pixelRatio` in Excalibur multiplies the backing store while the logical world stays 720×1280,
 * so the right value is the one that makes the backing store match the physical pixels of the
 * area the game actually occupies — not simply the device pixel ratio, which over-renders a
 * 720-wide world on a 3× phone by a factor of two and a half.
 */

/** Never below 1 (a smaller buffer would be stretched), never above the cap (cost per fragment). */
export const RENDER_PIXEL_RATIO_CAP = 2.5;

/**
 * `FitScreen` fits the 720×1280 world inside the viewport keeping the aspect ratio, so the
 * painted width is the smaller of the viewport width and the width allowed by its height.
 */
export function renderPixelRatio(
  viewportWidth: number,
  viewportHeight: number,
  devicePixelRatio: number,
  worldWidth: number,
  worldHeight: number,
): number {
  if (
    !Number.isFinite(viewportWidth) ||
    !Number.isFinite(viewportHeight) ||
    viewportWidth <= 0 ||
    viewportHeight <= 0
  ) {
    return 1;
  }

  const aspect = worldWidth / worldHeight;
  const paintedWidth = Math.min(viewportWidth, viewportHeight * aspect);
  const density = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  const ratio = (paintedWidth * density) / worldWidth;

  return Math.min(RENDER_PIXEL_RATIO_CAP, Math.max(1, ratio));
}
