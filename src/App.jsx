import { AppProvider, useApp } from './context/AppContext'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import ApiKeySetup from './components/ApiKeySetup/ApiKeySetup'
import SetLookup from './components/SetLookup/SetLookup'
import AuditView from './components/AuditView/AuditView'
import './App.css'

function AppContent() {
  const { currentView, currentAuditId, removeApiKey } = useApp()
  const isOnline = useOnlineStatus()

  // Show offline indicator
  const renderOfflineIndicator = () => {
    if (!isOnline) {
      return (
        <div className="offline-banner" role="alert">
          <span>📡</span>
          <span>You are offline. Saved audits will work, but you cannot search for new sets.</span>
        </div>
      )
    }
    return null
  }

  // Render current view
  const renderView = () => {
    if (currentView === 'loading') {
      return (
        <div className="app-loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )
    }

    if (currentView === 'api-setup') {
      return <ApiKeySetup />
    }

    if (currentAuditId) {
      return <AuditView />
    }

    // Main view - set lookup
    return (
      <div className="app">
        <header className="app-header">
          <h1>LEGO Set Audit</h1>
          <p>Audit and track your LEGO set builds</p>
          <button
            type="button"
            className="logout-btn"
            onClick={removeApiKey}
            aria-label="Change API key"
          >
            Change API Key
          </button>
        </header>
        {renderOfflineIndicator()}
        <main className="app-main">
          <SetLookup />
        </main>
      </div>
    )
  }

  return renderView()
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
