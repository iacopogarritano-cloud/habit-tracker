/**
 * DayView - Dashboard per un giorno specifico (US-019)
 * Calendario mensile con reportistica contestuale
 *
 * Props:
 * - date: data selezionata (formato YYYY-MM-DD)
 * - habits: lista di tutte le abitudini
 * - getCheckInForDate: funzione per ottenere check-in (habitId, date) => checkIn
 * - getProgressForDate: funzione per progresso giornaliero (date) => progress
 * - getWeeklyProgressForDate: funzione per progresso settimanale (date) => progress
 * - getMonthlyProgressForDate: funzione per progresso mensile (date) => progress
 * - onCheckIn: callback per registrare check-in (habitId, value, date)
 * - onClose: callback per chiudere la vista
 * - onSelectDate: callback per selezionare una data
 */

import { useState, useMemo } from 'react'

// Costanti - fuori dal componente per evitare ricreazione
const MONTH_NAMES = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
]
const WEEK_DAYS = ['L', 'Ma', 'Me', 'G', 'V', 'S', 'D']
const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

/**
 * Genera tutti i giorni per il calendario mensile
 * Include padding per completare le settimane (Lun-Dom)
 */
function getCalendarDays(year, month) {
  const days = []

  // Primo giorno del mese
  const firstDay = new Date(year, month, 1)
  // Ultimo giorno del mese
  const lastDay = new Date(year, month + 1, 0)

  // Giorno della settimana del primo (0=Dom, 1=Lun, ..., 6=Sab)
  // Convertiamo in (0=Lun, 1=Mar, ..., 6=Dom)
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7

  // Giorni da aggiungere prima (dal mese precedente)
  const paddingBefore = firstDayOfWeek

  // Giorni totali nel mese
  const daysInMonth = lastDay.getDate()

  // Giorni da aggiungere dopo per completare l'ultima settimana
  const totalCells = Math.ceil((paddingBefore + daysInMonth) / 7) * 7
  const paddingAfter = totalCells - paddingBefore - daysInMonth

  // Helper per formattare data in locale — evita shift UTC che sfasa di 1 giorno
  const formatDate = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // Padding prima (giorni del mese precedente)
  for (let i = paddingBefore - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: formatDate(d), isCurrentMonth: false })
  }

  // Giorni del mese
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push({ date: formatDate(d), isCurrentMonth: true })
  }

  // Padding dopo (giorni del mese successivo)
  for (let i = 1; i <= paddingAfter; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ date: formatDate(d), isCurrentMonth: false })
  }

  return days
}

// Soglie per colore progresso (corrispondono a --color-success/warning/danger in App.css)
const PROGRESS_THRESHOLD_HIGH = 70
const PROGRESS_THRESHOLD_MED = 40

/**
 * Determina il colore in base alla percentuale usando CSS variables
 */
