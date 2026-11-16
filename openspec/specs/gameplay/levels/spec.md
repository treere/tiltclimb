# gameplay/levels Specification

## Purpose
Defines how a run is divided into levels: what triggers one, what changes at the boundary, and how
the player sees it. The level is a stage, not a ranking: the score and the record stay as they are.

## Requirements

### Requirement: Endless levels by distance

The run SHALL be divided into levels of a fixed length in climbed pixels, numbered from one, with no
upper bound. The current level MUST depend only on the distance climbed: never on elapsed time, on
the score, or on enemies destroyed.

#### Scenario: Crossing a boundary

- **WHEN** the player climbs past a multiple of the level length
- **THEN** the level goes up by exactly one

#### Scenario: Standing still does not level up

- **WHEN** the player is alive but not climbing
- **THEN** the level does not change

#### Scenario: No end

- **WHEN** the player climbs past any number of levels
- **THEN** the game keeps going and the counter keeps growing

### Requirement: Each level is harder than the previous

Entering a new level SHALL make the run a step harder, and the difficulty MUST stop growing once its
ceilings are reached while the level number keeps increasing.

#### Scenario: A new level is harder

- **WHEN** the level goes up
- **THEN** the climb speed increases and, from the stated level onwards, one more enemy may be alive
  at the same time and the obstacle rows are closer together

#### Scenario: Ceilings

- **WHEN** the player reaches the levels where speed, density and enemies have all hit their maxima
- **THEN** difficulty stays constant from there, while the level keeps counting

### Requirement: The level is shown while playing

The run HUD SHALL show the current level persistently, and SHALL announce a change of level with a
short banner. The score MUST keep the greater visual weight of the two.

#### Scenario: Level label

- **WHEN** a run is in progress
- **THEN** the current level is readable next to the score at all times

#### Scenario: Level change

- **WHEN** the level goes up
- **THEN** a banner announces the new level for about a second, without covering the ship

#### Scenario: The score stays primary

- **WHEN** the HUD shows score and level together
- **THEN** the score is the larger element and the level reads as secondary information
