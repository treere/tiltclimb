# presentation/loading Specification

## Purpose
Definisce cosa si vede mentre il gioco carica: una schermata coerente con il tema, con un progresso vero, che non lampeggia sulle connessioni veloci e non dipende dagli asset che sta caricando.

## Requirements

### Requirement: Schermata di caricamento a tema

Durante il caricamento il sistema SHALL mostrare una schermata disegnata con la palette e il linguaggio visivo del gioco: campo stellato in movimento e due astronavi che si inseguono. La schermata MUST NOT dipendere da immagini, suoni o caratteri che fanno parte del caricamento stesso.

#### Scenario: Avvio del gioco

- **WHEN** il gioco si apre e gli asset non sono ancora pronti
- **THEN** si vede la schermata a tema con le navi che si inseguono, non la schermata predefinita del motore

#### Scenario: Asset non ancora disponibili

- **WHEN** la schermata è visibile e le immagini del gioco non sono ancora caricate
- **THEN** la schermata funziona comunque, perché disegna solo con primitive

### Requirement: Progresso reale

La schermata SHALL mostrare una barra di avanzamento proporzionale agli asset effettivamente caricati, accompagnata dal valore percentuale. La barra MUST NOT avanzare in modo finto o a tempo.

#### Scenario: Avanzamento

- **WHEN** gli asset vengono caricati progressivamente
- **THEN** la barra e la percentuale crescono di conseguenza e arrivano al 100% solo a caricamento concluso

#### Scenario: Connessione lenta

- **WHEN** il caricamento procede lentamente
- **THEN** la barra resta indietro in modo coerente con quanto manca, senza saltare avanti da sola

### Requirement: Durata minima e dissolvenza

La schermata SHALL restare visibile per almeno circa settecento millisecondi anche se il caricamento termina prima, e SHALL uscire con una dissolvenza breve invece che con uno stacco secco.

#### Scenario: Caricamento istantaneo

- **WHEN** gli asset sono già in cache e il caricamento dura pochi millisecondi
- **THEN** la schermata resta visibile per il tempo minimo e poi sfuma, senza lampeggiare

#### Scenario: Uscita verso il menu

- **WHEN** il caricamento è concluso e il tempo minimo è trascorso
- **THEN** si passa al menu con una dissolvenza, non con un taglio

### Requirement: Rispetto delle preferenze di movimento

Se il sistema segnala la preferenza per meno animazioni, la schermata SHALL restare leggibile senza elementi in movimento, mantenendo barra e percentuale.

#### Scenario: Meno animazioni richieste

- **WHEN** il dispositivo dichiara `prefers-reduced-motion`
- **THEN** navi e stelle sono ferme e la barra continua a mostrare il progresso
