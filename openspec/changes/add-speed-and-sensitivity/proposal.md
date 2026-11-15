# Proposal

## Why

Il gioco è leggibile ma troppo lento e troppo "duro": con 22° di inclinazione per arrivare a fondo scala, sul telefono si finisce per ruotare il polso di molto per spostarsi poco, e la salita a 190 px/s resta identica per tutta la partita. Le due cose insieme tolgono la curva: nessun momento in cui il gioco chiede di più, e nessun modo di adattare lo sterzo alla propria mano.

## What Changes

- **Sensibilità più alta di default**: il fondo scala scende da 22° a 13° di inclinazione, quindi la stessa inclinazione sposta la nave di molto di più. Con la stessa dead zone di 3°, per non rendere nervoso il centro.
- **Sensibilità configurabile dalla home**: cinque livelli (22°, 17°, 13°, 10°, 8°, quindi da "morbido" a "nervoso"), selezionabili con `−` e `+` nel menu, mostrati come livello e come gradi. La scelta resta memorizzata sul dispositivo.
- **Cambio senza ricalibrare**: la sensibilità scala solo l'ampiezza, non lo zero, quindi cambiarla non richiede di rifare la calibrazione.
- **Velocità di salita progressiva**: la salita parte da 190 px/s e cresce con l'altezza conquistata, fino a un tetto di 320 px/s. La crescita è legata ai pixel scalati, non al tempo: due partite con lo stesso percorso hanno la stessa difficoltà.
- **Scorrimento coerente**: parallasse, nemici e ostacoli seguono la velocità corrente invece della costante, così il mondo non si sfasa quando il gioco accelera.
- Fuori scope: difficoltà selezionabile a mano, ondate, boss, modifiche alla frequenza dei nemici, nuovi ostacoli, modifiche al punteggio.

## Capabilities

### New Capabilities

- `gameplay/difficulty-ramp`: la velocità di salita cresce con l'altezza, con tetto, in modo deterministico e coerente con tutto ciò che scorre.

### Modified Capabilities

- `input/tilt-control`: la sensibilità diventa un'impostazione a livelli, con default più reattivo e persistenza; la calibrazione non ne dipende.
- `ui/start-menu`: il menu ospita il controllo della sensibilità, visibile con il livello corrente e i gradi corrispondenti.

## Impact

- Codice: nuovo `src/game/speed.ts` (funzione pura della velocità in base all'altezza), `src/input/tilt-settings.ts` (livelli e persistenza), uso in `climb-scene.ts`, `player.ts`, `starfield.ts`, `enemy.ts`, e un nuovo controllo in `menu-scene.ts`.
- Costanti: `TILT_RANGE_DEG` diventa il livello di default (16°), `CLIMB_SPEED` resta come velocità iniziale e nasce `CLIMB_SPEED_MAX`.
- Il cambio di sensibilità tocca il feel di ogni partita: va provato a mano sul telefono, non solo misurato.
- Rischio principale: con più sensibilità e più velocità insieme, la parte alta della partita può diventare ingestibile; per questo il tetto di velocità è basso e la sensibilità massima è una scelta dell'utente.
