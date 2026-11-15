# Spec Delta

## REMOVED Requirements

### Requirement: Run cycle with immediate restart

**Reason**: the run no longer restarts with a touch on the end screen: now the game returns to the menu, where the result is shown together with the calibration and start commands. The blind restart left no room for the summary nor for correcting the setup.

**Migration**: after death the game returns to the menu; to play again you press **Start game**. The score of the run just ended and the session best are shown in the menu.

## ADDED Requirements

### Requirement: Run cycle with return to the menu

At the end of a run the system SHALL return to the menu within a time perceived as immediate, without reloading the page, and MUST NOT restart the game automatically. In the menu the outcome of the run just ended SHALL be visible.

#### Scenario: Return to the menu after the collision

- **WHEN** the player touches an obstacle
- **THEN** the run closes and the screen becomes the menu, with the outcome just obtained

#### Scenario: No automatic restart

- **WHEN** the game returns to the menu after a defeat
- **THEN** no new run starts until the user presses **Start game**

#### Scenario: Clean new run

- **WHEN** the user presses **Start game** after a defeat
- **THEN** the scene restarts from the initial state, with the score at zero and the obstacles reset
