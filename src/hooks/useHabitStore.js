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
  // DERIVED STATE
  // ============================================

  // Lista abitudini ordinata per peso (decrescente)
  const habits = data?.habits?.slice().sort((a, b) => b.weight - a.weight) || [];

  // Progresso pesato giornaliero
  const progress = data ? getWeightedDailyProgress(data) : { percent: 0, completed: 0, total: 0 };

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
    isLoading,
    error,
    today,

    // Progress
    progress,

    // Habit actions
    addHabit,
    updateHabit,
    deleteHabit,

    // Check-in actions
    checkIn,
    getTodayCheckIn,

    // Stats (US-008)
    getStats,
    getLastNDays,

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
