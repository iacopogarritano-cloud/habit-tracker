/**
 * Habit Tracker - MVP
 * US-002: Form creazione abitudine con peso
 */

import { useState, useCallback, useMemo } from 'react';
import { useHabitStore } from './hooks/useHabitStore';
import { HabitForm } from './components/HabitForm';
import { HabitDetail } from './components/HabitDetail';
import { DayView } from './components/DayView';
import { ReportCards } from './components/ReportCards';
import { getCheckIn } from './utils/storage';
import './App.css';

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
    _rawData,
  } = useHabitStore();

  // State per mostrare/nascondere il form
  const [showForm, setShowForm] = useState(false);
  // State per editing
  const [editingHabit, setEditingHabit] = useState(null);
  // State per delete confirmation
  const [deletingHabit, setDeletingHabit] = useState(null);
  // State per detail view (US-008)
  const [selectedHabit, setSelectedHabit] = useState(null);
  // State per day view (dashboard per data)
  const [selectedDate, setSelectedDate] = useState(null);
  // State per ricerca abitudini (US-009)
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra abitudini in base alla ricerca (US-009)
  const filteredHabits = useMemo(() => {
    if (!searchQuery.trim()) return habits;
    const query = searchQuery.toLowerCase().trim();
    return habits.filter(habit =>
      habit.name.toLowerCase().includes(query)
    );
  }, [habits, searchQuery]);

  // Funzione per ottenere check-in per una data specifica (DEVE essere prima di early return)
  const getCheckInForDate = useCallback((habitId, date) => {
    if (!_rawData) return null;
    return getCheckIn(_rawData, habitId, date);
  }, [_rawData]);

  // Loading state
  if (isLoading) {
    return <div className="app-loading">Caricamento...</div>;
  }

  // Handler per creare/modificare abitudine
  const handleSubmitHabit = (habitData) => {
    if (editingHabit) {
      // Modifica abitudine esistente
      updateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
    } else {
      // Crea nuova abitudine
      addHabit(habitData);
    }
    setShowForm(false);
  };

  // Handler per iniziare modifica
  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  // Handler per annullare form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  // Handler per confermare eliminazione
  const handleConfirmDelete = () => {
    if (deletingHabit) {
      deleteHabit(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  // Handler per incrementare
  const handleIncrement = (habitId, currentValue) => {
    checkIn(habitId, currentValue + 1);
  };

  // Handler per decrementare
  const handleDecrement = (habitId, currentValue) => {
    if (currentValue > 0) {
      checkIn(habitId, currentValue - 1);
    }
  };

  return (
    <div className="app">
      {/* Header con data cliccabile */}
      <header className="app-header">
        <h1>Habit Tracker</h1>
        <button
          className="today-date-btn"
          onClick={() => setSelectedDate(today)}
          title="Clicca per vedere il dettaglio del giorno"
        >
          <span className="calendar-icon">📅</span>
          <span>{today}</span>
        </button>
      </header>

      {/* Error display */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

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
      {deletingHabit && (
        <div className="modal-overlay" onClick={() => setDeletingHabit(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Eliminare abitudine?</h3>
            <p className="modal-text">
              Stai per eliminare "<strong>{deletingHabit.name}</strong>".
              <br />
              Questa azione è irreversibile e perderai tutto lo storico.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeletingHabit(null)}
              >
                Annulla
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal dettaglio abitudine (US-008, US-012) */}
      {selectedHabit && (
        <HabitDetail
          habit={selectedHabit}
          stats={getStats(selectedHabit.id)}
          lastNDays={getLastNDays(30)}
          onClose={() => setSelectedHabit(null)}
          onCheckIn={checkIn}
        />
      )}

      {/* Modal day view con calendario mensile (US-019) */}
      {selectedDate && (
        <DayView
          date={selectedDate}
          habits={habits}
          getCheckInForDate={getCheckInForDate}
          getProgressForDate={getProgressForDate}
          getWeeklyProgressForDate={getWeeklyProgressForDate}
          getMonthlyProgressForDate={getMonthlyProgressForDate}
          onCheckIn={checkIn}
          onClose={() => setSelectedDate(null)}
          onSelectDate={setSelectedDate}
        />
      )}

      {/* Lista abitudini (US-003) */}
      <section className="habits-section">
        <div className="section-header">
          <h2>Le tue abitudini</h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-add">
              + Aggiungi
            </button>
          )}
        </div>

        {/* Barra di ricerca (US-009) */}
        {habits.length > 0 && (
          <div className="search-bar">
            <input
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
        )}

        {/* Conteggio risultati filtrati */}
        {searchQuery && (
          <div className="search-results-count">
            {filteredHabits.length} {filteredHabits.length === 1 ? 'abitudine trovata' : 'abitudini trovate'}
          </div>
        )}

        {habits.length === 0 ? (
          <div className="empty-state">
            <p>Nessuna abitudine ancora.</p>
            <p>Clicca "+ Aggiungi" per creare la tua prima abitudine!</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="empty-state">
            <p>Nessuna abitudine corrisponde a "{searchQuery}"</p>
            <button
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              Cancella ricerca
            </button>
          </div>
        ) : (
          <ul className="habit-list">
            {filteredHabits.map((habit) => {
              const todayCheckIn = getTodayCheckIn(habit.id);
              const currentValue = todayCheckIn?.value || 0;
              const completionPercent = Math.min(100, (currentValue / habit.target) * 100);
              const isCompleted = currentValue >= habit.target;
              const stats = getStats(habit.id);
              const category = getCategory(habit.categoryId); // US-016

              return (
                <li
                  key={habit.id}
                  className={`habit-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => setSelectedHabit(habit)}
                >
                  <div className="habit-info">
                    <div className="habit-name-row">
                      <span className="habit-name">{habit.name}</span>
                      {stats.currentStreak > 0 && (
                        <span className="habit-streak">🔥 {stats.currentStreak}</span>
                      )}
                    </div>
                    <div className="habit-meta">
                      <span className="habit-weight">{'★'.repeat(habit.weight)}</span>
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

                  <div className="habit-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${completionPercent}%`,
                        backgroundColor: habit.color || 'var(--color-primary)'
                      }}
                    />
                    <span className="progress-text">
                      {currentValue}/{habit.target}{habit.unit ? ` ${habit.unit}` : ''}
                    </span>
                  </div>

                  <div className="habit-actions" onClick={(e) => e.stopPropagation()}>
                    {habit.type === 'boolean' ? (
                      /* Checkbox per abitudini boolean */
                      <button
                        onClick={() => checkIn(habit.id, isCompleted ? 0 : 1)}
                        className={`btn-check ${isCompleted ? 'checked' : ''}`}
                        title={isCompleted ? 'Segna come non fatto' : 'Segna come fatto'}
                      >
                        ✓
                      </button>
                    ) : (
                      /* +/- buttons per count/duration - ordine: +, - */
                      <>
                        <button
                          onClick={() => handleIncrement(habit.id, currentValue)}
                          className="btn-increment"
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
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Debug info */}
      <footer className="debug-footer">
        <details>
          <summary>Debug Info</summary>
          <pre>{JSON.stringify({ habits: habits.length, progress }, null, 2)}</pre>
          <p style={{ marginTop: '8px', fontSize: '11px', color: '#888' }}>
            Per testare streak: apri DevTools (F12) → Console → esegui:<br/>
            <code>localStorage.setItem('habit-tracker-test', 'true')</code>
          </p>
        </details>
      </footer>
    </div>
  );
}

export default App;
