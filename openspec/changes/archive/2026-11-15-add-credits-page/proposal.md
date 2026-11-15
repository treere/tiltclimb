# Proposal

## Why

The game does not say why you are climbing: there is a spaceship, there are asteroids, and that is it. A credits page gives the climb a reason (reaching the squad), puts on paper who did what — starting with Andrea Tomasi — and documents the assets where a human being looks for them, instead of only inside `license.txt`.

In the same pass the legibility is fixed, which today is the weak point of the interface: the buttons are semi-transparent panels on a starfield that passes under the text, and the labels lose contrast exactly where they are needed.

## What Changes

- **New Credits screen**, reachable from the menu with a third button **CREDITS** below **Start game**. It contains: the hero's story in a few lines, the asset credits (Kenney, CC0) and the author with their role. An **BACK** button returns to the menu.
- **Story**: four lines explaining the climb — a jump gone wrong, the squad scattered, a route marked by wrecks, fuel running out.
- **Author in the credits**: Andrea Tomasi, idea, game design and direction.
- **Redesigned buttons**: **opaque** dark background instead of semi-transparent, more pronounced bright border, larger white label with a shadow behind the text, so that it stays legible over the stars.
- **Legible texts everywhere**: shadow under the menu and HUD text, minimum sizes, and a verified contrast (ratio of at least 7:1 between text and background) instead of "by eye".
- Out of scope: audio, credits page animations, clickable external links, other languages, changes to gameplay, enemies, scores or calibration.

## Capabilities

### New Capabilities

- `ui/credits`: credits screen reachable from the menu, with the story that motivates the adventure, the asset and author credits, and the return to the menu.

### Modified Capabilities

- `ui/start-menu`: the menu no longer has two commands but three, because access to the credits is added.
- `presentation/space-theme`: the buttons must be opaque and have a verifiable minimum contrast, and the texts must stay legible on a starfield even outside the buttons.

## Impact

- Code: new `src/game/credits-scene.ts`, text content in `src/game/credits-text.ts`, tweaks to `menu-scene.ts` (third button and navigation), `src/ui/button.ts` (opaque background, border, text with shadow), `src/main.ts` (scene registration), `constants.ts`.
- No new assets: the page uses the starfield and the ship already present.
- Risk: adding a third button to the menu means reviewing the heights, otherwise on short screens the commands end up below the edge or on top of the ship.
