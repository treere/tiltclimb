# presentation/space-theme Specification

## Purpose
Definisce l'aspetto del gioco: la storia raccontata sullo schermo è un'astronave che si fa strada in un campo di asteroidi, e ogni superficie visibile (gioco, menu, sfondo) deve raccontarla coerentemente, con asset di provenienza e licenza note.

## Requirements

### Requirement: Il giocatore è un'astronave con scia animata

Il giocatore SHALL essere rappresentato da uno sprite di astronave orientato verso l'alto, con una scia ai motori animata e riprodotta in continuazione mentre la partita è in corso. La scia MUST fermarsi quando la partita termina.

#### Scenario: Astronave in partita

- **WHEN** la partita è in corso
- **THEN** si vede l'astronave orientata verso l'alto con la scia animata sotto la fusoliera

#### Scenario: Scia ferma a fine partita

- **WHEN** la partita termina
- **THEN** la scia non continua ad animarsi

### Requirement: Gli ostacoli sono asteroidi

Ogni ostacolo SHALL essere rappresentato da uno sprite di asteroide e MUST avere orientamento iniziale casuale, così che due ostacoli vicini non sembrino lo stesso oggetto. Gli asteroidi SHALL ruotare lentamente mentre scorrono.

#### Scenario: Due asteroidi vicini

- **WHEN** due ostacoli entrano nel campo visivo
- **THEN** appaiono con sagome o orientamenti distinguibili fra loro

#### Scenario: Rotazione durante lo scorrimento

- **WHEN** un asteroide attraversa lo schermo
- **THEN** la sua rotazione cambia nel tempo invece di restare fissa

### Requirement: Sfondo stellato che scorre

Lo sfondo SHALL essere un campo stellato che scorre verso il basso mentre il giocatore sale, con almeno due strati a velocità diverse per dare profondità. Lo sfondo MUST coprire sempre tutta l'area visibile, senza bordi vuoti o cuciture percepibili durante lo scorrimento.

#### Scenario: Scorrimento continuo

- **WHEN** il giocatore sale per un tratto lungo
- **THEN** lo sfondo scorre senza interruzioni e senza mostrare bande vuote o stacchi

#### Scenario: Profondità

- **WHEN** lo sfondo scorre
- **THEN** gli elementi più lontani si muovono più lentamente di quelli vicini

### Requirement: Menu coerente con il tema

La schermata di menu SHALL usare lo stesso universo visivo della partita (sfondo stellato, astronave, colori coerenti) senza perdere leggibilità dei valori di calibrazione e dei comandi. Il cambio di aspetto MUST NOT alterare il comportamento del menu definito dalla spec `ui/start-menu`.

#### Scenario: Menu a tema

- **WHEN** si apre il gioco
- **THEN** il menu mostra uno sfondo stellato e l'astronave del giocatore, e lettura, avvisi e comandi restano leggibili

### Requirement: Etichette dei pulsanti centrate

Il testo di un pulsante SHALL restare centrato rispetto al proprio fondo indipendentemente dalla lunghezza dell'etichetta. Un'etichetta più lunga MUST NOT spostare il fondo né il testo fuori dal centro del pulsante.

#### Scenario: Etichetta lunga

- **WHEN** il pulsante mostra un'etichetta lunga come "Sensore non disponibile"
- **THEN** il fondo resta nella posizione prevista e il testo resta centrato su di esso

#### Scenario: Cambio di etichetta a runtime

- **WHEN** l'etichetta di un pulsante viene sostituita mentre il menu è visibile
- **THEN** il nuovo testo appare centrato senza salti di posizione del fondo

### Requirement: Provenienza e licenza degli asset documentate

Ogni asset esterno, grafico, audio o di altra natura, SHALL essere accompagnato nel repository dal file di licenza originale o da una nota di licenza equivalente, e SHALL essere elencato con autore, licenza e provenienza in una sezione crediti del `README.md`. Asset di licenza sconosciuta o non ridistribuibile MUST NOT essere usati.

#### Scenario: Nuovo asset aggiunto

- **WHEN** viene introdotto un nuovo file grafico o audio
- **THEN** la sua licenza è presente nel repository e il credito è nel README

#### Scenario: Verifica della provenienza

- **WHEN** si controlla il repository senza rete
- **THEN** è possibile ricostruire da dove viene ogni immagine e ogni suono, e con quale licenza

### Requirement: Il giocatore sta nella parte bassa dello schermo

L'astronave SHALL essere posizionata sotto il centro dello schermo, con più spazio visibile davanti a sé che dietro, così che l'utente veda il campo di asteroidi che sta per attraversare. La posizione verticale sullo schermo SHALL restare stabile per tutta la partita.

#### Scenario: Posizione all'avvio della partita

- **WHEN** la partita inizia
- **THEN** l'astronave appare nella parte bassa dello schermo e non al centro

#### Scenario: Posizione stabile mentre si sale

- **WHEN** l'astronave sale per un tratto lungo
- **THEN** resta nella stessa posizione verticale sullo schermo e scorre il mondo sotto di lei

### Requirement: I pulsanti del menu sono a tema

I pulsanti SHALL usare la palette dello spazio con fondo **opaco**, bordo luminoso marcato e testo chiaro, e SHALL distinguere visivamente lo stato normale da quello premuto e da quello disabilitato. Il fondo MUST essere opaco, così che il campo stellato non passi sotto l'etichetta, e il contrasto fra testo e fondo SHALL essere almeno 7:1 in ogni stato.

#### Scenario: Pulsante su sfondo stellato

- **WHEN** il menu mostra i pulsanti sopra il campo stellato
- **THEN** il fondo è opaco, il bordo è distinguibile dallo sfondo e il testo ha contrasto di almeno 7:1

#### Scenario: Stato premuto e disabilitato

- **WHEN** l'utente preme un pulsante o un pulsante è disabilitato
- **THEN** l'aspetto cambia in modo riconoscibile e il contrasto del testo resta di almeno 7:1

### Requirement: Testi leggibili sopra lo sfondo animato

Le scritte del menu, dell'HUD e della pagina crediti SHALL restare leggibili sopra lo sfondo stellato, usando un'ombra o un contorno dietro al testo quando il fondo non è opaco, e una dimensione minima tale da essere letta senza sforzo su uno schermo da telefono.

#### Scenario: HUD sopra le stelle

- **WHEN** il punteggio è mostrato sopra il campo stellato durante la partita
- **THEN** le cifre restano leggibili mentre lo sfondo scorre

#### Scenario: Testo della pagina crediti

- **WHEN** la pagina crediti mostra il racconto
- **THEN** le righe sono leggibili senza ambiguità e il testo va a capo invece di uscire dallo schermo

### Requirement: Le collisioni sono animate

Quando una nave nemica viene abbattuta o l'eroe muore, il sistema SHALL mostrare un'animazione di esplosione a frame nel punto dell'impatto, di durata breve e senza bloccare il gioco. Gli asteroidi, immuni ai colpi, MUST NOT esplodere.

#### Scenario: Nave nemica abbattuta

- **WHEN** un colpo dell'eroe distrugge una nave nemica
- **THEN** al suo posto appare un'esplosione animata che si spegne da sola

#### Scenario: Morte dell'eroe

- **WHEN** l'eroe viene colpito
- **THEN** appare un'esplosione più grande e la partita termina

#### Scenario: Asteroide colpito

- **WHEN** un colpo attraversa un asteroide
- **THEN** non appare alcuna esplosione
