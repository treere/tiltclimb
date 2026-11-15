import * as ex from 'excalibur';

/**
 * Every external image lives here, so renaming a file is a one-line change and the loader
 * cannot drift from the code that uses the assets.
 *
 * Assets: Kenney «Space Shooter Redux», CC0 1.0 — see public/assets/kenney/license.txt.
 */
const BASE = `${import.meta.env.BASE_URL}assets/kenney/`;

const image = (file: string): ex.ImageSource => new ex.ImageSource(`${BASE}${file}`);

export const shipImage = image('playerShip2_blue.png');
export const backgroundImage = image('darkPurple.png');

export const flameImages: ex.ImageSource[] = Array.from({ length: 10 }, (_, index) =>
  image(`fire${String(index).padStart(2, '0')}.png`),
);

export const meteorImages: ex.ImageSource[] = [
  image('meteorBrown_big1.png'),
  image('meteorBrown_big3.png'),
  image('meteorBrown_med1.png'),
  image('meteorBrown_small1.png'),
  image('meteorGrey_big1.png'),
  image('meteorGrey_big3.png'),
];

export const starImages: ex.ImageSource[] = [
  image('star1.png'),
  image('star2.png'),
  image('star3.png'),
];

export const enemyImages: ex.ImageSource[] = [
  image('enemyRed1.png'),
  image('enemyRed2.png'),
  image('enemyRed3.png'),
  image('enemyRed4.png'),
  image('enemyRed5.png'),
];

export const heroLaserImage = image('laserBlue01.png');
export const enemyLaserImage = image('laserRed01.png');

const allImages = [
  shipImage,
  backgroundImage,
  ...flameImages,
  ...meteorImages,
  ...starImages,
  ...enemyImages,
  heroLaserImage,
  enemyLaserImage,
];

/** Shared loader: nothing is drawn before these images are decoded. */
export function createLoader(): ex.Loader {
  return new ex.Loader(allImages);
}

/** Exhaust plume, 10 frames at 60 ms, looping. */
export function createFlameAnimation(): ex.Animation {
  return new ex.Animation({
    frames: flameImages.map((source) => ({ graphic: source.toSprite(), duration: 60 })),
    strategy: ex.AnimationStrategy.Loop,
  });
}
