# Spec Delta

## MODIFIED Requirements

### Requirement: Return to the menu with a summary of the result

At the end of a run the system SHALL return to the menu instead of restarting the game, and the menu
SHALL show the score just achieved together with the best result **stored on the device**, as two
distinct values. The stored best SHALL be shown even when no run has been played since the game was
opened, and SHALL update only when the score just achieved beats it.

#### Scenario: Return after the defeat

- **WHEN** the player dies after scoring 42 points
- **THEN** they return to the menu, which shows 42 as the score just achieved

#### Scenario: Best score updated

- **WHEN** the score just achieved beats the stored best score
- **THEN** the displayed best score becomes the one just achieved, and it is stored on the device

#### Scenario: Best score does not get worse

- **WHEN** the score just achieved is lower than the stored best score
- **THEN** the displayed best score stays unchanged

#### Scenario: Opening the game with a stored record

- **WHEN** the game is opened and there is a stored best but no run has been played yet
- **THEN** the menu shows the stored best and the stored best kill count, not a zero

#### Scenario: Opening the game with nothing stored

- **WHEN** the game is opened for the first time
- **THEN** no result line is shown until a run has been played
