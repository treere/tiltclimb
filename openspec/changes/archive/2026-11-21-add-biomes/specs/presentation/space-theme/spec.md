# Spec Delta

## MODIFIED Requirements

### Requirement: Scrolling starfield

The background SHALL be a starfield scrolling downward while the player climbs, with at least two layers at different speeds to give depth. The background MUST always cover the whole visible area, with no empty edges or visible seams while scrolling. The near layer — the background tiles — MUST travel at a meaningful fraction of the climb speed, at least half of it, so the climb reads as fast motion instead of a slow drift. The tiles SHALL come from the palette of the current biome.

#### Scenario: Continuous scrolling

- **WHEN** the player climbs for a long stretch
- **THEN** the background scrolls without interruptions and without showing empty bands or cuts

#### Scenario: Depth

- **WHEN** the background scrolls
- **THEN** the farther elements move more slowly than the near ones

#### Scenario: Sense of speed

- **WHEN** a run starts, with the climb at its initial speed
- **THEN** the near background layer moves at no less than half the climb speed, and it accelerates with it

#### Scenario: Biome palette

- **WHEN** the run is inside a biome
- **THEN** the background tiles are the ones of that biome
