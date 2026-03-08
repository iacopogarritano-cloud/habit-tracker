# Cronologia Sessioni - Weighbit (archivio — sessioni 1-25)

> **Nota:** Archivio storico delle prime sessioni del progetto. Per le sessioni recenti vedi [CRONOLOGIA.md](./CRONOLOGIA.md).
> Consultare solo su richiesta esplicita ("quando abbiamo fatto X" nelle prime fasi).
> ⚠️ Alcune sessioni hanno numerazione duplicata a causa di log aggiunti da istanze diverse — il contenuto è comunque accurato.

---

## Sessione 1 - 2025-02-01 (Mac)
- Setup iniziale progetto
- Creato PRD
- Configurato React + Vite
- Discusso struttura cartelle

## Sessione 2 - 2025-02-01 (Mac)
- Rinominata cartella in "Code"
- Aggiornati file .claudecode (separati generico/specifico)
- Riletto conversazione precedente
- Installato Git su Windows (da remoto)

## Sessione 3 - 2026-02-01 (PC Windows)
- Installato Node.js v24.13.0 LTS su Windows
- Installato dipendenze npm (158 pacchetti)
- Testato server di sviluppo (Vite) - funziona correttamente
- Configurato Git con nome e email corretti
- Inizializzato repository Git locale
- Creato primo commit (16 file, 3717 righe)

## Sessione 4 - 2026-02-05 (PC Windows) - GitHub Setup
- Creato repository habit-tracker su GitHub
- Collegato repository locale a remoto
- Primo push completato
- Creato JOURNEY.md
- Decisione strategica: approccio PM-first

## Sessione 5 - 2026-02-05 (PC Windows) - Product Discovery COMPLETA
- Definita struttura documentale standard
- Web research approfondita (market size, competitor analysis)
- **BREAKTHROUGH:** Habit Weighting come differenziatore unico
- Creato VISION.md completo
- Aggiornato PRD con feature weighting

## Sessione 6 - 2026-02-06 (PC Windows) - BACKLOG & WSJF
- Tentativo Notion MCP (non prioritario)
- Creato framework WSJF per prioritization
- Creato BACKLOG.md con 11 user stories MVP
- Lesson learned: API keys security

## Sessione 7 - 2026-02-06/07 (Mac) - DEVELOPMENT STARTED
- US-005 LocalStorage completata
- US-002 Form creazione abitudine completata
- Creati storage.js, useHabitStore.js, HabitForm.jsx, WeightSelector.jsx
- Fix bug pulsante "-" mancante

## Sessione 8 - 2026-02-07 (Mac) - US-008 + Gamification
- US-008 Streak e cronologia completata
- Creato HabitDetail.jsx con calendario 30 giorni
- Debug tools per testing streak
- Brainstorm US-015 (unità misura) e US-016 (categorie)

## Sessione 9 - 2026-02-07 (Mac) - US-012, US-015, US-017
- Fix CSS type selector
- US-015 Unità di misura completata
- US-012 Edit check-in passati completata
- US-017 Dashboard per data (DayView) completata
- Aggiunta sezione Business Model in VISION.md

## Sessione 10 - 2026-02-08 (Mac) - GIT SETUP & PRIMO PUSH
- Git learning: concetti fondamentali
- GitHub CLI setup su Mac (Homebrew + gh auth login)
- Primo push su GitHub (commit 5811d2f)
- Aggiornate regole Git in claude.md

## Sessione 11 - 2026-02-08 (Mac) - TECHNICAL LITERACY SESSION
- Formazione Git/GitHub
- Architettura React (3 livelli: UI → Logic → Data)
- LocalStorage deep dive
- Aggiornato NOTES.md con appunti
- Discussione file pubblici vs privati

## Sessione 12 - 2026-02-09 (Mac) - US-009, US-016 + Migrazione
- US-009 Ricerca e filtro completata
- US-016 Categorie completata
- Migrazione da .claudecode a claude.md

