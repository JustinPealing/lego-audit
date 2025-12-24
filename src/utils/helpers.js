/**
 * Normalize LEGO set number to include variant (e.g., "75192" -> "75192-1")
 * @param {string} setNumber - The set number to normalize
 * @returns {string} Normalized set number
 */
export function normalizeSetNumber(setNumber) {
  const trimmed = setNumber.trim()
  // If it doesn't have a variant number, add "-1"
  if (!trimmed.includes('-')) {
    return `${trimmed}-1`
  }
  return trimmed
}

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return d.toLocaleDateString()
}

/**
 * Calculate progress for an audit
 * @param {object} partsStatus - Object mapping part IDs to their status
 * @param {object[]} parts - Array of part objects with quantities
 * @param {string} mode - Tracking mode ('checkbox' or 'counter')
 * @returns {object} Progress object with completed, total, and percentage
 */
export function calculateProgress(partsStatus, parts, mode) {
  if (!parts || parts.length === 0) {
    return { completed: 0, total: 0, percentage: 0 }
  }

  if (mode === 'checkbox') {
    const total = parts.length
    const completed = parts.filter(part => partsStatus[part.id]?.checked).length
    const percentage = Math.round((completed / total) * 100)
    return { completed, total, percentage }
  } else {
    // Counter mode: sum of min(have, need) / sum of need
    let totalNeeded = 0
    let totalHave = 0

    parts.forEach(part => {
      const needed = part.quantity || 0
      const have = partsStatus[part.id]?.quantity || 0
      totalNeeded += needed
      totalHave += Math.min(have, needed)
    })

    const percentage = totalNeeded > 0 ? Math.round((totalHave / totalNeeded) * 100) : 0
    return { completed: totalHave, total: totalNeeded, percentage }
  }
}

/**
 * Debounce function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate a unique ID for an audit
 * @param {string} setNumber - The set number
 * @returns {string} Unique ID
 */
export function generateAuditId(setNumber) {
  return `audit-${setNumber}-${Date.now()}`
}
