# Proposal

## Why

Oggi ogni nave nemica si comporta allo stesso modo: onda larga e un colpo dritto. Dopo un minuto di gioco si è visto tutto, e la difficoltà non cresce perché non arriva nulla di nuovo. Gli sprite disponibili nel pack sono venti navi più quattro UFO: bastano per dare a ogni tipo un carattere riconoscibile e per far entrare i più cattivi man mano che si sale.

## What Changes

- Quattro **archetipi** di nemico, ognuno con sprite proprio, movimento proprio e fuoco proprio:
  - **Pattuglia** (rossa): onda larga e lenta, un colpo dritto. È quella di oggi, la più facile.
  - **Picchiatore** (blu): scende veloce in diagonale verso il lato opposto, raffica di due colpi ravvicinati.
  - **Cacciatore** (verde): si sposta in orizzontale seguendo la posizione dell'eroe, spara un ventaglio di tre colpi verso il basso.
  - **Torretta UFO** (gialla): scende poco e staziona a mezza altezza, raffica di quattro colpi in sequenza, poi pausa lunga.
- **Comparsa progressiva**: si parte con la sola Pattuglia; gli altri tipi si sbloccano ad altezze crescenti raggiunte nella partita, e non compaiono prima.
- **Pressione crescente**: il limite di nemici contemporanei passa da 2 a 3 nella fase avanzata, insieme allo sblocco del Cacciatore.
- **Punteggio per tipo**: i nemici più difficili valgono più punti (25 / 35 / 45 / 60).
- **Proiettili inclinati**: il ventaglio del Cacciatore richiede colpi con direzione obliqua, quindi il proiettile impara un angolo; gli altri tipi continuano a sparare dritto verso il basso.
- Fuori scope: boss, formazioni coordinate fra nemici, nemici che inseguono in verticale, nuovi tipi oltre i quattro, modifiche all'eroe, al tilt, al menu o agli asteroidi.

## Capabilities

### New Capabilities

Nessuna: il combattimento esiste già come capability e questa change ne cambia il comportamento.

### Modified Capabilities

- `gameplay/combat`: la traiettoria delle navi nemiche non è più una sola onda uguale per tutti ma dipende dall'archetipo; il fuoco non è più un colpo singolo regolare ma dipende dall'archetipo, comprese raffiche e ventagli; si aggiungono la comparsa progressiva per altezza e il punteggio differenziato per tipo.

## Impact

- Asset: nuove navi `enemyBlue4`, `enemyGreen2`, `enemyRed1`, `ufoYellow` dal pack Kenney già nel repo (stessa licenza CC0, stesso `license.txt`).
- Codice: `src/game/enemy.ts` diventa una piccola gerarchia di archetipi con una tabella di configurazione; `src/game/projectile.ts` accetta un angolo di lancio; `src/game/combat-math.ts` guadagna la scelta del tipo in base all'altezza; `climb-scene.ts` cambia lo spawn e il limite dinamico; `constants.ts` raccoglie le soglie.
- Rischio principale: senza taratura, il Cacciatore che segue l'eroe può risultare ingiocabile su uno schermo stretto, perché toglie spazio lateralmente proprio dove si sterza.
