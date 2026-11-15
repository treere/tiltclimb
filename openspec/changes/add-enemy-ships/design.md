# Design

## Context

Vedi `proposal.md` per il perché. Il gioco oggi ha una scena (`ClimbScene`) con un pool di 24 asteroidi, camera manuale che tiene l'eroe al 72% dell'altezza, parallasse su schermo e due pulsanti a tema nel menu. Non esistono proiettili né entità che si muovono in modo indipendente: tutto scorre perché la camera sale.

Asset disponibili nel pack già nel repo (CC0, stesso `license.txt`): navi nemiche `enemyRed1`–`enemyRed5`, laser `laserBlue01…16` e `laserRed01…16`. **Non ci sono frame di esplosione**: verificato scorrendo l'archivio, il pack contiene `shield`, `star` e `fire`, non esplosioni.

## Goals / Non-Goals

**Goals:**

- un combattimento leggibile su uno schermo da telefono: pochi proiettili, pochi nemici, tutte le regole di immunità esplicite;
- nessuna allocazione durante la partita: pool fissi per proiettili e nemici;
- punteggio monotono (altezza + abbattimenti), così il riepilogo non torna mai indietro.

**Non-Goals:**

- vite, scudi, munizioni, power-up, boss, nemici che inseguono;
- effetti di esplosione con asset dedicati (non esistono nel pack);
- modifiche a tilt, camera, menu o ciclo delle scene.

## Decisions

### 1. Collisioni dei proiettili e delle navi: geometria nostra, non il motore

Il motore continua a gestire solo eroe ↔ asteroide, com'è oggi. Proiettili e navi nemiche sono `CollisionType.PreventCollision` e le collisioni si risolvono in `onPreUpdate` con test cerchio-cerchio (e cerchio-eroe per le navi).

Il motivo è l'immunità richiesta: un colpo deve attraversare gli asteroidi, e una nave nemica deve attraversarli. Affidare questo a gruppi di collisione significa tre configurazioni che devono restare coerenti fra loro e che il motore rivaluta per ogni coppia; con venti proiettili in volo il test esplicito costa nulla ed è leggibile in un punto solo. In più rende la regola verificabile: se un domani un asteroide dovesse fermare i colpi, si cambia una riga, non una gerarchia di gruppi.

### 2. Un solo pool di proiettili con la fazione come dato

`src/game/projectile.ts` espone `Projectile` con `faction: 'hero' | 'enemy'`. Un pool unico da 40 elementi serve entrambi i tipi: verso l'alto e sprite blu per l'eroe, verso il basso e sprite rosso per i nemici. Riciclare quando escono dallo schermo.

Alternativa scartata: due pool separati. Raddoppia i campi da tenere allineati senza aggiungere nulla: il vincolo è "max N proiettili in volo", non "max N per fazione".

### 3. Traiettoria nemica: discesa lenta nel mondo, onda in orizzontale

La camera sale a `CLIMB_SPEED`; un nemico con velocità di mondo `-(CLIMB_SPEED - ENEMY_SCREEN_DESCENT)` scende **sullo schermo** a `ENEMY_SCREEN_DESCENT` (120 px/s), cioè resta visibile una decina di secondi invece di sfrecciare. L'oscillazione è `pos.x = baseX + ampiezza × sin(fase + ω·t)`, con `ampiezza 110 px`, `ω 1.8 rad/s`, `baseX` casuale e limiti ai bordi del mondo.

Valori iniziali in `constants.ts`: `ENEMY_SCREEN_DESCENT 120`, `ENEMY_WEAVE_AMPLITUDE 110`, `ENEMY_WEAVE_OMEGA 1.8`, `ENEMY_MAX_ALIVE 2`, `ENEMY_SPAWN_INTERVAL_MS 3500`, `ENEMY_FIRE_INTERVAL_MS 2200`.

### 4. Fuoco: un tocco, un colpo, con guardia anti-doppio

Il pulsante usa il `Button` già a tema, posizionato in basso sopra la safe area e lontano dalla nave (che sta al 72%). Il tocco chiama `fire()`: se sono passati meno di `SHOT_MIN_INTERVAL_MS` (150) dall'ultimo colpo, il tocco viene ignorato. Non è una raffica — nessun timer spara da solo — ma evita che un doppio evento del browser produca due colpi da un tocco solo.

`HERO_SHOT_SPEED 620` px/s verso l'alto, `ENEMY_SHOT_SPEED 320` px/s verso il basso: il colpo nemico è più lento e quindi schivabile, come chiesto.

### 5. Punteggio: due sorgenti, una somma monotona

`score = floor(altezza / PIXELS_PER_POINT) + kills × KILL_POINTS` con `KILL_POINTS = 25`. Entrambe le componenti sono monotone, quindi il punteggio non torna mai indietro (requisito che c'era già). `session.kills` viene salvato a fine partita per il riepilogo nel menu, che mostrerà "Ultimo: N · Migliore: M · Abbattuti: K".

### 6. Livelli di disegno: nemici sopra gli asteroidi

Z: asteroidi 0, nemici 20, proiettili 30, eroe 40, HUD 100. Le navi nemiche **passano sopra** gli asteroidi: è la lettura più pulita, perché sotto sembrerebbero nascoste e indistruttibili, mentre la regola vera è "non interagiscono". La spec dice "sopra o sotto" e questa è la scelta.

### 7. Nessun effetto di morte in questa iterazione

Il pack non ha esplosioni. Invece di inventare un effetto con frame di fiamma (che sembrerebbe un motore acceso), la nave nemica sparisce. È dichiarato fuori scope nel proposal, e quando arriverà un pack con esplosioni si aggiunge come delta della spec `gameplay/combat`.

## Risks / Trade-offs

- **Affollamento** → al massimo 2 nemici, 40 proiettili totali, e la nave sta in basso: se diventa ingiocabile si riduce `ENEMY_SPAWN_INTERVAL_MS` verso l'alto (più pausa) o si abbassa la frequenza di fuoco, non la velocità.
- **Proiettili "sporchi"** fra partite → il pool viene svuotato in `startRun`, come già accade per gli asteroidi.
- **Tempo di reazione** → l'eroe è al 72% dell'altezza, quindi vede 920 px di campo: un colpo nemico a 320 px/s dà quasi 3 secondi. Se risultasse troppo facile si aumenta la frequenza, non la velocità.
- **Test cerchio-cerchio approssimati** → l'eroe è un rettangolo 56×34: uso un cerchio di raggio 20 centrato, leggermente perdonante. Accettabile, ma va tarato a mano.
- **Punteggio che salta** → se un abbattimento arriva mentre l'altezza cresce, la somma può aumentare di 25 in un frame: è voluto e va mostrato così com'è.

## Migration Plan

Nessun dato da migrare, nessuna persistenza. Il rollback è il revert del commit di apply: le spec precedenti sono già in `openspec/specs/` e descrivono il gioco senza combattimento.
