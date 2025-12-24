import { useState } from 'react'
import PartItem from './PartItem'
import './PartsList.css'

export default function PartsList({ parts, partsStatus, onUpdatePart }) {
  const [filter, setFilter] = useState('all') // all, complete, incomplete

  const filteredParts = parts.filter(part => {
    if (filter === 'all') return true

    const status = partsStatus[part.id]
    const isComplete = (status?.quantity || 0) >= part.quantity
    return filter === 'complete' ? isComplete : !isComplete
  })

  const handleMarkAll = () => {
    parts.forEach(part => {
      onUpdatePart(part.id, { checked: false, quantity: part.quantity })
    })
  }

  const handleClearAll = () => {
    parts.forEach(part => {
      onUpdatePart(part.id, { checked: false, quantity: 0 })
    })
  }

  return (
    <div className="parts-list-container">
      <div className="parts-list-header">
        <div className="parts-list-filters">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({parts.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'incomplete' ? 'active' : ''}`}
            onClick={() => setFilter('incomplete')}
          >
            Incomplete
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'complete' ? 'active' : ''}`}
            onClick={() => setFilter('complete')}
          >
            Complete
          </button>
        </div>

        <div className="parts-list-actions">
          <button
            type="button"
            className="btn-secondary action-btn"
            onClick={handleMarkAll}
          >
            ✓ Mark All
          </button>
          <button
            type="button"
            className="btn-secondary action-btn"
            onClick={handleClearAll}
          >
            ✗ Clear All
          </button>
        </div>
      </div>

      {filteredParts.length === 0 ? (
        <div className="empty-state">
          <p>No parts to display</p>
        </div>
      ) : (
        <div className="parts-list">
          {filteredParts.map(part => (
            <PartItem
              key={part.id}
              part={part}
              status={partsStatus[part.id]}
              onUpdate={onUpdatePart}
            />
          ))}
        </div>
      )}
    </div>
  )
}
