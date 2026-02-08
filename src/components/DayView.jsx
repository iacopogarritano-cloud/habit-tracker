/**
 * DayView - Dashboard per un giorno specifico
 * Permette di visualizzare e modificare tutte le abitudini per una data
 *
 * Props:
 * - date: data selezionata (formato YYYY-MM-DD)
 * - habits: lista di tutte le abitudini
 * - getCheckInForDate: funzione per ottenere check-in (habitId, date) => checkIn
 * - onCheckIn: callback per registrare check-in (habitId, value, date)
 * - onClose: callback per chiudere la vista
 * - onNavigate: callback per navigare (offset: -1 o +1)
 */

import { useMemo } from 'react';

export function DayView({ date, habits, getCheckInForDate, onCheckIn, onClose, onNavigate, onSelectDate }) {
  const today = new Date().toISOString().split('T')[0];
  const isFuture = date > today;
  const isToday = date === today;

  // Genera ultimi 30 giorni per il mini-calendario
  const last30Days = useMemo(() => {
    const days = [];
    const todayDate = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  // Formatta la data per il display (es: "Venerdì 7 Febbraio 2025")
  const formattedDate = useMemo(() => {
    const d = new Date(date);
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }, [date]);

  // Calcola lo stato di ogni abitudine per questa data
  const habitsWithStatus = useMemo(() => {
    return habits.map(habit => {
      const checkIn = getCheckInForDate(habit.id, date);
      const currentValue = checkIn?.value || 0;
      const isCompleted = currentValue >= habit.target;
      const completionPercent = Math.min(100, (currentValue / habit.target) * 100);

      return {
        ...habit,
        currentValue,
        isCompleted,
        completionPercent,
      };
    });
  }, [habits, date, getCheckInForDate]);

  // Calcola progresso totale del giorno (pesato con completamento parziale)
  const dayProgress = useMemo(() => {
    if (habits.length === 0) return { percent: 0, completed: 0, total: 0 };

    let totalWeight = 0;
    let weightedCompleted = 0;
    let completedCount = 0;

    habitsWithStatus.forEach(h => {
      totalWeight += h.weight;
      // Usa completamento parziale come nella dashboard principale
      weightedCompleted += (h.completionPercent / 100) * h.weight;
      if (h.isCompleted) {
        completedCount++;
      }
    });

    const percent = totalWeight > 0 ? Math.round((weightedCompleted / totalWeight) * 100) : 0;
    return { percent, completed: completedCount, total: habits.length };
  }, [habitsWithStatus, habits.length]);

  // Handler per incrementare
  const handleIncrement = (habitId, currentValue) => {
    onCheckIn(habitId, currentValue + 1, date);
  };

  // Handler per decrementare
  const handleDecrement = (habitId, currentValue) => {
    if (currentValue > 0) {
      onCheckIn(habitId, currentValue - 1, date);
    }
  };

  // Handler per toggle boolean
  const handleBooleanToggle = (habitId, isCompleted) => {
    onCheckIn(habitId, isCompleted ? 0 : 1, date);
  };

  return (
    <div className="dayview-overlay" onClick={onClose}>
      <div className="dayview-modal" onClick={e => e.stopPropagation()}>
        {/* Header con navigazione */}
        <div className="dayview-header">
          <button
            className="dayview-nav-btn"
            onClick={() => onNavigate(-1)}
            title="Giorno precedente"
          >
            ←
          </button>

          <div className="dayview-date">
            <h2>{formattedDate}</h2>
            {isToday && <span className="dayview-today-badge">Oggi</span>}
          </div>

          <button
            className="dayview-nav-btn"
            onClick={() => onNavigate(1)}
            disabled={isFuture}
            title="Giorno successivo"
          >
            →
          </button>

          <button className="btn-close dayview-close" onClick={onClose}>×</button>
        </div>

        {/* Mini-calendario per selezione rapida giorno */}
        <div className="dayview-calendar-picker">
          <div className="dayview-calendar-grid">
            {last30Days.map(day => {
              const isSelected = day === date;
              const isDayToday = day === today;
              return (
                <button
                  key={day}
                  className={`dayview-calendar-day ${isSelected ? 'selected' : ''} ${isDayToday ? 'today' : ''}`}
                  onClick={() => onSelectDate(day)}
                  title={new Date(day).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                >
                  {new Date(day).getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Avviso per giorni futuri */}
        {isFuture && (
          <div className="dayview-future-warning">
            Non puoi modificare check-in per giorni futuri
          </div>
        )}

        {/* Progresso del giorno */}
        <div className="dayview-progress">
          <div className="dayview-progress-circle" style={{
            color: dayProgress.percent >= 70 ? '#22c55e' :
                   dayProgress.percent >= 40 ? '#eab308' : '#ef4444'
          }}>
            {dayProgress.percent}%
          </div>
          <div className="dayview-progress-info">
            <span className="dayview-progress-label">Progresso del giorno</span>
            <span className="dayview-progress-detail">
              {dayProgress.completed}/{dayProgress.total} completate
            </span>
          </div>
        </div>

        {/* Lista abitudini */}
        <div className="dayview-habits">
          {habitsWithStatus.length === 0 ? (
            <p className="dayview-empty">Nessuna abitudine configurata</p>
          ) : (
            <ul className="dayview-habit-list">
              {habitsWithStatus.map(habit => (
                <li
                  key={habit.id}
                  className={`dayview-habit-card ${habit.isCompleted ? 'completed' : ''}`}
                >
                  <div className="dayview-habit-info">
                    <div
                      className="dayview-habit-color"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="dayview-habit-name">{habit.name}</span>
                  </div>

                  <div className="dayview-habit-progress">
                    <div
                      className="dayview-progress-bar"
                      style={{
                        width: `${habit.completionPercent}%`,
                        backgroundColor: habit.color || 'var(--color-primary)'
                      }}
                    />
                    <span className="dayview-progress-text">
                      {habit.currentValue}/{habit.target}{habit.unit ? ` ${habit.unit}` : ''}
                    </span>
                  </div>

                  {!isFuture && (
                    <div className="dayview-habit-actions">
                      {habit.type === 'boolean' ? (
                        <button
                          onClick={() => handleBooleanToggle(habit.id, habit.isCompleted)}
                          className={`btn-check ${habit.isCompleted ? 'checked' : ''}`}
                          title={habit.isCompleted ? 'Segna come non fatto' : 'Segna come fatto'}
                        >
                          ✓
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleIncrement(habit.id, habit.currentValue)}
                            className="btn-increment"
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DayView;
