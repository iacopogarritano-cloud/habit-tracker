import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DayView } from './DayView'

// Factory per le props obbligatorie di DayView (tutte via prop, nessun context)
function makeProps(overrides = {}) {
  return {
    date: '2026-01-15',
    habits: [],
    getCheckInForDate: vi.fn(() => null),
    getPeriodCompletion: vi.fn(() => ({ currentValue: 0, percent: 0, target: 1 })),
    getProgressForDate: vi.fn(() => ({ percent: 0, completed: 0, total: 0, hasData: false })),
    getWeeklyProgressForDate: vi.fn(() => ({ percent: 0, daysWithData: 0, totalDays: 7 })),
    getMonthlyProgressForDate: vi.fn(() => ({ percent: 0, daysWithData: 0, totalDays: 30 })),
    onCheckIn: vi.fn(),
    onClose: vi.fn(),
    onSelectDate: vi.fn(),
    ...overrides,
  }
}

describe('DayView - rendering', () => {
  it('should render the current month and year in the calendar header', () => {
    render(<DayView {...makeProps()} />)

    // date='2026-01-15' → viewMonth inizializzato a Gennaio 2026
    expect(screen.getByText('Gennaio 2026')).toBeInTheDocument()
  })

  it('should render the formatted selected date in the progress card', () => {
    render(<DayView {...makeProps()} />)

    // 15 Gennaio 2026 è un Giovedì — getAllByText perché RTL trova il testo
    // sia nello span diretto che nel parent che lo contiene
    const dateTexts = screen.getAllByText('Giovedì 15 Gennaio')
    expect(dateTexts.length).toBeGreaterThan(0)
  })

  it('should render a name for each habit passed', () => {
    const habits = [
      { id: 'h1', name: 'Bere acqua', type: 'boolean', target: 1, weight: 3, timeframe: 'daily' },
      { id: 'h2', name: 'Meditare', type: 'boolean', target: 1, weight: 2, timeframe: 'daily' },
    ]
    render(<DayView {...makeProps({ habits })} />)

    expect(screen.getByText('Bere acqua')).toBeInTheDocument()
    expect(screen.getByText('Meditare')).toBeInTheDocument()
  })

  it('should render the weekday header labels', () => {
    render(<DayView {...makeProps()} />)

    // WEEK_DAYS = ['L', 'Ma', 'Me', 'G', 'V', 'S', 'D']
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })
})

describe('DayView - interazioni', () => {
  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<DayView {...makeProps({ onClose })} />)

    fireEvent.click(screen.getByText('×'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should navigate to previous month when clicking ←', () => {
    render(<DayView {...makeProps()} />)

    fireEvent.click(screen.getByTitle('Mese precedente'))

    // Da Gennaio 2026 → Dicembre 2025
    expect(screen.getByText('Dicembre 2025')).toBeInTheDocument()
  })

  it('should navigate to next month when clicking →', () => {
    render(<DayView {...makeProps()} />)

    fireEvent.click(screen.getByTitle('Mese successivo'))

    // Da Gennaio 2026 → Febbraio 2026
    expect(screen.getByText('Febbraio 2026')).toBeInTheDocument()
  })
})
