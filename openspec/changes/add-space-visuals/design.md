# Design

## Context

Vedi `proposal.md` per il perché. Oggi la scena disegna tutto con `ex.Rectangle` (`PLAYER_WIDTH 44`, `PLAYER_HEIGHT 56`, `OBSTACLE_WIDTH 120`, `OBSTACLE_HEIGHT 28`) e il menu è testo su fondo nero. Non esiste ancora un loader: nessun asset esterno è mai stato caricato.

Ricerca già fatta sugli asset, con verifica del contenuto reale dello zip e non solo della pagina che lo pubblicizza:

- **Kenney «Space Shooter Redux»**, licenza CC0 1.0 dichiarata nel `license.txt` incluso (`Space Shooter (Redux, plus fonts and sounds) by Kenney Vleugels (www.kenney.nl)`), scaricato da `opengameart.org/content/space-shooter-redux` (specchio ufficiale del pack). Contiene 301 PNG: 12 navi fra cui `playerShip2_blue.png` (112×75), 21 meteore (`meteorBrown_*`, `meteorGrey_*`, da tiny a big, es. `meteorBrown_big1` 101×84), 20 frame di fiamma `Effects/fire00–fire19` (16×40), stelle `Effects/star1–3` (circa 25×24) e tasselli di sfondo 256×256 (`Backgrounds/darkPurple.png`, verificato: campo stellato, 67 colori distinti su 65536 pixel, base `#3a2e3f`).
- Le alternative con licenza CC-BY richiedono attribuzione visibile nel gioco: scartate perché aggiungono un obbligo permanente per un guadagno estetico nullo rispetto a CC0. Asset "free" senza licenza esplicita: scartati per definizione.

## Goals / Non-Goals

**Goals:**

- sostituire ogni rettangolo visibile con un asset licenziato, senza toccare la logica di gioco;
- scaricare nel repo solo i file usati (non il pack intero), con licenza e credito;
- parallasse economica: due strati, decine di sprite, nessuna allocazione per frame.

**Non-Goals:**

- armi, nemici, power-up, audio, particelle di impatto;
- rifacimento dell'HUD oltre il necessario per leggibilità;
- tuning di velocità, spaziatura o difficoltà.

## Decisions

### 1. Un solo pack, licenza CC0, set minimo di file

Si usano esclusivamente asset Kenney Space Shooter Redux. Nel repo entrano circa 20 file: 1 nave, 10 frame di fiamma, 6 meteore (3 brown + 3 grey, misure diverse), 3 stelle, 1 tassello di sfondo, più `license.txt` in `public/assets/kenney/` e una sezione **Crediti** nel `README.md` con autore, licenza e URL.

Alternativa scartata: tenere il pack completo (301 PNG, 1,1 MB) nel repo. Non serve, appesantisce i diff e rende opaco quali file sono davvero in uso.

### 2. Hitbox a parità di area, non a parità di forma

La meteora è approssimativamente quadrata (101×84), l'ostacolo attuale è una barra da 120×28: se tenessi la barra, la sagoma visibile sarebbe molto più grande del collisore e l'impatto sembrerebbe casuale. Passo a un **collisore circolare di raggio ~33 px** (area ≈ 3420 px² contro i 3360 px² della barra) centrato nello sprite: area identica, quindi difficoltà comparabile, forma coerente con l'asteroide e margine visivo leggermente generoso — meglio un near miss perdonato che una morte inspiegabile.

La spaziatura verticale (`SPAWN_GAP_PX = 260`) resta invariata.

### 3. Scia come animazione di 10 frame, figlia dell'attore

`ex.Animation` costruita da 10 `ex.ImageSource` (`fire00`–`fire09`), 60 ms per frame, in loop, montata su un actor figlio dell'astronave (offset sotto la fusoliera). Essere figlio significa che segue posizione e rotazione senza codice di sincronizzazione.

Alternativa scartata: 20 frame. Raddoppia il peso senza differenza percepibile a 60 px di altezza.

### 4. Sfondo: tassello ripetuto in pool, non una texture gigante

Il mondo visibile è 720×1280; con tasselli da 256 px servono 3 colonne × 5 righe = 15 sprite, riciclati quando escono sotto e riposizionati sopra. Velocità: strato lontano a `0.25 × CLIMB_SPEED`, strato di stelle a `0.6 ×` e `1.0 ×` per le due profondità. Tutti gli sprite sono creati una volta e mai distrutti.

Alternativa scartata: un'unica immagine di sfondo alta quanto serve. Cresce senza limite mentre si sale e occupa memoria.

### 5. Caricamento nel loader della scena, non lazy

Le immagini stanno dietro un `ex.Loader` condiviso (definito in `src/game/sprites.ts`) e vengono caricate prima che la scena sia giocabile: un asset che arriva in ritardo produce un frame con un rettangolo vuoto al posto dell'astronave. I nomi dei file vivono in un solo modulo, così rinominare un asset è una modifica sola.

### 6. Menu: stesso sfondo, nave come illustrazione, pulsanti invariati

Il menu riusa il parallasse a velocità ridotta (`0.1 ×`) e mostra l'astronave come illustrazione (ferma, con la scia animata: costa nulla e dà vita). Lettura, avvisi e comandi restano dove sono: il layout non cambia, cambia la pelle.

**Sulla centratura delle etichette**: dopo l'ultima correzione il gruppo grafico ha ancore al centro e offset zero, quindi il testo è centrato; il rischio residuo è che un'etichetta più larga del fondo allarghi i bounds del gruppo e sposti il fondo. Difesa: `useBounds: false` sul membro testuale, così solo il rettangolo definisce i bounds del gruppo, più una verifica con l'etichetta più lunga che il gioco produce ("Sensore non disponibile").

### 7. Hitbox del giocatore invariata

Il collisore resta quello attuale (`44×56 × 0.8`); lo sprite della nave viene scalato per riempirlo, con l'ancora al centro. La nave è 112×75, quindi la scala è circa 0.45: nessun cambio di feel, e la forma allungata in verticale resta coerente con la sagoma.

## Risks / Trade-offs

- **Peso degli asset nel repo** → ~200 kB in `public/assets/kenney/`, serviti come file e non inline nella build.
- **Parallasse su telefoni lenti** → 15 + 12 sprite e nessuna allocazione per frame; se pesa, si riduce il pool a 2 colonne × 4 righe.
- **Nitidezza**: Kenney è disegno vettoriale, non pixel art → si lascia l'antialiasing attivo (niente `pixelArt: true`) e si scala in modo non intero; a 0.45 la nave può risultare leggermente morbida, accettabile a schermo.
- **Difficoltà percepita diversa** con collisore circolare → area equivalente e margine generoso; se in mano risulta troppo facile, si alza il raggio, non la velocità.
- **Attribuzione**: CC0 non obbliga, ma il README cita comunque autore e licenza; se un domani arrivasse un asset CC-BY, il credito va anche in gioco, non solo nel README.
- **`useBounds: false`** cambia i bounds del gruppo: se in futuro un pulsante avesse un'icona fuori dal rettangolo, andrebbe gestita esplicitamente.

## Migration Plan

Nessun dato da migrare. Gli asset sono nuovi file, la logica di gioco non cambia; il rollback è il revert del commit di apply, che riporta i rettangoli senza toccare le spec già archiviate.
