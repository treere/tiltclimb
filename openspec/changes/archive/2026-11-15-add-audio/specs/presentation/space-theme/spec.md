# Spec Delta

## MODIFIED Requirements

### Requirement: Documented asset provenance and license

Every external asset, graphic, audio or of any other kind, SHALL be accompanied in the repository by the original license file or an equivalent license note, and SHALL be listed with author, license and provenance in a credits section of `README.md`. Assets of unknown or non-redistributable license MUST NOT be used.

#### Scenario: New asset added

- **WHEN** a new graphic or audio file is introduced
- **THEN** its license is present in the repository and the credit is in the README

#### Scenario: Provenance check

- **WHEN** the repository is inspected offline
- **THEN** it is possible to reconstruct where each image and each sound comes from, and under which license

## ADDED Requirements

### Requirement: Collisions are animated

When an enemy ship is destroyed or the hero dies, the system SHALL show a frame animation explosion at the point of impact, of short duration and without blocking the game. Asteroids, immune to shots, MUST NOT explode.

#### Scenario: Enemy ship destroyed

- **WHEN** a hero shot destroys an enemy ship
- **THEN** an animated explosion appears in its place and fades out on its own

#### Scenario: Hero death

- **WHEN** the hero is hit
- **THEN** a larger explosion appears and the run ends

#### Scenario: Asteroid hit

- **WHEN** a shot passes through an asteroid
- **THEN** no explosion appears
