import * as ex from 'excalibur';
import { BIOMES } from './biomes';
import { ARCHETYPE_ORDER, ARCHETYPES, type EnemyKind } from './enemy-archetypes';

/**
 * Every external image lives here, so renaming a file is a one-line change and the loader
 * cannot drift from the code that uses the assets.
 *
 * Assets: Kenney «Space Shooter Redux», CC0 1.0 — see public/assets/kenney/license.txt.
 */
const BASE = `${import.meta.env.BASE_URL}assets/kenney/`;

const image = (file: string): ex.ImageSource => new ex.ImageSource(`${BASE}${file}`);

export const shipImage = image('playerShip2_blue.png');
/** Same hull, amber: the powered state. Derived by scripts/make-ship-variant.py. */
export const shipPoweredImage = image('playerShip2_amber.png');
/** The pickup: an existing star sprite, no new art. */
export const pickupImage = image('star3.png');
export const backgroundImage = image('darkPurple.png');

/** One background per biome, derived from the same CC0 texture by scripts/make-biome-backgrounds.py. */
export const biomeBackgrounds: Record<string, ex.ImageSource> = Object.fromEntries(
  // The first biome is the texture we already ship: reuse the source rather than loading it twice.
  BIOMES.map((biome) => [
    biome.id,
    biome.background === 'darkPurple.png' ? backgroundImage : image(biome.background),
  ]),
) as Record<string, ex.ImageSource>;

/** The background of a biome id, falling back to the base texture. */
export function backgroundFor(biomeId: string): ex.ImageSource {
  return biomeBackgrounds[biomeId] ?? backgroundImage;
}

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

/** One sprite per archetype: shape and colour are the signature the player learns to read. */
export const archetypeImages = Object.fromEntries(
  ARCHETYPE_ORDER.map((kind) => [kind, image(ARCHETYPES[kind].spriteFile)]),
) as Record<EnemyKind, ex.ImageSource>;

export const heroLaserImage = image('laserBlue01.png');
export const enemyLaserImage = image('laserRed01.png');

const allImages = [
  shipImage,
  shipPoweredImage,
  pickupImage,
  backgroundImage,
  ...Object.values(biomeBackgrounds),
  ...flameImages,
  ...meteorImages,
  ...starImages,
  ...Object.values(archetypeImages),
  heroLaserImage,
  enemyLaserImage,
];

/** Every image the game needs, for the single shared loader. */
export function imageSources(): ex.ImageSource[] {
  return allImages;
}

/** Exhaust plume, 10 frames at 60 ms, looping. */
export function createFlameAnimation(): ex.Animation {
  return new ex.Animation({
    frames: flameImages.map((source) => ({ graphic: source.toSprite(), duration: 60 })),
    strategy: ex.AnimationStrategy.Loop,
  });
}
