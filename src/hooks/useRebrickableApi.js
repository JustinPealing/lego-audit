import { useState } from 'react'
import rebrickableApi from '../services/rebrickable'
import cache from '../services/cache'
import { normalizeSetNumber } from '../utils/helpers'

/**
 * Custom hook for making Rebrickable API calls with loading and error states
 * @returns {object} API methods and states
 */
export function useRebrickableApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(null)

  /**
   * Fetch set data with caching
   * @param {string} setNumber - Set number
   * @returns {Promise<object>} Set data with parts
   */
  const fetchSet = async (setNumber) => {
    const normalized = normalizeSetNumber(setNumber)
    setLoading(true)
    setError(null)
    setProgress(null)

    try {
      // Check cache first
      const cached = cache.get(normalized)
      if (cached) {
        console.log(`Using cached data for set ${normalized}`)
        setLoading(false)
        return cached
      }

      // Fetch from API
      console.log(`Fetching set ${normalized} from API`)
      const setData = await rebrickableApi.getSet(normalized)

      // Fetch all parts with progress updates
      const parts = await rebrickableApi.getAllSetParts(normalized, (progressData) => {
        setProgress(progressData)
      })

      // Add unique ID to each part (part_num + color_id + is_spare)
      // Spare parts need separate IDs so they appear as distinct rows
      const partsWithIds = parts.map(part => ({
        ...part,
        id: `${part.part?.part_num || 'unknown'}-${part.color?.id || '0'}-${part.is_spare ? 'spare' : 'regular'}`
      }))

      const result = {
        ...setData,
        parts: partsWithIds
      }

      // Cache the result
      cache.set(normalized, result, partsWithIds)

      setLoading(false)
      setProgress(null)
      return result
    } catch (err) {
      setError(err.message)
      setLoading(false)
      setProgress(null)
      throw err
    }
  }

  /**
   * Validate API key
   * @returns {Promise<boolean>} True if valid
   */
  const validateApiKey = async () => {
    setLoading(true)
    setError(null)

    try {
      const isValid = await rebrickableApi.validateKey()
      setLoading(false)
      return isValid
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return false
    }
  }

  /**
   * Search for sets
   * @param {string} query - Search query
   * @returns {Promise<object>} Search results
   */
  const searchSets = async (query) => {
    setLoading(true)
    setError(null)

    try {
      const results = await rebrickableApi.searchSets(query)
      setLoading(false)
      return results
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  return {
    fetchSet,
    validateApiKey,
    searchSets,
    loading,
    error,
    progress
  }
}