## Sessione 13 - 2026-02-12 - US-018 + US-019
- US-018 Reportistica settimanale/mensile completata
- US-019 Calendario mensile con reportistica contestuale
- Code review + fix ESLint
- Aggiunte 6 developer user stories al backlog
- Commit 73a08b1 pushato

## Sessione 14 - 2026-02-12 - Ottimizzazione Token Usage
- Ristrutturazione documentazione per efficienza
- Creato CRONOLOGIA.md (questo file)
- Snellito STATO.md
- Aggiornato workflow sync context

## Sessione 15 - 2026-02-12 - US-020 + Deploy + Backlog Split
- Completata US-020 (Report periodi fissi)
- Fix ordine cronologico dropdown (mesi, settimane, anni)
- Deploy su Vercel completato
- **Ottimizzazione backlog:** separato in BACKLOG.md (attive) + BACKLOG_DONE.md (archivio)
  - BACKLOG.md: da ~1200 righe → ~265 righe (-78%)
  - Token risparmiati: ~3500-4000 per lettura
- Aggiornata tutta la documentazione

## Sessione 16 - 2026-02-13 - Developer Tooling
- **US-DEV-004:** Configurazione ESLint + Prettier
  - Prettier configurato (.prettierrc)
  - eslint-config-prettier per evitare conflitti
  - Script npm: format, format:check, lint:fix
  - Formattato tutto il codebase
- **US-DEV-001:** Setup Vitest test framework
  - Vitest + React Testing Library + jsdom
  - Coverage con @vitest/coverage-v8
  - 4 test esempio per generateId() e getTodayDate()
  - Script npm: test, test:watch, test:coverage
- Fix lint warnings (useMemo → useEffect in ReportView)
- **Husky:** pre-commit hooks configurati (lint + test automatici)
- Progresso: 19/27 user stories (70%)

## Sessione 17 - 2026-02-14 - UX Improvements (4 User Stories)
- **US-022: Undo/Annulla Azione** ✅
  - Sistema undo completo con stack (ultime 10 azioni)
  - CTRL+Z / Cmd+Z keyboard shortcut
  - Toast notifications con pulsante "Annulla"
  - Supporta: delete habit, edit habit
  - Nuovi file: useUndoStack.js, Toast.jsx, Toast.css

- **US-024: Pulsante Completa al Massimo** ✅
  - Nuovo pulsante "✓✓" per completare al target in un click
  - Posizionato a sinistra del "+" (primo pulsante)
  - Implementato in Dashboard e DayView
  - Disabilitato quando già al target

- **US-025: Barra di Progresso Trascinabile** ✅
  - Progress bar ora è uno slider interattivo
  - Supporta touch (mobile) e mouse (desktop)
  - Accessibile con aria-labels
  - Solo per abitudini count/duration (boolean mantiene barra normale)

- **US-026: Fix Overflow Pulsante "+"** ✅
  - Bug fix: "+" non permette più di superare il target
  - Pulsante disabilitato quando valore >= target

- **Code Review:** Fix accessibilità (aria-label slider) + timer cleanup toast
- US-023 rimossa (il calcolo peso funzionava già correttamente)
- Progresso: 23/31 user stories (74%)

## Sessione 18 - 2026-02-14 - US-021: Cloud Sync COMPLETATA
- **US-021: Sincronizzazione Cloud con Supabase** ✅
  - Supabase backend (PostgreSQL + RLS)
  - Google OAuth authentication
  - AuthContext per gestione stato auth
  - syncEngine.js: offline-first sync con queue
  - Integrazione completa con useHabitStore
  - Trasformazioni dati camelCase ↔ snake_case
  - UUID validation per category_id
  - Last-write-wins conflict resolution
  - Test multi-device: logout → clear localStorage → login → dati recuperati
- **Bug Fixes:**
  - Fix timestamp → created_at per check_ins
  - Fix category_id non-UUID (default categories)
  - Fix ESLint react-refresh warnings
