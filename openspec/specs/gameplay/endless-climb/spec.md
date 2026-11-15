# gameplay/endless-climb Specification

## Purpose
Definisce il ciclo di gioco di un'arrampicata verticale infinita: il mondo scorre, gli ostacoli arrivano dall'alto, il giocatore sale finché non sbaglia, e il punteggio misura l'altezza raggiunta.

## Requirements

### Requirement: Salita automatica con camera a un asse

Il giocatore SHALL salire automaticamente verso l'alto a velocità costante. La camera SHALL seguire il giocatore solo sull'asse verticale, mantenendolo sempre visibile, e MUST NOT spostarsi orizzontalmente con lui.

#### Scenario: La camera insegue in verticale

- **WHEN** il giocatore sale oltre il centro dello schermo
- **THEN** la camera si sposta verso l'alto mantenendo il giocatore nella stessa posizione verticale relativa

#### Scenario: Lo spostamento orizzontale non muove il mondo

- **WHEN** il giocatore si sposta a sinistra o a destra
- **THEN** gli ostacoli e lo sfondo restano fermi in orizzontale

### Requirement: Generazione e riciclo degli ostacoli

Il sistema SHALL generare ostacoli sopra il bordo superiore dello schermo a intervalli regolari e MUST riciclare quelli usciti sotto il bordo inferiore invece di crearne di nuovi. Il numero di ostacoli contemporaneamente attivi SHALL restare limitato e costante durante la partita.

#### Scenario: Nuovo ostacolo sopra lo schermo

- **WHEN** il mondo è scorso di una distanza pari all'intervallo di generazione
- **THEN** compare un nuovo ostacolo sopra il bordo superiore, fuori dalla vista

#### Scenario: Riciclo sotto il bordo inferiore

- **WHEN** un ostacolo esce dal bordo inferiore dello schermo
- **THEN** torna disponibile nel pool e viene riutilizzato per una generazione successiva, senza aumentare il numero di ostacoli attivi

### Requirement: Collisione e fine partita

Il contatto tra il giocatore e un ostacolo SHALL terminare la partita. Dopo la fine, il mondo SHALL fermarsi e MUST NOT continuare a generare ostacoli, navi nemiche o proiettili finché la partita non viene riavviata.

#### Scenario: Impatto contro un ostacolo

- **WHEN** il giocatore tocca un ostacolo
- **THEN** la partita termina e lo scorrimento si interrompe

#### Scenario: Impatto contro un proiettile nemico

- **WHEN** il giocatore tocca un proiettile nemico
- **THEN** la partita termina e lo scorrimento si interrompe

#### Scenario: Impatto contro una nave nemica

- **WHEN** il giocatore tocca una nave nemica
- **THEN** la partita termina e lo scorrimento si interrompe

#### Scenario: Nessuna generazione dopo la fine

- **WHEN** la partita è terminata e l'utente non ha ancora riavviato
- **THEN** non vengono creati né riciclati ostacoli, navi nemiche o proiettili

### Requirement: Punteggio per altezza

Il punteggio SHALL essere la somma dei punti per l'altezza massima raggiunta nella partita corrente e dei punti guadagnati abbattendo navi nemiche, e SHALL essere visibile durante il gioco. Il valore SHALL restare in memoria per la sessione e MUST NOT essere salvato in modo persistente in questa iterazione.

#### Scenario: Il punteggio cresce salendo

- **WHEN** il giocatore sale e supera la propria altezza massima precedente
- **THEN** il punteggio mostrato aumenta in modo monotono

#### Scenario: Il punteggio cresce abbattendo

- **WHEN** il giocatore abbatte una nave nemica
- **THEN** il punteggio mostrato aumenta dello stesso valore previsto dalla spec del combattimento

#### Scenario: Riavvio azzera il punteggio

- **WHEN** l'utente riavvia la partita dopo una sconfitta
- **THEN** il punteggio riparte da zero, l'altezza massima viene reimpostata e gli abbattimenti tornano a zero

### Requirement: Ciclo partita con ritorno al menu

Alla fine di una partita il sistema SHALL tornare al menu entro un tempo percepito come immediato, senza ricaricare la pagina, e MUST NOT far ripartire automaticamente il gioco. Nel menu SHALL essere visibile l'esito della partita appena conclusa.

#### Scenario: Ritorno al menu dopo la collisione

- **WHEN** il giocatore tocca un ostacolo
- **THEN** la partita si chiude e la schermata diventa il menu, con l'esito appena ottenuto

#### Scenario: Nessuna ripartenza automatica

- **WHEN** il gioco torna al menu dopo una sconfitta
- **THEN** nessuna nuova partita parte finché l'utente non preme **Inizia gioco**

#### Scenario: Nuova partita pulita

- **WHEN** l'utente preme **Inizia gioco** dopo una sconfitta
- **THEN** la scena riparte dallo stato iniziale, con punteggio a zero e ostacoli azzerati
