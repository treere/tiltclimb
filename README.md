# Tiltclimb

Gioco 2D per browser: si sale in verticale all'infinito e si sterza inclinando il telefono.
Gira su Android Chrome (target primario) e su desktop con tastiera.

Stack: [Excalibur 1.0](https://excaliburjs.com) · TypeScript · Vite 8. Nessun backend.

## Comandi

```bash
npm install
npm run dev        # dev server su http://127.0.0.1:5173
npm run build      # typecheck + build in dist/
npm run preview    # serve la build su http://127.0.0.1:4173
npm run typecheck
npm run lint       # Biome: lint + format + import order, senza modificare
npm run lint:fix   # Biome: applica le correzioni
npm run format     # solo formattazione
npm run check      # typecheck + lint + contrasto + build: il gate prima di ogni commit
```

`npm run check:contrast` legge i colori da `src/ui/button.ts` e verifica il rapporto WCAG:
almeno 7:1 per il testo su ogni fondo, 3:1 per i bordi. Non è un'opinione sul gusto, è un
numero che si può far fallire.

Tooling che tiene bassa l'entropia: **Biome** (formatter e linter in un unico binario, niente
ESLint+Prettier da far litigare), TypeScript in `strict` con `noUncheckedIndexedAccess`,
`.editorconfig`, `.gitattributes` con LF. Biome non tocca `.agents/`, `.hermes/` e `openspec/`:
sono file generati dalla CLI OpenSpec e riformattarli crea solo rumore nei diff.

### Testi e pulsanti

Testi e pulsanti dell'interfaccia sono disegnati con l'API canvas 2D dentro `ex.Canvas`
(`src/ui/ui-text.ts`, `src/ui/button.ts`), con la dimensione misurata prima di disegnare e
`textAlign: center` per le etichette. Non è una preferenza estetica: i grafici di Excalibur si
disegnano dall'angolo in alto a sinistra e l'ancora dell'attore sposta il disegno di mezza
dimensione, mentre `ex.Text` si misura in modo lazy — combinandoli, un blocco di testo lungo
finiva diverse centinaia di pixel fuori schermo. Con il canvas la scatola e l'inchiostro
coincidono per costruzione.

### Hook pre-commit

`.githooks/pre-commit` esegue `tsc --noEmit` sull'intero progetto e `biome check --staged`
sui soli file in stage (veloce anche quando il repo cresce). Nessuna dipendenza extra: un
`prepare` in `package.json` attiva l'hook con `git config core.hooksPath .githooks` a ogni
`npm install`. Bypass consapevole, quando serve: `git commit --no-verify`.

## Provarlo sul telefono

I sensori (accelerometro) funzionano solo in **contesto sicuro**: `http://192.168.x.x:5173`
non basta, serve HTTPS. Il modo usato qui è un quick tunnel Cloudflare sul dev server:

```bash
npx vite                                   # o npm run dev
cloudflared tunnel --url http://127.0.0.1:5173
```

`vite.config.ts` è già configurato per accettare host `*.trycloudflare.com` e per fare
HMR su `wss:443`, altrimenti l'hot reload si riconnette alla porta sbagliata e muore.
Il tunnel è temporaneo: l'URL cambia a ogni avvio.

## Stato

Primo nucleo giocabile implementato: menu con calibrazione visibile, salita infinita,
ostacoli con pool, punteggio, morte, ritorno al menu con riepilogo, input tilt con
fallback tastiera/drag.

## Come si gioca

- **Menu**: all'apertura vedi l'inclinazione rilevata (valore e barra). Il primo tocco chiede
  il permesso dei sensori.
- **Calibra** fissa come zero l'assetto che tieni in quel momento e mostra `Calibrato ✓`.
- **Sensibilità**: riga `−` / valore / `+` nel menu, cinque livelli da 22° (morbido) a 8°
  (nervoso), default **13°**. Si salva sul dispositivo e vale dalla partita dopo, senza dover
  ricalibrare: la sensibilità è un fattore di scala, la calibrazione è un offset.
