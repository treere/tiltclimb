# gameplay/pause Specification

## Purpose
Defines how a run stops and resumes without being lost, and what must stay frozen while it is
paused.

## Requirements

### Requirement: Pause control during the run

During a run the system SHALL show a round pause control in the top right corner, of the same size
and style as the audio toggle in the menu. It MUST be reachable with a thumb and MUST NOT overlap
the score or the fire button.

#### Scenario: Control visible during the run

- **WHEN** a run is in progress
- **THEN** a round pause control is visible in the top right corner, clear of the score and of the
  fire button

### Requirement: The run starts unpaused

A new run SHALL start running, with no pause overlay on screen and with the pause control showing
the pause icon. The overlay MUST be hidden explicitly at the start, not left to a default.

#### Scenario: Starting a run

- **WHEN** the player starts a run from the menu
- **THEN** the ship climbs immediately, no overlay covers the play area, and the control offers to
  pause, not to resume

#### Scenario: Second run after using pause

- **WHEN** the player pauses, returns to the menu and starts a new run
- **THEN** the new run starts unpaused and the overlay is not visible

### Requirement: Paused state

Tapping the pause control SHALL freeze the run: the world MUST stop scrolling, no obstacle or enemy
MUST be generated, no projectile MUST move, the score MUST NOT grow and no run-ending collision MUST
be evaluated. The screen SHALL show that the run is paused and how to resume.

#### Scenario: Freeze on pause

- **WHEN** the player taps the pause control
- **THEN** the world, the score and the spawning stop, and an overlay says the run is paused and how
  to resume

#### Scenario: Nothing dies while paused

- **WHEN** the run is paused with an asteroid or a projectile overlapping the ship
- **THEN** the run does not end, and it ends only after resuming if the overlap is still there

#### Scenario: No shooting while paused

- **WHEN** the fire button is pressed while the run is paused
- **THEN** no shot is fired

#### Scenario: Resume

- **WHEN** the player taps the `RESUME` button or the pause control again
- **THEN** the run continues from the same point, with the same score and the same positions

### Requirement: Pause when the page is hidden

The system SHALL pause the run by itself when the page becomes hidden, so that a phone call, a
notification or a tab switch does not cost the run.

#### Scenario: App sent to the background

- **WHEN** the page becomes hidden during a run
- **THEN** the run pauses as if the control had been tapped, and it waits for the player

#### Scenario: Return to the page

- **WHEN** the page becomes visible again
- **THEN** the run is still paused and the overlay is visible, and it does not resume by itself

#### Scenario: Listener removed on leaving

- **WHEN** the player leaves the run for the menu
- **THEN** the listener is removed, so a second run does not react to the page visibility twice
