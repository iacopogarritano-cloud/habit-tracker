# PRD - Weighbit App

## Executive Summary

**Prodotto:** Weighbit (ex Habit Tracker) - App per monitoraggio e visualizzazione abitudini personali con **weighted prioritization**
**Tagline:** "Weighted Habit" - Non tutte le abitudini hanno lo stesso peso
**Target User:** Professionisti e studenti che vogliono migliorare produttività e benessere tracciando abitudini in modo significativo
**Problema Chiave:**
- **52% degli utenti abbandona app habit tracking entro 30 giorni** (retention crisis)
- App esistenti hanno paywall aggressivi (HBT: *"only good if you upgrade"*)
- Nessuna app permette di **pesare l'importanza delle abitudini** (tutte trattate ugualmente)
- Complessità eccessiva (Habitica) o feature poverty (Streaks: 12 task limit)

**Soluzione:**
Web app semplice, gratuita (ads poco invasive), e **unica nel mercato** per:
1. **Weighted Completion Dashboard:** Capire a colpo d'occhio se le priorità importanti sono rispettate
2. **Retention-first design:** Compassionate streaks, focus su progresso vs perfezione
3. **Honest pricing:** Free tier genuinamente utile, no dark patterns
4. **Rock-solid reliability:** Notifications e data persistence che funzionano sempre

**Mercato:** USD $13.06B (2025) → $43.87B (2034), CAGR 14.41% - in rapida crescita

---

## 1. Vision e Obiettivi

### Vision
> **"Rendere il tracciamento delle abitudini così semplice e veloce che diventa esso stesso un'abitudine."**

Creare l'habit tracker più **affidabile e onesto** del mercato, che:
- Rispetta le **vere priorità** dell'utente (weighted habits)
- È progettato per **retention long-term**, non solo acquisition
- È **genuinamente gratuito**, non "free-to-useless"
- **Funziona sempre** (rock-solid notifications e data persistence)

### Obiettivi di Business
- **Primario:** Progetto portfolio dimostrando **PM thinking end-to-end** (discovery, strategy, execution)
- **Secondario:** Risolvere problema personale reale (HBT paywall + mancanza weighting)
- **Terziario:** Imparare sviluppo web moderno (React) e product management
- **Revenue Model (futuro):** Ads poco invasive (free forever) + optional premium features

### Obiettivi Utente
- **Capire davvero come sta andando la vita** (non solo "quante abitudini completate")
- Tracciare facilmente abitudini con **diverse priorità/importanza**
- Visualizzare progressi **ponderati** su vere priorità
- Vedere streak e trend senza sentirsi puniti per fallimenti occasionali
- **Check-in rapido** (< 1 minuto al giorno) con multiple opzioni (drag, tap, checkbox)
- Rimanere motivati long-term (no abbandono dopo 30 giorni come 52% degli utenti)

---

## 2. Target User

### Profilo Primario
- **Età:** 25-40 anni
- **Professione:** Knowledge workers, freelancer, studenti
- **Tech-savviness:** Medio-alto (usa iPhone, app di produttività)
- **Pain points:**
  - App a pagamento troppo costose
  - Interfacce complesse che scoraggiano l'uso quotidiano
  - Mancanza di flessibilità nei tipi di metriche

### User Persona - "Marco"
- 30 anni, consultant, vuole migliorare salute e produttività
- Usa già Apple Health ma vuole tracking più personalizzato
- Disposto a input manuale se l'app è veloce e intuitiva
- Motivato da visualizzazioni e streak

---

## 3. User Stories

### Must Have (MVP)
```
Come utente, voglio...
- ✅ Creare nuove abitudini con nome e descrizione
- ✅ Definire il tipo di metrica (count, minuti, booleano sì/no)
- ✅ Impostare target giornalieri (es. "3 volte al giorno", "30 minuti")
- ✅ Registrare velocemente il completamento (check-in)
- ✅ Vedere lo streak corrente (giorni consecutivi di successo)
- ✅ Visualizzare tutte le abitudini in una dashboard
- ✅ Vedere il progresso giornaliero (% completamento)
```

