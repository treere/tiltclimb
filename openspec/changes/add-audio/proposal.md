# Proposal

## Why

Il gioco è muto: uno sparo senza suono è un'animazione, un'esplosione senza bottto è un rettangolo che sparisce. L'audio è ciò che rende leggibile a orecchio quello che succede fuori dallo schermo (un nemico che spara in alto) e che segnala il risultato di una partita senza doverlo leggere. Inoltre i quattro archetipi nemici oggi si distinguono solo per forma e movimento: un timbro proprio per ciascuno li rende riconoscibili anche quando sono fuori campo.

## What Changes

- **Musica**: due tracce, una per il menu e una per la partita, in loop. Cambio di traccia al cambio scena, con dissolvenza breve.
- **Effetti**: sparo dell'eroe, sparo di **ogni** archetipo nemico (quattro timbri diversi), esplosione quando un nemico viene abbattuto (**diversa per tipo**), impatto/morte dell'eroe.
- **Collisioni animate**: le esplosioni sono animazioni a frame, non sparizioni. Una piccola per i nemici, una grande per l'eroe; gli asteroidi restano immuni ai colpi e non esplodono.
- **Fine partita**: un suono quando si perde, e un **suono diverso se si è superato il proprio record** di sessione.
- **Silenziamento**: un interruttore audio nel menu (icona piccola, non un pulsante in più), con lo stato ricordato fra le sessioni; senza di esso un gioco con musica è inutilizzabile su un telefono in pubblico.
- **Licenze**: solo materiale CC0, con provenienza e licenza documentate accanto ai file, come già fatto per la grafica.
- Fuori scope: voci, doppiaggio, musica adattiva che cambia con la difficoltà, effetti spaziali (panning per posizione), audio per gli asteroidi, mixer con volumi separati, suoni per i pulsanti del menu.

## Capabilities

### New Capabilities

- `presentation/audio`: musica di menu e di partita, effetti legati agli eventi di gioco, timbri distinti per archetipo, suono di sconfitta e suono di record, interruttore di silenziamento e regola che nulla suona prima di un gesto dell'utente.

### Modified Capabilities

- `presentation/space-theme`: le collisioni non sono più sparizioni silenziose ma animazioni a frame; la regola su provenienza e licenza degli asset si estende esplicitamente anche all'audio, non solo alla grafica.

## Impact

- Asset: si aggiungono circa 20 file audio (effetti brevi, tagliati dal pacchetto CC0 di Juhani Junkala), 2 tracce musicali CC0 ricodificate a dimensione da telefono, e i frame di 1–2 fogli di esplosione CC0 ridimensionati (gli originali sono 4096×4096, inutilizzabili così).
- Codice: nuovo `src/audio/audio.ts` (bus, volumi, mute, unlock al primo gesto), `src/audio/sfx.ts` (mappa evento → suono, per archetipo), `src/game/explosion.ts` (pool di animazioni), ritocchi a menu, partita, session, loader e `README`.
- Rischio principale: i browser bloccano l'audio finché non c'è un gesto dell'utente. La musica deve partire al primo tocco, non al caricamento, e non deve produrre errori se il permesso audio viene rifiutato.
