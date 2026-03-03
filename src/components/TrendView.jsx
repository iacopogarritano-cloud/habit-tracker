/**
 * TrendView - US-V2-008: Vista Trend Storico (Aggregato per Settimana/Mese)
 *
 * Lista scorrevole dei punteggi aggregati:
 * - Tab Settimane: ultime 24 settimane (più recente in cima)
 * - Tab Mesi: ultimi 12 mesi (più recente in cima)
 * Click su riga → apre ReportView per quel periodo specifico
 */

import { useState, useMemo } from 'react'
import './TrendView.css'

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]

const MONTH_NAMES_SHORT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
]

const WEEK_COUNT = 24
const MONTH_COUNT = 12

function getProgressColor(percent) {
  if (percent >= 70) return 'var(--color-success)'
  if (percent >= 40) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

function formatLocalDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${MONTH_NAMES_SHORT[d.getMonth()]}`
}

// Lunedì della settimana corrente (ISO: settimana inizia il lunedì)
function getCurrentMonday() {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday
}

// Ultime WEEK_COUNT settimane, più recente prima
function generateWeeks() {
  const monday = getCurrentMonday()
  const weeks = []
  for (let i = 0; i < WEEK_COUNT; i++) {
    const m = new Date(monday)
    m.setDate(monday.getDate() - i * 7)
    const mStr = formatLocalDate(m)
    const sun = new Date(m)
    sun.setDate(m.getDate() + 6)
    const sunStr = formatLocalDate(sun)
    weeks.push({
      monday: mStr,
      year: m.getFullYear(),
      label: `${formatShortDate(mStr)} – ${formatShortDate(sunStr)}`,
    })
  }
  return weeks
}

// Ultimi MONTH_COUNT mesi, più recente prima
function generateMonths() {
  const today = new Date()
  const months = []
  for (let i = 0; i < MONTH_COUNT; i++) {
    let year = today.getFullYear()
    let month = today.getMonth() + 1 - i
    while (month < 1) { month += 12; year-- }
    months.push({ year, month, label: `${MONTH_NAMES[month - 1]} ${year}` })
  }
  return months
}

// ────────────────────────────────────────────────────────────
// TrendRow — riga singola
// ────────────────────────────────────────────────────────────

function TrendRow({ label, percent, hasData, onClick }) {
  const color = hasData ? getProgressColor(percent) : null
  return (
    <div
      className={`tv-row${hasData ? ' clickable' : ''}`}
      onClick={hasData ? onClick : undefined}
      role={hasData ? 'button' : undefined}
    >
      <span className="tv-row-label">{label}</span>
      {hasData ? (
        <>
          <div className="tv-row-bar">
            <div
              className="tv-row-bar-fill"
              style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
            />
          </div>
          <span className="tv-row-percent" style={{ color }}>{Math.round(percent)}%</span>
        </>
      ) : (
        <span className="tv-row-empty">Nessun dato</span>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// TrendView — componente principale
// ────────────────────────────────────────────────────────────

export function TrendView({ getCalendarWeekProgress, getCalendarMonthProgress, onClose, onSelectPeriod }) {
  const [tab, setTab] = useState('weeks')

  const weeks = useMemo(() => generateWeeks(), [])
  const months = useMemo(() => generateMonths(), [])

  const weekRows = useMemo(() =>
    weeks.map((w) => {
      const result = getCalendarWeekProgress(w.monday)
      return { ...w, percent: result?.percent ?? 0, hasData: (result?.daysWithData ?? 0) > 0 }
    }),
    [weeks, getCalendarWeekProgress]
  )

  const monthRows = useMemo(() =>
    months.map((m) => {
      const result = getCalendarMonthProgress(m.year, m.month)
      return { ...m, percent: result?.percent ?? 0, hasData: (result?.daysWithData ?? 0) > 0 }
    }),
    [months, getCalendarMonthProgress]
  )

  const rows = tab === 'weeks' ? weekRows : monthRows

  return (
    <div className="tv-overlay" onClick={onClose}>
      <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tv-header">
          <div className="view-title-group">
            <h2>Trend storico</h2>
            <p className="view-subtitle">Evoluzione del punteggio settimana per settimana. Clicca un periodo per il dettaglio.</p>
          </div>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="tv-tabs">
          <button
            className={`tv-tab${tab === 'weeks' ? ' active' : ''}`}
            onClick={() => setTab('weeks')}
          >
            Settimane
          </button>
          <button
            className={`tv-tab${tab === 'months' ? ' active' : ''}`}
            onClick={() => setTab('months')}
          >
            Mesi
          </button>
        </div>

        <div className="tv-list">
          {rows.map((row) => (
            <TrendRow
              key={tab === 'weeks' ? row.monday : `${row.year}-${row.month}`}
              label={row.label}
              percent={row.percent}
              hasData={row.hasData}
              onClick={() =>
                onSelectPeriod(
                  tab === 'weeks'
                    ? { type: 'week', monday: row.monday, year: row.year }
                    : { type: 'month', year: row.year, month: row.month }
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendView
