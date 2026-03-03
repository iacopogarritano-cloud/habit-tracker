/**
 * HeatmapView - US-V2-004: Vista Heatmap per Abitudine
 *
 * Mostra la costanza nel tempo per ogni abitudine tramite una griglia colorata.
 * Timeframe: Mensile (calendario), Trimestrale (3 mini-mesi), Annuale (stile GitHub)
 */

import { useState, useMemo } from 'react'
import { getMonthDates, getTodayDate } from '../utils/storage'
import './HeatmapView.css'

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]
const MONTH_NAMES_SHORT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
]
const WEEK_DAYS_SHORT = ['L', 'Ma', 'Me', 'G', 'V', 'S', 'D']

// Formatta Date → 'YYYY-MM-DD' usando orario locale (evita UTC shift)
function formatLocalDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Restituisce ISO weekday: Mon=1, ..., Sun=7
function isoWeekday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  return day === 0 ? 7 : day
}

// Colore in base alla percentuale (stesso schema ReportCards)
function getCellColor(percent) {
  if (percent >= 70) return 'var(--color-success)'
  if (percent >= 40) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

// ────────────────────────────────────────────────────────────
// Period computation
// ────────────────────────────────────────────────────────────

function computeMonthlyPeriod(offset) {
  const today = new Date()
  const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1)
  const year = ref.getFullYear()
  const month = ref.getMonth() + 1
  const dates = getMonthDates(year, month)
  return {
    type: 'monthly',
    label: `${MONTH_NAMES[month - 1]} ${year}`,
    dates,
    firstDayOffset: isoWeekday(dates[0]) - 1, // 0=Mon col, 6=Sun col
  }
}

function computeQuarterlyPeriod(offset) {
  const today = new Date()
  let year = today.getFullYear()
  let q = Math.floor(today.getMonth() / 3) + offset
  while (q < 0) { q += 4; year-- }
  while (q >= 4) { q -= 4; year++ }
  const startMonth = q * 3 + 1 // 1, 4, 7, 10
  const quarterNames = ['T1 (Gen–Mar)', 'T2 (Apr–Giu)', 'T3 (Lug–Set)', 'T4 (Ott–Dic)']
  const monthGroups = [0, 1, 2].map((i) => {
    const m = startMonth + i
    const dates = getMonthDates(year, m)
    return { name: MONTH_NAMES_SHORT[m - 1], dates, firstDayOffset: isoWeekday(dates[0]) - 1 }
  })
  return { type: 'quarterly', label: `${quarterNames[q]} ${year}`, monthGroups }
}

function computeYearlyPeriod(offset) {
  const year = new Date().getFullYear() + offset
  // Inizia dal lunedì della settimana che contiene il 1° gennaio
  const jan1 = new Date(year, 0, 1)
  const jan1ISO = jan1.getDay() === 0 ? 7 : jan1.getDay()
  const start = new Date(year, 0, 1 - (jan1ISO - 1))

  const weeks = []
  const monthLabels = {}
  const seenMonths = new Set()
  let cur = new Date(start)

  // Continua finché non abbiamo coperto tutto l'anno
  while (cur.getFullYear() <= year) {
    const week = []
    for (let d = 0; d < 7; d++) {
      week.push({ date: formatLocalDate(cur), inYear: cur.getFullYear() === year })
      cur.setDate(cur.getDate() + 1)
    }
    // Etichetta mese: prima settimana in cui compare quel mese
    const inYearDays = week.filter((d) => d.inYear)
    if (inYearDays.length > 0) {
      const m = new Date(inYearDays[0].date + 'T00:00:00').getMonth()
      if (!seenMonths.has(m)) {
        seenMonths.add(m)
        monthLabels[weeks.length] = MONTH_NAMES_SHORT[m]
      }
    }
    weeks.push(week)
  }

  return { type: 'yearly', label: `${year}`, weeks, monthLabels }
}

// ────────────────────────────────────────────────────────────
// MonthGrid — usato da Mensile (full) e Trimestrale (compact)
// ────────────────────────────────────────────────────────────

