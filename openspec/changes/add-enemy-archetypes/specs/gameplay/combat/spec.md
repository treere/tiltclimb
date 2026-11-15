# Spec Delta

## REMOVED Requirements

### Requirement: Navi nemiche con traiettoria ondulata

**Reason**: non tutte le navi nemiche ondeggiano più. Il movimento ora dipende dall'archetipo, quindi una regola unica per tutte descriverebbe male tre navi su quattro.

**Migration**: la pattuglia mantiene esattamente il comportamento ondulato descritto prima; gli altri tipi sono descritti dal nuovo requisito sugli archetipi. Chi si aspettava un solo tipo di nemico trova ora una progressione, e i più difficili compaiono solo dopo una certa altezza.

## MODIFIED Requirements

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

## ADDED Requirements

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
