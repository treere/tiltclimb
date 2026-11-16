# Spec Delta

## MODIFIED Requirements

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
