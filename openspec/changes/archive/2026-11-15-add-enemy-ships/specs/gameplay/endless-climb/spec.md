# Spec Delta

## MODIFIED Requirements

### Requirement: Collision and end of run

Contact between the player and an obstacle SHALL end the run. After the end, the world SHALL stop and MUST NOT keep generating obstacles, enemy ships or projectiles until the run is restarted.

#### Scenario: Impact against an obstacle

- **WHEN** the player touches an obstacle
- **THEN** the run ends and the scrolling stops

#### Scenario: Impact against an enemy projectile

- **WHEN** the player touches an enemy projectile
- **THEN** the run ends and the scrolling stops

#### Scenario: Impact against an enemy ship

- **WHEN** the player touches an enemy ship
- **THEN** the run ends and the scrolling stops

#### Scenario: No generation after the end

- **WHEN** the run has ended and the user has not restarted yet
- **THEN** no obstacles, enemy ships or projectiles are created or recycled

### Requirement: Score by height

The score SHALL be the sum of the points for the maximum height reached in the current run and of the points earned by destroying enemy ships, and SHALL be visible during play. The value SHALL remain in memory for the session and MUST NOT be saved persistently in this iteration.

#### Scenario: The score grows while climbing

- **WHEN** the player climbs and exceeds their previous maximum height
- **THEN** the displayed score increases monotonically

#### Scenario: The score grows by destroying

- **WHEN** the player destroys an enemy ship
- **THEN** the displayed score increases by the same value expected from the combat spec

#### Scenario: Restart resets the score

- **WHEN** the user restarts the run after a defeat
- **THEN** the score starts again from zero, the maximum height is reset and the kills go back to zero