- **Rename app:** Habit Tracker → **Weighbit**
- Progresso: 24/31 user stories (77%)

## Sessione 19 - 2026-02-15 - Soft Delete + Code Review
- **Rename cartella:** habit-tracker → Weighbit
- **Soft Delete Pattern implementato:**
  - deleteHabit() ora imposta `deletedAt` invece di rimuovere
  - Check-in preservati per storico
  - Nuove funzioni: getActiveHabits(), getHabitsForDate()
  - getWeightedProgressForDate() usa abitudini storiche
  - DayView mostra abitudini che esistevano in quella data
- **Code Review:** Approvata con note minori (timezone edge cases, documentare semantica deletion date)
- **US-V2-006 aggiunta:** Dominio custom (priorità V2)
- **Cleanup file obsoleti:** identificati .claudecode da eliminare

## Sessione 20 - 2026-02-15 - Fix Vercel + Unit Tests
- **Fix Vercel white screen:**
  - Problema: variabili ambiente Supabase mancanti su Vercel
  - Soluzione: configurate VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY su Vercel dashboard
  - Codice reso resiliente: mostra errore chiaro invece di crashare
  - Modificati: supabase.js, AuthContext.jsx, App.jsx, syncEngine.js
- **Fix OAuth redirect:**
  - Problema: redirect a localhost invece di Vercel URL
  - Soluzione: configurato Site URL e Redirect URLs in Supabase dashboard
- **US-DEV-002: Unit Tests** (parziale)
  - Aggiunti 12 nuovi test per funzioni core di storage.js
  - Test totali: 4 → 16
  - Funzioni testate: createHabit, getActiveHabits, getHabitsForDate, getWeightedDailyProgress, getCheckIn
  - Spiegati concetti: pattern AAA (Arrange-Act-Assert), perché i test sono utili
- **Discussione didattica:**
  - Ambienti (dev/staging/prod) - spiegazione concetti
  - Decisione: per progetto portfolio singolo utente, staging è overkill
- **Deploy:** https://habit-tracker-dusky-eight.vercel.app (funzionante)

## Sessione 21 - 2026-02-20 (PC Windows) - US-027 Abitudini Settimanali/Mensili

### Setup macchina Windows
- Prima sessione su PC Windows dopo pausa su Mac
- Fix: `npm install` necessario dopo cambio macchina (binari esbuild non cross-platform)
- Fix Supabase auth redirect: aggiunto `http://localhost:5173` e `http://localhost:5174` in Supabase → Authentication → URL Configuration → Redirect URLs
- Aggiunta nota a claude.md di progetto per non dimenticarlo in futuro

### US-V2-001/002: Abitudini Settimanali e Mensili (implementazione completa)
**Obiettivo:** Permettere abitudini con timeframe settimanale (lun-dom) e mensile (1°-ultimo giorno)

**storage.js:**
- `getWeekBounds(dateStr)`: calcola inizio/fine settimana ISO (lunedì-domenica)
- `getMonthBounds(dateStr)`: calcola inizio/fine mese calendario
- `getPeriodCompletionForHabit(data, habit, date)`: aggregazione per periodo
  - daily → comportamento invariato
  - weekly/monthly boolean → conta i giorni fatti nel periodo
  - weekly/monthly count → somma i valori nel periodo
- `createHabit()`: accetta `timeframe` invece di hardcoded 'daily'
- `migrateData()`: aggiunge timeframe:'daily' a habit esistenti, converte duration→count
- Aggiornati `getHabitCompletionPercent` e `getHabitCompletionPercentForDate` per usare il nuovo sistema

**HabitForm.jsx:**
- Rimosso tipo "Durata" (deprecato) → solo Si/No e Conteggio
- Aggiunto selettore Frequenza: Ogni giorno / Settimanale / Mensile
- Target dinamico in base a tipo+periodo (max 7 per boolean settimanale, max 31 per mensile)
- Label obiettivo adattiva ("volte a settimana", "km al mese", ecc.)

