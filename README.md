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

Primo nucleo giocabile implementato: salita infinita, ostacoli con pool, punteggio, morte,
riavvio, input tilt con calibrazione e fallback tastiera/drag. Restano da tarare le costanti
sul dispositivo reale (`openspec/.../tasks.md`, task 7.1 e 7.2).

## Come si gioca

- **Telefono**: apri il link HTTPS, tocca lo schermo (chiede il permesso sensori, entra in
  fullscreen), poi inclina a sinistra/destra per sterzare. Inclinazione neutra = quella che
  avevi al primo tocco.
- **Desktop**: frecce ← → oppure A/D. Il drag col mouse funziona anche sul telefono se il
  permesso viene negato.
- Si muore toccando un ostacolo; un tocco riavvia.

## OpenSpec

```bash
npx @fission-ai/openspec@latest status --change add-endless-climb-core
npx @fission-ai/openspec@latest validate add-endless-climb-core
```

- `proposal.md` — perché e cosa
- `specs/` — comportamento richiesto (`gameplay/endless-climb`, `input/tilt-control`)
- `design.md` — come, con le costanti di gioco e la matematica del tilt
- `tasks.md` — passi di implementazione con verifica
