# Spec Delta

## MODIFIED Requirements

### Requirement: Provenienza e licenza degli asset documentate

Ogni asset esterno, grafico, audio o di altra natura, SHALL essere accompagnato nel repository dal file di licenza originale o da una nota di licenza equivalente, e SHALL essere elencato con autore, licenza e provenienza in una sezione crediti del `README.md`. Asset di licenza sconosciuta o non ridistribuibile MUST NOT essere usati.

#### Scenario: Nuovo asset aggiunto

- **WHEN** viene introdotto un nuovo file grafico o audio
- **THEN** la sua licenza è presente nel repository e il credito è nel README

#### Scenario: Verifica della provenienza

- **WHEN** si controlla il repository senza rete
- **THEN** è possibile ricostruire da dove viene ogni immagine e ogni suono, e con quale licenza

## ADDED Requirements

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
