# Spec Delta

## MODIFIED Requirements

### Requirement: Progressive appearance of the harder enemies

The harder types SHALL unlock at level boundaries, and a type MUST NOT appear before the level that introduces it. The limit of simultaneous enemy ships SHALL grow with the level: two at the start, three from the fourth level, and at most one more from the level that introduces the UFO, within the size of the pool.

#### Scenario: Start of the run

- **WHEN** the run has just started, at level one
- **THEN** only patrols appear

#### Scenario: Unlock past the threshold

- **WHEN** the run reaches the level that introduces a type
- **THEN** that type can appear, while the types with a higher level stay excluded

#### Scenario: Limit that grows

- **WHEN** the run reaches the fourth level
- **THEN** up to three enemy ships can be present at the same time

#### Scenario: The level decides, not the height inside it

- **WHEN** the player climbs inside a level, short of the next boundary
- **THEN** no new type appears and the simultaneous limit does not change
