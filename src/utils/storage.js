/**
 * LocalStorage Service - Habit Tracker
 * US-005: Persistence layer for habits and check-ins
 *
 * Features:
 * - Auto-save on every modification
 * - Schema versioning for future migrations
 * - Error handling (quota exceeded, disabled, corrupted)
 * - Graceful fallback to in-memory state
 */

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEY = 'habit-tracker-data'
const SCHEMA_VERSION = 1

// ============================================
// DATA MODEL (TypeScript-style JSDoc)
// ============================================

/**
 * @typedef {Object} Category
 * @property {string} id - UUID
 * @property {string} name - Nome categoria
 * @property {string} [icon] - Emoji icona (opzionale)
 * @property {string} [color] - Colore HEX (opzionale)
 */

/**
 * @typedef {Object} Habit
 * @property {string} id - UUID
 * @property {string} name - Nome abitudine
 * @property {'boolean' | 'count' | 'duration'} type - Tipo di metrica
 * @property {number} target - Target giornaliero (1 per boolean)
 * @property {number} weight - Peso/importanza 1-5 (default: 3)
 * @property {'daily'} timeframe - Solo 'daily' per MVP
 * @property {string} createdAt - ISO date string
 * @property {string} [color] - Colore HEX opzionale
 * @property {string} [categoryId] - ID categoria (opzionale, US-016)
 */

/**
 * @typedef {Object} CheckIn
 * @property {string} id - UUID
 * @property {string} habitId - Reference to Habit.id
 * @property {string} date - YYYY-MM-DD format
 * @property {number} value - Valore registrato
 * @property {boolean} completed - Se ha raggiunto il target
 * @property {string} timestamp - ISO datetime string
 */

/**
 * @typedef {Object} StorageData
 * @property {number} version - Schema version
 * @property {Habit[]} habits - Array of habits
 * @property {CheckIn[]} checkIns - Array of check-ins
 * @property {Category[]} categories - Array of categories (US-016)
 * @property {string} lastUpdated - ISO datetime of last save
 */

// ============================================
// DEFAULT CATEGORIES (US-016)
// ============================================

