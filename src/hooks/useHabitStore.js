/**
 * useHabitStore - Custom React Hook
 * Gestisce lo stato delle abitudini con persistenza localStorage + Cloud Sync
 *
 * US-021: Integrazione con Supabase via syncEngine
 *
 * Uso:
 * const { habits, addHabit, checkIn, progress, error, isSyncing } = useHabitStore();
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  fullSync,
  syncHabitToCloud,
  deleteHabitFromCloud,
  syncCheckInToCloud,
  syncCategoryToCloud,
  onConnectivityChange,
  processOfflineQueue,
  uploadLocalDataToCloud,
} from '../utils/syncEngine'
import {
  loadFromStorage,
  saveToStorage,
  addHabit as addHabitToStorage,
  updateHabit as updateHabitInStorage,
  deleteHabit as deleteHabitFromStorage,
  recordCheckIn,
  getCheckIn,
  getWeightedDailyProgress,
  getTodayDate,
  getHabitStats,
  getLastNDays,
  debugGenerateFakeCheckIns,
  debugClearFakeCheckIns,
  // Category functions (US-016)
  addCategory as addCategoryToStorage,
  updateCategory as updateCategoryInStorage,
  deleteCategory as deleteCategoryFromStorage,
  getCategory as getCategoryFromStorage,
  // Period progress (US-018)
  getWeeklyProgress as getWeeklyProgressFromStorage,
  getMonthlyProgress as getMonthlyProgressFromStorage,
  // Contextual progress (US-019)
  getWeightedProgressForDate,
  getWeeklyProgressForDate as getWeeklyProgressForDateFromStorage,
  getMonthlyProgressForDate as getMonthlyProgressForDateFromStorage,
  // Fixed period progress (US-020)
  getCalendarMonthProgress as getCalendarMonthProgressFromStorage,
  getCalendarWeekProgress as getCalendarWeekProgressFromStorage,
  getWeeksOfYear,
} from '../utils/storage'

export function useHabitStore() {
  // Auth context (US-021)
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id

  // Stato principale
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Ref per tracciare se abbiamo già fatto la migrazione iniziale
  const hasMigratedRef = useRef(false)

  // Carica dati all'avvio (pattern standard per init da storage)
  useEffect(() => {
    const { data: loadedData, error: loadError } = loadFromStorage()
    setData(loadedData)
    setError(loadError)
    setIsLoading(false)
  }, [])

  // ============================================
  // CLOUD SYNC (US-021)
  // ============================================

  /**
   * Effetto: Sync quando l'utente fa login
   * - Se primo login: upload dati locali su cloud
   * - Altrimenti: fullSync (merge cloud + local)
   */
  useEffect(() => {
    if (!isAuthenticated || !userId || !data || isLoading) return

    const performSync = async () => {
      setIsSyncing(true)
      console.log('[useHabitStore] Avvio sync per utente:', userId)

      try {
        // Controlla se ci sono dati locali da migrare (primo login)
        const hasLocalData = data.habits.length > 0 && !hasMigratedRef.current

        if (hasLocalData) {
          console.log('[useHabitStore] Primo login - upload dati locali')
          await uploadLocalDataToCloud(userId, data)
          hasMigratedRef.current = true
        }

        // Full sync: scarica da cloud e merge
        const { data: syncedData, error: syncError } = await fullSync(userId, data)

        if (syncError) {
          console.warn('[useHabitStore] Sync error:', syncError)
        } else if (syncedData) {
          setData(syncedData)
          // Salva anche in localStorage come cache
          saveToStorage(syncedData)
        }
      } catch (err) {
        console.error('[useHabitStore] Sync failed:', err)
        setError(err.message)
      } finally {
        setIsSyncing(false)
      }
    }

    performSync()
  }, [isAuthenticated, userId, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Effetto: Listener per online/offline
   * Quando torna online, processa la coda offline
   */
  useEffect(() => {
    if (!userId) return

    const cleanup = onConnectivityChange(async (online) => {
      if (online && userId) {
        console.log('[useHabitStore] Tornato online, processo coda...')
        setIsSyncing(true)
        try {
          await processOfflineQueue(userId)
          // Refresh dati da cloud
          const { data: syncedData } = await fullSync(userId, data)
          if (syncedData) {
            setData(syncedData)
            saveToStorage(syncedData)
          }
        } finally {
          setIsSyncing(false)
        }
      }
    })

    return cleanup
  }, [userId, data])

  // ============================================
  // HABIT OPERATIONS
  // ============================================

  /**
   * Aggiunge una nuova abitudine
   * @param {{ name: string, type?: string, target?: number, weight?: number, color?: string }} habitData
   */
  const addHabit = useCallback(
    (habitData) => {
      if (!data) return null

      const { data: newData, habit, error: saveError } = addHabitToStorage(data, habitData)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (habit && userId) {
        syncHabitToCloud(userId, habit).catch((err) =>
          console.error('[useHabitStore] Sync addHabit failed:', err)
        )
      }

      return habit
    },
    [data, userId]
  )

  /**
   * Aggiorna un'abitudine esistente
   * @param {string} habitId
   * @param {Partial<Habit>} updates
   */
  const updateHabit = useCallback(
    (habitId, updates) => {
      if (!data) return

      const { data: newData, error: saveError } = updateHabitInStorage(data, habitId, updates)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (userId) {
        const updatedHabit = newData.habits.find((h) => h.id === habitId)
        if (updatedHabit) {
          syncHabitToCloud(userId, updatedHabit).catch((err) =>
            console.error('[useHabitStore] Sync updateHabit failed:', err)
          )
        }
      }
    },
    [data, userId]
  )

  /**
   * Elimina un'abitudine
   * @param {string} habitId
   */
  const deleteHabit = useCallback(
    (habitId) => {
      if (!data) return

      const { data: newData, error: saveError } = deleteHabitFromStorage(data, habitId)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (userId) {
        deleteHabitFromCloud(userId, habitId).catch((err) =>
          console.error('[useHabitStore] Sync deleteHabit failed:', err)
        )
      }
    },
    [data, userId]
  )

  // ============================================
  // CHECK-IN OPERATIONS
  // ============================================

  /**
   * Registra un check-in
   * @param {string} habitId
   * @param {number} value
   * @param {string} [date] - Opzionale, default oggi
   */
  const checkIn = useCallback(
    (habitId, value, date) => {
      if (!data) return null

      const {
        data: newData,
        checkIn: newCheckIn,
        error: saveError,
      } = recordCheckIn(data, habitId, value, date)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (newCheckIn && userId) {
        syncCheckInToCloud(userId, newCheckIn).catch((err) =>
          console.error('[useHabitStore] Sync checkIn failed:', err)
        )
      }

      return newCheckIn
    },
    [data, userId]
  )

  /**
   * Ottiene il check-in di oggi per un'abitudine
   * @param {string} habitId
   */
  const getTodayCheckIn = useCallback(
    (habitId) => {
      if (!data) return null
      return getCheckIn(data, habitId)
    },
    [data]
  )

  /**
   * Ottiene statistiche complete per un'abitudine (streak, history, etc.)
   * @param {string} habitId
   */
  const getStats = useCallback(
    (habitId) => {
      if (!data)
        return { currentStreak: 0, longestStreak: 0, completionRate: 0, history: new Map() }
      return getHabitStats(data, habitId)
    },
    [data]
  )

  // ============================================
  // CATEGORY OPERATIONS (US-016)
  // ============================================

  /**
   * Aggiunge una nuova categoria
   * @param {{ name: string, icon?: string, color?: string }} categoryData
   */
  const addCategory = useCallback(
    (categoryData) => {
      if (!data) return null

      const { data: newData, category, error: saveError } = addCategoryToStorage(data, categoryData)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (category && userId) {
        syncCategoryToCloud(userId, category).catch((err) =>
          console.error('[useHabitStore] Sync addCategory failed:', err)
        )
      }

      return category
    },
    [data, userId]
  )

  /**
   * Aggiorna una categoria esistente
   * @param {string} categoryId
   * @param {Partial<Category>} updates
   */
  const updateCategoryFn = useCallback(
    (categoryId, updates) => {
      if (!data) return

      const { data: newData, error: saveError } = updateCategoryInStorage(data, categoryId, updates)
      setData(newData)
      if (saveError) setError(saveError)

      // Cloud sync (US-021)
      if (userId) {
        const updatedCategory = newData.categories.find((c) => c.id === categoryId)
        if (updatedCategory) {
          syncCategoryToCloud(userId, updatedCategory).catch((err) =>
            console.error('[useHabitStore] Sync updateCategory failed:', err)
          )
        }
      }
    },
    [data, userId]
  )

  /**
   * Elimina una categoria
   * @param {string} categoryId
   */
  const deleteCategory = useCallback(
    (categoryId) => {
      if (!data) return

      const { data: newData, error: saveError } = deleteCategoryFromStorage(data, categoryId)
      setData(newData)
      if (saveError) setError(saveError)
    },
    [data]
  )

  /**
   * Ottiene una categoria per ID
   * @param {string} categoryId
   */
  const getCategory = useCallback(
    (categoryId) => {
      if (!data) return null
      return getCategoryFromStorage(data, categoryId)
    },
    [data]
  )

  // ============================================
  // DERIVED STATE
  // ============================================

  // Lista abitudini ordinata per peso (decrescente)
  const habits = data?.habits?.slice().sort((a, b) => b.weight - a.weight) || []

  // Lista categorie (US-016)
  const categories = data?.categories || []

  // Progresso pesato giornaliero
  const progress = data ? getWeightedDailyProgress(data) : { percent: 0, completed: 0, total: 0 }

  // Progresso pesato settimanale (US-018)
  const weeklyProgress = data
    ? getWeeklyProgressFromStorage(data)
    : { percent: 0, daysWithData: 0, totalDays: 7, dailyBreakdown: [] }

  // Progresso pesato mensile (US-018)
  const monthlyProgress = data
    ? getMonthlyProgressFromStorage(data)
    : { percent: 0, daysWithData: 0, totalDays: 30, dailyBreakdown: [] }

  // Data di oggi
  const today = getTodayDate()

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Ricarica dati da localStorage (per sync tra tab)
   */
  const refresh = useCallback(() => {
    const { data: loadedData, error: loadError } = loadFromStorage()
    setData(loadedData)
    if (loadError) setError(loadError)
  }, [])

  // ============================================
  // UNDO SUPPORT (US-022)
  // ============================================

  /**
   * Ottiene uno snapshot dei dati correnti (per undo)
   * @returns {Object | null} Copia profonda dei dati
   */
  const getSnapshot = useCallback(() => {
    if (!data) return null
    return JSON.parse(JSON.stringify(data))
  }, [data])

  /**
   * Ripristina lo stato da uno snapshot (undo)
   * @param {Object} snapshot - Snapshot dei dati da ripristinare
   * @returns {boolean} true se ripristino riuscito
   */
  const restoreFromSnapshot = useCallback((snapshot) => {
    if (!snapshot) return false

    try {
      // Salva in localStorage
      const { error: saveError } = saveToStorage(snapshot)
      if (saveError) {
        setError(saveError)
        return false
      }

      // Aggiorna stato React
      setData(snapshot)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  /**
   * Pulisce l'errore
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // CONTEXTUAL PROGRESS (US-019)
  // ============================================

  /**
   * Ottiene il progresso pesato per una data specifica
   * @param {string} date - Data YYYY-MM-DD
   */
  const getProgressForDate = useCallback(
    (date) => {
      if (!data) return { percent: 0, completed: 0, total: 0, hasData: false }
      return getWeightedProgressForDate(data, date)
    },
    [data]
  )

  /**
   * Ottiene il progresso settimanale per una data specifica
   * Ultimi 7 giorni con la data come ultimo giorno
   * @param {string} endDate - Data finale YYYY-MM-DD
   */
  const getWeeklyProgressForDate = useCallback(
    (endDate) => {
      if (!data) return { percent: 0, daysWithData: 0, totalDays: 7, dailyBreakdown: [] }
      return getWeeklyProgressForDateFromStorage(data, endDate)
    },
    [data]
  )

  /**
   * Ottiene il progresso mensile per una data specifica
   * Ultimi 30 giorni con la data come ultimo giorno
   * @param {string} endDate - Data finale YYYY-MM-DD
   */
  const getMonthlyProgressForDate = useCallback(
    (endDate) => {
      if (!data) return { percent: 0, daysWithData: 0, totalDays: 30, dailyBreakdown: [] }
      return getMonthlyProgressForDateFromStorage(data, endDate)
    },
    [data]
  )

  // ============================================
  // DEBUG FUNCTIONS (per testing streak)
  // ============================================

  /**
   * [DEBUG] Genera check-in finti per testare streak
   * @param {string} habitId
   * @param {number} daysBack - default 14
   * @param {number} successRate - default 80%
   */
  const debugGenerateHistory = useCallback(
    (habitId, daysBack = 14, successRate = 80) => {
      try {
        if (!data) {
          console.error('[DEBUG] Data is null, cannot generate history')
          return
        }
        console.log(
          '[DEBUG] Generating history for:',
          habitId,
          'days:',
          daysBack,
          'rate:',
          successRate
        )
        const { data: newData, error: genError } = debugGenerateFakeCheckIns(
          data,
          habitId,
          daysBack,
          successRate
        )
        if (newData) {
          setData(newData)
        }
        if (genError) {
          console.error('[DEBUG] Error:', genError)
          setError(genError)
        }
      } catch (err) {
        console.error('[DEBUG] Exception in debugGenerateHistory:', err)
        setError(err.message)
      }
    },
    [data]
  )

  /**
   * [DEBUG] Pulisce check-in finti
   * @param {string} habitId - opzionale
   */
  const debugClearHistory = useCallback(
    (habitId = null) => {
      try {
        if (!data) {
          console.error('[DEBUG] Data is null, cannot clear history')
          return
        }
        console.log('[DEBUG] Clearing history for:', habitId || 'ALL')
        const { data: newData, error: clearErr } = debugClearFakeCheckIns(data, habitId)
        if (newData) {
          setData(newData)
        }
        if (clearErr) {
          console.error('[DEBUG] Error:', clearErr)
          setError(clearErr)
        }
      } catch (err) {
        console.error('[DEBUG] Exception in debugClearHistory:', err)
        setError(err.message)
      }
    },
    [data]
  )

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    habits,
    categories, // US-016
    isLoading,
    isSyncing, // US-021
    error,
    today,

    // Progress
    progress,
    weeklyProgress, // US-018
    monthlyProgress, // US-018

    // Habit actions
    addHabit,
    updateHabit,
    deleteHabit,

    // Category actions (US-016)
    addCategory,
    updateCategory: updateCategoryFn,
    deleteCategory,
    getCategory,

    // Check-in actions
    checkIn,
    getTodayCheckIn,

    // Stats (US-008)
    getStats,
    getLastNDays,

    // Contextual Progress (US-019)
    getProgressForDate,
    getWeeklyProgressForDate,
    getMonthlyProgressForDate,

    // Fixed Period Progress (US-020)
    getCalendarMonthProgress: (year, month) =>
      data ? getCalendarMonthProgressFromStorage(data, year, month) : null,
    getCalendarWeekProgress: (mondayDate) =>
      data ? getCalendarWeekProgressFromStorage(data, mondayDate) : null,
    getWeeksOfYear,

    // Utilities
    refresh,
    clearError,

    // Debug (per testing streak)
    debugGenerateHistory,
    debugClearHistory,

    // Undo support (US-022)
    getSnapshot,
    restoreFromSnapshot,

    // Raw data (per debug)
    _rawData: data,
  }
}

export default useHabitStore
