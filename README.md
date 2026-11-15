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
npm run check      # typecheck + lint + build: il gate prima di ogni commit
```

Tooling che tiene bassa l'entropia: **Biome** (formatter e linter in un unico binario, niente
ESLint+Prettier da far litigare), TypeScript in `strict` con `noUncheckedIndexedAccess`,
`.editorconfig`, `.gitattributes` con LF. Biome non tocca `.agents/`, `.hermes/` e `openspec/`:
sono file generati dalla CLI OpenSpec e riformattarli crea solo rumore nei diff.

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
- **Inizia gioco** parte con lo zero dell'ultima calibrazione; se non hai calibrato vale
  l'assetto con cui hai aperto il menu.
- **In partita**: inclina a sinistra/destra. Da desktop frecce ← → o A/D; il trascinamento
  funziona anche sul telefono se il permesso viene negato.
- **Fine partita**: si torna al menu con il punteggio appena fatto e il migliore di sessione.

## Aspetto

Astronave con scia animata, campo di asteroidi che ruotano, sfondo stellato in parallasse
(tasselli 256×256 riciclati + stelle a due profondità). Il menu usa lo stesso sfondo a
velocità ridotta con la nave come illustrazione.

Gli sprite sostituiscono le forme disegnate via codice; **le hitbox non sono cambiate di
forma**: la nave usa un collisore 56×34 (lo sprite è 112×75, quindi più grande del collisore),
gli asteroidi un cerchio di raggio 33 px su uno sprite largo 90, con area paragonabile alla
vecchia barra 120×28.

## Crediti

Asset grafici: **Kenney — «Space Shooter Redux»**, licenza **CC0 1.0** (public domain).
Autore: Kenney Vleugels, <https://kenney.nl>. Il testo di licenza originale è in
`public/assets/kenney/license.txt`, accanto ai file usati.

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
