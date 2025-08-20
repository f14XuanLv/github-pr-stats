import type { APIParams } from '../types'

const STORAGE_KEY = 'github-pr-stats-params'

export const saveParamsToLocalStorage = (params: APIParams): void => {
  try {
    const paramsToSave = { ...params }
    // Don't save empty username to avoid overriding with empty value
    if (!paramsToSave.username.trim()) {
      delete (paramsToSave as any).username
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paramsToSave))
  } catch (error) {
    console.warn('Failed to save params to localStorage:', error)
  }
}

export const loadParamsFromLocalStorage = (): Partial<APIParams> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const parsed = JSON.parse(stored)
    return parsed
  } catch (error) {
    console.warn('Failed to load params from localStorage:', error)
    return null
  }
}

export const clearParamsFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear params from localStorage:', error)
  }
}