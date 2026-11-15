# Tasks

## 1. Velocità progressiva

- [x] 1.1 Creare `src/game/speed.ts` con `climbSpeedAt(heightPx)`, avvio 190, tetto 320; verifica: 5 controlli numerici in Node (avvio, crescita, tetto, altezze negative, monotonia)
- [x] 1.2 Sostituire la costante con la velocità corrente in `climb-scene.ts`, `player.ts`, `starfield.ts` e `enemy.ts` (discesa relativa); verifica: `npm run check` verde e nessun import residuo di `CLIMB_SPEED` fuori da `speed.ts`
- [x] 1.3 Verificare che la distanza fra ostacoli resti 260 px di salita anche in partita veloce; verifica: conteggio ostacoli per 1.000 px costante a inizio e fine rampa
- [x] 1.4 Controllare a occhio, in headless, che parallasse e nemici accelerino insieme senza scatti; verifica: due screenshot a 10 s di distanza con velocità diverse e nessun elemento "appeso"

## 2. Sensibilità

- [x] 2.1 Creare `src/input/tilt-settings.ts` con i cinque livelli, default 16°, lettura e scrittura tollerante agli errori; verifica: test in Node su clamp, default senza storage e round-trip di salvataggio
- [x] 2.2 Rendere la sensibilità una proprietà modificabile di `TiltSource`, con dead zone e smorzamento invariati; verifica: con lo stesso angolo la velocità orizzontale cresce passando dal livello 1 al 5
- [x] 2.3 Applicare il livello salvato all'avvio della partita; verifica: livello 5 salvato → il fondo scala arriva a 10°

## 3. Controllo nel menu

- [x] 3.1 Aggiungere la riga `−` / etichetta / `+` con livello e gradi, sopra i pulsanti esistenti; verifica: etichetta centrata e nessuna sovrapposizione su 720×1280
- [x] 3.2 Disabilitare `−` al minimo e `+` al massimo; verifica: ai limiti il tocco non cambia valore e il pulsante appare spento
- [x] 3.3 Applicare e salvare la scelta al tocco; verifica: dopo il tocco il valore resta dopo un ricaricamento della pagina
- [x] 3.4 Controllare il layout su schermo piccolo (360×640) e in orizzontale; verifica: nulla tagliato, nulla sovrapposto

## 4. Documentazione e verifica

- [x] 4.1 Aggiornare `README.md` con la rampa di velocità e la sensibilità configurabile; verifica: `npm run check` verde
- [ ] 4.2 Prova su telefono: sensazione dello sterzo ai livelli 1, 3 e 5 e difficoltà dopo un minuto di salita; verifica: giudizio a mano
- [ ] 4.3 Tarare se serve `CLIMB_SPEED_MAX`, `CLIMB_SPEED_PER_PX` o i gradi dei livelli in base alla prova; verifica: valori aggiornati anche nel design

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando i delta spec
