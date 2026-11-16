# Spec Delta

## Purpose

Defines which results survive a session: the best score and the best kill count stay on the device
and are shown again when the game reopens.

## ADDED Requirements

### Requirement: Best result persists on the device

The system SHALL store the best score and the best kill count in the browser's local storage and
SHALL read them back when the game starts, so that a reload, a closed tab or a device reboot does not
lose them.

#### Scenario: Record survives a reload

- **WHEN** the player sets a new best score and reloads the page
- **THEN** the menu shows that best score, not zero

#### Scenario: Record survives a closed tab

- **WHEN** the player closes the tab and opens the game again later
- **THEN** the stored best score is still the one to beat

### Requirement: Storage failures never reach the player

If the storage is unavailable, denies access or throws on read or write, the system SHALL keep
working with a best result that lasts for the session, without errors and without blocking the run.

#### Scenario: Storage denied

- **WHEN** reading or writing the storage throws
- **THEN** the game plays normally, the menu shows the best of the session, and nothing is reported
  to the player

#### Scenario: Corrupted value

- **WHEN** the stored value is missing, not a number, negative or otherwise invalid
- **THEN** the game treats it as no record and starts from zero

### Requirement: Recording a new best

The system SHALL update the stored best score and best kills at the same moment it updates the
in-memory values, and only when a run beats them.

#### Scenario: A run beats the record

- **WHEN** a run ends with a score higher than the stored best
- **THEN** the stored value is updated immediately, the run is treated as a record, and the menu
  shows the new value

#### Scenario: A run does not beat the record

- **WHEN** a run ends below the stored best
- **THEN** the stored value is left untouched, and the last run is still shown separately

#### Scenario: First run with no stored record

- **WHEN** the game is opened for the first time and a run scores above zero
- **THEN** that run is a record, because there was no stored best to beat