export const DEFAULT_CATEGORIES = [
  { id: 'cat-health', name: 'Salute & Fitness', icon: '🏃', color: '#22c55e' },
  { id: 'cat-productivity', name: 'Produttività & Lavoro', icon: '🧠', color: '#3b82f6' },
  { id: 'cat-finance', name: 'Finanze', icon: '💰', color: '#eab308' },
  { id: 'cat-social', name: 'Relazioni & Sociale', icon: '👥', color: '#ec4899' },
  { id: 'cat-learning', name: 'Apprendimento', icon: '📚', color: '#8b5cf6' },
  { id: 'cat-wellness', name: 'Benessere Mentale', icon: '🧘', color: '#14b8a6' },
  { id: 'cat-home', name: 'Casa & Organizzazione', icon: '🏠', color: '#f97316' },
  { id: 'cat-hobby', name: 'Hobby & Creatività', icon: '🎨', color: '#ef4444' },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Genera un UUID v4
 * @returns {string}
 */
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Restituisce la data odierna in formato YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Verifica se localStorage è disponibile
 * @returns {boolean}
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

// ============================================
// CORE STORAGE FUNCTIONS
// ============================================

/**
 * Crea struttura dati vuota con schema version
 * @returns {StorageData}
 */
function createEmptyData() {
  return {
    version: SCHEMA_VERSION,
    habits: [],
    checkIns: [],
    categories: [...DEFAULT_CATEGORIES], // Categorie preset (US-016)
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Migra dati da versioni precedenti (placeholder per future migrations)
 * @param {Object} data - Dati da migrare
 * @returns {StorageData}
 */
function migrateData(data) {
  // Aggiungi categories se mancante (US-016 migration)
  if (!data.categories) {
    data.categories = [...DEFAULT_CATEGORIES]
    console.log('[Storage] Migrazione: aggiunte categorie di default')
  }

  // Version 1 → 2 migration (esempio per futuro)
  // if (data.version === 1) {
  //   data.habits = data.habits.map(h => ({ ...h, newField: 'default' }));
  //   data.version = 2;
  // }

  return data
}

/**
 * Carica dati da localStorage
 * @returns {{ data: StorageData, error: string | null }}
 */
export function loadFromStorage() {
  // Check se localStorage disponibile
  if (!isStorageAvailable()) {
    console.warn('[Storage] localStorage non disponibile, usando stato in-memory')
    return { data: createEmptyData(), error: 'localStorage non disponibile' }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Nessun dato salvato → ritorna struttura vuota
    if (!raw) {
      return { data: createEmptyData(), error: null }
    }

    // Parse JSON
    const parsed = JSON.parse(raw)

    // Validazione base
    if (!parsed || typeof parsed !== 'object') {
      console.warn('[Storage] Dati corrotti, resetting')
      return { data: createEmptyData(), error: 'Dati corrotti, reset effettuato' }
    }

    // Migrazione se necessario
    const migrated = migrateData(parsed)

    return { data: migrated, error: null }
  } catch (e) {
    console.error('[Storage] Errore caricamento:', e)
    return { data: createEmptyData(), error: `Errore caricamento: ${e.message}` }
  }
}

/**
 * Salva dati in localStorage
 * @param {StorageData} data - Dati da salvare
 * @returns {{ success: boolean, error: string | null }}
 */
export function saveToStorage(data) {
  if (!isStorageAvailable()) {
    console.warn('[Storage] localStorage non disponibile')
    return { success: false, error: 'localStorage non disponibile' }
  }

  try {
    // Aggiorna timestamp
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    return { success: true, error: null }
  } catch (e) {
    // Gestione quota exceeded
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('[Storage] Quota localStorage superata')
      return { success: false, error: 'Spazio di archiviazione esaurito' }
    }

    console.error('[Storage] Errore salvataggio:', e)
    return { success: false, error: `Errore salvataggio: ${e.message}` }
  }
}

/**
 * Cancella tutti i dati (con conferma)
 * @returns {{ success: boolean, error: string | null }}
 */
export function clearStorage() {
  if (!isStorageAvailable()) {
    return { success: false, error: 'localStorage non disponibile' }
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
    return { success: true, error: null }
  } catch (e) {
    console.error('[Storage] Errore cancellazione:', e)
    return { success: false, error: `Errore cancellazione: ${e.message}` }
  }
}

// ============================================
// HABIT CRUD OPERATIONS
// ============================================

/**
 * Crea una nuova abitudine
 * @param {Omit<Habit, 'id' | 'createdAt'>} habitData
 * @returns {Habit}
 */
export function createHabit(habitData) {
  return {
    id: generateId(),
    name: habitData.name,
    type: habitData.type || 'boolean',
    target: habitData.target || 1,
    weight: habitData.weight ?? 3, // Default peso medio
    timeframe: 'daily',
    createdAt: new Date().toISOString(),
    color: habitData.color || null,
    unit: habitData.unit || '', // US-015: unità di misura
    categoryId: habitData.categoryId || null, // US-016: categoria
  }
}

/**
 * Aggiunge una nuova abitudine e salva
 * @param {StorageData} data - Stato attuale
 * @param {Omit<Habit, 'id' | 'createdAt'>} habitData - Dati nuova abitudine
 * @returns {{ data: StorageData, habit: Habit, error: string | null }}
 */
export function addHabit(data, habitData) {
  const newHabit = createHabit(habitData)
  const newData = {
    ...data,
    habits: [...data.habits, newHabit],
  }

  const { error } = saveToStorage(newData)
  return { data: newData, habit: newHabit, error }
}

/**
 * Aggiorna un'abitudine esistente
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine da aggiornare
 * @param {Partial<Habit>} updates - Campi da aggiornare
 * @returns {{ data: StorageData, error: string | null }}
 */
export function updateHabit(data, habitId, updates) {
  const newData = {
    ...data,
    habits: data.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
  }

  const { error } = saveToStorage(newData)
  return { data: newData, error }
}

/**
 * Elimina un'abitudine e tutti i suoi check-in
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine da eliminare
 * @returns {{ data: StorageData, error: string | null }}
 */
export function deleteHabit(data, habitId) {
  const newData = {
    ...data,
    habits: data.habits.filter((h) => h.id !== habitId),
    checkIns: data.checkIns.filter((c) => c.habitId !== habitId),
  }

  const { error } = saveToStorage(newData)
  return { data: newData, error }
}

// ============================================
// CATEGORY CRUD OPERATIONS (US-016)
// ============================================

/**
 * Aggiunge una nuova categoria
 * @param {StorageData} data - Stato attuale
 * @param {{ name: string, icon?: string, color?: string }} categoryData
 * @returns {{ data: StorageData, category: Category, error: string | null }}
 */
export function addCategory(data, categoryData) {
  const newCategory = {
    id: generateId(),
    name: categoryData.name,
    icon: categoryData.icon || '',
    color: categoryData.color || '#6b7280',
  }

  const newData = {
    ...data,
    categories: [...(data.categories || []), newCategory],
  }

  const { error } = saveToStorage(newData)
  return { data: newData, category: newCategory, error }
}

/**
 * Aggiorna una categoria esistente
 * @param {StorageData} data - Stato attuale
 * @param {string} categoryId - ID categoria
 * @param {Partial<Category>} updates - Campi da aggiornare
 * @returns {{ data: StorageData, error: string | null }}
 */
export function updateCategory(data, categoryId, updates) {
  const newData = {
    ...data,
    categories: (data.categories || []).map((c) =>
      c.id === categoryId ? { ...c, ...updates } : c
    ),
  }

  const { error } = saveToStorage(newData)
  return { data: newData, error }
}

/**
 * Elimina una categoria (le abitudini rimangono senza categoria)
 * @param {StorageData} data - Stato attuale
 * @param {string} categoryId - ID categoria da eliminare
 * @returns {{ data: StorageData, error: string | null }}
 */
export function deleteCategory(data, categoryId) {
  const newData = {
    ...data,
    categories: (data.categories || []).filter((c) => c.id !== categoryId),
    // Rimuovi categoryId dalle abitudini che la usavano
    habits: data.habits.map((h) => (h.categoryId === categoryId ? { ...h, categoryId: null } : h)),
  }

  const { error } = saveToStorage(newData)
  return { data: newData, error }
}

/**
 * Ottiene una categoria per ID
 * @param {StorageData} data - Stato attuale
 * @param {string} categoryId - ID categoria
 * @returns {Category | null}
 */
export function getCategory(data, categoryId) {
  if (!categoryId) return null
  return (data.categories || []).find((c) => c.id === categoryId) || null
}

// ============================================
// CHECK-IN OPERATIONS
// ============================================

/**
 * Registra o aggiorna un check-in per una data specifica
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @param {number} value - Valore registrato
 * @param {string} [date] - Data YYYY-MM-DD (default: oggi)
 * @returns {{ data: StorageData, checkIn: CheckIn, error: string | null }}
 */
export function recordCheckIn(data, habitId, value, date = getTodayDate()) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) {
    return { data, checkIn: null, error: 'Abitudine non trovata' }
  }

  // Cerca check-in esistente per questa data
  const existingIndex = data.checkIns.findIndex((c) => c.habitId === habitId && c.date === date)

  const checkIn = {
    id: existingIndex >= 0 ? data.checkIns[existingIndex].id : generateId(),
    habitId,
    date,
    value,
    completed: value >= habit.target,
    timestamp: new Date().toISOString(),
  }

  let newCheckIns
  if (existingIndex >= 0) {
    // Aggiorna esistente
    newCheckIns = [...data.checkIns]
    newCheckIns[existingIndex] = checkIn
  } else {
    // Aggiungi nuovo
    newCheckIns = [...data.checkIns, checkIn]
  }

  const newData = { ...data, checkIns: newCheckIns }
  const { error } = saveToStorage(newData)

  return { data: newData, checkIn, error }
}

