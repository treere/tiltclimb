# Tasks

## 1. Sessione condivisa e due scene

- [x] 1.1 Creare `src/game/session.ts` con l'istanza unica di `TiltSource`, `lastScore`, `bestScore` e `sensorPromptDone`, e importarlo nelle scene; verifica: `npm run check` verde e nessuna seconda istanza di `TiltSource` nel codice (grep)
- [ ] 1.2 Togliere `TiltSource` da `ClimbScene` e riceverla dal modulo di sessione; verifica: la partita gioca ancora e la sterzata risponde
- [x] 1.3 Registrare `MenuScene` e `ClimbScene` sull'engine e rendere `menu` la scena iniziale (scheletro di menu vuoto con solo un titolo); verifica: all'apertura compare il menu e non la partita
- [x] 1.4 Spostare in `onActivate` di `ClimbScene` il reset di stato, pool e posizioni, e cancellare i timer pendenti in `onDeactivate`; verifica: entrando e uscendo dalla scena due volte la partita riparte sempre pulita

## 2. Componente pulsante

- [x] 2.1 Creare `src/ui/button.ts` con sfondo `Rectangle`, etichetta `Text`, eventi pointer dell'attore e stati normale/premuto/disabilitato; verifica: `npm run check` verde e tipi senza `any`
- [ ] 2.2 Aggiungere al pulsante l'API `setEnabled`, `setLabel` e il callback `onPress`; verifica: un pulsante disabilitato non invoca `onPress` al tocco (prova manuale da telefono)

## 3. Menu: layout e lettura live

- [ ] 3.1 Compose il layout del menu (titolo, blocco calibrazione, pulsanti in basso) usando `screen.contentArea` come riferimento; verifica: nulla viene tagliato da notch o angoli su telefono
- [x] 3.2 Mostrare la lettura live dell'inclinazione relativa in gradi, aggiornata a ogni frame dal `TiltSource` di sessione; verifica: inclinando il telefono il numero cambia con il segno atteso e resta fermo a telefono fermo
- [ ] 3.3 Aggiungere la barra orizzontale che rappresenta la stessa inclinazione; verifica: la barra si muove nella stessa direzione del numero e satura agli estremi

## 4. Calibrazione con conferma

- [x] 4.1 Collegare **Calibra** a `tilt.calibrate()` con conferma visibile `Calibrato ✓` per 1,2 s e flash del pulsante; verifica: dopo la pressione la lettura torna a zero nell'assetto tenuto
- [x] 4.2 Gestire il caso sensore non disponibile: il pulsante mostra `Sensore non disponibile` e non produce conferma; verifica: con sensore negato il menu non mostra il messaggio di calibrazione riuscita
- [x] 4.3 Verificare che **Inizia gioco** non ricalibri: avviare la partita dopo aver inclinato il telefono e controllare che lo zero resti quello del menu; verifica: il giocatore non deriva all'avvio della partita

## 5. Permessi e avviso nel menu

- [x] 5.1 Richiedere il permesso al primo dei due pulsanti premuti, registrando l'esito in sessione e sottoscrivendo `listen()` una volta sola; verifica: la richiesta compare una volta e non si ripete in partita
- [ ] 5.2 Mostrare l'avviso nel menu quando il permesso è negato, il sensore è assente o non arrivano dati; verifica: negando il permesso compare l'avviso e **Inizia gioco** resta attivo
- [x] 5.3 Nascondere l'avviso quando i dati del sensore tornano disponibili; verifica: dopo aver concesso il permesso l'avviso sparisce senza ricaricare la pagina

## 6. Ritorno al menu a fine partita

- [ ] 6.1 In `ClimbScene.endRun()` scrivere `lastScore` e aggiornare `bestScore` in sessione, poi tornare a `menu` dopo 500 ms; verifica: morendo si torna al menu e il punteggio mostrato è quello della partita appena finita
- [x] 6.2 Impedire cambi scena doppi con un flag e cancellare il timer in `onDeactivate`; verifica: due collisioni ravvicinate producono un solo ritorno al menu
- [x] 6.3 Mostrare nel menu punteggio appena fatto e migliore di sessione, aggiornando il migliore solo se superato; verifica: una partita da 10 punti dopo una da 40 lascia il migliore a 40

## 7. Verifica finale

- [ ] 7.1 Giro completo su telefono via tunnel HTTPS: menu → calibra → inizia → muori → menu con riepilogo → inizia di nuovo; verifica: nessuno stato bloccato e nessun errore in console
- [ ] 7.2 Prova del fallback: permesso negato, avviso visibile, partita giocabile con drag; verifica: il gioco resta controllabile senza sensore
- [x] 7.3 Aggiornare `README.md` (menu, calibrazione, riepilogo) ed eseguire `npm run check`; verifica: comando verde e documentazione coerente con il comportamento

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
