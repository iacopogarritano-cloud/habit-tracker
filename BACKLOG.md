# Product Backlog - Habit Tracker MVP

> **Framework:** WSJF (Weighted Shortest Job First)
> **Last Updated:** 2026-02-15 (US-V2-006 aggiunta)
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

## V2 Roadmap

> **Note:** Out-of-scope per MVP.

### US-V2-005: Login con Email/Password
**Priority:** V2 - Nice to Have

**User Story:**
- **As a**: utente senza account Google
- **I want to**: registrarmi e accedere con email e password
- **So that**: possa usare l'app senza dipendere da Google

**Technical Notes:**
- Supabase supporta email/password nativamente
- Richiede setup SMTP per email di verifica
- Implementare: registrazione, login, password reset, email verification
- Più complesso di OAuth (gestione password, sicurezza, UI aggiuntiva)

**Decision:** V2 - Implementare solo se gli utenti lo richiedono. Google OAuth copre la maggior parte dei casi d'uso.

---

### US-V2-007: Import dati da altre piattaforme
**Priority:** V2 - Should Have (SP: 6.4)

**User Story:**
- **As a**: utente che migra da un altro habit tracker
- **I want to**: importare le mie abitudini e lo storico esistente in Weighbit
- **So that**: non perda i progressi accumulati e possa passare a Weighbit senza ricominciare da zero

**Problem Statement:**
La migrazione tra habit tracker è una delle principali barriere all'adozione. Un utente che usa un'altra app da mesi/anni ha investito dati preziosi (streak, storico, abitudini configurate) che non vuole perdere. Abbassare questa friction aumenta significativamente la conversione.

**Acceptance Criteria:**
- [ ] Pagina/modal "Importa dati" accessibile dalle impostazioni
- [ ] Supporto import CSV generico con mappatura campi (step 1: minimo viabile)
  - [ ] L'utente seleziona il file CSV
  - [ ] L'app mostra preview delle colonne rilevate
  - [ ] L'utente mappa colonne → campi Weighbit (nome, data, valore)
  - [ ] Anteprima dei dati da importare prima di confermare
  - [ ] Importazione con merge intelligente (non sovrascrive dati esistenti)
- [ ] Supporto import JSON (formato export nativo Weighbit — US-011)
  - [ ] Backup/restore completo dell'account
- [ ] Supporto per almeno 1 app specifica (TBD — dipende dall'app attualmente usata)
  - [ ] Auto-detection del formato
  - [ ] Mappatura automatica senza intervento manuale
- [ ] Feedback chiaro su quante abitudini/check-in sono stati importati
- [ ] Gestione errori: file malformato, duplicati, formato non riconosciuto

**Technical Notes:**
- File parsing lato client (no upload server) → privacy-first
- Librerie utili: `papaparse` per CSV, `zod` per validazione schema
- Merge strategy: se esiste già un'abitudine con lo stesso nome → chiedere all'utente (skip / merge / rinomina)
- Limitare import a ultimi 365 giorni per performance
- Il formato di ogni app specifica va investigato prima di implementare

**Open Questions:**
- Verificare se l'app sorgente supporta export e in che formato (JSON/CSV/altro).
- Supportare import parziale (solo abitudini, senza storico) come opzione?

**Dependencies:** US-011 (Export) è complementare — implement insieme o in sequenza

**WSJF:** BV=8, TC=2, RROE=2, JS=5 → SP=6.4

---

### US-V2-006: Dominio Custom (invece di Vercel)
**Priority:** V2 - Nice to Have

**User Story:**
- **As a**: utente che condivide l'app
- **I want to**: accedere all'app tramite un dominio personalizzato (es. weighbit.app)
- **So that**: l'URL sia professionale e facile da ricordare

**Technical Notes:**
- Attualmente l'app è hostata su Vercel con URL auto-generato
- Per MVP l'URL Vercel è sufficiente
- Opzioni: dominio personalizzato su Vercel (~10-15$/anno) o hosting alternativo

**Decision:** V2 - L'URL Vercel funziona per MVP. Dominio custom quando l'app ha utenti reali.

---

### Sistema Multi-Timeframe (V2)
Supportare abitudini giornaliere, settimanali e mensili con punteggio unificato.

**User Stories V2:**
- ✅ US-V2-001: Supporto abitudini settimanali → COMPLETATA (2026-02-20)
- ✅ US-V2-002: Supporto abitudini mensili → COMPLETATA (2026-02-20)
- US-V2-003: Dashboard punteggio multi-timeframe
- US-V2-004: Vista heatmap completamento (stile GitHub)

---

## Backlog Summary

**Total User Stories:** 33 (27 funzionali + 6 developer)
**Completate:** 28 → vedi [BACKLOG_DONE.md](./BACKLOG_DONE.md)
**Rimanenti:** 5 (1 funzionale + 4 developer)

**Status:**
- Must Have: ✅ US-021 (Cloud Sync), ✅ US-028 (Fix isolamento dati) - COMPLETATE
- Should Have: US-013 (shadcn/ui)
- Could Have: ✅ tutte completate (incl. US-029 demo habits)
- Won't Have: US-011, US-014

**Developer Stories:**
- Should Have: US-DEV-002 (US-DEV-001 ✅)
- Could Have: US-DEV-003 (US-DEV-004 ✅)
- Won't Have: US-DEV-005, US-DEV-006

**MVP Core + Report + UX + Cloud Sync + Multi-Timeframe + shadcn/ui Polish: COMPLETATO**
**Prossimo obiettivo:** Merge feature/shadcn → main, poi US-V2-003 (Dashboard multi-timeframe)

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

**Status:** MVP Core + Report + Cloud Sync + shadcn/ui completato
**Next Action:** Merge feature/shadcn → main + US-V2-003