/**
 * Ottiene il check-in di un'abitudine per una data specifica
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @param {string} [date] - Data YYYY-MM-DD (default: oggi)
 * @returns {CheckIn | null}
 */
export function getCheckIn(data, habitId, date = getTodayDate()) {
  return data.checkIns.find((c) => c.habitId === habitId && c.date === date) || null
}

/**
 * Ottiene tutti i check-in di oggi
 * @param {StorageData} data - Stato attuale
 * @returns {CheckIn[]}
 */
export function getTodayCheckIns(data) {
  const today = getTodayDate()
  return data.checkIns.filter((c) => c.date === today)
}

// ============================================
// PROGRESS CALCULATIONS
// ============================================

/**
 * Calcola la percentuale di completamento per un'abitudine oggi
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @returns {number} Percentuale 0-100
 */
export function getHabitCompletionPercent(data, habitId) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return 0

  const checkIn = getCheckIn(data, habitId)
  if (!checkIn) return 0

  return Math.min(100, (checkIn.value / habit.target) * 100)
}

/**
 * Calcola il progresso pesato giornaliero (US-001 formula)
 * Formula: Σ(peso × completion%) / Σ pesi_totali
 * @param {StorageData} data - Stato attuale
 * @returns {{ percent: number, completed: number, total: number }}
 */
