/**
 * LoginPage - Pagina di Login
 *
 * COSA FA:
 * Mostra una pagina di benvenuto quando l'utente non è autenticato.
 * L'utente DEVE fare login per accedere all'app.
 *
 * PERCHÉ:
 * - Protegge l'app: niente abitudini visibili senza login
 * - UX chiara: l'utente capisce subito cosa deve fare
 * - Evita conflitti: no modifiche locali che poi si "mischiano"
 */

import { useAuth } from '../contexts/AuthContext'
import LoginButton from './LoginButton'

export default function LoginPage() {
  const { isLoading } = useAuth()

  // Se sta ancora verificando la sessione, mostra loading
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-loading">Caricamento...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo/Titolo */}
        <div className="login-header">
          <h1 className="login-title">Weighbit</h1>
          <p className="login-tagline">Weighted Habit Tracker</p>
        </div>

        {/* Descrizione */}
        <div className="login-description">
          <p>Non tutte le abitudini hanno lo stesso peso.</p>
          <p>Traccia ciò che conta davvero.</p>
        </div>

        {/* Bottone Login */}
        <div className="login-actions">
          <LoginButton />
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>I tuoi dati sono sincronizzati nel cloud</p>
        </div>
      </div>
    </div>
  )
}
