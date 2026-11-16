# Spec Delta

## Purpose

Defines the cost of firing: the cannon heats up with use, cools down with time, jams when it
overheats, and shows its state so the player can plan the next shot.

## ADDED Requirements

### Requirement: Firing heats the cannon

Every shot SHALL add a fixed amount of heat to the cannon. The heat MUST be a value between zero and
a maximum, and MUST be visible to the player while the run is in progress.

#### Scenario: A shot adds heat

- **WHEN** the player fires with a cold cannon
- **THEN** the heat rises by one shot's worth

#### Scenario: Heat is capped

- **WHEN** shots are fired until the heat reaches the maximum
- **THEN** the heat does not exceed the maximum

### Requirement: The cannon cools down with time

The heat SHALL fall while the cannon is not firing, at a rate expressed per second so it does not
depend on the frame rate. Cooling MUST NOT continue while the run is paused.

#### Scenario: Cooling while climbing

- **WHEN** the player stops firing
- **THEN** the heat falls steadily, and the bar shows it

#### Scenario: Paused cooling

- **WHEN** the run is paused
- **THEN** the heat does not change, and it resumes falling when the run resumes

### Requirement: Overheating jams the cannon

When the heat reaches the maximum the cannon SHALL jam: firing MUST produce no shot and MUST NOT add
heat until the heat has fallen to a reset threshold. The jam SHALL be visible on the fire control.

#### Scenario: Reaching the maximum

- **WHEN** the heat reaches the maximum
- **THEN** the next taps produce no shot, and the fire control shows that the cannon is jammed

#### Scenario: Cooling down to the reset threshold

- **WHEN** the heat falls back to the reset threshold
- **THEN** the cannon fires again, without any other action from the player

#### Scenario: Tapping while jammed

- **WHEN** the player taps the fire control while the cannon is jammed
- **THEN** nothing is fired and no heat is added, so tapping does not delay the cooldown

### Requirement: The heat is visible

The run HUD SHALL show the heat as a bar that fills with it, with a colour that says cold, hot or
jammed, placed next to the fire control without covering the play area. The fire control SHALL change
its label and dim while the cannon is jammed.

#### Scenario: Bar follows the heat

- **WHEN** the heat rises or falls
- **THEN** the bar follows it immediately

#### Scenario: Jammed state

- **WHEN** the cannon jams
- **THEN** the bar is at the maximum in the jammed colour, and the fire control reads as unavailable

### Requirement: Each run starts cold

A new run SHALL start with the cannon at zero heat, whatever the previous run ended with.

#### Scenario: New run

- **WHEN** a run starts, including the one after a jam
- **THEN** the heat is zero and the first shot is available immediately
