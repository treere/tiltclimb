# presentation/space-theme Specification

## Purpose
Defines the look of the game: the story told on screen is a spaceship making its way through an asteroid field, and every visible surface (game, menu, background) must tell it consistently, with assets of known origin and license.

## Requirements

### Requirement: The player is a spaceship with an animated trail

The player SHALL be represented by a spaceship sprite oriented upward, with an animated engine trail played continuously while the run is in progress. The trail MUST stop when the run ends.

#### Scenario: Spaceship in the run

- **WHEN** the run is in progress
- **THEN** the spaceship is visible oriented upward with the animated trail below the fuselage

#### Scenario: Trail stopped at the end of the run

- **WHEN** the run ends
- **THEN** the trail no longer keeps animating

### Requirement: The obstacles are asteroids

Every obstacle SHALL be represented by an asteroid sprite and MUST have a random initial orientation, so that two nearby obstacles do not look like the same object. The asteroids SHALL rotate slowly while they scroll.

#### Scenario: Two nearby asteroids

- **WHEN** two obstacles enter the field of view
- **THEN** they appear with shapes or orientations distinguishable from each other

#### Scenario: Rotation while scrolling

- **WHEN** an asteroid crosses the screen
- **THEN** its rotation changes over time instead of staying fixed

### Requirement: Scrolling starfield

The background SHALL be a starfield scrolling downward while the player climbs, with at least two layers at different speeds to give depth. The background MUST always cover the whole visible area, with no empty edges or visible seams while scrolling. The near layer — the background tiles — MUST travel at a meaningful fraction of the climb speed, at least half of it, so the climb reads as fast motion instead of a slow drift.

#### Scenario: Continuous scrolling

- **WHEN** the player climbs for a long stretch
- **THEN** the background scrolls without interruptions and without showing empty bands or cuts

#### Scenario: Depth

- **WHEN** the background scrolls
- **THEN** the farther elements move more slowly than the near ones

#### Scenario: Sense of speed

- **WHEN** a run starts, with the climb at its initial speed
- **THEN** the near background layer moves at no less than half the climb speed, and it accelerates with it

### Requirement: Menu consistent with the theme

The menu screen SHALL use the same visual universe as the run (starfield, spaceship, consistent colors) without losing readability of the calibration values and the commands. The change of look MUST NOT alter the menu behaviour defined by the `ui/start-menu` spec.

#### Scenario: Themed menu

- **WHEN** the game is opened
- **THEN** the menu shows a starfield and the player's spaceship, and the reading, warnings and commands stay readable

### Requirement: Centered button labels

A button's text SHALL stay centered on its own background regardless of the label length. A longer label MUST NOT move the background or push the text off the center of the button.

#### Scenario: Long label

- **WHEN** the button shows a long label such as "Sensor unavailable"
- **THEN** the background stays in the expected position and the text stays centered on it

#### Scenario: Label change at runtime

- **WHEN** a button's label is replaced while the menu is visible
- **THEN** the new text appears centered without the background shifting position

### Requirement: Documented asset origin and license

Every external asset, graphic, audio or of any other kind, SHALL be accompanied in the repository by the original license file or an equivalent license note, and SHALL be listed with author, license and origin in a credits section of the `README.md`. Assets of unknown or non-redistributable license MUST NOT be used.

#### Scenario: New asset added

- **WHEN** a new graphic or audio file is introduced
- **THEN** its license is present in the repository and the credit is in the README

#### Scenario: Origin check

- **WHEN** the repository is inspected without network access
- **THEN** it is possible to reconstruct where every image and every sound comes from, and under which license

### Requirement: The player sits in the lower part of the screen

The spaceship SHALL be positioned below the center of the screen, with more visible space ahead of it than behind, so that the user sees the asteroid field it is about to cross. The vertical position on screen SHALL stay stable for the whole run.

#### Scenario: Position at the start of the run

- **WHEN** the run starts
- **THEN** the spaceship appears in the lower part of the screen, not in the center

#### Scenario: Stable position while climbing

- **WHEN** the spaceship climbs for a long stretch
- **THEN** it stays in the same vertical position on screen and the world scrolls beneath it

### Requirement: The menu buttons are themed

The buttons SHALL use the space palette with an **opaque** background, a marked luminous border and light text, and SHALL visually distinguish the normal state from the pressed and the disabled ones. The background MUST be opaque, so that the starfield does not show through under the label, and the contrast between text and background SHALL be at least 7:1 in every state.

#### Scenario: Button over a starfield

- **WHEN** the menu shows the buttons over the starfield
- **THEN** the background is opaque, the border is distinguishable from the background and the text has a contrast of at least 7:1

#### Scenario: Pressed and disabled state

- **WHEN** the user presses a button or a button is disabled
- **THEN** the look changes recognizably and the text contrast stays at least 7:1

### Requirement: Readable text over the animated background

The text of the menu, of the HUD and of the credits page SHALL stay readable over the starfield, using a shadow or an outline behind the text when the background is not opaque, and a minimum size such that it can be read without effort on a phone screen.

#### Scenario: HUD over the stars

- **WHEN** the score is shown over the starfield during the run
- **THEN** the digits stay readable while the background scrolls

#### Scenario: Credits page text

- **WHEN** the credits page shows the story
- **THEN** the lines are readable without ambiguity and the text wraps instead of running off the screen

### Requirement: Collisions are animated

When an enemy ship is shot down or the hero dies, the system SHALL show a frame-by-frame explosion animation at the point of impact, short and without blocking the game. Asteroids, immune to shots, MUST NOT explode.

#### Scenario: Enemy ship shot down

- **WHEN** a hero shot destroys an enemy ship
- **THEN** an animated explosion appears in its place and fades out by itself

#### Scenario: Hero death

- **WHEN** the hero is hit
- **THEN** a larger explosion appears and the run ends

#### Scenario: Asteroid hit

- **WHEN** a shot passes through an asteroid
- **THEN** no explosion appears
