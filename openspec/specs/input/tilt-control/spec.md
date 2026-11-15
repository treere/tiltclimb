# input/tilt-control Specification

## Purpose
Trasforma l'inclinazione del telefono in un comando di sterzata continuo e prevedibile, e garantisce che il gioco resti giocabile anche quando il sensore non c'è o il permesso viene negato.

## Requirements

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

Su piattaforme che richiedono un consenso esplicito per i sensori, il sistema SHALL chiedere il permesso solo in risposta a un'azione dell'utente compiuta nel menu, e SHALL gestire l'esito negativo senza interrompere il gioco né bloccare il menu.

#### Scenario: Primo tocco su Android o iOS

- **WHEN** l'utente preme **Calibra** o **Inizia gioco** per la prima volta
- **THEN** la richiesta di permesso avviene dentro quel tocco e l'esito viene registrato prima di proseguire

#### Scenario: Permesso negato senza bloccare il menu

- **WHEN** l'utente nega il permesso richiesto dal menu
- **THEN** il menu mostra l'avviso di sensore non disponibile e resta utilizzabile

### Requirement: Calibrazione esplicita comandata dal menu

Il sistema SHALL usare come inclinazione neutra quella fissata dall'ultima calibrazione esplicita, e MUST sottrarre quel valore a tutte le letture successive. In assenza di calibrazione esplicita SHALL usare l'inclinazione rilevata all'apertura del menu. L'avvio di una partita MUST NOT ricalibrare in modo implicito.

#### Scenario: Zero fissato dalla calibrazione

- **WHEN** l'utente preme **Calibra** con il telefono inclinato di 12 gradi
- **THEN** quella posizione vale zero per la partita successiva e il giocatore non deriva

#### Scenario: Calibrazione mantenuta fra partite diverse

- **WHEN** l'utente gioca, muore e riparte senza premere **Calibra**
- **THEN** lo zero resta quello dell'ultima calibrazione esplicita

#### Scenario: Zero iniziale senza calibrazione

- **WHEN** l'utente apre il menu e avvia subito la partita senza calibrare
- **THEN** lo zero è l'inclinazione con cui ha aperto il menu

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
