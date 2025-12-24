import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import storage from '../../services/storage'
import AuditCard from './AuditCard'
import './SavedAuditsList.css'

export default function SavedAuditsList() {
  const { startAudit, deleteAudit, navigateToSearch } = useApp()
  const [audits, setAudits] = useState([])

  useEffect(() => {
    // Load audits from storage
    const savedAudits = storage.getAudits()
    setAudits(savedAudits)
  }, [])

  const handleDelete = (auditId) => {
    deleteAudit(auditId)
    setAudits(storage.getAudits()) // Refresh list
  }

  const handleNewAudit = () => {
    navigateToSearch()
  }

  if (audits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h2>No Audits Yet</h2>
          <p>Start auditing your LEGO sets!</p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleNewAudit}
          >
            Start New Audit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="saved-audits-list">
      <div className="audits-header">
        <h2>My Audits</h2>
        <button
          type="button"
          className="btn-primary"
          onClick={handleNewAudit}
        >
          + New Audit
        </button>
      </div>
      <div className="audits-grid">
        {audits.map(audit => (
          <AuditCard
            key={audit.id}
            audit={audit}
            onResume={startAudit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
