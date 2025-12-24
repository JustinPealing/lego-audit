import { useState } from 'react'
import { useRebrickableApi } from '../../hooks/useRebrickableApi'
import { useAuditState } from '../../hooks/useAuditState'
import { useApp } from '../../context/AppContext'
import './SetLookup.css'

export default function SetLookup() {
  const { startAudit } = useApp()
  const { fetchSet, loading, error, progress } = useRebrickableApi()
  const { createAudit } = useAuditState()
  const [setNumber, setSetNumber] = useState('')
  const [searchError, setSearchError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSearchError(null)

    if (!setNumber.trim()) {
      setSearchError('Please enter a set number')
      return
    }

    try {
      // Fetch the set data
      const setData = await fetchSet(setNumber.trim())

      // Create a new audit
      const newAudit = createAudit(setData)

      // Navigate to the audit
      startAudit(newAudit.id)
    } catch (err) {
      setSearchError(err.message || 'Failed to fetch set data')
    }
  }

  return (
    <div className="set-lookup">
      <div className="set-lookup-container">
        <div className="set-lookup-header">
          <h2>Find Your LEGO Set</h2>
          <p>Enter the set number to begin auditing</p>
        </div>

        <form onSubmit={handleSubmit} className="set-lookup-form">
          <div className="form-group">
            <label htmlFor="set-number">Set Number</label>
            <input
              id="set-number"
              type="text"
              value={setNumber}
              onChange={(e) => setSetNumber(e.target.value)}
              placeholder="e.g., 75192-1 or 75192"
              disabled={loading}
              className={searchError || error ? 'error' : ''}
              autoFocus
            />
            <div className="input-hint">
              Enter the set number with or without variant (e.g., "75192" or "75192-1")
            </div>
            {(searchError || error) && (
              <div className="error-message" role="alert">
                {searchError || error}
              </div>
            )}
          </div>

          {progress && (
            <div className="progress-info">
              <p>Loading parts... {progress.percentage}%</p>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {progress.current} / {progress.total} parts loaded
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !setNumber.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                <span>Searching...</span>
              </>
            ) : (
              'Search Set'
            )}
          </button>
        </form>

        <div className="examples">
          <h3>Popular Sets:</h3>
          <div className="example-buttons">
            <button
              type="button"
              className="btn-secondary example-btn"
              onClick={() => setSetNumber('75192-1')}
              disabled={loading}
            >
              75192-1 (Millennium Falcon)
            </button>
            <button
              type="button"
              className="btn-secondary example-btn"
              onClick={() => setSetNumber('10255-1')}
              disabled={loading}
            >
              10255-1 (Assembly Square)
            </button>
            <button
              type="button"
              className="btn-secondary example-btn"
              onClick={() => setSetNumber('21322-1')}
              disabled={loading}
            >
              21322-1 (Pirates of Barracuda Bay)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
