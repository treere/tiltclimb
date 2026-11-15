# gameplay/combat Specification

## Purpose
Definisce lo scontro: l'eroe spara dal tasto in basso, navi nemiche scendono zigzagando e sparano verso il basso, e le regole dicono cosa si colpisce e cosa no — comprese le immunità degli asteroidi.

## Requirements

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

### Requirement: Fuoco nemico verso il basso

Ogni nave nemica SHALL sparare proiettili diretti verso il basso a intervalli regolari e a velocità inferiore a quella dei colpi dell'eroe, con uno schema che dipende dal proprio archetipo: colpo singolo, raffica ravvicinata o ventaglio di colpi obliqui. I proiettili nemici SHALL sparire quando escono dallo schermo.

#### Scenario: Raffica nemica

- **WHEN** una nave nemica resta sullo schermo per il tempo previsto
- **THEN** spara secondo lo schema del suo archetipo e continua a farlo a intervalli regolari

#### Scenario: Raffica del picchiatore

- **WHEN** un picchiatore apre il fuoco
- **THEN** spara due colpi in rapida successione, non uno solo

#### Scenario: Ventaglio del cacciatore

- **WHEN** un cacciatore apre il fuoco
- **THEN** spara tre colpi diretti verso il basso, di cui i laterali inclinati

#### Scenario: Sequenza della torretta

- **WHEN** la torretta apre il fuoco
- **THEN** spara quattro colpi in sequenza rapida e poi resta a lungo senza sparare

#### Scenario: Proiettile che esce dallo schermo

- **WHEN** un proiettile nemico supera il bordo inferiore o laterale della vista
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

### Requirement: Archetipi nemici con movimento proprio

Il sistema SHALL avere quattro tipi di nave nemica, ognuno con sprite distinto e movimento proprio: pattuglia che ondeggia scendendo, picchiatore che scende in diagonale verso il lato opposto, cacciatore che segue l'eroe in orizzontale, torretta che staziona a mezza altezza. Ogni tipo MUST restare dentro i bordi del mondo.

#### Scenario: Pattuglia

- **WHEN** una pattuglia attraversa lo schermo
- **THEN** scende lentamente oscillando in orizzontale

#### Scenario: Picchiatore

- **WHEN** un picchiatore entra in scena
- **THEN** scende più velocemente delle altre e si sposta verso il lato opposto a quello di ingresso

#### Scenario: Cacciatore

- **WHEN** un cacciatore è sullo schermo
- **THEN** la sua posizione orizzontale si avvicina a quella dell'eroe, senza superarla con scatti

#### Scenario: Torretta

- **WHEN** una torretta entra in scena
- **THEN** scende fino a circa metà altezza e poi resta lì, oscillando piano

### Requirement: Comparsa progressiva dei nemici più difficili

I tipi più difficili SHALL sbloccarsi in base all'altezza raggiunta nella partita, e un tipo MUST NOT comparire prima della propria soglia. Il limite di navi nemiche contemporanee SHALL essere due nella fase iniziale e tre da quando è disponibile il cacciatore.

#### Scenario: Inizio partita

- **WHEN** la partita è appena iniziata e l'altezza è bassa
- **THEN** compaiono solo pattuglie

#### Scenario: Sblocco oltre la soglia

- **WHEN** l'altezza supera la soglia di un tipo
- **THEN** quel tipo può comparire, mentre i tipi con soglia più alta restano esclusi

#### Scenario: Limite che cresce

- **WHEN** il cacciatore è sbloccato
- **THEN** possono essere presenti fino a tre navi nemiche contemporaneamente

### Requirement: Punteggio per tipo di nemico

Ogni tipo di nave nemica SHALL assegnare un valore di punti diverso in base alla difficoltà: pattuglia 25, picchiatore 35, cacciatore 45, torretta 60.

#### Scenario: Pattuglia abbattuta

- **WHEN** l'eroe abbatte una pattuglia
- **THEN** il punteggio aumenta di 25

#### Scenario: Torretta abbattuta

- **WHEN** l'eroe abbatte una torretta
- **THEN** il punteggio aumenta di 60

#### Scenario: Riepilogo degli abbattimenti

- **WHEN** la partita termina
- **THEN** il riepilogo conta tutte le navi abbattute, indipendentemente dal tipo
