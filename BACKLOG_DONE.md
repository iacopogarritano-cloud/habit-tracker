# Product Backlog - User Stories Completate

> **Archivio:** User stories completate dal backlog principale
> **Ultima migrazione:** 2026-02-12

---

## Legenda

- **SP:** Story Points (WSJF)
- **Framework:** WSJF (Weighted Shortest Job First)
- **Formula:** `Story Points = (Business Value × Time Criticality × RROE) / Job Size`

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

## Summary

**Total Completate:** 17 User Stories
- Must Have: 5/5 (US-001 → US-005)
- Should Have: 9 (US-006, US-007, US-008, US-015, US-016, US-017, US-018, US-019, US-020)
- Could Have: 3 (US-009, US-010, US-012)

**MVP Core + Report: COMPLETATO**

---

> **Nota:** Questo file è un archivio. Per le user stories attive, vedere [BACKLOG.md](./BACKLOG.md)
