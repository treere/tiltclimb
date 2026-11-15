# Spec Delta

## REMOVED Requirements

### Requirement: Zero calibration on the first touch

**Reason**: calibration is no longer implicit at the start of the run: it is now an explicit command in the menu, with a visible reading and confirmation, because the silent calibration hid the phone's setup problems.

**Migration**: those who played with the automatic zero now press **Calibrate** in the menu; without that touch the zero stays the tilt at menu open, so the starting behavior does not get worse.

## MODIFIED Requirements

### Requirement: Permission request inside a user gesture

On platforms that require explicit consent for the sensors, the system SHALL ask for the permission only in response to a user action performed in the menu, and SHALL handle the negative outcome without interrupting the game or blocking the menu.

#### Scenario: First touch on Android or iOS

- **WHEN** the user presses **Calibrate** or **Start game** for the first time
- **THEN** the permission request happens inside that touch and the outcome is recorded before continuing

#### Scenario: Permission denied without blocking the menu

- **WHEN** the user denies the permission requested by the menu
- **THEN** the menu shows the sensor unavailable warning and stays usable

## ADDED Requirements

### Requirement: Explicit calibration commanded from the menu

The system SHALL use as neutral tilt the one fixed by the last explicit calibration, and MUST subtract that value from all subsequent readings. In the absence of explicit calibration it SHALL use the tilt detected at menu open. Starting a run MUST NOT recalibrate implicitly.

#### Scenario: Zero fixed by the calibration

- **WHEN** the user presses **Calibrate** with the phone tilted by 12 degrees
- **THEN** that position counts as zero for the next run and the player does not drift

#### Scenario: Calibration kept between different runs

- **WHEN** the user plays, dies and starts again without pressing **Calibrate**
- **THEN** the zero stays the one of the last explicit calibration

#### Scenario: Initial zero without calibration

- **WHEN** the user opens the menu and starts the run immediately without calibrating
- **THEN** the zero is the tilt with which they opened the menu
