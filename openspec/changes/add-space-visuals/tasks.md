# Tasks

## 1. Asset e licenze

- [ ] 1.1 Copiare dal pack Kenney Space Shooter Redux i file usati (nave, 10 frame di fiamma, 6 meteore, 3 stelle, tassello di sfondo) in `public/assets/kenney/` mantenendo i nomi originali; verifica: la cartella contiene i file attesi e `npm run check` resta verde
- [ ] 1.2 Copiare `license.txt` del pack accanto agli asset e aggiungere la sezione **Crediti** nel `README.md` con autore, licenza CC0 e URL di provenienza; verifica: autore, licenza e provenienza ricostruibili senza rete

## 2. Caricamento

- [ ] 2.1 Creare `src/game/sprites.ts` con i riferimenti agli asset e un `ex.Loader` unico che li precarica; verifica: nessun errore 404 in console e `npm run check` verde
- [ ] 2.2 Collegare il loader all'avvio dell'engine e bloccare l'ingresso in scena finché le immagini non sono pronte; verifica: la nave appare già nel primo frame visibile, senza rettangoli segnaposto

## 3. Astronave e scia

- [ ] 3.1 Sostituire il rettangolo del giocatore con lo sprite della nave, scalato per riempire il collisore esistente (hitbox invariata); verifica: la nave si muove e collide come prima, e le dimensioni del collisore restano 44×56×0.8
- [ ] 3.2 Aggiungere la scia animata come actor figlio con `ex.Animation` da 10 frame a 60 ms, in loop, sotto la fusoliera; verifica: la fiamma si anima in partita e resta allineata alla nave mentre sterza
- [ ] 3.3 Fermare l'animazione della scia a fine partita e riavviarla alla partita successiva; verifica: dopo la morte la scia non continua a scorrere

## 4. Asteroidi

- [ ] 4.1 Sostituire il rettangolo degli ostacoli con sprite di meteora scelti a caso fra le 6 disponibili; verifica: due ostacoli consecutivi non sono sempre lo stesso sprite
- [ ] 4.2 Assegnare orientamento iniziale casuale e rotazione lenta continua a ogni asteroide, con velocità e verso casuali; verifica: gli asteroidi ruotano mentre scorrono e non hanno tutti lo stesso angolo
- [ ] 4.3 Sostituire il collisore rettangolare con un collisore circolare di raggio ~33 px e verificare che l'area resti paragonabile; verifica: una meteora colpita al centro uccide, un passaggio radente senza contatto visivo no

## 5. Sfondo in parallasse

- [ ] 5.1 Creare `src/game/starfield.ts` con il pool di tasselli 256×256 che scorre e si ricicla; verifica: salendo per almeno due schermate non compaiono bande vuote né cuciture
- [ ] 5.2 Aggiungere le stelle come strato a velocità intermedie (0.6× e 1.0× della salita) per la profondità; verifica: gli elementi lontani scorrono più lenti di quelli vicini
- [ ] 5.3 Verificare che il parallasse non allochi durante la partita e che il frame rate resti stabile su telefono; verifica: numero di sprite costante nel tempo e nessuno scatto percepibile

## 6. Menu e pulsanti

- [ ] 6.1 Applicare lo sfondo stellato a velocità ridotta e l'astronave con scia come illustrazione nel menu; verifica: il menu è leggibile e i comandi restano nelle posizioni attuali
- [ ] 6.2 Impostare `useBounds: false` sul testo dei pulsanti così che solo il rettangolo definisca i bounds del gruppo; verifica: con l'etichetta "Sensore non disponibile" il fondo non si sposta e il testo resta centrato
- [ ] 6.3 Controllare che cambiare etichetta a runtime (`Calibra` ↔ `Sensore non disponibile`) non produca salti di posizione; verifica: nessun movimento visibile del fondo al cambio

## 7. Verifica finale

- [ ] 7.1 Giro completo su telefono via tunnel: menu a tema → calibra → partita con nave, scia e asteroidi → morte → ritorno al menu; verifica: nessun asset mancante e nessun errore in console
- [ ] 7.2 Controllare la leggibilità in partita (nave distinguibile dagli asteroidi, HUD leggibile sullo sfondo stellato); verifica: giudizio a occhio su schermo piccolo
- [ ] 7.3 Aggiornare `README.md` (aspetto, crediti) ed eseguire `npm run check`; verifica: comando verde e documentazione coerente

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
