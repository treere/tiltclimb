# Design

## Context

Vedi `proposal.md` per il perché. Oggi `main.ts` costruisce un `ex.Loader` con 32 immagini, 15 suoni e 96 frame di esplosione; durante il caricamento Excalibur disegna la propria schermata (sfondo blu, logo, barra), che è la prima cosa visibile all'apertura.

Il punto tecnico che decide tutto, verificato nel sorgente di Excalibur 1.0.1: `Loader extends DefaultLoader`, e `DefaultLoader` costruisce un `ex.Canvas` con `draw: this.onDraw.bind(this)`. Quindi **`onDraw(ctx)` è un hook pubblico** che riceve un contesto 2D e ha accesso a `this.progress` (rapporto 0–1 fra risorse caricate e totali) e a `this.engine` per le dimensioni. Il loader predefinito usa lo stesso hook per disegnare logo e barra: sostituirlo significa sovrascrivere un metodo, non combattere con l'engine.

## Goals / Non-Goals

**Goals:**

- una schermata che si disegna senza dipendere da ciò che sta caricando;
- progresso reale e leggibile, con tempo minimo di permanenza;
- nessun impatto sul caricamento stesso: solo disegno 2D a ogni frame.

**Non-Goals:**

- schermate di transizione fra scene, tutorial, consigli;
- loghi di terzi o crediti sulla schermata di caricamento;
- suoni di caricamento (l'audio non è sbloccato prima del primo gesto).

## Decisions

### 1. Una sottoclasse di `ex.Loader` con `onDraw`

`src/ui/loading-screen.ts` esporta `class ThemedLoader extends ex.Loader` che:
- in `onDraw(ctx)` disegna sfondo, stelle, inseguimento, barra e percentuale;
- espone `show(): Promise<void>` da attendere dopo `engine.start(loader)`, che risolve quando la dissolvenza è finita.

Dentro `onDraw` non si può usare `ex.Text` (è un grafico che richiede il renderer, non il contesto 2D del loader): il testo si scrive con `ctx.fillText` e la barra con `ctx.fillRect`/`roundRect` fatta a mano. È lo stesso approccio già usato per pulsanti e testi dell'interfaccia, quindi non introduce un linguaggio nuovo.

### 2. Inseguimento disegnato con primitive

Due navi stilizzate: un chevron più grande (l'eroe, colore `#4fb3ff`) insegue un chevron più piccolo e più scuro (il nemico) lungo una sinusoide che attraversa lo schermo. Il nemico è sempre un po' più avanti e un po' più veloce: quando arriva al bordo, rientra dall'altro lato. Le stelle sono 40 punti a tre velocità diverse, come nel gioco.

Perché non gli sprite veri: sarebbero esattamente gli asset che stanno caricando, e la schermata deve funzionare al primo frame. Disegnare due chevron costa venti righe e non può fallire.

### 3. Tempo minimo e dissolvenza, senza timer globali

`onBeforeLoad()` registra `performance.now()`. `show()` attende che `progress` arrivi a 1, poi aspetta il resto dei 700 ms minimi e infine guida una dissolvenza di 250 ms con `requestAnimationFrame` (la schermata è disegnata dal loader, quindi è l'unico posto in cui un frame loop ha senso). La dissolvenza riduce un'`alpha` che `onDraw` applica a ogni elemento tramite `ctx.globalAlpha`.

Alternativa scartata: far gestire la dissolvenza alle scene. Sarebbe una scena "loading" con la sua logica, quando il loader è già il posto dove il caricamento vive.

### 4. Movimento ridotto

`window.matchMedia('(prefers-reduced-motion: reduce)')` letto una volta all'avvio: se attivo, navi e stelle stanno in posizione fissa e cambia solo la barra. Nessun'altra differenza: la schermata resta riconoscibile.

### 5. Integrazione in `main.ts`

```ts
const loader = new ThemedLoader([...resources]);
await engine.start(loader);
await loader.show();
await engine.goToScene('menu');
```

`engine.start(loader)` disegna la schermata e carica; `loader.show()` attende tempo minimo e dissolvenza; solo allora il menu diventa attivo. Se `show()` venisse dimenticato, il gioco funzionerebbe ma il menu apparirebbe sotto la schermata di caricamento: la sequenza è l'unica cosa da non sbagliare.

## Risks / Trade-offs

- **Schermi bassi (orizzontale)** → la composizione usa frazioni dell'altezza utile e una barra larga al massimo il 70% della larghezza: nulla esce dal bordo. Da verificare in prova.
- **Caricamento molto lento** (rete da telefono) → la schermata resta animata e la percentuale avanza lentamente; nessun timeout che nasconde l'errore, ma se un asset fallisse il loader di Excalibur logga e prosegue, e la barra arriverebbe comunque al 100%.
- **Doppio frame loop** (loader e poi engine) → la dissolvenza usa `requestAnimationFrame` solo per 250 ms e poi si ferma; non resta nulla attivo dopo.
- **`onDraw` è API interna** → è documentata nella classe ma non è una promessa di stabilità: se un aggiornamento di Excalibur la cambiasse, il sintomo sarebbe evidente (schermata vuota al caricamento) e il fix è contenuto in un file.
- **Tempo minimo artificiale** → 700 ms su una connessione veloce sono un'attesa imposta. È il compromesso per non far lampeggiare la schermata; il valore sta in una costante.

## Migration Plan

Nessuna migrazione dati. `main.ts` passa dal `new ex.Loader([...])` a `new ThemedLoader([...])`; se la schermata desse problemi, tornare al loader predefinito è un revert di due righe.