- **Inizia gioco** parte con lo zero dell'ultima calibrazione; se non hai calibrato vale
  l'assetto con cui hai aperto il menu.
- **In partita**: inclina a sinistra/destra. Da desktop frecce ← → o A/D; il trascinamento
  funziona anche sul telefono se il permesso viene negato.
- **Fine partita**: si torna al menu con il punteggio appena fatto, il migliore di sessione e
  il numero di navi abbattute.
- **CREDITI**: terzo pulsante del menu. Racconta la storia dell'eroe (salto andato storto,
  squadra dispersa, salita come unica rotta), elenca gli asset con licenza e l'autore.
  `INDIETRO` riporta al menu senza toccare la calibrazione.

## Difficoltà

- **La salita accelera**: da 190 px/s a 320 px/s, crescendo di `0.0135` px/s per ogni pixel
  scalato. Il tetto arriva intorno ai 9.600 px, cioè poco meno di un minuto di salita piena.
- **Legata all'altezza, non al tempo**: «6.000 px» vuol dire sempre la stessa velocità, quindi
  due partite con lo stesso percorso hanno la stessa difficoltà.
- **Tutto scorre insieme**: il campo stellato e i nemici usano la velocità corrente, non una
  costante. Un nemico mantiene la sua discesa relativa all'archetipo anche quando il gioco
  accelera.
- **Gli ostacoli non si stringono**: sono posizionati a passi di 260 px di salita, quindi
  accelerando diventano più distanti nel tempo, non più vicini nello spazio. Il gioco diventa
  più veloce, non più ingiusto.

## Combattimento

- **FUOCO**: pulsante in basso; un tocco = un colpo, nessuna raffica (una guardia di 150 ms
  ignora il doppio evento che alcuni browser generano da un tocco solo).
- **Navi nemiche**: quattro tipi, ognuno con sprite, movimento e fuoco propri. Compaiono in
  modo progressivo, in base all'altezza raggiunta:

  | Tipo         | Da       | Movimento                          | Fuoco                     | Punti |
  | ------------ | -------- | ---------------------------------- | ------------------------- | ----- |
  | Pattuglia    | subito   | ondeggia scendendo                 | 1 colpo                   | 25    |
  | Picchiatore  | 2500 px  | scende veloce in diagonale         | raffica di 2              | 35    |
  | Cacciatore   | 6000 px  | ti segue in orizzontale (150 px/s) | ventaglio di 3 a ±18°     | 45    |
  | Torretta UFO | 10000 px | staziona a mezza altezza           | raffica di 4, pausa lunga | 60    |

  Il limite di navi contemporanee è 2, e sale a 3 da quando è sbloccato il cacciatore.
- **Immunità**: i colpi dell'eroe attraversano gli asteroidi e le navi nemiche li attraversano
  a loro volta. Le collisioni di proiettili e navi sono calcolate a mano
  (`src/game/combat-math.ts`), non dal motore: è così che le immunità restano esplicite.
- **Punteggio**: altezza (1 punto ogni 20 px) più i punti del tipo abbattuto: 25, 35, 45 o 60.
- Morire è istantaneo: asteroide, nave o proiettile nemico chiudono la partita.

## Aspetto

Astronave con scia animata, campo di asteroidi che ruotano, sfondo stellato in parallasse
(tasselli 256×256 riciclati + stelle a due profondità). Il menu usa lo stesso sfondo a
velocità ridotta con la nave come illustrazione.

Gli sprite sostituiscono le forme disegnate via codice; **le hitbox non sono cambiate di
forma**: la nave usa un collisore 56×34 (lo sprite è 112×75, quindi più grande del collisore),
gli asteroidi un cerchio di raggio 33 px su uno sprite largo 90, con area paragonabile alla
vecchia barra 120×28.

## Schermata di caricamento

