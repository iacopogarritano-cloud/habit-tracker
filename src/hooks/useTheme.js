/**
 * useTheme - Hook per gestione dark mode (US-010)
 *
 * Funzionalità:
 * - Salva preferenza in localStorage
 * - Rispetta prefers-color-scheme del sistema come default
 * - Applica classe .dark al document root
 */

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'habit-tracker-theme'

export function useTheme() {
  // Inizializza lo stato leggendo localStorage o preferenza sistema
  const [isDark, setIsDark] = useState(() => {
    // 1. Controlla localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      return saved === 'dark'
    }
    // 2. Altrimenti usa preferenza sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Applica la classe .dark quando cambia lo stato
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Salva in localStorage
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  // Funzione per toggle
  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  return { isDark, toggleTheme }
}