export function getWeightedDailyProgress(data) {
  if (data.habits.length === 0) {
    return { percent: 0, completed: 0, total: 0 }
  }

  let weightedSum = 0
  let totalWeight = 0
  let completedCount = 0

  for (const habit of data.habits) {
    const completionPercent = getHabitCompletionPercent(data, habit.id) / 100
    weightedSum += habit.weight * completionPercent
    totalWeight += habit.weight

    if (completionPercent >= 1) {
      completedCount++
    }
  }

  const percent = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0

  return {
    percent: Math.round(percent * 10) / 10, // 1 decimal
    completed: completedCount,
    total: data.habits.length,
  }
}

// ============================================
// PERIOD PROGRESS CALCULATIONS (US-018)
// ============================================

/**
 * Calcola la percentuale di completamento per un'abitudine in una data specifica
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @param {string} date - Data YYYY-MM-DD
 * @returns {number} Percentuale 0-100
 */
export function getHabitCompletionPercentForDate(data, habitId, date) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return 0

  const checkIn = getCheckIn(data, habitId, date)
  if (!checkIn) return 0

  return Math.min(100, (checkIn.value / habit.target) * 100)
}

/**
 * Calcola il progresso pesato per una data specifica
 * Formula: Σ(peso × completion%) / Σ pesi_totali
 * @param {StorageData} data - Stato attuale
 * @param {string} date - Data YYYY-MM-DD
 * @returns {{ percent: number, completed: number, total: number, hasData: boolean }}
 */
export function getWeightedProgressForDate(data, date) {
  if (data.habits.length === 0) {
    return { percent: 0, completed: 0, total: 0, hasData: false }
  }

  let weightedSum = 0
  let totalWeight = 0
  let completedCount = 0
  let hasAnyCheckIn = false

  for (const habit of data.habits) {
    // Salta abitudini create dopo questa data
    const createdAt = habit.createdAt.split('T')[0]
    if (createdAt > date) continue

    const completionPercent = getHabitCompletionPercentForDate(data, habit.id, date) / 100

    // Verifica se c'è almeno un check-in per questa data
    const checkIn = getCheckIn(data, habit.id, date)
    if (checkIn) hasAnyCheckIn = true

    weightedSum += habit.weight * completionPercent
    totalWeight += habit.weight

    if (completionPercent >= 1) {
      completedCount++
    }
  }

  const percent = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0

  return {
    percent: Math.round(percent * 10) / 10,
    completed: completedCount,
    total: data.habits.filter((h) => h.createdAt.split('T')[0] <= date).length,
    hasData: hasAnyCheckIn,
  }
}

/**
 * Calcola il progresso pesato settimanale (media ultimi 7 giorni)
 * Formula: Σ(daily_weighted_progress) / days_with_data
 * @param {StorageData} data - Stato attuale
 * @returns {{ percent: number, daysWithData: number, dailyBreakdown: Array<{ date: string, percent: number }> }}
 */
export function getWeeklyProgress(data) {
  const days = getLastNDays(7)
  const dailyBreakdown = []
  let totalPercent = 0
  let daysWithData = 0

  for (const date of days) {
    const dayProgress = getWeightedProgressForDate(data, date)
    dailyBreakdown.push({
      date,
      percent: dayProgress.percent,
      hasData: dayProgress.hasData,
    })

    // Includi nel calcolo solo se ha dati
    if (dayProgress.hasData || dayProgress.total > 0) {
      totalPercent += dayProgress.percent
      daysWithData++
    }
  }

  const percent = daysWithData > 0 ? totalPercent / daysWithData : 0

  return {
    percent: Math.round(percent * 10) / 10,
    daysWithData,
    totalDays: 7,
    dailyBreakdown,
  }
}

/**
 * Calcola il progresso pesato mensile (media ultimi 30 giorni)
 * Formula: Σ(daily_weighted_progress) / days_with_data
 * @param {StorageData} data - Stato attuale
 * @returns {{ percent: number, daysWithData: number, dailyBreakdown: Array<{ date: string, percent: number }> }}
 */
