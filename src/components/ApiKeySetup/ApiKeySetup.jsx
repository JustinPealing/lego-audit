import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useRebrickableApi } from '../../hooks/useRebrickableApi'
import rebrickableApi from '../../services/rebrickable'
import './ApiKeySetup.css'

export default function ApiKeySetup() {
  const { setApiKey } = useApp()
  const { validateApiKey, loading, error } = useRebrickableApi()
  const [keyInput, setKeyInput] = useState('')
  const [validationError, setValidationError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError(null)

    if (!keyInput.trim()) {
      setValidationError('Please enter an API key')
      return
    }

    // Set the API key temporarily for validation
    rebrickableApi.setApiKey(keyInput.trim())

    // Validate the key
    const isValid = await validateApiKey()

    if (isValid) {
      // Save the key
      setApiKey(keyInput.trim())
    } else {
      setValidationError(error || 'Invalid API key. Please check and try again.')
      rebrickableApi.setApiKey(null)
    }
  }

  return (
    <div className="api-key-setup">
      <div className="api-key-setup-container">
        <div className="api-key-setup-header">
          <h1>Welcome to LEGO Audit</h1>
          <p>Audit and track your LEGO set builds</p>
        </div>

        <div className="api-key-setup-content">
          <div className="info-box">
            <h2>Get Started</h2>
            <p>
              To use this app, you need a free Rebrickable API key. This allows the app to fetch LEGO set data and parts information.
            </p>

            <h3>How to get your API key:</h3>
            <ol>
              <li>
                Visit{' '}
                <a
                  href="https://rebrickable.com/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  rebrickable.com/api
                </a>
              </li>
              <li>Create a free account or log in</li>
              <li>Go to your account settings</li>
              <li>Copy your API key</li>
              <li>Paste it below</li>
            </ol>

            <div className="privacy-note">
              <strong>Privacy:</strong> Your API key is stored locally in your browser and is never sent to any server except Rebrickable's official API.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="api-key-form">
            <div className="form-group">
              <label htmlFor="api-key-input">Rebrickable API Key</label>
              <input
                id="api-key-input"
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter your API key here"
                disabled={loading}
                className={validationError || error ? 'error' : ''}
                autoFocus
              />
              {(validationError || error) && (
                <div className="error-message" role="alert">
                  {validationError || error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !keyInput.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Validating...</span>
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
