# Spec Delta

## MODIFIED Requirements

### Requirement: Progressive climb speed

The climb speed SHALL start from the initial value and grow in steps, one per level, up to a maximum cap. The growth MUST be deterministic with respect to the level, which depends only on the distance climbed, and MUST NOT depend on elapsed time or frame rate.

#### Scenario: Start of the run

- **WHEN** the run begins
- **THEN** the climb proceeds at the initial speed

#### Scenario: Extended climb

- **WHEN** the player goes past several levels
- **THEN** the climb speeds up once per level boundary, without stutter and without growing inside a level

#### Scenario: Cap reached

- **WHEN** the level reaches the one where the cap is defined
- **THEN** the speed stays constant at that value and does not grow any further

### Requirement: Scrolling consistent with the current speed

Parallax, obstacles and enemy ships SHALL use the current climb speed, so that the relative movement of the world stays consistent when the game accelerates. The distance between one obstacle and the next MUST stay the expected one for the current level, expressed in climb pixels.

#### Scenario: Acceleration

- **WHEN** the climb speed increases at a level boundary
- **THEN** background, obstacles and enemies accelerate together, without the obstacles moving closer to or further from each other inside the level

#### Scenario: Enemy descending

- **WHEN** an enemy ship descends while the game is faster
- **THEN** its relative descent stays that of the archetype, without becoming slower or faster in proportion

#### Scenario: Density follows the level

- **WHEN** a new level starts and the obstacle gap for that level is tighter
- **THEN** the new rows adopt it, while the rows already on screen keep their spacing
