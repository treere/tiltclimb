import * as ex from 'excalibur';
import { audio } from './audio/audio';
import { attachAudio, effectSounds, musicSounds } from './audio/sounds';
import { ClimbScene } from './game/climb-scene';
import { BACKGROUND_COLOR, WORLD_HEIGHT, WORLD_WIDTH } from './game/constants';
import { CreditsScene } from './game/credits-scene';
import { createExplosionSources } from './game/explosion';
import { MenuScene } from './game/menu-scene';
import { imageSources } from './game/sprites';
import { ThemedLoader } from './ui/loading-screen';

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
engine.add('credits', new CreditsScene());

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
    audio.unlock();
  },
  { once: true },
);

window.addEventListener('keydown', () => audio.unlock(), { once: true });

attachAudio();

const loader = new ThemedLoader([
  ...imageSources(),
  ...Object.values(musicSounds),
  ...Object.values(effectSounds),
  ...createExplosionSources(),
]);

// The loader paints its own screen while it works; `show()` holds the minimum on-screen time
// and fades out, so the menu never appears underneath a half-drawn loading screen.
(window as unknown as { __loader?: unknown }).__loader = loader;
await engine.start(loader);
await loader.show();
await engine.goToScene('menu');

// Handle for the visual smoke test (and for debugging on a phone): harmless in production.
(window as unknown as { __game?: typeof engine }).__game = engine;
