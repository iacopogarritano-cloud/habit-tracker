# Product Backlog - Habit Tracker MVP

> **Framework:** WSJF (Weighted Shortest Job First)
> **Last Updated:** 2026-02-12
> **MVP Target:** Q1 2026

---

## Prioritization Framework: WSJF

**Formula:**
```
Story Points = (Business Value × Time Criticality × RROE) / Job Size
```

**Valori (Fibonacci):**
- **Business Value (BV)**: Impatto per l'utente (1, 2, 3, 5, 8, 13)
- **Time Criticality (TC)**: Urgenza/dipendenze (default: 1)
- **RROE**: Risk Reduction / Opportunity Enabling (default: 1)
- **Job Size (JS)**: Effort stimato (1=XS, 2=S, 3=M, 5=L, 8=XL, 13=XXL)

**MoSCoW Derivato:**
- SP ≥ 8 → Must Have
- SP 3-7 → Should Have
- SP 1-2 → Could Have
- SP < 1 → Won't Have

---

## User Stories Attive

### US-022: Undo/Annulla Azione
**Priority:** Must Have (SP: 10.0)

**User Story (Extended Format):**
- **As a**: utente che usa l'app quotidianamente
- **When**: cancello per sbaglio un'abitudine o modifico qualcosa erroneamente
- **In**: qualsiasi schermata dell'app
- **Since**: gli errori capitano e perdere dati configurati è frustrante
- **I want to**: poter annullare l'ultima azione (CTRL+Z o pulsante)
- **To/So that**: non perda per sempre abitudini o check-in inseriti per errore

**Acceptance Criteria:**
- [ ] CTRL+Z (o Cmd+Z su Mac) annulla l'ultima azione distruttiva
- [ ] Toast notification con pulsante "Annulla" dopo azioni distruttive (delete, modifica)
- [ ] Storico undo per almeno l'ultima azione (opzionale: ultime 5 azioni)
- [ ] Azioni coperte: eliminazione abitudine, eliminazione check-in, modifica abitudine
- [ ] Feedback visivo chiaro quando l'undo ha successo

**Technical Notes:**
- Implementare pattern Command/Memento per storico azioni
- Salvare snapshot prima di ogni azione distruttiva
- Toast con auto-dismiss dopo ~5 secondi + pulsante "Annulla"
- Keyboard listener globale per CTRL/Cmd+Z

**WSJF:** BV=8, TC=5, RROE=2, JS=3 → SP=10.0

---

### US-024: Pulsante "Completa al Massimo"
**Priority:** Must Have (SP: 8.0)

**User Story (Extended Format):**
- **As a**: utente che traccia abitudini con target alto (es. 7h sonno, 30 min studio)
- **When**: voglio segnare un'abitudine come completata
- **In**: dashboard principale e DayView
- **Since**: premere "+" 30 volte per 30 minuti di studio è impraticabile
- **I want to**: un pulsante che completa l'abitudine al target in un click
- **To/So that**: possa tracciare velocemente senza frustrazione

**Acceptance Criteria:**
- [ ] Nuovo pulsante "✓✓" accanto a +/- per abitudini count/duration
- [ ] Click → setta valore al target dell'abitudine
- [ ] Se già al massimo, il pulsante è disabilitato
- [ ] Presente sia in dashboard che in DayView
- [ ] Posizione: PRIMA del "+" (a sinistra, primo pulsante)

**Technical Notes:**
- Aggiungere `handleCompleteMax(habitId, target)` in App.jsx
- Nuovo pulsante con classe `.btn-complete-max`
- Disabilitato se `currentValue >= target`

**WSJF:** BV=8, TC=5, RROE=2, JS=2 → SP=8.0

---

### US-025: Barra di Progresso Trascinabile (Slider)
**Priority:** Should Have (SP: 5.0)

**User Story (Extended Format):**
- **As a**: utente mobile che vuole un input più intuitivo
- **When**: voglio settare un valore specifico (es. ho dormito 6h su 7)
- **In**: dashboard principale
- **Since**: il touch è più naturale di premere bottoni multipli
- **I want to**: trascinare la barra di progresso per settare il valore
- **To/So that**: possa inserire valori parziali con un gesto fluido

