# Proposal

## Why

Il gioco non dice perché si sta salendo: c'è un'astronave, ci sono asteroidi, e basta. Una pagina crediti dà un motivo alla salita (raggiungere la squadra), mette nero su bianco chi ha fatto cosa — a partire da Andrea Tomasi — e documenta gli asset dove un essere umano li cerca, invece che solo dentro `license.txt`.

Nella stessa passata si sistema la leggibilità, che oggi è il punto debole dell'interfaccia: i pulsanti sono pannelli semitrasparenti su un campo stellato che passa sotto il testo, e le etichette perdono contrasto proprio dove servono.

## What Changes

- **Nuova schermata Crediti**, raggiungibile dal menu con un terzo pulsante **CREDITI** sotto **Inizia gioco**. Contiene: la storia dell'eroe in poche righe, i crediti degli asset (Kenney, CC0) e l'autore con il suo ruolo. Un pulsante **INDIETRO** riporta al menu.
- **Racconto**: quattro righe che spiegano la salita — salto andato storto, squadra dispersa, rotta segnata dai relitti, carburante che finisce.
- **Autore nei crediti**: Andrea Tomasi, idea, game design e direzione.
- **Pulsanti ridisegnati**: fondo scuro **opaco** invece che semitrasparente, bordo luminoso più marcato, etichetta più grande e in bianco con ombra dietro al testo, così da restare leggibile sopra le stelle.
- **Testi leggibili ovunque**: ombra sotto le scritte di menu e HUD, dimensioni minime, e un contrasto verificato (rapporto almeno 7:1 fra testo e fondo) invece che "a occhio".
- Fuori scope: audio, animazioni della pagina crediti, link esterni cliccabili, altre lingue, modifiche a gameplay, nemici, punteggi o calibrazione.

## Capabilities

### New Capabilities

- `ui/credits`: schermata crediti raggiungibile dal menu, con il racconto che motiva l'avventura, i crediti degli asset e dell'autore, e il ritorno al menu.

### Modified Capabilities

- `ui/start-menu`: il menu non ha più due comandi ma tre, perché si aggiunge l'accesso ai crediti.
- `presentation/space-theme`: i pulsanti devono essere opachi e con un contrasto minimo verificabile, e le scritte devono restare leggibili su sfondo stellato anche fuori dai pulsanti.

## Impact

- Codice: nuova `src/game/credits-scene.ts`, contenuti testuali in `src/game/credits-text.ts`, ritocchi a `menu-scene.ts` (terzo pulsante e navigazione), `src/ui/button.ts` (fondo opaco, bordo, testo con ombra), `src/main.ts` (registrazione scena), `constants.ts`.
- Nessun asset nuovo: la pagina usa lo sfondo stellato e la nave già presenti.
- Rischio: aggiungere un terzo pulsante al menu significa rivedere le altezze, altrimenti su schermi bassi i comandi finiscono sotto il bordo o addosso alla nave.
