# Spec Delta

## Purpose

Defines the look of the game: the story told on screen is a spaceship making its way through an asteroid field, and every visible surface (game, menu, background) must tell it consistently, with assets of known provenance and license.

## ADDED Requirements

### Requirement: The player is a spaceship with an animated trail

The player SHALL be represented by a spaceship sprite facing upwards, with an animated engine trail played continuously while the run is in progress. The trail MUST stop when the run ends.

#### Scenario: Spaceship in the run

- **WHEN** the run is in progress
- **THEN** the spaceship facing upwards is seen with the animated trail below the fuselage

#### Scenario: Trail stopped at the end of the run

- **WHEN** the run ends
- **THEN** the trail does not keep animating

### Requirement: The obstacles are asteroids

Every obstacle SHALL be represented by an asteroid sprite and MUST have a random initial orientation, so that two nearby obstacles do not look like the same object. The asteroids SHALL rotate slowly while they scroll.

#### Scenario: Two nearby asteroids

- **WHEN** two obstacles enter the field of view
- **THEN** they appear with silhouettes or orientations distinguishable from each other

#### Scenario: Rotation during the scrolling

- **WHEN** an asteroid crosses the screen
- **THEN** its rotation changes over time instead of staying fixed

### Requirement: Scrolling starfield

The background SHALL be a starfield that scrolls downwards while the player climbs, with at least two layers at different speeds to give depth. The background MUST always cover the whole visible area, without empty edges or perceptible seams during scrolling.

#### Scenario: Continuous scrolling

- **WHEN** the player climbs for a long stretch
- **THEN** the background scrolls without interruptions and without showing empty bands or cuts

#### Scenario: Depth

- **WHEN** the background scrolls
- **THEN** the farther elements move more slowly than the near ones

### Requirement: Menu consistent with the theme

The menu screen SHALL use the same visual universe as the run (starfield, spaceship, coherent colors) without losing the legibility of the calibration values and of the commands. The change of look MUST NOT alter the behavior of the menu defined by the `ui/start-menu` spec.

#### Scenario: Themed menu

- **WHEN** the game is opened
- **THEN** the menu shows a starfield and the player's spaceship, and reading, warnings and commands stay legible

### Requirement: Centered button labels

The text of a button SHALL stay centered relative to its own background regardless of the label length. A longer label MUST NOT move the background nor the text away from the center of the button.

#### Scenario: Long label

- **WHEN** the button shows a long label such as "Sensor unavailable"
- **THEN** the background stays in the expected position and the text stays centered on it

#### Scenario: Label change at runtime

- **WHEN** the label of a button is replaced while the menu is visible
- **THEN** the new text appears centered without position jumps of the background

### Requirement: Documented asset provenance and license

Every external graphic asset SHALL be accompanied in the repository by the original license file and SHALL be listed with author, license and provenance in a credits section of `README.md`. Assets of unknown or non-redistributable license MUST NOT be used.

#### Scenario: New asset added

- **WHEN** a new graphic file is introduced
- **THEN** its license is present in the repository and the credit is in the README

#### Scenario: Provenance check

- **WHEN** the repository is inspected offline
- **THEN** it is possible to reconstruct where each image comes from and under which license

### Requirement: The player sits in the lower part of the screen

The spaceship SHALL be positioned below the center of the screen, with more visible space ahead than behind, so that the user sees the asteroid field they are about to cross. The vertical position on screen SHALL stay stable for the whole run.

#### Scenario: Position at run start

- **WHEN** the run starts
- **THEN** the spaceship appears in the lower part of the screen and not in the center

#### Scenario: Stable position while climbing

- **WHEN** the spaceship climbs for a long stretch
- **THEN** it stays in the same vertical position on screen and the world scrolls under it

### Requirement: Menu buttons are themed

The buttons SHALL use the space palette (dark background, glowing border, light text) and SHALL visually distinguish the normal state from the pressed and the disabled ones, keeping the text contrast on each. The border MUST stay visible over the starfield.

#### Scenario: Button on starfield

- **WHEN** the menu shows the buttons over the starfield
- **THEN** the border of the buttons is distinguishable from the background and the text stays legible

#### Scenario: Pressed and disabled state

- **WHEN** the user presses a button or a button is disabled
- **THEN** the appearance changes recognizably and the text stays legible
