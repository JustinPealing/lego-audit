import storage from './storage'
import { STORAGE_KEYS, CACHE_EXPIRATION } from '../utils/constants'

/**
 * Cache service for storing and retrieving set data
 */
class CacheService {
  /**
   * Get all cached data
   * @returns {object} Cache object
   */
  getAll() {
    return storage.get(STORAGE_KEYS.SET_CACHE, {})
  }

  /**
   * Get cached set data
   * @param {string} setNumber - Set number
   * @returns {object|null} Cached data or null if expired/not found
   */
  get(setNumber) {
    const cache = this.getAll()
    const cached = cache[setNumber]

    if (!cached) {
      return null
    }

    // Check if cache is still valid
    const now = Date.now()
    if (cached.expiresAt && now > cached.expiresAt) {
      // Cache expired, remove it
      this.remove(setNumber)
      return null
    }

    return cached.data
  }

  /**
   * Cache set data
   * @param {string} setNumber - Set number
   * @param {object} setData - Set data to cache
   * @param {Array} parts - Parts array
   * @returns {boolean} Success status
   */
  set(setNumber, setData, parts = []) {
    const cache = this.getAll()
    const now = Date.now()

    cache[setNumber] = {
      data: setData,
      parts: parts,
      cachedAt: now,
      expiresAt: now + CACHE_EXPIRATION.SET_DATA
    }

    return storage.set(STORAGE_KEYS.SET_CACHE, cache)
  }

  /**
   * Remove cached set data
   * @param {string} setNumber - Set number
   * @returns {boolean} Success status
   */
  remove(setNumber) {
    const cache = this.getAll()
    delete cache[setNumber]
    return storage.set(STORAGE_KEYS.SET_CACHE, cache)
  }

  /**
   * Clear all cache
   * @returns {boolean} Success status
   */
  clear() {
    return storage.set(STORAGE_KEYS.SET_CACHE, {})
  }

  /**
   * Clean expired cache entries
   * @returns {number} Number of entries removed
   */
  cleanExpired() {
    const cache = this.getAll()
    const now = Date.now()
    let removed = 0

    Object.keys(cache).forEach(key => {
      if (cache[key].expiresAt && now > cache[key].expiresAt) {
        delete cache[key]
        removed++
      }
    })

    if (removed > 0) {
      storage.set(STORAGE_KEYS.SET_CACHE, cache)
    }

    return removed
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    const cache = this.getAll()
    const entries = Object.keys(cache).length
    const now = Date.now()

    let totalSize = 0
    let expired = 0

    Object.values(cache).forEach(entry => {
      totalSize += JSON.stringify(entry).length
      if (entry.expiresAt && now > entry.expiresAt) {
        expired++
      }
    })

    return {
      entries,
      expired,
      totalSize,
      totalSizeKB: Math.round(totalSize / 1024)
    }
  }
}

// Export singleton instance
export default new CacheService()
