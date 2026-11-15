# Spec Delta

## Purpose

Makes the run more tense as you climb, without the world falling out of step.

## ADDED Requirements

### Requirement: Progressive climb speed

The climb speed SHALL start from the initial value and grow as a function of the pixels scrolled, up to a maximum cap. The growth MUST be deterministic with respect to height and MUST NOT depend on elapsed time or on the frame rate.

#### Scenario: Run start

- **WHEN** the run begins
- **THEN** the climb proceeds at the initial speed

#### Scenario: Prolonged climb

- **WHEN** the player passes several thousand pixels of height
- **THEN** the climb accelerates continuously, without visible jumps

#### Scenario: Cap reached

- **WHEN** the height passes the cap threshold
- **THEN** the speed stays constant at that value and does not grow any further

### Requirement: Scrolling consistent with the current speed

Parallax, obstacles and enemy ships SHALL use the current climb speed, so that the relative movement of the world stays consistent when the game accelerates. The distance between one obstacle and the next MUST stay the expected one, expressed in climb pixels.

#### Scenario: Acceleration

- **WHEN** the climb speed increases during the run
- **THEN** background, obstacles and enemies accelerate together, without the obstacles moving closer to or farther from each other

#### Scenario: Enemy descending

- **WHEN** an enemy ship descends while the game is faster
- **THEN** its relative descent stays the archetype's, without becoming slower or faster in proportion
