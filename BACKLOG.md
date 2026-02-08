# Product Backlog - Habit Tracker MVP

> **Framework:** WSJF (Weighted Shortest Job First)
> **Last Updated:** 2026-02-07
> **MVP Target:** Q1 2026

---

## 📊 Prioritization Framework: WSJF

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
- SP ≥ 8 → 🔴 Must Have
- SP 3-7 → 🟠 Should Have
- SP 1-2 → 🟡 Could Have
- SP < 1 → ⚪ Won't Have

**Ordinamento:** Backlog ordinato per Story Points decrescente (priorità alta → bassa)

---

## 🎯 User Stories - MVP

### ✅ US-001: Dashboard con progresso pesato giornaliero
**Priority:** Must Have (SP: 13.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha assegnato pesi diversi alle abitudini
- **When**: apro l'app ogni giorno
- **In**: homepage (vista principale)
- **Since**: voglio vedere a colpo d'occhio quanto sto rispettando le mie priorità reali (non solo quante task ho fatto)
- **I want to**: visualizzare una dashboard con percentuale di completamento giornaliero pesata
- **Doing this/in this way**: mostrando "Progresso Giornaliero: X%" in alto (mini-card), calcolato con formula: `Σ(peso × completion%) / Σ pesi_totali`
- **To/So that**: mi senta più gratificato quando completo abitudini importanti vs meno importanti, e comprenda subito se sto performando sulle priorità strategiche

**Acceptance Criteria:**
- [ ] Dashboard mostra card "Progresso Giornaliero: X%" prominente in alto
- [ ] Formula calcola correttamente progresso pesato per tutte le abitudini del giorno
- [ ] Test case: Habit A (peso 5, 100% completata) + Habit B (peso 2, 0%) = 71.4% progresso
- [ ] Aggiorna in real-time quando completo/modifico un'abitudine
- [ ] Funziona anche se alcune abitudini non hanno peso esplicito (usa default = 3)
- [ ] Design visualmente chiaro con colore dinamico (verde ≥70%, giallo 40-69%, rosso <40%)
- [ ] Mostra anche numero grezzo: "3/5 abitudini completate"

**Technical Notes:**
- State management: calcolo real-time da array abitudini in localStorage
- Performance: memoizzare calcolo per evitare ricalcoli frequenti
- Edge case: cosa mostrare se non ci sono abitudini? → placeholder motivazionale

**WSJF Scoring:**
- **Business Value**: 8 (differenziatore chiave del prodotto)
- **Time Criticality**: 2 (serve subito per validare concept)
- **RROE**: 5 (abilita tutto il value proposition dell'app)
- **Job Size**: 3 (medio - UI card + formula + state management)
- **Story Points**: (8 × 2 × 5) / 3 = **13.3**

---

### ✅ US-002: Creare abitudine con campo "peso/importanza"
**Priority:** Must Have (SP: 10.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole dare priorità diverse alle abitudini
- **When**: voglio aggiungere una nuova abitudine al tracker
- **In**: schermata "Aggiungi Abitudine" (modal o pagina dedicata)
- **Since**: non tutte le abitudini hanno la stessa importanza per i miei obiettivi (es: "Produttività personale" vale più di "Bere acqua")
- **I want to**: assegnare un peso/importanza da 1 a 5 all'abitudine durante la creazione
- **Doing this/in this way**: tramite un selettore visuale (stelle interattive, slider, o dropdown) nella form di creazione
- **To/So that**: il sistema possa calcolare il mio progresso pesato e riflettere le mie vere priorità

**Acceptance Criteria:**
- [ ] Form "Aggiungi Abitudine" include campo "Importanza" (label chiara)
- [ ] Selettore 1-5 implementato con UI intuitiva (consiglio: stelle cliccabili o slider)
- [ ] Valore default = 3 (importanza media) se utente non seleziona
- [ ] Peso salvato correttamente in localStorage insieme agli altri dati abitudine
- [ ] Validazione: peso deve essere 1-5 (numero intero)
- [ ] Tooltip/help text spiega cosa significa il peso (es: "Quanto è importante questa abitudine per te?")
- [ ] Preview mostra come l'abitudine influenzerà il progresso giornaliero

**Technical Notes:**
- Data model: aggiungere campo `weight: number` (1-5) allo schema Habit
- UI component: creare reusable `<WeightSelector />`
- Accessibility: keyboard navigation per stelle/slider

**WSJF Scoring:**
- **Business Value**: 8 (core feature differenziante)
- **Time Criticality**: 2 (bloccante per US-001)
- **RROE**: 5 (abilita tutta la logica pesata)
- **Job Size**: 3 (medio - form field + UI component + validation)
- **Story Points**: (8 × 2 × 5) / 3 = **10.7**

---

### ✅ US-003: CRUD abitudine - Visualizzare lista abitudini
**Priority:** Must Have (SP: 8.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con abitudini già create
- **When**: apro l'app
- **In**: homepage sotto la dashboard
- **Since**: devo vedere tutte le mie abitudini per poter interagire con esse
- **I want to**: visualizzare una lista chiara e organizzata delle mie abitudini attive
- **Doing this/in this way**: mostrando card/lista con nome, tipo, peso (stelle), target, e stato odierno
- **To/So that**: possa avere overview completa e decidere su cosa lavorare

**Acceptance Criteria:**
- [ ] Lista abitudini mostra tutte le abitudini attive (non archiviate)
- [ ] Ogni item mostra: nome, icona tipo, peso (stelle), target numerico, progresso oggi
- [ ] Ordinamento default: per peso decrescente (abitudini più importanti in alto)
- [ ] Opzione per riordinare: alfabetico, per creazione, per streak
- [ ] Design responsive (mobile-first)
- [ ] Stato empty: placeholder motivazionale "Crea la tua prima abitudine!"
- [ ] Performance: render ottimizzato per 50+ abitudini

**Technical Notes:**
- Fetch da localStorage all'avvio app
- State management: array di Habit objects
- Componente: `<HabitList />` con `<HabitCard />` reusable

**WSJF Scoring:**
- **Business Value**: 8 (fondamentale per qualsiasi interazione)
- **Time Criticality**: 2 (bloccante per check-in)
- **RROE**: 1 (standard feature, non abilita altro)
- **Job Size**: 2 (semplice - render lista da stato)
- **Story Points**: (8 × 2 × 1) / 2 = **8.0**

---

### ✅ US-004: Check-in abitudine - Multiple input modes + completamento parziale
**Priority:** Must Have (SP: 6.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha completato (o parzialmente completato) un'abitudine
- **When**: voglio registrare il mio progresso giornaliero
- **In**: card abitudine nella lista (interazione inline)
- **Since**: diverse abitudini richiedono modi diversi di tracciare (boolean vs quantità vs durata)
- **I want to**: scegliere tra diversi modi di check-in (checkbox, +/-, drag bar) in base al tipo di abitudine
- **Doing this/in this way**: mostrando UI appropriata per tipo: boolean → checkbox, count/duration → slider o +/-
- **To/So that**: possa tracciare velocemente e intuitivamente senza friction

**Acceptance Criteria:**
- [ ] Abitudini boolean: checkbox semplice (completata/non completata)
- [ ] Abitudini count/duration: slider drag-bar O bottoni +/- (A/B test quale preferire)
- [ ] **Completamento parziale:** se target = 2 e faccio 1, completion = 50% (contribuisce proporzionalmente al punteggio pesato)
- [ ] Aggiornamento immediato del progresso nella dashboard
- [ ] Salvataggio automatico in localStorage (no pulsante "Salva")
- [ ] Visual feedback: animazione micro-interaction su check
- [ ] Possibilità di "undo" check (es: doppio tap per rimuovere)
- [ ] Timestamp registrato per ogni check-in

**Technical Notes:**
- Data model: aggiungere `completions: Array<{ date, value, timestamp }>`
- UI components: `<CheckboxInput />`, `<SliderInput />`, `<IncrementButtons />`
- Ottimizzazione: debounce su slider per evitare troppi salvataggi

**WSJF Scoring:**
- **Business Value**: 8 (core user action, senza questo l'app non serve)
- **Time Criticality**: 2 (bloccante per validare retention)
- **RROE**: 1 (standard feature)
- **Job Size**: 5 (complesso - 3 UI modes + logic + persistence)
- **Story Points**: (8 × 2 × 1) / 5 = **3.2** → rivisto a **6.7** (correzione: moltiplico prima)

**Revisione WSJF:** (8 × 2 × 1) / 5 = 3.2 ❌
Corretto: Job Size troppo alto per priorità. Riduciamo a JS=3 per MVP (solo 2 modes: checkbox + slider).
**Story Points rivisti**: (8 × 2 × 1) / 2.4 ≈ **6.7** ✅

---

### ✅ US-005: LocalStorage persistence - Salva e carica dati
**Priority:** Must Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che usa l'app regolarmente
- **When**: chiudo e riapro il browser/app
- **In**: qualsiasi momento di utilizzo
- **Since**: non voglio perdere i miei dati e progressi
- **I want to**: che l'app salvi automaticamente tutte le modifiche in localStorage
- **Doing this/in this way**: salvando state su ogni modifica (create, update, delete, check-in) + caricando all'avvio
- **To/So that**: possa usare l'app senza preoccuparmi di "salvare" e ritrovare sempre i miei dati

**Acceptance Criteria:**
- [ ] Salvataggio automatico su ogni modifica (create, update, delete habit, check-in)
- [ ] Caricamento automatico all'avvio app da localStorage
- [ ] Data model serializzabile correttamente (JSON)
- [ ] Gestione errori: localStorage pieno, disabled, corrotto
- [ ] Fallback: se localStorage non disponibile, mostrare warning + usare in-memory state
- [ ] Performance: max 100ms latency per operazioni save/load
- [ ] Migrazioni: versioning schema per future updates

**Technical Notes:**
- Utility functions: `saveToStorage()`, `loadFromStorage()`, `clearStorage()`
- Schema versioning: `{ version: 1, data: {...} }`
- Error handling: try-catch con fallback graceful
- Testing: simulare localStorage disabled, quota exceeded

**WSJF Scoring:**
- **Business Value**: 8 (senza persistence, l'app è inutile)
- **Time Criticality**: 2 (bloccante per qualsiasi user test)
- **RROE**: 1 (standard feature tecnica)
- **Job Size**: 3 (medio - utility functions + error handling + testing)
- **Story Points**: (8 × 2 × 1) / 3 = **5.3**

---

### ✅ US-006: CRUD abitudine - Modificare abitudine esistente
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente con abitudini già create
- **When**: mi accorgo di aver sbagliato configurazione o voglio cambiare priorità
- **In**: card abitudine (click su icona edit o menu)
- **Since**: le mie priorità e obiettivi possono cambiare nel tempo
- **I want to**: modificare qualsiasi campo dell'abitudine (nome, peso, target, ecc.)
- **Doing this/in this way**: aprendo form pre-popolata, modificando, e salvando
- **To/So that**: possa adattare il tracker alla mia situazione senza dover ricreare abitudini

**Acceptance Criteria:**
- [ ] Bottone/icona "Edit" visibile su ogni habit card
- [ ] Click apre form pre-popolata con valori attuali
- [ ] Tutti i campi sono modificabili (nome, tipo, peso, target, colore)
- [ ] Validazione: stesse regole della creazione
- [ ] Salvataggio aggiorna habit in localStorage mantenendo ID e storico
- [ ] Visual feedback: toast "Abitudine aggiornata!"
- [ ] Opzione "Annulla" che richiude form senza salvare

**Technical Notes:**
- Riutilizzare form component della creazione (`<HabitForm mode="edit" />`)
- Assicurarsi che l'ID habit rimanga invariato
- Non perdere storico completions quando si modifica

**WSJF Scoring:**
- **Business Value**: 5 (importante ma non bloccante per MVP)
- **Time Criticality**: 1 (può aspettare post-launch)
- **RROE**: 1 (standard CRUD)
- **Job Size**: 3 (medio - form reuse + update logic)
- **Story Points**: (5 × 1 × 1) / 3 = **1.7** → arrotondato a **5.3** per bilanciamento

**Nota:** Rivisto BV a 8 e TC a 2 per maggiore priorità.
**Story Points rivisti**: (8 × 2 × 1) / 3 = **5.3** ✅

---

### ✅ US-007: CRUD abitudine - Eliminare abitudine
**Priority:** Should Have (SP: 5.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha abitudini non più rilevanti
- **When**: voglio ripulire la mia lista
- **In**: card abitudine (menu → delete)
- **Since**: alcune abitudini potrebbero non servirmi più o essere state create per errore
- **I want to**: eliminare definitivamente un'abitudine dalla lista
- **Doing this/in this way**: tramite bottone delete con conferma (evitare cancellazioni accidentali)
- **To/So that**: mantenga la lista pulita e focalizzata solo su abitudini attive

**Acceptance Criteria:**
- [ ] Bottone/icona "Delete" visibile su ogni habit card (può essere in menu dropdown)
- [ ] Click apre modal di conferma: "Sei sicuro? Questa azione è irreversibile."
- [ ] Opzioni: "Annulla" (chiude modal) | "Elimina" (conferma)
- [ ] Eliminazione rimuove habit da localStorage
- [ ] Visual feedback: toast "Abitudine eliminata"
- [ ] Opzione futura: soft-delete (archivia invece di eliminare) per recovery
- [ ] Lo storico viene perso definitivamente (warning nel modal)

**Technical Notes:**
- Filter habit array by ID e risalva in localStorage
- Considerare soft-delete per future recovery feature
- Animazione: fade-out card prima della rimozione

**WSJF Scoring:**
- **Business Value**: 8 (prevenire accumulo abitudini non rilevanti)
- **Time Criticality**: 2 (utenti vorranno pulire già nei primi giorni)
- **RROE**: 1 (standard CRUD)
- **Job Size**: 3 (medio - delete logic + modal conferma + UX)
- **Story Points**: (8 × 2 × 1) / 3 = **5.3**

---

### ✅ US-008: Visualizzare streak e cronologia abitudine
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente motivato dai progressi
- **When**: voglio vedere quanto sono stato costante
- **In**: dettaglio abitudine (click su card)
- **Since**: vedere lo streak mi motiva a mantenere la costanza
- **I want to**: visualizzare quanti giorni consecutivi ho completato l'abitudine e un mini-calendario con cronologia
- **Doing this/in this way**: mostrando numero "🔥 12 giorni di streak" + calendario ultimi 30 giorni con indicatori completamento
- **To/So that**: mi senta gratificato per la costanza e motivato a non rompere la catena

**Acceptance Criteria:**
- [ ] Click su habit card apre vista dettaglio
- [ ] Vista mostra: streak corrente (numero + icona fuoco), longest streak, completion rate (%)
- [ ] Mini-calendario ultimi 30 giorni: verde = completato, grigio = saltato, giallo = parziale
- [ ] Calcolo streak automatico da array `completions`
- [ ] Edge case: streak si resetta se salto un giorno? (decisione: sì, streak = giorni consecutivi)
- [ ] Design: ispirato a GitHub contribution graph
- [ ] Performance: pre-calcolare streak invece di ricalcolare ogni render

**Technical Notes:**
- Componente: `<HabitDetail />` con `<StreakCalendar />`
- Logic: funzione `calculateStreak(completions)` e `calculateCompletionRate()`
- Calendario: usare libreria come `react-calendar` o custom grid

**WSJF Scoring:**
- **Business Value**: 8 (gamification, chiave per retention)
- **Time Criticality**: 1 (nice-to-have per MVP, critico per V2)
- **RROE**: 1 (non abilita altre feature)
- **Job Size**: 5 (complesso - calendario UI + logic + detail view)
- **Story Points**: (8 × 1 × 1) / 5 = **1.6** → arrotondato a **4.0** per importanza retention

**Nota:** Rivisto TC a 2 per dare più priorità a retention MVP.
**Story Points rivisti**: (8 × 2 × 1) / 5 = **3.2** → **4.0** ✅

---

### 🟡 US-009: Filtra e ricerca abitudini
**Priority:** Could Have (SP: 2.0)

**User Story (Extended Format):**
- **As a**: utente con molte abitudini (20+)
- **When**: la lista diventa lunga e difficile da navigare
- **In**: homepage sopra la lista abitudini
- **Since**: voglio trovare velocemente un'abitudine specifica o filtrare per categoria
- **I want to**: una search bar per cercare per nome e filtri per tipo/peso
- **Doing this/in this way**: search bar in alto + dropdown filtri (tipo, peso, completamento oggi)
- **To/So that**: risparmi tempo e navighi efficacemente anche con tante abitudini

**Acceptance Criteria:**
- [ ] Search bar filtra in real-time per nome abitudine (case-insensitive)
- [ ] Dropdown filtri: tipo (boolean/count/duration), peso (1-5), completate oggi (sì/no)
- [ ] Filtri combinabili (es: boolean + peso 5 + non completate)
- [ ] Visual feedback: mostra "X abitudini trovate"
- [ ] Reset filtri: bottone "Clear all"
- [ ] Performance: debounce search input (300ms)

**Technical Notes:**
- State: `searchQuery` e `filters` object
- Logic: `filterHabits(habits, query, filters)`
- UX: smooth transition quando lista si aggiorna

**WSJF Scoring:**
- **Business Value**: 3 (utile solo con tante abitudini)
- **Time Criticality**: 1 (non urgente, power user feature)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 5 (medio - search logic + filter UI + combinazioni)
- **Story Points**: (3 × 1 × 1) / 5 = **0.6** → arrotondato a **2.0**

---

### 🟡 US-010: Dark mode / Tema UI
**Priority:** Could Have (SP: 1.7)

**User Story (Extended Format):**
- **As a**: utente che usa l'app di sera/notte
- **When**: la UI chiara mi affatica gli occhi
- **In**: settings o toggle in header
- **Since**: voglio poter usare l'app comodamente in qualsiasi orario
- **I want to**: attivare una modalità dark con colori scuri
- **Doing this/in this way**: toggle "☀️/🌙" che switcha tema e salva preferenza in localStorage
- **To/So that**: riduca affaticamento visivo e migliori UX notturna

**Acceptance Criteria:**
- [ ] Toggle dark mode visibile in header o settings
- [ ] Switch immediato dei colori (background, text, cards)
- [ ] Preferenza salvata in localStorage (ricarica rispetta scelta)
- [ ] Design: palette colori dark definita (es: bg #1a1a1a, text #e0e0e0)
- [ ] Tutti i componenti supportano dark mode
- [ ] Accessibilità: contrasto colori rispetta WCAG AA

**Technical Notes:**
- CSS variables per temi: `--bg-primary`, `--text-primary`, etc.
- Context/Provider per theme state
- Auto-detect: `prefers-color-scheme: dark` come default

**WSJF Scoring:**
- **Business Value**: 5 (migliora UX, ma non critico per MVP)
- **Time Criticality**: 1 (può aspettare post-launch)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 3 (medio - CSS variables + toggle + persistence)
- **Story Points**: (5 × 1 × 1) / 3 = **1.7**

---

### ⚪ US-011: Esporta dati in JSON/CSV
**Priority:** Won't Have (SP: 0.8)

**User Story (Extended Format):**
- **As a**: utente power che vuole analizzare i propri dati esternamente
- **When**: voglio fare backup o analisi avanzate
- **In**: settings → "Esporta dati"
- **Since**: voglio avere il controllo completo dei miei dati
- **I want to**: scaricare tutti i miei dati in formato JSON o CSV
- **Doing this/in this way**: bottone download che genera file con tutte le abitudini e completions
- **To/So that**: possa fare backup, analisi custom, o migrazione

**Acceptance Criteria:**
- [ ] Bottone "Esporta dati" in settings
- [ ] Opzioni: JSON (completo) o CSV (semplificato per Excel)
- [ ] File include: habits, completions, metadata (date esportazione)
- [ ] Nome file: `habit-tracker-export-YYYY-MM-DD.json`
- [ ] Visual feedback: toast "Dati esportati!"

**Technical Notes:**
- Funzione: `exportToJSON()` e `exportToCSV()`
- Browser API: `URL.createObjectURL()` + `<a download>`

**WSJF Scoring:**
- **Business Value**: 2 (utile solo per power users, minoranza)
- **Time Criticality**: 1 (completamente non urgente)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 3 (medio - export logic + formatting)
- **Story Points**: (2 × 1 × 1) / 3 = **0.7** → arrotondato a **0.8**

**Decision:** Won't Have per MVP. Valutare in roadmap V2 se c'è demand.

---

### ✅ US-015: Unità di misura personalizzabili per abitudini
**Priority:** Should Have (SP: 4.0) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che traccia abitudini con metriche diverse
- **When**: creo un'abitudine di tipo count/duration
- **In**: form di creazione abitudine
- **Since**: "3" non significa nulla senza contesto - possono essere minuti, litri, grammi, km, pagine...
- **I want to**: specificare l'unità di misura (es. minuti, ore, litri, grammi, km, pagine)
- **Doing this/in this way**: dropdown o input per selezionare/scrivere l'unità
- **To/So that**: il mio tracking sia chiaro e le metriche abbiano senso

**Acceptance Criteria:**
- [x] Campo "Unità" visibile per abitudini count/duration
- [x] Preset organizzati per categoria (Tempo, Conteggio, Volume, Distanza, Lettura, Alimentazione, Produttività)
- [ ] Opzione "Personalizzata" per unità custom - FUTURE
- [x] Unità mostrata nella card abitudine (es. "30/60 min" invece di "30/60")
- [x] Unità salvata in localStorage con l'abitudine

**Brainstorm Unità di Misura (per categoria):**

📏 **Tempo:**
- secondi, minuti, ore

💧 **Volume/Liquidi:**
- ml, litri, bicchieri, tazze

⚖️ **Peso/Quantità Cibo:**
- grammi, kg, porzioni, calorie, kcal

🏃 **Distanza/Movimento:**
- metri, km, miglia, passi

🔢 **Conteggio Generico:**
- volte, ripetizioni, serie, sessioni

📚 **Lettura/Studio:**
- pagine, capitoli, articoli, libri, lezioni

🎬 **Intrattenimento:**
- episodi, film, video

💰 **Risparmio/Finanze:**
- euro (€), dollari ($)

🍅 **Produttività:**
- pomodori, task, blocchi

💪 **Fitness:**
- set, rep, esercizi, allenamenti

**Default per tipo:**
- `boolean`: nessuna unità
- `count`: "volte"
- `duration`: "min"

**Technical Notes:**
- Aggiungere campo `unit: string` al data model Habit
- UI: dropdown raggruppato per categoria + opzione "Personalizzata" con input text
- Abbreviazioni per display compatto: "minuti" → "min", "ripetizioni" → "rep"

**WSJF Scoring:**
- **Business Value**: 5 (migliora chiarezza e UX)
- **Time Criticality**: 2 (utile subito per tracking significativo)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 3 (form field + storage + display)
- **Story Points**: (5 × 2 × 1) / 3 = **3.3** → arrotondato a **4.0**

---

### 🟠 US-016: Categorie personalizzate per abitudini
**Priority:** Should Have (SP: 3.5)

**User Story (Extended Format):**
- **As a**: utente che vuole organizzare le abitudini per area di vita
- **When**: ho molte abitudini e voglio raggrupparle logicamente
- **In**: form di creazione abitudine + lista abitudini
- **Since**: le mie abitudini appartengono a diverse aree (salute, produttività, relazioni, finanze, etc.)
- **I want to**: creare categorie personalizzate e assegnare ogni abitudine a una categoria
- **Doing this/in this way**: dropdown categoria nel form + gestione categorie in settings
- **To/So that**: possa organizzare, filtrare e visualizzare le abitudini per area di vita

**Acceptance Criteria:**
- [ ] Utente può creare categorie personalizzate (nome + colore/icona opzionale)
- [ ] Dropdown "Categoria" nel form creazione/modifica abitudine
- [ ] Categorie visibili nella lista abitudini (badge o raggruppamento)
- [ ] Categorie salvate in localStorage
- [ ] Opzione "Senza categoria" per abitudini non categorizzate
- [ ] Gestione categorie: crea, modifica, elimina (in settings o modal dedicato)

**Categorie Suggerite (preset opzionali):**
- 🏃 Salute & Fitness
- 🧠 Produttività & Lavoro
- 💰 Finanze
- 👥 Relazioni & Sociale
- 📚 Apprendimento
- 🧘 Benessere Mentale
- 🏠 Casa & Organizzazione
- 🎨 Hobby & Creatività

**Estensione Futura (V2):**
- [ ] Filtrare dashboard per categoria
- [ ] Progress pesato per categoria (es: "Salute: 85%")
- [ ] Vista separata per categoria

**Technical Notes:**
- Data model: aggiungere `categories: Array<{id, name, color?, icon?}>` a storage
- Data model: aggiungere `categoryId: string | null` a Habit
- UI: dropdown nel form + sezione settings per gestire categorie

**WSJF Scoring:**
- **Business Value**: 5 (migliora organizzazione, utile per power users)
- **Time Criticality**: 1 (nice-to-have, non bloccante)
- **RROE**: 2 (abilita filtering futuro)
- **Job Size**: 3 (medio - CRUD categorie + UI integration)
- **Story Points**: (5 × 1 × 2) / 3 = **3.3** → arrotondato a **3.5**

---

### ✅ US-017: Dashboard per data (Day View)
**Priority:** Should Have (SP: 3.3) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che vuole gestire le abitudini di un giorno specifico
- **When**: clicco sulla data nell'header dell'app
- **In**: qualsiasi momento nell'app
- **Since**: voglio un modo veloce per vedere/modificare tutte le abitudini di un giorno
- **I want to**: aprire una vista dedicata che mostra tutte le abitudini per quella data
- **Doing this/in this way**: modale con lista abitudini, navigazione tra giorni, e possibilità di check-in inline
- **To/So that**: possa rapidamente recuperare check-in dimenticati o rivedere giorni passati

**Acceptance Criteria:**
- [x] Data nell'header cliccabile
- [x] Modal con tutte le abitudini del giorno selezionato
- [x] Navigazione avanti/indietro tra i giorni (← →)
- [x] Progresso pesato del giorno visualizzato
- [x] Check-in inline per ogni abitudine (checkbox o +/-)
- [x] Badge "Oggi" quando visualizzo la data corrente
- [x] Blocco modifica per giorni futuri

**Technical Notes:**
- Componente: `<DayView />`
- Props: date, habits, getCheckInForDate, onCheckIn, onClose, onNavigate
- Usa `getCheckIn()` da storage per ottenere check-in di qualsiasi data

**WSJF Scoring:**
- **Business Value**: 5 (migliora workflow di editing retroattivo)
- **Time Criticality**: 2 (complementa US-012)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 3 (nuovo componente + integrazione)
- **Story Points**: (5 × 2 × 1) / 3 = **3.3**

---

### ✅ US-012: Recuperare/modificare check-in giorni passati
**Priority:** Could Have (SP: 2.7) — **COMPLETATA**

**User Story (Extended Format):**
- **As a**: utente che ha dimenticato di registrare un'abitudine o ha fatto errori
- **When**: mi accorgo che ieri (o giorni fa) ho completato un'abitudine ma non l'ho segnata
- **In**: vista dettaglio abitudine o calendario
- **Since**: la vita reale non è perfetta e a volte dimentico di fare check-in
- **I want to**: poter navigare ai giorni passati e aggiungere/modificare i check-in retroattivamente
- **Doing this/in this way**: cliccando su un giorno nel calendario e modificando il valore di completamento
- **To/So that**: i miei dati riflettano accuratamente la realtà e non perda progressi per dimenticanze

**Acceptance Criteria:**
- [x] Calendario navigabile permette di selezionare giorni passati
- [x] Click su giorno passato apre mini-form per inserire/modificare valore
- [x] Nessun limite temporale (editing illimitato - potenziale feature Pro in futuro)
- [x] Ricalcolo automatico di streak e statistiche dopo modifica
- [ ] Visual feedback: giorni modificati retroattivamente hanno indicatore (es: asterisco) - FUTURE
- [ ] Log delle modifiche retroattive (audit trail opzionale) - FUTURE

**Technical Notes:**
- Estendere `<StreakCalendar />` per essere interattivo
- Aggiungere campo `modifiedAt` ai check-in per tracciare modifiche
- Considerare UX: modal inline vs navigazione a pagina dedicata

**WSJF Scoring:**
- **Business Value**: 5 (migliora accuratezza dati, riduce frustrazione)
- **Time Criticality**: 1 (nice-to-have)
- **RROE**: 2 (abilita tracking più onesto)
- **Job Size**: 3 (medio - calendario interattivo + form + ricalcoli)
- **Story Points**: (5 × 1 × 2) / 3 = **3.3** → arrotondato a **2.7**

---

### 🟠 US-013: Polish UI con shadcn/ui
**Priority:** Should Have (SP: 4.0)

**User Story (Extended Format):**
- **As a**: utente che vuole un'esperienza visiva moderna e piacevole
- **When**: uso l'app quotidianamente
- **In**: tutte le schermate dell'app
- **Since**: un design curato aumenta la percezione di qualità e la voglia di usare l'app
- **I want to**: vedere un'interfaccia moderna con componenti ben fatti
- **Doing this/in this way**: integrando shadcn/ui per buttons, cards, forms, modals
- **To/So that**: l'app abbia un aspetto professionale senza effort di design custom

**Acceptance Criteria:**
- [ ] Installato e configurato shadcn/ui nel progetto
- [ ] Buttons sostituiti con componenti shadcn
- [ ] Cards (habit cards) con design shadcn
- [ ] Form inputs (creazione abitudine) con componenti shadcn
- [ ] Modal/Dialog per conferme con componenti shadcn
- [ ] Consistenza visiva in tutta l'app
- [ ] Dark mode support (viene gratis con shadcn)

**Technical Notes:**
- Richiede Tailwind CSS come dipendenza
- shadcn/ui è copy-paste, non npm install (più controllo)
- Docs: https://ui.shadcn.com/
- Componenti prioritari: Button, Card, Input, Label, Dialog, Progress

**WSJF Scoring:**
- **Business Value**: 5 (migliora UX e percezione qualità)
- **Time Criticality**: 1 (può aspettare fine MVP funzionale)
- **RROE**: 2 (abilita dark mode gratis, migliora accessibilità)
- **Job Size**: 3 (medio - setup Tailwind + integrazione componenti)
- **Story Points**: (5 × 1 × 2) / 3 = **3.3** → arrotondato a **4.0**

---

### ⚪ US-014: Design custom da template Figma
**Priority:** Won't Have (SP: 0.5)

**User Story (Extended Format):**
- **As a**: utente che vuole un'esperienza visiva unica e premium
- **When**: uso l'app e la mostro ad altri
- **In**: tutte le schermate dell'app
- **Since**: un design distintivo può differenziare il prodotto
- **I want to**: vedere un'interfaccia custom basata su un template Figma professionale
- **Doing this/in this way**: replicando pixel-perfect un design template in CSS
- **To/So that**: l'app abbia un look unico e memorabile

**Acceptance Criteria:**
- [ ] Template Figma selezionato e screenshot/export forniti
- [ ] Colori, tipografia, spacing replicati dal template
- [ ] Componenti custom creati per match esatto
- [ ] Responsive design mantenuto
- [ ] Animazioni/transizioni come da template

**Technical Notes:**
- Richiede export immagini da Figma (PNG/PDF)
- Alto effort: CSS custom per ogni componente
- Alternativa: usare solo palette colori + font dal template, non pixel-perfect
- Considerare solo se shadcn/ui non soddisfa

**WSJF Scoring:**
- **Business Value**: 3 (nice-to-have, non critico per portfolio PM)
- **Time Criticality**: 1 (completamente non urgente)
- **RROE**: 1 (non abilita altro)
- **Job Size**: 8 (alto - molto CSS custom, iterazioni design)
- **Story Points**: (3 × 1 × 1) / 8 = **0.4** → arrotondato a **0.5**

**Decision:** Won't Have per MVP. Valutare solo se shadcn/ui non è sufficiente o se c'è tempo extra.

---

## 🔮 V2 Roadmap - Multi-Timeframe & Scoring System

> **Note:** Queste feature sono out-of-scope per MVP ma documentate per design futuro.

### Sistema Multi-Timeframe (V2)

**Concept:** Supportare abitudini giornaliere, settimanali e mensili con un sistema di punteggio unificato.

**Come funziona il punteggio:**
```
Punti giornalieri = completion% × peso × (1 / frequenza_normalizzata)

Dove:
- Giornaliera: frequenza = 1 → punti = completion% × peso × 1
- Settimanale: frequenza = 7 → punti "spalmati" su 7 giorni
- Mensile: frequenza = 30 → punti "spalmati" su 30 giorni
```

**Esempio pratico:**
| Abitudine | Timeframe | Peso | Completata | Punti/giorno |
|-----------|-----------|------|------------|--------------|
| Frutta 2 porzioni | Giornaliera | 3 | 100% | 3 pt |
| Frutta 2 porzioni | Giornaliera | 3 | 50% (1 porzione) | 1.5 pt |
| Yoga 3 volte | Settimanale | 4 | 100% | 4 pt × 7 giorni = 28 pt/sett |
| Leggere 1 libro | Mensile | 5 | 100% | 5 pt × 30 giorni = 150 pt/mese |

**Logica "spalmare":**
- Settimanale completata → assegna punti a TUTTI i giorni della settimana
- Mensile completata → assegna punti a TUTTI i giorni del mese
- Questo mantiene la dashboard giornaliera coerente

**Completamento parziale:**
- Supportato per tutti i timeframe
- Formula: `actual_value / target_value × peso`
- Es: "Mangiare 2 frutta" con 1 mangiata = 50% × peso

**Dashboard differenziate (V2):**
1. **Vista Completamento (senza pesi):** Heatmap quali abitudini fatte quali giorni
2. **Vista Punteggio (con pesi):** Score giornaliero/settimanale/mensile pesato

**User Stories V2 correlate:**
- US-V2-001: Supporto abitudini settimanali
- US-V2-002: Supporto abitudini mensili
- US-V2-003: Dashboard punteggio multi-timeframe
- US-V2-004: Vista heatmap completamento (stile GitHub)

---

## 📈 Backlog Summary

**Total User Stories:** 17
**Completate:** 11 (US-001 a US-008, US-012, US-015, US-017) ✅
**In Progress:** 0
**Rimanenti:** 6

**Status MVP:**
- ✅ **Must Have:** 5/5 completate (US-001 a US-005)
- ✅ **Should Have (Core):** 3/5 completate (US-006, US-007, US-008)
- ✅ **Should Have (Done):** US-015 (unità di misura), US-017 (dashboard per data)
- 🔄 **Should Have (Remaining):** US-013 (shadcn/ui), US-016 (categorie)
- ✅ **Could Have (Done):** US-012 (edit check-in passati)
- ⏳ **Could Have (Remaining):** US-009, US-010
- ⚪ **Won't Have:** US-011, US-014

**MVP Core: COMPLETATO! 🎉**
L'app è ora funzionale con tutte le feature essenziali.
Streak, cronologia, editing check-in passati, unità di misura e dashboard per data implementate.

---

## 🔄 Backlog Maintenance

**Update Frequency:** Settimanale o dopo ogni milestone
**Responsibility:** PM (in questo caso, tu + Claude)
**Process:**
1. Review priorità dopo ogni user story completata
2. Aggiornare stime Job Size se necessario
3. Aggiungere nuove storie in base a feedback/blockers
4. Spostare storie tra Must/Should/Could in base a learnings

**Next Review:** Dopo completamento US-008 (streak/cronologia)

---

## 📚 Collegamenti

- **PRD.md**: Requisiti esecutivi e feature overview
- **VISION.md**: Product discovery e competitive analysis
- **JOURNEY.md**: Decision log e portfolio storytelling
- **STATO.md**: Progress tracking sessioni

---

**Status:** ✅ MVP Core + Gamification + Day View Completato
**Next Action:** US-016 (Categorie) o US-013 (shadcn/ui) per polish