export function getMonthlyProgress(data) {
  const days = getLastNDays(30)
  const dailyBreakdown = []
  let totalPercent = 0
  let daysWithData = 0

  for (const date of days) {
    const dayProgress = getWeightedProgressForDate(data, date)
    dailyBreakdown.push({
      date,
      percent: dayProgress.percent,
      hasData: dayProgress.hasData,
    })

    // Includi nel calcolo solo se ha dati
    if (dayProgress.hasData || dayProgress.total > 0) {
      totalPercent += dayProgress.percent
      daysWithData++
    }
  }

  const percent = daysWithData > 0 ? totalPercent / daysWithData : 0

  return {
    percent: Math.round(percent * 10) / 10,
    daysWithData,
    totalDays: 30,
    dailyBreakdown,
  }
}

// ============================================
// CONTEXTUAL PROGRESS CALCULATIONS (US-019)
// ============================================

/**
 * Genera un array di N date che terminano con la data specificata
 * @param {number} days - Numero di giorni
 * @param {string} endDate - Data finale (formato YYYY-MM-DD)
 * @returns {string[]} Array di date YYYY-MM-DD (dal più recente al più vecchio)
 */
export function getLastNDaysFromDate(days, endDate) {
  const dates = []
  const end = new Date(endDate)

  for (let i = 0; i < days; i++) {
    const date = new Date(end)
    date.setDate(end.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

/**
 * Calcola il progresso pesato per N giorni che terminano con endDate
 * Funzione interna per DRY (Don't Repeat Yourself)
 * @private
 * @param {StorageData} data - Stato attuale
 * @param {string} endDate - Data finale (formato YYYY-MM-DD)
 * @param {number} numDays - Numero di giorni (7 per settimana, 30 per mese)
 * @returns {{ percent: number, daysWithData: number, totalDays: number, dailyBreakdown: Array }}
 */
function getPeriodProgressForDate(data, endDate, numDays) {
  const days = getLastNDaysFromDate(numDays, endDate)
  const dailyBreakdown = []
  let totalPercent = 0
  let daysWithData = 0

  for (const date of days) {
    const dayProgress = getWeightedProgressForDate(data, date)
    dailyBreakdown.push({
      date,
      percent: dayProgress.percent,
      hasData: dayProgress.hasData,
    })

    if (dayProgress.hasData || dayProgress.total > 0) {
      totalPercent += dayProgress.percent
      daysWithData++
    }
  }

  const percent = daysWithData > 0 ? totalPercent / daysWithData : 0

  return {
    percent: Math.round(percent * 10) / 10,
    daysWithData,
    totalDays: numDays,
    dailyBreakdown,
  }
}

/**
 * Calcola il progresso pesato settimanale per una data specifica
 * Ultimi 7 giorni con endDate come ultimo giorno
 */
export function getWeeklyProgressForDate(data, endDate) {
  return getPeriodProgressForDate(data, endDate, 7)
}

/**
 * Calcola il progresso pesato mensile per una data specifica
 * Ultimi 30 giorni con endDate come ultimo giorno
 */
export function getMonthlyProgressForDate(data, endDate) {
  return getPeriodProgressForDate(data, endDate, 30)
}

// ============================================
// FIXED PERIOD PROGRESS CALCULATIONS (US-020)
// ============================================

/**
 * Genera tutte le date di un mese specifico
 * @param {number} year - Anno (es. 2026)
 * @param {number} month - Mese 1-12 (1 = Gennaio)
 * @returns {string[]} Array di date YYYY-MM-DD
 */
export function getMonthDates(year, month) {
  const dates = []
  // JavaScript usa mesi 0-indexed, quindi month-1
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

/**
 * Genera tutte le date di una settimana specifica (Lunedì-Domenica)
 * @param {string} startDate - Data del Lunedì (YYYY-MM-DD)
 * @returns {string[]} Array di 7 date YYYY-MM-DD (Lun-Dom)
 */
export function getWeekDates(startDate) {
  const dates = []
  const start = new Date(startDate)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

/**
 * Calcola il progresso pesato per un mese specifico (US-020)
 * @param {StorageData} data - Stato attuale
 * @param {number} year - Anno
 * @param {number} month - Mese 1-12
 * @returns {{ percent: number, daysWithData: number, totalDays: number, dailyBreakdown: Array }}
 */
export function getCalendarMonthProgress(data, year, month) {
  const dates = getMonthDates(year, month)
  const today = getTodayDate()
  const dailyBreakdown = []
  let totalPercent = 0
  let daysWithData = 0

  for (const date of dates) {
    // Salta date future
    if (date > today) {
      dailyBreakdown.push({ date, percent: null, hasData: false, isFuture: true })
      continue
    }

    const dayProgress = getWeightedProgressForDate(data, date)
    dailyBreakdown.push({
      date,
      percent: dayProgress.percent,
      hasData: dayProgress.hasData,
      isFuture: false,
    })

    if (dayProgress.hasData || dayProgress.total > 0) {
      totalPercent += dayProgress.percent
      daysWithData++
    }
  }

  const percent = daysWithData > 0 ? totalPercent / daysWithData : 0

  return {
    percent: Math.round(percent * 10) / 10,
    daysWithData,
    totalDays: dates.filter((d) => d <= today).length,
    dailyBreakdown,
    year,
    month,
  }
}

/**
 * Calcola il progresso pesato per una settimana specifica (Lun-Dom) (US-020)
 * @param {StorageData} data - Stato attuale
 * @param {string} mondayDate - Data del Lunedì (YYYY-MM-DD)
 * @returns {{ percent: number, daysWithData: number, totalDays: number, dailyBreakdown: Array }}
 */
export function getCalendarWeekProgress(data, mondayDate) {
  const dates = getWeekDates(mondayDate)
  const today = getTodayDate()
  const dailyBreakdown = []
  let totalPercent = 0
  let daysWithData = 0

  for (const date of dates) {
    // Salta date future
    if (date > today) {
      dailyBreakdown.push({ date, percent: null, hasData: false, isFuture: true })
      continue
    }

    const dayProgress = getWeightedProgressForDate(data, date)
    dailyBreakdown.push({
      date,
      percent: dayProgress.percent,
      hasData: dayProgress.hasData,
      isFuture: false,
    })

    if (dayProgress.hasData || dayProgress.total > 0) {
      totalPercent += dayProgress.percent
      daysWithData++
    }
  }

  const percent = daysWithData > 0 ? totalPercent / daysWithData : 0

  return {
    percent: Math.round(percent * 10) / 10,
    daysWithData,
    totalDays: dates.filter((d) => d <= today).length,
    dailyBreakdown,
    startDate: mondayDate,
    endDate: dates[6],
  }
}

/**
 * Ottiene il Lunedì di una settimana dato un anno e numero settimana ISO
 * @param {number} year - Anno
 * @param {number} week - Numero settimana ISO (1-53)
 * @returns {string} Data del Lunedì YYYY-MM-DD
 */
export function getMondayOfWeek(year, week) {
  // Primo Gennaio dell'anno
  const jan1 = new Date(year, 0, 1)
  // Giorno della settimana (0=Dom, 1=Lun, ...)
  const jan1Day = jan1.getDay()
  // Calcola offset per arrivare al primo Lunedì
  const daysToFirstMonday = jan1Day <= 1 ? 1 - jan1Day : 8 - jan1Day
  // Primo Lunedì dell'anno
  const firstMonday = new Date(year, 0, 1 + daysToFirstMonday)
  // Aggiungi (week-1) * 7 giorni
  const targetMonday = new Date(firstMonday)
  targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7)

  return targetMonday.toISOString().split('T')[0]
}

/**
 * Ottiene il numero della settimana ISO da una data
 * @param {string} dateStr - Data YYYY-MM-DD
 * @returns {{ year: number, week: number }}
 */
export function getWeekNumber(dateStr) {
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  // Giovedì della stessa settimana determina l'anno della settimana
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // Prima settimana dell'anno contiene il primo Giovedì
  const week1 = new Date(date.getFullYear(), 0, 4)
  // Calcola numero settimana
  const weekNum = 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)

  return { year: date.getFullYear(), week: weekNum }
}

/**
 * Genera lista di settimane per un anno (per picker)
 * @param {number} year - Anno
 * @returns {Array<{ week: number, monday: string, label: string }>}
 */
export function getWeeksOfYear(year) {
  const weeks = []
  const today = getTodayDate()

  for (let week = 1; week <= 53; week++) {
    const monday = getMondayOfWeek(year, week)
    // Se il Lunedì è dell'anno successivo, fermati
    if (new Date(monday).getFullYear() > year) break
    // Se la settimana è nel futuro, fermati
    if (monday > today) break

    const sundayDate = new Date(monday)
    sundayDate.setDate(sundayDate.getDate() + 6)
    const sunday = sundayDate.toISOString().split('T')[0]

    // Formatta label (es: "3-9 Feb")
    const monDate = new Date(monday)
    const sunDate = new Date(sunday)
    const monthNames = [
      'Gen',
      'Feb',
      'Mar',
      'Apr',
      'Mag',
      'Giu',
      'Lug',
      'Ago',
      'Set',
      'Ott',
      'Nov',
      'Dic',
    ]

    let label
    if (monDate.getMonth() === sunDate.getMonth()) {
      label = `${monDate.getDate()}-${sunDate.getDate()} ${monthNames[monDate.getMonth()]}`
    } else {
      label = `${monDate.getDate()} ${monthNames[monDate.getMonth()]} - ${sunDate.getDate()} ${monthNames[sunDate.getMonth()]}`
    }

    weeks.push({ week, monday, sunday, label })
  }

  return weeks // Ordine cronologico: prima settimana in alto
}

// ============================================
// STREAK & HISTORY CALCULATIONS (US-008)
// ============================================

/**
 * Genera un array di date negli ultimi N giorni
 * @param {number} days - Numero di giorni
 * @returns {string[]} Array di date YYYY-MM-DD (dal più recente al più vecchio)
 */
export function getLastNDays(days) {
  const dates = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  return dates
}

/**
 * Ottiene tutti i check-in di un'abitudine come mappa per lookup O(1)
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @returns {Map<string, CheckIn>} Mappa data → check-in
 */
export function getHabitHistory(data, habitId) {
  const checkInsMap = new Map()

  // Filtra check-in per questa abitudine e crea mappa per lookup O(1)
  for (const checkIn of data.checkIns) {
    if (checkIn.habitId === habitId) {
      checkInsMap.set(checkIn.date, checkIn)
    }
  }

  return checkInsMap
}

/**
 * Calcola lo streak corrente (giorni consecutivi completati)
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @returns {number} Numero di giorni consecutivi
 */
export function calculateCurrentStreak(data, habitId) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return 0

  const checkInsMap = getHabitHistory(data, habitId)
  let streak = 0
  const today = new Date()

  // Parti da oggi e vai indietro
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const checkIn = checkInsMap.get(dateStr)

    // Se è oggi e non c'è check-in, salta (streak non rotto)
    if (i === 0 && !checkIn) continue

    // Se completato, incrementa streak
    if (checkIn && checkIn.value >= habit.target) {
      streak++
    } else {
      // Streak rotto
      break
    }
  }

  return streak
}

/**
 * Calcola lo streak più lungo di sempre
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @returns {number} Streak più lungo
 */
export function calculateLongestStreak(data, habitId) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return 0

  // Ordina check-in per data
  const habitCheckIns = data.checkIns
    .filter((c) => c.habitId === habitId && c.value >= habit.target)
    .map((c) => c.date)
    .sort()

  if (habitCheckIns.length === 0) return 0

  let longest = 1
  let current = 1

  for (let i = 1; i < habitCheckIns.length; i++) {
    const prevDate = new Date(habitCheckIns[i - 1])
    const currDate = new Date(habitCheckIns[i])

    // Calcola differenza in giorni
    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // Giorni consecutivi
      current++
      longest = Math.max(longest, current)
    } else {
      // Streak rotto
      current = 1
    }
  }

  return longest
}

