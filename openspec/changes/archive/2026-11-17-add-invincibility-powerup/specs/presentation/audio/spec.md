# Spec Delta

## MODIFIED Requirements

### Requirement: Effects tied to events

The system SHALL play an effect for every relevant event: hero shot, enemy ship shot, enemy ship shot down, hero death, and **power-up pickup**. The effects SHALL be short and overlappable, so that several close events do not cut each other off, and MUST NOT restart or interrupt the music.

#### Scenario: Hero shot

- **WHEN** the hero fires
- **THEN** a shot effect is heard, even if another shot was still playing

#### Scenario: Shoot-down

- **WHEN** a hero shot destroys an enemy ship
- **THEN** an explosion is heard at the point where the ship was

#### Scenario: Pickup

- **WHEN** the hero collects a power-up
- **THEN** the pickup jingle is heard over the music, without restarting or stopping it
