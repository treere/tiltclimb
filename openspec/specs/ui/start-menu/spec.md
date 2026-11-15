# ui/start-menu Specification

## Purpose
È la prima schermata del gioco: mostra come risponde il sensore, permette di fissare l'inclinazione neutra e di far partire la partita, e accoglie il giocatore al ritorno con il risultato dell'ultima salita.

## Requirements

### Requirement: Menu come primo stato dell'applicazione

All'apertura della pagina il sistema SHALL mostrare il menu, con il titolo del gioco, la lettura della calibrazione e i comandi **Calibra** e **Inizia gioco**. La partita MUST NOT iniziare senza un comando esplicito dell'utente. Il menu MUST essere utilizzabile sia da telefono sia da desktop.

#### Scenario: Apertura della pagina

- **WHEN** l'utente apre il gioco su telefono o desktop
- **THEN** vede il menu con entrambi i comandi e la partita non è iniziata

#### Scenario: Nessun avvio implicito

- **WHEN** l'utente tocca lo schermo in un punto qualsiasi fuori dai comandi
- **THEN** la partita non parte

### Requirement: Lettura live della calibrazione nel menu

Il menu SHALL mostrare in tempo reale l'inclinazione sinistra/destra rilevata, espressa come scostamento rispetto allo zero corrente, aggiornandosi mentre l'utente muove il dispositivo. La lettura SHALL essere comprensibile senza conoscere i valori grezzi del sensore.

#### Scenario: Il valore segue l'inclinazione

- **WHEN** l'utente inclina il telefono a destra di una decina di gradi
- **THEN** la lettura nel menu si sposta verso destra e mostra un valore positivo coerente

#### Scenario: Lettura ferma a telefono fermo

- **WHEN** l'utente tiene il telefono immobile nell'inclinazione neutra
- **THEN** la lettura resta vicina allo zero, senza oscillare in modo visibile

### Requirement: Comando di calibrazione con conferma visibile

Il comando **Calibra** SHALL fissare come zero l'inclinazione corrente del dispositivo e MUST mostrare una conferma visibile che l'operazione è avvenuta. Dopo la calibrazione la lettura SHALL ripartire da zero nell'inclinazione in cui è stato premuto il comando.

#### Scenario: Calibrazione applicata

- **WHEN** l'utente inclina il telefono e preme **Calibra**
- **THEN** compare una conferma visibile e la lettura torna a zero in quella posizione

#### Scenario: Calibrazione senza sensore

- **WHEN** il sensore non è disponibile e l'utente preme **Calibra**
- **THEN** il sistema spiega che non c'è nulla da calibrare e non mostra una falsa conferma

### Requirement: Avvio della partita dal menu

Il comando **Inizia gioco** SHALL avviare una nuova partita dallo stato iniziale, azzerando punteggio e posizione, e SHALL essere disponibile anche quando i sensori non funzionano.

#### Scenario: Avvio dal menu

- **WHEN** l'utente preme **Inizia gioco**
- **THEN** si passa alla partita con punteggio a zero e giocatore nella posizione iniziale

#### Scenario: Avvio senza sensori

- **WHEN** il permesso è negato o l'accelerometro manca e l'utente preme **Inizia gioco**
- **THEN** la partita parte e risponde ai comandi di fallback

### Requirement: Ritorno al menu con riepilogo del risultato

Alla fine di una partita il sistema SHALL tornare al menu invece di far ripartire il gioco, e il menu SHALL mostrare il punteggio appena ottenuto e il migliore della sessione corrente. Il migliore SHALL aggiornarsi solo quando il punteggio appena fatto lo supera.

#### Scenario: Ritorno dopo la sconfitta

- **WHEN** il giocatore muore dopo aver totalizzato 42 punti
- **THEN** torna al menu, che mostra 42 come punteggio appena fatto

#### Scenario: Migliore aggiornato

- **WHEN** il punteggio appena fatto supera il migliore della sessione
- **THEN** il migliore mostrato diventa quello appena fatto

#### Scenario: Migliore non peggiora

- **WHEN** il punteggio appena fatto è inferiore al migliore della sessione
- **THEN** il migliore mostrato resta invariato

### Requirement: Avviso quando i sensori non sono disponibili

Quando il permesso viene negato, il sensore è assente o non arrivano dati entro il tempo previsto, il menu SHALL mostrare un avviso esplicito che spiega che si gioca con tastiera o trascinamento. L'avviso MUST NOT impedire l'avvio della partita.

#### Scenario: Permesso negato

- **WHEN** l'utente rifiuta il permesso di accesso ai sensori nel menu
- **THEN** compare un avviso nel menu e **Inizia gioco** resta utilizzabile

#### Scenario: Nessun dato dal sensore

- **WHEN** il dispositivo dichiara di avere il sensore ma non arrivano eventi
- **THEN** dopo il tempo previsto il menu mostra l'avviso di sensore non disponibile
