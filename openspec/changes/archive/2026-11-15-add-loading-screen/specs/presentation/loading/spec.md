# Spec Delta

## Purpose

Defines what is seen while the game loads: a screen consistent with the theme, with real progress, that does not flash on fast connections and does not depend on the assets it is loading.

## ADDED Requirements

### Requirement: Themed loading screen

During loading the system SHALL show a screen drawn with the game's palette and visual language: moving starfield and two spaceships chasing each other. The screen MUST NOT depend on images, sounds or fonts that are part of the loading itself.

#### Scenario: Game startup

- **WHEN** the game opens and the assets are not ready yet
- **THEN** the themed screen with the ships chasing each other is seen, not the engine's default screen

#### Scenario: Assets not available yet

- **WHEN** the screen is visible and the game images are not loaded yet
- **THEN** the screen works anyway, because it draws only with primitives

### Requirement: Real progress

The screen SHALL show a progress bar proportional to the assets actually loaded, accompanied by the percentage value. The bar MUST NOT advance in a fake or timed way.

#### Scenario: Advancement

- **WHEN** the assets are loaded progressively
- **THEN** the bar and the percentage grow accordingly and reach 100% only when loading is complete

#### Scenario: Slow connection

- **WHEN** loading proceeds slowly
- **THEN** the bar stays behind consistently with how much is missing, without jumping ahead on its own

### Requirement: Minimum duration and fade

The screen SHALL stay visible for at least about seven hundred milliseconds even if loading ends earlier, and SHALL exit with a short fade instead of an abrupt cut.

#### Scenario: Instant loading

- **WHEN** the assets are already in cache and loading takes a few milliseconds
- **THEN** the screen stays visible for the minimum time and then fades, without flashing

#### Scenario: Exit towards the menu

- **WHEN** loading is finished and the minimum time has elapsed
- **THEN** the game moves to the menu with a fade, not with a cut

### Requirement: Respect for motion preferences

If the system reports a preference for fewer animations, the screen SHALL stay legible without moving elements, keeping bar and percentage.

#### Scenario: Fewer animations requested

- **WHEN** the device declares `prefers-reduced-motion`
- **THEN** ships and stars are still and the bar keeps showing progress
