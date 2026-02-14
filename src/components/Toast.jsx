/**
 * Toast - Componente per notifiche temporanee con azione
 * US-022: Undo/Annulla Azione
 *
 * Mostra un messaggio con opzionale pulsante "Annulla"
 * Auto-dismiss dopo un timeout configurabile
 */

import { useEffect, useState, useRef } from 'react'
import './Toast.css'

/**
 * @param {Object} props
 * @param {string} props.message - Messaggio da mostrare
 * @param {string} [props.type='info'] - Tipo: 'info', 'success', 'warning', 'error'
 * @param {number} [props.duration=5000] - Durata in ms prima di auto-dismiss
 * @param {Function} [props.onUndo] - Callback per azione "Annulla" (se presente, mostra pulsante)
 * @param {Function} props.onClose - Callback quando il toast si chiude
 */
export function Toast({ message, type = 'info', duration = 5000, onUndo, onClose }) {
  const [isExiting, setIsExiting] = useState(false)
  const exitTimerRef = useRef(null)

  // Auto-dismiss dopo duration
  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setIsExiting(true)
      // Aspetta animazione di uscita
      exitTimerRef.current = setTimeout(onClose, 300)
    }, duration)

    return () => {
      clearTimeout(dismissTimer)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [duration, onClose])

  const handleUndo = () => {
    if (onUndo) {
      onUndo()
    }
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
      <span className="toast-message">{message}</span>
      <div className="toast-actions">
        {onUndo && (
          <button className="toast-btn-undo" onClick={handleUndo}>
            Annulla
          </button>
        )}
        <button className="toast-btn-close" onClick={handleClose} title="Chiudi">
          ×
        </button>
      </div>
    </div>
  )
}

/**
 * ToastContainer - Container per gestire multipli toast
 * Posiziona i toast in basso a destra
 */
export function ToastContainer({ toasts, onRemoveToast, onUndo }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onUndo={toast.canUndo ? () => onUndo(toast.id) : null}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default Toast