function getProgressColor(percent) {
  if (percent >= PROGRESS_THRESHOLD_HIGH) return 'var(--color-success)'
  if (percent >= PROGRESS_THRESHOLD_MED) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

/**
 * Mini card per il progresso contestuale
 */
function MiniProgressCard({ title, icon, percent }) {
  const color = getProgressColor(percent)

  return (
    <div className="dayview-mini-card">
      <span className="dayview-mini-icon">{icon}</span>
      <span className="dayview-mini-title">{title}</span>
      <span className="dayview-mini-percent" style={{ color }}>
        {percent}%
      </span>
    </div>
  )
}

export function DayView({
  date,
  habits,
  getCheckInForDate,
  getPeriodCompletion,
  getProgressForDate,
  getWeeklyProgressForDate,
  getMonthlyProgressForDate,
  onCheckIn,
  onClose,
  onSelectDate,
}) {
  const today = new Date().toISOString().split('T')[0]
  const isFuture = date > today
  const isToday = date === today

  // Mese visualizzato nel calendario (può essere diverso dalla data selezionata)
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(date)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  // Usa costanti definite fuori dal componente: MONTH_NAMES, WEEK_DAYS, DAY_NAMES

  // Genera giorni del calendario per il mese visualizzato
  const calendarDays = useMemo(() => {
    return getCalendarDays(viewMonth.year, viewMonth.month)
  }, [viewMonth.year, viewMonth.month])

  // Progresso contestuale per la data selezionata
  const dayProgress = useMemo(() => {
    return getProgressForDate(date)
  }, [date, getProgressForDate])

  const weeklyProgress = useMemo(() => {
    return getWeeklyProgressForDate(date)
  }, [date, getWeeklyProgressForDate])

  const monthlyProgress = useMemo(() => {
    return getMonthlyProgressForDate(date)
  }, [date, getMonthlyProgressForDate])

  // Formatta la data selezionata per il display
  const formattedDate = useMemo(() => {
    const d = new Date(date + 'T00:00:00') // evita parsing UTC che sfasa il giorno in timezone non-UTC
    return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
  }, [date])

  // Calcola lo stato di ogni abitudine per questa data
  const habitsWithStatus = useMemo(() => {
    return habits.map((habit) => {
      const checkIn = getCheckInForDate(habit.id, date)
      const currentValue = checkIn?.value || 0
      const isDaily = !habit.timeframe || habit.timeframe === 'daily'

      if (!isDaily && getPeriodCompletion) {
        // US-027: Per weekly/monthly, mostra progresso di periodo
        const periodInfo = getPeriodCompletion(habit.id, date)
        return {
          ...habit,
          currentValue, // valore del giorno per le azioni
          isCompleted: periodInfo.currentValue >= habit.target,
          completionPercent: periodInfo.percent,
          periodInfo,
        }
      }

      const isCompleted = currentValue >= habit.target
      const completionPercent = Math.min(100, (currentValue / habit.target) * 100)

      return {
        ...habit,
        currentValue,
        isCompleted,
        completionPercent,
        periodInfo: null,
      }
    })
  }, [habits, date, getCheckInForDate, getPeriodCompletion])

  // Handler per navigare tra i mesi
  const handleMonthNavigate = (offset) => {
    setViewMonth((current) => {
      let newMonth = current.month + offset
      let newYear = current.year

      if (newMonth < 0) {
        newMonth = 11
        newYear--
      } else if (newMonth > 11) {
        newMonth = 0
        newYear++
      }

      return { year: newYear, month: newMonth }
    })
  }

  // Handler per selezionare un giorno dal calendario
  const handleDayClick = (dayDate) => {
    if (dayDate > today) return // Non selezionare giorni futuri
    onSelectDate(dayDate)
  }

  // Handler per incrementare
  const handleIncrement = (habitId, currentValue) => {
    onCheckIn(habitId, currentValue + 1, date)
  }

  // Handler per decrementare
  const handleDecrement = (habitId, currentValue) => {
    if (currentValue > 0) {
      onCheckIn(habitId, currentValue - 1, date)
    }
  }

  return (
    <div className="dayview-overlay" onClick={onClose}>
      <div className="dayview-modal dayview-modal-calendar" onClick={(e) => e.stopPropagation()}>
        {/* Header con navigazione mese */}
        <div className="dayview-header">
          <button
            className="dayview-nav-btn"
            onClick={() => handleMonthNavigate(-1)}
            title="Mese precedente"
          >
            ←
          </button>

          <div className="dayview-month-title">
            <h2>
              {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
            </h2>
          </div>

          <button
            className="dayview-nav-btn"
            onClick={() => handleMonthNavigate(1)}
            title="Mese successivo"
          >
            →
          </button>

          <button className="btn-close dayview-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Report Cards contestuali */}
        <div className="dayview-report-cards">
          <MiniProgressCard title={formattedDate} icon="📅" percent={dayProgress.percent} />
          <MiniProgressCard title="Ultimi 7 gg" icon="📆" percent={weeklyProgress.percent} />
          <MiniProgressCard title="Ultimi 30 gg" icon="📊" percent={monthlyProgress.percent} />
        </div>

        {/* Calendario mensile */}
        <div className="dayview-calendar">
          {/* Header giorni settimana */}
          <div className="dayview-calendar-header">
            {WEEK_DAYS.map((day, i) => (
              <span key={i} className="dayview-weekday">
                {day}
              </span>
            ))}
          </div>

          {/* Griglia giorni */}
          <div className="dayview-calendar-grid-monthly">
            {calendarDays.map((day) => {
              const isSelected = day.date === date
              const isDayToday = day.date === today
              const isDayFuture = day.date > today

              return (
                <button
                  key={day.date}
                  className={`dayview-calendar-day-monthly
                    ${isSelected ? 'selected' : ''}
                    ${isDayToday ? 'today' : ''}
                    ${!day.isCurrentMonth ? 'other-month' : ''}
                    ${isDayFuture ? 'future' : ''}`}
                  onClick={() => handleDayClick(day.date)}
                  disabled={isDayFuture}
                  title={day.date}
                >
                  {new Date(day.date + 'T00:00:00').getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Avviso per giorni futuri */}
        {isFuture && (
          <div className="dayview-future-warning">
            Non puoi modificare check-in per giorni futuri
          </div>
        )}

        {/* Dettaglio giorno selezionato */}
        <div className="dayview-selected-info">
          <h3>
            {formattedDate} {isToday && <span className="dayview-today-badge">Oggi</span>}
          </h3>
          <span className="dayview-selected-stats">
            {dayProgress.completed}/{dayProgress.total} completate
          </span>
        </div>

        {/* Lista abitudini */}
        <div className="dayview-habits">
          {habitsWithStatus.length === 0 ? (
            <p className="dayview-empty">Nessuna abitudine configurata</p>
          ) : (
            <ul className="dayview-habit-list">
              {habitsWithStatus.map((habit) => (
                <li
                  key={habit.id}
                  className={`dayview-habit-card ${habit.isCompleted ? 'completed' : ''}`}
                  style={{ borderLeftColor: habit.color || 'transparent' }}
                >
                  <div className="dayview-habit-info">
                    <span className="dayview-habit-name">{habit.name}</span>
                  </div>

                  <div className="dayview-habit-row">
                  {/* Progress slider — identico alla dashboard */}
                  <div
                    className="habit-progress-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="habit-progress habit-progress-slider"
                      style={{
                        background: (() => {
                          const isDaily = !habit.timeframe || habit.timeframe === 'daily'
                          const sliderMax = isDaily
                            ? habit.target
                            : Math.max(habit.target, habit.currentValue)
                          const pct = sliderMax > 0 ? (habit.currentValue / sliderMax) * 100 : 0
                          const c = habit.color || 'var(--color-primary)'
                          return `linear-gradient(to right, ${c} ${pct}%, var(--color-border) ${pct}%)`
                        })(),
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max={(() => {
                          const isDaily = !habit.timeframe || habit.timeframe === 'daily'
                          return isDaily
                            ? habit.target
                            : Math.max(habit.target, habit.currentValue)
                        })()}
                        value={habit.currentValue}
                        onChange={(e) => onCheckIn(habit.id, parseInt(e.target.value, 10), date)}
                        className="progress-slider"
                        aria-label={`Progresso ${habit.name}`}
                        style={{ '--progress-color': habit.color || 'var(--color-primary)' }}
                      />
                    </div>
                    <span className="progress-text">
                      {habit.periodInfo
                        ? `${habit.periodInfo.currentValue}/${habit.target}${habit.unit ? ` ${habit.unit}` : ''} ${habit.timeframe === 'weekly' ? 'questa sett.' : 'questo mese'}`
                        : `${habit.currentValue}/${habit.target}${habit.unit ? ` ${habit.unit}` : ''}`}
                    </span>
                  </div>

                  {!isFuture && (
                    <div className="dayview-habit-actions" onClick={(e) => e.stopPropagation()}>
                      {habit.type === 'boolean' ? (
                        /* Boolean: identico alla dashboard (✓, +, -) */
                        <>
                          <button
                            onClick={() => onCheckIn(habit.id, 1, date)}
                            className="btn-complete-max"
                            disabled={habit.currentValue >= 1}
                            title="Segna come fatto"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => onCheckIn(habit.id, 1, date)}
                            className="btn-increment"
                            disabled={habit.currentValue >= 1}
                            title="Segna come fatto"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onCheckIn(habit.id, 0, date)}
                            className="btn-decrement"
                            disabled={habit.currentValue === 0}
                          >
                            -
                          </button>
                        </>
                      ) : (
                        /* Count/duration: identico alla dashboard (✓, +, -) */
                        <>
                          <button
                            onClick={() => {
                              const isDaily = !habit.timeframe || habit.timeframe === 'daily'
                              if (isDaily) {
                                onCheckIn(habit.id, habit.target, date)
                              } else {
                                const remaining =
                                  habit.target - (habit.periodInfo?.currentValue ?? 0) + habit.currentValue
                                onCheckIn(habit.id, Math.max(habit.currentValue, remaining), date)
                              }
                            }}
                            className="btn-complete-max"
                            disabled={habit.isCompleted}
                            title="Completa al massimo"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleIncrement(habit.id, habit.currentValue)}
                            className="btn-increment"
                            disabled={habit.isCompleted}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleDecrement(habit.id, habit.currentValue)}
                            className="btn-decrement"
                            disabled={habit.currentValue === 0}
                          >
                            -
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayView
