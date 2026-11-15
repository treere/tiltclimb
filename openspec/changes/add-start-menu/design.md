# Design

## Context

Vedi `proposal.md` per il perché. Lo stato attuale è una sola scena (`ClimbScene`) che contiene tutto: giocatore, pool, HUD, `TiltSource`, `InputRouter`, oltre agli stati `idle | playing | gameover`. La calibrazione è implicita in `startRun()` e il permesso si chiede al primo tocco in partita. Il menu deve leggere lo stesso sensore e fissare lo stesso zero che poi usa la partita: questo è il vincolo che decide l'architettura, più di quanto non faccia la grafica.

## Goals / Non-Goals

**Goals:**

- un solo `TiltSource` e un solo zero per tutta la sessione: menu e partita leggono la stessa cosa;
- menu e partita come unità separate, con reset gratuito passando da una scena all'altra;
- comandi toccabili che funzionano su telefono e con il mouse, senza librerie UI.

**Non-Goals:**

- pausa e ritorno al menu da partita in corso;
- persistenza fra sessioni, impostazioni, nuove schermate;
- restyling dell'HUD di gioco o modifiche alla fisica.

## Decisions

### 1. Due scene Excalibur, non due stati nella stessa scena

`MenuScene` e `ClimbScene` sono scene separate registrate sull'engine (`engine.add('menu', …)`, `engine.add('climb', …)`), e la scena iniziale diventa `menu`.

Alternativa scartata: aggiungere uno stato `menu` alla `ClimbScene` esistente. Costerebbe zero nuovi file ma ogni `onPreUpdate` dovrebbe iniziare con una guardia sullo stato, il pool andrebbe smontato a mano e il menu erediterebbe camera, collisori e HUD della partita — cioè esattamente l'entropia che vogliamo evitare.

### 2. `TiltSource` esce dalla scena e diventa stato di sessione

Nuovo modulo `src/game/session.ts` che espone un'unica istanza condivisa di `TiltSource` e i due numeri del riepilogo (`lastScore`, `bestScore`). Le scene ricevono l'istanza, non la creano.

È la decisione centrale: la calibrazione è proprietà della **sessione**, non della partita. Se ogni scena creasse il proprio `TiltSource`, lo zero premuto nel menu andrebbe perso al cambio scena, che è precisamente il bug che questa change deve chiudere.

Lo zero iniziale (nessuna calibrazione esplicita ancora) viene fissato al primo evento del sensore che arriva quando il menu è visibile: `TiltSource.axis()` già lo fa quando `zero === null`, quindi non serve codice nuovo, serve solo non chiamare `calibrate()` all'avvio della partita.

### 3. Pulsanti come componente locale

`src/ui/button.ts`: un `ScreenElement` con `ex.Rectangle` di sfondo e `ex.Text` sopra, che ascolta gli eventi pointer dell'attore (`pointerdown`, `pointerup`, `pointerenter`, `pointerleave`) e cambia colore per dare feedback. Nessuna dipendenza UI aggiuntiva.

Alternativa scartata: intercettare i tocchi a livello di engine e fare hit-test sui rettangoli. Sarebbe la stessa cosa scritta peggio: Excalibur espone già gli eventi pointer per attore, con i bounds della grafica come area sensibile.

Un pulsante disabilitato semplicemente non si iscrive agli eventi, e il suo aspetto cambia: niente stato "disabled ma cliccabile".

### 4. Calibrazione: comando esplicito, conferma concreta

**Calibra** chiama `tilt.calibrate()` (zero = gamma attuale, smoothing azzerato) e mostra `Calibrato ✓` per 1,2 secondi, oltre a un flash del pulsante. Se `tilt.currentStatus === 'unavailable'`, il pulsante mostra invece `Sensore non disponibile` e non finge una conferma.

**Inizia gioco** non tocca lo zero. Se l'utente non ha mai calibrato, vale lo zero fissato all'apertura del menu (decisione 2), che è il comportamento dichiarato nella spec.

### 5. Permesso richiesto nel menu, una volta sola

Il primo dei due pulsanti premuti chiama `requestSensorPermission()` dentro il gesto e sottoscrive `tilt.listen()`. L'esito va in `tilt` e in un flag di sessione (`sensorPromptDone`), così nessuna scena richiede due volte. Se l'esito è negativo, il menu mostra l'avviso e `Inizia gioco` resta attivo: il fallback tastiera/drag è già implementato e non richiede modifiche.

### 6. Ritorno al menu dopo la morte

In `ClimbScene.endRun()`: `session.lastScore = score`, `session.bestScore = max(bestScore, score)`, poi `engine.goToScene('menu')` dopo 500 ms (`setTimeout`) — la pausa serve a far leggere la collisione invece di teletrasportare l'utente. Un flag `leaving` impedisce doppi cambi scena se arriva un secondo evento di collisione.

Il `setTimeout` viene salvato e cancellato in `onDeactivate`, così una scena riattivata non porta in giro un cambio scena pendente dalla partita precedente.

### 7. Layout del menu

Coordinate in screen space, con `screen.contentArea` come riferimento invece degli angoli del canvas, così notch e angoli arrotondati non mangiano i pulsanti. Misure in `constants.ts` (`BUTTON_WIDTH = 420`, `BUTTON_HEIGHT = 96`, gap 24) espresse nella risoluzione logica 720×1280, non in pixel dello schermo.

Struttura verticale: titolo in alto, blocco calibrazione al centro (valore grande + barra), i due pulsanti in basso, avviso sensori sopra i pulsanti.

## Risks / Trade-offs

- **Doppio listener sul sensore** (menu e partita che chiamano entrambi `listen()`) → `listen()` è idempotente e lo stato vive nel singleton: la sottoscrizione avviene una volta per sessione.
- **Tocco su un pulsante che "buca" fino al gioco** → i pulsanti esistono solo nella scena menu, e la scena non ha handler globali di pointer; il primo pointerdown che avvia la partita viene consumato dal cambio scena.
- **Doppio tap su Inizia che avvia due partite** → il cambio scena è idempotente e la scena di gioco si resetta in `onActivate`, non nel costruttore.
- **Testo che sborda su schermi stretti** → tutte le misure sono in unità logiche 720×1280 e il testo ha `maxWidth`; se serve, si riduce la dimensione del font invece di spostare i pulsanti.
- **`setTimeout` che sopravvive alla scena** → gestito con `clearTimeout` in `onDeactivate` (decisione 6); senza questo, morire due volte in rapida successione produrrebbe due cambi scena.
- **Zero "sporco" fra menu e partita** → la calibrazione esplicita è l'unico modo di cambiare zero; se l'utente calibra e poi cambia assetto durante la partita, deriva come prima, ed è il comportamento atteso.

## Migration Plan

Nessun dato da migrare (nessuna persistenza). Cambio di comportamento dichiarato BREAKING: spariscono l'avvio e il riavvio a tocco singolo. Il rollback è il revert del commit di apply: la change precedente è archiviata e le sue spec sono in `openspec/specs/`, quindi lo stato precedente è ricostruibile.