Il loader predefinito di Excalibur (fondo blu, logo del motore) è sostituito da
`src/ui/loading-screen.ts`: campo stellato, due navi che si inseguono con la scia, barra di
avanzamento e percentuale legate ai progressi reali del caricamento.

Due dettagli che valgono la pena di sapere:

- Le **navi sono gli sprite veri** del gioco (`playerShip2_blue`, `enemyRed1`): copiati in
  `src/assets/ships/` e importati con `?inline`, così finiscono nel bundle come data URL e sono
  disponibili prima che qualsiasi asset di rete arrivi. Costo: ~7 KB di base64.
- Tutto il resto è disegnato con primitive 2D, e finché le immagini inline non sono decodificate
  (pochi millisecondi) c'è un fallback a chevron: la schermata non può restare vuota.
- Resta visibile almeno 700 ms anche con gli asset in cache (altrimenti lampeggerebbe) e la
  dissolvenza verso il menu è un sipario nero in `menu-scene.ts`, non un effetto del loader: quando
  il caricamento finisce l'engine smette di disegnare la schermata del loader, quindi una
  dissolvenza lì sfumerebbe verso lo sfondo vuoto, non verso il menu.

Con `prefers-reduced-motion` navi e stelle stanno ferme. Su schermo orizzontale vale l'avviso
"ruota il telefono" già presente in `index.html`.

## Audio

- **Musica**: una traccia per il menu e una per la partita, in loop, con cambio di scena.
- **Effetti**: sparo dell'eroe, sparo diverso per ognuno dei quattro archetipi, esplosione diversa
  per tipo quando una nave viene abbattuta, esplosione grande e impatto alla morte dell'eroe.
- **Fine partita**: suono di sconfitta, sostituito da un suono di successo se il punteggio batte
  il migliore della sessione (la prima partita non conta come record).
- **Silenziamento**: icona in alto a destra nel menu, stato ricordato sul dispositivo
  (`localStorage`, chiave `tiltclimb.muted`).
- **Niente audio prima di un gesto**: i browser bloccano la riproduzione automatica, quindi le
  tracce partono al primo tocco o tasto. Se l'audio resta bloccato, il gioco funziona zitto.

Gli asset si rigenerano dai sorgenti CC0 con:

```bash
FFMPEG=/percorso/ffmpeg python3 scripts/prepare-audio.py      # effetti + musica (OGG mono)
python3 scripts/prepare-explosions.py                          # frame delle esplosioni (Pillow)
```

## Crediti

Asset grafici: **Kenney — «Space Shooter Redux»**, licenza **CC0 1.0** (public domain).
Autore: Kenney Vleugels, <https://kenney.nl>. Il testo di licenza originale è in
`public/assets/kenney/license.txt`, accanto ai file usati.

Asset audio: **Juhani Junkala**, «The Essential Retro Video Game Sound Effects Collection»,
**CC0 1.0** — <https://opengameart.org/content/512-sound-effects-8-bit-style>.
Musiche: «Background Space Track» e «Space Music: Out There», **CC0 1.0**, da OpenGameArt.
Esplosioni animate: «Free - 2D Explosion Animations», **CC0 1.0**.
Le note di licenza complete stanno accanto ai file (`public/assets/audio/LICENSE.md`,
`public/assets/effects/explosion/LICENSE.md`).

CC0 non richiede attribuzione: il credito è qui perché è giusto darlo, e perché il giorno in
cui arriverà un asset CC-BY la sua licenza dovrà essere elencata allo stesso modo.

## OpenSpec

```bash
npx @fission-ai/openspec@latest status --change add-endless-climb-core
npx @fission-ai/openspec@latest validate add-endless-climb-core
```

- `proposal.md` — perché e cosa
- `specs/` — comportamento richiesto (`gameplay/endless-climb`, `input/tilt-control`)
- `design.md` — come, con le costanti di gioco e la matematica del tilt
- `tasks.md` — passi di implementazione con verifica
