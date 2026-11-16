# Design

## Context

See `proposal.md`. Relevant facts from the code:

- `ClimbScene.onPreUpdate` drives everything: climb speed, starfield, spawning, collisions, score.
  It already returns early when `!this.running`.
- Actors move because Excalibur integrates their velocity every frame; returning early from
  `onPreUpdate` does **not** stop that integration.
- The scene has `onActivate` / `onDeactivate` hooks, and `AudioToggle` is the model for a round
  icon button (96 px touch area, `ex.Canvas`, hand-drawn icon, `pointerup` handler).
- `GraphicsComponent` starts visible. This is what broke the first attempt: the overlay was created
  and never explicitly hidden, so the first run opened with the cover drawn over a live world.

## Goals / Non-Goals

**Goals:** a run can be interrupted and resumed, nothing advances while paused, and a run always
starts running.

**Non-Goals:** records, haptics, slow motion, tap to shoot, lives, settings behind the pause.

## Decisions

### 1. Pause is scene state, applied to the UI in one place

`paused` is a boolean on the scene, and a single private method owns the visible consequences:

```ts
private setPaused(paused: boolean): void {
  const next = paused && this.running;
  const changed = next !== this.paused;
  this.paused = next;
  if (changed) this.paused ? this.freeze() : this.thaw();
  this.applyPauseVisibility(this.paused);   // overlay, PAUSED text, RESUME button
  this.pauseToggle.setPaused(this.paused);  // icon switches to a play triangle
  this.setFireEnabled(this.running && !this.paused);
}
```

Everything that reflects the state goes through here, so there is no path that changes `paused`
without also fixing the overlay. The early-return-on-same-value bug from the first attempt (the
overlay staying visible because the state was already `false`) is designed out by always applying
the UI, not only on change.

### 2. Freeze the velocities, not the clock

`engine.clock.stop()` would freeze everything including the render loop, and the pause overlay
would never be drawn: the player would see the last frame with no way to resume. So the clock keeps
running and the scene freezes by hand:

- `onPreUpdate` returns early while paused: no scroll, no spawn accumulator, no projectile
  integration of the game's own logic, no score, no `resolveHits` — a ship overlapping an asteroid
  while paused does not die.
- Excalibur's own integration is stopped by zeroing velocities: the player, every active projectile
  and every active enemy, with the original vectors stored so they can be put back on resume.

`freeze()` / `thaw()` are the only two places that touch velocities, and `thaw()` also restores the
authoritative climb speed, which may have changed while paused.

### 3. Overlay as three explicitly toggled elements

A full-screen `ScreenElement` plate at 0.82 opacity, a `UiText` saying `PAUSED`, and a `Button`
saying `RESUME`, all added to the scene above the HUD and all set to `graphics.isVisible = false` in
`onInitialize`. One private `applyPauseVisibility(visible)` flips the three, so there is exactly one
line of code that decides whether the cover is on screen.

Resuming is the `RESUME` button or the corner control — never a tap anywhere on the cover. That
was the second bug in a row: Excalibur dispatches the same `pointerup` to **every** actor under the
finger, so a full-screen overlay listening for taps paused on the corner control and unpaused in the
same instant, and the game never stopped. The control toggles, its icon becomes a play triangle, and
there is exactly one handler per intent.

### 4. Auto-pause on a hidden page, never auto-resume

A `visibilitychange` listener is added in `onActivate` and removed in `onDeactivate`: leaving the
run for the menu must not leave a handler behind, or the second run reacts twice. Coming back to a
running game is how runs get lost, so the return only shows the overlay again.

### 5. Nothing persists

The pause state lives and dies with the run. No storage, no settings, nothing to migrate, and
nothing that can be left in a broken state by a failed write.

## Risks / Trade-offs

- **Overlay visible at start** (happened) → explicit `isVisible = false` at creation plus the
  "run starts unpaused" requirement and a regression check as the first task.
- **A frozen world that still integrates** → velocities are zeroed explicitly; the check compares
  the ship's position over dozens of frames, not just the flag.
- **Slow motion or another feature leaving `timescale` altered** → not in scope here; the pause does
  not touch `timescale` at all.
- **Pause control overlapping the score** → the score sits top left, the control top right, 56 px
  from the safe area; verified on a 360 px wide screen.

## Migration Plan

No data. The pause is a scene behaviour: reverting it is deleting the overlay, the control and the
listener.
