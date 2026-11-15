# Spec Delta

## Purpose

Definisce cosa si sente e quando: una musica per il menu e una per la partita, un timbro per ogni nemico, un'esplosione per ogni abbattimento, il suono della sconfitta e quello del record, e la possibilità di zittire tutto.

## ADDED Requirements

### Requirement: Musica nelle due scene

Il sistema SHALL riprodurre una traccia musicale in loop nel menu e una traccia diversa durante la partita. Il passaggio da una all'altra SHALL avvenire al cambio di scena, senza sovrapposizioni prolungate, e la traccia della partita SHALL ripartire dall'inizio a ogni partita.

#### Scenario: Musica di menu

- **WHEN** l'utente è nel menu
- **THEN** sente la traccia del menu in loop

#### Scenario: Musica di partita

- **WHEN** la partita inizia
- **THEN** la traccia del menu si ferma e parte quella della partita

#### Scenario: Ritorno al menu

- **WHEN** la partita finisce e si torna al menu
- **THEN** la musica di partita si ferma e riprende quella del menu

### Requirement: Nessun suono prima di un gesto dell'utente

L'audio SHALL partire solo dopo un gesto dell'utente (tocco o tasto), perché i browser bloccano la riproduzione automatica. Se l'audio non è disponibile o viene bloccato, il gioco SHALL restare giocabile e MUST NOT mostrare errori bloccanti.

#### Scenario: Primo tocco

- **WHEN** l'utente tocca lo schermo per la prima volta
- **THEN** l'audio si sblocca e la musica del menu parte

#### Scenario: Audio bloccato dal browser

- **WHEN** il browser rifiuta la riproduzione
- **THEN** il gioco prosegue senza audio e senza messaggi di errore invasivi

### Requirement: Effetti legati agli eventi

Il sistema SHALL riprodurre un effetto per ogni evento rilevante: sparo dell'eroe, sparo di una nave nemica, abbattimento di una nave nemica, morte dell'eroe. Gli effetti SHALL essere brevi e sovrapponibili, così che più eventi ravvicinati non si taglino a vicenda.

#### Scenario: Sparo dell'eroe

- **WHEN** l'eroe spara
- **THEN** si sente un effetto di sparo, anche se un altro sparo era ancora in corso

#### Scenario: Abbattimento

- **WHEN** un colpo dell'eroe distrugge una nave nemica
- **THEN** si sente un'esplosione nel punto in cui si trovava la nave

### Requirement: Un timbro per ogni tipo di nemico

Ogni archetipo nemico SHALL avere un proprio suono di sparo e un proprio suono di esplosione, distinguibili fra loro anche senza guardare lo schermo.

#### Scenario: Quattro nemici, quattro voci

- **WHEN** sparano o vengono abbattuti tipi diversi di nave nemica
- **THEN** i suoni sono riconoscibilmente diversi per tipo

### Requirement: Suono di sconfitta e suono di record

Alla fine di una partita il sistema SHALL riprodurre un suono di sconfitta. Se il punteggio della partita supera il migliore della sessione precedente, SHALL riprodurre invece un suono diverso, riconoscibile come successo.

#### Scenario: Sconfitta normale

- **WHEN** la partita finisce senza superare il record
- **THEN** si sente il suono di sconfitta

#### Scenario: Record superato

- **WHEN** la partita finisce con un punteggio superiore al migliore precedente
- **THEN** si sente il suono di record, non quello di sconfitta

### Requirement: Interruttore audio

Il menu SHALL offrire un comando per attivare o disattivare tutto l'audio, visibile e raggiungibile col pollice. Lo stato SHALL essere ricordato fra una sessione e l'altra sullo stesso dispositivo, e con l'audio disattivato MUST NOT partire alcun suono.

#### Scenario: Disattivazione

- **WHEN** l'utente disattiva l'audio dal menu
- **THEN** musica ed effetti si fermano e non ripartono al cambio scena

#### Scenario: Stato ricordato

- **WHEN** l'utente ricarica il gioco dopo aver disattivato l'audio
- **THEN** il gioco riparte silenzioso, con il comando nello stato disattivato
