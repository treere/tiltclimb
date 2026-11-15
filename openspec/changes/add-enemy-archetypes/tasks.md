# Tasks

## 1. Asset e tabella degli archetipi

- [x] 1.1 Copiare nei asset `enemyRed1`, `enemyBlue4`, `enemyGreen2` e `ufoYellow` (quest'ultimo non ancora nel repo) aggiungendoli al loader; verifica: nessun 404 e `npm run check` verde
- [x] 1.2 Creare `src/game/enemy-archetypes.ts` con il tipo `EnemyKind`, la tabella `ARCHETYPES` (sprite, punti, soglia, parametri di movimento e di fuoco) e una funzione `kindsAvailableAt(height)`; verifica: i quattro tipi sono descritti solo dalla tabella, nessun numero magico in `enemy.ts`

## 2. Proiettili con angolo

- [x] 2.1 Estendere `Projectile.launch` con un angolo opzionale in radianti e far controllare a `isOutside` anche l'asse X; verifica: un colpo lanciato a 18° viaggia obliquo e viene riciclato uscendo di lato
- [x] 2.2 Aggiungere al pool un helper per raffiche multiple (n colpi con ritardo); verifica: una raffica di 4 produce quattro proiettili distinti, non uno solo sovrascritto

## 3. Comportamenti dei quattro tipi

- [ ] 3.1 Riscrivere `Enemy` perché usi l'archetipo: sprite e punti dal tipo, `weave` solo per la pattuglia, discesa veloce e deriva per il picchiatore, inseguimento orizzontale per il cacciatore, stazionamento a mezza altezza per la torretta; verifica: ogni tipo si muove come descritto nella tabella
- [ ] 3.2 Implementare i quattro schemi di fuoco (singolo, raffica di 2, ventaglio di 3, raffica di 4 con pausa lunga) con le cadenze della tabella; verifica: osservando ciascun tipo per un ciclo completo si contano i colpi attesi
- [x] 3.3 Selezionare il tipo allo spawn pescando solo fra quelli sbloccati all'altezza corrente; verifica: sotto i 2500 px compaiono solo pattuglie

## 4. Difficoltà e punteggio

- [x] 4.1 Rendere dinamico il limite di nemici vivi (2, poi 3 quando il cacciatore è sbloccato); verifica: prima della soglia non si vedono mai tre navi insieme, dopo sì
- [x] 4.2 Sostituire `KILL_POINTS` con i punti dell'archetipo, sommando in un contatore accumulato; verifica: abbattere una pattuglia aggiunge 25 punti, una torretta 60, e il totale non torna mai indietro
- [x] 4.3 Aggiornare `climbScore` perché riceva i punti accumulati invece del conteggio per costante fissa; verifica: `npm run check` verde e nessun riferimento a `KILL_POINTS`

## 5. Documentazione

- [x] 5.1 Aggiornare `README.md` con i quattro tipi, le soglie di sblocco e il punteggio per tipo; verifica: le informazioni corrispondono alla tabella nel codice

## 6. Verifica finale

- [ ] 6.1 Giro su telefono: giocare fino a superare le tre soglie e riconoscere a occhio i quattro tipi; verifica: ogni tipo si distingue per forma e comportamento
- [ ] 6.2 Giudizio sulla difficoltà: il cacciatore deve essere scappabile lateralmente e il ventaglio non deve chiudere lo spazio; verifica: tre partite senza morte percepita come ingiusta
- [ ] 6.3 Controllare che la crescita di difficoltà si senta: le prime fasi devono essere tranquille e le ultime tese; verifica: giudizio dopo almeno una partita lunga

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
