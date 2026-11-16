# ui/start-menu Specification

## Purpose
It is the first screen of the game: it shows how the sensor responds, lets you set the neutral tilt and start the run, and welcomes the player back with the result of the last climb.

## Requirements

### Requirement: Menu as the first state of the application

When the page opens the system SHALL show the menu, with the game title, the calibration reading and the **Calibrate**, **Start game** and **CREDITS** commands. The run MUST NOT start without an explicit user command. The menu MUST be usable both from a phone and from a desktop, and the three commands MUST stay visible without overlapping each other or the spaceship illustration.

#### Scenario: Opening the page

- **WHEN** the user opens the game on a phone or desktop
- **THEN** they see the menu with all three commands and the run has not started

#### Scenario: No implicit start

- **WHEN** the user taps the screen anywhere outside the commands
- **THEN** the run does not start

#### Scenario: Three visible commands

- **WHEN** the menu is shown on a small screen
- **THEN** Calibrate, Start game and CREDITS are all visible and distinct

### Requirement: Live calibration reading in the menu

The menu SHALL show in real time the detected left/right tilt, expressed as a deviation from the current zero, updating while the user moves the device. The reading SHALL be understandable without knowing the sensor's raw values.

#### Scenario: The value follows the tilt

- **WHEN** the user tilts the phone to the right by about ten degrees
- **THEN** the reading in the menu moves to the right and shows a consistent positive value

#### Scenario: Reading still with a still phone

- **WHEN** the user holds the phone motionless at the neutral tilt
- **THEN** the reading stays close to zero, without visible oscillation

### Requirement: Calibration command with visible confirmation

The **Calibrate** command SHALL set the device's current tilt as zero and MUST show a visible confirmation that the operation happened. After the calibration the reading SHALL start again from zero at the tilt in which the command was pressed.

#### Scenario: Calibration applied

- **WHEN** the user tilts the phone and presses **Calibrate**
- **THEN** a visible confirmation appears and the reading goes back to zero at that position

#### Scenario: Calibration without a sensor

- **WHEN** the sensor is unavailable and the user presses **Calibrate**
- **THEN** the system explains that there is nothing to calibrate and does not show a false confirmation

### Requirement: Starting the run from the menu

The **Start game** command SHALL start a new run from the initial state, resetting score and position, and SHALL be available even when the sensors do not work.

#### Scenario: Start from the menu

- **WHEN** the user presses **Start game**
- **THEN** the game moves to the run with the score at zero and the player in the initial position

#### Scenario: Start without sensors

- **WHEN** the permission is denied or the accelerometer is missing and the user presses **Start game**
- **THEN** the run starts and responds to the fallback controls

### Requirement: Return to the menu with a summary of the result

At the end of a run the system SHALL return to the menu instead of restarting the game, and the menu
SHALL show the score just achieved together with the best result **stored on the device**, as two
distinct values. The stored best SHALL be shown even when no run has been played since the game was
opened, and SHALL update only when the score just achieved beats it.

#### Scenario: Return after the defeat

- **WHEN** the player dies after scoring 42 points
- **THEN** they return to the menu, which shows 42 as the score just achieved

#### Scenario: Best score updated

- **WHEN** the score just achieved beats the stored best score
- **THEN** the displayed best score becomes the one just achieved, and it is stored on the device

#### Scenario: Best score does not get worse

- **WHEN** the score just achieved is lower than the stored best score
- **THEN** the displayed best score stays unchanged

#### Scenario: Opening the game with a stored record

- **WHEN** the game is opened and there is a stored best but no run has been played yet
- **THEN** the menu shows the stored best and the stored best kill count, not a zero

#### Scenario: Opening the game with nothing stored

- **WHEN** the game is opened for the first time
- **THEN** no result line is shown until a run has been played

### Requirement: Warning when the sensors are unavailable

When the permission is denied, the sensor is absent or no data arrives within the expected time, the menu SHALL show an explicit warning explaining that you play with the keyboard or dragging. The warning MUST NOT prevent starting the run.

#### Scenario: Permission denied

- **WHEN** the user refuses the sensor access permission in the menu
- **THEN** a warning appears in the menu and **Start game** stays usable

#### Scenario: No data from the sensor

- **WHEN** the device claims to have the sensor but no events arrive
- **THEN** after the expected time the menu shows the sensor-unavailable warning

### Requirement: Steering sensitivity control in the menu

The menu SHALL show a control for the steering sensitivity, with the current level visible and the tilt degrees corresponding to full scale. The control MUST be usable with one tap, without precision dragging, and MUST apply the choice immediately.

#### Scenario: Reading the level

- **WHEN** the menu is visible
- **THEN** you can read which sensitivity level the game is set to and how many degrees are needed for full scale

#### Scenario: Increasing the sensitivity

- **WHEN** the command to increase the sensitivity is tapped
- **THEN** the level goes up by one, the displayed value updates and the choice is saved

#### Scenario: Limits of the control

- **WHEN** the maximum or minimum level has already been reached
- **THEN** the corresponding command is disabled and it is not possible to leave the range

#### Scenario: The control does not cover the game

- **WHEN** the menu is visible on a small screen
- **THEN** the control does not overlap the calibration and start buttons
