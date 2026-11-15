# Design

## Context

Vedi `proposal.md` per il perché. Oggi `Enemy` è una sola classe con onda sinusoidale fissa e `wantsToFire()` che restituisce un booleano: il tipo non esiste, lo sprite è scelto a caso fra cinque rossi, e il colpo è sempre verticale. Il pool è da 4 elementi con massimo 2 vivi, il punteggio per abbattimento è una costante (`KILL_POINTS = 25`) usata sia dal `combat-math` sia dall'HUD.

Nel pack già nel repo ci sono 20 navi (`enemy{Red,Blue,Green,Black}1…5`, ~82-104×84) e 4 UFO (91×91). **Nessuna nave si distingue per forma in modo affidabile a colpo d'occhio**: le forme 1-5 cambiano silhouette, i colori sono quattro. Uso quindi forma + colore insieme come firma dell'archetipo.

## Goals / Non-Goals

**Goals:**

- quattro comportamenti leggibili e distinguibili a occhio, senza introdurre un motore di script;
- difficoltà che cresce con l'altezza, misurabile e tarabile da una tabella sola;
- pool e collisioni invariate: nessuna allocazione durante la partita.

**Non-Goals:**

- boss, formazioni, coordinamento fra navi;
- nuovi tipi oltre i quattro;
- modifiche a eroe, tilt, asteroidi, menu;
- IA adattiva: le soglie sono fisse.

## Decisions

### 1. Un tipo come dato, non una classe per archetipo

`src/game/enemy-archetypes.ts` espone una tabella `ARCHETYPES: Record<EnemyKind, Archetype>` con tutto ciò che distingue un tipo: sprite, punti, soglia di sblocco, parametri di movimento e schema di fuoco. `Enemy` resta una classe sola che legge la tabella e applica il comportamento con uno `switch` su `kind`.

Alternativa scartata: una sottoclasse per archetipo. Quattro file per quattro comportamenti di venti righe ciascuno, e ogni nuovo tipo richiederebbe una classe più un ramo di istanziazione; con la tabella aggiungere un tipo è una voce in più.

### 2. I quattro archetipi

| Tipo | Sprite | Movimento | Fuoco | Sblocco | Punti |
| --- | --- | --- | --- | --- | --- |
| `patrol` | `enemyRed1` (93×84) | onda, ampiezza 110, ω 1.8, discesa 120 px/s | 1 colpo ogni 2200 ms, 320 px/s | 0 px | 25 |
| `diver` | `enemyBlue4` (82×84) | discesa 260 px/s, deriva orizzontale 120 px/s verso il lato opposto all'ingresso | raffica di 2 colpi (200 ms fra i due) ogni 2600 ms, 340 px/s | 2500 px | 35 |
| `hunter` | `enemyGreen2` (104×84) | inseguimento orizzontale con velocità massima 150 px/s, discesa 100 px/s | ventaglio di 3 colpi a -18°/0°/+18° ogni 2400 ms, 300 px/s | 6000 px | 45 |
| `ufo` | `ufoYellow` (91×91) | scende fino a metà altezza, poi oscilla piano senza scendere | raffica di 4 colpi (200 ms) ogni 5000 ms, 260 px/s | 10000 px | 60 |

Le soglie sono in pixel di altezza, non in punti: l'utente ha scelto questa metrica, e ha il vantaggio di non dipendere dagli abbattimenti (chi non spara non resta indietro). A 190 px/s significano circa 13, 32 e 53 secondi di salita.

### 3. Limite dinamico

`ENEMY_MAX_ALIVE` diventa una funzione dell'altezza: 2 finché il cacciatore non è sbloccato, 3 dopo. Il pool resta da 4, quindi il limite può solo salire fino a 3 senza crescere la memoria.

### 4. Proiettili con angolo

`Projectile.launch(faction, x, y, angleRadians = 0)` ruota la velocità di base. Lo sprite non ruota (i laser Kenney sono già inclinabili con l'attore, ma ruotare il singolo colpo di 18° lo rende più difficile da leggere): resta verticale, e solo la traiettoria è obliqua. `isOutside` controlla anche l'asse X, altrimenti un colpo obliquo resta "dentro" per sempre viaggiando di lato.

Il ventaglio del cacciatore usa ±18° (±0.31 rad) perché a 300 px/s produce circa 93 px/s di deriva laterale: si vede, si schiva, e non esce dallo schermo in mezzo secondo.

### 5. Punteggio per tipo

`Archetype.points` sostituisce la costante unica. `climbScore()` mantiene la firma ma riceve i punti accumulati invece di `kills × KILL_POINTS`: la scena somma `points` a ogni abbattimento in `this.killPoints`, e il totale resta monotono come prima.

### 6. Tabella come unica fonte di taratura

Tutti i numeri della tabella stanno in `constants.ts` (o nella tabella stessa, che importa le costanti): cambiare la difficoltà significa cambiare una riga, non cercare valori sparsi. Le soglie sono le prime cose da toccare se il gioco risulta troppo lento a diventare interessante.

## Risks / Trade-offs

- **Cacciatore troppo aggressivo**: insegue proprio dove si sterza. Mitigazione: velocità massima 150 px/s contro i 300 dell'eroe, quindi si scappa lateralmente; se in mano risulta ingiusto si abbassa a 110.
- **Ventaglio che intrappola**: tre colpi obliqui possono chiudere lo spazio. Mitigazione: apertura ±18°, frequenza 2400 ms, e raffica singola per volta.
- **Torretta che staziona**: se resta troppo in alto è irraggiungibile dai colpi dell'eroe. Mitigazione: si ferma a metà altezza, ben dentro la portata, e la sua oscillazione è lenta.
- **Pressione a 3 nemici**: con un UFO e un cacciatore insieme lo schermo può diventare illeggibile. Mitigazione: limite 3 solo dopo 6000 px, e la frequenza di spawn resta 3500 ms.
- **Pool da 4** con limite 3 lascia un solo elemento di margine: se in futuro il limite sale a 4, il pool va alzato insieme. È scritto qui per non scoprirlo a runtime.
- **Punteggio per tipo** rende il valore degli abbattimenti disomogeneo: è voluto, ma va comunicato nel README perché il numero che sale non è più "25 fissi".

## Migration Plan

Nessuna migrazione dati. `KILL_POINTS` sparisce in favore di `Archetype.points`; il riepilogo nel menu resta basato sul conteggio, non sui punti. Rollback: revert del commit di apply.
