# Spec Delta

## MODIFIED Requirements

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
