# Spec Delta

## MODIFIED Requirements

### Requirement: Menu buttons are themed

The buttons SHALL use the space palette with an **opaque** background, a pronounced bright border and light text, and SHALL visually distinguish the normal state from the pressed and the disabled ones. The background MUST be opaque, so that the starfield does not pass under the label, and the contrast between text and background SHALL be at least 7:1 in every state.

#### Scenario: Button on starfield

- **WHEN** the menu shows the buttons over the starfield
- **THEN** the background is opaque, the border is distinguishable from the background and the text has a contrast of at least 7:1

#### Scenario: Pressed and disabled state

- **WHEN** the user presses a button or a button is disabled
- **THEN** the appearance changes recognizably and the text contrast stays at least 7:1

## ADDED Requirements

### Requirement: Legible texts over the animated background

The menu, HUD and credits page texts SHALL stay legible over the starfield, using a shadow or an outline behind the text when the background is not opaque, and a minimum size such that they can be read without effort on a phone screen.

#### Scenario: HUD over the stars

- **WHEN** the score is shown over the starfield during the run
- **THEN** the digits stay legible while the background scrolls

#### Scenario: Credits page text

- **WHEN** the credits page shows the story
- **THEN** the lines are legible without ambiguity and the text wraps instead of going off screen
