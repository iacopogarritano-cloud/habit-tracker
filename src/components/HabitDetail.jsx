/**
 * HabitDetail - Mostra dettagli, streak e cronologia di un'abitudine
 * US-008: Streak e cronologia
 * US-012: Edit check-in giorni passati
 *
 * Props:
 * - habit: l'abitudine da visualizzare
 * - stats: { currentStreak, longestStreak, completionRate, history }
 * - lastNDays: array di date ultimi N giorni
 * - onClose: callback per chiudere la vista dettaglio
 * - onCheckIn: callback per registrare check-in (habitId, value, date)
 */

import { useState, useMemo } from 'react'

export function HabitDetail({ habit, stats, lastNDays, onClose, onCheckIn }) {
  // Stato per editing di un giorno specifico
  const [editingDay, setEditingDay] = useState(null)
  const [editValue, setEditValue] = useState(0)

  // Calcola lo stato di ogni giorno (completed, partial, missed, future)
  const calendarDays = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]

    return lastNDays.map((date) => {
      const checkIn = stats.history.get(date)
      const isFuture = date > today

      if (isFuture) {
        return { date, status: 'future', value: null }
      }

      if (!checkIn) {
        return { date, status: 'missed', value: 0 }
      }

      // Per boolean: 1 = completato, 0 = non fatto
      // Per count/duration: confronta con target
      const isComplete = checkIn.value >= habit.target
      const isPartial = checkIn.value > 0 && checkIn.value < habit.target

      return {
        date,
        status: isComplete ? 'completed' : isPartial ? 'partial' : 'missed',
        value: checkIn.value,
      }
    })
  }, [lastNDays, stats.history, habit.target])

  // Formatta la data per il tooltip (es: "Lun 5 Feb")
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr)
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    const months = [
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
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
  }

  // Handler per click su un giorno del calendario
  const handleDayClick = (day) => {
    // Non permettere edit su giorni futuri
    if (day.status === 'future') return

    setEditingDay(day.date)
    setEditValue(day.value || 0)
  }

  // Handler per salvare la modifica
  const handleSaveEdit = () => {
    if (editingDay && onCheckIn) {
      onCheckIn(habit.id, editValue, editingDay)
    }
    setEditingDay(null)
    setEditValue(0)
  }

  // Handler per annullare la modifica
  const handleCancelEdit = () => {
    setEditingDay(null)
    setEditValue(0)
  }

  // Handler per toggle booleano (per abitudini boolean)
  const handleBooleanToggle = () => {
    const newValue = editValue === 0 ? 1 : 0
    setEditValue(newValue)
    if (onCheckIn) {
      onCheckIn(habit.id, newValue, editingDay)
    }
    setEditingDay(null)
  }

  return (
    <div className="habit-detail-overlay" onClick={onClose}>
      <div className="habit-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="habit-detail-header">
          <div className="habit-detail-color" style={{ backgroundColor: habit.color }} />
          <h2>{habit.name}</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Stats Cards */}
        <div className="habit-stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Streak attuale</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{stats.longestStreak}</span>
            <span className="stat-label">Record streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{stats.completionRate}%</span>
            <span className="stat-label">Ultimi 30 giorni</span>
          </div>
        </div>

        {/* Mini-form per editing giorno (US-012) */}
        {editingDay && (
          <div className="day-edit-form">
            <p className="day-edit-title">Modifica {formatDateLabel(editingDay)}</p>

            {habit.type === 'boolean' ? (
              // Per boolean: semplice toggle
              <div className="day-edit-boolean">
                <button
                  className={`btn-boolean ${editValue === 1 ? 'active' : ''}`}
                  onClick={handleBooleanToggle}
                >
                  {editValue === 1 ? '✓ Fatto' : '✗ Non fatto'}
                </button>
              </div>
            ) : (
              // Per count/duration: input numerico
              <div className="day-edit-numeric">
                <button
                  className="btn-decrement"
                  onClick={() => setEditValue(Math.max(0, editValue - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={editValue}
                  onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="edit-value-input"
                />
                <button className="btn-increment" onClick={() => setEditValue(editValue + 1)}>
                  +
                </button>
                <span className="edit-target">
                  / {habit.target}
                  {habit.unit ? ` ${habit.unit}` : ''}
                </span>
              </div>
            )}

            {habit.type !== 'boolean' && (
              <div className="day-edit-actions">
                <button className="btn-cancel-small" onClick={handleCancelEdit}>
                  Annulla
                </button>
                <button className="btn-save-small" onClick={handleSaveEdit}>
                  Salva
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendar Grid - ultimi 30 giorni */}
        <div className="habit-calendar-section">
          <h3>Cronologia (ultimi 30 giorni)</h3>
          <p className="calendar-hint">Clicca su un giorno per modificarlo</p>
          <div className="habit-calendar-grid">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className={`calendar-day ${day.status} ${day.status !== 'future' ? 'clickable' : ''} ${editingDay === day.date ? 'editing' : ''}`}
                title={`${formatDateLabel(day.date)}: ${
                  day.status === 'completed'
                    ? 'Completato'
                    : day.status === 'partial'
                      ? `Parziale (${day.value}/${habit.target})`
                      : day.status === 'missed'
                        ? 'Non fatto'
                        : 'Futuro'
                }`}
                style={day.status === 'completed' ? { backgroundColor: habit.color } : {}}
                onClick={() => handleDayClick(day)}
              />
            ))}
          </div>
          <div className="calendar-legend">
            <span>
              <span className="legend-dot missed"></span> Non fatto
            </span>
            <span>
              <span className="legend-dot partial"></span> Parziale
            </span>
            <span>
              <span
                className="legend-dot completed"
                style={{ backgroundColor: habit.color }}
              ></span>{' '}
              Completato
            </span>
          </div>
        </div>

        {/* Info abitudine */}
        <div className="habit-info-section">
          <p>
            <strong>Tipo:</strong>{' '}
            {habit.type === 'boolean' ? 'Sì/No' : habit.type === 'count' ? 'Contatore' : 'Durata'}
          </p>
          <p>
            <strong>Obiettivo:</strong> {habit.target}
            {habit.unit ? ` ${habit.unit}` : ''} {habit.type !== 'boolean' ? 'al giorno' : ''}
          </p>
          <p>
            <strong>Peso:</strong> {'★'.repeat(habit.weight)}
            {'☆'.repeat(5 - habit.weight)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HabitDetail
