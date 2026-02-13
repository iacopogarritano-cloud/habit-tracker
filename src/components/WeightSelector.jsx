/**
 * WeightSelector - Selettore peso/importanza 1-5 con stelle
 * US-002: Componente riutilizzabile per assegnare importanza alle abitudini
 */

import { useState } from 'react'

export function WeightSelector({ value = 3, onChange, disabled = false }) {
  const [hoverValue, setHoverValue] = useState(null)

  const displayValue = hoverValue !== null ? hoverValue : value

  const handleClick = (weight) => {
    if (!disabled && onChange) {
      onChange(weight)
    }
  }

  const getWeightLabel = (weight) => {
    const labels = {
      1: 'Bassa',
      2: 'Sotto la media',
      3: 'Media',
      4: 'Alta',
      5: 'Massima',
    }
    return labels[weight] || ''
  }

  return (
    <div className="weight-selector">
      <div className="weight-stars">
        {[1, 2, 3, 4, 5].map((weight) => (
          <button
            key={weight}
            type="button"
            className={`weight-star ${displayValue >= weight ? 'active' : ''}`}
            onClick={() => handleClick(weight)}
            onMouseEnter={() => !disabled && setHoverValue(weight)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={disabled}
            aria-label={`Importanza ${weight}`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="weight-label">
        {getWeightLabel(displayValue)} ({displayValue}/5)
      </span>
    </div>
  )
}

export default WeightSelector
