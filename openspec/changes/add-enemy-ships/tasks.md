# Tasks

## 1. Asset e costanti

- [x] 1.1 Copiare nel repo le navi nemiche `enemyRed1`–`enemyRed5` e i laser `laserBlue01`/`laserRed01` dal pack già presente, aggiornando `license.txt` e i crediti se serve; verifica: i file sono in `public/assets/kenney/`, `npm run check` verde e nessun 404 a runtime
- [x] 1.2 Aggiungere a `constants.ts` le costanti del combattimento (velocità dei colpi, frequenza e limiti nemici, ampiezza dell'onda, punti per abbattimento); verifica: `npm run typecheck` verde e nessun numero magico nel codice nuovo

## 2. Proiettili

- [x] 2.1 Creare `src/game/projectile.ts` con `Projectile` (fazione, sprite, velocità, `CollisionType.PreventCollision`) e un pool da 40 con `spawn(faction, x, y)` e riciclo fuori schermo; verifica: sparando ripetutamente il numero di actor resta costante
- [ ] 2.2 Aggiornare i proiettili a ogni frame e riciclare quelli usciti dai bordi; verifica: dopo 30 secondi di fuoco continuo nessun proiettile resta fermo o visibile fuori dallo schermo

## 3. Fuoco dell'eroe

- [ ] 3.1 Aggiungere il pulsante di fuoco in basso nello schermo, con `Button` a tema e posizione che non copre nave né asteroidi; verifica: il pulsante è raggiungibile col pollice e non si sovrappone all'eroe
- [ ] 3.2 Collegare il tocco a un singolo colpo con guardia anti-doppio (`SHOT_MIN_INTERVAL_MS`), senza alcun timer automatico; verifica: un tocco lungo produce un colpo solo, tocchi ripetuti producono un colpo ciascuno
- [x] 3.3 Far partire il colpo dalla punta dell'astronave e muoverlo verso l'alto; verifica: il colpo nasce davanti alla nave e sale dritto

## 4. Navi nemiche

- [ ] 4.1 Creare `src/game/enemy.ts` con `Enemy` (sprite casuale fra i cinque, pool, `PreventCollision`) e la logica di discesa lenta + onda orizzontale; verifica: la nave scende lentamente e la sua x oscilla in modo continuo restando nei bordi
- [x] 4.2 Aggiungere lo spawn periodico con limite di navi contemporanee; verifica: non compaiono mai più di `ENEMY_MAX_ALIVE` navi insieme e le nuove arrivano a intervalli regolari
- [x] 4.3 Far sparare ogni nave verso il basso a intervalli regolari, solo mentre è visibile; verifica: la nave produce proiettili rossi che scendono e scompaiono sotto il bordo

## 5. Collisioni e punteggio

- [x] 5.1 Implementare i test cerchio-cerchio fra proiettili e bersagli: colpo eroe × nave nemica (nave distrutta, colpo consumato), colpo eroe × asteroide (nessun effetto), colpo nemico × eroe (fine partita); verifica: i tre casi si comportano come da spec
- [x] 5.2 Terminare la partita anche al contatto eroe × nave nemica; verifica: toccando una nave la partita finisce come con un asteroide
- [x] 5.3 Sommare al punteggio i punti per abbattimento e registrare il contatore in `session`; verifica: il punteggio sale di `KILL_POINTS` a ogni abbattimento e non scende mai

## 6. Riepilogo e pulizia

- [ ] 6.1 Mostrare nel menu il numero di navi abbattute accanto a ultimo e migliore punteggio; verifica: dopo una partita con due abbattimenti il menu mostra 2
- [x] 6.2 Azzerare proiettili, nemici e contatore abbattimenti in `startRun` e in `onDeactivate`; verifica: due partite consecutive non ereditano proiettili o nemici dalla precedente
- [x] 6.3 Aggiornare `README.md` con il combattimento (tasto di fuoco, nemici, immunità degli asteroidi) ed eseguire `npm run check`; verifica: comando verde e documentazione coerente

## 7. Verifica finale

- [ ] 7.1 Giro su telefono via tunnel: spara, abbatti una nave, fatti colpire da un proiettile, fatti colpire da una nave, verifica che gli asteroidi fermino o no i colpi; verifica: ogni caso si comporta come descritto
- [ ] 7.2 Giudizio sulla difficoltà: due nemici insieme devono essere impegnativi ma gestibili, e le navi devono essere abbattibili mentre ondeggiano; verifica: tre partite di prova senza sensazione di ingiocabilità
- [ ] 7.3 Controllare che il pulsante di fuoco non rubi spazio al gioco e resti comodo col pollice della mano che tiene il telefono; verifica: giudizio a occhio su schermo piccolo

## 8. Ritocchi chiesti dopo la prova

- [x] 8.1 Rendere i proiettili leggibili su telefono: i laser Kenney (9×54) erano scalati a 28 px di lunghezza e 4,7 px di larghezza, invisibili su schermo piccolo; verifica: ora sono 46×12 px logici con collisore a raggio 7 e si vedono in partita

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
