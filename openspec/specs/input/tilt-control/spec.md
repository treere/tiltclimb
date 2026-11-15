# input/tilt-control Specification

## Purpose
Turns the phone's tilt into a continuous, predictable steering command, and guarantees that the game stays playable even when the sensor is missing or the permission is denied.

## Requirements

### Requirement: Steering proportional to tilt

With the sensors active, the system SHALL translate the device's left/right tilt into a horizontal speed for the player, proportional to the tilt angle and with a sign matching the direction. Tilting right SHALL move the player to the right and tilting left to the left, on a screen in portrait orientation. The proportionality MUST use the full-scale tilt chosen as sensitivity, which by default is more responsive than the one in previous versions.

#### Scenario: Tilting to the right

- **WHEN** the phone is tilted to the right beyond the dead zone
- **THEN** the player moves to the right, faster the greater the angle

#### Scenario: Phone flat

- **WHEN** the phone is held at the neutral tilt
- **THEN** the player does not move horizontally on its own

#### Scenario: More responsive default

- **WHEN** the game is started without saved settings
- **THEN** the ship reaches full scale at a lower tilt than in previous versions

### Requirement: Smoothing and dead zone

The system SHALL filter the sensor readings to reduce jitter and SHALL ignore tilts below a minimum threshold, so that the player does not twitch when the phone is almost still. Movement SHALL be smooth rather than jerky at the refresh rate available on the device.

#### Scenario: Jitter from a steady hand

- **WHEN** the phone is still but the sensor wobbles by a few tenths of a degree
- **THEN** the player stays motionless

#### Scenario: Low refresh rate

- **WHEN** the device emits orientation events fewer than 30 times per second
- **THEN** the player's movement stays continuous, without visible jumps

### Requirement: Fallback without sensors

When the sensor is unavailable, the permission is denied or the user plays from desktop, the system SHALL make the game fully controllable with the keyboard (left/right arrows) and with horizontal dragging of a finger or the mouse. The game MUST NOT get stuck waiting for a permission.

#### Scenario: Permission denied

- **WHEN** the user refuses the sensor access permission
- **THEN** the run starts anyway and responds to the fallback controls

#### Scenario: Run from desktop

- **WHEN** the page is opened on a computer without an accelerometer
- **THEN** the horizontal arrows move the player and no error message blocks the start

### Requirement: Permission request inside a user gesture

On platforms that require explicit consent for the sensors, the system SHALL ask for the permission only in response to a user action performed in the menu, and SHALL handle a negative outcome without interrupting the game or blocking the menu.

#### Scenario: First tap on Android or iOS

- **WHEN** the user presses **Calibrate** or **Start game** for the first time
- **THEN** the permission request happens inside that tap and the outcome is recorded before continuing

#### Scenario: Permission denied without blocking the menu

- **WHEN** the user denies the permission requested by the menu
- **THEN** the menu shows the sensor-unavailable warning and stays usable

### Requirement: Explicit calibration driven by the menu

The system SHALL use as neutral tilt the one set by the last explicit calibration, and MUST subtract that value from all subsequent readings. In the absence of an explicit calibration it SHALL use the tilt detected when the menu was opened. Starting a run MUST NOT recalibrate implicitly.

#### Scenario: Zero set by calibration

- **WHEN** the user presses **Calibrate** with the phone tilted by 12 degrees
- **THEN** that position counts as zero for the next run and the player does not drift

#### Scenario: Calibration kept across different runs

- **WHEN** the user plays, dies and starts again without pressing **Calibrate**
- **THEN** the zero stays the one from the last explicit calibration

#### Scenario: Initial zero without calibration

- **WHEN** the user opens the menu and starts the run immediately without calibrating
- **THEN** the zero is the tilt with which the menu was opened

### Requirement: Adjustable and persistent sensitivity

Sensitivity SHALL be expressed as the tilt needed to reach full scale and SHALL be selectable across five levels, from 22° (soft) to 8° (twitchy), with 13° as the default. The chosen value MUST stay stored on the device, MUST be applied from the next run and MUST NOT invalidate the calibration already performed.

#### Scenario: Twitchy level

- **WHEN** the most sensitive level is selected
- **THEN** a smaller tilt is enough to move the ship to full scale

#### Scenario: Soft level

- **WHEN** the least sensitive level is selected
- **THEN** a larger tilt is required, which helps anyone with a shaky hand

#### Scenario: Reopening the game

- **WHEN** the game is reopened after changing the sensitivity
- **THEN** the saved sensitivity is the active one

#### Scenario: Change before a run

- **WHEN** the sensitivity is changed from the menu
- **THEN** the new sensitivity applies right away and the calibrated zero stays valid
