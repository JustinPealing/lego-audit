import { useState, useEffect } from 'react'

/**
 * Custom hook for syncing state with localStorage
 * @param {string} key - LocalStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[*, Function]} State value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
