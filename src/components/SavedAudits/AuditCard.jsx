import { formatDate } from '../../utils/helpers'
import './AuditCard.css'

export default function AuditCard({ audit, onResume, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${audit.setName}"? This cannot be undone.`)) {
      onDelete(audit.id)
    }
  }

  return (
    <div className="audit-card">
      <div className="audit-card-image">
        {audit.imageUrl && (
          <img src={audit.imageUrl} alt={audit.setName} />
        )}
      </div>

      <div className="audit-card-info">
        <h3>{audit.setName}</h3>
        <p className="set-number">#{audit.setNumber}</p>

        <div className="progress-info">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${audit.progress.percentage}%` }}
            />
          </div>
          <p className="progress-text">
            {audit.progress.percentage}% - {audit.progress.completed}/{audit.progress.total} parts
          </p>
        </div>

        <p className="last-modified">
          Last updated {formatDate(audit.lastModified)}
        </p>
      </div>

      <div className="audit-card-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onResume(audit.id)}
        >
          Resume
        </button>
        <button
          type="button"
          className="btn-delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
