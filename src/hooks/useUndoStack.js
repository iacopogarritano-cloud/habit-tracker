/**
 * useUndoStack - Hook per gestire stack di azioni annullabili
 * US-022: Undo/Annulla Azione
 *
 * Mantiene uno stack di snapshot per permettere di annullare
 * azioni distruttive come eliminazione abitudini, modifica, ecc.
 */

import { useState, useCallback } from 'react'

/**
 * @typedef {Object} UndoEntry
 * @property {Object} snapshot - Stato completo prima dell'azione
 * @property {string} actionType - Tipo azione ('deleteHabit', 'updateHabit', ecc.)
 * @property {string} description - Descrizione leggibile (es. "Eliminata abitudine 'Meditare'")
 * @property {number} timestamp - Timestamp dell'azione
 */

/**
 * Hook per gestire uno stack di azioni annullabili
 * @param {number} maxSize - Numero massimo di azioni nello stack (default: 10)
 * @returns {Object} Stack API
 */
export function useUndoStack(maxSize = 10) {
  const [stack, setStack] = useState([])

  /**
   * Aggiunge un'azione allo stack
   * @param {Object} snapshot - Stato da salvare (sarà clonato)
   * @param {string} actionType - Tipo di azione
   * @param {string} description - Descrizione leggibile
   */
  const push = useCallback(
    (snapshot, actionType, description) => {
      setStack((prev) => {
        const entry = {
          // Deep clone per evitare mutazioni
          snapshot: JSON.parse(JSON.stringify(snapshot)),
          actionType,
          description,
          timestamp: Date.now(),
        }

        const newStack = [...prev, entry]

        // Mantieni solo le ultime N azioni
        if (newStack.length > maxSize) {
          return newStack.slice(-maxSize)
        }

        return newStack
      })
    },
    [maxSize]
  )

  /**
   * Rimuove e restituisce l'ultima azione dallo stack
   * @returns {UndoEntry | null}
   */
  const pop = useCallback(() => {
    let popped = null
    setStack((prev) => {
      if (prev.length === 0) return prev
      popped = prev[prev.length - 1]
      return prev.slice(0, -1)
    })
    return popped
  }, [])

  /**
   * Restituisce l'ultima azione senza rimuoverla
   * @returns {UndoEntry | null}
   */
  const peek = useCallback(() => {
    return stack.length > 0 ? stack[stack.length - 1] : null
  }, [stack])

  /**
   * Verifica se ci sono azioni annullabili
   * @returns {boolean}
   */
  const canUndo = stack.length > 0

  /**
   * Pulisce tutto lo stack
   */
  const clear = useCallback(() => {
    setStack([])
  }, [])

  return {
    push,
    pop,
    peek,
    canUndo,
    clear,
    stackSize: stack.length,
  }
}

export default useUndoStack
