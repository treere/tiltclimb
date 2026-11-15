# Tasks

## 1. Schermata a tema

- [x] 1.1 Creare `src/ui/loading-screen.ts` con `ThemedLoader extends ex.Loader` e un `onDraw(ctx)` che disegna sfondo, campo stellato e i due chevron che si inseguono; verifica: `npm run check` verde e nessuna dipendenza da asset nel file
- [x] 1.4 Usare gli sprite reali del gioco incorporati con `?inline` (data URL nel bundle) al posto dei chevron, con fallback a chevron finché l'immagine non è decodificata; verifica: a schermo si vedono la nave azzurra e il nemico arancione, separati
- [x] 1.2 Aggiungere barra di avanzamento e percentuale legate a `this.progress`; verifica: la percentuale cresce durante il caricamento e arriva a 100 solo alla fine
- [x] 1.3 Comporre il layout a frazioni dell'altezza utile con barra al massimo al 70% della larghezza; verifica: in verticale e in orizzontale nulla esce dallo schermo

## 2. Tempi e uscita

- [x] 2.1 Implementare il tempo minimo di 700 ms con `onBeforeLoad` e una `show()` che attende progresso, tempo minimo e dissolvenza di 250 ms; verifica: con gli asset in cache la schermata resta visibile almeno 700 ms
- [x] 2.2 Dissolvenza in uscita realizzata come sipario del menu (il loader non può sfumare sopra il gioco, perché l'engine smette di disegnarlo): `ScreenElement` nero che passa da opacità 1 a 0 in 320 ms; verifica: nessun frame nero intermedio fra caricamento e menu
- [x] 2.3 Rispettare `prefers-reduced-motion`: navi e stelle fermi, barra e percentuale attive; verifica: con l'emulazione attiva la schermata resta leggibile e statica

## 3. Integrazione

- [x] 3.1 Sostituire il loader predefinito in `src/main.ts` con `ThemedLoader` e attendere `show()` prima di entrare nel menu; verifica: all'avvio si vede la schermata a tema e solo dopo il menu
- [x] 3.2 Verificare che il caricamento reale (immagini, audio, frame) mostri progresso coerente e nessun errore in console; verifica: nessun 404 e barra che arriva al 100%

## 4. Documentazione e verifica

- [x] 4.1 Aggiornare `README.md` con la schermata di caricamento ed eseguire `npm run check`; verifica: comando verde e documentazione coerente
- [ ] 4.2 Prova su telefono via tunnel, con cache svuotata per rivedere il caricamento lento; verifica: schermata leggibile, navi in movimento, uscita in dissolvenza
- [ ] 4.3 Giudizio estetico: le due navi si leggono come un inseguimento e la schermata non sembra più "un errore"; verifica: giudizio a occhio su schermo piccolo

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
