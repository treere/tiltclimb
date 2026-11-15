# Spec Delta

## Purpose

È la pagina che racconta perché si gioca e chi ha fatto il gioco: la storia dell'eroe che cerca la sua squadra, i crediti degli asset e quello dell'autore. Si apre dal menu e si chiude tornando al menu.

## ADDED Requirements

### Requirement: Pagina crediti raggiungibile dal menu

Il menu SHALL offrire un comando **CREDITI** che apre la pagina crediti, e la pagina SHALL offrire un comando **INDIETRO** che riporta al menu. Aprire i crediti MUST NOT avviare una partita né perdere la calibrazione del sensore già fatta.

#### Scenario: Apertura dei crediti

- **WHEN** l'utente preme **CREDITI** nel menu
- **THEN** si apre la pagina crediti e la partita non è iniziata

#### Scenario: Ritorno al menu

- **WHEN** l'utente preme **INDIETRO** nella pagina crediti
- **THEN** torna al menu con la calibrazione invariata

### Requirement: La storia dell'eroe è raccontata

La pagina crediti SHALL contenere un breve racconto che spiega la situazione dell'eroe — pilota rimasto solo dopo un salto andato storto, squadra dispersa, salita come unico modo per raggiungerla — coerente con ciò che accade nel gioco.

#### Scenario: Racconto presente

- **WHEN** l'utente apre i crediti
- **THEN** legge un testo che spiega chi è l'eroe e perché sta salendo fra gli asteroidi

### Requirement: Crediti di asset e autore

La pagina SHALL elencare gli asset grafici con autore e licenza, e SHALL riportare l'autore del gioco con il suo ruolo. Ogni informazione MUST essere leggibile sulla pagina, non solo nei file del repository.

#### Scenario: Crediti degli asset

- **WHEN** l'utente legge i crediti
- **THEN** trova il pack grafico con autore e licenza, e trova il nome dell'autore del gioco con il ruolo

### Requirement: Navigazione senza trappole

Dalla pagina crediti SHALL essere sempre possibile tornare al menu con una sola azione, anche su telefono, e MUST NOT esserci uno stato in cui l'utente resta bloccato.

#### Scenario: Ritorno con un tocco

- **WHEN** l'utente tocca **INDIETRO**
- **THEN** torna al menu immediatamente, senza conferme aggiuntive
