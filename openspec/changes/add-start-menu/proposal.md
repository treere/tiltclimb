# Proposal

## Why

Oggi la partita parte al primo tocco e la calibrazione avviene in silenzio: chi tiene il telefono inclinato scopre che il personaggio scappa di lato solo quando ha già perso, e non ha modo di capire se il problema è il sensore, il permesso o la taratura. Serve una schermata che mostri il sensore prima di giocare, permetta di fissare lo zero e dia un punto di ritorno sensato dopo la morte, invece di far ripartire tutto con un tocco alla cieca.

## What Changes

- Nuovo menu iniziale, primo stato dell'app: titolo, lettura **live** della calibrazione (inclinazione relativa in gradi e barra che si muove inclinando il telefono), pulsanti **Calibra** e **Inizia gioco**.
- **Calibra** fissa lo zero all'inclinazione corrente e mostra una conferma visibile, così si capisce che è stato applicato.
- Il **permesso sensori** viene chiesto dal menu, dentro il tocco che avvia l'azione, non più al primo tocco in partita.
- Se il permesso è negato o l'accelerometro manca, il menu mostra un **avviso chiaro** e lascia **Inizia** abilitato: si gioca col fallback tastiera/drag.
- A fine partita si torna al menu, che mostra **punteggio appena fatto** e **migliore della sessione**.
- **BREAKING** (comportamento): spariscono l'avvio "tocca per iniziare" e il riavvio "tocca per riprovare"; il ciclo diventa menu → partita → menu.
- Fuori scope: pausa a partita in corso e ritorno al menu da lì, persistenza del record fra sessioni, impostazioni (difficoltà, audio, sensibilità), nuove schermate oltre menu e partita, grafica e audio, modifica della fisica di gioco, tuning delle costanti di sterzata.

## Capabilities

### New Capabilities

- `ui/start-menu`: schermata di avvio con calibrazione visibile del sensore, comando di calibrazione, avvio partita, avviso quando i sensori non sono disponibili e riepilogo del risultato al ritorno dalla partita.

### Modified Capabilities

- `input/tilt-control`: la calibrazione dello zero e la richiesta del permesso si spostano dal primo tocco in partita al menu; l'avvio della partita non ricalibra più implicitamente.
- `gameplay/endless-climb`: la fine partita non riavvia più con un tocco ma riporta al menu, e lo stato di gioco acquisisce lo stato iniziale di menu.

## Impact

- Codice: nuova scena menu (`src/game/menu-scene.ts`), `src/game/climb-scene.ts` ridotta al solo gioco, stato di sessione condiviso (punteggio appena fatto, migliore), `src/main.ts` per la scena iniziale, `src/game/constants.ts` per colori e misure dei pulsanti.
- Dipendenze: nessuna nuova. I pulsanti sono `ScreenElement` + `Rectangle`/`Text` già usati per l'HUD.
- Test manuale: percorso menu → calibra → inizia → muori → menu, da telefono via tunnel HTTPS (i sensori richiedono contesto sicuro).
