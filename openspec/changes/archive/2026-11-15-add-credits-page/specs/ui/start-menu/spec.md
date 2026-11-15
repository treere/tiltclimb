# Spec Delta

## MODIFIED Requirements

### Requirement: Menu come primo stato dell'applicazione

All'apertura della pagina il sistema SHALL mostrare il menu, con il titolo del gioco, la lettura della calibrazione e i comandi **Calibra**, **Inizia gioco** e **CREDITI**. La partita MUST NOT iniziare senza un comando esplicito dell'utente. Il menu MUST essere utilizzabile sia da telefono sia da desktop, e i tre comandi MUST restare visibili senza sovrapporsi fra loro né all'illustrazione dell'astronave.

#### Scenario: Apertura della pagina

- **WHEN** l'utente apre il gioco su telefono o desktop
- **THEN** vede il menu con tutti e tre i comandi e la partita non è iniziata

#### Scenario: Nessun avvio implicito

- **WHEN** l'utente tocca lo schermo in un punto qualsiasi fuori dai comandi
- **THEN** la partita non parte

#### Scenario: Tre comandi visibili

- **WHEN** il menu è mostrato su uno schermo piccolo
- **THEN** Calibra, Inizia gioco e CREDITI sono tutti visibili e distinti