/**
 * Calcola il completion rate su un periodo
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @param {number} [days=30] - Numero di giorni
 * @returns {number} Percentuale 0-100
 */
export function calculateCompletionRate(data, habitId, days = 30) {
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return 0

  const checkInsMap = getHabitHistory(data, habitId)
  const dates = getLastNDays(days)

  // Conta solo i giorni dopo la creazione dell'abitudine
  const createdAt = habit.createdAt.split('T')[0]
  let completedDays = 0
  let countableDays = 0

  for (const date of dates) {
    // Non contare giorni prima della creazione
    if (date < createdAt) continue

    countableDays++
    const checkIn = checkInsMap.get(date)

    if (checkIn && checkIn.value >= habit.target) {
      completedDays++
    }
  }

  if (countableDays === 0) return 0
  return Math.round((completedDays / countableDays) * 100)
}

/**
 * Ottiene statistiche complete per un'abitudine
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @returns {{ currentStreak: number, longestStreak: number, completionRate: number, history: Map<string, CheckIn> }}
 */
export function getHabitStats(data, habitId) {
  return {
    currentStreak: calculateCurrentStreak(data, habitId),
    longestStreak: calculateLongestStreak(data, habitId),
    completionRate: calculateCompletionRate(data, habitId, 30),
    history: getHabitHistory(data, habitId),
  }
}

