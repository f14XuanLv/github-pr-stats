export interface APIParams {
  username: string
  theme: 'dark' | 'light'
  status: string
  min_stars: number
  limit: number
  sort: string
  stats: string
  fields: string
  mode: 'pr-list' | 'repo-aggregate'
}

export interface SortCard {
  id: string
  label: string
  value: string
  group: 'status' | 'stars' | 'date' | 'merged' | 'merged_rate'
  mode?: 'pr-list' | 'repo-aggregate' | 'both'
}

export interface StatusOption {
  value: string
  label: string
  checked: boolean
}

export interface StatsOption {
  value: string
  label: string
  checked: boolean
}

export interface FieldOption {
  value: string
  label: string
  checked: boolean
  disabled?: boolean
  mode?: 'pr-list' | 'repo-aggregate' | 'both'
}

export interface ResizeState {
  leftWidth: number
  isResizing: boolean
}