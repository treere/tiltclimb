# Spec Delta

## Purpose

Defines what is heard and when: one music for the menu and one for the run, a timbre for each enemy, an explosion for each kill, the sound of defeat and the one of the best score, and the ability to silence everything.

## ADDED Requirements

### Requirement: Music in both scenes

The system SHALL play a looping music track in the menu and a different track during the run. The switch from one to the other SHALL happen on the scene change, without prolonged overlaps, and the run track SHALL restart from the beginning on every run.

#### Scenario: Menu music

- **WHEN** the user is in the menu
- **THEN** they hear the menu track looping

#### Scenario: Run music

- **WHEN** the run starts
- **THEN** the menu track stops and the run track starts

#### Scenario: Return to the menu

- **WHEN** the run ends and the game returns to the menu
- **THEN** the run music stops and the menu one resumes

### Requirement: No sound before a user gesture

Audio SHALL start only after a user gesture (touch or key), because browsers block automatic playback. If audio is unavailable or is blocked, the game SHALL remain playable and MUST NOT show blocking errors.

#### Scenario: First touch

- **WHEN** the user touches the screen for the first time
- **THEN** audio unlocks and the menu music starts

#### Scenario: Audio blocked by the browser

- **WHEN** the browser refuses playback
- **THEN** the game continues without audio and without intrusive error messages

### Requirement: Effects tied to events

The system SHALL play an effect for every relevant event: hero shot, enemy ship shot, enemy ship destroyed, hero death. The effects SHALL be short and overlappable, so that several events close together do not cut each other off.

#### Scenario: Hero shot

- **WHEN** the hero fires
- **THEN** a shot effect is heard, even if another shot was still playing

#### Scenario: Kill

- **WHEN** a hero shot destroys an enemy ship
- **THEN** an explosion is heard at the point where the ship was

### Requirement: A timbre for each enemy type

Each enemy archetype SHALL have its own shot sound and its own explosion sound, distinguishable from one another even without looking at the screen.

#### Scenario: Four enemies, four voices

- **WHEN** different types of enemy ship fire or are destroyed
- **THEN** the sounds are recognizably different per type

### Requirement: Defeat sound and best-score sound

At the end of a run the system SHALL play a defeat sound. If the run's score beats the previous session's best, it SHALL instead play a different sound, recognizable as success.

#### Scenario: Normal defeat

- **WHEN** the run ends without beating the best score
- **THEN** the defeat sound is heard

#### Scenario: Best score beaten

- **WHEN** the run ends with a score higher than the previous best
- **THEN** the best-score sound is heard, not the defeat one

### Requirement: Audio switch

The menu SHALL offer a command to enable or disable all audio, visible and reachable with a thumb. The state SHALL be remembered between sessions on the same device, and with audio disabled no sound MUST start.

#### Scenario: Disabling

- **WHEN** the user disables audio from the menu
- **THEN** music and effects stop and do not restart on the scene change

#### Scenario: Remembered state

- **WHEN** the user reloads the game after disabling audio
- **THEN** the game restarts silent, with the command in the disabled state
