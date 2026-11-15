# Spec Delta

## Purpose

Defines the encounter: the hero fires from the bottom button, enemy ships descend in zigzags and fire downwards, and the rules say what is hit and what is not — including the asteroids' immunities.

## ADDED Requirements

### Requirement: Single-shot hero fire

The hero SHALL be able to fire by pressing a button placed in the lower part of the screen, and every touch SHALL produce exactly one shot, without automatic burst. The shot SHALL leave the spaceship and travel upwards. The button SHALL stay reachable by the thumb without covering the spaceship or the incoming asteroids.

#### Scenario: One touch, one shot

- **WHEN** the user touches the fire button once
- **THEN** a single shot leaves, regardless of how long they hold it down

#### Scenario: Repeated touches

- **WHEN** the user touches the button several times in quick succession
- **THEN** one shot leaves for every recognized touch, without automatic burst

#### Scenario: The shot travels upwards

- **WHEN** a shot is fired
- **THEN** it moves upwards and disappears when it exits the screen

### Requirement: Enemy ships with a wavy trajectory

Enemy ships SHALL descend from top to bottom with a horizontal wavy trajectory, staying within the world edges. The number of simultaneously present enemy ships SHALL be limited, and the ships SHALL appear at regular intervals.

#### Scenario: Wavy descent

- **WHEN** an enemy ship is on screen
- **THEN** its horizontal position changes continuously and oscillating while it descends

#### Scenario: Limit of present ships

- **WHEN** the limit of simultaneous ships is already reached
- **THEN** no others appear until one exits the screen or is destroyed

### Requirement: Enemy fire towards the bottom

Every enemy ship SHALL fire projectiles that travel downwards, at regular intervals and at a speed lower than the hero's shots, so that they are dodgeable. Enemy projectiles SHALL disappear when they exit the screen.

#### Scenario: Enemy burst

- **WHEN** an enemy ship stays on screen for the expected time
- **THEN** it fires a projectile downwards and keeps doing so at regular intervals

#### Scenario: Projectile exiting the screen

- **WHEN** an enemy projectile passes the bottom edge
- **THEN** it is removed from the game

### Requirement: Combat collision rules

A hero shot that hits an enemy ship SHALL destroy it, because enemy ships withstand a single shot. Contact between the hero and an enemy ship or an enemy projectile SHALL end the run, like contact with an asteroid. Hero shots MUST pass through asteroids without being consumed, and enemy ships MUST pass through asteroids without suffering consequences.

#### Scenario: Enemy ship destroyed

- **WHEN** a hero shot reaches an enemy ship
- **THEN** the ship disappears and the shot is consumed

#### Scenario: Hero hit by a projectile

- **WHEN** an enemy projectile touches the hero
- **THEN** the run ends

#### Scenario: Hero hit by a ship

- **WHEN** an enemy ship touches the hero
- **THEN** the run ends

#### Scenario: Asteroid immune to shots

- **WHEN** a hero shot passes through an asteroid
- **THEN** the shot continues its course and the asteroid stays intact

#### Scenario: Enemy ship over an asteroid

- **WHEN** an enemy ship crosses the position of an asteroid
- **THEN** neither of the two is destroyed and the ship continues its trajectory

### Requirement: Score per kill

Every enemy ship destroyed SHALL award points to the score of the current run, and the number of kills SHALL be reported in the summary shown by the menu at the end of the run.

#### Scenario: Points for a kill

- **WHEN** the hero destroys an enemy ship
- **THEN** the score increases by the value expected for a kill

#### Scenario: Summary with the kills

- **WHEN** the run ends
- **THEN** the menu shows the score obtained and the number of ships destroyed
