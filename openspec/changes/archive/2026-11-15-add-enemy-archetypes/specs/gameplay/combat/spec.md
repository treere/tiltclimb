# Spec Delta

## REMOVED Requirements

### Requirement: Enemy ships with a wavy trajectory

**Reason**: not all enemy ships oscillate anymore. Movement now depends on the archetype, so a single rule for all would misdescribe three ships out of four.

**Migration**: the patrol keeps exactly the wavy behavior described before; the other types are described by the new requirement on archetypes. Someone who expected a single type of enemy now finds a progression, and the harder ones appear only after a certain height.

## MODIFIED Requirements

### Requirement: Enemy fire towards the bottom

Every enemy ship SHALL fire projectiles directed downwards at regular intervals and at a speed lower than the hero's shots, with a pattern that depends on its archetype: single shot, close burst or fan of oblique shots. Enemy projectiles SHALL disappear when they exit the screen.

#### Scenario: Enemy burst

- **WHEN** an enemy ship stays on screen for the expected time
- **THEN** it fires according to its archetype pattern and keeps doing so at regular intervals

#### Scenario: Striker burst

- **WHEN** a striker opens fire
- **THEN** it fires two shots in quick succession, not just one

#### Scenario: Hunter fan

- **WHEN** a hunter opens fire
- **THEN** it fires three shots directed downwards, of which the outer ones are angled

#### Scenario: Turret sequence

- **WHEN** the turret opens fire
- **THEN** it fires four shots in quick sequence and then stays without firing for a long time

#### Scenario: Projectile exiting the screen

- **WHEN** an enemy projectile passes the bottom or side edge of the view
- **THEN** it is removed from the game

## ADDED Requirements

### Requirement: Enemy archetypes with their own movement

The system SHALL have four types of enemy ship, each with a distinct sprite and its own movement: patrol that oscillates while descending, striker that descends diagonally towards the opposite side, hunter that follows the hero horizontally, turret that stations at mid height. Each type MUST stay within the world edges.

#### Scenario: Patrol

- **WHEN** a patrol crosses the screen
- **THEN** it descends slowly oscillating horizontally

#### Scenario: Striker

- **WHEN** a striker enters the scene
- **THEN** it descends faster than the others and moves towards the side opposite the entry one

#### Scenario: Hunter

- **WHEN** a hunter is on screen
- **THEN** its horizontal position approaches the hero's, without overshooting in jerks

#### Scenario: Turret

- **WHEN** a turret enters the scene
- **THEN** it descends to about mid height and then stays there, oscillating slowly

### Requirement: Progressive appearance of the harder enemies

The harder types SHALL unlock based on the height reached in the run, and a type MUST NOT appear before its own threshold. The limit of simultaneous enemy ships SHALL be two in the early phase and three from when the hunter is available.

#### Scenario: Run start

- **WHEN** the run has just started and the height is low
- **THEN** only patrols appear

#### Scenario: Unlock beyond the threshold

- **WHEN** the height passes the threshold of a type
- **THEN** that type can appear, while the types with a higher threshold stay excluded

#### Scenario: Limit that grows

- **WHEN** the hunter is unlocked
- **THEN** up to three enemy ships can be present at the same time

### Requirement: Score per enemy type

Each type of enemy ship SHALL award a different points value based on difficulty: patrol 25, striker 35, hunter 45, turret 60.

#### Scenario: Patrol destroyed

- **WHEN** the hero destroys a patrol
- **THEN** the score increases by 25

#### Scenario: Turret destroyed

- **WHEN** the hero destroys a turret
- **THEN** the score increases by 60

#### Scenario: Kill summary

- **WHEN** the run ends
- **THEN** the summary counts all the ships destroyed, regardless of type
