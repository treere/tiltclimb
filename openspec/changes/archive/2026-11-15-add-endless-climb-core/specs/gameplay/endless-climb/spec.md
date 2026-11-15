# Spec Delta

## Purpose

Defines the game loop of an infinite vertical climb: the world scrolls, obstacles come from above, the player climbs until they make a mistake, and the score measures the height reached.

## ADDED Requirements

### Requirement: Automatic climb with single-axis camera

The player SHALL climb automatically upwards at constant speed. The camera SHALL follow the player only on the vertical axis, keeping them always visible, and MUST NOT move horizontally with them.

#### Scenario: The camera chases vertically

- **WHEN** the player climbs past the center of the screen
- **THEN** the camera moves upwards keeping the player in the same relative vertical position

#### Scenario: Horizontal movement does not move the world

- **WHEN** the player moves left or right
- **THEN** the obstacles and the background stay still horizontally

### Requirement: Obstacle generation and recycling

The system SHALL generate obstacles above the top edge of the screen at regular intervals and MUST recycle those that exit below the bottom edge instead of creating new ones. The number of simultaneously active obstacles SHALL stay limited and constant during the run.

#### Scenario: New obstacle above the screen

- **WHEN** the world has scrolled by a distance equal to the generation interval
- **THEN** a new obstacle appears above the top edge, out of view

#### Scenario: Recycling below the bottom edge

- **WHEN** an obstacle exits the bottom edge of the screen
- **THEN** it becomes available again in the pool and is reused for a later generation, without increasing the number of active obstacles

### Requirement: Collision and end of run

Contact between the player and an obstacle SHALL end the run. After the end, the world SHALL stop and MUST NOT keep generating obstacles until the run is restarted.

#### Scenario: Impact against an obstacle

- **WHEN** the player touches an obstacle
- **THEN** the run ends and the scrolling stops

#### Scenario: No generation after the end

- **WHEN** the run has ended and the user has not restarted yet
- **THEN** no obstacles are created or recycled

### Requirement: Score by height

The score SHALL be proportional to the maximum height reached in the current run and SHALL be visible during play. The value SHALL remain in memory for the session and MUST NOT be saved persistently in this iteration.

#### Scenario: The score grows while climbing

- **WHEN** the player climbs and exceeds their previous maximum height
- **THEN** the displayed score increases monotonically

#### Scenario: Restart resets the score

- **WHEN** the user restarts the run after a defeat
- **THEN** the score starts again from zero and the maximum height is reset

### Requirement: Run cycle with immediate restart

The system SHALL show the run-over state with the score obtained and SHALL allow restarting with a single action, without reloading the page.

#### Scenario: Restart after the defeat

- **WHEN** the user touches the screen or presses a key on the end-of-run screen
- **THEN** a new run starts immediately from the initial state
