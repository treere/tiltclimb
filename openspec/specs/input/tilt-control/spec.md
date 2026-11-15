# input/tilt-control Specification

## Purpose
Trasforma l'inclinazione del telefono in un comando di sterzata continuo e prevedibile, e garantisce che il gioco resti giocabile anche quando il sensore non c'è o il permesso viene negato.

## Requirements

### Requirement: Sterzata proporzionale al tilt

Con i sensori attivi, il sistema SHALL tradurre l'inclinazione sinistra/destra del dispositivo in una velocità orizzontale del giocatore, proporzionale all'angolo inclinato e con segno corrispondente alla direzione. L'inclinazione a destra SHALL muovere il giocatore a destra e quella a sinistra a sinistra, su schermo in orientamento verticale.

#### Scenario: Inclinazione verso destra

- **WHEN** il telefono è inclinato verso destra oltre la dead zone
- **THEN** il giocatore si muove verso destra, tanto più veloce quanto maggiore è l'angolo

#### Scenario: Telefono in piano

- **WHEN** il telefono è tenuto nell'inclinazione neutra
- **THEN** il giocatore non si muove in orizzontale da solo

### Requirement: Calibrazione dello zero al primo tocco

Il sistema SHALL assumere come inclinazione neutra quella del dispositivo al momento in cui l'utente avvia la partita, e MUST sottrarre questo valore a tutte le letture successive, così che il giocatore non derivi a causa di come il telefono viene impugnato.

#### Scenario: Zero catturato all'avvio

- **WHEN** l'utente avvia la partita con il telefono inclinato di 12 gradi
- **THEN** quella posizione vale zero e il giocatore resta fermo finché l'inclinazione non cambia

#### Scenario: Ricalibrazione fra una partita e l'altra

- **WHEN** l'utente riavvia la partita con il telefono in una posizione diversa
- **THEN** il nuovo zero è la posizione assunta al riavvio

### Requirement: Smorzamento e dead zone

Il sistema SHALL filtrare le letture del sensore per ridurre il tremolio e SHALL ignorare le inclinazioni inferiori a una soglia minima, così che il giocatore non vibri quando il telefono è quasi fermo. Il movimento SHALL risultare fluido e non a scatti alla frequenza di aggiornamento disponibile sul dispositivo.

#### Scenario: Tremolio da mano ferma

- **WHEN** il telefono è fermo ma il sensore oscilla di pochi decimi di grado
- **THEN** il giocatore resta immobile

#### Scenario: Frequenza di aggiornamento bassa

- **WHEN** il dispositivo emette eventi di orientamento meno di 30 volte al secondo
- **THEN** il movimento del giocatore resta continuo, senza salti visibili

### Requirement: Fallback senza sensori

Quando il sensore non è disponibile, il permesso è negato o l'utente gioca da desktop, il sistema SHALL rendere il gioco pienamente controllabile con la tastiera (frecce sinistra/destra) e con il trascinamento orizzontale del dito o del mouse. Il gioco MUST NOT bloccarsi in attesa di un permesso.

#### Scenario: Permesso negato

- **WHEN** l'utente rifiuta il permesso di accesso ai sensori
- **THEN** la partita parte comunque e risponde ai comandi di fallback

#### Scenario: Partita da desktop

- **WHEN** la pagina viene aperta su un computer senza accelerometro
- **THEN** le frecce orizzontali muovono il giocatore e nessun messaggio di errore blocca l'avvio

### Requirement: Richiesta permessi dentro un gesto utente

Su piattaforme che richiedono un consenso esplicito per i sensori, il sistema SHALL chiedere il permesso solo in risposta a un'azione dell'utente e SHALL gestire l'esito negativo senza interrompere il gioco.

#### Scenario: Primo tocco su Android o iOS

- **WHEN** l'utente tocca per iniziare la partita
- **THEN** la richiesta di permesso avviene dentro quel tocco e l'esito viene registrato prima di iniziare lo scorrimento
