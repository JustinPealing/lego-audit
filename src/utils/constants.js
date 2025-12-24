// Rebrickable API
export const REBRICKABLE_API_BASE_URL = 'https://rebrickable.com/api/v3'
export const REBRICKABLE_CDN_BASE_URL = 'https://cdn.rebrickable.com'

// LocalStorage keys
export const STORAGE_KEYS = {
  API_KEY: 'lego_audit_api_key',
  AUDITS: 'lego_audit_audits',
  SET_CACHE: 'lego_audit_set_cache',
  PREFERENCES: 'lego_audit_preferences'
}

// Tracking modes
export const TRACKING_MODES = {
  CHECKBOX: 'checkbox',
  COUNTER: 'counter'
}

// Cache expiration times
export const CACHE_EXPIRATION = {
  SET_DATA: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  API_RESPONSE: 7 * 24 * 60 * 60 * 1000 // 7 days
}

// API error messages
export const API_ERRORS = {
  INVALID_KEY: 'Invalid API key. Please check your key and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  SET_NOT_FOUND: 'Set not found. Please check the set number.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  OFFLINE: 'You are offline. Please connect to the internet to search for sets.',
  UNAUTHORIZED: 'Unauthorized. Please check your API key.',
  SERVER_ERROR: 'Server error. Please try again later.'
}

// Limits
export const LIMITS = {
  MAX_SAVED_AUDITS: 20,
  DEBOUNCE_DELAY: 500 // milliseconds
}
