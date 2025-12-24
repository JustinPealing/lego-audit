import { useState, useRef, useEffect } from 'react'
import './PartItem.css'

export default function PartItem({ part, status, onUpdate }) {
  const [imageError, setImageError] = useState(false)
  const checkboxRef = useRef(null)

  // Checkbox change
  const handleCheckboxChange = (e) => {
    const newQuantity = e.target.checked ? part.quantity : 0
    onUpdate(part.id, { checked: false, quantity: newQuantity })
  }

  // Input change
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0
    const quantity = Math.max(0, Math.min(value, part.quantity))
    onUpdate(part.id, { checked: false, quantity })
  }

  // Sync checkbox indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      const currentQty = status?.quantity || 0
      const required = part.quantity

      if (currentQty === 0) {
        // Unchecked
        checkboxRef.current.checked = false
        checkboxRef.current.indeterminate = false
      } else if (currentQty >= required) {
        // Fully checked
        checkboxRef.current.checked = true
        checkboxRef.current.indeterminate = false
      } else {
        // Partially checked (indeterminate)
        checkboxRef.current.checked = false
        checkboxRef.current.indeterminate = true
      }
    }
  }, [status?.quantity, part.quantity])

  const isComplete = (status?.quantity || 0) >= part.quantity

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
        <div className="part-name">
          {part.part?.name || 'Unknown Part'}
          {part.is_spare && (
            <span className="spare-badge" title="This is a spare part">
              Spare
            </span>
          )}
        </div>
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
        <div className="counter-mode-container">
          <label className="checkbox-container">
            <input
              ref={checkboxRef}
              type="checkbox"
              onChange={handleCheckboxChange}
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
              onChange={handleInputChange}
              className="counter-input"
              aria-label={`Quantity (need ${part.quantity})`}
            />
            <span className="counter-total-label">/ {part.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