**useHabitStore.js:** aggiunto `getPeriodCompletion` e `getCheckInForDate`

**App.jsx:** badge periodo (sett./mese), testo progress "2/3 questa sett.", Max button period-aware

**DayView.jsx:** visualizzazione e toggle corretti per habit non-daily

**HabitDetail.jsx:** streak solo per daily, info obiettivo con label periodo

**App.css:** `.habit-timeframe-badge` per badge sett./mese

**Commit:** `feat(US-027): abitudini settimanali e mensili` (7 file, +375/-79 righe, 16 test ✅)

---

## Sessione 22 - 2026-02-21 (Mac) - Bug Fix Sync + Aggiornamento Linee Guida

### Decisioni strategiche
- Deciso di fare uno **sprint finale su Weighbit** (UI polish + bug fix) poi passare a nuovo progetto
- La diversità nel portfolio vale più della perfezione su un singolo progetto

### Aggiornamento claude.md globale
- Aggiunta **REGOLA #2 - APPROCCIO DIDATTICO**: obbligo di spiegare ogni codice significativo PRIMA di scriverlo, con formato standard (Concetto / Perché serve / Come funziona / Nel nostro caso)
- Motivazione: l'utente non sa JS e rischiava di "restare indietro" senza capire cosa è stato costruito

### Technical Literacy (parziale - interrotta per bug)
- Spiegati concetti React Context: altoparlante, Provider, Consumer, useContext
- Spiegata sintassi `const [a, b] = useState(null)` (destructuring + funzione che ritorna 2 valori)
- **Da riprendere:** useEffect, AuthContext completo, Supabase, syncEngine, Vercel

### Bug fix: abitudini cancellate che ricompaiono (2 fix)
**Fix 1 - mergeData() in syncEngine.js:**
- Problema: race condition nel merge cloud→locale non rispettava `deletedAt`
- Fix: `mergeData()` ora controlla `localHabitMap` prima di includere habit dal cloud

**Fix 2 (causa reale) - uploadLocalDataToCloud() in syncEngine.js:**
- Problema: al login/sync, `uploadLocalDataToCloud` faceva UPSERT di TUTTE le habits locali (incluse quelle con `deletedAt`), ri-creandole su Supabase dopo il hard delete
- Fix: aggiunto `if (!habit.deletedAt)` prima di `syncHabitToCloud()`
- Commits: `fix: habits cancellate non ricompaiono dopo sync` + `fix: uploadLocalDataToCloud non ri-carica habits soft-deleted`

### Feature: alert nome duplicato
- App.jsx `handleSubmitHabit`: confronto case-insensitive del nome prima di `addHabit()`
- `window.confirm()` → utente può procedere o annullare (form resta aperto)

