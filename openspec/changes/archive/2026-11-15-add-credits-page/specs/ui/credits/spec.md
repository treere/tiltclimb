# Spec Delta

## Purpose

It is the page that tells why you play and who made the game: the story of the hero looking for their squad, the asset credits and the author's. It opens from the menu and closes by returning to the menu.

## ADDED Requirements

### Requirement: Credits page reachable from the menu

The menu SHALL offer a **CREDITS** command that opens the credits page, and the page SHALL offer an **BACK** command that returns to the menu. Opening the credits MUST NOT start a run nor lose the sensor calibration already done.

#### Scenario: Opening the credits

- **WHEN** the user presses **CREDITS** in the menu
- **THEN** the credits page opens and the run has not started

#### Scenario: Return to the menu

- **WHEN** the user presses **BACK** on the credits page
- **THEN** they return to the menu with calibration unchanged

### Requirement: The hero's story is told

The credits page SHALL contain a short story explaining the hero's situation — a pilot left alone after a jump gone wrong, the squad scattered, the climb as the only way to reach them — consistent with what happens in the game.

#### Scenario: Story present

- **WHEN** the user opens the credits
- **THEN** they read a text explaining who the hero is and why they are climbing among the asteroids

### Requirement: Asset and author credits

The page SHALL list the graphic assets with author and license, and SHALL report the game author with their role. Every piece of information MUST be legible on the page, not only in the repository files.

#### Scenario: Asset credits

- **WHEN** the user reads the credits
- **THEN** they find the graphic pack with author and license, and they find the game author's name with the role

### Requirement: Navigation without traps

From the credits page it SHALL always be possible to return to the menu with a single action, even on a phone, and there MUST NOT be a state in which the user is stuck.

#### Scenario: Return with one touch

- **WHEN** the user touches **BACK**
- **THEN** they return to the menu immediately, without additional confirmations
