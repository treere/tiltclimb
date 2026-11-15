# Spec Delta

## MODIFIED Requirements

### Requirement: Steering proportional to the tilt

With the sensors active, the system SHALL translate the left/right tilt of the device into a horizontal speed of the player, proportional to the angle tilted and with a sign matching the direction. Tilting right SHALL move the player to the right and tilting left to the left, on a screen in vertical orientation. The proportionality MUST use the full-scale tilt chosen as sensitivity, which by default is more responsive than the one of previous versions.

#### Scenario: Tilting to the right

- **WHEN** the phone is tilted to the right beyond the dead zone
- **THEN** the player moves to the right, the faster the greater the angle

#### Scenario: Phone flat

- **WHEN** the phone is held at the neutral tilt
- **THEN** the player does not move horizontally on its own

#### Scenario: More responsive default

- **WHEN** the game is started without saved settings
- **THEN** the ship reaches full scale at a lower tilt than in previous versions

## ADDED Requirements

### Requirement: Adjustable and persistent sensitivity

Sensitivity SHALL be expressed as the tilt needed to reach full scale and SHALL be selectable among five levels, from 22° (soft) to 8° (twitchy), with 13° as default. The chosen value MUST stay stored on the device, MUST be applied from the next run and MUST NOT invalidate the calibration already performed.

#### Scenario: Twitchy level

- **WHEN** the most sensitive level is selected
- **THEN** a smaller tilt is enough to move the ship at full scale

#### Scenario: Soft level

- **WHEN** the least sensitive level is selected
- **THEN** a greater tilt is needed, useful for those with an unsteady hand

#### Scenario: Reopening the game

- **WHEN** the game is reopened after changing sensitivity
- **THEN** the saved sensitivity is the active one

#### Scenario: Change before a run

- **WHEN** the sensitivity changes from the menu
- **THEN** the new sensitivity applies right away and the calibrated zero stays valid
