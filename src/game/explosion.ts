import * as ex from 'excalibur';

const BASE = `${import.meta.env.BASE_URL}assets/effects/explosion/`;

const VARIANTS = ['blast-1', 'blast-2', 'blast-3', 'blast-4'] as const;
const FRAME_COUNT = 24;
const FRAME_MS = 42;
const POOL_SIZE = 8;

export type BlastVariant = (typeof VARIANTS)[number];

const frameSources: ex.ImageSource[][] = VARIANTS.map((variant) =>
  Array.from(
    { length: FRAME_COUNT },
    (_, index) =>
      new ex.ImageSource(`${BASE}${variant}/frame_${String(index).padStart(2, '0')}.png`),
  ),
);

/** Flat list for the shared loader. */
export function createExplosionSources(): ex.ImageSource[] {
  return frameSources.flat();
}

type Slot = { actor: ex.Actor; remaining: number; scale: number };

/**
 * Fixed pool of explosion animations. `burst()` reuses a free slot, so a kill never allocates
 * and two explosions in the same frame both show up instead of overwriting each other.
 */
export class ExplosionPool {
  private readonly scene: ex.Scene;
  private readonly animations: ex.Animation[];
  private readonly slots: Slot[] = [];

  constructor(scene: ex.Scene) {
    this.scene = scene;
    this.animations = frameSources.map(
      (sources) =>
        new ex.Animation({
          frames: sources.map((source) => ({ graphic: source.toSprite(), duration: FRAME_MS })),
          strategy: ex.AnimationStrategy.Freeze,
        }),
    );

    for (let index = 0; index < POOL_SIZE; index++) {
      const actor = new ex.Actor({ name: 'explosion', z: 40 });
      actor.graphics.isVisible = false;
      this.scene.add(actor);
      this.slots.push({ actor, remaining: 0, scale: 1 });
    }
  }

  /** Plays one blast at world coordinates. `variant` picks which sheet to use. */
  burst(x: number, y: number, variant: number, scale = 1): void {
    const slot = this.slots.find((candidate) => candidate.remaining <= 0) ?? this.slots[0];
    if (!slot) {
      return;
    }

    const animation = this.animations[variant % this.animations.length];
    if (!animation) {
      return;
    }

    slot.actor.pos = ex.vec(x, y);
    slot.actor.scale = ex.vec(scale, scale);
    slot.actor.graphics.use(animation);
    slot.actor.graphics.isVisible = true;
    slot.scale = scale;
    slot.remaining = FRAME_COUNT * FRAME_MS;

    animation.reset();
    animation.play();
  }

  /** Frees finished blasts. Call once per update. */
  tick(elapsedMs: number): void {
    for (const slot of this.slots) {
      if (slot.remaining <= 0) {
        continue;
      }
      slot.remaining -= elapsedMs;
      if (slot.remaining <= 0) {
        slot.actor.graphics.isVisible = false;
      }
    }
  }
}
