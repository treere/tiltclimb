# Design

## Context

See `proposal.md`. Today, in `climb-scene.ts`:

- `fireHero()` guards on running, paused and leaving, then on `SHOT_MIN_INTERVAL_MS = 150` against
  `lastShotAt`, plays the sound and spawns one projectile at `HERO_SHOT_SPEED = 620`.
- `setFireEnabled()` is the only thing that touches the button state; it is called at the start of a
  run, at the end of a run, and from `setPaused`.
- The fire button is a `Button` (canvas-drawn) with `setLabel` and `setEnabled`.
- Enemies spawn every `ENEMY_SPAWN_INTERVAL_MS = 3500`, die to one hit, and the alive limit grows
  from 2 to 4 with the level.

## Goals / Non-Goals

**Goals:** firing costs something; the cost is legible and recoverable; spraying is punished without
making the cannon useless.

**Non-Goals:** upgrades, special shots, sound for the cooldown, damage from overheating, new weapons.

## Decisions

### 1. Heat is a pure module

```ts
// src/game/weapon-heat.ts
export const HEAT_MAX = 100;
export const HEAT_PER_SHOT = 30;      // four quick shots to a jam
export const COOL_PER_SECOND = 30;    // a full cooldown takes ~3.3 s
export const RESET_HEAT = 35;         // fires again at or below this: ~2.2 s from a jam

export type HeatState = { heat: number; jammed: boolean };

export function heatAfterShot(state: HeatState): HeatState;   // adds, clamps, sets jammed
export function heatAfterCooling(state: HeatState, dtMs: number): HeatState;
export function canFire(state: HeatState): boolean;
```

Purity matters here for the same reason as `levels.ts` and `records.ts`: the interesting part is the
transition — when the jam ends, what happens if a tap arrives on the same frame as the reset — and it
is far easier to check as a function than through the button.

**Jam logic in one sentence**: a shot that would push the heat to the maximum is allowed and sets
`jammed`; while jammed, shots are refused and do not add heat; cooling clears `jammed` when the heat
drops to `RESET_HEAT`. That means tapping while jammed cannot slow the recovery, which is the obvious
bug of a naive implementation that adds heat before checking.

### 2. Numbers and why

- **30 per shot, max 100**: four shots in a row, which is one more than the two-to-three ships that can
  be alive early, so a careful player never jams unless the pressure rises. With the 150 ms guard, four
  shots take ~0.45 s. It is 30 and not 25 because the cannon also cools *between* shots: at 25 four
  rapid shots peak at 86 and never jam, which would have made the whole mechanic invisible except to
  someone hammering the button.
- **30 per second**: cooling from a jam to the reset threshold takes (100 − 35) / 30 ≈ 2.2 s, and a
  full cool from 35 to 0 another ~1.2 s. Short enough to stay in the fight, long enough that spraying
  through a wave is a real loss.
- **Reset at 35**: firing again at 35 means two more shots before the next jam, so the cadence after a
  jam is a rhythm of short bursts, not a single shot every three seconds.

### 3. One function decides the fire control

Three reasons can disable the button — paused, run over, cannon jammed — and they used to be spread
over three call sites. They collapse into:

```ts
private refreshFireState(): void {
  const available = this.running && !this.paused && !this.heat.jammed;
  this.fireButton.setEnabled(available);
  this.fireButton.setLabel(this.heat.jammed ? 'COOLING' : 'FIRE');
  this.heatBar.setValue(this.heat.heat / HEAT_MAX, this.heat.jammed);
}
```

Called after a shot, after a cooling step, on pause, at the start and at the end of the run.

### 4. Heat bar above the button

A new `src/ui/heat-bar.ts`: a thin `ex.Canvas` (140 × 12) drawn as a rounded track with a fill, placed
24 px above the fire button, colour interpolating from cyan (`#7fd4ff`) to amber (`#ffb86b`) to red
(`#ff6b6b`) when jammed. Canvas, like the buttons, because a shape-based bar would need anchoring
again; the project already learned that lesson twice.

### 5. Cooling follows the game's clock, not the wall clock

`heatAfterCooling(state, elapsed)` is called from `onPreUpdate`, which already returns early while
paused and after the run ends. So the heat freezes with everything else, and the spec says so.

### 6. Reset at run start

`startRun()` sets `heat = { heat: 0, jammed: false }` and calls `refreshFireState()`. Whatever a
previous run ended with is irrelevant.

## Risks / Trade-offs

- **Cannon feels useless against several ships** → four shots per burst and a 2.2 s recovery; if it is
  too punishing, `COOL_PER_SECOND` is the first knob, not `HEAT_PER_SHOT`.
- **Tapping while jammed delays recovery** → prevented by refusing the shot before adding heat, and
  covered by a probe.
- **Bar and button disagree** → both are written by `refreshFireState`, one place.
- **Overheat during a boss-like moment** → no bosses yet; the level ramp increases pressure gradually,
  so the player learns the rhythm early.
- **Heat bar overlapping the ship** → it sits above the fire button at the bottom, 24 px of gap,
  checked on a 360 px wide screen.
