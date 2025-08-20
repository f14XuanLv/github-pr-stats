import { useState, useCallback, useMemo, useEffect } from 'react'
import type { APIParams, SortCard } from '../types'
import { saveParamsToLocalStorage, loadParamsFromLocalStorage } from '../utils/localStorage'

const DEFAULT_PARAMS: APIParams = {
  username: '',
  theme: 'dark',
  status: 'all',
  min_stars: 0,
  limit: 10,
  sort: 'status,stars_desc',
  stats: 'all',
  fields: 'repo,stars,pr_title,pr_number,status,created_date,merged_date',
  mode: 'pr-list'
}

export const useParams = () => {
  const [params, setParams] = useState<APIParams>(() => {
    const savedParams = loadParamsFromLocalStorage()
    return savedParams ? { ...DEFAULT_PARAMS, ...savedParams } : DEFAULT_PARAMS
  })

  // Save params to localStorage whenever they change
  useEffect(() => {
    saveParamsToLocalStorage(params)
  }, [params])

  const updateParam = useCallback(<K extends keyof APIParams>(
    key: K,
    value: APIParams[K]
  ) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value }
      
      // Auto-update related params when mode changes
      if (key === 'mode') {
        if (value === 'repo-aggregate') {
          // Switch to repo-aggregate mode defaults
          newParams.sort = 'merged_desc,stars_desc'
          newParams.fields = 'repo,stars,pr_numbers,total,merged,merged_rate'
          newParams.status = 'all' // Reset status to all since it's ignored anyway
        } else if (value === 'pr-list') {
          // Switch to pr-list mode defaults
          newParams.sort = 'status,stars_desc'
          newParams.fields = 'repo,stars,pr_title,pr_number,status,created_date,merged_date'
        }
      }
      
      return newParams
    })
  }, [])

  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS)
  }, [])

  const generateURL = useCallback((baseURL: string = '') => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'username' && !value) return
        searchParams.append(key, String(value))
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${baseURL}?${queryString}` : baseURL
  }, [params])

  const isValid = useMemo(() => {
    return params.username.trim().length > 0
  }, [params.username])

  return {
    params,
    updateParam,
    resetParams,
    generateURL,
    isValid
  }
}

const parseSortStringToCards = (sortString: string): SortCard[] => {
  return sortString.split(',').map((sortValue, index) => {
    switch (sortValue.trim()) {
      case 'status':
        return { id: `${index}`, label: 'Status', value: 'status', group: 'status', mode: 'pr-list' }
      case 'stars_desc':
        return { id: `${index}`, label: 'Stars ⬇', value: 'stars_desc', group: 'stars', mode: 'both' }
      case 'stars_asc':
        return { id: `${index}`, label: 'Stars ⬆', value: 'stars_asc', group: 'stars', mode: 'both' }
      case 'created_date_desc':
        return { id: `${index}`, label: 'Created ⬇', value: 'created_date_desc', group: 'date', mode: 'pr-list' }
      case 'created_date_asc':
        return { id: `${index}`, label: 'Created ⬆', value: 'created_date_asc', group: 'date', mode: 'pr-list' }
      case 'merged_desc':
        return { id: `${index}`, label: 'Merged ⬇', value: 'merged_desc', group: 'merged', mode: 'repo-aggregate' }
      case 'merged_asc':
        return { id: `${index}`, label: 'Merged ⬆', value: 'merged_asc', group: 'merged', mode: 'repo-aggregate' }
      case 'merged_rate_desc':
        return { id: `${index}`, label: 'Merged Rate ⬇', value: 'merged_rate_desc', group: 'merged_rate', mode: 'repo-aggregate' }
      case 'merged_rate_asc':
        return { id: `${index}`, label: 'Merged Rate ⬆', value: 'merged_rate_asc', group: 'merged_rate', mode: 'repo-aggregate' }
      default:
        return { id: `${index}`, label: 'Unknown', value: sortValue, group: 'status', mode: 'both' }
    }
  })
}

export const useSortCards = (initialSort: string) => {
  const [selectedCards, setSelectedCards] = useState<SortCard[]>(() => parseSortStringToCards(initialSort))

  // Function to reset cards based on a new sort string
  const resetToSortString = useCallback((sortString: string) => {
    const newCards = parseSortStringToCards(sortString)
    setSelectedCards(newCards)
  }, [])

  const availableCards: SortCard[] = [
    { id: 'status', label: 'Status', value: 'status', group: 'status', mode: 'pr-list' },
    { id: 'stars_desc', label: 'Stars ⬇', value: 'stars_desc', group: 'stars', mode: 'both' },
    { id: 'stars_asc', label: 'Stars ⬆', value: 'stars_asc', group: 'stars', mode: 'both' },
    { id: 'created_date_desc', label: 'Created ⬇', value: 'created_date_desc', group: 'date', mode: 'pr-list' },
    { id: 'created_date_asc', label: 'Created ⬆', value: 'created_date_asc', group: 'date', mode: 'pr-list' },
    { id: 'merged_desc', label: 'Merged ⬇', value: 'merged_desc', group: 'merged', mode: 'repo-aggregate' },
    { id: 'merged_asc', label: 'Merged ⬆', value: 'merged_asc', group: 'merged', mode: 'repo-aggregate' },
    { id: 'merged_rate_desc', label: 'Merged Rate ⬇', value: 'merged_rate_desc', group: 'merged_rate', mode: 'repo-aggregate' },
    { id: 'merged_rate_asc', label: 'Merged Rate ⬆', value: 'merged_rate_asc', group: 'merged_rate', mode: 'repo-aggregate' }
  ]

  const updateSelectedCards = useCallback((cards: SortCard[]) => {
    setSelectedCards(cards)
  }, [])

  const getSortString = useCallback(() => {
    return selectedCards.map(card => card.value).join(',')
  }, [selectedCards])

  const getAvailableCardsForGroup = useCallback((group: string) => {
    const selectedInGroup = selectedCards.find(card => card.group === group)
    return availableCards.filter(card => 
      card.group === group && (!selectedInGroup || selectedInGroup.value !== card.value)
    )
  }, [selectedCards])

  return {
    selectedCards,
    availableCards,
    updateSelectedCards,
    getSortString,
    getAvailableCardsForGroup,
    resetToSortString
  }
}