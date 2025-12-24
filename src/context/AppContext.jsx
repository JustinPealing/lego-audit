import { createContext, useContext, useState, useEffect } from 'react'
import storage from '../services/storage'
import rebrickableApi from '../services/rebrickable'

// Create context
const AppContext = createContext(null)

/**
 * App Context Provider
 */
export function AppProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(null)
  const [currentView, setCurrentView] = useState('loading') // loading, api-setup, main
  const [currentAuditId, setCurrentAuditId] = useState(null)

  // Initialize app on mount
  useEffect(() => {
    const storedApiKey = storage.getApiKey()
    if (storedApiKey) {
      setApiKeyState(storedApiKey)
      rebrickableApi.setApiKey(storedApiKey)
      setCurrentView('main')
    } else {
      setCurrentView('api-setup')
    }
  }, [])

  /**
   * Set API key
   * @param {string} key - The API key
   */
  const setApiKey = (key) => {
    storage.setApiKey(key)
    setApiKeyState(key)
    rebrickableApi.setApiKey(key)
    setCurrentView('main')
  }

  /**
   * Remove API key (logout)
   */
  const removeApiKey = () => {
    storage.removeApiKey()
    setApiKeyState(null)
    rebrickableApi.setApiKey(null)
    setCurrentView('api-setup')
  }

  /**
   * Start new audit
   * @param {string} auditId - Audit ID
   */
  const startAudit = (auditId) => {
    setCurrentAuditId(auditId)
  }

  /**
   * Exit current audit
   */
  const exitAudit = () => {
    setCurrentAuditId(null)
  }

  /**
   * Delete audit
   * @param {string} auditId - Audit ID to delete
   */
  const deleteAudit = (auditId) => {
    storage.deleteAudit(auditId)
    if (currentAuditId === auditId) {
      setCurrentAuditId(null)
    }
  }

  const contextValue = {
    // API Key
    apiKey,
    setApiKey,
    removeApiKey,

    // Navigation
    currentView,
    setCurrentView,

    // Current Audit
    currentAuditId,
    startAudit,
    exitAudit,
    deleteAudit
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom hook to use App Context
 * @returns {object} App context value
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export default AppContext
