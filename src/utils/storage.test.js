import { describe, it, expect } from 'vitest'
import {
  generateId,
  getTodayDate,
  createHabit,
  getActiveHabits,
  getHabitsForDate,
  getWeightedDailyProgress,
  getCheckIn,
} from './storage'

describe('generateId', () => {
  it('should return a valid UUID v4 format', () => {
    const id = generateId()

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(id).toMatch(uuidRegex)
  })

  it('should generate unique IDs', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })
})

describe('getTodayDate', () => {
  it('should return date in YYYY-MM-DD format', () => {
    const today = getTodayDate()

    // Format check
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    expect(today).toMatch(dateRegex)
  })

  it('should return today date', () => {
    const today = getTodayDate()
    const expected = new Date().toISOString().split('T')[0]

    expect(today).toBe(expected)
  })
})

// ============================================
// createHabit - Factory function per nuove abitudini
// ============================================

describe('createHabit', () => {
  it('should create a habit with required fields', () => {
    // ARRANGE: prepara input minimo
    const input = { name: 'Bere acqua' }

    // ACT: crea abitudine
    const habit = createHabit(input)

    // ASSERT: verifica campi obbligatori
    expect(habit.name).toBe('Bere acqua')
    expect(habit.id).toBeDefined()
    expect(habit.createdAt).toBeDefined()
  })

  it('should apply default values', () => {
    const habit = createHabit({ name: 'Test' })

    // Verifica i default
    expect(habit.type).toBe('boolean') // default type
    expect(habit.target).toBe(1) // default target
    expect(habit.weight).toBe(3) // default peso medio
    expect(habit.timeframe).toBe('daily')
  })

  it('should use provided values over defaults', () => {
    const habit = createHabit({
      name: 'Meditare',
      type: 'count',
      target: 10,
      weight: 5,
      color: '#ff0000',
    })

    expect(habit.type).toBe('count')
    expect(habit.target).toBe(10)
    expect(habit.weight).toBe(5)
    expect(habit.color).toBe('#ff0000')
  })
})

// ============================================
// getActiveHabits - Filtra abitudini non eliminate
// ============================================

describe('getActiveHabits', () => {
  it('should return only habits without deletedAt', () => {
    // ARRANGE: dati con abitudini attive e eliminate
    const data = {
      habits: [
        { id: '1', name: 'Attiva', deletedAt: null },
        { id: '2', name: 'Eliminata', deletedAt: '2026-01-15T10:00:00Z' },
        { id: '3', name: 'Anche attiva' }, // no deletedAt field
      ],
      checkIns: [],
    }

    // ACT
    const active = getActiveHabits(data)

    // ASSERT
    expect(active).toHaveLength(2)
    expect(active.map((h) => h.name)).toContain('Attiva')
    expect(active.map((h) => h.name)).toContain('Anche attiva')
    expect(active.map((h) => h.name)).not.toContain('Eliminata')
  })

  it('should return empty array if all habits deleted', () => {
    const data = {
      habits: [{ id: '1', name: 'Eliminata', deletedAt: '2026-01-01' }],
      checkIns: [],
    }

    expect(getActiveHabits(data)).toHaveLength(0)
  })
})

// ============================================
// getHabitsForDate - Abitudini valide per una data storica
// ============================================

describe('getHabitsForDate', () => {
  it('should include habits created before or on the date', () => {
    const data = {
      habits: [
        { id: '1', name: 'Vecchia', createdAt: '2026-01-01T00:00:00Z' },
        { id: '2', name: 'Nuova', createdAt: '2026-02-01T00:00:00Z' },
      ],
      checkIns: [],
    }

    // Per il 15 Gennaio, solo "Vecchia" esisteva
    const habitsJan15 = getHabitsForDate(data, '2026-01-15')
    expect(habitsJan15).toHaveLength(1)
    expect(habitsJan15[0].name).toBe('Vecchia')

    // Per il 15 Febbraio, entrambe esistono
    const habitsFeb15 = getHabitsForDate(data, '2026-02-15')
    expect(habitsFeb15).toHaveLength(2)
  })

  it('should include soft-deleted habits if deleted AFTER the date', () => {
    const data = {
      habits: [
        {
          id: '1',
          name: 'Eliminata dopo',
          createdAt: '2026-01-01T00:00:00Z',
          deletedAt: '2026-01-20T00:00:00Z', // eliminata il 20
        },
      ],
      checkIns: [],
    }

    // Il 15 Gennaio l'abitudine esisteva ancora
    const habitsJan15 = getHabitsForDate(data, '2026-01-15')
    expect(habitsJan15).toHaveLength(1)

    // Il 25 Gennaio era già eliminata
    const habitsJan25 = getHabitsForDate(data, '2026-01-25')
    expect(habitsJan25).toHaveLength(0)
  })
})

// ============================================
// getWeightedDailyProgress - Formula core del prodotto
// ============================================

describe('getWeightedDailyProgress', () => {
  it('should return 0% for empty habits', () => {
    const data = { habits: [], checkIns: [] }

    const progress = getWeightedDailyProgress(data)

    expect(progress.percent).toBe(0)
    expect(progress.completed).toBe(0)
    expect(progress.total).toBe(0)
  })

  it('should calculate weighted progress correctly', () => {
    const today = getTodayDate()
    const data = {
      habits: [
        { id: 'h1', name: 'Importante', weight: 5, target: 1 }, // peso 5
        { id: 'h2', name: 'Normale', weight: 1, target: 1 }, // peso 1
      ],
      checkIns: [
        { habitId: 'h1', date: today, value: 1, completed: true }, // completata (peso 5)
        { habitId: 'h2', date: today, value: 0, completed: false }, // NON completata (peso 1)
      ],
    }

    const progress = getWeightedDailyProgress(data)

    // Formula: (5*100% + 1*0%) / (5+1) = 500/6 = 83.3%
    expect(progress.percent).toBeCloseTo(83.3, 1)
    expect(progress.completed).toBe(1)
    expect(progress.total).toBe(2)
  })

  it('should return 100% when all habits completed', () => {
    const today = getTodayDate()
    const data = {
      habits: [
        { id: 'h1', weight: 3, target: 1 },
        { id: 'h2', weight: 2, target: 1 },
      ],
      checkIns: [
        { habitId: 'h1', date: today, value: 1, completed: true },
        { habitId: 'h2', date: today, value: 1, completed: true },
      ],
    }

    const progress = getWeightedDailyProgress(data)

    expect(progress.percent).toBe(100)
    expect(progress.completed).toBe(2)
  })
})

// ============================================
// getCheckIn - Lookup check-in per abitudine e data
// ============================================

describe('getCheckIn', () => {
  it('should find check-in for habit and date', () => {
    const data = {
      habits: [],
      checkIns: [
        { habitId: 'h1', date: '2026-01-15', value: 5 },
        { habitId: 'h1', date: '2026-01-16', value: 3 },
        { habitId: 'h2', date: '2026-01-15', value: 1 },
      ],
    }

    const checkIn = getCheckIn(data, 'h1', '2026-01-15')

    expect(checkIn).not.toBeNull()
    expect(checkIn.value).toBe(5)
  })

  it('should return null if no check-in exists', () => {
    const data = { habits: [], checkIns: [] }

    const checkIn = getCheckIn(data, 'h1', '2026-01-15')

    expect(checkIn).toBeNull()
  })
})
