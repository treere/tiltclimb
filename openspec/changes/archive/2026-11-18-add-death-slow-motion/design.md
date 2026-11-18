# Design

## Context

See `proposal.md`. Today `endRun()` does three things at once: it sets `running = false`, bursts the
explosion, and arms a 500 ms timer that goes to the menu. `onPreUpdate` returns immediately when
`!this.running`, so the blast is frozen on its first frame and the starfield stops dead — the death is
a freeze-frame, not a slowdown.

`engine.timescale` exists in Excalibur 1.0.1 and scales the elapsed time handed to `update` and
`onPreUpdate`. Our own timers (`setTimeout`) are wall-clock and unaffected, which is what the beat
needs.

## Goals / Non-Goals

**Goals:** a short, readable deceleration; nothing gained during it; time always restored.

**Non-Goals:** slow motion on kills, camera effects, post-processing, a configurable duration.

## Decisions

### 1. A `dying` phase between running and gone

```ts
private dying = false;
private dyingStartedAt = 0;
```

`endRun()` sets `running = false`, `dying = true`, records `performance.now()`, and applies
`engine.timescale = DEATH_TIMESCALE`. `onPreUpdate` gains a branch before its early return:

```ts
if (this.dying) {
  this.player.vel.y = -this.speed;          // the ship keeps drifting, so the world creeps
  this.starfield.update(elapsed, this.speed);
  this.explosions.tick(elapsed / DEATH_TIMESCALE);  // the blast keeps its own speed
  return;                                   // no spawns, no collisions, no score
}
if (!this.running) return;
```

The blast is ticked with the real elapsed time, not the scaled one. At a quarter speed a 960 ms
explosion would show about one frame inside a 400 ms beat — indistinguishable from the old freeze. So
the world crawls and the explosion plays normally: the contrast is what reads as slow motion.

The alternative — leaving `running` true and gating each system individually — would have touched every
`if (!this.running)` in the file and risked a spawn or a point slipping through during the beat.

### 2. The beat is timed on the wall clock, and the exit timer closes it

`DEATH_SLOWMO_MS = 400`, `DEATH_TIMESCALE = 0.25`. The existing exit timer stays at
`EXIT_DELAY_MS = 500`: at 400 ms it restores `engine.timescale = 1` (the last 100 ms run at normal
speed, so the transition is not a jump straight into the menu), and at 500 ms it changes scene. Both
are wall-clock timers, so a phone that drops frames cannot stretch the beat.

### 3. Three restore points, because a stuck timescale would poison the next run

`engine.timescale = 1` is applied:

1. inside the exit timer, before `goToScene('menu')`;
2. in `onDeactivate`, for any other way the scene is left;
3. in the existing `visibilitychange` handler, when the page is hidden mid-beat.

The third one matters because browsers throttle timers in background tabs: the exit timer may fire late
or not at all, and the scene must not be found crawling when the player comes back.

### 4. What the beat does *not* touch

`endRun` still zeroes the ship's velocity and releases enemies and projectiles; the dying branch gives
the ship back a drift equal to the climb speed, which at a quarter speed is a slow creep upward. The
obstacles do not tick and are not recycled, so they simply slide by under the drifting camera. Nothing
is evaluated for collisions, nothing spawns, nothing scores.

### 5. Sting timing

The verdict sting is armed at 420 ms, inside the beat. It will be heard over the still-running blast,
which may read as clutter: keep it there for the first test and move it to 520 ms if the two fight.

## Risks / Trade-offs

- **Timescale left behind** → three restore points; a browser check plays a death, starts a second run
  and reads `engine.timescale` and the scroll speed.
- **Beat too long or too short** → 400 ms of 0.25 is roughly ten frames at 60 fps: enough to see the
  first frames of the blast, short enough not to feel like a cutscene. Tuned by hand on the phone.
- **Explosion cut even earlier** → the blast already runs longer than the old 500 ms exit; slow motion
  makes it visible for less of its length. Accept it, or lengthen `EXIT_DELAY_MS` if it looks abrupt.
- **`timescale` also scales the UI animations** → the pause toggle and HUD are static during a run, so
  nothing visible is affected.
- **The blast ends inside the beat** → ticked at real speed, a 960 ms explosion outlives the 400 ms
  beat and is cut by the menu. If it looks abrupt, raise `EXIT_DELAY_MS`, not the timescale.