function MonthGrid({ dates, firstDayOffset, completionMap, today, compact, onSelectDate }) {
  const emptyCells = Array.from({ length: firstDayOffset }, (_, i) => (
    <div key={`pad-${i}`} className="hm-cell empty" />
  ))

  const dayCells = dates.map((date) => {
    const isFuture = date > today
    const percent = completionMap[date]
    const hasData = percent !== undefined

    let style = {}
    let cls = 'hm-cell'
    if (isFuture) cls += ' future'
    else if (!hasData) cls += ' no-data'
    else style.backgroundColor = getCellColor(percent)

    const dayNum = parseInt(date.split('-')[2], 10)

    return (
      <div
        key={date}
        className={cls}
        style={style}
        title={`${date}: ${isFuture ? 'futuro' : hasData ? `${percent}%` : 'nessun dato'}`}
        onClick={() => !isFuture && onSelectDate(date)}
        role={!isFuture ? 'button' : undefined}
      >
        {!compact && <span className="hm-cell-num">{dayNum}</span>}
      </div>
    )
  })

  return (
    <div className="hm-month-grid">
      {!compact && (
        <div className="hm-weekday-row">
          {WEEK_DAYS_SHORT.map((d) => <span key={d}>{d}</span>)}
        </div>
      )}
      <div className={`hm-cells${compact ? ' compact' : ''}`}>
        {emptyCells}
        {dayCells}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// YearlyGrid — stile GitHub (52-53 colonne × 7 righe)
// ────────────────────────────────────────────────────────────

function YearlyGrid({ weeks, monthLabels, completionMap, today, onSelectDate }) {
  return (
    <div className="hm-yearly-container">
      <div className="hm-yearly-scroll">
        {/* Etichette mesi */}
        <div className="hm-yearly-months">
          <div className="hm-yearly-day-spacer" />
          {weeks.map((_, i) => (
            <div key={i} className="hm-yearly-month-slot">
              {monthLabels[i] ?? ''}
            </div>
          ))}
        </div>

        {/* 7 righe (giorni) × N colonne (settimane) */}
        {WEEK_DAYS_SHORT.map((dayLabel, row) => (
          <div key={row} className="hm-yearly-row">
            <span className="hm-yearly-day-label">{row % 2 === 0 ? dayLabel : ''}</span>
            {weeks.map((week, col) => {
              const cell = week[row]
              if (!cell || !cell.inYear) {
                return <div key={col} className="hm-yearly-cell empty" />
              }
              const isFuture = cell.date > today
              const percent = completionMap[cell.date]
              const hasData = percent !== undefined

              let style = {}
              let cls = 'hm-yearly-cell'
              if (isFuture) cls += ' future'
              else if (!hasData) cls += ' no-data'
              else style.backgroundColor = getCellColor(percent)

              return (
                <div
                  key={col}
                  className={cls}
                  style={style}
                  title={`${cell.date}: ${isFuture ? 'futuro' : hasData ? `${percent}%` : 'nessun dato'}`}
                  onClick={() => !isFuture && onSelectDate(cell.date)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// HabitHeatmapBlock — un blocco per abitudine
// ────────────────────────────────────────────────────────────

function HabitHeatmapBlock({ habit, periodData, getPeriodCompletion, onSelectDate, today }) {
  // Estrae tutte le date del periodo
  const allDates = useMemo(() => {
    if (periodData.type === 'monthly') return periodData.dates
    if (periodData.type === 'quarterly') return periodData.monthGroups.flatMap((g) => g.dates)
    return periodData.weeks.flat().filter((d) => d.inYear).map((d) => d.date)
  }, [periodData])

  // Calcola completamento per ogni data (skip futuro e pre-creazione)
  const completionMap = useMemo(() => {
    const map = {}
    const habitCreated = habit.createdAt ? habit.createdAt.slice(0, 10) : '2020-01-01'
    for (const date of allDates) {
      if (date > today || date < habitCreated) continue
      const result = getPeriodCompletion(habit.id, date)
      map[date] = result?.percent ?? 0
    }
    return map
  }, [habit.id, habit.createdAt, allDates, getPeriodCompletion, today])

  // Media del periodo
  const avgPercent = useMemo(() => {
    const vals = Object.values(completionMap)
    return vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0
  }, [completionMap])

  return (
    <div className="hm-habit-block">
      <div className="hm-habit-header">
        <span
          className="hm-habit-dot"
          style={{ backgroundColor: habit.color || 'var(--color-primary)' }}
        />
        <span className="hm-habit-name">{habit.name}</span>
        <span className="hm-habit-avg">{avgPercent}% media</span>
      </div>

      {periodData.type === 'monthly' && (
        <MonthGrid
          dates={periodData.dates}
          firstDayOffset={periodData.firstDayOffset}
          completionMap={completionMap}
          today={today}
          compact={false}
          onSelectDate={onSelectDate}
        />
      )}

      {periodData.type === 'quarterly' && (
        <div className="hm-quarterly-months">
          {periodData.monthGroups.map((group) => (
            <div key={group.name} className="hm-quarterly-month">
              <div className="hm-quarterly-month-name">{group.name}</div>
              <MonthGrid
                dates={group.dates}
                firstDayOffset={group.firstDayOffset}
                completionMap={completionMap}
                today={today}
                compact={true}
                onSelectDate={onSelectDate}
              />
            </div>
          ))}
        </div>
      )}

      {periodData.type === 'yearly' && (
        <YearlyGrid
          weeks={periodData.weeks}
          monthLabels={periodData.monthLabels}
          completionMap={completionMap}
          today={today}
          onSelectDate={onSelectDate}
        />
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// HeatmapView — componente principale
// ────────────────────────────────────────────────────────────

export function HeatmapView({ habits, getPeriodCompletion, onClose, onSelectDate }) {
  const [timeframe, setTimeframe] = useState('yearly')
  const [offset, setOffset] = useState(0)
  const today = getTodayDate()

  const periodData = useMemo(() => {
    if (timeframe === 'monthly') return computeMonthlyPeriod(offset)
    if (timeframe === 'quarterly') return computeQuarterlyPeriod(offset)
    return computeYearlyPeriod(offset)
  }, [timeframe, offset])

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf)
    setOffset(0)
  }

  return (
    <div className="hm-overlay" onClick={onClose}>
      <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="hm-header">
          <div className="view-title-group">
            <h2>Heatmap</h2>
            <p className="view-subtitle">La costanza di ogni abitudine nel tempo, giorno per giorno.</p>
          </div>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {/* Tabs timeframe */}
        <div className="hm-tabs">
          {[
            { key: 'yearly', label: 'Annuale' },
            { key: 'quarterly', label: 'Trimestrale' },
            { key: 'monthly', label: 'Mensile' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`hm-tab${timeframe === key ? ' active' : ''}`}
              onClick={() => handleTimeframeChange(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Navigazione periodo */}
        <div className="hm-nav">
          <button onClick={() => setOffset((o) => o - 1)} title="Periodo precedente">←</button>
          <span className="hm-period-label">{periodData.label}</span>
          <button
            onClick={() => setOffset((o) => o + 1)}
            disabled={offset >= 0}
            title="Periodo successivo"
          >
            →
          </button>
        </div>

        {/* Legenda colori */}
        <div className="hm-legend">
          <span className="hm-legend-item">
            <span className="hm-legend-dot" style={{ backgroundColor: 'var(--color-success)' }} />
            ≥ 70%
          </span>
          <span className="hm-legend-item">
            <span className="hm-legend-dot" style={{ backgroundColor: 'var(--color-warning)' }} />
            40–69%
          </span>
          <span className="hm-legend-item">
            <span className="hm-legend-dot" style={{ backgroundColor: 'var(--color-danger)' }} />
            &lt; 40%
          </span>
          <span className="hm-legend-item">
            <span className="hm-legend-dot hm-legend-dot--empty" />
            Nessun dato
          </span>
        </div>

        {/* Lista abitudini */}
        <div className="hm-habits-list">
          {habits.length === 0 ? (
            <p className="hm-empty">Nessuna abitudine da mostrare.</p>
          ) : (
            habits.map((habit) => (
              <HabitHeatmapBlock
                key={habit.id}
                habit={habit}
                periodData={periodData}
                getPeriodCompletion={getPeriodCompletion}
                onSelectDate={(date) => {
                  onSelectDate(date)
                  onClose()
                }}
                today={today}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HeatmapView
