# Product Backlog - User Stories Completate

> **Archivio:** User stories completate dal backlog principale
> **Ultima migrazione:** 2026-03-02

---

## Legenda

- **SP:** Story Points (WSJF)
- **Framework:** WSJF (Weighted Shortest Job First)
- **Formula:** `Story Points = (Business Value × Time Criticality × RROE) / Job Size`

---

## V2 Features (Completate - 2026-03-02)

### US-V2-003: Dashboard Punteggio Multi-Timeframe
**Priority:** V2 Should Have — **COMPLETATA 2026-03-02**
- Seconda riga nel dashboard principale (sotto le 3 card esistenti)
- Mostra un punteggio separato per tipo di frequenza: Giornaliere / Settimanali / Mensili
- Visibile SOLO quando l'utente ha abitudini di frequenza mista (≥1 weekly o monthly)
- Calcolo: media pesata dei `getPeriodCompletion` del periodo corrente per ogni gruppo
- Ogni mini-card: icona, label, %, barra progress colorata, conteggio abitudini
- Zero nuovi file: esteso `ReportCards.jsx` + `useMemo` in App.jsx + CSS in App.css

### US-V2-004: Vista Heatmap Completamento
**Priority:** V2 Should Have — **COMPLETATA 2026-03-02**
- Vista modale (overlay) accessibile dall'header con bottone 🟩
- Heatmap **per abitudine** (non aggregata) con 3 timeframe: Mensile / Trimestrale / Annuale
- **Mensile:** griglia calendario 7 colonne con numeri di giorno e colori (verde/giallo/rosso)
- **Trimestrale:** 3 mini-calendari compatti affiancati
- **Annuale:** layout stile GitHub (52-53 colonne × 7 righe), orizzontalmente scrollabile
- Navigazione avanti/indietro tra periodi (frecce); periodo futuro disabilitato
- Colori: ≥70% verde, 40-69% giallo, <40% rosso; grigio = nessun dato; tratteggiato = futuro
- Click su cella → apre DayView per quella data + chiude heatmap
- Per abitudini settimanali/mensili: mostra completamento dell'intero periodo (stessa % per tutti i giorni della settimana/mese)
- Media del periodo visualizzata per ogni abitudine
- Zero modifiche a storage.js e useHabitStore.js (usa `getPeriodCompletion` già esistente)
- Nuovi file: `HeatmapView.jsx`, `HeatmapView.css` (~6 righe in `App.jsx`)

---

## Bug Fix & UX (Completate - 2026-02-22)

### US-028: Fix isolamento dati per utente
**Priority:** Must Have (SP: 39.0) — **COMPLETATA 2026-02-22**
- Aggiunta chiave `weighbit-current-user` in localStorage per tracciare il proprietario dei dati
- Al login, se l'userId salvato ≠ userId corrente → dati locali scartati, download solo dal cloud
- Rimossa logica `uploadLocalDataToCloud` + `hasMigratedRef` (non più necessari)
- File: `src/hooks/useHabitStore.js`

### US-029: Abitudini demo per nuovi utenti
**Priority:** Could Have (SP: 2.5) — **COMPLETATA 2026-02-22**
- Al primo login senza abitudini → creazione automatica di 3 demo (Esercizio fisico, Lettura, Meditazione)
- Tipi e pesi diversi per mostrare le feature principali di Weighbit
- Flag `weighbit-seeded-{userId}` in localStorage evita la ricreazione ai login successivi
- File: `src/utils/seedData.js` (nuovo), `src/hooks/useHabitStore.js`

---

## Must Have (Completate)

