# Design

## Context

Vedi `proposal.md` per il perché. Lo stato attuale è solo impalcatura: Vite 8 con TypeScript 7 (nota: `erasableSyntaxOnly` attivo, quindi niente `enum` e niente parameter properties nelle classi), Excalibur 1.0.1 installato, `npm run build` verde, dev server già configurato per il tunnel (`allowedHosts: ['.trycloudflare.com']`, HMR su `wss:443`). Non esiste ancora codice di gioco.

Vincoli che guidano il progetto:

- le specifiche (`specs/gameplay/endless-climb`, `specs/input/tilt-control`) descrivono il comportamento osservabile; qui si decide come ottenerlo.
- il gioco è verticale e portrait: l'asse Y è la direzione di marcia, l'asse X è l'unico controllo.
- Excalibur non ha API per i sensori: il tilt resta codice nostro, isolato dietro un'interfaccia minima.
- nessun asset: solo forme disegnate via codice (`ex.Rectangle`, `ex.Circle`).

## Goals / Non-Goals

**Goals:**

- un nucleo giocabile in cui l'input tilt è sostituibile senza toccare la logica di gioco (e quindi testabile con input finto);
- frame rate stabile su telefono: nessuna allocazione per frame nel ciclo di gioco;
- comportamento identico su desktop, dove i sensori non esistono.

**Non-Goals:**

- bilanciamento fine della difficoltà, progressione, power-up, audio, salvataggio del record;
- supporto landscape, iOS testato, PWA, deploy.

## Decisions

### 1. Separazione netta fra sorgente di input e gioco

`src/input/tilt-source.ts` espone una sola cosa: `axis(): number` in [-1, 1], già calibrato, filtrato e con dead zone applicata. `src/input/input-router.ts` sceglie la sorgente attiva (tilt se disponibile, altrimenti tastiera o drag) e la compone: se il tilt è attivo, tastiera e drag restano disponibili come override manuale.

Alternativa scartata: leggere `window.addEventListener('deviceorientation')` dentro la scena. Sarebbe più corto di dieci righe, ma accoppia sensore e gameplay e rende impossibile provare la scena con un input finto.

### 2. Camera lockata su un solo asse

`scene.camera.strategy.lockToActorAxis(player, ex.Axis.Y)`, con il giocatore che sale tramite velocità verticale costante (`vel.y` negativo: in Excalibur la Y cresce verso il basso). La posizione orizzontale del giocatore è libera entro i bordi del mondo, quindi la camera non deve seguirla.

Alternativa scartata: muovere il mondo invece della camera. Costa un aggiornamento per ogni ostacolo a ogni frame, mentre la camera è una sola trasformazione applicata dal renderer.

### 3. Pool di ostacoli a dimensione fissa

Un array di N actor creati una volta in `onInitialize` (N = 24, sufficiente per due schermate di ostacoli), riusati in rotazione: chi esce sotto il bordo inferiore torna in coda. Nessun `new` durante la partita.

Alternativa scartata: creare un `Obstacle` a ogni spawn e lasciarlo raccogliere al GC. Su Android il garbage collector produce micro pause visibili in un gioco a scorrimento continuo.

### 4. Timestep fisso per la fisica

`new ex.Engine({ fixedUpdateFps: 60, displayMode: ex.DisplayMode.FitScreen, ... })`, così la velocità di salita non dipende dal refresh dello schermo (60, 90 o 120 Hz).

### 5. Matematica del tilt

Letture da `deviceorientation`, campo `gamma` (gradi, -90..90, positivo = inclinato a destra in portrait). Catena di trasformazione, in ordine:

1. **zero**: al primo tocco della partita si memorizza `zero = gamma`; ogni lettura diventa `g = gamma - zero`;
2. **dead zone**: `if (|g| < TILT_DEAD_ZONE) g = 0`;
3. **normalizzazione**: `raw = clamp(g / TILT_RANGE, -1, 1)` — oltre `TILT_RANGE` si satura;
4. **smoothing indipendente dal frame rate**: `axis = lerp(axis, raw, 1 - exp(-dt / SMOOTH_TAU))`. Il classico `lerp(a, b, 0.2)` per frame è stato scartato perché a 30 Hz il movimento è più lento che a 60 Hz: il tempo di assestamento cambierebbe con il dispositivo;
5. **velocità**: `player.vel.x = axis * MAX_HORIZONTAL_SPEED`.

