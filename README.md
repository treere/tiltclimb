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
```

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

Impalcatura pronta (motore, toolchain, tunnel). Il gioco è descritto in OpenSpec e non è
ancora implementato: vedi `openspec/changes/add-endless-climb-core/`.

## OpenSpec

```bash
npx @fission-ai/openspec@latest status --change add-endless-climb-core
npx @fission-ai/openspec@latest validate add-endless-climb-core
```

- `proposal.md` — perché e cosa
- `specs/` — comportamento richiesto (`gameplay/endless-climb`, `input/tilt-control`)
- `design.md` — come, con le costanti di gioco e la matematica del tilt
- `tasks.md` — passi di implementazione con verifica
