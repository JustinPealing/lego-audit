import { STORAGE_KEYS } from '../utils/constants'

/**
 * Storage service for managing localStorage operations
 */
class StorageService {
  /**
   * Get item from localStorage
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} The stored value or default value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error)
      return defaultValue
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - The storage key
   * @param {*} value - The value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded!')
        this.handleQuotaExceeded()
      } else {
        console.error(`Error writing to localStorage (key: ${key}):`, error)
      }
      return false
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - The storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error)
      return false
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Handle quota exceeded error by removing old data
   */
  handleQuotaExceeded() {
    console.warn('Attempting to free up localStorage space...')

    // Try to clear old cache data first
    const cache = this.get(STORAGE_KEYS.SET_CACHE, {})
    const now = Date.now()
    const updatedCache = {}

    Object.keys(cache).forEach(key => {
      // Keep only recent cache entries (last 3 days)
      if (cache[key].cachedAt && (now - cache[key].cachedAt < 3 * 24 * 60 * 60 * 1000)) {
        updatedCache[key] = cache[key]
      }
    })

    this.set(STORAGE_KEYS.SET_CACHE, updatedCache)
  }

  /**
   * Get API key
   * @returns {string|null} API key or null
   */
  getApiKey() {
    return this.get(STORAGE_KEYS.API_KEY)
  }

  /**
   * Set API key
   * @param {string} apiKey - The API key to store
   * @returns {boolean} Success status
   */
  setApiKey(apiKey) {
    return this.set(STORAGE_KEYS.API_KEY, apiKey)
  }

  /**
   * Remove API key
   * @returns {boolean} Success status
   */
  removeApiKey() {
    return this.remove(STORAGE_KEYS.API_KEY)
  }

  /**
   * Get all audits
   * @returns {Array} Array of audit objects
   */
  getAudits() {
    return this.get(STORAGE_KEYS.AUDITS, [])
  }

  /**
   * Save audit
   * @param {object} audit - The audit object to save
   * @returns {boolean} Success status
   */
  saveAudit(audit) {
    const audits = this.getAudits()
    const existingIndex = audits.findIndex(a => a.id === audit.id)

    if (existingIndex >= 0) {
      // Update existing audit
      audits[existingIndex] = { ...audit, lastModified: new Date().toISOString() }
    } else {
      // Add new audit
      audits.push({ ...audit, lastModified: new Date().toISOString() })
    }

    // Sort by last modified (most recent first)
    audits.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))

    return this.set(STORAGE_KEYS.AUDITS, audits)
  }

  /**
   * Delete audit by ID
   * @param {string} auditId - The audit ID to delete
   * @returns {boolean} Success status
   */
  deleteAudit(auditId) {
    const audits = this.getAudits()
    const filtered = audits.filter(a => a.id !== auditId)
    return this.set(STORAGE_KEYS.AUDITS, filtered)
  }

  /**
   * Get audit by ID
   * @param {string} auditId - The audit ID
   * @returns {object|null} Audit object or null
   */
  getAudit(auditId) {
    const audits = this.getAudits()
    return audits.find(a => a.id === auditId) || null
  }

  /**
   * Get preferences
   * @returns {object} Preferences object
   */
  getPreferences() {
    return this.get(STORAGE_KEYS.PREFERENCES, {
      theme: 'light'
    })
  }

  /**
   * Save preferences
   * @param {object} preferences - Preferences to save
   * @returns {boolean} Success status
   */
  savePreferences(preferences) {
    const current = this.getPreferences()
    return this.set(STORAGE_KEYS.PREFERENCES, { ...current, ...preferences })
  }
}

// Export singleton instance
export default new StorageService()
