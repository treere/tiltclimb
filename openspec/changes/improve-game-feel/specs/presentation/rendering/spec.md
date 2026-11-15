# Spec Delta

## Purpose

Defines how sharp and how smooth the game has to look: at what pixel density it renders, which filter policy it uses, and how motion is paced against the device refresh rate.

## ADDED Requirements

### Requirement: Rendering at device pixel density

The game SHALL render at the device's physical pixel density, capped so that a very high density does not cost frames. The canvas backing store MUST match the physical pixels of the visible area up to that cap, and MUST NOT be a smaller buffer stretched to fill the screen.

#### Scenario: High-density phone

- **WHEN** the game runs on a phone whose physical width is larger than the logical resolution
- **THEN** the rendered buffer matches the physical pixels up to the cap, and the image is not blurred by an upscale

#### Scenario: Density cap

- **WHEN** the device density is above the cap
- **THEN** the game renders at the cap and stays smooth, rather than at full density with dropped frames

### Requirement: Crisp sprite edges

The game SHALL NOT apply smoothing filters when scaling the drawn buffer, and sprites SHALL keep hard edges consistent with their pixel-art origin.

#### Scenario: Sprite close-up

- **WHEN** a sprite is drawn at a larger size than its source bitmap
- **THEN** its edges stay sharp and readable instead of being interpolated

### Requirement: Frame pacing follows the device

The game SHALL advance motion on the real elapsed time between frames, so the number of distinct frames drawn per second follows the device refresh rate. All speeds MUST be expressed per second, so a 60 Hz and a 120 Hz device show the same movement per second.

#### Scenario: High refresh rate

- **WHEN** the game runs on a device with a refresh rate above 60 Hz
- **THEN** the motion is drawn at that rate rather than repeating the same state across two frames

#### Scenario: Same speed per second

- **WHEN** the same run is played on a 60 Hz and on a 120 Hz device
- **THEN** the player covers the same distance per second on both

#### Scenario: Collisions at high speed

- **WHEN** a projectile moves fast relative to the frame interval
- **THEN** it still registers a hit on the actor it crosses, without passing through it
