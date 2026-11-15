# Proposal

## Why

Il gioco funziona ma è fatto di rettangoli: non comunica cosa si sta giocando né perché sterzare. Con un'astronave, un campo di asteroidi e uno sfondo stellato che scorre, il tema diventa leggibile a colpo d'occhio e il tilt acquista un senso fisico ("sto pilotando"). Serve inoltre una base grafica con licenza pulita, documentata nel repo, per non doverla rifare quando il progetto cresce.

## What Changes

- **Eroe**: il rettangolo diventa un'astronave (sprite Kenney `playerShip2_blue`, 112×75) con **scia animata** ai motori (20 frame `fire00–fire19`, 16×40) riprodotta sotto la nave.
- **Ostacoli**: i rettangoli diventano **asteroidi** (21 meteore Kenney brown/grey, da tiny a big), ognuno con dimensione e **rotazione casuale** che continua a girare mentre scorre: il movimento rende l'animazione.
- **Sfondo**: campo stellato a **parallasse su due strati** che scorre verso il basso mentre la nave sale — tassello `darkPurple.png` 256×256 ripetuto per il fondo, più stelle piccole disegnate a varie velocità per la profondità.
- **Menu**: stessa atmosfera (sfondo stellato fermo o lentissimo, nave come illustrazione, colori coerenti), **etichette dei pulsanti centrate** — il bug attuale è che il testo lungo allarga i bounds del gruppo grafico e sposta il fondo.
- **Licenze**: gli asset entrano in `public/assets/kenney/` con il `license.txt` originale accanto, provenienza e credito (CC0, Kenney) nel `README.md`.
- Fuori scope: spari, laser, nemici, power-up, punteggi per distruzione, particelle di impatto, audio/musica, modifica di fisica, velocità o difficoltà, animazione del menu diversa da quella descritta.

## Capabilities

### New Capabilities

- `presentation/space-theme`: identità visiva dello spazio — astronave con scia animata al posto del giocatore, asteroidi al posto degli ostacoli, sfondo stellato in parallasse, menu coerente con lo stesso universo, etichette centrate nei pulsanti e provenienza/licenza di ogni asset documentata.

### Modified Capabilities

Nessuna: il comportamento di gioco (salita, collisione, punteggio, ciclo menu → partita → menu) non cambia; cambia solo come appare.

## Impact

- Asset: ~20–30 PNG in `public/assets/kenney/` (circa 200 kB) più `license.txt`; nessuna dipendenza npm nuova.
- Codice: nuovo `src/game/sprites.ts` (definizioni e caricamento), `src/game/player.ts` (astronave + scia), `src/game/obstacle.ts` (sprite + rotazione), `src/game/starfield.ts` (parallasse), ritocchi a `menu-scene.ts`, `climb-scene.ts`, `constants.ts` e `src/ui/button.ts` (centratura etichetta).
- Rischio principale: le hitbox non devono cambiare — il collisore resta quello attuale, lo sprite viene scalato per riempirlo, così il gioco resta identico da giocare.
