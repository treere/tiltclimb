# presentation/pwa Specification

## Purpose
Defines what makes the game behave like an installed app: a manifest that the phone can install, a
service worker that lets it start without a network, and a caching scheme that cannot serve an old
build.

## Requirements

### Requirement: Installable on the home screen

The game SHALL expose a web app manifest with name, short name, start URL, background and theme
colour, portrait orientation, and icons at 192, 512 and a maskable 512 pixels. Installed from the
browser, it SHALL open without browser chrome, using the whole screen.

#### Scenario: Adding to the home screen

- **WHEN** the player installs the game from the browser
- **THEN** an icon appears on the home screen and opening it shows the game full screen, without an
  address bar

#### Scenario: Icon on the home screen

- **WHEN** the icon is rendered by the system at small size
- **THEN** the ship is recognisable and the maskable variant does not crop it

### Requirement: Offline after the first visit

After one successful visit the game SHALL open and play without a network connection: the bundle, the
sprites, the audio and the explosion frames MUST all be available from the cache.

#### Scenario: Reopening without signal

- **WHEN** the player opens the installed game with no network
- **THEN** the loading screen, the menu and a full run work as usual

#### Scenario: First visit without signal

- **WHEN** the game is opened with no network and nothing cached
- **THEN** it reports the failure instead of showing a blank screen

### Requirement: No stale build

The cache SHALL be identified by the build, and activating a new version SHALL delete the previous
cache. The document (`index.html`) SHALL be fetched from the network when available, falling back to
the cache, so a new deploy is picked up on the next open.

#### Scenario: New deploy

- **WHEN** a new version is deployed and the player opens the game online
- **THEN** the new version is used, and the old cache is removed

#### Scenario: Worker not available

- **WHEN** the browser has no service worker support or registration fails
- **THEN** the game works exactly as before, with no error shown to the player

### Requirement: Updates never interrupt a run

The system MUST NOT reload or swap the running build while a run is in progress.

#### Scenario: New version while playing

- **WHEN** a new version becomes available during a run
- **THEN** the run continues on the current version, and the new one is used at the next open
