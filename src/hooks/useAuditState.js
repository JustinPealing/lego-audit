import { useState, useEffect, useCallback } from 'react'
import storage from '../services/storage'
import { debounce, calculateProgress, generateAuditId } from '../utils/helpers'
import { LIMITS } from '../utils/constants'

/**
 * Custom hook for managing audit state with auto-save
 * @param {string} auditId - Optional audit ID to load
 * @returns {object} Audit state and methods
 */
export function useAuditState(auditId = null) {
  const [audit, setAudit] = useState(null)
  const [isDirty, setIsDirty] = useState(false)

  // Load audit on mount if auditId is provided
  useEffect(() => {
    if (auditId) {
      const loadedAudit = storage.getAudit(auditId)
      if (loadedAudit) {
        setAudit(loadedAudit)
      }
    }
  }, [auditId])

  // Auto-save with debouncing
  const saveToStorage = useCallback(
    debounce((auditData) => {
      if (auditData) {
        storage.saveAudit(auditData)
        console.log('Audit auto-saved:', auditData.id)
      }
    }, LIMITS.DEBOUNCE_DELAY),
    []
  )

  // Save when audit changes
  useEffect(() => {
    if (isDirty && audit) {
      saveToStorage(audit)
      setIsDirty(false)
    }
  }, [audit, isDirty, saveToStorage])

  /**
   * Create new audit
   * @param {object} setData - Set data from API
   */
  const createAudit = useCallback((setData) => {
    // Calculate total inventory by summing all part quantities (includes spares)
    const parts = setData.parts || []
    const totalInventoryParts = parts.reduce((sum, part) => sum + (part.quantity || 0), 0)

    const newAudit = {
      id: generateAuditId(setData.set_num),
      setNumber: setData.set_num,
      setName: setData.name,
      setYear: setData.year,
      imageUrl: setData.set_img_url,
      theme: setData.set_url?.split('/')[4] || 'Unknown',
      publishedPartCount: setData.num_parts, // Official published count
      totalParts: totalInventoryParts, // Total inventory including spares
      parts: parts,
      partsStatus: {},
      progress: {
        completed: 0,
        total: totalInventoryParts,
        percentage: 0
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }

    // Save immediately to storage (don't wait for debounce)
    storage.saveAudit(newAudit)
    console.log('Audit created and saved:', newAudit.id)

    setAudit(newAudit)
    return newAudit
  }, [])

  /**
   * Update part status
   * @param {string} partId - Part ID
   * @param {object} status - Status object (checked or quantity)
   */
  const updatePartStatus = useCallback((partId, status) => {
    if (!audit) return

    setAudit(prev => {
      const newPartsStatus = {
        ...prev.partsStatus,
        [partId]: status
      }

      const newProgress = calculateProgress(newPartsStatus, prev.parts)

      return {
        ...prev,
        partsStatus: newPartsStatus,
        progress: newProgress
      }
    })
    setIsDirty(true)
  }, [audit])

  /**
   * Clear current audit
   */
  const clearAudit = useCallback(() => {
    setAudit(null)
    setIsDirty(false)
  }, [])

  /**
   * Force save immediately (bypass debounce)
   */
  const forceSave = useCallback(() => {
    if (audit) {
      storage.saveAudit(audit)
      setIsDirty(false)
    }
  }, [audit])

  return {
    audit,
    createAudit,
    updatePartStatus,
    clearAudit,
    forceSave
  }
}
