# Tasks

## 1. Asset audio e licenze

- [ ] 1.1 Estrarre dal pacchetto 512 i ~15 effetti scelti, ricodificare le due tracce musicali in OGG mono 80 kbps con gli script in `scripts/`, e salvare tutto in `public/assets/audio/`; verifica: i file esistono, le dimensioni totali stanno sotto i 3 MB e `file` riconosce OGG/WAV validi
- [ ] 1.2 Scrivere `public/assets/audio/LICENSE.md` con autore, URL e licenza CC0 per ciascun pacchetto (effetti Juhani Junkala, musiche da OpenGameArt) e aggiornare i crediti nel `README.md`; verifica: autore, licenza e provenienza ricostruibili senza rete

## 2. Modulo audio

- [ ] 2.1 Creare `src/audio/audio.ts` con bus musica/effetti, volumi, `muted` persistito in `localStorage`, coda delle richieste prima dello sblocco e `unlock()`; verifica: `npm run check` verde e nessuna chiamata a `play()` riesce prima di `unlock()`
- [ ] 2.2 Caricare le tracce e gli effetti nel loader esistente e verificare che nessun file venga richiesto due volte; verifica: in rete si vedono una sola richiesta per file e nessun 404
- [ ] 2.3 Creare `src/audio/sfx.ts` con la tabella evento → file, comprese le varianti per archetipo; verifica: ogni chiave della tabella punta a un file presente in `public/assets/audio/`
- [ ] 2.4 Implementare il cambio musica con dissolvenza guidata da `onPreUpdate`, senza timer globali; verifica: passando menu → partita → menu non restano due tracce sovrapposte

## 3. Sblocco e interruttore

- [ ] 3.1 Agganciare `unlock()` al primo gesto (pointer e tastiera) in `main.ts` e far partire la musica di menu solo dopo; verifica: al primo tocco la musica parte e non compaiono errori in console
- [ ] 3.2 Creare `src/ui/audio-toggle.ts` con l'icona a due stati in alto a destra del menu, area di tocco 56×56 (doppia dell'icona); verifica: il tocco cambia stato, zittisce tutto e non sposta il layout dei tre pulsanti

## 4. Esplosioni animate

- [ ] 4.1 Scrivere `scripts/prepare-explosions.py` che estrae 16 frame per foglio a 128 px e li salva in `public/assets/effects/explosion/`; verifica: lo script fallisce su fogli non divisibili e produce frame visivamente corretti
- [ ] 4.2 Creare `src/game/explosion.ts` con pool di 6 animazioni e `burst(x, y, scale)`, rilasciando l'attore a fine animazione; verifica: due esplosioni ravvicinate si vedono entrambe e il numero di actor resta costante
- [ ] 4.3 Agganciare l'esplosione all'abbattimento di una nave e alla morte dell'eroe (scala doppia); verifica: nessuna esplosione quando un colpo attraversa un asteroide

## 5. Suoni nei punti giusti

- [ ] 5.1 Suono dello sparo dell'eroe in `fireHero()` e sparo di ogni archetipo quando la nave spara; verifica: quattro tipi diversi producono quattro timbri distinti
- [ ] 5.2 Suono di abbattimento per tipo, suono di morte dell'eroe, suono di sconfitta e suono di record (quest'ultimo solo se il punteggio supera il migliore precedente); verifica: una partita senza record suona la sconfitta, una con record suona il successo
- [ ] 5.3 Verificare il caso peggiore di sovrapposizione (raffica della torretta + esplosione + musica): nessun suono mancante o distorto; verifica: prova su telefono con volume medio

## 6. Documentazione e verifica finale

- [ ] 6.1 Aggiornare `README.md` (audio, crediti, comandi degli script di preparazione) ed eseguire `npm run check`; verifica: comando verde e documentazione coerente
- [ ] 6.2 Giro su telefono via tunnel: musica nel menu, musica in partita, spari, esplosioni, sconfitta, record, interruttore audio e ricaricamento con audio disattivato; verifica: ogni punto della spec si comporta come descritto
- [ ] 6.3 Giudizio sul mix: musica che non copre gli effetti, effetti che non stordiscono, e nessun ritardo percepibile al primo sparo; verifica: tre partite di prova

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
