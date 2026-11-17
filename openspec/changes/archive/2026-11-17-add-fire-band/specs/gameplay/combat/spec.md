# Spec Delta

## MODIFIED Requirements

### Requirement: Single-shot hero fire

The hero SHALL be able to fire in two ways: with the button placed in the lower part of the screen, and by **tapping anywhere in the bottom band of the play area**, where the band is the strip reserved for the controls. Every tap SHALL produce exactly one shot, with no automatic burst. A gesture that steers — a drag — MUST NOT fire, so the same band serves both without ambiguity. The shot SHALL start from the ship and travel upward. The button SHALL stay reachable by the thumb without covering the ship or the incoming asteroids.

#### Scenario: One tap, one shot

- **WHEN** the user taps the fire button once
- **THEN** a single shot is fired, regardless of how long the button is held down

#### Scenario: Tap in the band

- **WHEN** the user taps the bottom band away from the button, without moving the finger
- **THEN** a single shot is fired, exactly as with the button

#### Scenario: Drag is not a shot

- **WHEN** the user presses in the band and drags to steer
- **THEN** the ship steers and no shot is fired when the finger lifts

#### Scenario: One tap cannot fire twice

- **WHEN** the user taps the button itself, which lies inside the band
- **THEN** exactly one shot is fired

#### Scenario: Middle of the screen is inert

- **WHEN** the user taps the play area above the band
- **THEN** nothing is fired

#### Scenario: Repeated taps

- **WHEN** the user taps the button or the band several times in quick succession
- **THEN** one shot is fired for every recognized tap, with no automatic burst

#### Scenario: The shot travels upward

- **WHEN** a shot is fired
- **THEN** it moves upward and disappears when it leaves the screen

#### Scenario: Jammed cannon

- **WHEN** the player taps the band while the cannon is overheated
- **THEN** no shot is fired, and the control shows that the cannon is cooling
