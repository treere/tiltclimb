# Proposal

## Why

Vogliamo un giochino 2D giocabile su PC e su telefono dal browser, che sfrutti il telefono come controller: si sale in verticale all'infinito e si sterza inclinando il dispositivo. È il primo gioco del progetto, e serve un nucleo giocabile in fretta per capire se il controllo tilt è divertente o solo fastidioso: finché non lo si prova in mano, ogni altra scelta (grafica, livelli, punteggi) è prematura.

## What Changes

- Nuova scena di gioco con mondo a scroll verticale infinito: il giocatore sale automaticamente, la camera lo segue solo sull'asse Y, gli ostacoli vengono generati sopra lo schermo e riciclati sotto tramite pool.
- Nuovo input tilt: `deviceorientation` → `gamma` con calibrazione dello zero al primo tocco, filtro di smoothing e dead zone centrale.
- Fallback obbligatorio senza sensori: frecce/AD su desktop, trascinamento orizzontale sul touch (permesso negato o dispositivo senza accelerometro).
- Collisione con gli ostacoli che chiude la partita, punteggio basato sull'altezza raggiunta, riavvio immediato.
- Layout mobile-first: portrait bloccato, canvas a tutto schermo con `contentArea`/`unsafeArea` rispettati, primo tocco che chiede i permessi sensore e `enterFullscreen()`.
- Fuori scope: grafica e audio (solo forme disegnate via codice), livelli o difficoltà progressiva curata, persistenza del record (per ora in memoria), PWA installabile, deploy su hosting statico, leaderboard, qualsiasi backend.

## Capabilities

### New Capabilities

- `gameplay/endless-climb`: mondo a scroll verticale infinito con camera a un asse, generazione e riciclo degli ostacoli, collisione, punteggio per altezza e ciclo partita (gioca → muori → riparti).
- `input/tilt-control`: traduzione del tilt in movimento orizzontale con calibrazione, smoothing e dead zone, più fallback tastiera e drag quando il sensore non è disponibile.

### Modified Capabilities

Nessuna: il progetto non ha ancora specifiche.

## Impact

- Codice: `src/` (nuovi moduli `game/`, `input/`), `index.html`, `vite.config.ts`.
- Dipendenze: nessuna nuova; Excalibur 1.0.1, TypeScript e Vite sono già installati.
- Piattaforme: Android Chrome (target primario) e desktop Chrome/Firefox; iOS non testato, ma il percorso permessi è lo stesso.
- Anteprima: quick tunnel cloudflared, quindi HTTPS obbligatorio per i sensori e HMR già configurato su `wss:443`.