### US-001: Dashboard con progresso pesato giornaliero
**Priority:** Must Have (SP: 13.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha assegnato pesi diversi alle abitudini
- **When**: apro l'app ogni giorno
- **In**: homepage (vista principale)
- **Since**: voglio vedere a colpo d'occhio quanto sto rispettando le mie priorità reali
- **I want to**: visualizzare una dashboard con percentuale di completamento giornaliero pesata
- **Doing this/in this way**: mostrando "Progresso Giornaliero: X%" in alto
- **To/So that**: mi senta più gratificato quando completo abitudini importanti

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=5, JS=3 → SP=13.3

---

### US-002: Creare abitudine con campo "peso/importanza"
**Priority:** Must Have (SP: 10.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole dare priorità diverse alle abitudini
- **When**: voglio aggiungere una nuova abitudine al tracker
- **In**: schermata "Aggiungi Abitudine"
- **Since**: non tutte le abitudini hanno la stessa importanza
- **I want to**: assegnare un peso/importanza da 1 a 5 all'abitudine
- **Doing this/in this way**: tramite selettore visuale (stelle)

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=5, JS=3 → SP=10.7

---

### US-003: CRUD abitudine - Visualizzare lista abitudini
**Priority:** Must Have (SP: 8.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con abitudini già create
- **When**: apro l'app
- **In**: homepage sotto la dashboard
- **Since**: devo vedere tutte le mie abitudini per poter interagire
- **I want to**: visualizzare una lista chiara e organizzata delle mie abitudini

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=2 → SP=8.0

---

### US-004: Check-in abitudine - Multiple input modes
**Priority:** Must Have (SP: 6.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha completato un'abitudine
- **When**: voglio registrare il mio progresso giornaliero
- **In**: card abitudine nella lista
- **Since**: diverse abitudini richiedono modi diversi di tracciare
- **I want to**: scegliere tra diversi modi di check-in (checkbox, +/-)

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=2.4 → SP=6.7

---

### US-005: LocalStorage persistence
**Priority:** Must Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che usa l'app regolarmente
- **When**: chiudo e riapro il browser
- **In**: qualsiasi momento
- **Since**: non voglio perdere i miei dati
- **I want to**: che l'app salvi automaticamente in localStorage

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=3 → SP=5.3

---

### US-021: Sincronizzazione Cloud (Backend)
**Priority:** Must Have (SP: 8.0) — **COMPLETATA** (2026-02-14)

**User Story (Extended Format):**
- **As a**: utente che usa l'app da più dispositivi (iPhone, Mac, PC)
- **When**: registro un'abitudine dal telefono
- **In**: qualsiasi dispositivo
- **Since**: uso l'app principalmente da mobile ma anche da desktop
- **I want to**: che le mie abitudini siano sincronizzate automaticamente su tutti i dispositivi
- **Doing this/in this way**: backend cloud (Supabase) con autenticazione e database PostgreSQL
- **To/So that**: possa usare l'app ovunque senza perdere dati

**Acceptance Criteria:** Tutti completati
- [x] Login/registrazione utente (Google OAuth)
- [x] Dati salvati su cloud (Supabase PostgreSQL)
- [x] Sincronizzazione automatica al login
- [x] Offline support: funziona offline e sincronizza quando torna online
- [x] Migrazione dati esistenti da localStorage a cloud (primo login)
- [x] Logout che mantiene dati sul cloud
- [x] Privacy: dati visibili solo all'utente proprietario (RLS)

**Implementazione Tecnica:**
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Auth:** Google OAuth via Supabase Auth
- **Architettura:** Offline-first con localStorage come cache
- **Sync Strategy:** Last-write-wins con `updated_at` timestamp
- **Nuovi file:** AuthContext.jsx, syncEngine.js, LoginButton.jsx, UserMenu.jsx, supabase.js

**WSJF:** BV=13, TC=3, RROE=5, JS=8 → SP=8.0

---

## Should Have (Completate)

### US-006: CRUD abitudine - Modificare abitudine esistente
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con abitudini già create
- **When**: voglio cambiare configurazione o priorità
- **In**: card abitudine (click su icona edit)
- **Since**: le mie priorità possono cambiare
- **I want to**: modificare qualsiasi campo dell'abitudine

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=3 → SP=5.3

---

### US-007: CRUD abitudine - Eliminare abitudine
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con abitudini non più rilevanti
- **When**: voglio ripulire la lista
- **In**: card abitudine (menu delete)
- **Since**: alcune abitudini potrebbero non servirmi più
- **I want to**: eliminare definitivamente un'abitudine

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=3 → SP=5.3

---

### US-008: Visualizzare streak e cronologia abitudine
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente motivato dai progressi
- **When**: voglio vedere quanto sono stato costante
- **In**: dettaglio abitudine
- **Since**: vedere lo streak mi motiva
- **I want to**: visualizzare giorni consecutivi + mini-calendario

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=5 → SP=4.0

---

### US-015: Unità di misura personalizzabili
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che traccia abitudini con metriche diverse
- **When**: creo un'abitudine di tipo count/duration
- **In**: form di creazione
- **Since**: "3" non significa nulla senza contesto
- **I want to**: specificare l'unità di misura (minuti, litri, km, etc.)

**Acceptance Criteria:** Tutti completati (tranne custom units - V2)
**WSJF:** BV=5, TC=2, RROE=1, JS=3 → SP=4.0

---

### US-016: Categorie personalizzate per abitudini
**Priority:** Should Have (SP: 3.5) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole organizzare le abitudini per area di vita
- **When**: ho molte abitudini da raggruppare
- **In**: form di creazione + lista
- **Since**: le abitudini appartengono a diverse aree
- **I want to**: creare categorie e assegnare abitudini

**Categorie Preset:** Salute, Produttività, Finanze, Relazioni, Apprendimento, Benessere, Casa, Hobby

**Acceptance Criteria:** Tutti completati (CRUD categorie - V2)
**WSJF:** BV=5, TC=1, RROE=2, JS=3 → SP=3.5

---

### US-017: Dashboard per data (Day View)
**Priority:** Should Have (SP: 3.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole gestire abitudini di un giorno specifico
- **When**: clicco sulla data nell'header
- **In**: qualsiasi momento
- **Since**: voglio vedere/modificare tutte le abitudini di un giorno
- **I want to**: aprire una vista dedicata con navigazione tra giorni

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=5, TC=2, RROE=1, JS=3 → SP=3.3

---

### US-018: Reportistica settimanale e mensile
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole capire i propri trend nel tempo
- **When**: voglio valutare la costanza oltre il singolo giorno
- **In**: dashboard principale
- **Since**: vedere solo il punteggio giornaliero non mi dice se miglioro
- **I want to**: visualizzare progresso pesato per settimana e mese

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=8, TC=2, RROE=1, JS=3 → SP=5.3

---

### US-019: Calendario mensile con reportistica contestuale
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole navigare e analizzare progressi nel tempo
- **When**: clicco sulla data o apro DayView
- **In**: modale DayView
- **Since**: voglio vedere contesto settimanale e mensile di ogni data
- **I want to**: calendario mensile completo + 3 card progresso contestuali

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=5, TC=2, RROE=2, JS=3 → SP=5.3

---

### US-020: Vista Report per Periodi Specifici
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole analizzare performance in periodi definiti
- **When**: voglio vedere come sono andato a Gennaio, o la settimana scorsa
- **In**: sezione Report dedicata (modal 📊)
- **Since**: DayView mostra ultimi 7/30 giorni relativi, ma voglio periodi fissi
- **I want to**: selezionare mese o settimana specifica e vedere progresso pesato

**Differenza con DayView:**
- DayView: "ultimi 7/30 giorni dalla data selezionata"
- ReportView: "periodo fisso" (mese 1-31, settimana Lun-Dom)

**Acceptance Criteria:** Tutti completati (confronto periodi - V2)
**WSJF:** BV=6, TC=2, RROE=1, JS=3 → SP=4.0

---

## Could Have (Completate)

### US-009: Filtra e ricerca abitudini
**Priority:** Could Have (SP: 2.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con molte abitudini (20+)
- **When**: la lista diventa lunga
- **In**: homepage sopra la lista
- **Since**: voglio trovare velocemente un'abitudine
- **I want to**: search bar per cercare per nome

**Acceptance Criteria:** Search implementata (filtri avanzati - V2)
**WSJF:** BV=3, TC=1, RROE=1, JS=5 → SP=2.0

---

### US-010: Dark mode / Tema UI
**Priority:** Could Have (SP: 1.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che usa l'app di sera/notte
- **When**: la UI chiara mi affatica gli occhi
- **In**: header (toggle)
- **Since**: voglio usare l'app comodamente a qualsiasi ora
- **I want to**: attivare modalità dark con toggle

**Acceptance Criteria:** Tutti completati
**WSJF:** BV=5, TC=1, RROE=1, JS=3 → SP=1.7

---

### US-012: Recuperare/modificare check-in giorni passati
**Priority:** Could Have (SP: 2.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha dimenticato di registrare
- **When**: mi accorgo che ieri ho fatto l'abitudine ma non l'ho segnata
- **In**: vista dettaglio o calendario
- **Since**: a volte dimentico di fare check-in
- **I want to**: navigare ai giorni passati e modificare retroattivamente

**Acceptance Criteria:** Tutti completati (audit trail - V2)
**WSJF:** BV=5, TC=1, RROE=2, JS=3 → SP=2.7

---

## Developer Stories (Completate)

### US-DEV-002: Unit Tests per Storage Functions ✅ (2026-03-02)
**Priority:** Should Have (SP: 3.0)

**Acceptance Criteria completati:**
- [x] Test per `getWeightedProgressForDate()` — 6 test (zero habits, no check-ins, hasData flag, weighted calc, 100%, partial count)
- [x] Test per `getPeriodProgressForDate()` — testata indirettamente via `getWeeklyProgressForDate` e `getMonthlyProgressForDate` (funzione privata, non esportata)
- [x] Test per `getMonthDates()` e `getWeekDates()` (sostituti di `getCalendarDays` che non esiste in storage.js) — 7 test
- [x] Test per edge cases (leap year febbraio, settimana cross-mese, abitudini parziali)
- [x] 17 nuovi test aggiunti, totale storage.test.js: 33 test ✅

**WSJF:** BV=5, TC=2, RROE=1, JS=3 → SP=3.0

---

### US-DEV-003: Component Tests per UI Critica ✅ (2026-03-02)
**Priority:** Could Have (SP: 2.0)

**Acceptance Criteria completati:**
- [x] Test per ReportCards — 5 test (titoli, percentuali, subtitle today, weekly/monthly, zero%)
- [x] Test per HabitForm — 10 test (create mode: title, submit text, empty error, no onSubmit, valid submit, onCancel; edit mode: title, submit text, prefill, updated name)
- [x] Test per DayView — 7 test (month/year header, formatted date, habit names, weekday labels, onClose, previous month nav, next month nav)
- [x] Test per interazioni click/input — fireEvent su pulsanti close, navigazione mese, form submit

**Note tecniche:**
- Pattern `makeProps()` factory per DayView (tutti i prop via prop, nessun context)
- `getAllByText` invece di `getByText` per testo che appare in più elementi DOM
- Import come named export: `{ DayView }`, `{ HabitForm }`, default per `ReportCards`
- 22 nuovi test totali (3 file nuovi), tutti ✅

**WSJF:** BV=4, TC=1, RROE=1, JS=4 → SP=2.0

---

### US-DEV-001: Setup Test Framework (Vitest)
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**Acceptance Criteria:** Tutti completati
- [x] Vitest configurato nel progetto
- [x] React Testing Library installata
- [x] Script `npm test` funzionante
- [x] Script `npm run test:watch` per development
- [x] Almeno 1 test di esempio (4 test per generateId/getTodayDate)
- [x] Coverage report configurato

**WSJF:** BV=6, TC=3, RROE=2, JS=3 → SP=4.0

---

### US-DEV-004: ESLint + Prettier Configuration
**Priority:** Could Have (SP: 2.5) — **COMPLETATA**

**Acceptance Criteria:** Tutti completati
- [x] ESLint configurato con plugin React
- [x] Prettier configurato
- [x] Script `npm run lint` funzionante
- [x] Integrazione con eslint-config-prettier
- [x] Nessun warning nel codebase attuale

**WSJF:** BV=4, TC=2, RROE=1, JS=2 → SP=2.5

---

## UX Improvements (Sessione 17 - 2026-02-14)

### US-022: Undo/Annulla Azione
**Priority:** Must Have (SP: 10.0) — **COMPLETATA**

**Implementazione:**
- Sistema undo completo con stack (ultime 10 azioni)
- CTRL+Z / Cmd+Z keyboard shortcut
- Toast notifications con pulsante "Annulla"
- Supporta: delete habit, edit habit
- Nuovi file: useUndoStack.js, Toast.jsx, Toast.css

---

### US-024: Pulsante "Completa al Massimo"
**Priority:** Must Have (SP: 8.0) — **COMPLETATA**

**Implementazione:**
- Pulsante "✓✓" per completare al target in un click
- Posizionato a sinistra del "+" (primo pulsante)
- Implementato in Dashboard e DayView
- Disabilitato quando già al target

---

### US-025: Barra di Progresso Trascinabile (Slider)
**Priority:** Should Have (SP: 5.0) — **COMPLETATA**

**Implementazione:**
- Progress bar ora è uno slider interattivo
- Supporta touch (mobile) e mouse (desktop)
- Accessibile con aria-labels
- Solo per abitudini count/duration

---

### US-026: Fix Overflow Pulsante "+" (Bug)
**Priority:** Must Have (SP: 3.0) — **COMPLETATA**

**Implementazione:**
- "+" non permette più di superare il target
- Pulsante disabilitato quando valore >= target
- Stesso comportamento in Dashboard e DayView

---

## Summary

**Total Completate:** 31 User Stories (27 funzionali + 4 developer)
- Must Have: 9 (US-001 → US-005, US-021, US-022, US-024, US-026)
- Should Have: 11 funzionali + 1 dev (US-DEV-001)
- Could Have: 3 funzionali + 1 dev (US-DEV-004)

**MVP Core + Report + UX + Cloud Sync: COMPLETATO**
**Developer Tooling: ESLint/Prettier + Vitest**

---

> **Nota:** Questo file è un archivio. Per le user stories attive, vedere [BACKLOG.md](./BACKLOG.md)

---

## US-V2-001: Supporto Abitudini Settimanali ✅ (2026-02-20)

**Priority:** V2 → anticipata
**Effort:** L
**WSJF:** Alto (richiesta utente, completa il sistema di habit tracking)

**User Story:**
- **As a**: utente che vuole tracciare abitudini periodiche
- **I want to**: creare abitudini con target settimanale (es. "Correre 3 volte a settimana")
- **So that**: il tracciamento rifletta la mia frequenza reale, non quotidiana

**Acceptance Criteria:**
- [x] Selettore Frequenza nel form (Ogni giorno / Settimanale / Mensile)
- [x] Settimana = lunedì-domenica (ISO week), reset automatico ogni lunedì
- [x] Boolean settimanale: conta i giorni fatti nella settimana vs target (max 7)
- [x] Conteggio settimanale: somma valori nella settimana vs target
- [x] Progress card mostra "2/3 questa sett." o "5/15 km questa sett."
- [x] Badge "sett." sulla card
- [x] Peso e formula progresso invariati

---

## US-V2-002: Supporto Abitudini Mensili ✅ (2026-02-20)

**Priority:** V2 → anticipata
**Effort:** M (implementato insieme a US-V2-001)

**User Story:**
- **As a**: utente che vuole tracciare abitudini mensili
- **I want to**: creare abitudini con target mensile (es. "Leggere 4 libri al mese")
- **So that**: possa tracciare obiettivi su scala mensile

**Acceptance Criteria:**
- [x] Mese = 1° giorno → ultimo giorno del mese, reset automatico ogni 1°
- [x] Boolean mensile: conta i giorni fatti nel mese vs target (max 31)
- [x] Conteggio mensile: somma valori nel mese vs target
- [x] Progress card mostra "2/4 questo mese" o "10/50 km questo mese"
- [x] Badge "mese" sulla card
- [x] Migration: habit esistenti mantengono timeframe:'daily'
- [x] Migration: type:'duration' convertito in 'count' automaticamente

---

## Polish UI con shadcn/ui (Sessioni 2026-03-01)

### US-013: Polish UI con shadcn/ui ✅ (2026-03-01)

**Priority:** Should Have (SP: 4.0)

**User Story:**
- **As a**: utente che vuole un'esperienza visiva moderna
- **I want to**: vedere un'interfaccia moderna con componenti shadcn/ui
- **So that**: l'app abbia un aspetto professionale

**Acceptance Criteria:**
- [x] Installato e configurato shadcn/ui (Tailwind v4 + radix-ui)
- [x] Buttons sostituiti con componenti shadcn
- [x] Cards (habit cards) con design shadcn
- [x] Form inputs con componenti shadcn (Label + Input in HabitForm)
- [x] Modal/Dialog con componenti shadcn (elimina, reset, HabitDetail)
- [x] Dark mode support (gratis con shadcn)

**Bug Fix extra inclusi:**
- Fix X button dialog (override App.css con inline style)
- Fix padding dialog (inline style bypass Tailwind v4 JIT)
- Fix allineamento report settimanale (text-align center su num e %)
- Fix freccia → calendario DayView (rimossa position:absolute dalla X)
- Fix giorno altro-mese selezionato (opacity:1 + color:white)
- Fix timezone bug DayView (formatDate usa metodi locali invece di toISOString)

**WSJF:** BV=5, TC=1, RROE=2, JS=3 → SP=4.0
