import * as ex from 'excalibur';
import { ClimbScene } from './game/climb-scene';
import { BACKGROUND_COLOR, WORLD_HEIGHT, WORLD_WIDTH } from './game/constants';
import { MenuScene } from './game/menu-scene';
import { createLoader } from './game/sprites';

const engine = new ex.Engine({
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  canvasElementId: 'game',
  displayMode: ex.DisplayMode.FitScreen,
  // Physics and movement run on a fixed 60 Hz step: climb speed must not depend on
  // whether the phone refreshes at 60, 90 or 120 Hz.
  fixedUpdateFps: 60,
  backgroundColor: ex.Color.fromHex(BACKGROUND_COLOR),
  suppressPlayButton: true,
});

engine.add('menu', new MenuScene());
engine.add('climb', new ClimbScene());

/**
 * Fullscreen and portrait lock are best effort: both can be refused (iOS ignores the
 * orientation lock, some browsers refuse fullscreen outside real gestures), and the
 * game has to stay playable either way.
 */
function requestImmersiveMode(): void {
  void engine.screen.enterFullscreen().catch(() => undefined);

  const orientation = window.screen.orientation as ScreenOrientation & {
    lock?: (mode: string) => Promise<void>;
  };
  if (typeof orientation?.lock === 'function') {
    void orientation.lock('portrait').catch(() => undefined);
  }
}

window.addEventListener(
  'pointerdown',
  () => {
    requestImmersiveMode();
  },
  { once: true },
);

await engine.start(createLoader());
await engine.goToScene('menu');
