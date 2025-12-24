import { REBRICKABLE_API_BASE_URL, API_ERRORS } from '../utils/constants'

/**
 * Rebrickable API client
 */
class RebrickableAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey
    this.baseURL = REBRICKABLE_API_BASE_URL
  }

  /**
   * Set API key
   * @param {string} apiKey - The API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey
  }

  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    if (!this.apiKey) {
      throw new Error(API_ERRORS.INVALID_KEY)
    }

    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Authorization': `key ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      // Handle different response statuses
      if (response.status === 401 || response.status === 403) {
        throw new Error(API_ERRORS.UNAUTHORIZED)
      }

      if (response.status === 404) {
        throw new Error(API_ERRORS.SET_NOT_FOUND)
      }

      if (response.status === 429) {
        throw new Error(API_ERRORS.RATE_LIMIT)
      }

      if (response.status >= 500) {
        throw new Error(API_ERRORS.SERVER_ERROR)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      // Network error (offline, DNS failure, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(API_ERRORS.NETWORK_ERROR)
      }
      throw error
    }
  }

  /**
   * Validate API key by making a simple request
   * @returns {Promise<boolean>} True if key is valid
   */
  async validateKey() {
    try {
      // Make a simple request to verify the key works
      await this.request('/lego/colors/?page_size=1')
      return true
    } catch (error) {
      console.error('API key validation failed:', error)
      return false
    }
  }

  /**
   * Get LEGO set details
   * @param {string} setNumber - Set number (e.g., "75192-1")
   * @returns {Promise<object>} Set data
   */
  async getSet(setNumber) {
    return await this.request(`/lego/sets/${setNumber}/`)
  }

  /**
   * Get parts for a LEGO set (single page)
   * @param {string} setNumber - Set number
   * @param {number} page - Page number (default 1)
   * @param {number} pageSize - Items per page (default 1000)
   * @returns {Promise<object>} Parts data with pagination info
   */
  async getSetParts(setNumber, page = 1, pageSize = 1000) {
    return await this.request(`/lego/sets/${setNumber}/parts/?page=${page}&page_size=${pageSize}`)
  }

  /**
   * Get all parts for a LEGO set (handles pagination automatically)
   * @param {string} setNumber - Set number
   * @param {Function} onProgress - Optional callback for progress updates
   * @returns {Promise<Array>} Array of all parts
   */
  async getAllSetParts(setNumber, onProgress = null) {
    const allParts = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.getSetParts(setNumber, page, 1000)

      // Add parts to collection
      allParts.push(...response.results)

      // Call progress callback if provided
      if (onProgress) {
        const progress = {
          current: allParts.length,
          total: response.count,
          percentage: Math.round((allParts.length / response.count) * 100)
        }
        onProgress(progress)
      }

      // Check if there are more pages
      hasMore = response.next !== null
      page++
    }

    return allParts
  }

  /**
   * Get part details
   * @param {string} partNum - Part number
   * @returns {Promise<object>} Part data
   */
  async getPart(partNum) {
    return await this.request(`/lego/parts/${partNum}/`)
  }

  /**
   * Get color details
   * @param {number} colorId - Color ID
   * @returns {Promise<object>} Color data
   */
  async getColor(colorId) {
    return await this.request(`/lego/colors/${colorId}/`)
  }

  /**
   * Search for LEGO sets
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Promise<object>} Search results
   */
  async searchSets(query, page = 1, pageSize = 20) {
    return await this.request(`/lego/sets/?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`)
  }
}

// Export singleton instance (will be initialized with API key later)
export default new RebrickableAPI()
