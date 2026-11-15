# Spec Delta

## MODIFIED Requirements

### Requirement: Menu as the first state of the application

On page open the system SHALL show the menu, with the game title, the calibration reading and the commands **Calibrate**, **Start game** and **CREDITS**. The run MUST NOT start without an explicit command from the user. The menu MUST be usable both from a phone and from a desktop, and the three commands MUST stay visible without overlapping each other or the spaceship illustration.

#### Scenario: Page open

- **WHEN** the user opens the game on a phone or desktop
- **THEN** they see the menu with all three commands and the run has not started

#### Scenario: No implicit start

- **WHEN** the user touches the screen anywhere outside the commands
- **THEN** the run does not start

#### Scenario: Three visible commands

- **WHEN** the menu is shown on a small screen
- **THEN** Calibrate, Start game and CREDITS are all visible and distinct
