import React, { useState, useEffect } from 'react'
import type { APIParams, StatusOption } from '../../types'

interface FilterParamsProps {
  params: APIParams
  onParamChange: <K extends keyof APIParams>(key: K, value: APIParams[K]) => void
}

export const FilterParams: React.FC<FilterParamsProps> = ({
  params,
  onParamChange
}) => {
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([
    { value: 'all', label: 'All', checked: params.status === 'all' },
    { value: 'merged', label: 'Merged', checked: false },
    { value: 'open', label: 'Open', checked: false },
    { value: 'draft', label: 'Draft', checked: false },
    { value: 'closed', label: 'Closed', checked: false }
  ])

  useEffect(() => {
    const currentStatus = params.status
    const isAll = currentStatus === 'all'
    const selectedStatuses = isAll ? [] : currentStatus.split(',')

    setStatusOptions(prev => prev.map(option => ({
      ...option,
      checked: isAll ? option.value === 'all' : selectedStatuses.includes(option.value)
    })))
  }, [params.status])

  const handleStatusChange = (value: string, checked: boolean) => {
    if (value === 'all') {
      if (checked) {
        // When checking 'all', check all options and disable others
        setStatusOptions(prev => prev.map(option => ({
          ...option,
          checked: true
        })))
        onParamChange('status', 'all')
      } else {
        // When unchecking 'all', uncheck all options
        setStatusOptions(prev => prev.map(option => ({
          ...option,
          checked: false
        })))
        onParamChange('status', 'none')
      }
    } else {
      const newOptions = statusOptions.map(option => {
        if (option.value === 'all') return { ...option, checked: false }
        if (option.value === value) return { ...option, checked }
        return option
      })
      
      const selectedStatuses = newOptions
        .filter(option => option.checked && option.value !== 'all')
        .map(option => option.value)
      
      const statusString = selectedStatuses.length > 0 ? selectedStatuses.join(',') : 'none'
      onParamChange('status', statusString)
      setStatusOptions(newOptions)
    }
  }

  const isAllSelected = statusOptions.find(opt => opt.value === 'all')?.checked || false
  const isRepoAggregateMode = params.mode === 'repo-aggregate'

  return (
    <div className="param-section">
      <h3>Filter Parameters</h3>
      
      {!isRepoAggregateMode && (
        <div className="param-group">
          <label>Status</label>
          <div className="checkbox-group">
            <div className="checkbox-item primary">
              <input
                type="checkbox"
                id="status-all"
                checked={isAllSelected}
                onChange={(e) => handleStatusChange('all', e.target.checked)}
              />
              <label htmlFor="status-all">All</label>
            </div>
            <div className="checkbox-subgroup">
              {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                <div key={option.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`status-${option.value}`}
                    checked={isAllSelected || option.checked}
                    disabled={isAllSelected}
                    onChange={(e) => handleStatusChange(option.value, e.target.checked)}
                  />
                  <label htmlFor={`status-${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isRepoAggregateMode && (
        <div className="param-group">
          <div className="mode-notice">
            <p>📄 Repository Aggregate Mode</p>
            <p>Status filtering is not available in this mode. All PRs are included in repository statistics.</p>
          </div>
        </div>
      )}

      <div className="param-group">
        <label htmlFor="min_stars">Min Stars</label>
        <input
          id="min_stars"
          type="number"
          min="0"
          value={params.min_stars}
          onChange={(e) => onParamChange('min_stars', parseInt(e.target.value) || 0)}
          className="param-input"
        />
      </div>

      <div className="param-group">
        <label htmlFor="limit">Limit</label>
        <input
          id="limit"
          type="number"
          min="1"
          value={params.limit}
          onChange={(e) => onParamChange('limit', parseInt(e.target.value) || 10)}
          className="param-input"
        />
      </div>
    </div>
  )
}