### Bug scoperto (non risolto): isolamento dati per utente
- Login con account Google diverso → si vedono le abitudini dell'utente precedente
- Causa probabile: al primo login di un nuovo utente, `uploadLocalDataToCloud` carica il localStorage (dell'utente precedente) sul cloud del nuovo utente
- Aggiunta **US-028** (BUG CRITICO, SP=39) e **US-029** (abitudini demo, SP=2.5) al backlog

---

## Sessione [N] - 2026-02-22 (Mac)

### US-028 COMPLETATA: Fix isolamento dati tra utenti (BUG CRITICO)
- **Problema:** `uploadLocalDataToCloud` caricava i dati del browser (appartenenti all'utente precedente) sul cloud del nuovo utente al login
- **Fix:** Aggiunta chiave `weighbit-current-user` in localStorage — al login si confronta con l'userId corrente; se diverso, i dati locali vengono scartati e si scarica solo dal cloud
- **File modificato:** `src/hooks/useHabitStore.js`
  - Rimosso `uploadLocalDataToCloud` e `hasMigratedRef` (logica non più necessaria)
  - Aggiunta logica di confronto userId in `performSync`
- **Commit:** `fix: isolamento dati tra utenti al login (US-028)`

### US-029 COMPLETATA: Abitudini demo per nuovi utenti
- **Implementazione:** Al primo login senza abitudini → creazione automatica di 3 demo
  - Esercizio fisico (boolean, peso 5, verde, cat-health)
  - Lettura (count/30min, peso 4, blu, cat-learning)
  - Meditazione (boolean, peso 3, viola, cat-wellness)
- **Flag:** `weighbit-seeded-{userId}` in localStorage — evita la ricreazione ai login successivi
- **File creato:** `src/utils/seedData.js`
- **File modificato:** `src/hooks/useHabitStore.js`
- **Commit:** `feat: abitudini demo per nuovi utenti al primo login (US-029)`

### Test Vercel (inizio sessione successiva)
- ✅ US-028 e US-029 verificate su Vercel: login nuovo account, cambio account, isolamento dati e abitudini demo funzionano correttamente

---

## Sessione 23 - 2026-02-22 (Mac)

### Slider per abitudini boolean
- Rimossa biforcazione boolean/non-boolean nella progress bar in `App.jsx`
- Slider ora funziona per tutti i tipi, incluse abitudini boolean con target=1 (toggle visivo trascinabile)
- Il pulsante ✓ rimane disponibile come alternativa

### Code Review (agente specializzato)
Lanciato code-reviewer su tutti i file modificati dalla sessione 19 ad oggi. Trovati e corretti 8 bug:

**Critici (dati a rischio):**
- **CRITICO-1** `useHabitStore.js`: race condition cambio utente → cleanup dati locali ora sempre (non solo se habits > 0); `CURRENT_USER_KEY` scritto solo dopo sync riuscito
- **CRITICO-2** `useHabitStore.js`: closure stantia nel listener online → aggiunto `useRef` per accedere ai dati aggiornati senza ricreazione del listener
- **CRITICO-3** `syncEngine.js`: offline queue reinviava operazioni già completate → ora rimuove solo le operazioni riuscite

**Importanti:**
- **IMP-1** `storage.js`: `getWeightedDailyProgress` includeva abitudini soft-deleted → usa `getActiveHabits()`
- **IMP-3** `syncEngine.js`: `deleteHabitFromCloud` mancava guard `isSupabaseConfigured` → aggiunto
- **IMP-4** `HabitForm.jsx`: validazione JS max 9999 per target count
- **IMP-5** `DayView.jsx` + `HabitDetail.jsx`: fix timezone `new Date(date + 'T00:00:00')`

**Minori:**
- `CURRENT_USER_KEY` spostata fuori dall'hook (MIN-1)
- Debug footer nascosto con `import.meta.env.DEV` (MIN-5)
- `key={day.date}` nel calendario invece di `key={i}` (MIN-4)
- Rimossa doppia chiamata `getTodayDate()` in `getPeriodCompletionForHabit` (MIN-2)
- Costante `ASSUMED_TOTAL_WEIGHT` invece di magic number 15 (MIN-3)

**Commit:**
- `fix: bug critici da code review (slider boolean + isolamento utente + progress)` — 6 file
- `fix: restanti fix da code review (closure, offline queue, validation)` — 4 file
- `chore: rimuovi eslint-disable superfluo` — cleanup lint
- **Push:** c550ba3 → main

## Sessione 22 - 2026-03-01 (Mac) - US-013 shadcn/ui Polish

### Setup shadcn/ui
- Installato e configurato Tailwind CSS v4 + shadcn/ui nel progetto
- Aggiunto `components.json`, `jsconfig.json`, `@/` alias in `vite.config.js`
- Creato branch `feature/shadcn`

### Componenti migrati
- **Button**: sostituiti tutti i bottoni shadcn nell'header (🌙, 📊, Reset, + Aggiungi)
- **Input, Badge, Card**: integrati nel design system
- Dark mode: supporto corretto tramite `@custom-variant dark` + `color-scheme`

### Bug fix UI risolti
1. **Bottoni neri in light mode** — Tailwind v4 non generava le utility class di shadcn affidabilmente. Fix: CSS overrides espliciti usando `button[data-slot="button"][data-variant="..."]` attribute selectors
2. **Slider non colorato** — `--progress-percent` su `::webkit-slider-runnable-track` unreliable. Fix: gradient come inline style sulla `.habit-progress` div parent; track trasparente. Poi fix della percentuale: usa `currentValue/sliderMax` (posizione thumb) invece di `completionPercent` (completamento periodo)
3. **✓✓ → ✓** singolo, verde consistente (--color-primary), - rosso (--color-danger), bottoni centrati (flex)
4. **Simmetria habit boolean/numeric** — Boolean ora ha gli stessi 3 pulsanti (✓, +, -): ✓ e + fanno la stessa cosa (checkIn 1), - annulla (checkIn 0); disabilitati secondo stato

### Criteri US-013 rimasti per prossima sessione
- [ ] Form inputs con componenti shadcn (HabitForm)
- [ ] Modal/Dialog con componenti shadcn (overlay delete/reset)

### Commit
- `feat: US-013 shadcn/ui - installazione, componenti, bug fix UI` → branch feature/shadcn

## Sessione 23 - 2026-03-01 (Mac) - US-013 completata + bug fix

### US-013: criteri mancanti completati
- **Label shadcn**: creato `src/components/ui/label.jsx` (wrappa Radix UI Label)
- **Dialog shadcn**: creato `src/components/ui/dialog.jsx` (wrappa Radix UI Dialog)
- **HabitForm**: `<input>` e `<label>` HTML sostituiti con `<Input>` e `<Label>` shadcn
- **App.jsx**: dialog elimina abitudine, reset giornata, HabitDetail migrati a `<Dialog>` shadcn
- **HabitDetail**: rimossi wrapper `div.habit-detail-overlay` e `div.habit-detail-modal` + btn-close; usa Dialog nativo

### Bug fix durante testing
1. **X button gray rectangle**: App.css applicava stili generici `button`. Fix: inline `style={{ background:'none', border:'none' }}` su `DialogPrimitive.Close`
2. **Dialog padding assente (edge-to-edge)**: Tailwind v4 JIT non generava `p-6` su file nuovi. Fix: inline `style={{ padding: '1.5rem' }}` su `DialogPrimitive.Content`
3. **DialogHeader testo sotto X**: `pr-10` Tailwind non applicato. Fix: inline `style={{ paddingRight: '2.5rem' }}` su `DialogHeader`
4. **Report settimanale: % e numero non centrati**: `.reportview-day-percent` aveva `text-align: right`; `.reportview-day-num` mancava di `text-align`. Fix: entrambi → `text-align: center`
5. **Freccia → calendario DayView invisibile**: `btn-close dayview-close` aveva `position: absolute; right:16px` → sovrastava il bottone →. Fix: rimosso `position: absolute`, sostituito con `margin-left: 8px`
6. **Giorno altro-mese selezionato illeggibile**: `opacity: 0.4` (da `.other-month`) + `color: text-secondary` (cascata dopo `.selected`). Fix: aggiunta regola `.other-month.selected { opacity: 1; color: white }`
7. **Timezone bug DayView**: `formatDate` usava `toISOString()` → UTC shift di -1 giorno in CET (UTC+1). Feb 28 → "2026-02-27", erroneamente selezionato. Fix: uso metodi locali `getFullYear/getMonth/getDate` + `padStart`
8. **`onClose` unused in HabitDetail**: rimosso dalla prop destructuring (causava lint error nel pre-commit hook)

### Commit e push
- `feat: US-013 completa - polish UI shadcn + fix bug calendario e dialog` — 7 file, branch feature/shadcn
- Push: 14489e9 → feature/shadcn

### Prossimi step
- Merge feature/shadcn → main (deploy Vercel)
- US-V2-003: Dashboard punteggio multi-timeframe

---

## Sessione 24 - 2026-03-02 (Mac) - Pre-merge QA + UI fix + US-V2-007

### Pre-merge QA (agenti paralleli)
- **test-runner**: 16/16 test ✅ — nessuna regressione
- **code-reviewer**: REQUEST CHANGES — trovati 2 critici + 9 warning + 4 suggerimenti

### 15 fix da code review (commit: `fix: 15 issue da code review pre-merge`)
1. `periodInfo?.currentValue ?? 0` — 4 occorrenze in App.jsx (guard null per weekly/monthly)
2. `id="habit-target-boolean/count"` — ID duplicati nel form corretti
3. Inline styles in dialog.jsx → `p-6` e `pr-10` spostati in `cn()` (Tailwind sovrascrivibile)
4. Boolean toggle in HabitDetail: rimosso `onCheckIn` immediato, aggiunto flusso Salva/Annulla
5. `parseInt(e.target.value, 10)` — radice esplicita in HabitDetail
6. `PROGRESS_THRESHOLD_HIGH/MED` constants + CSS vars in DayView (magic numbers rimossi)
7. Timezone fix in DayView: `new Date(day.date + 'T00:00:00').getDate()` (linea 303)
8. `window.confirm` → shadcn Dialog con stati `showDuplicateConfirm/pendingDuplicateData` in App.jsx
9. `ASSUMED_TOTAL_WEIGHT` rimosso → `weightLabel` stringa qualitativa in HabitForm
10. `.filters-bar` CSS aggiunto in App.css
11. `label-hint` spostato fuori da `<Label>` in HabitForm
12. Indentazione corretta in HabitDetail
13. `<DialogTitle className="sr-only">` aggiunto per accessibilità Dialog HabitDetail
14. `.btn-clear-filter` CSS aggiunto in App.css
15. `WEEK_DAYS`: `['L', 'M', 'M', ...]` → `['L', 'Ma', 'Me', ...]` (disambiguati Martedì/Mercoledì)

### UI bug fix post-review
- **Streak badge wrapping**: `🔥 1` andava a capo su due righe → `white-space: nowrap` su `.habit-streak`
- **Streak badge riposizionato**: spostato da `.habit-name-row` (accanto al nome) a `.habit-meta` (accanto alle stelle del peso) — evita compressione su nomi lunghi
- **Slider thumb disallineato**: `margin-top: 2px` su `::-webkit-slider-thumb` spostava il cerchio 2px verso il basso rispetto al track — rimosso

### Nuova US: import dati
- **US-V2-007** aggiunta al backlog: Import dati da altre piattaforme (SP=6.4, Should Have V2)
  - Motivazione: ridurre friction di switching per utenti con storico in altre app
  - Fasi: 1) CSV generico con field mapping, 2) JSON interno (backup/restore), 3) app specifica (TBD)
  - Open question: quale app usa attualmente l'utente? Dipende dall'export disponibile

### Chiusura sessione
- Merge feature/shadcn → main
- Deploy Vercel aggiornato

---

## Sessione 25 - 2026-03-02 (Mac)

### Fix label DayView
- **Problema:** MiniProgressCard in DayView mostrava ancora "Settimana" e "Mese" (label ambigue, potrebbero confondersi con settimana/mese di calendario)
- **Fix:** Allineate a ReportCards → "Ultimi 7 gg" e "Ultimi 30 gg"
- Commit + push su main

### Chiarimenti
- **Pallini colorati in DayView:** sono il colore dell'abitudine (scelto dall'utente nel form). Abitudini senza colore non mostrano nulla (div trasparente). Stessa cosa della dashboard principale.

### Chiusura sessione
- Tutto committato e pushato su main
- Nessuna US nuova completata (solo fix label)

---

> Sessioni 26 in poi: vedi [CRONOLOGIA.md](./CRONOLOGIA.md)
