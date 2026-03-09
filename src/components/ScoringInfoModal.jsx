/**
 * ScoringInfoModal - Spiega come funziona il punteggio pesato di Weighbit
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
            <h3>La formula</h3>
            <p>
              Il punteggio giornaliero è una <strong>media pesata</strong> di tutte le tue abitudini:
            </p>
            <div className="scoring-formula-box">
              Punteggio = Σ (peso × completamento%) / Σ pesi totali
            </div>
            <p>
              Un'abitudine con peso 5 incide il doppio di una con peso 2 — indipendentemente da quante ne hai.
            </p>
          </section>

          {/* Pesi */}
          <section className="scoring-info-section">
            <h3>I pesi (1–5)</h3>
            <div className="scoring-weight-grid">
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐</span>
                <span>Abitudine di routine, poco impatto se mancata</span>
              </div>
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐⭐⭐</span>
                <span>Abitudine importante, impatta la settimana</span>
              </div>
              <div className="scoring-weight-row">
                <span className="scoring-weight-stars">⭐⭐⭐⭐⭐</span>
                <span>Priorità massima, fondamentale per il benessere</span>
              </div>
            </div>
          </section>

          {/* Timeframe */}
          <section className="scoring-info-section">
            <h3>Frequenza e normalizzazione</h3>
            <p>
              Le abitudini non-quotidiane vengono normalizzate per evitare che fare una cosa
              una volta al mese valga quanto farla ogni giorno:
            </p>
            <table className="scoring-timeframe-table">
              <thead>
                <tr>
                  <th>Frequenza</th>
                  <th>Divisore</th>
                  <th>Peso 4 → peso effettivo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giornaliera</td>
                  <td>÷ 1</td>
                  <td><strong>4.0</strong> / giorno</td>
                </tr>
                <tr>
                  <td>Settimanale</td>
                  <td>÷ 1.5</td>
                  <td><strong>2.7</strong> / giorno</td>
                </tr>
                <tr>
                  <td>Mensile</td>
                  <td>÷ 2</td>
                  <td><strong>2.0</strong> / giorno</td>
                </tr>
              </tbody>
            </table>
            <p className="scoring-info-note">
              Una mensile (peso 4) completata vale circa la metà di una giornaliera (peso 4)
              completata ogni giorno del mese.
            </p>
          </section>

          {/* Retroattività */}
          <section className="scoring-info-section">
            <h3>Abitudini settimanali e mensili</h3>
            <p>
              Per le abitudini non-quotidiane, quello che conta è <strong>completare l'obiettivo
              nel periodo</strong>, non quando lo fai:
            </p>
            <ul className="scoring-info-list">
              <li>
                <strong>Senza penalizzazione tardiva:</strong> se visiti i nonni il 28 marzo,
                il tuo punteggio di marzo conta quella visita per <em>tutto il mese</em>,
                non solo per gli ultimi 3 giorni.
              </li>
              <li>
                <strong>Punteggio live (OGGI):</strong> fino a quando non hai completato l'abitudine,
                il punteggio giornaliero la conta come 0%. Una volta fatta, conta 100%
                per il resto del periodo.
              </li>
            </ul>
          </section>

          {/* Esempio pratico */}
          <section className="scoring-info-section">
            <h3>Esempio pratico</h3>
            <p>Hai 2 abitudini, entrambe con peso 4:</p>
            <ul className="scoring-info-list">
              <li>🏃 Corsa mattutina — <strong>giornaliera</strong>, peso effettivo 4.0</li>
              <li>👨‍👩‍👧 Visita ai nonni — <strong>mensile</strong>, peso effettivo 2.0</li>
            </ul>
            <p>
              Se fai la corsa e visiti i nonni:{' '}
              <strong>(4.0×100% + 2.0×100%) / (4.0 + 2.0) = 100%</strong>
            </p>
            <p>
              Se fai solo la corsa:{' '}
              <strong>(4.0×100% + 2.0×0%) / 6.0 = 66.7%</strong>
            </p>
            <p>
              Se fai solo i nonni:{' '}
              <strong>(4.0×0% + 2.0×100%) / 6.0 = 33.3%</strong>
            </p>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  )
}
