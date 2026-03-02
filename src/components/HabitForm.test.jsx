import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HabitForm } from './HabitForm'

describe('HabitForm - modalità creazione', () => {
  it('should render "Nuova Abitudine" title in create mode', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText('Nuova Abitudine')).toBeInTheDocument()
  })

  it('should show "Crea abitudine" as submit button text', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText('Crea abitudine')).toBeInTheDocument()
  })

  it('should show error when submitted with empty name', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByText('Crea abitudine'))

    expect(screen.getByText('Il nome è obbligatorio')).toBeInTheDocument()
  })

  it('should not call onSubmit when name is empty', () => {
    const onSubmit = vi.fn()
    render(<HabitForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByText('Crea abitudine'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with correct data when form is valid', () => {
    const onSubmit = vi.fn()
    render(<HabitForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByPlaceholderText('Es. Mangiare verdura'), {
      target: { value: 'Bere acqua' },
    })
    fireEvent.click(screen.getByText('Crea abitudine'))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Bere acqua' }))
  })

  it('should call onCancel when Annulla is clicked', () => {
    const onCancel = vi.fn()
    render(<HabitForm onSubmit={vi.fn()} onCancel={onCancel} />)

    fireEvent.click(screen.getByText('Annulla'))

    expect(onCancel).toHaveBeenCalledOnce()
  })
})

describe('HabitForm - modalità modifica', () => {
  const initialData = {
    name: 'Bere acqua',
    type: 'boolean',
    target: 1,
    weight: 3,
    timeframe: 'daily',
    color: '#4CAF50',
    unit: '',
  }

  it('should render "Modifica Abitudine" title in edit mode', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} initialData={initialData} />)

    expect(screen.getByText('Modifica Abitudine')).toBeInTheDocument()
  })

  it('should show "Salva modifiche" as submit button text', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} initialData={initialData} />)

    expect(screen.getByText('Salva modifiche')).toBeInTheDocument()
  })

  it('should prefill name input with initialData', () => {
    render(<HabitForm onSubmit={vi.fn()} onCancel={vi.fn()} initialData={initialData} />)

    expect(screen.getByDisplayValue('Bere acqua')).toBeInTheDocument()
  })

  it('should call onSubmit with updated name when modified and saved', () => {
    const onSubmit = vi.fn()
    render(<HabitForm onSubmit={onSubmit} onCancel={vi.fn()} initialData={initialData} />)

    const nameInput = screen.getByDisplayValue('Bere acqua')
    fireEvent.change(nameInput, { target: { value: 'Bere molta acqua' } })
    fireEvent.click(screen.getByText('Salva modifiche'))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Bere molta acqua' }))
  })
})
