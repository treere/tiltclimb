# Tasks

## 1. Fondamenta: motore, scena, costanti

- [ ] 1.1 Creare `src/game/constants.ts` con le costanti del design (mondo, velocità, tilt, pool) e verifica che `npm run typecheck` passi senza errori
- [ ] 1.2 Istanziare l'engine in `src/main.ts` con `fixedUpdateFps: 60`, `displayMode: ex.DisplayMode.FullScreen` e canvas `#game`; verifica: `npm run build` verde e pagina che mostra un canvas nero a tutto schermo da telefono
- [ ] 1.3 Creare `src/game/climb-scene.ts` con scene vuota, sfondo a tinta e blocco portrait (CSS `orientation` + tentativo `screen.orientation.lock` non bloccante); verifica: `npm run dev` e canvas visibile senza errori in console

## 2. Giocatore e camera

- [ ] 2.1 Aggiungere il giocatore come `Actor` con grafica `ex.Rectangle` e corpo di collisione ridotto all'80%; verifica: il rettangolo compare e i bordi del mondo lo fermano
- [ ] 2.2 Applicare la salita automatica (`vel.y = -CLIMB_SPEED`) con `fixedUpdateFps` attivo; verifica: misurando due screenshot a distanza di 2 s lo scorrimento è costante e indipendente dal refresh
- [ ] 2.3 Agganciare la camera con `lockToActorAxis(player, ex.Axis.Y)`; verifica: muovendo il giocatore in orizzontale con la tastiera lo sfondo resta fermo, salendo la camera lo segue

## 3. Ostacoli: pool, generazione, riciclo

- [ ] 3.1 Implementare `src/game/obstacle-pool.ts` con N actor preallocati e API `spawnAbove()` / `releaseBelow()`; verifica: nessuna allocazione dopo l'init (contatore di istanze stabile in console)
- [ ] 3.2 Generare un ostacolo ogni `SPAWN_GAP` pixel di scorrimento, in posizione X casuale con margini; verifica: giocando 30 s gli ostacoli arrivano regolari e mai sovrapposti al bordo
- [ ] 3.3 Riciclare gli ostacoli usciti sotto il bordo inferiore; verifica: dopo 60 s il numero di ostacoli attivi è costante e il pool non cresce

## 4. Partita: collisione, punteggio, stati

- [ ] 4.1 Gestire la collisione giocatore-ostacolo che porta allo stato `gameover` con mondo fermo; verifica: toccando un ostacolo lo scorrimento si interrompe e non nascono nuovi ostacoli
- [ ] 4.2 Mostrare punteggio basato sull'altezza massima con `ex.Label` su `ex.ScreenElement`; verifica: il numero cresce salendo e non torna indietro
- [ ] 4.3 Implementare il riavvio con singola azione che resetta pool, posizioni, punteggio e zero del tilt; verifica: dopo il riavvio si riparte da zero senza ricaricare la pagina

## 5. Input tilt

- [ ] 5.1 Creare `src/input/tilt-source.ts` con lettura passiva di `deviceorientation`, zero calcolato al primo tocco e API `axis()`; verifica: inclinando il telefono `axis()` segue il segno atteso (positivo a destra) e vale 0 a telefono fermo
- [ ] 5.2 Applicare dead zone, normalizzazione su `TILT_RANGE` e smoothing dipendente da `dt`; verifica: a telefono fermo il giocatore non vibra e a inclinazione piena la velocità satura
- [ ] 5.3 Collegare `axis()` alla velocità orizzontale del giocatore; verifica: su telefono il personaggio sterza in modo proporzionale e si ferma al centro

## 6. Fallback senza sensori

- [ ] 6.1 Gestire la richiesta di permesso dentro il primo tocco e marcare la sorgente non disponibile se negata o se nessun evento arriva entro 1,5 s; verifica: negando il permesso il gioco parte lo stesso
- [ ] 6.2 Aggiungere il controllo da tastiera (frecce sinistra/destra) come sorgente attiva su desktop; verifica: su PC il giocatore sterza con le frecce
- [ ] 6.3 Aggiungere il drag orizzontale via `engine.input.pointers` basato su delta; verifica: trascinando il dito il personaggio segue senza che il dito debba stare sopra di lui

## 7. Taratura e verifica finale

- [ ] 7.1 Tarare `CLIMB_SPEED`, `MAX_HORIZONTAL_SPEED`, `TILT_RANGE`, `TILT_DEAD_ZONE` e `SMOOTH_TAU` giocando almeno tre partite da telefono; verifica: la sterzata è controllabile e la salita non è né noiosa né ingestibile
- [ ] 7.2 Eseguire il giro completo su telefono via quick tunnel: primo tocco, permesso, partita, morte, riavvio; verifica: nessun errore in console e nessuno stato bloccato
- [ ] 7.3 Verificare `npm run build` e `npm run typecheck` puliti e aggiornare `README.md` con i comandi di avvio e la nota sul tunnel HTTPS

## Workflow follow-up

- Archiviare il change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec in `openspec/specs/`
