/**
 * Seed Data - Weighbit
 * US-029: Abitudini demo per nuovi utenti
 *
 * Mostrate al primo login per comunicare subito il valore dell'app.
 * Tipi e pesi volutamente diversi per mostrare le feature principali.
 */

import { generateId } from './storage'

/**
 * Crea le abitudini demo per un nuovo utente.
 * Chiamare questa funzione ogni volta (gli ID vengono generati freschi).
 * @returns {Habit[]}
 */
export function createDemoHabits() {
  const now = new Date().toISOString()

  return [
    {
      id: generateId(),
      name: 'Esercizio fisico',
      type: 'boolean',
      target: 1,
      weight: 5, // Massima importanza — mostra il concetto di peso
      timeframe: 'daily',
      createdAt: now,
      color: '#22c55e',
      unit: '',
      categoryId: 'cat-health',
    },
    {
      id: generateId(),
      name: 'Lettura',
      type: 'count', // Tipo diverso — mostra che non è solo sì/no
      target: 30,
      weight: 4,
      timeframe: 'daily',
      createdAt: now,
      color: '#3b82f6',
      unit: 'min',
      categoryId: 'cat-learning',
    },
    {
      id: generateId(),
      name: 'Meditazione',
      type: 'boolean',
      target: 1,
      weight: 3,
      timeframe: 'daily',
      createdAt: now,
      color: '#8b5cf6',
      unit: '',
      categoryId: 'cat-wellness',
    },
  ]
}
