/**
 * ScoringInfoModal - Spiega come funziona il punteggio pesato di Weighbit
 *
 * IMPORTANTE: aggiornare questo modal ogni volta che si modifica la logica
 * di calcolo del punteggio (storage.js: getWeightedDailyProgress,
 * getWeightedProgressForDate, getPeriodDivisor, getPeriodCompletionForHabit).
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export function ScoringInfoModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="scoring-info-modal">
        <DialogHeader>
          <DialogTitle>Come funziona il punteggio</DialogTitle>
        </DialogHeader>

        <div className="scoring-info-body">

          {/* Formula base */}
          <section className="scoring-info-section">
            <h3>La formula base</h3>
            <p>
              Ogni punteggio in Weighbit (giornaliero, settimanale, mensile) è una
              <strong> media pesata</strong> delle tue abitudini:
            </p>
            <div className="scoring-formula-box">
              Punteggio = Σ (peso_effettivo × completamento%) / Σ pesi_effettivi
            </div>
            <p>
              Un'abitudine con peso 5 incide il doppio di una con peso 2,
              indipendentemente da quante abitudini hai in totale.
            </p>
          </section>

          {/* Pesi */}
          <section className="scoring-info-section">
            <h3>I pesi (1–5 stelle)</h3>
            <p>Il peso rappresenta <strong>l'importanza di ogni singola occorrenza</strong> dell'abitudine:</p>
            <div className="scoring-weight-grid">
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐</span>
                <span>Routine di supporto — poco impatto se saltata</span>
              </div>
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐⭐⭐</span>
                <span>Abitudine importante — impatta la settimana</span>
              </div>
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐⭐⭐⭐⭐</span>
                <span>Priorità massima — fondamentale per il benessere</span>
              </div>
            </div>
          </section>

          {/* Timeframe */}
          <section className="scoring-info-section">
            <h3>Frequenza e normalizzazione dinamica</h3>
            <p>
              Fare qualcosa una volta al mese è diverso dal farlo ogni giorno.
              Le abitudini non-quotidiane vengono normalizzate tramite un divisore
              applicato al loro peso — e il divisore è <strong>dinamico</strong>: cambia
              in base a quanti giorni sono passati nel periodo.
            </p>
            <p>
              <strong>Perché dinamico?</strong> A inizio settimana, non sappiamo ancora
              se l'abitudine settimanale verrà completata. Il peso è quindi ridotto
              al minimo. Man mano che il periodo avanza, il peso cresce fino a raggiungere
              il valore pieno a fine periodo.
            </p>
            <table className="scoring-timeframe-table">
              <thead>
                <tr>
                  <th>Frequenza</th>
                  <th>Divisore a inizio periodo</th>
                  <th>Divisore a fine periodo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giornaliera</td>
                  <td>÷ 1</td>
                  <td>÷ 1</td>
                </tr>
                <tr>
                  <td>Settimanale</td>
                  <td>÷ 10.5 (lunedì)</td>
                  <td>÷ 1.5 (domenica)</td>
                </tr>
                <tr>
                  <td>Mensile</td>
                  <td>÷ ~60 (giorno 1)</td>
                  <td>÷ 2 (ultimo giorno)</td>
                </tr>
              </tbody>
            </table>
            <p className="scoring-info-note">
              In questo modo, il punteggio di ogni giorno riflette esattamente
              ciò che si sapeva in quel momento — senza ricalcoli retroattivi.
              Il lunedì, l'abitudine settimanale pesa pochissimo (periodo appena iniziato).
              La domenica, pesa quasi quanto una giornaliera.
            </p>
          </section>

          {/* Retroattività */}
          <section className="scoring-info-section">
            <h3>Abitudini settimanali e mensili: quando le fai non importa</h3>
            <p>
              Per le abitudini non-quotidiane, conta solo
              <strong> completare l'obiettivo nel periodo</strong>, non il giorno esatto:
            </p>
            <ul className="scoring-info-list">
              <li>
                <strong>Nei report (settimanale/mensile):</strong> se hai completato
                l'obiettivo in qualsiasi giorno del periodo, tutti i giorni di quel
                periodo vengono contati al 100%. Ad esempio, se avessi un'abitudine mensile
                e la completassi il 28 del mese, il report mostrerebbe il contributo
                completo per tutti e 28 i giorni — non solo gli ultimi 2.
              </li>
              <li>
                <strong>Punteggio live (OGGI):</strong> fino al completamento conta 0%,
                poi passa al 100% per il resto del periodo. Il punteggio "OGGI" riflette
                solo ciò che è già accaduto.
              </li>
            </ul>
          </section>

          {/* Quali punteggi esistono */}
          <section className="scoring-info-section">
            <h3>I punteggi dell'app</h3>
            <p>Weighbit mostra punteggi diversi per diversi orizzonti temporali.
              Tutti usano la stessa formula pesata, applicata a periodi diversi:</p>
            <ul className="scoring-info-list">
              <li>
                <strong>OGGI:</strong> media pesata in tempo reale delle abitudini di oggi.
                Le abitudini settimanali/mensili contano 100% se già completate nel periodo
                corrente, 0% se non ancora.
              </li>
              <li>
                <strong>Ultimi 7 / 30 giorni:</strong> media dei punteggi giornalieri
                degli N giorni precedenti. Mostra la tua costanza recente.
              </li>
              <li>
                <strong>Questa settimana / Questo mese:</strong> media dei punteggi
                giornalieri del periodo corrente, con retroattività per le abitudini
                non-quotidiane.
              </li>
            </ul>
          </section>

          {/* Esempio pratico */}
          <section className="scoring-info-section">
            <h3>Esempio pratico (ultimo giorno del mese)</h3>
            <p>
              Supponi di avere due abitudini, entrambe con peso 4,
              e di trovarti all'<strong>ultimo giorno del mese</strong>
              (quando il divisore mensile ha raggiunto il valore pieno ÷2):
            </p>
            <ul className="scoring-info-list">
              <li>
                Un'abitudine <strong>giornaliera</strong> —
                peso effettivo <strong>4.0</strong> (÷1)
              </li>
              <li>
                Un'abitudine <strong>mensile</strong> —
                peso effettivo <strong>2.0</strong> (÷2, fine periodo)
              </li>
            </ul>
            <p>Totale pesi effettivi: 4.0 + 2.0 = <strong>6.0</strong></p>
            <div className="scoring-examples-grid">
              <div className="scoring-example-row">
                <span>Entrambe completate</span>
                <strong>100%</strong>
              </div>
              <div className="scoring-example-row">
                <span>Solo la giornaliera completata</span>
                <strong>66.7%</strong>
                <span className="scoring-example-calc">(4.0 / 6.0)</span>
              </div>
              <div className="scoring-example-row">
                <span>Solo la mensile completata</span>
                <strong>33.3%</strong>
                <span className="scoring-example-calc">(2.0 / 6.0)</span>
              </div>
              <div className="scoring-example-row">
                <span>Nessuna completata</span>
                <strong>0%</strong>
              </div>
            </div>
            <p className="scoring-info-note">
              All'inizio del mese lo stesso scenario darebbe percentuali diverse,
              perché il divisore mensile è più alto (il periodo è appena iniziato).
              Il 100% è sempre raggiungibile completando tutte le abitudini attive.
            </p>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  )
}
