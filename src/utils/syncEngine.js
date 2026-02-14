/**
 * Sync Engine - Weighbit
 * US-021: Cloud synchronization with Supabase
 *
 * Architettura:
 * - localStorage = cache locale (UI istantanea)
 * - Supabase = source of truth (quando online)
 * - Offline queue = operazioni in attesa di sync
 *
 * Strategia: Offline-first con cloud sync
 * Conflict resolution: Last-write-wins (basato su updated_at)
 */

import { supabase } from '../lib/supabase'

// ============================================
// CONSTANTS
// ============================================

const OFFLINE_QUEUE_KEY = 'weighbit-offline-queue'
const LAST_SYNC_KEY = 'weighbit-last-sync'

// ============================================
// ONLINE/OFFLINE DETECTION
// ============================================

/**
 * Verifica se il browser è online
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine
}

/**
 * Listener per cambiamenti di connessione
 * @param {(online: boolean) => void} callback
 * @returns {() => void} Cleanup function
 */
export function onConnectivityChange(callback) {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

// ============================================
// OFFLINE QUEUE MANAGEMENT
// ============================================

/**
 * Ottiene la coda delle operazioni offline
 * @returns {Array<{ type: string, table: string, data: object, timestamp: string }>}
 */
export function getOfflineQueue() {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY)
    return queue ? JSON.parse(queue) : []
  } catch {
    return []
  }
}

/**
 * Aggiunge un'operazione alla coda offline
 * @param {'insert' | 'update' | 'delete'} type
 * @param {'habits' | 'check_ins' | 'categories'} table
 * @param {object} data
 */
export function addToOfflineQueue(type, table, data) {
  const queue = getOfflineQueue()
  queue.push({
    type,
    table,
    data,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
  console.log('[SyncEngine] Aggiunto alla coda offline:', { type, table })
}

/**
 * Svuota la coda offline
 */
export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY)
}

/**
 * Processa la coda offline (quando torna online)
 * @param {string} userId
 * @returns {Promise<{ success: boolean, processed: number, errors: string[] }>}
 */
export async function processOfflineQueue(userId) {
  const queue = getOfflineQueue()
  if (queue.length === 0) {
    return { success: true, processed: 0, errors: [] }
  }

  console.log('[SyncEngine] Processing offline queue:', queue.length, 'operazioni')
  const errors = []
  let processed = 0

  for (const operation of queue) {
    try {
      const { type, table, data } = operation

      switch (type) {
        case 'insert':
          await supabase.from(table).insert({ ...data, user_id: userId })
          break
        case 'update':
          await supabase.from(table).update(data).eq('id', data.id).eq('user_id', userId)
          break
        case 'delete':
          await supabase.from(table).delete().eq('id', data.id).eq('user_id', userId)
          break
      }
      processed++
    } catch (error) {
      errors.push(`${operation.type} ${operation.table}: ${error.message}`)
    }
  }

  // Svuota coda se tutto ok
  if (errors.length === 0) {
    clearOfflineQueue()
  }

  return { success: errors.length === 0, processed, errors }
}

// ============================================
// SUPABASE SYNC OPERATIONS - HABITS
// ============================================

/**
 * Carica tutti gli habits dell'utente da Supabase
 * @param {string} userId
 * @returns {Promise<{ data: Array, error: string | null }>}
 */
export async function fetchHabitsFromCloud(userId) {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Trasforma da snake_case Supabase a camelCase locale
    const habits = (data || []).map(transformHabitFromCloud)

    return { data: habits, error: null }
  } catch (error) {
    console.error('[SyncEngine] fetchHabitsFromCloud error:', error)
    return { data: [], error: error.message }
  }
}

/**
 * Salva un habit su Supabase (insert o update)
 * @param {string} userId
 * @param {object} habit - Habit in formato locale (camelCase)
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function syncHabitToCloud(userId, habit) {
  if (!isOnline()) {
    addToOfflineQueue('insert', 'habits', transformHabitToCloud(habit))
    return { success: true, error: null, offline: true }
  }

  try {
    const cloudHabit = transformHabitToCloud(habit)
    cloudHabit.user_id = userId

    console.log('[SyncEngine] Uploading habit:', cloudHabit)

    const { error, data } = await supabase.from('habits').upsert(cloudHabit, {
      onConflict: 'id',
    })

    if (error) {
      console.error('[SyncEngine] Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      throw error
    }

    console.log('[SyncEngine] Habit uploaded successfully:', data)
    return { success: true, error: null }
  } catch (error) {
    console.error('[SyncEngine] syncHabitToCloud error:', error)
    // Fallback a offline queue
    addToOfflineQueue('insert', 'habits', transformHabitToCloud(habit))
    return { success: false, error: error.message }
  }
}

/**
 * Elimina un habit da Supabase
 * @param {string} userId
 * @param {string} habitId
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function deleteHabitFromCloud(userId, habitId) {
  if (!isOnline()) {
    addToOfflineQueue('delete', 'habits', { id: habitId })
    return { success: true, error: null, offline: true }
  }

  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('[SyncEngine] deleteHabitFromCloud error:', error)
    return { success: false, error: error.message }
  }
}

// ============================================
// SUPABASE SYNC OPERATIONS - CHECK-INS
// ============================================

/**
 * Carica tutti i check-ins dell'utente da Supabase
 * @param {string} userId
 * @returns {Promise<{ data: Array, error: string | null }>}
 */
export async function fetchCheckInsFromCloud(userId) {
  try {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error

    const checkIns = (data || []).map(transformCheckInFromCloud)
    return { data: checkIns, error: null }
  } catch (error) {
    console.error('[SyncEngine] fetchCheckInsFromCloud error:', error)
    return { data: [], error: error.message }
  }
}

/**
 * Salva un check-in su Supabase (upsert basato su user_id + habit_id + date)
 * @param {string} userId
 * @param {object} checkIn
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function syncCheckInToCloud(userId, checkIn) {
  if (!isOnline()) {
    addToOfflineQueue('insert', 'check_ins', transformCheckInToCloud(checkIn))
    return { success: true, error: null, offline: true }
  }

  try {
    const cloudCheckIn = transformCheckInToCloud(checkIn)
    cloudCheckIn.user_id = userId

    // Upsert basato su constraint UNIQUE(user_id, habit_id, date)
    const { error } = await supabase.from('check_ins').upsert(cloudCheckIn, {
      onConflict: 'user_id,habit_id,date',
    })

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('[SyncEngine] syncCheckInToCloud error:', error)
    addToOfflineQueue('insert', 'check_ins', transformCheckInToCloud(checkIn))
    return { success: false, error: error.message }
  }
}

// ============================================
// SUPABASE SYNC OPERATIONS - CATEGORIES
// ============================================

/**
 * Carica tutte le categorie dell'utente da Supabase
 * @param {string} userId
 * @returns {Promise<{ data: Array, error: string | null }>}
 */
export async function fetchCategoriesFromCloud(userId) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error

    const categories = (data || []).map(transformCategoryFromCloud)
    return { data: categories, error: null }
  } catch (error) {
    console.error('[SyncEngine] fetchCategoriesFromCloud error:', error)
    return { data: [], error: error.message }
  }
}

/**
 * Salva una categoria su Supabase
 * @param {string} userId
 * @param {object} category
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function syncCategoryToCloud(userId, category) {
  if (!isOnline()) {
    addToOfflineQueue('insert', 'categories', transformCategoryToCloud(category))
    return { success: true, error: null, offline: true }
  }

  try {
    const cloudCategory = transformCategoryToCloud(category)
    cloudCategory.user_id = userId

    const { error } = await supabase.from('categories').upsert(cloudCategory, {
      onConflict: 'id',
    })

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('[SyncEngine] syncCategoryToCloud error:', error)
    return { success: false, error: error.message }
  }
}

// ============================================
// FULL SYNC (Download + Upload)
// ============================================

/**
 * Sincronizzazione completa: scarica dati cloud e merge con locali
 * @param {string} userId
 * @param {object} localData - Dati locali da storage.js
 * @returns {Promise<{ data: object, error: string | null }>}
 */
export async function fullSync(userId, localData) {
  console.log('[SyncEngine] Avvio full sync per utente:', userId)

  if (!isOnline()) {
    console.log('[SyncEngine] Offline, skip full sync')
    return { data: localData, error: 'Offline' }
  }

  try {
    // 1. Processa coda offline prima
    const queueResult = await processOfflineQueue(userId)
    if (queueResult.errors.length > 0) {
      console.warn('[SyncEngine] Errori processando coda offline:', queueResult.errors)
    }

    // 2. Fetch dati da cloud
    const [habitsResult, checkInsResult, categoriesResult] = await Promise.all([
      fetchHabitsFromCloud(userId),
      fetchCheckInsFromCloud(userId),
      fetchCategoriesFromCloud(userId),
    ])

    if (habitsResult.error || checkInsResult.error || categoriesResult.error) {
      throw new Error(
        habitsResult.error || checkInsResult.error || categoriesResult.error
      )
    }

    // 3. Merge dati (cloud vince in caso di conflitto)
    const mergedData = mergeData(localData, {
      habits: habitsResult.data,
      checkIns: checkInsResult.data,
      categories: categoriesResult.data,
    })

    // 4. Salva timestamp ultimo sync
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())

    console.log('[SyncEngine] Full sync completato:', {
      habits: mergedData.habits.length,
      checkIns: mergedData.checkIns.length,
      categories: mergedData.categories.length,
    })

    return { data: mergedData, error: null }
  } catch (error) {
    console.error('[SyncEngine] fullSync error:', error)
    return { data: localData, error: error.message }
  }
}

/**
 * Upload di tutti i dati locali su cloud (per migrazione iniziale)
 * @param {string} userId
 * @param {object} localData
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function uploadLocalDataToCloud(userId, localData) {
  console.log('[SyncEngine] Upload dati locali su cloud...')

  if (!isOnline()) {
    return { success: false, error: 'Offline' }
  }

  try {
    // Upload habits
    for (const habit of localData.habits) {
      await syncHabitToCloud(userId, habit)
    }

    // Upload categories (escludi quelle di default che già esistono)
    for (const category of localData.categories || []) {
      // Skip default categories (hanno id che inizia con 'cat-')
      if (!category.id.startsWith('cat-')) {
        await syncCategoryToCloud(userId, category)
      }
    }

    // Upload check-ins
    for (const checkIn of localData.checkIns) {
      await syncCheckInToCloud(userId, checkIn)
    }

    console.log('[SyncEngine] Upload completato')
    return { success: true, error: null }
  } catch (error) {
    console.error('[SyncEngine] uploadLocalDataToCloud error:', error)
    return { success: false, error: error.message }
  }
}

// ============================================
// DATA TRANSFORMATION (camelCase <-> snake_case)
// ============================================

/**
 * Trasforma habit da formato cloud (snake_case) a locale (camelCase)
 */
function transformHabitFromCloud(cloudHabit) {
  return {
    id: cloudHabit.id,
    name: cloudHabit.name,
    type: cloudHabit.type,
    target: cloudHabit.target,
    weight: cloudHabit.weight,
    timeframe: cloudHabit.timeframe || 'daily',
    createdAt: cloudHabit.created_at,
    color: cloudHabit.color,
    unit: cloudHabit.unit || '',
    categoryId: cloudHabit.category_id,
  }
}

/**
 * Verifica se una stringa è un UUID valido
 */
function isValidUUID(str) {
  if (!str) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Trasforma habit da formato locale (camelCase) a cloud (snake_case)
 */
function transformHabitToCloud(habit) {
  return {
    id: habit.id,
    name: habit.name,
    type: habit.type,
    target: habit.target,
    weight: habit.weight,
    timeframe: habit.timeframe || 'daily',
    created_at: habit.createdAt,
    color: habit.color,
    unit: habit.unit || '',
    // category_id deve essere UUID valido o null (le categorie default come "cat-health" non sono UUID)
    category_id: isValidUUID(habit.categoryId) ? habit.categoryId : null,
    updated_at: new Date().toISOString(),
  }
}

/**
 * Trasforma check-in da formato cloud a locale
 */
function transformCheckInFromCloud(cloudCheckIn) {
  return {
    id: cloudCheckIn.id,
    habitId: cloudCheckIn.habit_id,
    date: cloudCheckIn.date,
    value: cloudCheckIn.value,
    completed: cloudCheckIn.completed,
    timestamp: cloudCheckIn.timestamp || cloudCheckIn.created_at,
  }
}

/**
 * Trasforma check-in da formato locale a cloud
 * Nota: la tabella Supabase usa created_at invece di timestamp
 */
function transformCheckInToCloud(checkIn) {
  return {
    id: checkIn.id,
    habit_id: checkIn.habitId,
    date: checkIn.date,
    value: checkIn.value,
    completed: checkIn.completed,
    // Supabase usa created_at, non timestamp
    updated_at: new Date().toISOString(),
  }
}

/**
 * Trasforma categoria da formato cloud a locale
 */
function transformCategoryFromCloud(cloudCategory) {
  return {
    id: cloudCategory.id,
    name: cloudCategory.name,
    icon: cloudCategory.icon || '',
    color: cloudCategory.color || '#6b7280',
  }
}

/**
 * Trasforma categoria da formato locale a cloud
 */
function transformCategoryToCloud(category) {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon || '',
    color: category.color || '#6b7280',
    updated_at: new Date().toISOString(),
  }
}

// ============================================
// CONFLICT RESOLUTION (Last Write Wins)
// ============================================

/**
 * Merge dati locali con cloud (cloud vince in caso di conflitto)
 * @param {object} localData
 * @param {object} cloudData
 * @returns {object} Dati merged
 */
function mergeData(localData, cloudData) {
  // Per semplicità, usiamo last-write-wins: cloud data sovrascrive local
  // In futuro si può implementare merge più sofisticato con timestamp

  // Habits: usa cloud, aggiungi local che non esistono su cloud
  const cloudHabitIds = new Set(cloudData.habits.map((h) => h.id))
  const mergedHabits = [
    ...cloudData.habits,
    ...localData.habits.filter((h) => !cloudHabitIds.has(h.id)),
  ]

  // Check-ins: combina per chiave (habitId + date)
  const checkInMap = new Map()
  // Prima i locali
  for (const ci of localData.checkIns) {
    const key = `${ci.habitId}-${ci.date}`
    checkInMap.set(key, ci)
  }
  // Cloud sovrascrive
  for (const ci of cloudData.checkIns) {
    const key = `${ci.habitId}-${ci.date}`
    checkInMap.set(key, ci)
  }
  const mergedCheckIns = Array.from(checkInMap.values())

  // Categories: usa cloud, aggiungi custom locali
  const cloudCatIds = new Set(cloudData.categories.map((c) => c.id))
  const mergedCategories = [
    ...cloudData.categories,
    ...(localData.categories || []).filter((c) => !cloudCatIds.has(c.id)),
  ]

  return {
    ...localData,
    habits: mergedHabits,
    checkIns: mergedCheckIns,
    categories: mergedCategories,
    lastUpdated: new Date().toISOString(),
  }
}

// ============================================
// UTILITY
// ============================================

/**
 * Ottiene timestamp dell'ultimo sync
 * @returns {string | null}
 */
export function getLastSyncTime() {
  return localStorage.getItem(LAST_SYNC_KEY)
}

/**
 * Verifica se è necessario un sync (es. più di 5 minuti dall'ultimo)
 * @returns {boolean}
 */
export function needsSync() {
  const lastSync = getLastSyncTime()
  if (!lastSync) return true

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return new Date(lastSync) < fiveMinutesAgo
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // Connectivity
  isOnline,
  onConnectivityChange,
  // Offline queue
  getOfflineQueue,
  addToOfflineQueue,
  clearOfflineQueue,
  processOfflineQueue,
  // Habits
  fetchHabitsFromCloud,
  syncHabitToCloud,
  deleteHabitFromCloud,
  // Check-ins
  fetchCheckInsFromCloud,
  syncCheckInToCloud,
  // Categories
  fetchCategoriesFromCloud,
  syncCategoryToCloud,
  // Full sync
  fullSync,
  uploadLocalDataToCloud,
  // Utility
  getLastSyncTime,
  needsSync,
}
