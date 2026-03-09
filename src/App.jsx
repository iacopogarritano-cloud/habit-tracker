/**
 * Weighbit - Weighted Habit Tracker
 * US-002: Form creazione abitudine con peso
 * US-022: Undo/Annulla Azione
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useHabitStore } from './hooks/useHabitStore'
import { useTheme } from './hooks/useTheme'
import { useUndoStack } from './hooks/useUndoStack'
import { useAuth } from './contexts/AuthContext'
import { HabitForm } from './components/HabitForm'
import { HabitDetail } from './components/HabitDetail'
import { DayView } from './components/DayView'
import { ReportView } from './components/ReportView'
import { HeatmapView } from './components/HeatmapView'
import { TrendView } from './components/TrendView'
import { ReportCards } from './components/ReportCards'
import { ToastContainer } from './components/Toast'
import LoginButton from './components/LoginButton'
import UserMenu from './components/UserMenu'
import LoginPage from './components/LoginPage'
import supabase from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent } from './components/ui/card'
import { ScoringInfoModal } from './components/ScoringInfoModal'
import EmojiPicker from 'emoji-picker-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './components/ui/dialog'
import './App.css'

function App() {
  const {
    habits,
    categories, // US-016
    isLoading,
    error,
    progress,
    weeklyProgress, // US-018
    monthlyProgress, // US-018
    today,
    addHabit,
    updateHabit,
    updateHabitsOrder,
    deleteHabit,
    clearHabitHistory,
    checkIn,
    getTodayCheckIn,
    getStats,
    getLastNDays,
    getCategory, // US-016
    // Contextual Progress (US-019)
    getProgressForDate,
    getWeeklyProgressForDate,
    getMonthlyProgressForDate,
    getHabitsForDate, // Historical habits (soft delete)
    getCheckInForDate, // US-027
    // Period completion (US-027)
    getPeriodCompletion,
    // Fixed Period Progress (US-020)
    getCalendarMonthProgress,
    getCalendarWeekProgress,
    // Undo support (US-022)
    getSnapshot,
    restoreFromSnapshot,
    _rawData,
  } = useHabitStore()

  // Theme (US-010)
  const { isDark, toggleTheme } = useTheme()

  // Auth (US-021)
  const { user, isAuthenticated, isLoading: authLoading, configError } = useAuth()

  // Undo stack (US-022)
  const undoStack = useUndoStack(10)

  // State per mostrare/nascondere il form
  const [showForm, setShowForm] = useState(false)
  // State per editing
  const [editingHabit, setEditingHabit] = useState(null)
  // State per delete confirmation
  const [deletingHabit, setDeletingHabit] = useState(null)
  // State per detail view (US-008)
  const [selectedHabit, setSelectedHabit] = useState(null)
  // State per day view (dashboard per data)
  const [selectedDate, setSelectedDate] = useState(null)
  // State per ricerca abitudini (US-009)
  const [searchQuery, setSearchQuery] = useState('')
  // State per filtro categoria
  const [categoryFilter, setCategoryFilter] = useState('')
  // State per report view (US-020)
  const [showReportView, setShowReportView] = useState(false)
  // State per heatmap view (US-V2-004)
  const [showHeatmapView, setShowHeatmapView] = useState(false)
  // State per trend view (US-V2-008)
  const [showTrendView, setShowTrendView] = useState(false)
  // State per modal spiegazione punteggio
  const [showScoringInfo, setShowScoringInfo] = useState(false)
  const [reportInitialPeriod, setReportInitialPeriod] = useState(null)

  // Sort mode: 'weight' | 'alpha' | 'category' | 'manual'
  const [sortMode, setSortMode] = useState(() => localStorage.getItem('weighbit-sort-mode') || 'weight')
  // Ordine manuale: array di habit ID nella sequenza desiderata
  const [manualOrder, setManualOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('weighbit-sort-order') || '[]') } catch { return [] }
  })
  // Ref per tracciare quale card si sta trascinando (non serve re-render)
  const draggedIdRef = useRef(null)
  const [dragOverId, setDragOverId] = useState(null)
  // Refs per auto-scroll durante il drag
  const scrollAnimRef = useRef(null)
  const modalScrollAnimRef = useRef(null)
  const reorderListRef = useRef(null)
  // Ref per handle-only drag (impedisce che slider/bottoni avviino il reorder)
  const dragHandlePressedRef = useRef(false)
  // Ref per touch drag su mobile
  const touchDragIdRef = useRef(null)
  // Ref per la lista habits (per listener touchmove non-passive)
  const habitListRef = useRef(null)
  // State per modale riordinamento compatto
  const [showReorderModal, setShowReorderModal] = useState(false)
  // State per conferma reset giornata
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  // State per conferma nome duplicato
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false)
  const [pendingDuplicateData, setPendingDuplicateData] = useState(null)

  // State bug report (US-030)
  const [showBugReport, setShowBugReport] = useState(false)
  const [bugMessage, setBugMessage] = useState('')
  const [isSendingBug, setIsSendingBug] = useState(false)
  const [emojiPickerHabitId, setEmojiPickerHabitId] = useState(null)

  // State per toast notifications (US-022)
  const [toasts, setToasts] = useState([])

  // Genera ID unico per toast
  const generateToastId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }, [])

  // Aggiunge un toast
  const addToast = useCallback(
    (message, type = 'info', canUndo = false, duration = 5000) => {
      const id = generateToastId()
      setToasts((prev) => [...prev, { id, message, type, canUndo, duration }])
      return id
    },
    [generateToastId]
  )

  // Rimuove un toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Esegue undo dall'ultimo toast
  const handleUndoFromToast = useCallback(
    (toastId) => {
      // NOTA: peek() PRIMA di pop() perché pop() è asincrono e restituirebbe null
      const entry = undoStack.peek()
      if (entry) {
        undoStack.pop()
        const success = restoreFromSnapshot(entry.snapshot)
        if (success) {
          removeToast(toastId)
          addToast('Azione annullata', 'success', false, 3000)
        }
      }
    },
    [undoStack, restoreFromSnapshot, removeToast, addToast]
  )

  // Keyboard listener per CTRL+Z / Cmd+Z (US-022)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CTRL+Z (Windows/Linux) o Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        // Non interferire con input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return
        }

        e.preventDefault()

        if (undoStack.canUndo) {
          // NOTA: peek() PRIMA di pop() perché pop() è asincrono e restituirebbe null
          const entry = undoStack.peek()
          if (entry) {
            undoStack.pop()
            const success = restoreFromSnapshot(entry.snapshot)
            if (success) {
              addToast(`Annullato: ${entry.description}`, 'success', false, 3000)
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undoStack, restoreFromSnapshot, addToast])

  // Persisti sort settings in localStorage
  useEffect(() => { localStorage.setItem('weighbit-sort-mode', sortMode) }, [sortMode])
  useEffect(() => { localStorage.setItem('weighbit-sort-order', JSON.stringify(manualOrder)) }, [manualOrder])

  // Listener touchmove non-passive per bloccare lo scroll durante touch drag
  // React attacca i listener come passive per default → e.preventDefault() ignorato su iOS
  useEffect(() => {
    const preventScroll = (e) => {
      if (touchDragIdRef.current) e.preventDefault()
    }
    document.addEventListener('touchmove', preventScroll, { passive: false })
    return () => document.removeEventListener('touchmove', preventScroll)
  }, [])

  // Sincronizza manualOrder con il campo order degli habit (già LWW-merged tra local e cloud).
  // Caso completo: tutti gli habit hanno order → ricostruisce l'ordine dal merge (cloud o local vince per updatedAt).
  // Caso parziale: solo alcuni hanno order (migrazione) → inserisce nuovi habit nella posizione cloud.
  // L'equality check evita re-render inutili quando l'ordine non è cambiato (es. su check-in).
  useEffect(() => {
    const habitsWithOrder = habits.filter((h) => h.order != null)
    if (habitsWithOrder.length === 0) return

    if (habitsWithOrder.length === habits.length) {
      // Tutti hanno order: ricostruisci l'ordine completo dal campo order (già LWW-merged)
      const newOrder = [...habitsWithOrder].sort((a, b) => a.order - b.order).map((h) => h.id)
      setManualOrder((prev) =>
        prev.length === newOrder.length && prev.every((id, i) => id === newOrder[i]) ? prev : newOrder
      )
    } else {
      // Solo alcuni hanno order: aggiungi solo gli habit nuovi non ancora in manualOrder
      setManualOrder((prev) => {
        if (prev.length === 0) {
          return [...habitsWithOrder].sort((a, b) => a.order - b.order).map((h) => h.id)
        }
        const newHabits = habits
          .filter((h) => !prev.includes(h.id))
          .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
        if (newHabits.length === 0) return prev
        const result = [...prev]
        for (const h of newHabits) {
          const pos = Math.min(h.order ?? result.length, result.length)
          result.splice(pos, 0, h.id)
        }
        return result
      })
    }
  }, [habits]) // intenzionale: setManualOrder è stabile, vogliamo rieseguire solo quando habits cambia

  // Punteggio per timeframe (US-V2-003): daily/weekly/monthly separati
  const multiTimeframeProgress = useMemo(() => {
    const dailyHabits = habits.filter((h) => !h.timeframe || h.timeframe === 'daily')
    const weeklyHabits = habits.filter((h) => h.timeframe === 'weekly')
    const monthlyHabits = habits.filter((h) => h.timeframe === 'monthly')

    function groupScore(list) {
      if (list.length === 0) return null
      let totalWeight = 0
      let weightedSum = 0
      for (const h of list) {
        const result = getPeriodCompletion(h.id)
        weightedSum += (result?.percent ?? 0) * h.weight
        totalWeight += h.weight
      }
      return {
        percent: totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0,
        count: list.length,
      }
    }

    return {
      daily: groupScore(dailyHabits),
      weekly: groupScore(weeklyHabits),
      monthly: groupScore(monthlyHabits),
      hasMultiple: weeklyHabits.length > 0 || monthlyHabits.length > 0,
    }
  }, [habits, getPeriodCompletion])

  // Filtra e ordina abitudini
  const filteredHabits = useMemo(() => {
    let result = habits

    // Filtro per categoria
    if (categoryFilter) {
      result = result.filter((habit) => habit.categoryId === categoryFilter)
    }

    // Filtro per ricerca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((habit) => habit.name.toLowerCase().includes(query))
    }

    // Ordinamento
    if (sortMode === 'weight') {
      result = [...result].sort((a, b) => b.weight - a.weight)
    } else if (sortMode === 'alpha') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'it'))
    } else if (sortMode === 'category') {
      result = [...result].sort((a, b) => {
        const catA = a.categoryId ? (categories.find((c) => c.id === a.categoryId)?.name || '') : ''
        const catB = b.categoryId ? (categories.find((c) => c.id === b.categoryId)?.name || '') : ''
        return catA.localeCompare(catB, 'it') || a.name.localeCompare(b.name, 'it')
      })
    } else if (sortMode === 'manual') {
      result = [...result].sort((a, b) => {
        const iA = manualOrder.indexOf(a.id)
        const iB = manualOrder.indexOf(b.id)
        return (iA === -1 ? Infinity : iA) - (iB === -1 ? Infinity : iB)
      })
    }

    return result
  }, [habits, searchQuery, categoryFilter, sortMode, manualOrder, categories])

  // Lista per modale riordinamento compatto (tutte le abitudini, ordinate per manualOrder)
  const reorderModalList = useMemo(() => {
    return [...habits].sort((a, b) => {
      const iA = manualOrder.indexOf(a.id)
      const iB = manualOrder.indexOf(b.id)
      if (iA === -1 && iB === -1) return b.weight - a.weight
      return (iA === -1 ? Infinity : iA) - (iB === -1 ? Infinity : iB)
    })
  }, [habits, manualOrder])

  // Logica di riordinamento condivisa tra mouse drag e touch drag.
  // useCallback qui (prima degli early return) garantisce che hooks siano sempre chiamati nello stesso ordine.
  const performReorder = useCallback((sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return

    const allIds = habits.map((h) => h.id)
    const currentOrder =
      manualOrder.length > 0
        ? [...allIds].sort((a, b) => {
            const iA = manualOrder.indexOf(a)
            const iB = manualOrder.indexOf(b)
            return (iA === -1 ? Infinity : iA) - (iB === -1 ? Infinity : iB)
          })
        : allIds

    const newOrder = [...currentOrder]
    const fromIdx = newOrder.indexOf(sourceId)
    const toIdx = newOrder.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return
    newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, sourceId)

    setManualOrder(newOrder)
    setSortMode('manual')
    updateHabitsOrder(newOrder)
  }, [habits, manualOrder, updateHabitsOrder])

  // Loading state
  if (isLoading || authLoading) {
    return <div className="app-loading">Caricamento...</div>
  }

  // Errore configurazione: mancano le variabili d'ambiente Supabase
  if (configError) {
    return (
      <div className="app-loading">
        <h2>⚠️ Configurazione mancante</h2>
        <p>Le variabili d'ambiente Supabase non sono configurate.</p>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '16px' }}>
          Aggiungi VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
          <br />
          nelle Environment Variables di Vercel.
        </p>
      </div>
    )
  }

  // Auth gate: se non sei loggato, mostra la pagina di login
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Handler per creare/modificare abitudine (US-022: con undo support per edit)
  const handleSubmitHabit = (habitData) => {
    if (editingHabit) {
      // Salva snapshot PRIMA di modificare
      const snapshot = getSnapshot()
      const habitName = editingHabit.name

      // Modifica abitudine esistente
      updateHabit(editingHabit.id, habitData)
      setEditingHabit(null)

      // Aggiungi allo stack undo
      if (snapshot) {
        undoStack.push(snapshot, 'updateHabit', `Modificata "${habitName}"`)
      }

      // Mostra toast con possibilità di annullare
      addToast(`Abitudine "${habitData.name}" modificata`, 'info', true, 5000)
      setShowForm(false)
    } else {
      // Crea nuova abitudine - controlla nome duplicato
      const nameExists = habits.some(
        (h) => h.name.trim().toLowerCase() === habitData.name.trim().toLowerCase()
      )
      if (nameExists) {
        // Mostra dialog shadcn invece di window.confirm
        setPendingDuplicateData(habitData)
        setShowDuplicateConfirm(true)
        return
      }
      addHabit(habitData)
      setShowForm(false)
    }
  }

  // Handler per confermare creazione di abitudine con nome duplicato
  const handleConfirmDuplicate = () => {
    if (pendingDuplicateData) {
      addHabit(pendingDuplicateData)
      setPendingDuplicateData(null)
    }
    setShowDuplicateConfirm(false)
    setShowForm(false)
  }

  // Handler per iniziare modifica
  const handleEditHabit = (habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  // Handler per annullare form
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  // Handler per confermare eliminazione (US-022: con undo support)
  const handleConfirmDelete = () => {
    if (deletingHabit) {
      // Salva snapshot PRIMA di eliminare
      const snapshot = getSnapshot()
      const habitName = deletingHabit.name

      // Esegui eliminazione
      deleteHabit(deletingHabit.id)
      setDeletingHabit(null)

      // Aggiungi allo stack undo
      if (snapshot) {
        undoStack.push(snapshot, 'deleteHabit', `Eliminata "${habitName}"`)
      }

      // Mostra toast con possibilità di annullare
      addToast(`Abitudine "${habitName}" eliminata`, 'warning', true, 6000)
    }
  }

  // Handler per incrementare
  const handleIncrement = (habitId, currentValue) => {
    checkIn(habitId, currentValue + 1)
  }

  // Handler per decrementare
  const handleDecrement = (habitId, currentValue) => {
    if (currentValue > 0) {
      checkIn(habitId, currentValue - 1)
    }
  }

  // Handler per reset giornata (con undo support)
  const handleResetDay = () => {
    // Salva snapshot PRIMA di resettare
    const snapshot = getSnapshot()

    // Conta quante abitudini hanno check-in > 0
    let resetCount = 0
    habits.forEach((habit) => {
      const todayCheckIn = getTodayCheckIn(habit.id)
      if (todayCheckIn && todayCheckIn.value > 0) {
        checkIn(habit.id, 0)
        resetCount++
      }
    })

    // Salva nello stack undo
    if (resetCount > 0) {
      undoStack.push(snapshot, 'resetDay', `Reset ${resetCount} abitudini`)
      addToast(`Reset completato (${resetCount} abitudini)`, 'warning', true, 6000)
    } else {
      addToast('Nessuna abitudine da resettare', 'info', false, 3000)
    }

    setShowResetConfirm(false)
  }

  // ============================================
  // SORT & DRAG-AND-DROP HANDLERS
  // ============================================

  // Cambia modalità di ordinamento. Se si passa a 'manual' per la prima volta,
  // inizializza l'ordine dall'ordinamento corrente visibile.
  const handleSortChange = (newMode) => {
    if (newMode === 'manual' && manualOrder.length === 0) {
      setManualOrder(filteredHabits.map((h) => h.id))
    }
    setSortMode(newMode)
  }

  // Auto-scroll durante il drag (finestra principale)
  const stopAutoScroll = () => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current)
      scrollAnimRef.current = null
    }
  }

  const startAutoScroll = (direction) => {
    stopAutoScroll()
    const scroll = () => {
      window.scrollBy(0, direction * 10)
      scrollAnimRef.current = requestAnimationFrame(scroll)
    }
    scrollAnimRef.current = requestAnimationFrame(scroll)
  }

  // Auto-scroll durante il drag (modale riordinamento)
  const stopModalAutoScroll = () => {
    if (modalScrollAnimRef.current) {
      cancelAnimationFrame(modalScrollAnimRef.current)
      modalScrollAnimRef.current = null
    }
  }

  const startModalAutoScroll = (direction) => {
    stopModalAutoScroll()
    const scroll = () => {
      if (reorderListRef.current) {
        reorderListRef.current.scrollTop += direction * 10
      }
      modalScrollAnimRef.current = requestAnimationFrame(scroll)
    }
    modalScrollAnimRef.current = requestAnimationFrame(scroll)
  }

  const handleDragStart = (e, habitId) => {
    draggedIdRef.current = habitId
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, habitId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverId !== habitId) setDragOverId(habitId)
    // Auto-scroll bordi viewport
    const threshold = 80
    if (e.clientY < threshold) {
      startAutoScroll(-1)
    } else if (e.clientY > window.innerHeight - threshold) {
      startAutoScroll(1)
    } else {
      stopAutoScroll()
    }
  }

  const handleDragLeave = (e) => {
    // Ignora eventi bubbling dai figli
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverId(null)
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    stopAutoScroll()
    stopModalAutoScroll()
    setDragOverId(null)
    const sourceId = draggedIdRef.current
    draggedIdRef.current = null
    performReorder(sourceId, targetId)
  }

  const handleDragEnd = () => {
    stopAutoScroll()
    setDragOverId(null)
    draggedIdRef.current = null
    dragHandlePressedRef.current = false
  }

  // Drag handlers specifici per la modale riordinamento
  const handleModalDragOver = (e, habitId) => {
    e.preventDefault()
    if (dragOverId !== habitId) setDragOverId(habitId)
    const container = reorderListRef.current
    if (container) {
      const rect = container.getBoundingClientRect()
      const threshold = 60
      if (e.clientY < rect.top + threshold) {
        startModalAutoScroll(-1)
      } else if (e.clientY > rect.bottom - threshold) {
        startModalAutoScroll(1)
      } else {
        stopModalAutoScroll()
      }
    }
  }

  const handleModalDragEnd = () => {
    stopModalAutoScroll()
    setDragOverId(null)
    draggedIdRef.current = null
  }

  // Handler invio segnalazione bug (US-030)
  const handleSubmitBugReport = async () => {
    if (!bugMessage.trim()) return
    setIsSendingBug(true)
    try {
      const { error: insertError } = await supabase.from('bug_reports').insert({
        user_id: user?.id ?? null,
        message: bugMessage.trim(),
        user_agent: navigator.userAgent,
        app_version: '0.0.0',
      })
      if (insertError) throw insertError
      setShowBugReport(false)
      setBugMessage('')
      addToast('Grazie! Abbiamo ricevuto la tua segnalazione 🙏', 'success', false, 5000)
    } catch {
      addToast("Errore nell'invio. Controlla la connessione e riprova.", 'warning', false, 5000)
    } finally {
      setIsSendingBug(false)
    }
  }

  return (
    <div className="app">
      {/* Header con data cliccabile e theme toggle */}
      <header className="app-header">
        <div className="app-header-row">
          <h1>Weighbit</h1>
          <div className="header-actions">
            <Button
              variant="ghost"
              onClick={() => setShowTrendView(true)}
              title="Trend storico"
              className="header-btn"
            >
              <span>📈</span>
              <span className="header-btn-label">Trend</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowReportView(true)}
              title="Report periodi"
              className="header-btn"
            >
              <span>📊</span>
              <span className="header-btn-label">Report</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowHeatmapView(true)}
              title="Heatmap abitudini"
              className="header-btn"
            >
              <span>🟩</span>
              <span className="header-btn-label">Heatmap</span>
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTheme}
              title={isDark ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
              className="header-btn"
            >
              <span>{isDark ? '☀️' : '🌙'}</span>
              <span className="header-btn-label">Tema</span>
            </Button>
            {/* Auth UI (US-021) */}
            {isAuthenticated ? (
              <UserMenu onOpenBugReport={() => setShowBugReport(true)} />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="today-date-btn"
          onClick={() => setSelectedDate(today)}
          title="Clicca per vedere il dettaglio del giorno"
        >
          <span className="calendar-icon">📅</span>
          <span>{today}</span>
        </Button>
      </header>

      {/* Error display */}
      {error && <div className="error-banner">{error}</div>}

      {/* Dashboard progresso pesato (US-001, US-018) */}
      <ReportCards
        todayProgress={progress}
        weeklyProgress={weeklyProgress}
        monthlyProgress={monthlyProgress}
        multiTimeframeProgress={multiTimeframeProgress}
      />

      {/* Link spiegazione punteggio */}
      <div className="scoring-info-link-row">
        <button
          className="scoring-info-link"
          onClick={() => setShowScoringInfo(true)}
          title="Come funziona il punteggio?"
        >
          ℹ️ Come viene calcolato il punteggio?
        </button>
      </div>

      {/* Form creazione/modifica abitudine (US-002, US-006) */}
      {showForm && (
        <section className="form-section">
          <HabitForm
            onSubmit={handleSubmitHabit}
            onCancel={handleCancelForm}
            initialData={editingHabit}
            categories={categories}
            habits={habits}
          />
        </section>
      )}

      {/* Modal spiegazione punteggio */}
      <ScoringInfoModal open={showScoringInfo} onClose={() => setShowScoringInfo(false)} />

      {/* Modal conferma eliminazione (US-007) */}
      <Dialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminare abitudine?</DialogTitle>
            <DialogDescription>
              Stai per eliminare &quot;<strong>{deletingHabit?.name}</strong>&quot;.
              Questa azione è irreversibile e perderai tutto lo storico.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingHabit(null)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal dettaglio abitudine (US-008, US-012) */}
      <Dialog open={!!selectedHabit} onOpenChange={(open) => !open && setSelectedHabit(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {/* DialogTitle visually hidden: richiesto da Radix per aria-labelledby */}
          <DialogTitle className="sr-only">
            {selectedHabit?.name ?? 'Dettaglio abitudine'}
          </DialogTitle>
          {selectedHabit && (
            <HabitDetail
              habit={selectedHabit}
              stats={getStats(selectedHabit.id)}
              lastNDays={getLastNDays(30)}
              onClose={() => setSelectedHabit(null)}
              onCheckIn={checkIn}
              onClearHistory={clearHabitHistory}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal day view con calendario mensile (US-019) */}
      {selectedDate && (
        <DayView
          date={selectedDate}
          habits={getHabitsForDate(selectedDate)}
          getCheckInForDate={getCheckInForDate}
          getPeriodCompletion={getPeriodCompletion}
          getProgressForDate={getProgressForDate}
          getWeeklyProgressForDate={getWeeklyProgressForDate}
          getMonthlyProgressForDate={getMonthlyProgressForDate}
          onCheckIn={checkIn}
          onClose={() => setSelectedDate(null)}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Modal report view (US-020) */}
      {showReportView && (
        <ReportView
          onClose={() => { setShowReportView(false); setReportInitialPeriod(null) }}
          getCalendarMonthProgress={getCalendarMonthProgress}
          getCalendarWeekProgress={getCalendarWeekProgress}
          initialPeriod={reportInitialPeriod}
          onSelectDate={(date) => { setSelectedDate(date); setShowReportView(false) }}
        />
      )}

      {/* Modal trend storico (US-V2-008) */}
      {showTrendView && (
        <TrendView
          getCalendarWeekProgress={getCalendarWeekProgress}
          getCalendarMonthProgress={getCalendarMonthProgress}
          onClose={() => setShowTrendView(false)}
          onSelectPeriod={(period) => {
            setReportInitialPeriod(period)
            setShowTrendView(false)
            setShowReportView(true)
          }}
        />
      )}

      {/* Modal heatmap view (US-V2-004) */}
      {showHeatmapView && (
        <HeatmapView
          habits={habits}
          getPeriodCompletion={getPeriodCompletion}
          onClose={() => setShowHeatmapView(false)}
          onSelectDate={(date) => {
            setSelectedDate(date)
            setShowHeatmapView(false)
          }}
        />
      )}

      {/* Modal conferma reset giornata */}
      <Dialog open={showResetConfirm} onOpenChange={(open) => !open && setShowResetConfirm(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset giornata</DialogTitle>
            <DialogDescription>
              Vuoi azzerare tutti i progressi di oggi?
              <br />
              Potrai annullare con il pulsante &quot;Annulla&quot; o Ctrl+Z.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              No, annulla
            </Button>
            <Button variant="destructive" onClick={handleResetDay}>
              Sì, resetta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal conferma nome duplicato */}
      <Dialog
        open={showDuplicateConfirm}
        onOpenChange={(open) => !open && setShowDuplicateConfirm(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nome già esistente</DialogTitle>
            <DialogDescription>
              Esiste già un&apos;abitudine chiamata &quot;
              <strong>{pendingDuplicateData?.name}</strong>&quot;. Vuoi crearla comunque?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateConfirm(false)}>
              Annulla
            </Button>
            <Button onClick={handleConfirmDuplicate}>Crea comunque</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lista abitudini (US-003) */}
      <section className="habits-section">
        <div className="section-header">
          <h2>Le tue abitudini</h2>
          <div className="section-header-actions">
            {!showForm && habits.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                title="Azzera tutti i progressi di oggi"
              >
                🔄 Reset
              </Button>
            )}
            {!showForm && (
              <Button size="sm" onClick={() => setShowForm(true)}>
                + Aggiungi
              </Button>
            )}
          </div>
        </div>

        {/* Barra di ricerca e filtri */}
        {habits.length > 0 && (
          <div className="filters-bar">
            <div className="search-bar">
              <Input
                type="text"
                placeholder="Cerca abitudine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Cancella ricerca"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filtro categoria */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="">Tutte le categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            )}

            {/* Controlli ordinamento */}
            <div className="sort-controls">
              <span className="sort-label">Ordina:</span>
              {[
                { mode: 'weight', label: '★ Peso' },
                { mode: 'alpha',  label: 'A–Z' },
                { mode: 'category', label: '⊞ Cat.' },
                { mode: 'manual', label: '⠿ Manuale' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  className={`sort-btn ${sortMode === mode ? 'active' : ''}`}
                  onClick={() => handleSortChange(mode)}
                  title={
                    mode === 'weight' ? 'Ordina per peso (★)' :
                    mode === 'alpha'  ? 'Ordina alfabeticamente' :
                    mode === 'category' ? 'Ordina per categoria' :
                    'Trascina le card per riordinare'
                  }
                >
                  {label}
                </button>
              ))}
              <button
                className="sort-btn reorder-list-btn"
                onClick={() => {
                  if (sortMode !== 'manual') handleSortChange('manual')
                  setShowReorderModal(true)
                }}
                title="Apri lista compatta per riordinare velocemente"
              >
                ≡ Lista
              </button>
            </div>
          </div>
        )}

        {/* Conteggio risultati filtrati */}
        {(searchQuery || categoryFilter) && (
          <div className="search-results-count">
            {filteredHabits.length}{' '}
            {filteredHabits.length === 1 ? 'abitudine trovata' : 'abitudini trovate'}
            {categoryFilter && (
              <button
                className="btn-clear-filter"
                onClick={() => setCategoryFilter('')}
                title="Rimuovi filtro"
              >
                ×
              </button>
            )}
          </div>
        )}

        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <h3 className="empty-state-title">Inizia a tracciare le tue abitudini</h3>
            <p>Aggiungi la tua prima abitudine e costruisci la tua routine quotidiana.</p>
            {!showForm && (
              <Button className="empty-state-cta" onClick={() => setShowForm(true)}>
                + Aggiungi la tua prima abitudine
              </Button>
            )}
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="empty-state">
            <p>
              Nessuna abitudine trovata
              {searchQuery && ` per "${searchQuery}"`}
              {categoryFilter && ` in questa categoria`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('')
              }}
            >
              Rimuovi filtri
            </Button>
          </div>
        ) : (
          <ul ref={habitListRef} className="habit-list">
            {filteredHabits.map((habit) => {
              const todayCheckIn = getTodayCheckIn(habit.id)
              const currentValue = todayCheckIn?.value || 0
              const isDaily = !habit.timeframe || habit.timeframe === 'daily'

              // US-027: Progresso di periodo per weekly/monthly
              const periodInfo = !isDaily ? getPeriodCompletion(habit.id) : null
              const isCompleted = isDaily
                ? currentValue >= habit.target
                : (periodInfo?.currentValue ?? 0) >= habit.target

              // Label periodo per display
              const periodLabel = habit.timeframe === 'weekly'
                ? 'questa sett.'
                : habit.timeframe === 'monthly'
                  ? 'questo mese'
                  : ''

              const stats = getStats(habit.id)
              const category = getCategory(habit.categoryId) // US-016

              // Per boolean: il check di oggi (toggle 0↔1)
              const todayChecked = currentValue >= 1

              return (
                <li
                  key={habit.id}
                  data-habit-id={habit.id}
                  draggable={sortMode === 'manual'}
                  onDragStart={sortMode === 'manual' ? (e) => {
                    if (!dragHandlePressedRef.current) { e.preventDefault(); return }
                    handleDragStart(e, habit.id)
                  } : undefined}
                  onDragOver={sortMode === 'manual' ? (e) => handleDragOver(e, habit.id) : undefined}
                  onDragLeave={sortMode === 'manual' ? handleDragLeave : undefined}
                  onDrop={sortMode === 'manual' ? (e) => handleDrop(e, habit.id) : undefined}
                  onDragEnd={sortMode === 'manual' ? handleDragEnd : undefined}
                  className={dragOverId === habit.id ? 'drag-over' : ''}
                >
                <Card
                  className={`habit-card ${isCompleted ? 'completed' : ''} ${emojiPickerHabitId === habit.id ? 'has-emoji-picker' : ''}`}
                  style={{
                    borderLeftColor: habit.color || undefined,
                    ...(isCompleted && habit.color ? { '--habit-completed-bg': `${habit.color}1a` } : {}),
                  }}
                  onClick={() => setSelectedHabit(habit)}
                >
                {!isDaily && (
                  <span className="habit-timeframe-badge">
                    {habit.timeframe === 'weekly' ? 'sett.' : 'mese'}
                  </span>
                )}
                <CardContent className="habit-card-content">
                  {/* Left accent: emoji box + drag handle */}
                  <div className="habit-left-accent">
                    <div
                      className="emoji-box-container"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEmojiPickerHabitId(null)
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="habit-emoji-box"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEmojiPickerHabitId(emojiPickerHabitId === habit.id ? null : habit.id)
                        }}
                        title="Cambia emoji"
                      >
                        {habit.emoji || habit.name?.[0]?.toUpperCase() || '?'}
                      </button>
                      {emojiPickerHabitId === habit.id && (
                        <div className="emoji-dropdown" onClick={(e) => e.stopPropagation()}>
                          <EmojiPicker
                            onEmojiClick={(emojiData) => {
                              updateHabit(habit.id, { emoji: emojiData.emoji })
                              setEmojiPickerHabitId(null)
                            }}
                            previewConfig={{ showPreview: false }}
                            skinTonesDisabled={true}
                            height={320}
                            width={280}
                            searchPlaceholder="Cerca emoji..."
                            lazyLoadEmojis
                          />
                          {habit.emoji && (
                            <button
                              type="button"
                              className="emoji-clear-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateHabit(habit.id, { emoji: '' })
                                setEmojiPickerHabitId(null)
                              }}
                            >
                              ✕ Rimuovi emoji
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {sortMode === 'manual' && (
                      <span
                        className="drag-handle"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={() => { dragHandlePressedRef.current = true }}
                        onMouseUp={() => { dragHandlePressedRef.current = false }}
                        onTouchStart={(e) => {
                          e.stopPropagation()
                          touchDragIdRef.current = habit.id
                        }}
                        onTouchMove={(e) => {
                          if (!touchDragIdRef.current) return
                          e.preventDefault() // blocca scroll durante il drag
                          const touch = e.touches[0]
                          const el = document.elementFromPoint(touch.clientX, touch.clientY)
                          const li = el?.closest('[data-habit-id]')
                          const targetId = li?.getAttribute('data-habit-id')
                          if (targetId) setDragOverId(targetId)
                        }}
                        onTouchEnd={(e) => {
                          const sourceId = touchDragIdRef.current
                          touchDragIdRef.current = null
                          setDragOverId(null)
                          if (!sourceId) return
                          const touch = e.changedTouches[0]
                          const el = document.elementFromPoint(touch.clientX, touch.clientY)
                          const li = el?.closest('[data-habit-id]')
                          const targetId = li?.getAttribute('data-habit-id')
                          if (targetId) performReorder(sourceId, targetId)
                        }}
                      >
                        ⠿
                      </span>
                    )}
                  </div>

                  {/* Center: name + meta */}
                  <div className="habit-info">
                    <div className="habit-name-row">
                      <span className="habit-name">{habit.name}</span>
                    </div>
                    <div className="habit-meta">
                      <span className="habit-weight">{'★'.repeat(habit.weight)}</span>
                      {isDaily && stats.currentStreak > 0 && (
                        <span className="habit-streak">🔥 {stats.currentStreak}</span>
                      )}
                      {category && (
                        <span
                          className="habit-category-badge"
                          style={{ backgroundColor: habit.color + '20', color: habit.color }}
                        >
                          {category.icon} {category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right col: slider + actions */}
                  <div className="habit-right-col">
                    {/* Progress bar - slider per tutti i tipi (incluso boolean) */}
                    <div
                      className="habit-progress-container"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="habit-progress habit-progress-slider"
                        style={{
                          background: (() => {
                            const displayValue = isDaily ? currentValue : (periodInfo?.currentValue ?? 0)
                            const sliderMax = Math.max(habit.target, displayValue)
                            const pct = sliderMax > 0 ? (displayValue / sliderMax) * 100 : 0
                            const c = habit.color || 'var(--color-primary)'
                            return `linear-gradient(to right, ${c} ${pct}%, var(--color-border) ${pct}%)`
                          })(),
                        }}
                      >
                        <input
                          type="range"
                          min="0"
                          max={isDaily ? Math.max(habit.target, currentValue) : Math.max(habit.target, periodInfo?.currentValue ?? 0)}
                          value={isDaily ? currentValue : (periodInfo?.currentValue ?? 0)}
                          onChange={(e) => checkIn(habit.id, parseInt(e.target.value, 10))}
                          className="progress-slider"
                          aria-label={`Progresso ${habit.name}`}
                          aria-valuetext={`${isDaily ? currentValue : (periodInfo?.currentValue ?? 0)} di ${habit.target}${habit.unit ? ` ${habit.unit}` : ''}`}
                          style={{
                            '--progress-color': habit.color || 'var(--color-primary)',
                          }}
                        />
                      </div>
                      <span className="progress-text">
                        {isDaily
                          ? `${currentValue}/${habit.target}${habit.unit ? ` ${habit.unit}` : ''}`
                          : `${periodInfo?.currentValue ?? 0}/${habit.target}${habit.unit ? ` ${habit.unit}` : ''} ${periodLabel}`}
                      </span>
                    </div>

                    <div className="habit-actions" onClick={(e) => e.stopPropagation()}>
                      {habit.type === 'boolean' ? (
                        /* Boolean habit: ✓/+ per fare (identici), - per annullare */
                        <>
                          <button
                            onClick={() => checkIn(habit.id, 1)}
                            className="btn-complete-max"
                            disabled={todayChecked}
                            title="Segna come fatto oggi"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => checkIn(habit.id, 1)}
                            className="btn-increment"
                            disabled={todayChecked}
                            title="Segna come fatto oggi"
                          >
                            +
                          </button>
                          <button
                            onClick={() => checkIn(habit.id, 0)}
                            className="btn-decrement"
                            disabled={!todayChecked}
                            title="Annulla"
                          >
                            -
                          </button>
                        </>
                      ) : (
                        /* US-024: Max button + US-026: +/- con limit */
                        <>
                          <button
                            onClick={() => {
                              if (isDaily) {
                                checkIn(habit.id, habit.target)
                              } else {
                                // Per weekly/monthly: completa il remaining
                                const remaining = habit.target - (periodInfo?.currentValue ?? 0) + currentValue
                                checkIn(habit.id, Math.max(currentValue, remaining))
                              }
                            }}
                            className="btn-complete-max"
                            disabled={isDaily ? currentValue >= habit.target : isCompleted}
                            title="Completa al massimo"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleIncrement(habit.id, currentValue)}
                            className="btn-increment"
                            disabled={isDaily ? currentValue >= habit.target : isCompleted}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleDecrement(habit.id, currentValue)}
                            className="btn-decrement"
                            disabled={isDaily ? currentValue === 0 : (periodInfo?.currentValue ?? 0) === 0}
                          >
                            -
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="btn-edit"
                        title="Modifica"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => setDeletingHabit(habit)}
                        className="btn-delete"
                        title="Elimina"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Badge categoria — full-width, visibile solo su mobile via CSS */}
                  {category && (
                    <span
                      className="habit-category-badge habit-category-badge--footer"
                      style={{ backgroundColor: habit.color + '20', color: habit.color }}
                    >
                      {category.icon} {category.name}
                    </span>
                  )}
                </CardContent>
                </Card>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Dialog segnalazione bug (US-030) */}
      <Dialog
        open={showBugReport}
        onOpenChange={(open) => {
          if (!open) {
            setShowBugReport(false)
            setBugMessage('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Segnala un problema</DialogTitle>
            <DialogDescription>
              Descrivi il problema che hai riscontrato. Lo vedremo il prima possibile.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={bugMessage}
            onChange={(e) => setBugMessage(e.target.value)}
            placeholder="Cosa è successo? Come possiamo riprodurlo?"
            rows={5}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color, #e5e7eb)',
              backgroundColor: 'var(--input-bg, #fff)',
              color: 'var(--text-primary, #111827)',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBugReport(false)
                setBugMessage('')
              }}
              disabled={isSendingBug}
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmitBugReport}
              disabled={!bugMessage.trim() || isSendingBug}
            >
              {isSendingBug ? 'Invio...' : 'Invia segnalazione'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale riordinamento compatto */}
      <Dialog
        open={showReorderModal}
        onOpenChange={(open) => {
          if (!open) stopModalAutoScroll()
          setShowReorderModal(open)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Riordina abitudini</DialogTitle>
            <DialogDescription>
              Trascina le righe per cambiare l&apos;ordine.
            </DialogDescription>
          </DialogHeader>
          <ul ref={reorderListRef} className="reorder-modal-list">
            {reorderModalList.map((habit) => (
              <li
                key={habit.id}
                draggable
                onDragStart={(e) => handleDragStart(e, habit.id)}
                onDragOver={(e) => handleModalDragOver(e, habit.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, habit.id)}
                onDragEnd={handleModalDragEnd}
                className={`reorder-item ${dragOverId === habit.id ? 'drag-over' : ''}`}
              >
                <span className="reorder-item-handle">⠿</span>
                {habit.color && (
                  <span
                    className="reorder-item-color"
                    style={{ background: habit.color }}
                  />
                )}
                <span className="reorder-item-name">{habit.name}</span>
                <span className="reorder-item-stars">{'★'.repeat(habit.weight)}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      {/* Debug info - solo in development */}
      {import.meta.env.DEV && (
        <footer className="debug-footer">
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify({ habits: habits.length, progress }, null, 2)}</pre>
            <p style={{ marginTop: '8px', fontSize: '11px', color: '#888' }}>
              Per testare streak: apri DevTools (F12) → Console → esegui:
              <br />
              <code>localStorage.setItem('habit-tracker-test', 'true')</code>
            </p>
          </details>
        </footer>
      )}

      {/* Toast notifications (US-022) */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
        onUndo={handleUndoFromToast}
      />
    </div>
  )
}

export default App
