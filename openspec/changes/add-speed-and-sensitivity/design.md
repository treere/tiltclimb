# Design

## Context

Vedi `proposal.md`. Numeri di partenza, dal codice attuale:

- `CLIMB_SPEED = 190` px/s, costante, usata dal giocatore (`player.vel.y = -CLIMB_SPEED`), dal campo stellato (parallasse) e dai nemici, che ne ricavano la discesa relativa.
- `TILT_RANGE_DEG = 22` come fondo scala, `TILT_DEAD_ZONE_DEG = 3`, `TILT_SMOOTH_TAU_MS = 90`.
- Gli ostacoli sono posizionati a passi di `SPAWN_GAP_PX = 260` pixel di salita.
- Preferenze già persistenti con `localStorage` (`tiltclimb.muted` in `src/audio/audio.ts`): c'è un precedente da seguire.

## Goals / Non-Goals

**Goals:**

- difficoltà che cresce da sola, in modo prevedibile e senza scatti;
- sterzo più reattivo di default ma regolabile, con la scelta che sopravvive al riavvio;
- nessuna regressione su parallasse, ostacoli e nemici quando il mondo accelera.

**Non-Goals:**

- difficoltà selezionabile a mano (facile/normale/difficile);
- progressi salvati, classifiche, unlock;
- modifiche a punteggio, archetipi, frequenza di comparsa dei nemici.

## Decisions

### 1. La velocità è una funzione pura dell'altezza

`src/game/speed.ts`:

```ts
export const CLIMB_SPEED_START = 190;
export const CLIMB_SPEED_MAX = 320;
/** Quanto sale la velocità per ogni pixel di altezza conquistato. */
export const CLIMB_SPEED_PER_PX = 0.0135;

export function climbSpeedAt(heightPx: number): number {
  return Math.min(CLIMB_SPEED_MAX, CLIMB_SPEED_START + Math.max(0, heightPx) * CLIMB_SPEED_PER_PX);
}
```

Con questi numeri: 200 px/s a ~740 px, 260 px/s a ~5.200 px, tetto a ~9.600 px (poco meno di 55 secondi di salita piena). Funzione pura → testabile in Node senza browser, come già fatto per `combat-math.ts` e `enemy-archetypes.ts`.

Perché legata all'altezza e non al tempo: il tempo premia chi resta vivo senza salire (non possibile qui) e soprattutto rende la difficoltà diversa fra due partite con lo stesso percorso. Con l'altezza, "sei arrivato a 6.000 px" implica sempre la stessa velocità.

### 2. La velocità corrente è un valore della scena, non una costante importata

`climb-scene.ts` calcola `const speed = climbSpeedAt(this.score.distance)` una volta per update e lo passa a chi ne ha bisogno:

- `player.vel.y = -speed`;
- `starfield.update(elapsed, speed)` — oggi `Starfield` importa `CLIMB_SPEED`, che diventa un parametro;
- `EnemyContext.speed` — `enemy.ts` calcola `-(speed - archetype.descent)` invece di `-(CLIMB_SPEED - ...)`.

Alternativa scartata: lasciare `CLIMB_SPEED` come costante e aggiungere un moltiplicatore globale. Sarebbe un valore nascosto che tutti leggono, cioè lo stesso accoppiamento di oggi con un livello di indirezione in più.

### 3. Ostacoli: la distanza resta in pixel di salita

La generazione già lavora a passi di `SPAWN_GAP_PX` sull'asse Y del mondo, quindi accelerare non cambia la densità spaziale: gli ostacoli sono più distanti nel tempo, non più vicini nello spazio. È il comportamento giusto — il gioco diventa più veloce, non più ingiusto — e non richiede codice nuovo. La verifica è che il numero di ostacoli per 1.000 px resti costante.

### 4. Sensibilità a cinque livelli

`src/input/tilt-settings.ts`:

```ts
export const TILT_RANGES_DEG = [22, 17, 13, 10, 8]; // dal più morbido al più nervoso
export const DEFAULT_TILT_LEVEL = 2;                // 13°, il default più reattivo
export function rangeForLevel(level: number): number;
export function loadTiltLevel(): number;             // localStorage, con clamp
export function saveTiltLevel(level: number): void;
```

La sensibilità è solo l'ampiezza (`TILT_RANGE_DEG`), applicata dentro `TiltSource` come proprietà modificabile: dead zone e smorzamento non cambiano, così il centro resta stabile anche al livello più nervoso — è il motivo per cui non ho toccato i 3° di dead zone.

**Perché cambiare sensibilità non richiede ricalibrare**: la calibrazione è un offset sullo zero, la sensibilità è un fattore di scala. Sono indipendenti per costruzione; vale la pena dirlo nel codice perché è il tipo di cosa che si "sistema" per sbaglio aggiungendo una ricalibrazione automatica.

### 5. Controllo nel menu: `−` e `+` con etichetta centrale

Il menu ha già `Button` (Canvas 2D) e `addCenteredGraphic`. Il controllo è una riga: pulsante `−` a sinistra, valore centrale, pulsante `+` a destra, con la didascalia `SENSIBILITÀ · 13°` sopra. Ai limiti il pulsante corrispondente va in stato disabilitato, che `Button` già supporta.

Alternativa scartata: uno slider. Su schermo piccolo richiede un trascinamento preciso, e con cinque valori discreti i due pulsanti sono più affidabili (e più semplici da centrare, visto il pregresso).

La riga si posiziona sopra i pulsanti esistenti con spazio misurato, non a occhio: la verifica è che su 720×1280 e su 360×640 nulla si sovrapponga.

### 6. Applicazione immediata

Il menu scrive il livello sia in `localStorage` sia in un oggetto condiviso letto dalla `TiltSource` della partita successiva (`TiltSource` viene creata dalla scena, quindi legge il valore al momento giusto). Nessun riavvio, nessun ricaricamento: il cambio vale dalla partita dopo il tocco, che è quello che serve.

## Risks / Trade-offs

- **Troppo difficile in alto** → tetto a 320 px/s (1,7× l'inizio) e rampa lenta; se in prova risultasse ingestibile, si abbassa `CLIMB_SPEED_MAX` o `CLIMB_SPEED_PER_PX`, due costanti.
- **Default più sensibile = più errori per chi ha la mano poco ferma** → il livello 1 (22°) riproduce esattamente il comportamento passato, quindi c'è sempre un ritorno indietro. Il default è stato tarato una seconda volta su richiesta: da 16° a 13°, perché 16° risultava ancora docile.
- **Nemici che "scappano" di più** → con `-(speed - descent)` la discesa relativa resta quella dell'archetipo; se il gioco accelera, il nemico scende più lentamente rispetto allo schermo ma alla stessa velocità nel mondo. Da verificare a occhio in partita veloce.
- **Persistenza fragile** (`localStorage` negato in incognito) → lettura in `try/catch` con fallback al default, come già fatto per l'audio.

## Migration Plan

Nessun dato da migrare: chi non ha impostazioni salvate parte al livello 2 (16°). Chi ha partite in corso non ha nulla da convertire, perché non esistono salvataggi di partita.