Il gamma si legge in un handler passivo che salva solo l'ultimo valore; la conversione avviene nel ciclo di gioco, così eventi a 100 Hz non producono 100 aggiornamenti di fisica.

Costanti iniziali, da tarare in mano (in `src/game/constants.ts`):

- `WORLD_WIDTH = 720`, `WORLD_HEIGHT = 1280` (risoluzione logica, scala gestita da `DisplayMode.FitScreen` (in 1.0.1 `FullScreen` non esiste: il valore si chiama `FitScreen`, che mantiene le proporzioni con bande nere))
- `CLIMB_SPEED = 190` px/s (velocità di salita del mondo)
- `MAX_HORIZONTAL_SPEED = 300` px/s
- `TILT_DEAD_ZONE = 3` °
- `TILT_RANGE = 22` ° (inclinazione a cui si raggiunge la velocità massima)
- `SMOOTH_TAU = 90` ms
- `OBSTACLE_POOL_SIZE = 24`, `SPAWN_GAP = 260` px di scorrimento
- `PLAYER_SIZE = 44x56`, `OBSTACLE_SIZE = 120x28`

### 6. Permessi e fallback

Al primo tocco: se `DeviceOrientationEvent.requestPermission` esiste si chiama dentro il gesto e si memorizza l'esito. Se il permesso manca, è negato, o dopo 1,5 s non arriva nessun evento `deviceorientation`, la sorgente tilt viene marcata non disponibile e il gioco prosegue con tastiera/drag. Il drag misura lo spostamento orizzontale del puntatore rispetto al punto di presa (delta, non posizione assoluta), così il dito non deve stare sopra il personaggio.

`ex.Input` normalizza mouse e touch in un unico pointer: drag con un solo percorso di codice.

### 7. HUD e stati di gioco

`ex.Label` montata su `ex.ScreenElement` per punteggio e messaggio di fine partita; un solo stato esplicito (`idle | playing | gameover`) nella scena evita transizioni impossibili. Il riavvio riusa la stessa scena resettando pool, posizioni e punteggio: nessun ricaricamento di pagina.

## Risks / Trade-offs

- **Sensazione del tilt troppo sensibile o troppo lenta** → tutte le costanti del tilt stanno in un solo file e la pagina di prova già misurata dice il range reale del suo telefono; la taratura è una modifica di numeri, non di struttura.
- **Eventi di orientamento assenti o a bassa frequenza su alcuni Android** → smoothing indipendente dal tempo e fallback dichiarato: il gioco non si blocca mai in attesa del sensore.
- **`gamma` si comporta diversamente se il telefono ruota** → portrait forzato via CSS e tentativo di `screen.orientation.lock('portrait')` dopo il primo tocco in fullscreen, senza far fallire il gioco se il lock viene rifiutato.
- **Collisioni percepite come ingiuste** (ostacoli sottili a 190 px/s) → hitbox più piccola dello sprite (circa 80% del rettangolo), e velocità di salita tra le costanti da tarare per prime.
- **TypeScript 7 con `erasableSyntaxOnly`** → niente `enum`, niente parameter properties: si usano union di stringhe e campi espliciti. Se la costrizione diventa fastidiosa si valuta di disattivarla, ma non è necessario per questo nucleo.
- **Pool a dimensione fissa** → se in futuro gli ostacoli diventassero molto più frequenti va alzato `OBSTACLE_POOL_SIZE`; a dimensione esaurita il pool ricicla il più vecchio, quindi non si rompe, si comporta in modo strano.

## Migration Plan

Non c'è nulla da migrare: primo codice di gioco del progetto. Ordine di lavoro: costanti e scena vuota → giocatore e camera → pool e generazione → collisione e stati → input tilt → fallback → taratura sul telefono. Ogni passo lascia il gioco avviabile e `npm run build` verde. Rollback: il repository è a uno stato di scaffold committato, quindi `git revert` del commit di apply torna all'impalcatura.
