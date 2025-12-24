import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuditState } from '../../hooks/useAuditState'
import storage from '../../services/storage'
import SetDetails from '../SetDetails/SetDetails'
import ProgressBar from '../AuditProgress/ProgressBar'
import PartsList from '../PartsList/PartsList'
import './AuditView.css'

export default function AuditView() {
  const { currentAuditId, navigateToHome } = useApp()
  const { audit, updatePartStatus } = useAuditState(currentAuditId)

  // If no audit is loaded and we have an ID, try to load it
  useEffect(() => {
    if (currentAuditId && !audit) {
      const loadedAudit = storage.getAudit(currentAuditId)
      if (!loadedAudit) {
        // Audit not found, go back
        navigateToHome()
      }
    }
  }, [currentAuditId, audit, navigateToHome])

  if (!audit) {
    return (
      <div className="audit-view-loading">
        <div className="spinner"></div>
        <p>Loading audit...</p>
      </div>
    )
  }

  // Calculate published part count (excluding spares) for display
  const publishedPartCount = audit.publishedPartCount ||
    audit.parts?.reduce((sum, part) => sum + (part.is_spare ? 0 : (part.quantity || 0)), 0) ||
    audit.totalParts

  const setData = {
    set_num: audit.setNumber,
    name: audit.setName,
    year: audit.setYear,
    num_parts: publishedPartCount,
    set_img_url: audit.imageUrl
  }

  return (
    <div className="audit-view">
      <div className="audit-view-header">
        <button
          type="button"
          className="back-btn"
          onClick={navigateToHome}
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
