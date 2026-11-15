# gameplay/difficulty-ramp Specification

## Purpose
Rende la partita più tesa man mano che si sale, senza che il mondo si sfasi.

## Requirements

### Requirement: Velocità di salita progressiva

La velocità di salita SHALL partire dal valore iniziale e crescere in funzione dei pixel scalati, fino a un tetto massimo. La crescita MUST essere deterministica rispetto all'altezza e MUST NOT dipendere dal tempo trascorso o dal frame rate.

#### Scenario: Inizio partita

- **WHEN** la partita comincia
- **THEN** la salita procede alla velocità iniziale

#### Scenario: Salita prolungata

- **WHEN** il giocatore supera diverse migliaia di pixel di altezza
- **THEN** la salita accelera in modo continuo, senza scatti visibili

#### Scenario: Tetto raggiunto

- **WHEN** l'altezza supera la soglia del tetto
- **THEN** la velocità resta costante a quel valore e non cresce ulteriormente

### Requirement: Scorrimento coerente con la velocità corrente

Parallasse, ostacoli e navi nemiche SHALL usare la velocità di salita corrente, così che il movimento relativo del mondo resti coerente quando il gioco accelera. La distanza fra un ostacolo e il successivo MUST restare quella prevista, espressa in pixel di salita.

#### Scenario: Accelerazione

- **WHEN** la velocità di salita aumenta durante la partita
- **THEN** sfondo, ostacoli e nemici accelerano insieme, senza che gli ostacoli si avvicinino o si allontanino fra loro

#### Scenario: Nemico in discesa

- **WHEN** una nave nemica scende mentre il gioco è più veloce
- **THEN** la sua discesa relativa resta quella dell'archetipo, senza diventare più lenta o più rapida in proporzione
