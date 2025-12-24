import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuditState } from '../../hooks/useAuditState'
import storage from '../../services/storage'
import SetDetails from '../SetDetails/SetDetails'
import ProgressBar from '../AuditProgress/ProgressBar'
import PartsList from '../PartsList/PartsList'
import './AuditView.css'

export default function AuditView() {
  const { currentAuditId, exitAudit } = useApp()
  const { audit, updatePartStatus } = useAuditState(currentAuditId)

  // If no audit is loaded and we have an ID, try to load it
  useEffect(() => {
    if (currentAuditId && !audit) {
      const loadedAudit = storage.getAudit(currentAuditId)
      if (!loadedAudit) {
        // Audit not found, go back
        exitAudit()
      }
    }
  }, [currentAuditId, audit, exitAudit])

  if (!audit) {
    return (
      <div className="audit-view-loading">
        <div className="spinner"></div>
        <p>Loading audit...</p>
      </div>
    )
  }

  const setData = {
    set_num: audit.setNumber,
    name: audit.setName,
    year: audit.setYear,
    num_parts: audit.totalParts,
    set_img_url: audit.imageUrl
  }

  return (
    <div className="audit-view">
      <div className="audit-view-header">
        <button
          type="button"
          className="back-btn"
          onClick={exitAudit}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <h1 className="audit-view-title">Audit</h1>
      </div>

      <div className="audit-view-content">
        <SetDetails setData={setData} />

        <ProgressBar progress={audit.progress} />

        <PartsList
          parts={audit.parts}
          partsStatus={audit.partsStatus}
          onUpdatePart={updatePartStatus}
        />
      </div>
    </div>
  )
}
