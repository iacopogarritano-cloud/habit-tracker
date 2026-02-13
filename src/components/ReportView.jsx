/**
 * ReportView - Vista Report per Periodi Specifici (US-020)
 *
 * Differenza con DayView:
 * - DayView: "ultimi 7/30 giorni" relativi alla data selezionata
 * - ReportView: periodo fisso (mese intero 1-31, settimana Lun-Dom)
 */

import { useState, useMemo, useEffect } from 'react'
import { getWeeksOfYear } from '../utils/storage'

// Nomi mesi in italiano
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

// Nomi giorni abbreviati
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

/**
 * Genera lista di mesi disponibili (da inizio anno a mese corrente)
 */
function getAvailableMonths(year) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  const months = []
  const maxMonth = year === currentYear ? currentMonth : 12

  // Ordine cronologico: Gennaio in alto, poi Febbraio, etc.
  for (let m = 1; m <= maxMonth; m++) {
    months.push({ month: m, label: MONTH_NAMES[m - 1] })
  }

  return months
}

/**
 * Ottiene il colore in base alla percentuale
 */
function getProgressColor(percent) {
  if (percent >= 70) return 'var(--color-success)'
  if (percent >= 40) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export function ReportView({ onClose, getCalendarMonthProgress, getCalendarWeekProgress }) {
  // Stato: tipo vista (month/week)
  const [viewType, setViewType] = useState('month')

  // Stato: anno e mese/settimana selezionati
  const today = new Date()
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
  const [selectedWeekMonday, setSelectedWeekMonday] = useState(null)

  // Mesi disponibili per l'anno selezionato
  const availableMonths = useMemo(() => getAvailableMonths(selectedYear), [selectedYear])

  // Settimane disponibili per l'anno selezionato
  const availableWeeks = useMemo(() => getWeeksOfYear(selectedYear), [selectedYear])

  // Inizializza settimana se non selezionata
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!selectedWeekMonday && availableWeeks.length > 0) {
      setSelectedWeekMonday(availableWeeks[0].monday)
    }
  }, [availableWeeks, selectedWeekMonday])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Calcola progresso del periodo selezionato
  const periodProgress = useMemo(() => {
    if (viewType === 'month') {
      return getCalendarMonthProgress(selectedYear, selectedMonth)
    } else if (selectedWeekMonday) {
      return getCalendarWeekProgress(selectedWeekMonday)
    }
    return null
  }, [
    viewType,
    selectedYear,
    selectedMonth,
    selectedWeekMonday,
    getCalendarMonthProgress,
    getCalendarWeekProgress,
  ])

  // Anni disponibili (ordine cronologico: anno precedente, poi corrente)
  const currentYear = today.getFullYear()
  const availableYears = [currentYear - 1, currentYear]

  // Trova label settimana selezionata
  const selectedWeekLabel = useMemo(() => {
    if (!selectedWeekMonday) return ''
    const week = availableWeeks.find((w) => w.monday === selectedWeekMonday)
    return week ? week.label : ''
  }, [selectedWeekMonday, availableWeeks])

  return (
    <div className="reportview-overlay" onClick={onClose}>
      <div className="reportview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="reportview-header">
          <h2>Report</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tipo vista (Mese/Settimana) */}
        <div className="reportview-tabs">
          <button
            className={`reportview-tab ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >
            📅 Mese
          </button>
          <button
            className={`reportview-tab ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => setViewType('week')}
          >
            📆 Settimana
          </button>
        </div>

        {/* Selettori periodo */}
        <div className="reportview-selectors">
          {/* Anno */}
          <select
            className="reportview-select"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value))
              // Reset mese/settimana quando cambia anno
              setSelectedMonth(1)
              setSelectedWeekMonday(null)
            }}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Mese (se vista mese) */}
          {viewType === 'month' && (
            <select
              className="reportview-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {availableMonths.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.label}
                </option>
              ))}
            </select>
          )}

          {/* Settimana (se vista settimana) */}
          {viewType === 'week' && (
            <select
              className="reportview-select"
              value={selectedWeekMonday || ''}
              onChange={(e) => setSelectedWeekMonday(e.target.value)}
            >
              {availableWeeks.map((w) => (
                <option key={w.monday} value={w.monday}>
                  {w.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Progresso del periodo */}
        {periodProgress && (
          <>
            <div className="reportview-progress">
              <div
                className="reportview-progress-circle"
                style={{ color: getProgressColor(periodProgress.percent) }}
              >
                {periodProgress.percent}%
              </div>
              <div className="reportview-progress-info">
                <div className="reportview-progress-title">
                  {viewType === 'month'
                    ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
                    : selectedWeekLabel}
                </div>
                <div className="reportview-progress-subtitle">
                  {periodProgress.daysWithData} giorni con dati su {periodProgress.totalDays}
                </div>
              </div>
            </div>

            {/* Breakdown giornaliero */}
            <div className="reportview-breakdown">
              <h3>Dettaglio giornaliero</h3>
              <div className="reportview-days-grid">
                {viewType === 'week' && (
                  <div className="reportview-weekday-headers">
                    {DAY_NAMES.map((day) => (
                      <span key={day} className="reportview-weekday">
                        {day}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`reportview-days ${viewType === 'week' ? 'week-view' : 'month-view'}`}
                >
                  {periodProgress.dailyBreakdown.map((day) => {
                    const dayDate = new Date(day.date)
                    const dayNum = dayDate.getDate()

                    return (
                      <div
                        key={day.date}
                        className={`reportview-day ${day.isFuture ? 'future' : ''} ${day.hasData ? 'has-data' : ''}`}
                        title={`${day.date}: ${day.isFuture ? 'Futuro' : day.percent + '%'}`}
                      >
                        <span className="reportview-day-num">{dayNum}</span>
                        {!day.isFuture && (
                          <div
                            className="reportview-day-bar"
                            style={{
                              width: `${day.percent}%`,
                              backgroundColor: getProgressColor(day.percent),
                            }}
                          />
                        )}
                        {!day.isFuture && (
                          <span className="reportview-day-percent">{day.percent}%</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReportView
