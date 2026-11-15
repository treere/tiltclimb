# Proposal

## Why

All'avvio compare la schermata di caricamento predefinita di Excalibur: sfondo blu, logo del motore, barra vuota. È la prima cosa che l'utente vede e non dice nulla del gioco — sembra un errore, non un'attesa. Con musica, immagini ed esplosioni da caricare l'attesa non è istantanea, tanto vale usarla per raccontare la stessa storia: un inseguimento fra navi nello spazio.

## What Changes

- **Schermata di caricamento a tema**: campo stellato in movimento, due astronavi stilizzate che si inseguono (l'eroe dietro, un nemico davanti), barra di avanzamento e percentuale, nella palette del gioco.
- **Nessuna dipendenza dagli asset**: la schermata si disegna con primitive 2D (poligoni, cerchi, rettangoli), perché le immagini del gioco sono esattamente ciò che si sta caricando.
- **Durata minima e dissolvenza**: la schermata resta visibile almeno ~700 ms anche quando il caricamento è istantaneo, così non lampeggia, e sfuma verso il menu invece di sparire di colpo.
- **Rispetto delle preferenze di sistema**: con `prefers-reduced-motion` le navi e le stelle stanno ferme e resta solo la barra.
- **Barra reale**: la percentuale riflette gli asset effettivamente caricati, non un'animazione finta.
- Fuori scope: barra di caricamento per singoli pacchetti, schermata di caricamento fra una scena e l'altra, suggerimenti o tutorial durante l'attesa, suoni di caricamento, loghi di terzi.

## Capabilities

### New Capabilities

- `presentation/loading`: schermata di attesa a tema con progresso reale, durata minima, dissolvenza e comportamento statico quando il sistema chiede meno animazioni.

### Modified Capabilities

Nessuna: il gioco a caricamento finito si comporta come prima, e il menu resta la prima schermata interattiva.

## Impact

- Codice: nuovo `src/ui/loading-screen.ts` (sottoclasse di `ex.Loader` con `onDraw`), uso in `src/main.ts` al posto del loader predefinito, costanti di palette e tempi in `constants.ts`.
- Nessun asset nuovo: la schermata è disegnata a mano con il contesto 2D.
- Rischio principale: la barra disegnata a mano deve restare leggibile su schermi molto piccoli e in orizzontale, dove l'area utile è bassa.
