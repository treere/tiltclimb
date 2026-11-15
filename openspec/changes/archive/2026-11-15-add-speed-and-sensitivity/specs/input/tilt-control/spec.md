# Spec Delta

## MODIFIED Requirements

### Requirement: Sterzata proporzionale al tilt

Con i sensori attivi, il sistema SHALL tradurre l'inclinazione sinistra/destra del dispositivo in una velocità orizzontale del giocatore, proporzionale all'angolo inclinato e con segno corrispondente alla direzione. L'inclinazione a destra SHALL muovere il giocatore a destra e quella a sinistra a sinistra, su schermo in orientamento verticale. La proporzionalità MUST usare l'inclinazione di fondo scala scelta come sensibilità, che di default è più reattiva di quella delle versioni precedenti.

#### Scenario: Inclinazione verso destra

- **WHEN** il telefono è inclinato verso destra oltre la dead zone
- **THEN** il giocatore si muove verso destra, tanto più veloce quanto maggiore è l'angolo

#### Scenario: Telefono in piano

- **WHEN** il telefono è tenuto nell'inclinazione neutra
- **THEN** il giocatore non si muove in orizzontale da solo

#### Scenario: Default più reattivo

- **WHEN** il gioco viene avviato senza impostazioni salvate
- **THEN** la nave raggiunge il fondo scala a un'inclinazione inferiore a quella delle versioni precedenti

## ADDED Requirements

### Requirement: Sensibilità regolabile e persistente

La sensibilità SHALL essere espressa come inclinazione necessaria a raggiungere il fondo scala e SHALL essere selezionabile fra cinque livelli, da 22° (morbido) a 8° (nervoso), con 13° come default. Il valore scelto MUST restare memorizzato sul dispositivo, MUST essere applicato dalla partita successiva e MUST NOT invalidare la calibrazione già effettuata.

#### Scenario: Livello nervoso

- **WHEN** si seleziona il livello più sensibile
- **THEN** basta un'inclinazione minore per spostare la nave a fondo scala

#### Scenario: Livello morbido

- **WHEN** si seleziona il livello meno sensibile
- **THEN** serve un'inclinazione maggiore, utile per chi ha una mano poco ferma

#### Scenario: Riapertura del gioco

- **WHEN** il gioco viene riaperto dopo aver cambiato sensibilità
- **THEN** la sensibilità salvata è quella attiva

#### Scenario: Cambio prima di una partita

- **WHEN** la sensibilità cambia dal menu
- **THEN** la nuova sensibilità vale da subito e lo zero calibrato resta valido