// ============================================
// DEBUG UTILITIES (per testing streak)
// ============================================

/**
 * [DEBUG] Genera check-in finti per testare streak e statistiche
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine
 * @param {number} daysBack - Quanti giorni indietro simulare
 * @param {number} successRate - Percentuale successo (0-100), default 80%
 * @returns {{ data: StorageData, error: string|null }}
 */
export function debugGenerateFakeCheckIns(data, habitId, daysBack = 14, successRate = 80) {
  try {
    // Validazione input
    if (!data || !data.habits || !data.checkIns) {
      console.error('[DEBUG] Data invalida:', data)
      return { data, error: 'Dati non validi' }
    }

    const habit = data.habits.find((h) => h.id === habitId)
    if (!habit) {
      console.error('[DEBUG] Habit non trovata:', habitId)
      return { data, error: 'Abitudine non trovata' }
    }

    const newCheckIns = [...data.checkIns]
    const today = new Date()

    for (let i = 1; i <= daysBack; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Salta se esiste già un check-in per questa data
      const existing = newCheckIns.find((c) => c.habitId === habitId && c.date === dateStr)
      if (existing) continue

      // Simula completamento basato su successRate
      const isSuccess = Math.random() * 100 < successRate
      const value = isSuccess ? habit.target : 0

      if (value > 0) {
        newCheckIns.push({
          id: generateId(),
          habitId,
          date: dateStr,
          value,
          completed: true,
          timestamp: date.toISOString(),
        })
      }
    }

    // Preserva tutti i campi di data
    const newData = {
      ...data,
      checkIns: newCheckIns,
    }

    const { error: saveError } = saveToStorage(newData)
    console.log('[DEBUG] Generati check-in finti:', newCheckIns.length - data.checkIns.length)

    return { data: newData, error: saveError }
  } catch (error) {
    console.error('[DEBUG] Errore in debugGenerateFakeCheckIns:', error)
    return { data, error: error.message }
  }
}

