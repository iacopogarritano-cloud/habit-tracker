/**
 * ReportCards - US-018: Reportistica settimanale e mensile
 * Mostra tre card affiancate con progresso pesato:
 * - Oggi
 * - Settimana (media ultimi 7 giorni)
 * - Mese (media ultimi 30 giorni)
 */

/**
 * Determina il colore in base alla percentuale
 * Verde >= 70%, Giallo 40-69%, Rosso < 40%
 */
function getProgressColor(percent) {
  if (percent >= 70) return '#22c55e' // verde
  if (percent >= 40) return '#eab308' // giallo
  return '#ef4444' // rosso
}

/**
 * Card singola per il progresso
 */
function ProgressCard({ title, icon, percent, subtitle }) {
  const color = getProgressColor(percent)

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
    </div>
  )
}

/**
 * Componente principale con le tre card
 */
export function ReportCards({ todayProgress, weeklyProgress, monthlyProgress }) {
  return (
    <div className="report-cards-container">
      <ProgressCard
        title="Oggi"
        icon="📅"
        percent={todayProgress.percent}
        subtitle={`${todayProgress.completed}/${todayProgress.total} completate`}
      />
      <ProgressCard
        title="Settimana"
        icon="📆"
        percent={weeklyProgress.percent}
        subtitle={`${weeklyProgress.daysWithData}/${weeklyProgress.totalDays} giorni`}
      />
      <ProgressCard
        title="Mese"
        icon="📊"
        percent={monthlyProgress.percent}
        subtitle={`${monthlyProgress.daysWithData}/${monthlyProgress.totalDays} giorni`}
      />
    </div>
  )
}

export default ReportCards
