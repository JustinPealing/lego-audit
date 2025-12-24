import { TRACKING_MODES } from '../../utils/constants'
import './TrackingModeToggle.css'

export default function TrackingModeToggle({ currentMode, onModeChange }) {
  const handleToggle = () => {
    const newMode = currentMode === TRACKING_MODES.CHECKBOX
      ? TRACKING_MODES.COUNTER
      : TRACKING_MODES.CHECKBOX

    // Ask for confirmation if they have existing progress
    const confirmChange = window.confirm(
      'Switching tracking modes will recalculate your progress. Continue?'
    )

    if (confirmChange) {
      onModeChange(newMode)
    }
  }

  return (
    <div className="tracking-mode-toggle">
      <label className="toggle-label">Tracking Mode:</label>
      <div className="toggle-buttons">
        <button
          type="button"
          className={`toggle-btn ${currentMode === TRACKING_MODES.CHECKBOX ? 'active' : ''}`}
          onClick={() => currentMode !== TRACKING_MODES.CHECKBOX && handleToggle()}
        >
          ✓ Checkbox
        </button>
        <button
          type="button"
          className={`toggle-btn ${currentMode === TRACKING_MODES.COUNTER ? 'active' : ''}`}
          onClick={() => currentMode !== TRACKING_MODES.COUNTER && handleToggle()}
        >
          # Counter
        </button>
      </div>
    </div>
  )
}
