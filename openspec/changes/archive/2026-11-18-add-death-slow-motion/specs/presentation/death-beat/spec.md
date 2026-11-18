# Spec Delta

## ADDED Requirements

### Requirement: Death slow motion

When the run ends, the world SHALL decelerate to a quarter of its speed for a short, fixed interval
before the menu appears, so the blast and the loss are readable. The deceleration SHALL last 400 ms of
wall-clock time, MUST NOT depend on the frame rate, and MUST NOT change what happens in the world: no
obstacle, enemy or projectile SHALL be generated, and no score SHALL be added while it plays. Time
SHALL return to normal speed before the menu replaces the scene, so no later run starts slowed.

#### Scenario: Death decelerates

- **WHEN** the player collides with an obstacle
- **THEN** the blast and the starfield keep moving, at a quarter of their speed, for 400 ms

#### Scenario: Nothing happens during the beat

- **WHEN** the slow motion is playing
- **THEN** no obstacle, enemy ship or projectile is created, and the score does not grow

#### Scenario: Speed is restored

- **WHEN** the beat is over
- **THEN** time runs at normal speed again and the menu follows as before

#### Scenario: Second run is not slowed

- **WHEN** a run ends with the slow motion and the user starts another run
- **THEN** the new run scrolls at its normal speed

#### Scenario: Page hidden during the beat

- **WHEN** the page is hidden while the slow motion plays and the player comes back
- **THEN** time is back at normal speed and the game is not left crawling