**Acceptance Criteria:**
- [ ] Progress bar trascinabile con touch/mouse
- [ ] Valore si aggiorna in tempo reale durante il drag
- [ ] Funziona su mobile (touch) e desktop (mouse)
- [ ] Non interferisce con click sulla card (che apre dettaglio)
- [ ] Step discreti (numeri interi, non decimali)

**Technical Notes:**
- Usare `<input type="range">` stilizzato come progress bar
- `stopPropagation()` per evitare apertura modal
- CSS custom per thumb e track

**WSJF:** BV=5, TC=3, RROE=2, JS=3 → SP=5.0

---

### US-026: Fix Overflow Pulsante "+" (Bug)
**Priority:** Must Have (SP: 3.0)

**Problema:** Il pulsante "+" permette di andare oltre il target (es. 8h su 7h target)

**Soluzione:** Disabilitare "+" quando `currentValue >= target`

**Acceptance Criteria:**
- [ ] Pulsante "+" disabilitato quando valore >= target
- [ ] Stesso comportamento in dashboard e DayView
- [ ] Visivamente grigio/opaco come il "-" quando disabilitato

**Technical Notes:**
- Aggiungere `disabled={currentValue >= habit.target}` al pulsante "+"
- Riutilizzare stile `.btn-decrement:disabled`

**WSJF:** BV=5, TC=5, RROE=1, JS=1 → SP=3.0

---

### US-021: Sincronizzazione Cloud (Backend)
**Priority:** Must Have (SP: 8.0)

**User Story (Extended Format):**
- **As a**: utente che usa l'app da più dispositivi (iPhone, Mac, PC)
- **When**: registro un'abitudine dal telefono
- **In**: qualsiasi dispositivo
- **Since**: uso l'app principalmente da mobile ma anche da desktop
- **I want to**: che le mie abitudini siano sincronizzate automaticamente su tutti i dispositivi
- **Doing this/in this way**: backend cloud (Firebase/Supabase) con autenticazione e database real-time
- **To/So that**: possa usare l'app ovunque senza perdere dati

**Acceptance Criteria:**
- [ ] Login/registrazione utente (Google OAuth consigliato)
- [ ] Dati salvati su cloud invece di localStorage
- [ ] Sincronizzazione real-time o near-real-time
- [ ] Offline support: funziona offline e sincronizza quando torna online
- [ ] Migrazione dati esistenti da localStorage a cloud
- [ ] Logout che mantiene dati sul cloud
- [ ] Privacy: dati visibili solo all'utente proprietario

**Opzioni Tecniche:**

| Opzione | Pro | Contro | Costo |
|---------|-----|--------|-------|
| **Firebase** | Docs eccellenti, Google login facile | Vendor lock-in | Free tier generoso |
| **Supabase** | Open source, PostgreSQL | Meno maturo | Free tier generoso |
| **Custom backend** | Controllo totale | Molto più lavoro | Dipende |

**Raccomandazione:** Firebase per semplicità, o Supabase se preferisci open source.

**Technical Notes:**
- Autenticazione: Firebase Auth o Supabase Auth
- Database: Firestore (Firebase) o PostgreSQL (Supabase)
- Refactor: sostituire chiamate localStorage con chiamate API/SDK
- Offline: service worker + IndexedDB per cache locale

**Impatto:** Questa feature sblocca l'**adozione reale** dell'app.

**WSJF:** BV=13, TC=3, RROE=5, JS=8 → SP=8.0

---

### US-013: Polish UI con shadcn/ui
**Priority:** Should Have (SP: 4.0)

**User Story (Extended Format):**
- **As a**: utente che vuole un'esperienza visiva moderna
- **When**: uso l'app quotidianamente
- **In**: tutte le schermate
- **Since**: un design curato aumenta la percezione di qualità
- **I want to**: vedere un'interfaccia moderna con componenti shadcn/ui
- **To/So that**: l'app abbia un aspetto professionale

**Acceptance Criteria:**
- [ ] Installato e configurato shadcn/ui
- [ ] Buttons sostituiti con componenti shadcn
- [ ] Cards (habit cards) con design shadcn
- [ ] Form inputs con componenti shadcn
- [ ] Modal/Dialog con componenti shadcn
- [ ] Dark mode support (gratis con shadcn)

**Technical Notes:**
- Richiede Tailwind CSS come dipendenza
- shadcn/ui è copy-paste, non npm install
- Componenti prioritari: Button, Card, Input, Label, Dialog, Progress

