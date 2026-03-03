/**
 * ReportCards - US-018: Reportistica settimanale e mensile
 * Mostra tre card affiancate con progresso pesato:
 * - Oggi
 * - Settimana (media ultimi 7 giorni)
 * - Mese (media ultimi 30 giorni)
 */

import { useState } from 'react'

function getProgressColor(percent) {
  if (percent >= 70) return '#22c55e'
  if (percent >= 40) return '#eab308'
  return '#ef4444'
}

/**
 * Card singola per il progresso con tooltip ℹ (US-031)
 * Il tooltip è sibling del badge (non figlio) → posizionato relativo alla card,
 * quindi non sfora mai i bordi dello schermo.
 */
function ProgressCard({ title, icon, percent, subtitle, tooltip }) {
  const color = getProgressColor(percent)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="report-card">
      <div className="report-card-header">
        <span className="report-card-icon">{icon}</span>
        <span className="report-card-title">{title}</span>
      </div>
      <div className="report-card-percent" style={{ color }}>
        {percent}%
      </div>
      <div className="report-card-bar">
        <div
          className="report-card-bar-fill"
          style={{
            width: `${Math.min(100, percent)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {subtitle && <div className="report-card-subtitle">{subtitle}</div>}
      {tooltip && (
        <>
          {showTooltip && (
            <div className="report-card-tooltip">{tooltip}</div>
          )}
          <span
            className="report-card-info"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip((v) => !v)}
            aria-label="Info"
          >
            i
          </span>
        </>
      )}
    </div>
  )
}

/**
 * Mini card compatta per il punteggio per tipo di frequenza
 * Con tooltip ℹ per spiegare il periodo di riferimento (US-031)
 */
function TimeframeCard({ label, icon, data, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false)
  if (!data) return null
  const color = getProgressColor(data.percent)

  return (
    <div className="tf-card">
      <span className="tf-card-icon">{icon}</span>
      <span className="tf-card-label">{label}</span>
      <span className="tf-card-percent" style={{ color }}>{data.percent}%</span>
      <div className="tf-card-bar">
        <div
          className="tf-card-bar-fill"
          style={{ width: `${Math.min(100, data.percent)}%`, backgroundColor: color }}
        />
      </div>
      <span className="tf-card-count">{data.count} abit.</span>
      {tooltip && (
        <>
          {showTooltip && (
            <div className="tf-card-tooltip">{tooltip}</div>
          )}
          <span
            className="tf-card-info"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip((v) => !v)}
            aria-label="Info"
          >
            i
          </span>
        </>
      )}
    </div>
  )
}

export function ReportCards({ todayProgress, weeklyProgress, monthlyProgress, multiTimeframeProgress }) {
  return (
    <div className="report-cards-wrapper">
      <div className="report-cards-container">
        <ProgressCard
          title="Oggi"
          icon="📅"
          percent={todayProgress.percent}
          subtitle={`${todayProgress.completed}/${todayProgress.total} abitudini completate`}
          tooltip="Punteggio pesato di oggi. Mescola giornaliere (completate oggi), settimanali (attribuite su 7 giorni) e mensili (attribuite su 30 giorni). ★★★★★ vale 5x rispetto a ★."
        />
        <ProgressCard
          title="Ultimi 7 gg"
          icon="📆"
          percent={weeklyProgress.percent}
          subtitle={`${weeklyProgress.daysWithData}/${weeklyProgress.totalDays} giorni tracciati`}
          tooltip="Media del punteggio degli ultimi 7 giorni. Stessa logica di 'Oggi' applicata a ogni giorno: giornaliere, settimanali e mensili, pesate per importanza (★★★★★ = 5x)."
        />
        <ProgressCard
          title="Ultimi 30 gg"
          icon="📊"
          percent={monthlyProgress.percent}
          subtitle={`${monthlyProgress.daysWithData}/${monthlyProgress.totalDays} giorni tracciati`}
          tooltip="Media del punteggio degli ultimi 30 giorni. Stessa logica di 'Oggi' applicata a ogni giorno: giornaliere, settimanali e mensili, pesate per importanza (★★★★★ = 5x)."
        />
      </div>

      {multiTimeframeProgress?.hasMultiple && (
        <div className="tf-row">
          <div className="tf-cards">
            <TimeframeCard
              label="Giornaliere"
              icon="☀️"
              data={multiTimeframeProgress.daily}
              tooltip="Punteggio pesato di oggi delle sole abitudini giornaliere (★★★★★ = 5x rispetto a ★)."
            />
            <TimeframeCard
              label="Settimanali"
              icon="📆"
              data={multiTimeframeProgress.weekly}
              tooltip="Punteggio pesato di oggi delle sole abitudini settimanali. La quota giornaliera è calcolata sul progresso della settimana in corso (★★★★★ = 5x)."
            />
            <TimeframeCard
              label="Mensili"
              icon="📅"
              data={multiTimeframeProgress.monthly}
              tooltip="Punteggio pesato di oggi delle sole abitudini mensili. La quota giornaliera è calcolata sul progresso del mese in corso (★★★★★ = 5x)."
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportCards
