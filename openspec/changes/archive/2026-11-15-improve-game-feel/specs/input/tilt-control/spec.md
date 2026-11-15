# Spec Delta

## MODIFIED Requirements

### Requirement: Steering proportional to tilt

With the sensors active, the system SHALL translate the device's left/right tilt into a horizontal speed for the player, proportional to the tilt angle and with a sign matching the direction. Tilting right SHALL move the player to the right and tilting left to the left, on a screen in portrait orientation. The proportionality MUST use the full-scale tilt chosen as sensitivity, and the full-scale horizontal speed MUST be high enough to cross the visible width in about two seconds.

#### Scenario: Tilting to the right

- **WHEN** the phone is tilted to the right beyond the dead zone
- **THEN** the player moves to the right, faster the greater the angle

#### Scenario: Phone flat

- **WHEN** the phone is held at the neutral tilt
- **THEN** the player does not move horizontally on its own

#### Scenario: More responsive default

- **WHEN** the game is started without saved settings
- **THEN** the ship reaches full scale at a lower tilt than in versions before the sensitivity setting

#### Scenario: Crossing the screen

- **WHEN** the phone is held at full scale for one direction
- **THEN** the player crosses the visible width in roughly two seconds, not more

### Requirement: Smoothing and dead zone

The system SHALL filter the sensor readings to reduce jitter and SHALL ignore tilts below a minimum threshold, so the player does not twitch when the phone is almost still. The threshold MUST be small enough that a deliberate small correction registers, and the response MUST grow continuously from the threshold instead of starting with a step. Movement SHALL be smooth rather than jerky at the refresh rate available on the device.

#### Scenario: Jitter from a steady hand

- **WHEN** the phone is still but the sensor wobbles by a few tenths of a degree
- **THEN** the player stays motionless

#### Scenario: Small correction

- **WHEN** the player tilts the phone just past the threshold
- **THEN** the ship starts moving slowly and smoothly, without a jump in speed at the threshold

#### Scenario: Time to full scale

- **WHEN** the player tips the phone from neutral to full scale
- **THEN** the steering reaches most of its speed within a few tens of milliseconds, not a fifth of a second

#### Scenario: Low refresh rate

- **WHEN** the device emits orientation events fewer than 30 times per second
- **THEN** the player's movement stays continuous, without visible jumps
