import { useState, useRef, useEffect } from 'react'
import { TRACKING_MODES } from '../../utils/constants'
import './PartItem.css'

export default function PartItem({ part, trackingMode, status, onUpdate }) {
  const [imageError, setImageError] = useState(false)
  const counterCheckboxRef = useRef(null)

  // For checkbox mode
  const handleCheckboxChange = (e) => {
    onUpdate(part.id, { checked: e.target.checked, quantity: 0 })
  }

  // For counter mode - checkbox change
  const handleCounterCheckboxChange = (e) => {
    const newQuantity = e.target.checked ? part.quantity : 0
    onUpdate(part.id, { checked: false, quantity: newQuantity })
  }

  // For counter mode - input change
  const handleCounterInputChange = (e) => {
    const value = parseInt(e.target.value) || 0
    const quantity = Math.max(0, Math.min(value, part.quantity))
    onUpdate(part.id, { checked: false, quantity })
  }

  // Sync checkbox indeterminate state in counter mode
  useEffect(() => {
    if (trackingMode === TRACKING_MODES.COUNTER && counterCheckboxRef.current) {
      const currentQty = status?.quantity || 0
      const required = part.quantity

      if (currentQty === 0) {
        // Unchecked
        counterCheckboxRef.current.checked = false
        counterCheckboxRef.current.indeterminate = false
      } else if (currentQty >= required) {
        // Fully checked
        counterCheckboxRef.current.checked = true
        counterCheckboxRef.current.indeterminate = false
      } else {
        // Partially checked (indeterminate)
        counterCheckboxRef.current.checked = false
        counterCheckboxRef.current.indeterminate = true
      }
    }
  }, [trackingMode, status?.quantity, part.quantity])

  const isComplete = trackingMode === TRACKING_MODES.CHECKBOX
    ? status?.checked
    : (status?.quantity || 0) >= part.quantity

  return (
    <div className={`part-item ${isComplete ? 'complete' : ''}`}>
      <div className="part-image-container">
        {!imageError && part.part?.part_img_url ? (
          <img
            src={part.part.part_img_url}
            alt={part.part.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="part-image"
          />
        ) : (
          <div className="part-image-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>

      <div className="part-info">
        <div className="part-name">{part.part?.name || 'Unknown Part'}</div>
        <div className="part-details">
          <span className="part-number">#{part.part?.part_num}</span>
          {part.color && (
            <span className="part-color">
              <span
                className="color-dot"
                style={{ backgroundColor: `#${part.color.rgb}` }}
              ></span>
              {part.color.name}
            </span>
          )}
        </div>
        <div className="part-quantity-needed">
          Need: {part.quantity}
        </div>
      </div>

      <div className="part-tracking">
        {trackingMode === TRACKING_MODES.CHECKBOX ? (
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={status?.checked || false}
              onChange={handleCheckboxChange}
              className="part-checkbox"
            />
            <span className="checkbox-custom"></span>
          </label>
        ) : (
          <div className="counter-mode-container">
            <label className="checkbox-container">
              <input
                ref={counterCheckboxRef}
                type="checkbox"
                onChange={handleCounterCheckboxChange}
                className="part-checkbox"
                aria-label="Toggle complete"
              />
              <span className="checkbox-custom"></span>
            </label>
            <div className="counter-input-wrapper">
              <input
                type="number"
                min="0"
                max={part.quantity}
                value={status?.quantity || 0}
                onChange={handleCounterInputChange}
                className="counter-input"
                aria-label={`Quantity (need ${part.quantity})`}
              />
              <span className="counter-total-label">/ {part.quantity}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
