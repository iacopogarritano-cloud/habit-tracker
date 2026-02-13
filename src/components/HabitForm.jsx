/**
 * HabitForm - Form per creare/modificare abitudini
 * US-002: Creazione abitudine con campo peso/importanza
 * US-015: Unità di misura personalizzabili
 */

import { useState } from 'react'
import { WeightSelector } from './WeightSelector'

const HABIT_TYPES = [
  { value: 'boolean', label: 'Si/No', description: 'Fatto o non fatto' },
  { value: 'count', label: 'Conteggio', description: 'Quante volte (es. 3 bicchieri)' },
  { value: 'duration', label: 'Durata', description: 'Quanti minuti (es. 30 min)' },
]

// Unità di misura organizzate per categoria (US-015)
const UNIT_CATEGORIES = [
  {
    category: 'Tempo',
    units: [
      { value: 'min', label: 'minuti', short: 'min' },
      { value: 'ore', label: 'ore', short: 'h' },
      { value: 'sec', label: 'secondi', short: 's' },
    ],
  },
  {
    category: 'Conteggio',
    units: [
      { value: 'volte', label: 'volte', short: 'x' },
      { value: 'ripetizioni', label: 'ripetizioni', short: 'rep' },
      { value: 'serie', label: 'serie', short: 'set' },
      { value: 'sessioni', label: 'sessioni', short: 'sess' },
    ],
  },
  {
    category: 'Volume',
    units: [
      { value: 'ml', label: 'millilitri', short: 'ml' },
      { value: 'litri', label: 'litri', short: 'L' },
      { value: 'bicchieri', label: 'bicchieri', short: 'bicc' },
      { value: 'tazze', label: 'tazze', short: 'taz' },
    ],
  },
  {
    category: 'Distanza',
    units: [
      { value: 'km', label: 'chilometri', short: 'km' },
      { value: 'm', label: 'metri', short: 'm' },
      { value: 'passi', label: 'passi', short: 'passi' },
    ],
  },
  {
    category: 'Lettura/Studio',
    units: [
      { value: 'pagine', label: 'pagine', short: 'pag' },
      { value: 'capitoli', label: 'capitoli', short: 'cap' },
      { value: 'lezioni', label: 'lezioni', short: 'lez' },
    ],
  },
  {
    category: 'Alimentazione',
    units: [
      { value: 'porzioni', label: 'porzioni', short: 'porz' },
      { value: 'grammi', label: 'grammi', short: 'g' },
      { value: 'calorie', label: 'calorie', short: 'kcal' },
    ],
  },
  {
    category: 'Produttività',
    units: [
      { value: 'pomodori', label: 'pomodori', short: 'pom' },
      { value: 'task', label: 'task', short: 'task' },
    ],
  },
]

// Default units per type
const DEFAULT_UNITS = {
  boolean: '',
  count: 'volte',
  duration: 'min',
}

const DEFAULT_FORM = {
  name: '',
  type: 'boolean',
  target: 1,
  weight: 3,
  color: '#4CAF50',
  unit: '',
  categoryId: '', // US-016
}

export function HabitForm({ onSubmit, onCancel, initialData = null, categories = [] }) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...DEFAULT_FORM,
        ...initialData,
        unit: initialData.unit || DEFAULT_UNITS[initialData.type] || '',
        categoryId: initialData.categoryId || '', // US-016
      }
    }
    return DEFAULT_FORM
  })
  const [errors, setErrors] = useState({})

  const isEdit = initialData !== null

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleTypeChange = (type) => {
    handleChange('type', type)
    // Set default unit for the type
    handleChange('unit', DEFAULT_UNITS[type])
    if (type === 'boolean') {
      handleChange('target', 1)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio'
    } else if (form.name.length > 50) {
      newErrors.name = 'Max 50 caratteri'
    }

    if (form.type !== 'boolean' && form.target < 1) {
      newErrors.target = 'Il target deve essere almeno 1'
    }

    if (form.weight < 1 || form.weight > 5) {
      newErrors.weight = 'Il peso deve essere tra 1 e 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    // For boolean type, target is always 1 and no unit
    const habitData = {
      ...form,
      target: form.type === 'boolean' ? 1 : Number(form.target),
      weight: Number(form.weight),
      unit: form.type === 'boolean' ? '' : form.unit,
      categoryId: form.categoryId || null, // US-016
    }

    onSubmit(habitData)
  }

  // Calculate impact preview
  const impactPercent = form.weight > 0 ? Math.round((form.weight / 15) * 100) : 0

  // Get current unit label for display
  const getCurrentUnitLabel = () => {
    for (const cat of UNIT_CATEGORIES) {
      const found = cat.units.find((u) => u.value === form.unit)
      if (found) return found.label
    }
    return form.unit || 'volte'
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{isEdit ? 'Modifica Abitudine' : 'Nuova Abitudine'}</h3>

      {/* Nome */}
      <div className="form-group">
        <label htmlFor="habit-name">Nome *</label>
        <input
          id="habit-name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Es. Mangiare verdura"
          maxLength={50}
          autoFocus
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      {/* Categoria (US-016) */}
      {categories.length > 0 && (
        <div className="form-group">
          <label htmlFor="habit-category">Categoria</label>
          <select
            id="habit-category"
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="category-select"
          >
            <option value="">Senza categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tipo */}
      <div className="form-group">
        <label>Tipo di tracking</label>
        <div className="type-selector">
          {HABIT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`type-option ${form.type === type.value ? 'active' : ''}`}
              onClick={() => handleTypeChange(type.value)}
            >
              <span className="type-label">{type.label}</span>
              <span className="type-desc">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target e Unità (solo per count/duration) */}
      {form.type !== 'boolean' && (
        <>
          <div className="form-group">
            <label htmlFor="habit-target">Target giornaliero</label>
            <div className="target-with-unit">
              <input
                id="habit-target"
                type="number"
                min="1"
                max="999"
                value={form.target}
                onChange={(e) => handleChange('target', e.target.value)}
                className="target-input"
              />
              <select
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="unit-select"
              >
                {UNIT_CATEGORIES.map((cat) => (
                  <optgroup key={cat.category} label={cat.category}>
                    {cat.units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            {errors.target && <span className="form-error">{errors.target}</span>}
            <p className="target-preview">
              Obiettivo: {form.target} {getCurrentUnitLabel()} al giorno
            </p>
          </div>
        </>
      )}

      {/* Peso/Importanza */}
      <div className="form-group">
        <label>
          Importanza
          <span className="label-hint">Quanto conta per te questa abitudine?</span>
        </label>
        <WeightSelector value={form.weight} onChange={(weight) => handleChange('weight', weight)} />
        {errors.weight && <span className="form-error">{errors.weight}</span>}
        <p className="impact-preview">
          Impatto sul progresso: ~{impactPercent}% (se hai 3 abitudini di peso medio)
        </p>
      </div>

      {/* Colore (opzionale) */}
      <div className="form-group">
        <label htmlFor="habit-color">Colore (opzionale)</label>
        <div className="color-picker">
          {['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'].map((color) => (
            <button
              key={color}
              type="button"
              className={`color-option ${form.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleChange('color', color)}
              aria-label={`Colore ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Annulla
        </button>
        <button type="submit" className="btn-submit">
          {isEdit ? 'Salva modifiche' : 'Crea abitudine'}
        </button>
      </div>
    </form>
  )
}

export default HabitForm