### Should Have (V2)
```
Come utente, voglio...
- 📊 Visualizzare grafici di trend settimanali/mensili
- 📅 Vedere calendario con giorni di successo/fallimento (heatmap)
- 🎯 Impostare target su timeframe diversi (settimana, mese, anno)
- 📝 Aggiungere note a ogni check-in
- 🏷️ Categorizzare abitudini (salute, lavoro, hobby)
- ⏰ Ricevere reminder/notifiche
```

### Nice to Have (V3+)
```
Come utente, voglio...
- 📱 Integrazione con Apple Health (passi, sonno, workout)
- 📈 Report avanzati con finestre temporali custom
- 🔄 Export/import dati (CSV, JSON)
- 🌙 Dark mode
- 📲 App mobile nativa (iOS/Android)
- 🔐 Sync cloud tra dispositivi
```

---

## 4. Features Breakdown

### MVP - Versione 1.0 (Focus corrente)

#### 4.1 Gestione Abitudini
- **Creare abitudine:**
  - Nome (es. "Produttività personale")
  - Tipo metrica:
    - Boolean (fatto/non fatto)
    - Count (es. 3 volte)
    - Duration (es. 30 minuti)
  - Target giornaliero (numero)
  - **⭐ PESO/IMPORTANZA** (1-5 scale) - **UNIQUE FEATURE!**
    - 5/5: Priorità assoluta (es. produttività personale, progetti importanti)
    - 4-5/5: Fondamentale (es. frutta e verdura, salute)
    - 3/5: Importante (es. dormire bene, allenamento)
    - 2/5: Routine base (es. lavarsi i denti)
    - 1/5: Nice-to-have
  - Timeframe: solo GIORNALIERO per MVP (settimana/mese in V2)
  - Colore (optional)

- **Modificare/eliminare abitudine**

#### 4.2 Tracking Giornaliero
- Dashboard con lista abitudini del giorno
- **Multiple check-in options** (user choice):
  - **Drag bar** (slide per segnare 1, 2, 3...)
  - **+/- buttons** (tap per incrementare/decrementare)
  - **Checkbox** (tap per check/uncheck - per boolean habits)
- Per ogni abitudine:
  - Contatore progressivo (es. "2/3 completati")
  - Indicatore visuale (barra di progresso, colore)
  - **Badge peso** (1-5 stars o numero) per visual reminder importanza
  - Streak counter (es. "🔥 7 giorni")

#### 4.3 Visualizzazione Dati

**Dashboard principale (Homepage):**
- **⭐ MINI DASHBOARD OVERVIEW** (top of page) - **UNIQUE FEATURE!**
  - **Weighted Completion % Today:** Es. "72% delle priorità completate"
  - Formula: `(Σ peso_habit × completion_%) / Σ peso_totale`
  - Visual: Circular progress bar o gauge
  - Color-coded: Verde (>80%), Giallo (60-80%), Rosso (<60%)
  - **Value:** Colpo d'occhio su "come sta andando la mia vita oggi" (non solo "quante abitudini")
- Lista abitudini del giorno (card per ognuna)
  - Progresso individuale (%)
  - Badge peso (importanza)
  - Streak corrente

**Vista singola abitudine:**
- Storico ultimi 7-30 giorni (line chart o calendar heatmap)
- Statistiche base: % successo, streak max, streak corrente
- Impatto sul weighted completion (quanto contribuisce al totale)

#### 4.4 Persistenza Dati
- **LocalStorage browser** (MVP)
  - Dati salvati solo sul dispositivo
  - Nessun login/account richiesto
  - Semplice ma funzionale

### Post-MVP (Future Versions)

