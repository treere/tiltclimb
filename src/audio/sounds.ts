import * as ex from 'excalibur';
import type { EnemyKind } from '../game/enemy-archetypes';
import { audio } from './audio';

/**
 * Every audio file the game uses, built once and loaded through the shared loader so the first
 * shot never waits for a decode. Assets: Kenney-free CC0 packs, see public/assets/audio/LICENSE.md.
 */
const BASE = `${import.meta.env.BASE_URL}assets/audio/`;

const sound = (file: string): ex.Sound => new ex.Sound(`${BASE}${file}`);

export const musicSounds = {
  menu: sound('music-menu.ogg'),
  game: sound('music-game.ogg'),
};

export const effectSounds = {
  'shot-hero': sound('shot-hero.ogg'),
  'shot-patrol': sound('shot-patrol.ogg'),
  'shot-diver': sound('shot-diver.ogg'),
  'shot-hunter': sound('shot-hunter.ogg'),
  'shot-ufo': sound('shot-ufo.ogg'),
  'kill-patrol': sound('kill-patrol.ogg'),
  'kill-diver': sound('kill-diver.ogg'),
  'kill-hunter': sound('kill-hunter.ogg'),
  'kill-ufo': sound('kill-ufo.ogg'),
  'death-hero': sound('death-hero.ogg'),
  'death-impact': sound('death-impact.ogg'),
  lose: sound('lose.ogg'),
  record: sound('record.ogg'),
} as const;

export type SfxKey = keyof typeof effectSounds;

/** One timbre per archetype: the ships are recognisable with your eyes closed. */
export const SHOT_BY_KIND: Record<EnemyKind, SfxKey> = {
  patrol: 'shot-patrol',
  diver: 'shot-diver',
  hunter: 'shot-hunter',
  ufo: 'shot-ufo',
};

export const KILL_BY_KIND: Record<EnemyKind, SfxKey> = {
  patrol: 'kill-patrol',
  diver: 'kill-diver',
  hunter: 'kill-hunter',
  ufo: 'kill-ufo',
};

let attached = false;

/** Registers the sounds with the audio front door. Idempotent. */
export function attachAudio(): void {
  if (attached) {
    return;
  }
  attached = true;

  audio.attachMusic('menu', musicSounds.menu);
  audio.attachMusic('game', musicSounds.game);
  audio.attachEffects(new Map(Object.entries(effectSounds) as [SfxKey, ex.Sound][]));
}

/** Loader that carries music and effects alongside the images. */
export function createAudioLoader(): ex.Loader {
  attachAudio();
  return new ex.Loader([...Object.values(musicSounds), ...Object.values(effectSounds)]);
}
