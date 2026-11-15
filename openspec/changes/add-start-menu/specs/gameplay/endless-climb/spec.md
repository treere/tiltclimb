# Spec Delta

## REMOVED Requirements

### Requirement: Ciclo partita con riavvio immediato

**Reason**: la partita non riparte più con un tocco sulla schermata di fine: ora si torna al menu, dove il risultato viene mostrato insieme ai comandi di calibrazione e di avvio. Il riavvio cieco non lasciava spazio al riepilogo né alla correzione dell'assetto.

**Migration**: dopo la morte il gioco torna al menu; per rigiocare si preme **Inizia gioco**. Il punteggio della partita appena conclusa e il migliore di sessione sono mostrati nel menu.

## ADDED Requirements

### Requirement: Ciclo partita con ritorno al menu

Alla fine di una partita il sistema SHALL tornare al menu entro un tempo percepito come immediato, senza ricaricare la pagina, e MUST NOT far ripartire automaticamente il gioco. Nel menu SHALL essere visibile l'esito della partita appena conclusa.

#### Scenario: Ritorno al menu dopo la collisione

- **WHEN** il giocatore tocca un ostacolo
- **THEN** la partita si chiude e la schermata diventa il menu, con l'esito appena ottenuto

#### Scenario: Nessuna ripartenza automatica

- **WHEN** il gioco torna al menu dopo una sconfitta
- **THEN** nessuna nuova partita parte finché l'utente non preme **Inizia gioco**

#### Scenario: Nuova partita pulita

- **WHEN** l'utente preme **Inizia gioco** dopo una sconfitta
- **THEN** la scena riparte dallo stato iniziale, con punteggio a zero e ostacoli azzerati
