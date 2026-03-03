import { describe, it, expect } from 'vitest'
import {
  generateId,
  getTodayDate,
  createHabit,
  updateHabit,
  getActiveHabits,
  getHabitsForDate,
  getWeightedDailyProgress,
  getCheckIn,
  getWeightedProgressForDate,
  getWeeklyProgressForDate,
  getMonthlyProgressForDate,
  getMonthDates,
  getWeekDates,
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
    expect(habit.updatedAt).toBeDefined()
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
// updateHabit - Aggiorna e imposta updatedAt
// ============================================

describe('updateHabit', () => {
  it('should update updatedAt on every update', async () => {
    // ARRANGE
    const habit = createHabit({ name: 'Test' })
    const data = { habits: [habit], checkIns: [], categories: [] }
    const originalUpdatedAt = habit.updatedAt

    // Aspetta 1ms per garantire timestamp diverso
    await new Promise((r) => setTimeout(r, 1))

    // ACT
    const { data: newData } = updateHabit(data, habit.id, { name: 'Test aggiornato' })
    const updated = newData.habits.find((h) => h.id === habit.id)

    // ASSERT
    expect(updated.name).toBe('Test aggiornato')
    expect(updated.updatedAt).toBeDefined()
    expect(updated.updatedAt).not.toBe(originalUpdatedAt)
  })

  it('should not overwrite updatedAt with a value from updates', () => {
    // updatedAt deve essere sempre generato da updateHabit, non passato dall'esterno
    const habit = createHabit({ name: 'Test' })
    const data = { habits: [habit], checkIns: [], categories: [] }

    const { data: newData } = updateHabit(data, habit.id, {
      name: 'Nuovo nome',
      updatedAt: '1970-01-01T00:00:00.000Z', // tentativo di sovrascrivere
    })
    const updated = newData.habits.find((h) => h.id === habit.id)

    // updatedAt deve essere il timestamp corrente, non quello passato
    expect(updated.updatedAt).not.toBe('1970-01-01T00:00:00.000Z')
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

// ============================================
// getWeightedProgressForDate - Progresso pesato per data storica
// ============================================

describe('getWeightedProgressForDate', () => {
  it('should return all zeros when no habits exist for that date', () => {
    const data = { habits: [], checkIns: [] }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result).toEqual({ percent: 0, completed: 0, total: 0, hasData: false })
  })

  it('should return hasData:false when habits exist but no check-ins', () => {
    const data = {
      habits: [{ id: 'h1', name: 'Test', weight: 3, target: 1, createdAt: '2026-01-01T00:00:00Z' }],
      checkIns: [],
    }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result.hasData).toBe(false)
    expect(result.percent).toBe(0)
    expect(result.total).toBe(1)
  })

  it('should return hasData:true when at least one check-in exists', () => {
    const data = {
      habits: [{ id: 'h1', weight: 3, target: 1, createdAt: '2026-01-01T00:00:00Z' }],
      checkIns: [{ habitId: 'h1', date: '2026-01-15', value: 1 }],
    }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result.hasData).toBe(true)
  })

  it('should calculate weighted progress correctly', () => {
    // Habit 1: peso 5, completata → 100%
    // Habit 2: peso 1, nessun check-in → 0%
    // Formula: (5×100 + 1×0) / (5+1) = 83.3%
    const data = {
      habits: [
        { id: 'h1', weight: 5, target: 1, createdAt: '2026-01-01T00:00:00Z' },
        { id: 'h2', weight: 1, target: 1, createdAt: '2026-01-01T00:00:00Z' },
      ],
      checkIns: [{ habitId: 'h1', date: '2026-01-15', value: 1 }],
    }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result.percent).toBeCloseTo(83.3, 1)
    expect(result.completed).toBe(1)
    expect(result.total).toBe(2)
    expect(result.hasData).toBe(true)
  })

  it('should return 100% when all habits are completed', () => {
    const data = {
      habits: [
        { id: 'h1', weight: 3, target: 1, createdAt: '2026-01-01T00:00:00Z' },
        { id: 'h2', weight: 2, target: 1, createdAt: '2026-01-01T00:00:00Z' },
      ],
      checkIns: [
        { habitId: 'h1', date: '2026-01-15', value: 1 },
        { habitId: 'h2', date: '2026-01-15', value: 1 },
      ],
    }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result.percent).toBe(100)
    expect(result.completed).toBe(2)
    expect(result.hasData).toBe(true)
  })

  it('should handle partial completion of a count habit', () => {
    // Count habit: target 4, fatto solo 2 → 50%
    const data = {
      habits: [{ id: 'h1', weight: 2, target: 4, createdAt: '2026-01-01T00:00:00Z' }],
      checkIns: [{ habitId: 'h1', date: '2026-01-15', value: 2 }],
    }

    const result = getWeightedProgressForDate(data, '2026-01-15')

    expect(result.percent).toBe(50)
    expect(result.completed).toBe(0) // non completata al 100%
    expect(result.hasData).toBe(true)
  })
})

