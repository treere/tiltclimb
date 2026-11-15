# presentation/loading Specification

## Purpose
Defines what you see while the game loads: a screen consistent with the theme, with real progress, that does not flicker on fast connections and does not depend on the assets it is loading.

## Requirements

### Requirement: Themed loading screen

During loading the system SHALL show a screen drawn with the game's palette and visual language: a moving starfield and two spaceships chasing each other. The screen MUST NOT depend on images, sounds or fonts that are part of the loading itself.

#### Scenario: Game start

- **WHEN** the game opens and the assets are not ready yet
- **THEN** the themed screen with the chasing ships is visible, not the engine's default screen

#### Scenario: Assets not available yet

- **WHEN** the screen is visible and the game images are not loaded yet
- **THEN** the screen still works, because it draws with primitives only

### Requirement: Real progress

The screen SHALL show a progress bar proportional to the assets actually loaded, accompanied by the percentage value. The bar MUST NOT advance in a fake or time-based way.

#### Scenario: Progress

- **WHEN** the assets are loaded progressively
- **THEN** the bar and the percentage grow accordingly and reach 100% only when loading is complete

#### Scenario: Slow connection

- **WHEN** loading proceeds slowly
- **THEN** the bar lags behind consistently with what is left, without jumping forward on its own

### Requirement: Minimum duration and fade

The screen SHALL stay visible for at least about seven hundred milliseconds even if loading finishes earlier, and SHALL exit with a short fade instead of a hard cut.

#### Scenario: Instant loading

- **WHEN** the assets are already cached and loading takes a few milliseconds
- **THEN** the screen stays visible for the minimum time and then fades, without flickering

#### Scenario: Exit towards the menu

- **WHEN** loading is complete and the minimum time has elapsed
- **THEN** the game moves to the menu with a fade, not a cut

### Requirement: Respect for motion preferences

If the system reports a preference for less animation, the screen SHALL stay readable without moving elements, keeping the bar and the percentage.

#### Scenario: Reduced motion requested

- **WHEN** the device declares `prefers-reduced-motion`
- **THEN** ships and stars are still and the bar keeps showing progress
