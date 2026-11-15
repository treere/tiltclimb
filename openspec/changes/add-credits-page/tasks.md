# Tasks

## 1. Contenuti

- [x] 1.1 Creare `src/game/credits-text.ts` con la storia dell'eroe (quattro righe) e la lista dei crediti (asset Kenney con licenza, autore del gioco con ruolo); verifica: `npm run check` verde e nessun testo hard-coded nella scena
- [x] 1.2 Aggiungere un test di contrasto in Node sui colori dei pulsanti e del testo, verificando il rapporto 7:1; verifica: il controllo passa e fallisce se si scurisce il fondo sotto soglia

## 2. Pulsanti e leggibilità

- [x] 2.1 Rendere opaco il fondo dei pulsanti, bordo più luminoso, etichetta bianca di corpo 38 con ombra del font; verifica: il contrasto calcolato resta sopra 7:1 in tutti gli stati
- [x] 2.2 Applicare l'ombra ai testi di menu e HUD (titolo, inclinazione, riepilogo, punteggio in partita); verifica: le scritte restano leggibili con lo sfondo stellato in movimento

## 3. Pagina crediti

- [x] 3.1 Creare `src/game/credits-scene.ts` con sfondo stellato lento, nave illustrativa, titolo, racconto, crediti e pulsante INDIETRO che torna al menu; verifica: la pagina si apre, il testo va a capo entro i margini e il ritorno al menu funziona
- [x] 3.2 Registrare la scena in `src/main.ts` e collegare il pulsante CREDITI del menu; verifica: da menu a crediti e ritorno senza avviare partite e con la calibrazione invariata

## 4. Layout del menu a tre comandi

- [x] 4.1 Riorganizzare il layout del menu per i tre pulsanti (0.66 / 0.77 / 0.88) spostando lettura, barra, riepilogo e avviso; verifica: i tre comandi sono tutti visibili e non si sovrappongono all'illustrazione né fra loro
- [ ] 4.2 Verificare il layout su uno schermo basso (simulando un'altezza utile ridotta) e correggere le altezze se serve; verifica: nulla finisce sotto il bordo o sopra la navigazione

## 5. Verifica finale

- [ ] 5.1 Giro su telefono: menu a tre pulsanti, crediti leggibili, ritorno al menu, partita avviabile dopo il ritorno; verifica: nessuno stato bloccato e nessun testo tagliato
- [ ] 5.2 Giudizio sulla leggibilità: scritte leggibili sopra le stelle in menu, crediti e HUD; verifica: giudizio a occhio su schermo piccolo
- [x] 5.3 Aggiornare `README.md` (pagina crediti, storia, crediti) ed eseguire `npm run check`; verifica: comando verde e documentazione coerente

## Workflow follow-up

- Archiviare la change con `openspec-archive-change` dopo la verifica, sincronizzando gli delta spec
