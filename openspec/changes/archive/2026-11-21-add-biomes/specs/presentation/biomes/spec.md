# Spec Delta

## ADDED Requirements

### Requirement: Five-level biome cycle

The run SHALL be divided into biomes of five consecutive levels each, and the biome SHALL depend only on
the level, so the same level always shows the same biome. The run SHALL cycle through four biomes in a
fixed order and start the cycle again after the fourth, so an endless climb keeps naming sectors. The
biome MUST NOT change speed, obstacle spacing, enemy behaviour or points.

#### Scenario: A biome lasts five levels

- **WHEN** the player reaches levels 1 to 5
- **THEN** the same biome is shown for all five

#### Scenario: The boundary changes it

- **WHEN** the player enters level 6
- **THEN** the second biome replaces the first

#### Scenario: The cycle repeats

- **WHEN** the player reaches level 21
- **THEN** the first biome is shown again

#### Scenario: Gameplay untouched

- **WHEN** any biome is compared with another at the same level
- **THEN** climb speed, obstacle spacing, enemy behaviour and points are identical

### Requirement: The sector is announced

On entering the first level of a biome, the level banner SHALL show the name of the sector instead of
the level number. Inside a biome, the banner SHALL keep showing the level number as before.

#### Scenario: New sector

- **WHEN** the player crosses into a new biome
- **THEN** the banner shows the sector name and its number

#### Scenario: Ordinary level

- **WHEN** the player enters a level inside the current biome
- **THEN** the banner shows the level number

### Requirement: Palette change is a crossfade

The background palette SHALL change with a crossfade of about 600 ms rather than an abrupt swap. While
the crossfade plays, the background MUST still cover the whole visible area with no empty band, and the
scrolling MUST NOT stop or stutter.

#### Scenario: Crossfade

- **WHEN** the biome changes
- **THEN** the old palette fades out as the new one fades in, over roughly 600 ms

#### Scenario: No gap during the crossfade

- **WHEN** the crossfade is playing
- **THEN** no empty band appears and the background keeps scrolling

### Requirement: Readability across palettes

Every biome palette SHALL keep the asteroids, the enemy ships, the player ship, the starfield and the
HUD text clearly distinguishable. No palette MAY make a hazard hard to see against the background.

#### Scenario: Hazards stay visible

- **WHEN** the player plays in any biome
- **THEN** asteroids and enemy ships stand out from the background and the HUD stays legible