// ============================================
// getWeeklyProgressForDate / getMonthlyProgressForDate
// (testano indirettamente getPeriodProgressForDate, che è privata)
// ============================================

describe('getWeeklyProgressForDate', () => {
  it('should return totalDays:7 and 0 daysWithData when no habits exist', () => {
    const data = { habits: [], checkIns: [] }

    const result = getWeeklyProgressForDate(data, '2026-01-15')

    expect(result.totalDays).toBe(7)
    expect(result.percent).toBe(0)
    expect(result.daysWithData).toBe(0)
    expect(result.dailyBreakdown).toHaveLength(7)
  })

  it('should have correct shape in each dailyBreakdown entry', () => {
    const data = { habits: [], checkIns: [] }

    const result = getWeeklyProgressForDate(data, '2026-01-15')

    for (const entry of result.dailyBreakdown) {
      expect(entry).toHaveProperty('date')
      expect(entry).toHaveProperty('percent')
      expect(entry).toHaveProperty('hasData')
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('should average across all days where a habit exists', () => {
    // 1 habit attiva per tutta la settimana, solo 1 giorno ha check-in al 100%
    // Tutti e 7 i giorni contano (habit.total > 0 per ognuno)
    // Media: 100 / 7 ≈ 14.3%
    const data = {
      habits: [{ id: 'h1', weight: 1, target: 1, createdAt: '2026-01-01T00:00:00Z' }],
      checkIns: [{ habitId: 'h1', date: '2026-01-15', value: 1 }],
    }

    const result = getWeeklyProgressForDate(data, '2026-01-15')

    expect(result.daysWithData).toBe(7)
    expect(result.percent).toBeCloseTo(100 / 7, 1)
  })
})

describe('getMonthlyProgressForDate', () => {
  it('should return totalDays:30 and 30 entries in dailyBreakdown', () => {
    const data = { habits: [], checkIns: [] }

    const result = getMonthlyProgressForDate(data, '2026-01-15')

    expect(result.totalDays).toBe(30)
    expect(result.dailyBreakdown).toHaveLength(30)
  })
})

// ============================================
// getMonthDates / getWeekDates - Funzioni calendario
// (corrispondono a "getCalendarDays" nel backlog — funzione non presente,
//  queste sono le reali funzioni calendario esportate da storage.js)
// ============================================

describe('getMonthDates', () => {
  it('should return 31 dates for January', () => {
    const dates = getMonthDates(2026, 1)

    expect(dates).toHaveLength(31)
  })

  it('should return 28 dates for February in a non-leap year', () => {
    const dates = getMonthDates(2026, 2)

    expect(dates).toHaveLength(28)
  })

  it('should return 29 dates for February in a leap year', () => {
    const dates = getMonthDates(2024, 2)

    expect(dates).toHaveLength(29)
  })

  it('should return dates in YYYY-MM-DD format matching the correct month', () => {
    const dates = getMonthDates(2026, 3) // Marzo 2026

    for (const date of dates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(date.startsWith('2026-03')).toBe(true)
    }
  })
})

describe('getWeekDates', () => {
  it('should return exactly 7 dates', () => {
    const dates = getWeekDates('2026-02-16') // Lunedì

    expect(dates).toHaveLength(7)
  })

  it('should start from the provided date and span 7 consecutive days', () => {
    const dates = getWeekDates('2026-02-16') // Lunedì 16 febbraio

    expect(dates[0]).toBe('2026-02-16')
    expect(dates[6]).toBe('2026-02-22') // Domenica 22 febbraio
  })

  it('should return all dates in YYYY-MM-DD format', () => {
    const dates = getWeekDates('2026-02-16')

    for (const date of dates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
