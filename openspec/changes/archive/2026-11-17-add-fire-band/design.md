# Design

## Context

See `proposal.md`. Today `InputRouter` registers pointer handlers on the engine and:

- on `down`, compares `event.screenPos.y` with `dragStartLimit` (set by the scene to just above the
  fire button) to decide whether the touch may steer;
- on `move`, accumulates `event.screenPos.x` deltas;
- on `up`, clears the dragging flag. Nothing fires from the pointer: only the button's own `onPress`
  calls `fireHero()`.

The fire button is a `Button` at the bottom centre, 200×84, whose `onPress` calls `fireHero()`.
`fireHero()` already refuses when the run is over, paused, leaving, or the cannon is jammed, and adds
heat and plays the sound otherwise.

## Goals / Non-Goals

**Goals:** tap anywhere in the bottom band to fire; a drag still steers; one tap, one shot; the button
keeps working and looking the same.

**Non-Goals:** auto-fire on hold, highlights, firing from the play area, heat or rate changes.

## Decisions

### 1. A pure `TapGesture`, decided on release

```ts
export const TAP_SLOP_PX = 12;
export const TAP_MAX_MS = 300;

export class TapGesture {
  begin(x: number, y: number, now: number): void;
  move(x: number, y: number): void;      // accumulates travel
  end(now: number): boolean;             // true when it was a tap
  cancel(): void;
}
```

Deciding on release and not on press is the whole point: the band is used for steering too, so firing
on press would fire on every steering gesture that starts low. 12 px is above thumb jitter and well
below a deliberate drag; 300 ms stops a slow press from becoming a shot at the moment the finger
lifts.

Pure and time-injected, so the four cases — tap, short drag, long press, cancelled — are a Node test
instead of a Playwright session.

### 2. The band is a height in logical pixels, not a fraction

`FIRE_BAND_HEIGHT = 220` from the bottom of the 1280 px world, which is above the 200 px the button
occupies and leaves the play area intact. A fraction would change with the phone; a logical height
means the same band on every device, which is what the finger learns.

### 3. One tap cannot fire twice

The button sits inside the band, so a tap on it would reach both the `Button` and the band. The band
therefore ignores taps whose position falls inside the button's rectangle; the button keeps its own
handler and its pressed feedback. The alternative — dropping `onPress` and letting the band do
everything — would make the button inert to the eye, which is worse.

### 4. Coordinates: page position against the canvas rectangle

Excalibur's `screenPos` drifts with the camera (measured earlier in this project: the same physical tap
reported y = 56 then y = −84 as the world scrolled), which makes it useless for a fixed band and
already makes the drag limit unreliable deeper into a run. The router converts
`event.pagePos` against `engine.canvas.getBoundingClientRect()` into resolution coordinates, the same
way the pause control does:

```ts
const rect = this.engine.canvas.getBoundingClientRect();
const scale = this.engine.screen.resolution.width / rect.width;
const x = (event.pagePos.x - rect.left) * scale;
const y = (event.pagePos.y - rect.top) * scale;
```

Both the drag limit and the band use these values, so they agree with what the player sees.

### 5. The scene only subscribes

`inputRouter.onFireTap(() => this.fireHero())`. Every existing guard — run over, paused, jammed,
150 ms between shots — stays in `fireHero`, so the band cannot bypass anything.

## Risks / Trade-offs

- **Accidental shots while steering low** → the slop and the release-time decision; a drag of 12 px is
  already a drag.
- **Double shot on the button** → the band excludes the button rectangle, checked by a probe on the
  three positions.
- **Coordinate change alters drag feel** → tested at level 1 and at a deep level, where the drift was
  worst.
- **Band too tall** → 220 px of 1280 is 17% of the screen; the ship sits at 72% of the height, so the
  band starts below it.
