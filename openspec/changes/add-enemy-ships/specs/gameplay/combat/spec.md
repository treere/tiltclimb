# Spec Delta

## Purpose

Definisce lo scontro: l'eroe spara dal tasto in basso, navi nemiche scendono zigzagando e sparano verso il basso, e le regole dicono cosa si colpisce e cosa no — comprese le immunità degli asteroidi.

## ADDED Requirements

### Requirement: Fuoco dell'eroe a colpo singolo

L'eroe SHALL poter sparare premendo un pulsante posto nella parte bassa dello schermo, e ogni tocco SHALL produrre esattamente un colpo, senza raffica automatica. Il colpo SHALL partire dall'astronave e viaggiare verso l'alto. Il pulsante SHALL restare raggiungibile dal pollice senza coprire l'astronave né gli asteroidi in arrivo.

#### Scenario: Un tocco, un colpo

- **WHEN** l'utente tocca il pulsante di fuoco una volta
- **THEN** parte un solo colpo, indipendentemente da quanto a lungo tiene premuto

#### Scenario: Tocchi ripetuti

- **WHEN** l'utente tocca il pulsante più volte in rapida successione
- **THEN** parte un colpo per ogni tocco riconosciuto, senza raffica automatica

#### Scenario: Il colpo viaggia verso l'alto

- **WHEN** un colpo viene sparato
- **THEN** si muove verso l'alto e scompare quando esce dallo schermo

### Requirement: Navi nemiche con traiettoria ondulata

Le navi nemiche SHALL scendere dall'alto verso il basso con una traiettoria ondulata orizzontale, restando entro i bordi del mondo. Il numero di navi nemiche contemporaneamente presenti SHALL essere limitato, e le navi SHALL comparire a intervalli regolari.

#### Scenario: Discesa ondulata

- **WHEN** una nave nemica è sullo schermo
- **THEN** la sua posizione orizzontale cambia in modo continuo e oscillante mentre scende

#### Scenario: Limite di navi presenti

- **WHEN** il limite di navi contemporanee è già raggiunto
- **THEN** non ne compaiono altre finché una non esce dallo schermo o viene abbattuta

### Requirement: Fuoco nemico verso il basso

Ogni nave nemica SHALL sparare proiettili che viaggiano verso il basso, a intervalli regolari e a velocità inferiore a quella dei colpi dell'eroe, così da essere schivabili. I proiettili nemici SHALL sparire quando escono dallo schermo.

#### Scenario: Raffica nemica

- **WHEN** una nave nemica resta sullo schermo per il tempo previsto
- **THEN** spara un proiettile verso il basso e continua a farlo a intervalli regolari

#### Scenario: Proiettile che esce dallo schermo

- **WHEN** un proiettile nemico supera il bordo inferiore
- **THEN** viene rimosso dal gioco

### Requirement: Regole di collisione del combattimento

Un colpo dell'eroe che colpisce una nave nemica SHALL distruggerla, perché le navi nemiche resistono a un solo colpo. Il contatto fra l'eroe e una nave nemica o un proiettile nemico SHALL terminare la partita, come il contatto con un asteroide. I colpi dell'eroe MUST attraversare gli asteroidi senza consumarsi, e le navi nemiche MUST attraversare gli asteroidi senza subire conseguenze.

#### Scenario: Nave nemica abbattuta

- **WHEN** un colpo dell'eroe raggiunge una nave nemica
- **THEN** la nave scompare e il colpo viene consumato

#### Scenario: Eroe colpito da un proiettile

- **WHEN** un proiettile nemico tocca l'eroe
- **THEN** la partita termina

#### Scenario: Eroe colpito da una nave

- **WHEN** una nave nemica tocca l'eroe
- **THEN** la partita termina

#### Scenario: Asteroide immune ai colpi

- **WHEN** un colpo dell'eroe attraversa un asteroide
- **THEN** il colpo continua la sua corsa e l'asteroide resta intatto

#### Scenario: Nave nemica sopra un asteroide

- **WHEN** una nave nemica attraversa la posizione di un asteroide
- **THEN** nessuna delle due viene distrutta e la nave prosegue la sua traiettoria

### Requirement: Punteggio per abbattimento

Ogni nave nemica abbattuta SHALL assegnare punti al punteggio della partita corrente, e il numero di abbattimenti SHALL essere riportato nel riepilogo mostrato dal menu a fine partita.

#### Scenario: Punti per un abbattimento

- **WHEN** l'eroe abbatte una nave nemica
- **THEN** il punteggio aumenta del valore previsto per un abbattimento

#### Scenario: Riepilogo con gli abbattimenti

- **WHEN** la partita finisce
- **THEN** il menu mostra il punteggio ottenuto e il numero di navi abbattute
