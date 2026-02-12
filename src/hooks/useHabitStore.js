/**
 * useHabitStore - Custom React Hook
 * Gestisce lo stato delle abitudini con persistenza localStorage
 *
 * Uso:
 * const { habits, addHabit, checkIn, progress, error } = useHabitStore();
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadFromStorage,
  // saveToStorage is used internally by other storage functions
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
} from '../utils/storage';

export function useHabitStore() {
  // Stato principale
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica dati all'avvio
  useEffect(() => {
    const { data: loadedData, error: loadError } = loadFromStorage();
    setData(loadedData);
    setError(loadError);
    setIsLoading(false);
  }, []);

  // ============================================
  // HABIT OPERATIONS
  // ============================================

  /**
   * Aggiunge una nuova abitudine
   * @param {{ name: string, type?: string, target?: number, weight?: number, color?: string }} habitData
   */
  const addHabit = useCallback((habitData) => {
    if (!data) return null;

    const { data: newData, habit, error: saveError } = addHabitToStorage(data, habitData);
    setData(newData);
    if (saveError) setError(saveError);
    return habit;
  }, [data]);

  /**
   * Aggiorna un'abitudine esistente
   * @param {string} habitId
   * @param {Partial<Habit>} updates
   */
  const updateHabit = useCallback((habitId, updates) => {
    if (!data) return;

    const { data: newData, error: saveError } = updateHabitInStorage(data, habitId, updates);
    setData(newData);
    if (saveError) setError(saveError);
  }, [data]);

  /**
   * Elimina un'abitudine
   * @param {string} habitId
   */
  const deleteHabit = useCallback((habitId) => {
    if (!data) return;

    const { data: newData, error: saveError } = deleteHabitFromStorage(data, habitId);
    setData(newData);
    if (saveError) setError(saveError);
  }, [data]);

  // ============================================
  // CHECK-IN OPERATIONS
  // ============================================

  /**
   * Registra un check-in
   * @param {string} habitId
   * @param {number} value
   * @param {string} [date] - Opzionale, default oggi
   */
  const checkIn = useCallback((habitId, value, date) => {
    if (!data) return null;

    const { data: newData, checkIn: newCheckIn, error: saveError } = recordCheckIn(
      data,
      habitId,
      value,
      date
    );
    setData(newData);
    if (saveError) setError(saveError);
    return newCheckIn;
  }, [data]);

  /**
   * Ottiene il check-in di oggi per un'abitudine
   * @param {string} habitId
   */
  const getTodayCheckIn = useCallback((habitId) => {
    if (!data) return null;
    return getCheckIn(data, habitId);
  }, [data]);

  /**
   * Ottiene statistiche complete per un'abitudine (streak, history, etc.)
   * @param {string} habitId
   */
  const getStats = useCallback((habitId) => {
    if (!data) return { currentStreak: 0, longestStreak: 0, completionRate: 0, history: new Map() };
    return getHabitStats(data, habitId);
  }, [data]);

  // ============================================
  // CATEGORY OPERATIONS (US-016)
  // ============================================

  /**
   * Aggiunge una nuova categoria
   * @param {{ name: string, icon?: string, color?: string }} categoryData
   */
  const addCategory = useCallback((categoryData) => {
    if (!data) return null;

    const { data: newData, category, error: saveError } = addCategoryToStorage(data, categoryData);
    setData(newData);
    if (saveError) setError(saveError);
    return category;
  }, [data]);

  /**
   * Aggiorna una categoria esistente
   * @param {string} categoryId
   * @param {Partial<Category>} updates
   */
  const updateCategoryFn = useCallback((categoryId, updates) => {
    if (!data) return;

    const { data: newData, error: saveError } = updateCategoryInStorage(data, categoryId, updates);
    setData(newData);
    if (saveError) setError(saveError);
  }, [data]);

  /**
   * Elimina una categoria
   * @param {string} categoryId
   */
  const deleteCategory = useCallback((categoryId) => {
    if (!data) return;

    const { data: newData, error: saveError } = deleteCategoryFromStorage(data, categoryId);
    setData(newData);
    if (saveError) setError(saveError);
  }, [data]);

  /**
   * Ottiene una categoria per ID
   * @param {string} categoryId
   */
  const getCategory = useCallback((categoryId) => {
    if (!data) return null;
    return getCategoryFromStorage(data, categoryId);
  }, [data]);

  // ============================================
  // DERIVED STATE
  // ============================================

  // Lista abitudini ordinata per peso (decrescente)
  const habits = data?.habits?.slice().sort((a, b) => b.weight - a.weight) || [];

  // Lista categorie (US-016)
  const categories = data?.categories || [];

  // Progresso pesato giornaliero
  const progress = data ? getWeightedDailyProgress(data) : { percent: 0, completed: 0, total: 0 };

  // Progresso pesato settimanale (US-018)
  const weeklyProgress = data ? getWeeklyProgressFromStorage(data) : { percent: 0, daysWithData: 0, totalDays: 7, dailyBreakdown: [] };

  // Progresso pesato mensile (US-018)
  const monthlyProgress = data ? getMonthlyProgressFromStorage(data) : { percent: 0, daysWithData: 0, totalDays: 30, dailyBreakdown: [] };

  // Data di oggi
  const today = getTodayDate();

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Ricarica dati da localStorage (per sync tra tab)
   */
  const refresh = useCallback(() => {
    const { data: loadedData, error: loadError } = loadFromStorage();
    setData(loadedData);
    if (loadError) setError(loadError);
  }, []);

  /**
   * Pulisce l'errore
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // CONTEXTUAL PROGRESS (US-019)
  // ============================================

  /**
   * Ottiene il progresso pesato per una data specifica
   * @param {string} date - Data YYYY-MM-DD
   */
  const getProgressForDate = useCallback((date) => {
    if (!data) return { percent: 0, completed: 0, total: 0, hasData: false };
    return getWeightedProgressForDate(data, date);
  }, [data]);

  /**
   * Ottiene il progresso settimanale per una data specifica
   * Ultimi 7 giorni con la data come ultimo giorno
   * @param {string} endDate - Data finale YYYY-MM-DD
   */
  const getWeeklyProgressForDate = useCallback((endDate) => {
    if (!data) return { percent: 0, daysWithData: 0, totalDays: 7, dailyBreakdown: [] };
    return getWeeklyProgressForDateFromStorage(data, endDate);
  }, [data]);

  /**
   * Ottiene il progresso mensile per una data specifica
   * Ultimi 30 giorni con la data come ultimo giorno
   * @param {string} endDate - Data finale YYYY-MM-DD
   */
  const getMonthlyProgressForDate = useCallback((endDate) => {
    if (!data) return { percent: 0, daysWithData: 0, totalDays: 30, dailyBreakdown: [] };
    return getMonthlyProgressForDateFromStorage(data, endDate);
  }, [data]);

  // ============================================
  // DEBUG FUNCTIONS (per testing streak)
  // ============================================

  /**
   * [DEBUG] Genera check-in finti per testare streak
   * @param {string} habitId
   * @param {number} daysBack - default 14
   * @param {number} successRate - default 80%
   */
  const debugGenerateHistory = useCallback((habitId, daysBack = 14, successRate = 80) => {
    try {
      if (!data) {
        console.error('[DEBUG] Data is null, cannot generate history');
        return;
      }
      console.log('[DEBUG] Generating history for:', habitId, 'days:', daysBack, 'rate:', successRate);
      const { data: newData, error: genError } = debugGenerateFakeCheckIns(data, habitId, daysBack, successRate);
      if (newData) {
        setData(newData);
      }
      if (genError) {
        console.error('[DEBUG] Error:', genError);
        setError(genError);
      }
    } catch (err) {
      console.error('[DEBUG] Exception in debugGenerateHistory:', err);
      setError(err.message);
    }
  }, [data]);

  /**
   * [DEBUG] Pulisce check-in finti
   * @param {string} habitId - opzionale
   */
  const debugClearHistory = useCallback((habitId = null) => {
    try {
      if (!data) {
        console.error('[DEBUG] Data is null, cannot clear history');
        return;
      }
      console.log('[DEBUG] Clearing history for:', habitId || 'ALL');
      const { data: newData, error: clearErr } = debugClearFakeCheckIns(data, habitId);
      if (newData) {
        setData(newData);
      }
      if (clearErr) {
        console.error('[DEBUG] Error:', clearErr);
        setError(clearErr);
      }
    } catch (err) {
      console.error('[DEBUG] Exception in debugClearHistory:', err);
      setError(err.message);
    }
  }, [data]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    habits,
    categories, // US-016
    isLoading,
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
    getCalendarMonthProgress: (year, month) => data ? getCalendarMonthProgressFromStorage(data, year, month) : null,
    getCalendarWeekProgress: (mondayDate) => data ? getCalendarWeekProgressFromStorage(data, mondayDate) : null,
    getWeeksOfYear,

    // Utilities
    refresh,
    clearError,

    // Debug (per testing streak)
    debugGenerateHistory,
    debugClearHistory,

    // Raw data (per debug)
    _rawData: data,
  };
}

export default useHabitStore;
