import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReportCards from './ReportCards'

// Helper per creare props standard
function makeProps({ todayPercent = 75, weeklyPercent = 55, monthlyPercent = 30 } = {}) {
  return {
    todayProgress: { percent: todayPercent, completed: 3, total: 4 },
    weeklyProgress: { percent: weeklyPercent, daysWithData: 5, totalDays: 7 },
    monthlyProgress: { percent: monthlyPercent, daysWithData: 15, totalDays: 30 },
  }
}

describe('ReportCards', () => {
  it('should render all three card titles', () => {
    render(<ReportCards {...makeProps()} />)

    expect(screen.getByText('Oggi')).toBeInTheDocument()
    expect(screen.getByText('Ultimi 7 gg')).toBeInTheDocument()
    expect(screen.getByText('Ultimi 30 gg')).toBeInTheDocument()
  })

  it('should display the correct percentages', () => {
    render(<ReportCards {...makeProps()} />)

    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('55%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('should display correct subtitle for today card', () => {
    render(<ReportCards {...makeProps()} />)

    expect(screen.getByText('3/4 abitudini completate')).toBeInTheDocument()
  })

  it('should display correct subtitles for weekly and monthly cards', () => {
    render(<ReportCards {...makeProps()} />)

    expect(screen.getByText('5/7 giorni tracciati')).toBeInTheDocument()
    expect(screen.getByText('15/30 giorni tracciati')).toBeInTheDocument()
  })

  it('should show 0% when all progress is zero', () => {
    const props = {
      todayProgress: { percent: 0, completed: 0, total: 0 },
      weeklyProgress: { percent: 0, daysWithData: 0, totalDays: 7 },
      monthlyProgress: { percent: 0, daysWithData: 0, totalDays: 30 },
    }
    render(<ReportCards {...props} />)

    // Ci aspettiamo tre volte "0%"
    const zeros = screen.getAllByText('0%')
    expect(zeros).toHaveLength(3)
  })
})