/**
 * [DEBUG] Pulisce tutti i check-in finti (mantiene solo oggi)
 * @param {StorageData} data - Stato attuale
 * @param {string} habitId - ID abitudine (opzionale, se null pulisce tutti)
 * @returns {{ data: StorageData, error: string|null }}
 */
export function debugClearFakeCheckIns(data, habitId = null) {
  try {
    // Validazione input
    if (!data || !data.habits || !data.checkIns) {
      console.error('[DEBUG] Data invalida:', data)
      return { data, error: 'Dati non validi' }
    }

    const today = getTodayDate()
    console.log('[DEBUG] Oggi:', today, '- Pulisco storico per habitId:', habitId || 'TUTTI')

    const newCheckIns = data.checkIns.filter((c) => {
      // Mantieni check-in di oggi
      if (c.date === today) return true
      // Se specificato habitId, filtra solo quella abitudine
      if (habitId && c.habitId !== habitId) return true
      // Altrimenti rimuovi
      return false
    })

    // Preserva tutti i campi di data
    const newData = {
      ...data,
      checkIns: newCheckIns,
    }

    const { error: saveError } = saveToStorage(newData)
    console.log('[DEBUG] Check-in rimossi:', data.checkIns.length - newCheckIns.length)

    return { data: newData, error: saveError }
  } catch (error) {
    console.error('[DEBUG] Errore in debugClearFakeCheckIns:', error)
    return { data, error: error.message }
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // Core
  loadFromStorage,
  saveToStorage,
  clearStorage,
  // Utilities
  generateId,
  getTodayDate,
  getLastNDays,
  // Habits
  createHabit,
  addHabit,
  updateHabit,
  deleteHabit,
  // Check-ins
  recordCheckIn,
  getCheckIn,
  getTodayCheckIns,
  // Progress
  getHabitCompletionPercent,
  getWeightedDailyProgress,
  // Period Progress (US-018)
  getWeightedProgressForDate,
  getWeeklyProgress,
  getMonthlyProgress,
  // Contextual Progress (US-019)
  getLastNDaysFromDate,
  getWeeklyProgressForDate,
  getMonthlyProgressForDate,
  // Fixed Period Progress (US-020)
  getMonthDates,
  getWeekDates,
  getCalendarMonthProgress,
  getCalendarWeekProgress,
  getMondayOfWeek,
  getWeekNumber,
  getWeeksOfYear,
  // Streak & History (US-008)
  getHabitHistory,
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateCompletionRate,
  getHabitStats,
}
