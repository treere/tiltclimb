# gameplay/endless-climb Specification

## Purpose
Defines the game loop of an endless vertical climb: the world scrolls, obstacles come from above, the player climbs until they make a mistake, and the score measures the height reached.

## Requirements

### Requirement: Automatic climb with a single-axis camera

The player SHALL climb upward automatically at a constant speed. The camera SHALL follow the player on the vertical axis only, always keeping them visible, and MUST NOT move horizontally with them.

#### Scenario: The camera chases vertically

- **WHEN** the player climbs past the center of the screen
- **THEN** the camera moves upward, keeping the player in the same relative vertical position

#### Scenario: Horizontal movement does not move the world

- **WHEN** the player moves left or right
- **THEN** obstacles and background stay still horizontally

### Requirement: Obstacle generation and recycling

The system SHALL generate obstacles above the top edge of the screen at regular intervals and MUST recycle those that have left through the bottom edge instead of creating new ones. The number of simultaneously active obstacles SHALL stay bounded and constant during the run.

#### Scenario: New obstacle above the screen

- **WHEN** the world has scrolled by a distance equal to the generation interval
- **THEN** a new obstacle appears above the top edge, out of sight

#### Scenario: Recycling below the bottom edge

- **WHEN** an obstacle leaves through the bottom edge of the screen
- **THEN** it becomes available again in the pool and is reused for a later generation, without increasing the number of active obstacles

### Requirement: Collision and end of run

Contact between the player and an obstacle SHALL end the run. After a brief deceleration that makes
the impact readable, the world SHALL stop and MUST NOT keep generating obstacles, enemy ships or
projectiles until the run is restarted.

#### Scenario: Impact against an obstacle

- **WHEN** the player touches an obstacle
- **THEN** the run ends and the scrolling decelerates and stops

#### Scenario: Impact against an enemy projectile

- **WHEN** the player touches an enemy projectile
- **THEN** the run ends and the scrolling decelerates and stops

#### Scenario: Impact against an enemy ship

- **WHEN** the player touches an enemy ship
- **THEN** the run ends and the scrolling decelerates and stops

#### Scenario: No generation after the end

- **WHEN** the run is over and the user has not restarted yet
- **THEN** no obstacles, enemy ships or projectiles are created or recycled

### Requirement: Score for height

The score SHALL be the sum of the points for the maximum height reached in the current run and the points earned by shooting down enemy ships, and SHALL be visible during play. The value SHALL stay in memory for the session and MUST NOT be persisted in this iteration.

#### Scenario: The score grows by climbing

- **WHEN** the player climbs and passes their previous maximum height
- **THEN** the displayed score increases monotonically

#### Scenario: The score grows by shooting down

- **WHEN** the player shoots down an enemy ship
- **THEN** the displayed score increases by the same value expected by the combat spec

#### Scenario: Restart resets the score

- **WHEN** the user restarts the run after a defeat
- **THEN** the score starts again from zero, the maximum height is reset and the shoot-downs go back to zero

### Requirement: Run loop with return to the menu

At the end of a run the system SHALL return to the menu within a time perceived as immediate, without reloading the page, and MUST NOT restart the game automatically. The outcome of the run just ended SHALL be visible in the menu.

#### Scenario: Return to the menu after the collision

- **WHEN** the player touches an obstacle
- **THEN** the run closes and the screen becomes the menu, with the outcome just achieved

#### Scenario: No automatic restart

- **WHEN** the game returns to the menu after a defeat
- **THEN** no new run starts until the user presses **Start game**

#### Scenario: Clean new run

- **WHEN** the user presses **Start game** after a defeat
- **THEN** the scene restarts from the initial state, with the score at zero and the obstacles reset
