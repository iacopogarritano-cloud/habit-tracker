/**
 * HabitForm - Form per creare/modificare abitudini
 * US-002: Creazione abitudine con campo peso/importanza
 * US-015: Unità di misura personalizzabili
 */

import { useState } from 'react'
import { WeightSelector } from './WeightSelector'

const HABIT_TYPES = [
  { value: 'boolean', label: 'Si/No', description: 'Fatto o non fatto' },
  { value: 'count', label: 'Conteggio', description: 'Quantità (es. 3 bicchieri, 30 min)' },
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

// Opzioni frequenza (US-027)
const TIMEFRAME_OPTIONS = [
  { value: 'daily', label: 'Ogni giorno' },
  { value: 'weekly', label: 'Settimanale' },
  { value: 'monthly', label: 'Mensile' },
]

// Default units per type
const DEFAULT_UNITS = {
  boolean: '',
  count: 'volte',
}

const DEFAULT_FORM = {
  name: '',
  type: 'boolean',
  target: 1,
  weight: 3,
  color: '#4CAF50',
  unit: '',
  categoryId: '', // US-016
  timeframe: 'daily', // US-027
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
    if (type === 'boolean' && form.timeframe === 'daily') {
      handleChange('target', 1)
    } else if (type === 'boolean' && form.timeframe === 'weekly') {
      handleChange('target', 3)
    } else if (type === 'boolean' && form.timeframe === 'monthly') {
      handleChange('target', 10)
    }
  }

  const handleTimeframeChange = (timeframe) => {
    handleChange('timeframe', timeframe)
    if (timeframe === 'daily') {
      if (form.type === 'boolean') handleChange('target', 1)
    } else if (timeframe === 'weekly') {
      if (form.type === 'boolean') handleChange('target', 3)
    } else if (timeframe === 'monthly') {
      if (form.type === 'boolean') handleChange('target', 10)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio'
    } else if (form.name.length > 50) {
      newErrors.name = 'Max 50 caratteri'
    }

    const needsTarget = form.type !== 'boolean' || form.timeframe !== 'daily'
    if (needsTarget && form.target < 1) {
      newErrors.target = 'Il target deve essere almeno 1'
    }
    if (form.timeframe === 'weekly' && form.type === 'boolean' && form.target > 7) {
      newErrors.target = 'Max 7 giorni a settimana'
    }
    if (form.timeframe === 'monthly' && form.type === 'boolean' && form.target > 31) {
      newErrors.target = 'Max 31 giorni al mese'
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

    // Target logic:
    // - boolean daily: sempre 1
    // - boolean weekly/monthly: numero giorni per periodo
    // - count/duration: numero target (giornaliero o di periodo)
    const isDaily = form.timeframe === 'daily'
    const target = form.type === 'boolean' && isDaily ? 1 : Number(form.target)

    const habitData = {
      ...form,
      target,
      weight: Number(form.weight),
      unit: form.type === 'boolean' ? '' : form.unit,
      timeframe: form.timeframe,
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

      {/* Frequenza (US-027) */}
      <div className="form-group">
        <label>Frequenza</label>
        <div className="type-selector">
          {TIMEFRAME_OPTIONS.map((tf) => (
            <button
              key={tf.value}
              type="button"
              className={`type-option ${form.timeframe === tf.value ? 'active' : ''}`}
              onClick={() => handleTimeframeChange(tf.value)}
            >
              <span className="type-label">{tf.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target per boolean settimanale/mensile (US-027) */}
      {form.type === 'boolean' && form.timeframe !== 'daily' && (
        <div className="form-group">
          <label htmlFor="habit-target">
            Quante volte {form.timeframe === 'weekly' ? 'a settimana' : 'al mese'}
          </label>
          <input
            id="habit-target"
            type="number"
            min="1"
            max={form.timeframe === 'weekly' ? 7 : 31}
            value={form.target}
            onChange={(e) => handleChange('target', e.target.value)}
            className="target-input"
          />
          {errors.target && <span className="form-error">{errors.target}</span>}
          <p className="target-preview">
            Obiettivo: {form.target} volte {form.timeframe === 'weekly' ? 'a settimana' : 'al mese'}
          </p>
        </div>
      )}

      {/* Target e Unità per count/duration */}
      {form.type !== 'boolean' && (
        <>
          <div className="form-group">
            <label htmlFor="habit-target">
              Target {form.timeframe === 'daily' ? 'giornaliero' : form.timeframe === 'weekly' ? 'settimanale' : 'mensile'}
            </label>
            <div className="target-with-unit">
              <input
                id="habit-target"
                type="number"
                min="1"
                max="9999"
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
              Obiettivo: {form.target} {getCurrentUnitLabel()}{' '}
              {form.timeframe === 'daily' ? 'al giorno' : form.timeframe === 'weekly' ? 'a settimana' : 'al mese'}
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
