# Proposal

## Why

Oggi il campo di asteroidi è un ostacolo passivo: l'unica decisione è dove passare, e non c'è nulla che risponda a chi gioca. Con navi nemiche che scendono zigzagando e sparano verso il basso, l'eroe deve schivare due cose insieme e ha una risposta attiva — un tasto di fuoco. È il passaggio da "evitare" a "combattere", senza cambiare la struttura del gioco (si sale, si muore, si torna al menu).

## What Changes

- **Navi nemiche**: scendono dall'alto con traiettoria **ondulata** (zigzag tra gli asteroidi), sparando verso il basso. Ne compaiono al massimo due alla volta, a intervalli regolari.
- **Fuoco dell'eroe**: pulsante a tema in basso nello schermo; **un tocco = un colpo**, nessuna raffica. Il colpo parte dall'astronave e sale.
- **Proiettili nemici**: scendono dritti, più lenti di quelli dell'eroe, e uccidono al contatto.
- **Collisioni**: un colpo dell'eroe abbatte una nave nemica (un colpo solo) e assegna punti; una nave o un proiettile nemico che tocca l'eroe chiude la partita, come un asteroide.
- **Asteroidi**: immuni ai proiettili (i colpi li attraversano) e attraversabili dalle navi nemiche, che passano sopra o sotto senza interagire.
- **Punteggio**: al punteggio per altezza si aggiungono i punti degli abbattimenti.
- Fuori scope: vite multiple o scudi, munizioni limitate, power-up, boss, nemici che inseguono il giocatore, esplosioni animate con asset dedicati (il pack non ne ha), difficoltà progressiva, audio, modifiche al tilt o al ciclo menu → partita → menu.

## Capabilities

### New Capabilities

- `gameplay/combat`: fuoco dell'eroe dal tasto in basso, proiettili delle due fazioni, movimento ondulato e fuoco delle navi nemiche, regole di collisione (comprese le immunità degli asteroidi) e punteggio per abbattimento.

### Modified Capabilities

- `gameplay/endless-climb`: la collisione che chiude la partita non è più solo con gli ostacoli ma anche con navi e proiettili nemici; il punteggio non è più solo altezza ma altezza più abbattimenti.

## Impact

- Asset: si aggiungono navi nemiche (`enemyRed1`–`enemyRed5`), laser `laserBlue*` e `laserRed*` dal pack Kenney già presente, sotto la stessa licenza CC0 e lo stesso `license.txt`.
- Codice: nuovi `src/game/enemy.ts`, `src/game/projectile.ts` (pool condiviso per i due tipi), `src/game/combat.ts` (fuoco, collisioni, punteggio); ritocchi a `climb-scene.ts` (spawn nemici, aggiornamento proiettili), `ui/button.ts` (pulsante di fuoco, già a tema), `constants.ts`, `session.ts` (contatore abbattimenti per il riepilogo).
- Rischio principale: il campo diventa affollato e il gioco può risultare ingiocabile su schermo piccolo; serve tarare frequenza e velocità tenendo conto che la nave sta nel terzo inferiore dello schermo.