#### V2 - Analytics e Flessibilità
- Timeframe multipli (settimana/mese/anno)
- Grafici interattivi (line chart, bar chart)
- Heatmap calendario
- Note per check-in
- Categorie/tag per abitudini

#### V3 - Integrazioni Avanzate
- **Apple Health Integration:**
  - Richiede app nativa iOS (Swift/SwiftUI)
  - HealthKit API per:
    - Passi (step count)
    - Tempo in piedi (stand time)
    - Minuti attività (active energy)
    - Acqua (water intake)
    - Workout (durata e frequenza)
    - Sonno (sleep analysis)
  - **Nota:** Richiede account Apple Developer ($99/anno)

- Backend + Database (Firebase/Supabase)
- Sync multi-device
- Export/Import dati

---

## 5. UI/UX Guidelines

### Design Principles
1. **Semplicità:** Ogni azione massimo 2 tap/click
2. **Feedback immediato:** Animazioni micro per conferma azioni
3. **Motivante:** Colori, streak, celebrazioni per successi
4. **Pulito:** Whitespace generoso, focus sul contenuto

### Style Guide
- **Palette:**
  - Primary: Verde (#4CAF50) - successo, crescita
  - Secondary: Blu (#2196F3) - calma, costanza
  - Accent: Arancione (#FF9800) - energia, streak
  - Neutral: Grigi (#F5F5F5, #E0E0E0)

- **Typography:**
  - Heading: Sans-serif bold (es. Inter, Roboto)
  - Body: Sans-serif regular
  - Numeri: Monospace per metriche

- **Components:**
  - Card-based layout
  - Rounded corners (8px)
  - Soft shadows
  - Progress bars animate smoothly

### Key Screens (MVP)
1. **Dashboard** - lista abitudini con quick check-in
2. **Crea/Modifica Abitudine** - form semplice
3. **Dettaglio Abitudine** - storico e stats

---

## 6. Technical Considerations

### Tech Stack (Proposto)

#### Frontend - MVP
- **HTML/CSS/JavaScript vanilla**
  - Pro: semplice per imparare, zero setup
  - Contro: meno scalabile

**OPPURE**

- **React + Vite** (consigliato)
  - Pro: component-based, molto richiesto, scalabile
  - Contro: curva apprendimento iniziale

- **Styling:** CSS custom o Tailwind CSS

#### Data Storage - MVP
- **LocalStorage** (browser)
  - Limite: ~5-10MB, solo locale
  - Sufficiente per MVP

#### Hosting - MVP
- **GitHub Pages** o **Vercel** (gratuito)

#### Post-MVP
- **Backend:** Node.js + Express o Firebase
- **Database:** PostgreSQL, MongoDB, o Firestore
- **Mobile:** React Native o Swift/SwiftUI (per Apple Health)

### Data Model (MVP)

```javascript
// Habit Schema
{
  id: "uuid",
  name: "Produttività personale",
  type: "duration", // "boolean" | "count" | "duration"
  target: 120, // 120 minuti o 3 count
  weight: 5, // ⭐ NEW: 1-5 importance scale (default: 3)
  timeframe: "daily", // solo "daily" per MVP
  createdAt: "2026-02-01",
  color: "#4CAF50" // optional
}

// CheckIn Schema
{
  id: "uuid",
  habitId: "habit-uuid",
  date: "2026-02-01",
  value: 2, // count attuale o minuti
  completed: false, // true se ha raggiunto target
  timestamp: "2026-02-01T10:30:00Z"
}
```

---

## 7. Success Metrics

### Metriche di Apprendimento (Primarie)
- ✅ Progetto completato e funzionante
- ✅ Codice ben strutturato e commentato
- ✅ Comprensione concetti: React, state management, data persistence
- ✅ Progetto su GitHub con README professionale

### Metriche di Prodotto (Secondarie)
- **Engagement personale:** Uso quotidiano per 30+ giorni
- **Funzionalità:** Tutte le feature MVP implementate
- **Performance:** App responsive, < 2s loading time
- **UX:** Feedback positivo da 3-5 beta tester

---

## 8. Timeline e Milestones

### Fase 1: Setup e Fondamenta (Settimana 1)
- [ ] Setup progetto (Node.js, React/Vite o vanilla)
- [ ] Git/GitHub repository
- [ ] Struttura base file e cartelle
- [ ] UI mockup/wireframe (anche carta e penna va bene!)

### Fase 2: MVP Core Features (Settimana 2-3)
- [ ] Data model e LocalStorage
- [ ] CRUD abitudini (Create, Read, Update, Delete)
- [ ] Check-in functionality
- [ ] Calcolo streak
- [ ] Dashboard base

### Fase 3: UI/UX Polish (Settimana 4)
- [ ] Styling e design system
- [ ] Animazioni e micro-interactions
- [ ] Responsive design (mobile-friendly)
- [ ] Bug fixing

### Fase 4: Deploy e Iterazione (Settimana 5)
- [ ] Deploy su GitHub Pages/Vercel
- [ ] Testing con utenti reali
- [ ] Raccolta feedback
- [ ] Documentazione README

### Post-MVP
- Iterazioni basate su uso reale
- Feature V2 se necessario
- Eventuale migrazione a stack più avanzato

---

## 9. Rischi e Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Scope creep (troppe feature) | Alta | Alto | Focus rigoroso su MVP, PRD come guida |
| Complessità tecnica eccessiva | Media | Alto | Start simple (vanilla JS), iterate se necessario |
| Perdita motivazione | Media | Alto | Quick wins, milestone piccoli, progetto utile personalmente |
| Dati persi (LocalStorage) | Bassa | Medio | Warning all'utente, export/import in V2 |
| Apple Health troppo complesso | Alta | Basso | Spostato a V3, MVP non dipende da questo |

---

## 10. Open Questions

- [ ] React o vanilla JavaScript per MVP? (da decidere insieme)
- [ ] Preferenza su color scheme specifico?
- [ ] Funzionalità specifica mancante nel MVP che è must-have?
- [ ] Timeline aggressiva (2-3 settimane) o rilassata (1-2 mesi)?

---

## Appendix: Comparazione Competitor

### Market Research Summary
**Market Size:** USD $13.06B (2025) → $43.87B (2034), CAGR 14.41%
**Critical Challenge:** 52% abandon within 30 days, 44% quit after breaking streaks

### Competitor Comparison

| Feature | HBT | Habitica | Streaks | Loop | Notion | **Habit Tracker (nostro)** |
|---------|-----|----------|---------|------|--------|---------------------------|
| **Costo** | Freemium (paywall) | $5/mese | $5 once | **Gratis** | $10/mese | **Gratis + ads** ✅ |
| **Semplicità** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Habit Weighting** | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ UNIQUE!** 🆕 |
| **Weighted Dashboard** | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ UNIQUE!** 🆕 |
| **Metriche flessibili** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **⭐⭐⭐⭐** ✅ |
| **Cross-platform** | iOS only | ✅ | iOS only | Android only | ✅ | **✅ (Web MVP)** |
| **Privacy** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Retention Focus** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Apple Health** | ❓ | ❌ | ✅ | ❌ | ❌ | V2 (iOS) |

### Key Differentiators (MVP)
1. **⭐ Habit Weighting:** UNICA app che permette prioritization - risolve pain "all habits treated equally"
2. **⭐ Weighted Dashboard:** Completion % che riflette vere priorità, non solo conteggio
3. **Honest pricing:** Free tier genuinely useful (no "free-to-useless")
4. **Retention-first:** Designed per long-term success (compassionate streaks, no punishment)
5. **Rock-solid reliability:** Notifications e data che funzionano sempre (top complaint competitor)

---

**Versione PRD:** 1.0
**Data:** 2026-02-01
**Autore:** Jacopo (con supporto Claude)
**Status:** Draft - In Revisione
