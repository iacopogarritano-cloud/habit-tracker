/**
 * Weighbit - Weighted Habit Tracker
 * US-002: Form creazione abitudine con peso
 * US-022: Undo/Annulla Azione
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useHabitStore } from './hooks/useHabitStore'
import { useTheme } from './hooks/useTheme'
import { useUndoStack } from './hooks/useUndoStack'
import { useAuth } from './contexts/AuthContext'
import { HabitForm } from './components/HabitForm'
import { HabitDetail } from './components/HabitDetail'
import { DayView } from './components/DayView'
import { ReportView } from './components/ReportView'
import { ReportCards } from './components/ReportCards'
import { ToastContainer } from './components/Toast'
import LoginButton from './components/LoginButton'
import UserMenu from './components/UserMenu'
import LoginPage from './components/LoginPage'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent } from './components/ui/card'
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
    deleteHabit,
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
  const { isAuthenticated, isLoading: authLoading, configError } = useAuth()

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
  // State per conferma reset giornata
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  // State per conferma nome duplicato
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false)
  const [pendingDuplicateData, setPendingDuplicateData] = useState(null)

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

  // Filtra abitudini in base a ricerca e categoria
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

    return result
  }, [habits, searchQuery, categoryFilter])

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

  return (
    <div className="app">
      {/* Header con data cliccabile e theme toggle */}
      <header className="app-header">
        <div className="app-header-row">
          <h1>Weighbit</h1>
          <div className="header-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReportView(true)}
              title="Report periodi"
            >
              📊
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            {/* Auth UI (US-021) */}
            {isAuthenticated ? <UserMenu /> : <LoginButton />}
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
      />

      {/* Form creazione/modifica abitudine (US-002, US-006) */}
      {showForm && (
        <section className="form-section">
          <HabitForm
            onSubmit={handleSubmitHabit}
            onCancel={handleCancelForm}
            initialData={editingHabit}
            categories={categories}
          />
        </section>
      )}

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
          onClose={() => setShowReportView(false)}
          getCalendarMonthProgress={getCalendarMonthProgress}
          getCalendarWeekProgress={getCalendarWeekProgress}
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
            <p>Nessuna abitudine ancora.</p>
            <p>Clicca "+ Aggiungi" per creare la tua prima abitudine!</p>
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
          <ul className="habit-list">
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
                <li key={habit.id}>
                <Card
                  className={`habit-card ${isCompleted ? 'completed' : ''}`}
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
                          style={{ backgroundColor: category.color + '20', color: category.color }}
                        >
                          {category.icon} {category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar - slider per tutti i tipi (incluso boolean) */}
                  <div
                    className="habit-progress-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="habit-progress habit-progress-slider"
                      style={{
                        background: (() => {
                          const sliderMax = isDaily ? habit.target : Math.max(habit.target, currentValue)
                          const pct = sliderMax > 0 ? (currentValue / sliderMax) * 100 : 0
                          const c = habit.color || 'var(--color-primary)'
                          return `linear-gradient(to right, ${c} ${pct}%, var(--color-border) ${pct}%)`
                        })(),
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max={isDaily ? habit.target : Math.max(habit.target, currentValue)}
                        value={currentValue}
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
                          disabled={currentValue === 0}
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
                </CardContent>
                </Card>
                </li>
              )
            })}
          </ul>
        )}
      </section>

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
