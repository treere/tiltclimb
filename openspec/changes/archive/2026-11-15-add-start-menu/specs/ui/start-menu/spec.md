# Spec Delta

## Purpose

It is the first screen of the game: it shows how the sensor responds, allows fixing the neutral tilt and starting the run, and welcomes the player on return with the result of the last climb.

## ADDED Requirements

### Requirement: Menu as the first state of the application

On page open the system SHALL show the menu, with the game title, the calibration reading and the commands **Calibrate** and **Start game**. The run MUST NOT start without an explicit command from the user. The menu MUST be usable both from a phone and from a desktop.

#### Scenario: Page open

- **WHEN** the user opens the game on a phone or desktop
- **THEN** they see the menu with both commands and the run has not started

#### Scenario: No implicit start

- **WHEN** the user touches the screen anywhere outside the commands
- **THEN** the run does not start

### Requirement: Live calibration reading in the menu

The menu SHALL show in real time the detected left/right tilt, expressed as a deviation from the current zero, updating as the user moves the device. The reading SHALL be understandable without knowing the raw sensor values.

#### Scenario: The value follows the tilt

- **WHEN** the user tilts the phone to the right by about ten degrees
- **THEN** the reading in the menu moves to the right and shows a consistent positive value

#### Scenario: Reading still with the phone still

- **WHEN** the user holds the phone motionless at the neutral tilt
- **THEN** the reading stays close to zero, without visibly oscillating

### Requirement: Calibration command with visible confirmation

The **Calibrate** command SHALL fix the current device tilt as zero and MUST show a visible confirmation that the operation happened. After the calibration the reading SHALL start again from zero at the tilt in which the command was pressed.

#### Scenario: Calibration applied

- **WHEN** the user tilts the phone and presses **Calibrate**
- **THEN** a visible confirmation appears and the reading goes back to zero in that position

#### Scenario: Calibration without sensor

- **WHEN** the sensor is not available and the user presses **Calibrate**
- **THEN** the system explains that there is nothing to calibrate and does not show a false confirmation

### Requirement: Run start from the menu

The **Start game** command SHALL start a new run from the initial state, resetting score and position, and SHALL be available also when the sensors do not work.

#### Scenario: Start from the menu

- **WHEN** the user presses **Start game**
- **THEN** the game moves to the run with the score at zero and the player in the initial position

#### Scenario: Start without sensors

- **WHEN** the permission is denied or the accelerometer is missing and the user presses **Start game**
- **THEN** the run starts and responds to the fallback controls

### Requirement: Return to the menu with result summary

At the end of a run the system SHALL return to the menu instead of restarting the game, and the menu SHALL show the score just obtained and the best of the current session. The best SHALL update only when the score just made beats it.

#### Scenario: Return after the defeat

- **WHEN** the player dies after scoring 42 points
- **THEN** they return to the menu, which shows 42 as the score just made

#### Scenario: Best updated

- **WHEN** the score just made beats the session best
- **THEN** the best shown becomes the one just made

#### Scenario: Best does not get worse

- **WHEN** the score just made is lower than the session best
- **THEN** the best shown stays unchanged

### Requirement: Warning when the sensors are unavailable

When the permission is denied, the sensor is missing or no data arrives within the expected time, the menu SHALL show an explicit warning explaining that you play with keyboard or dragging. The warning MUST NOT prevent the run from starting.

#### Scenario: Permission denied

- **WHEN** the user refuses the sensor access permission in the menu
- **THEN** a warning appears in the menu and **Start game** stays usable

#### Scenario: No data from the sensor

- **WHEN** the device claims to have the sensor but no events arrive
- **THEN** after the expected time the menu shows the sensor unavailable warning