**WSJF:** BV=5, TC=1, RROE=2, JS=3 → SP=4.0

---

### US-011: Esporta dati in JSON/CSV
**Priority:** Won't Have (SP: 0.8)

**User Story:** Utente power user che vuole fare backup o analisi esterne.

**Acceptance Criteria:**
- [ ] Bottone "Esporta dati" in settings
- [ ] Opzioni: JSON (completo) o CSV (per Excel)
- [ ] Nome file: `habit-tracker-export-YYYY-MM-DD.json`

**Decision:** Won't Have per MVP. Valutare in V2 se c'è demand.

---

### US-014: Design custom da template Figma
**Priority:** Won't Have (SP: 0.5)

**User Story:** Design distintivo pixel-perfect da template Figma.

**Decision:** Won't Have per MVP. Usare shadcn/ui invece.

---

## Developer Stories

### US-DEV-002: Unit Tests per Storage Functions
**Priority:** Should Have (SP: 3.0)
**Target:** Developer
**Depends on:** US-DEV-001

**Acceptance Criteria:**
- [ ] Test per `getWeightedProgressForDate()`
- [ ] Test per `getPeriodProgressForDate()`
- [ ] Test per `getCalendarDays()`
- [ ] Test per edge cases
- [ ] Coverage >= 80% per storage.js

**WSJF:** BV=5, TC=2, RROE=1, JS=3 → SP=3.0

---

### US-DEV-003: Component Tests per UI Critica
**Priority:** Could Have (SP: 2.0)
**Target:** Developer
**Depends on:** US-DEV-001

**Acceptance Criteria:**
- [ ] Test per DayView
- [ ] Test per HabitForm
- [ ] Test per ReportCards
- [ ] Test per interazioni click/input

**WSJF:** BV=4, TC=1, RROE=1, JS=4 → SP=2.0

---

### US-DEV-005: CI/CD Pipeline (GitHub Actions)
**Priority:** Won't Have (V2)
**Target:** Developer

**Decision:** Won't Have per MVP. Implementare quando va in produzione.

---

### US-DEV-006: Error Boundaries React
**Priority:** Won't Have (V2)
**Target:** Developer

**Decision:** Won't Have per MVP. L'app è stabile.

---

## V2 Roadmap - Multi-Timeframe

> **Note:** Out-of-scope per MVP.

### Sistema Multi-Timeframe (V2)
Supportare abitudini giornaliere, settimanali e mensili con punteggio unificato.

**User Stories V2:**
- US-V2-001: Supporto abitudini settimanali
- US-V2-002: Supporto abitudini mensili
- US-V2-003: Dashboard punteggio multi-timeframe
- US-V2-004: Vista heatmap completamento (stile GitHub)

---

## Backlog Summary

**Total User Stories:** 31 (25 funzionali + 6 developer)
**Completate:** 20 → vedi [BACKLOG_DONE.md](./BACKLOG_DONE.md)
**Rimanenti:** 11 (7 funzionali + 4 developer)

**Status:**
- Must Have: US-022 ✅ (Undo), **US-024 (Max)**, **US-026 (Fix +)**, US-021 (Cloud Sync)
- Should Have: US-013 (shadcn/ui), **US-025 (Slider)**
- Could Have: 3/3 completate
- Won't Have: US-011, US-014

**Developer Stories:**
- Should Have: US-DEV-002 (US-DEV-001 ✅)
- Could Have: US-DEV-003 (US-DEV-004 ✅)
- Won't Have: US-DEV-005, US-DEV-006

**MVP Core + Report: COMPLETATO**
**Prossimo obiettivo:** US-026 (Fix +) → US-024 (Max) → US-025 (Slider) → US-021 (Cloud Sync)

---

## Backlog Maintenance

**Update Frequency:** Settimanale o dopo ogni milestone
**Process:**
1. Review priorità dopo ogni user story completata
2. Spostare US completate in BACKLOG_DONE.md
3. Aggiornare summary

---

## Collegamenti

- **BACKLOG_DONE.md**: User stories completate (archivio)
- **PRD.md**: Requisiti esecutivi
- **VISION.md**: Product discovery
- **JOURNEY.md**: Decision log
- **STATO.md**: Progress tracking

---

**Status:** MVP Core + Report Completato
**Next Action:** US-021 (Cloud Sync)
