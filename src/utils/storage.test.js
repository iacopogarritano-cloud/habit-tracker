import { describe, it, expect } from 'vitest'
import { generateId, getTodayDate } from './storage'

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
