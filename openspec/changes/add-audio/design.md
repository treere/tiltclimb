# Design

## Context

Vedi `proposal.md` per il perché. Il gioco non ha audio: nessun `Sound` nel loader, nessun gesto che sblocchi il contesto audio. Le scene sono `menu`, `credits`, `climb`, il loader è `createLoader()` in `src/game/sprites.ts`, e le collisioni si risolvono a mano in `climb-scene.resolveHits()` — il punto esatto dove agganciare esplosioni e suoni.

Ricerca già fatta, con verifica dei file scaricati e non solo delle pagine:

- **Musica**, due tracce CC0 da OpenGameArt: `OutThere_0.ogg` («Space Music: Out There», 3,9 MB) e `MyVeryOwnDeadShip.ogg` («Background Space Track», 4,5 MB).
- **Effetti**, «The Essential Retro Video Game Sound Effects Collection» di Juhani Junkala, CC0, 508 WAV in cinque categorie verificate: `Weapons` (`sfx_wpn_laser*`, `sfx_weapon_singleshot*`), `Explosions` (`sfx_exp_cluster/double/long/medium/small*`), `General Sounds` (coin, powerup, alarm), oltre a `Death Screams`, `Movement` e gli hit `sfx_damage_hit*`/`sfx_sounds_impact*`.
- **Esplosioni**, «Free - 2D Explosion Animations» CC0: 4 fogli 4096×4096 (più versioni a metà), senza readme: la licenza sta nella pagina OGA e va scritta da noi nel repository.

## Goals / Non-Goals

**Goals:**

- audio che non pesa: traffico totale sotto i 3 MB, musica compresa;
- nessun suono prima del gesto utente, e nessun errore se l'audio è bloccato;
- un timbro riconoscibile per archetipo, così i nemici si sentono prima di vederli.

**Non-Goals:**

- mixer con volumi separati esposti all'utente, panning spaziale, musica adattiva;
- suoni per i pulsanti del menu, per gli asteroidi, voci o doppiaggio;
- audio posizionale o riverberi.

## Decisions

### 1. Un modulo audio con due bus e un solo interruttore

`src/audio/audio.ts` espone `audio.playSfx(key)`, `audio.playMusic('menu' | 'game')`, `audio.stopMusic()`, `audio.toggleMuted()`. Internamente tiene due volumi (musica 0,35, effetti 0,7), un master `muted` e un flag `unlocked`.

Lo stato di silenziamento vive in `localStorage` (`tiltclimb.muted`): è una preferenza del dispositivo, non della partita, e deve sopravvivere al ricaricamento. La partita e il menu non conoscono `localStorage`: passano dal modulo.

### 2. Sblocco al primo gesto, non al caricamento

I browser non consentono `AudioContext` prima di un gesto. Il modulo espone `unlock()`, chiamato dal primo `pointerdown` (e dal primo tasto premuto) già ascoltato dal menu per i permessi dei sensori. Prima di `unlock()` nessuna chiamata a `play()`: le richieste vengono messe in coda e scartate se lo sblocco non arriva, così un browser che blocca l'audio non produce errori in console né blocchi.

`ex.Sound` implementa `Loadable`, quindi le tracce entrano nel loader esistente: quando la scena parte, i buffer sono già decodificati e il primo sparo non arriva in ritardo.

### 3. Musica: due tracce, cambio con dissolvenza breve

Una traccia per scena, `loop = true`. Al cambio scena la traccia uscente sfuma in 250 ms e quella entrante parte a volume zero salendo in 250 ms, guidate da `onPreUpdate` della scena (nessun timer globalе da ripulire). La traccia di partita riparte dall'inizio a ogni partita: è quello che ci si aspetta da un arcade, e evita di riprendere a metà di un passaggio.

La musica è ricodificata a **OGG mono 80 kbps** con ffmpeg: da 3,9/4,5 MB a circa 1 MB per traccia, senza differenze udibili su un altoparlante di telefono. I comandi di ricodifica stanno in `scripts/prepare-audio.sh` insieme agli effetti, così il passaggio dai sorgenti ai file del repo è riproducibile.

### 4. Effetti: mappa evento → file, con la variante per archetipo

`src/audio/sfx.ts` contiene una tabella:

