# Spec Delta

## ADDED Requirements

### Requirement: Controllo della sensibilità nel menu

Il menu SHALL mostrare un controllo per la sensibilità dello sterzo, con il livello corrente visibile e i gradi di inclinazione corrispondenti al fondo scala. Il controllo MUST essere utilizzabile con un tocco, senza trascinamenti di precisione, e MUST applicare la scelta immediatamente.

#### Scenario: Lettura del livello

- **WHEN** il menu è visibile
- **THEN** si legge a quale livello di sensibilità è impostato il gioco e quanti gradi servono per il fondo scala

#### Scenario: Aumento della sensibilità

- **WHEN** si tocca il comando per aumentare la sensibilità
- **THEN** il livello sale di uno, il valore mostrato si aggiorna e la scelta viene salvata

#### Scenario: Limiti del controllo

- **WHEN** si è già al livello massimo o minimo
- **THEN** il comando corrispondente risulta disattivato e non è possibile uscire dall'intervallo

#### Scenario: Il controllo non copre il gioco

- **WHEN** il menu è visibile su uno schermo piccolo
- **THEN** il controllo non si sovrappone ai pulsanti di calibrazione e di avvio
