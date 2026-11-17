# Spec Delta

## Purpose

Defines the rare power-up: how it drops, how it is collected, what it protects against, how the run
shows it and how long it lasts.

## ADDED Requirements

### Requirement: A destroyed ship may drop a pickup

When an enemy ship is destroyed there SHALL be a small chance that it leaves a pickup behind. The
pickup SHALL fall with the scrolling world and SHALL be collected by contact with the hero. A pickup
that leaves the screen MUST be discarded.

#### Scenario: Drop

- **WHEN** an enemy ship is destroyed and the drop chance is drawn
- **THEN** a pickup appears where the ship was and falls with the world

#### Scenario: Collection

- **WHEN** the hero touches a pickup
- **THEN** the pickup disappears and the power-up starts

#### Scenario: Missed pickup

- **WHEN** a pickup falls past the bottom of the screen
- **THEN** it is gone and nothing else happens

#### Scenario: Rare

- **WHEN** a run destroys a handful of ships
- **THEN** most of them leave nothing behind

### Requirement: Invincibility for a limited time

While the power-up is active the hero SHALL be immune: contact with an asteroid or with an enemy
projectile MUST NOT end the run. Contact with an enemy ship SHALL destroy that ship, awarding the
points and the explosion of a normal shoot-down.

#### Scenario: Asteroid

- **WHEN** the powered hero crosses an asteroid
- **THEN** the run continues

#### Scenario: Enemy projectile

- **WHEN** an enemy projectile touches the powered hero
- **THEN** the run continues and the projectile is consumed as usual

#### Scenario: Enemy ship

- **WHEN** the powered hero touches an enemy ship
- **THEN** the ship is destroyed with its explosion and points, and the run continues

### Requirement: Duration and pickup while powered

The power-up SHALL last a fixed duration measured on the game clock, so it freezes while the run is
paused. Collecting a second pickup while it is active SHALL restart the full duration, and MUST NOT
add the remaining time on top.

#### Scenario: Expiry

- **WHEN** the duration elapses
- **THEN** the hero is vulnerable again

#### Scenario: Second pickup

- **WHEN** the hero collects a pickup while already powered, with two seconds left
- **THEN** the timer goes back to the full duration, not to the remaining time plus the full duration

#### Scenario: Pause

- **WHEN** the run is paused while powered
- **THEN** the remaining time does not change until the run resumes

#### Scenario: A new run starts vulnerable

- **WHEN** a run starts, including right after a powered run ended
- **THEN** the hero is vulnerable and no timer is running

### Requirement: The power-up is visible and audible

While active the hero SHALL be drawn in a different colour from the normal one, and collecting a
pickup SHALL play a short jingle. In the last part of the duration the hero SHALL blink between the
two colours before returning to normal.

#### Scenario: Colour

- **WHEN** the power-up starts
- **THEN** the hero changes colour and stays that colour while the timer runs

#### Scenario: Blinking before the end

- **WHEN** the remaining time falls below the warning threshold
- **THEN** the hero blinks between the powered and the normal colour

#### Scenario: Back to normal

- **WHEN** the power-up ends
- **THEN** the hero is drawn in its normal colour again, without blinking

#### Scenario: Jingle

- **WHEN** a pickup is collected
- **THEN** the pickup jingle plays, without interrupting the music
