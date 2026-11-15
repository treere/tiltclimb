# Design

## Context

Vedi `proposal.md` per il perché. Oggi il menu ha due pulsanti centrati alle frazioni 0.73 e 0.85 dell'altezza utile, un blocco calibrazione sopra, e il `Button` è un pannello con fondo `rgba(14,26,43,0.88)` e bordo da 3 px ottenuto con due rettangoli concentrici. Le scene sono registrate in `main.ts` e la navigazione usa `engine.goToScene`.

Il punto debole misurato: il fondo dei pulsanti è trasparente all'88%, quindi le stelle ci passano sotto. Il testo chiaro (`#dbeafe`) su un fondo che varia fra `#0e1a2b` e il chiaro di una stella perde contrasto a chiazze — è esattamente la sensazione di "scritte che non si leggono".

## Goals / Non-Goals

**Goals:**

- una pagina crediti che si legge, con una storia breve e i crediti al posto giusto;
- contrasto **verificabile**, non "a occhio": soglia 7:1 testo/fondo, calcolata e controllata;
- menu a tre comandi senza collisioni di layout su schermi bassi.

**Non-Goals:**

- audio, animazioni della pagina, link esterni;
- modifiche a gameplay, nemici, punteggi, calibrazione;
- scorrimento del testo: il racconto sta in una schermata.

## Decisions

### 1. Una scena separata per i crediti

`src/game/credits-scene.ts`, registrata come `credits`, con lo stesso `Starfield` a velocità ridotta del menu, la nave come illustrazione e due pulsanti: **INDIETRO** e nient'altro.

Alternativa scartata: un pannello dentro `MenuScene`. Il menu gestisce già sensore, permessi, calibrazione e riepilogo; aggiungerci un pannello con proprio stato significherebbe altre guardie in `onPreUpdate` e la stessa logica di "torna indietro" scritta due volte.

### 2. Contenuti in un modulo, non sparsi nel layout

`src/game/credits-text.ts` esporta `STORY: string[]` e `CREDITS: {label, value}[]`. La scena si limita a impaginarli. Così riscrivere la storia non tocca il codice di layout, e i testi sono in un posto che si legge senza aprire una scena.

### 3. Leggibilità misurata, non stimata

Il `Button` cambia in tre punti:

- **fondo opaco** `#0b1a2e` (niente alpha): le stelle non passano più sotto l'etichetta;
- **bordo** più luminoso `#7fd4ff` a 3 px, sempre con due rettangoli concentrici;
- **etichetta** bianca `#ffffff`, corpo 38 (era 34), con `shadow` del font (offset 2,2, blur 0, nero) per staccarla dal fondo anche sotto i 60 px di altezza.

I valori sono scelti perché il contrasto calcolato superi 7:1: il bianco su `#0b1a2e` sta intorno a 16:1, e il bordo su `#0b1a2e` è ben oltre la soglia 3:1 richiesta per gli elementi non testuali. La verifica è un conto fatto in Node sui colori reali del codice, non una dichiarazione.

Fuori dai pulsanti, la stessa ombra va su HUD e testi del menu, perché lì il fondo resta il campo stellato e non c'è modo di renderlo opaco senza perdere l'effetto.

### 4. Layout del menu a tre comandi

Il menu passa a: illustrazione della nave a 0.20, etichetta e valore inclinazione a 0.30/0.36, barra a 0.44, riepilogo a 0.50, avviso a 0.56, e i tre pulsanti a 0.66 / 0.77 / 0.88, con altezza 92 e gap di 8 px. La conferma di calibrazione scende a 0.95.

La frazione 0.88 × 1280 ≈ 1126 px, che lascia 154 px sotto: sufficiente per il pulsante alto 92 e per la safe area. Con un terzo pulsante non c'è spazio per tenere le distanze precedenti: due comandi a 0.73/0.85 diventerebbero tre a 0.66/0.77/0.88.

### 5. Il ritorno non tocca lo stato di sessione

`CreditsScene` non legge né scrive `session`: la calibrazione vive nel singleton e resta intatta. Il pulsante **INDIETRO** chiama `engine.goToScene('menu')`, e `MenuScene.onActivate` ridisegna il riepilogo, quindi si torna al menu esattamente com'era.

## Risks / Trade-offs

- **Tre pulsanti su schermi bassi**: 0.66–0.88 sono frazioni dell'altezza utile (che rispetta `contentArea`), quindi su un telefono basso i comandi si comprimono ma restano dentro; se in mano risultano stretti si riduce l'altezza dei pulsanti a 84, non le distanze.
- **Testo con ombra che "sporca"**: un'ombra troppo marcata su corpo 38 sembra un errore di stampa; offset 2 px e blur 0 tengono il bordo netto.
- **Soglia 7:1**: è severa; se in futuro si vuole un testo colorato invece che bianco, va ricalcolata — meglio un test che un'opinione.
- **Pagina crediti che invecchia**: la storia è in un modulo dedicato, quindi si riscrive senza toccare la scena; ma nessun test la protegge, e una modifica al gioco potrebbe renderla incoerente. Mitigazione: il racconto parla di salita e asteroidi, non di meccaniche che possono cambiare.
- **Nessun link esterni**: la pagina non è cliccabile verso kenney.nl; chi vuole approfondire ha il README. È una scelta per non gestire URL esterni in un canvas.

## Migration Plan

Nessuna migrazione. `CreditsScene` è una scena nuova, il menu cambia solo per un pulsante in più. Rollback: revert del commit di apply.
