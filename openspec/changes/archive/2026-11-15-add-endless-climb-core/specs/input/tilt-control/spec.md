# Spec Delta

## Purpose

Turns the phone's tilt into a continuous and predictable steering command, and guarantees that the game stays playable even when the sensor is missing or the permission is denied.

## ADDED Requirements

### Requirement: Steering proportional to the tilt

With the sensors active, the system SHALL translate the left/right tilt of the device into a horizontal speed of the player, proportional to the angle tilted and with a sign matching the direction. Tilting right SHALL move the player to the right and tilting left to the left, on a screen in vertical orientation.

#### Scenario: Tilting to the right

- **WHEN** the phone is tilted to the right beyond the dead zone
- **THEN** the player moves to the right, the faster the greater the angle

#### Scenario: Phone flat

- **WHEN** the phone is held at the neutral tilt
- **THEN** the player does not move horizontally on its own

### Requirement: Zero calibration on the first touch

The system SHALL take as neutral tilt the one of the device at the moment the user starts the run, and MUST subtract this value from all subsequent readings, so that the player does not drift because of how the phone is held.

#### Scenario: Zero captured at start

- **WHEN** the user starts the run with the phone tilted by 12 degrees
- **THEN** that position counts as zero and the player stays still until the tilt changes

#### Scenario: Recalibration between runs

- **WHEN** the user restarts the run with the phone in a different position
- **THEN** the new zero is the position assumed at the restart

### Requirement: Damping and dead zone

The system SHALL filter the sensor readings to reduce jitter and SHALL ignore tilts below a minimum threshold, so that the player does not vibrate when the phone is almost still. The movement SHALL be smooth and not jerky at the refresh rate available on the device.

#### Scenario: Jitter from a still hand

- **WHEN** the phone is still but the sensor oscillates by a few tenths of a degree
- **THEN** the player stays still

#### Scenario: Low refresh rate

- **WHEN** the device emits orientation events fewer than 30 times per second
- **THEN** the player's movement stays continuous, without visible jumps

### Requirement: Fallback without sensors

When the sensor is unavailable, the permission is denied or the user plays from a desktop, the system SHALL make the game fully controllable with the keyboard (left/right arrows) and with horizontal dragging of the finger or mouse. The game MUST NOT freeze waiting for a permission.

#### Scenario: Permission denied

- **WHEN** the user refuses the sensor access permission
- **THEN** the run starts anyway and responds to the fallback controls

#### Scenario: Run from desktop

- **WHEN** the page is opened on a computer without an accelerometer
- **THEN** the horizontal arrows move the player and no error message blocks the start

### Requirement: Permission request inside a user gesture

On platforms that require explicit consent for the sensors, the system SHALL ask for the permission only in response to a user action and SHALL handle the negative outcome without interrupting the game.

#### Scenario: First touch on Android or iOS

- **WHEN** the user touches to start the run
- **THEN** the permission request happens inside that touch and the outcome is recorded before the scrolling starts
