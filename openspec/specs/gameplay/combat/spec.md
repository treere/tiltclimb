# gameplay/combat Specification

## Purpose
Defines the fight: the hero fires from the button at the bottom, enemy ships descend zigzagging and shoot downward, and the rules state what gets hit and what does not — including asteroid immunities.

## Requirements

### Requirement: Single-shot hero fire

The hero SHALL be able to fire by pressing a button placed in the lower part of the screen, and every tap SHALL produce exactly one shot, with no automatic burst. A shot SHALL be produced only while the cannon is not jammed by heat. The shot SHALL start from the ship and travel upward. The button SHALL stay reachable by the thumb without covering the ship or the incoming asteroids.

#### Scenario: One tap, one shot

- **WHEN** the user taps the fire button once
- **THEN** a single shot is fired, regardless of how long the button is held down

#### Scenario: Repeated taps

- **WHEN** the user taps the button several times in quick succession
- **THEN** one shot is fired for every recognized tap while the cannon is not jammed, with no automatic burst

#### Scenario: The shot travels upward

- **WHEN** a shot is fired
- **THEN** it moves upward and disappears when it leaves the screen

#### Scenario: Jammed cannon

- **WHEN** the player taps the button while the cannon is overheated
- **THEN** no shot is fired, and the control shows that the cannon is cooling

### Requirement: Enemy fire downward

Every enemy ship SHALL fire downward-directed projectiles at regular intervals and at a lower speed than the hero's shots, with a pattern that depends on its archetype: single shot, tight burst or fan of oblique shots. Enemy projectiles SHALL disappear when they leave the screen.

#### Scenario: Enemy burst

- **WHEN** an enemy ship stays on screen for the expected time
- **THEN** it fires according to its archetype pattern and keeps doing so at regular intervals

#### Scenario: Diver burst

- **WHEN** a diver opens fire
- **THEN** it fires two shots in quick succession, not just one

#### Scenario: Hunter fan

- **WHEN** a hunter opens fire
- **THEN** it fires three downward shots, with the side ones slanted

#### Scenario: Turret sequence

- **WHEN** the turret opens fire
- **THEN** it fires four shots in quick sequence and then stays silent for a long time

#### Scenario: Projectile leaving the screen

- **WHEN** an enemy projectile crosses the bottom or side edge of the view
- **THEN** it is removed from the game

### Requirement: Combat collision rules

A hero shot that hits an enemy ship SHALL destroy it, because enemy ships withstand a single shot. Contact between the hero and an enemy ship or an enemy projectile SHALL end the run, as does contact with an asteroid. Hero shots MUST pass through asteroids without being consumed, and enemy ships MUST pass through asteroids without taking damage.

#### Scenario: Enemy ship shot down

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
- **THEN** the shot keeps travelling and the asteroid stays intact

#### Scenario: Enemy ship over an asteroid

- **WHEN** an enemy ship crosses the position of an asteroid
- **THEN** neither of them is destroyed and the ship continues on its trajectory

### Requirement: Score for shoot-downs

Every enemy ship shot down SHALL award points to the current run's score, and the number of shoot-downs SHALL be reported in the summary shown by the menu at the end of the run.

#### Scenario: Points for a shoot-down

- **WHEN** the hero shoots down an enemy ship
- **THEN** the score increases by the value expected for a shoot-down

#### Scenario: Summary with shoot-downs

- **WHEN** the run ends
- **THEN** the menu shows the score achieved and the number of ships shot down

### Requirement: Enemy archetypes with their own movement

The system SHALL have four enemy ship types, each with a distinct sprite and its own movement: a patrol that oscillates while descending, a diver that descends diagonally towards the opposite side, a hunter that follows the hero horizontally, a turret that stations at mid height. Each type MUST stay inside the world bounds.

#### Scenario: Patrol

- **WHEN** a patrol crosses the screen
- **THEN** it descends slowly, oscillating horizontally

#### Scenario: Diver

- **WHEN** a diver enters the scene
- **THEN** it descends faster than the others and moves towards the side opposite to the one it entered from

#### Scenario: Hunter

- **WHEN** a hunter is on screen
- **THEN** its horizontal position approaches the hero's, without overtaking it in jumps

#### Scenario: Turret

- **WHEN** a turret enters the scene
- **THEN** it descends to about half height and then stays there, oscillating slowly

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

### Requirement: Score by enemy type

Every enemy ship type SHALL award a different point value based on difficulty: patrol 25, diver 35, hunter 45, turret 60.

#### Scenario: Patrol shot down

- **WHEN** the hero shoots down a patrol
- **THEN** the score increases by 25

#### Scenario: Turret shot down

- **WHEN** the hero shoots down a turret
- **THEN** the score increases by 60

#### Scenario: Summary of shoot-downs

- **WHEN** the run ends
- **THEN** the summary counts all the ships shot down, regardless of type
