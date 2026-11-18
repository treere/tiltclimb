# Spec Delta

## MODIFIED Requirements

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
