# Spec Delta

## MODIFIED Requirements

### Requirement: I pulsanti del menu sono a tema

I pulsanti SHALL usare la palette dello spazio con fondo **opaco**, bordo luminoso marcato e testo chiaro, e SHALL distinguere visivamente lo stato normale da quello premuto e da quello disabilitato. Il fondo MUST essere opaco, così che il campo stellato non passi sotto l'etichetta, e il contrasto fra testo e fondo SHALL essere almeno 7:1 in ogni stato.

#### Scenario: Pulsante su sfondo stellato

- **WHEN** il menu mostra i pulsanti sopra il campo stellato
- **THEN** il fondo è opaco, il bordo è distinguibile dallo sfondo e il testo ha contrasto di almeno 7:1

#### Scenario: Stato premuto e disabilitato

- **WHEN** l'utente preme un pulsante o un pulsante è disabilitato
- **THEN** l'aspetto cambia in modo riconoscibile e il contrasto del testo resta di almeno 7:1

## ADDED Requirements

### Requirement: Testi leggibili sopra lo sfondo animato

Le scritte del menu, dell'HUD e della pagina crediti SHALL restare leggibili sopra lo sfondo stellato, usando un'ombra o un contorno dietro al testo quando il fondo non è opaco, e una dimensione minima tale da essere letta senza sforzo su uno schermo da telefono.

#### Scenario: HUD sopra le stelle

- **WHEN** il punteggio è mostrato sopra il campo stellato durante la partita
- **THEN** le cifre restano leggibili mentre lo sfondo scorre

#### Scenario: Testo della pagina crediti

- **WHEN** la pagina crediti mostra il racconto
- **THEN** le righe sono leggibili senza ambiguità e il testo va a capo invece di uscire dallo schermo
