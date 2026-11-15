# Tasks

## 1. Schermata a tema

- [ ] 1.1 Creare `src/ui/loading-screen.ts` con `ThemedLoader extends ex.Loader` e un `onDraw(ctx)` che disegna sfondo, campo stellato e i due chevron che si inseguono; verifica: `npm run check` verde e nessuna dipendenza da asset nel file
- [ ] 1.2 Aggiungere barra di avanzamento e percentuale legate a `this.progress`; verifica: la percentuale cresce durante il caricamento e arriva a 100 solo alla fine
- [ ] 1.3 Comporre il layout a frazioni dell'altezza utile con barra al massimo al 70% della larghezza; verifica: in verticale e in orizzontale nulla esce dallo schermo

## 2. Tempi e uscita

- [ ] 2.1 Implementare il tempo minimo di 700 ms con `onBeforeLoad` e una `show()` che attende progresso, tempo minimo e dissolvenza di 250 ms; verifica: con gli asset in cache la schermata resta visibile almeno 700 ms
- [ ] 2.2 Applicare la dissolvenza tramite `globalAlpha` e chiudere il loop di animazione a fine dissolvenza; verifica: nessun frame loop attivo dopo il passaggio al menu
- [ ] 2.3 Rispettare `prefers-reduced-motion`: navi e stelle fermi, barra e percentuale attive; verifica: con l'emulazione attiva la schermata resta leggibile e statica

## 3. Integrazione

- [ ] 3.1 Sostituire il loader predefinito in `src/main.ts` con `ThemedLoader` e attendere `show()` prima di entrare nel menu; verifica: all'avvio si vede la schermata a tema e solo dopo il menu
- [ ] 3.2 Verificare che il caricamento reale (immagini, audio, frame) mostri progresso coerente e nessun errore in console; verifica: nessun 404 e barra che arriva al 100%

## 4. Documentazione e verifica

- [ ] 4.1 Aggiornare `README.md` con la schermata di caricamento ed eseguire `npm run check`; verifica: comando verde e documentazione coerente
- [ ] 4.2 Prova su telefono via tunnel, con cache svuotata per rivedere il caricamento lento; verifica: schermata leggibile, navi in movimento, uscita in dissolvenza
- [ ] 4.3 Giudizio estetico: le due navi si leggono come un inseguimento e la schermata non sembra più "un errore"; verifica: giudizio a occhio su schermo piccolo

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
