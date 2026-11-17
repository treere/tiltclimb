# Spec Delta

## MODIFIED Requirements

### Requirement: Combat collision rules

A hero shot that hits an enemy ship SHALL destroy it, because enemy ships withstand a single shot. Contact between the hero and an enemy ship or an enemy projectile SHALL end the run, as does contact with an asteroid, **unless the hero is powered: while invincible, contact with a ship destroys the ship and contact with an asteroid or a projectile does not end the run**. Hero shots MUST pass through asteroids without being consumed, and enemy ships MUST pass through asteroids without taking damage.

#### Scenario: Enemy ship shot down

- **WHEN** a hero shot reaches an enemy ship
- **THEN** the ship disappears and the shot is consumed

#### Scenario: Hero hit by a projectile

- **WHEN** an enemy projectile touches the hero
- **THEN** the run ends

#### Scenario: Hero hit by a ship

- **WHEN** an enemy ship touches the hero
- **THEN** the run ends

#### Scenario: Asteroid immune to shots

- **WHEN** a hero shot passes through an asteroid
- **THEN** the shot keeps travelling and the asteroid stays intact

#### Scenario: Enemy ship over an asteroid

- **WHEN** an enemy ship crosses the position of an asteroid
- **THEN** neither of them is destroyed and the ship continues on its trajectory

#### Scenario: Powered hero against a ship

- **WHEN** the hero is invincible and touches an enemy ship
- **THEN** the ship is destroyed as if shot, and the run continues

#### Scenario: Powered hero against an asteroid

- **WHEN** the hero is invincible and crosses an asteroid
- **THEN** nothing happens and the run continues

#### Scenario: Powered hero against a projectile

- **WHEN** the hero is invincible and is touched by an enemy projectile
- **THEN** the projectile is consumed and the run continues
