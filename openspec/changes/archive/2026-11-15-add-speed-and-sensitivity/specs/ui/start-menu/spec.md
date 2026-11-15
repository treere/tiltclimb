# Spec Delta

## ADDED Requirements

### Requirement: Sensitivity control in the menu

The menu SHALL show a control for the steering sensitivity, with the current level visible and the tilt degrees corresponding to full scale. The control MUST be usable with a single touch, without precision dragging, and MUST apply the choice immediately.

#### Scenario: Reading the level

- **WHEN** the menu is visible
- **THEN** it is readable at which sensitivity level the game is set and how many degrees are needed for full scale

#### Scenario: Increasing sensitivity

- **WHEN** the command to increase sensitivity is touched
- **THEN** the level rises by one, the displayed value updates and the choice is saved

#### Scenario: Limits of the control

- **WHEN** the maximum or minimum level is already selected
- **THEN** the corresponding command is disabled and it is not possible to leave the range

#### Scenario: The control does not cover the game

- **WHEN** the menu is visible on a small screen
- **THEN** the control does not overlap the calibration and start buttons
