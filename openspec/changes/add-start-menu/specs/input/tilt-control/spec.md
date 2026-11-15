# Spec Delta

## REMOVED Requirements

### Requirement: Calibrazione dello zero al primo tocco

**Reason**: la calibrazione non è più implicita all'avvio della partita: ora è un comando esplicito nel menu, con lettura visibile e conferma, perché la calibrazione silenziosa nascondeva i problemi di assetto del telefono.

**Migration**: chi giocava con lo zero automatico ora preme **Calibra** nel menu; senza quel tocco lo zero resta l'inclinazione all'apertura del menu, quindi il comportamento di partenza non peggiora.

## MODIFIED Requirements

### Requirement: Richiesta permessi dentro un gesto utente

Su piattaforme che richiedono un consenso esplicito per i sensori, il sistema SHALL chiedere il permesso solo in risposta a un'azione dell'utente compiuta nel menu, e SHALL gestire l'esito negativo senza interrompere il gioco né bloccare il menu.

#### Scenario: Primo tocco su Android o iOS

- **WHEN** l'utente preme **Calibra** o **Inizia gioco** per la prima volta
- **THEN** la richiesta di permesso avviene dentro quel tocco e l'esito viene registrato prima di proseguire

#### Scenario: Permesso negato senza bloccare il menu

- **WHEN** l'utente nega il permesso richiesto dal menu
- **THEN** il menu mostra l'avviso di sensore non disponibile e resta utilizzabile

## ADDED Requirements

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
