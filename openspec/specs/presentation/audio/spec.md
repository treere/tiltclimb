# presentation/audio Specification

## Purpose
Defines what you hear and when: one music track for the menu and one for the run, a voice for every enemy, an explosion for every shoot-down, the defeat sound and the best-score sound, and the option to silence everything.

## Requirements

### Requirement: Music in both scenes

The system SHALL play a looping music track in the menu and a different track during the run. The switch from one to the other SHALL happen on the scene change, without prolonged overlaps, and the run track SHALL restart from the beginning on every run.

#### Scenario: Menu music

- **WHEN** the user is in the menu
- **THEN** they hear the menu track on loop

#### Scenario: Run music

- **WHEN** the run starts
- **THEN** the menu track stops and the run one starts

#### Scenario: Return to the menu

- **WHEN** the run ends and the game returns to the menu
- **THEN** the run music stops and the menu one resumes

### Requirement: No sound before a user gesture

Audio SHALL start only after a user gesture (tap or key), because browsers block automatic playback. If audio is unavailable or blocked, the game SHALL stay playable and MUST NOT show blocking errors.

#### Scenario: First tap

- **WHEN** the user taps the screen for the first time
- **THEN** audio unlocks and the menu music starts

#### Scenario: Audio blocked by the browser

- **WHEN** the browser refuses playback
- **THEN** the game goes on without audio and without intrusive error messages

### Requirement: Effects tied to events

The system SHALL play an effect for every relevant event: hero shot, enemy ship shot, enemy ship shot down, hero death. The effects SHALL be short and overlappable, so that several close events do not cut each other off.

#### Scenario: Hero shot

- **WHEN** the hero fires
- **THEN** a shot effect is heard, even if another shot was still playing

#### Scenario: Shoot-down

- **WHEN** a hero shot destroys an enemy ship
- **THEN** an explosion is heard at the point where the ship was

### Requirement: One voice per enemy type

Every enemy archetype SHALL have its own shot sound and its own explosion sound, distinguishable from each other even without looking at the screen.

#### Scenario: Four enemies, four voices

- **WHEN** different enemy ship types fire or are shot down
- **THEN** the sounds are recognizably different per type

### Requirement: Defeat sound and best-score sound

At the end of a run the system SHALL play a defeat sound. If the run's score beats the previous session's best score, it SHALL play a different sound instead, recognizable as success.

#### Scenario: Normal defeat

- **WHEN** the run ends without beating the best score
- **THEN** the defeat sound is heard

#### Scenario: Best score beaten

- **WHEN** the run ends with a score higher than the previous best score
- **THEN** the best-score sound is heard, not the defeat one

### Requirement: Audio toggle

The menu SHALL offer a command to turn all audio on or off, visible and reachable with the thumb. The state SHALL be remembered between sessions on the same device, and with audio turned off MUST NOT any sound start.

#### Scenario: Turning it off

- **WHEN** the user turns audio off from the menu
- **THEN** music and effects stop and do not restart on the scene change

#### Scenario: State remembered

- **WHEN** the user reloads the game after turning audio off
- **THEN** the game restarts silent, with the command in the off state