| Evento | File | Note |
| --- | --- | --- |
| sparo eroe | `sfx_wpn_laser1` | secco, breve |
| sparo pattuglia | `sfx_wpn_laser10` | più acuto |
| sparo picchiatore | `sfx_weapon_singleshot3` | più corposo |
| sparo cacciatore | `sfx_wpn_laser7` | più lungo |
| sparo torretta | `sfx_wpn_laser12` | più basso |
| abbattimento pattuglia | `sfx_exp_medium1` | piccolo |
| abbattimento picchiatore | `sfx_exp_cluster2` | medio |
| abbattimento cacciatore | `sfx_exp_double1` | medio |
| abbattimento torretta | `sfx_exp_long1` | più lungo |
| morte eroe | `sfx_exp_long3` + `sfx_damage_hit1` | due strati |
| sconfitta | `sfx_exp_long6` | basso e lungo |
| record | `sfx_sounds_powerup1` | crescente |

I nomi esatti delle famiglie sono verificati; in apply si conferma l'esistenza dei singoli file elencando il pacchetto, e sostituire un timbro è una riga di tabella.

Sovrapposizione: `ex.Sound.play()` gestisce più istanze con un tetto interno; le raffiche della torretta (4 colpi in 600 ms) sono il caso limite da controllare in prova, con la possibilità di abbassare il volume per istanza invece di ridurre la frequenza.

### 5. Esplosioni: pool di animazioni, frame estratti dai fogli

I fogli originali sono 4096×4096 e non si possono caricare su un telefono: `scripts/prepare-explosions.py` li apre, determina la griglia di frame, ne estrae 16 per foglio, li ridimensiona a 128 px e li salva in `public/assets/effects/explosion/<n>/frame_00..15.png`. Lo script documenta la griglia assunta e fallisce se il foglio non è divisibile, invece di produrre frame tagliati male.

`src/game/explosion.ts` è un pool di 6 actor: `burst(x, y, size)` prende un actor libero, gli monta l'`ex.Animation` (50 ms per frame) e lo rilascia quando l'animazione finisce. Nessuna allocazione durante la partita; due esplosioni ravvicinate non si sovrascrivono.

L'esplosione dell'eroe usa lo stesso pool con scala 2× e un suono diverso.

### 6. Interruttore nel menu, non un quarto pulsante

Un'icona 56×56 in alto a destra (`src/ui/audio-toggle.ts`), sopra la safe area, con due stati disegnati con la stessa tecnica canvas dei pulsanti (altoparlante con e senza onde). Tocca un'area grande il doppio dell'icona per essere raggiungibile col pollice. Non tocca il layout dei tre pulsanti già misurato.

## Risks / Trade-offs

- **Autoplay bloccato** → coda di richieste scartate prima di `unlock()`; nessun errore, nessun blocco. Su iOS il primo tocco deve essere reale, e il menu ne ha già uno per i sensori.
- **Peso audio** → musica ricodificata (~1 MB per traccia) e solo ~15 effetti brevi: il totale resta sotto i 3 MB, meno della metà di una traccia originale.
- **Latenza su Android** → buffer precaricati nel loader e nessuna creazione di `AudioContext` per ogni suono; se il primo sparo arrivasse tardi, il volume degli effetti si alza e si riduce il numero di istanze.
- **Troppi suoni insieme** (raffica della torretta + esplosione + musica) → il tetto di istanze di Excalibur scarta le nuove: in prova si verifica che la raffica non "mangi" l'esplosione, eventualmente abbassando il volume dei colpi nemici.
- **Fogli di esplosione enormi** → estrazione offline con script, mai a runtime; il repo riceve solo i frame ridotti.
- **Licenze** → i pacchetti audio non contengono un file di licenza (verificato: solo un `INFO.txt` generico nel pacchetto effetti): si scrive una nota `LICENSE.md` per cartella con autore, URL e licenza CC0, come già fatto per la grafica.

## Migration Plan

Nessuna migrazione. Le scene esistenti guadagnano chiamate a `audio.*` in punti già esistenti (`fireHero`, `resolveHits`, `onActivate`, `endRun`). Rollback: revert del commit di apply; nessun file esistente viene riscritto.
