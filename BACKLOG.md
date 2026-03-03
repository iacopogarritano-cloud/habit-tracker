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

### US-030: Segnalazione Bug In-App
**Priority:** Should Have (SP: 4.0)
**Target:** Utente beta / amici e parenti del developer

**User Story:**
- **As a**: utente beta che trova un problema nell'app
- **I want to**: inviare una segnalazione in-app senza dover scrivere un'email
- **So that**: il developer possa ricevere feedback immediato e correggere il bug velocemente

**Contesto:**
Weighbit è in fase MVP e sta per essere condiviso con amici/parenti come tester. Un canale semplice di bug reporting aumenta la quantità e qualità di feedback raccolti senza friction.

**Acceptance Criteria:**
- [ ] Pulsante "Segnala un problema" accessibile (es. in fondo alla dashboard o nel menu)
- [ ] Click apre un dialog/form con textarea (descrizione problema) e bottone "Invia"
- [ ] La segnalazione viene salvata in una tabella Supabase `bug_reports` con: messaggio, userId (se loggato), timestamp, user_agent
- [ ] Feedback visivo all'utente dopo invio ("Grazie! Abbiamo ricevuto la tua segnalazione")
- [ ] Gestione offline: se non connessi → messaggio di errore chiaro
- [ ] Per utenti non loggati: possibilità di aggiungere nome/email opzionale

**Technical Notes:**
- Tabella Supabase `bug_reports`: `id`, `user_id` (nullable FK), `message` (text), `contact` (text, nullable), `user_agent` (text), `app_version` (text), `created_at` (timestamp)
- Row Level Security: INSERT pubblico (anche utenti non loggati), SELECT solo per admin (service role)
- Nessuna UI admin necessaria in V1 — si legge direttamente dalla dashboard Supabase
- `app_version`: valore hardcoded dal `package.json` (o variabile d'ambiente)

**WSJF:** BV=5, TC=3, RROE=2, JS=3 → SP=10.0 (Must Have per fase beta)

---

## Developer Stories

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


### US-031: Dashboard più parlante — UX Discovery per Nuovo Utente
**Priority:** Should Have (SP: 5.3)

**User Story:**
- **As a**: utente nuovo che apre Weighbit per la prima volta
- **I want to**: capire immediatamente cosa fa ogni elemento dell'interfaccia senza dover esplorare per tentativi
- **So that**: entri nell'app con fiducia e scopra le feature senza bisogno di tutorial

**Contesto:**
Weighbit ha accumulato molte feature (heatmap, report, punteggio multi-timeframe, etc.) ma la UI non le comunica chiaramente. Le icone nell'header sono solo emoji, le sezioni della dashboard non spiegano cosa mostrano, i bottoni non descrivono le azioni. Un nuovo utente è disorientato. **No tutorial** (nessuno lo legge) — l'obiettivo è rendere la UI intrinsecamente chiara.

**Acceptance Criteria:**
- [ ] **Header buttons:** aggiungere label testuale visibile sotto ogni icona (es. "📊 Report", "🟩 Heatmap") — o almeno tooltip rich (`title`) più descrittivi su tutti i bottoni
- [ ] **Sezione punteggio multi-timeframe:** titolo più chiaro (già fatto parzialmente), aggiungere breve riga di contesto ("Le abitudini giornaliere vengono valutate oggi, le settimanali questa settimana")
- [ ] **Empty state dashboard:** quando non ci sono abitudini → messaggio guidato ("Aggiungi la tua prima abitudine per iniziare a tracciare i tuoi progressi" + freccia/indicatore verso il form)
- [ ] **Empty state categorie/ricerca:** messaggi specifici invece di lista vuota generica
- [ ] **Habit card:** hint visivo sullo slider/pulsante + per nuovi utenti (es. tooltip al primo hover)
- [ ] **Nessun tutorial modale** — tutto comunicato nel contesto naturale dell'UI

**Technical Notes:**
- Principalmente modifiche a `App.jsx`, `App.css`, `ReportCards.jsx`
- Nessun nuovo file necessario
- Attenzione: non aggiungere testo ovunque (UX clutter) — solo dove c'è attrito reale

**WSJF:** BV=5, TC=2, RROE=2, JS=3 → SP=6.7

---

### Sistema Multi-Timeframe (V2)
Supportare abitudini giornaliere, settimanali e mensili con punteggio unificato.

**User Stories V2:**
- ✅ US-V2-001: Supporto abitudini settimanali → COMPLETATA (2026-02-20)
- ✅ US-V2-002: Supporto abitudini mensili → COMPLETATA (2026-02-20)
- ✅ US-V2-003: Dashboard punteggio multi-timeframe → COMPLETATA (2026-03-02)
- ✅ US-V2-004: Vista heatmap completamento (stile GitHub) → COMPLETATA (2026-03-02)

---

## Backlog Summary

**Total User Stories:** 39 (31 funzionali + 8 developer)
**Completate:** 35 → vedi [BACKLOG_DONE.md](./BACKLOG_DONE.md)
**Rimanenti:** 4 (2 funzionali + 2 developer)

**Status:**
- Must Have: ✅ US-021 (Cloud Sync), ✅ US-028 (Fix isolamento dati) - COMPLETATE
- Should Have: ✅ US-013 (shadcn/ui), US-030 (bug report — pending Supabase setup)
- Could Have: ✅ tutte completate (incl. US-029 demo habits)
- Won't Have: US-011, US-014

**Developer Stories:**
- Should Have: ✅ US-DEV-002 (storage tests), ✅ US-DEV-003 (component tests)
- Won't Have: US-DEV-005, US-DEV-006

**Test totali: 55 (33 storage + 22 componenti) — tutti ✅**

**MVP Core + Report + UX + Cloud Sync + Multi-Timeframe + shadcn/ui Polish + Heatmap + Dashboard V2 + Trend Storico: COMPLETATO**
**Prossimo obiettivo:** US-030 (Bug report in-app — richiede setup Supabase) | US-031 (Dashboard parlante)

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

**Status:** MVP Core + Report + Cloud Sync + shadcn/ui + Heatmap + Dashboard V2 + Trend Storico completato
**Next Action:** US-030 (richiede Supabase setup) | US-031 (Dashboard parlante)
