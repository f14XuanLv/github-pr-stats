import React, { useState, useEffect } from 'react'
import type { APIParams, StatsOption, FieldOption } from '../../types'

interface DisplayParamsProps {
  params: APIParams
  onParamChange: <K extends keyof APIParams>(key: K, value: APIParams[K]) => void
}

export const DisplayParams: React.FC<DisplayParamsProps> = ({
  params,
  onParamChange
}) => {
  const [statsOptions, setStatsOptions] = useState<StatsOption[]>([
    { value: 'all', label: 'All', checked: false },
    { value: 'total_pr', label: 'Total PRs', checked: false },
    { value: 'merged_pr', label: 'Merged PRs', checked: false },
    { value: 'display_pr', label: 'Display PRs', checked: false },
    { value: 'repos_with_pr', label: 'Repos(≥1 PR)', checked: false },
    { value: 'repos_with_merged_pr', label: 'Repos(≥1 Merged PR)', checked: false },
    { value: 'showing_repos', label: 'Showing Repos', checked: false }
  ])

  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([
    { value: 'repo', label: 'Repository', checked: true, disabled: true, mode: 'both' },
    { value: 'stars', label: 'Stars', checked: false, mode: 'both' },
    { value: 'pr_title', label: 'PR Title', checked: false, mode: 'pr-list' },
    { value: 'pr_number', label: 'PR Number', checked: false, mode: 'pr-list' },
    { value: 'status', label: 'Status', checked: false, mode: 'pr-list' },
    { value: 'created_date', label: 'Created Date', checked: false, mode: 'pr-list' },
    { value: 'merged_date', label: 'Merged Date', checked: false, mode: 'pr-list' },
    { value: 'pr_numbers', label: 'PRs Number', checked: false, mode: 'repo-aggregate' },
    { value: 'total', label: 'Total', checked: false, mode: 'repo-aggregate' },
    { value: 'merged', label: 'Merged', checked: false, mode: 'repo-aggregate' },
    { value: 'open', label: 'Open', checked: false, mode: 'repo-aggregate' },
    { value: 'draft', label: 'Draft', checked: false, mode: 'repo-aggregate' },
    { value: 'closed', label: 'Closed', checked: false, mode: 'repo-aggregate' },
    { value: 'merged_rate', label: 'Merged Rate', checked: false, mode: 'repo-aggregate' }
  ])

  useEffect(() => {
    const currentStats = params.stats
    const isAll = currentStats === 'all'
    const isNone = currentStats === 'none' || currentStats === ''
    const selectedStats = isAll || isNone ? [] : currentStats.split(',')

    setStatsOptions(prev => prev.map(option => ({
      ...option,
      checked: isAll ? option.value === 'all' : selectedStats.includes(option.value)
    })))
  }, [params.stats])

  useEffect(() => {
    const selectedFields = params.fields.split(',')
    setFieldOptions(prev => prev.map(option => ({
      ...option,
      checked: selectedFields.includes(option.value) || option.value === 'repo'
    })))
  }, [params.fields])

  const handleStatsChange = (value: string, checked: boolean) => {
    if (value === 'all') {
      if (checked) {
        // When checking 'all', check all options and disable others
        setStatsOptions(prev => prev.map(option => ({
          ...option,
          checked: true
        })))
        onParamChange('stats', 'all')
      } else {
        // When unchecking 'all', uncheck all options
        setStatsOptions(prev => prev.map(option => ({
          ...option,
          checked: false
        })))
        onParamChange('stats', 'none')
      }
    } else {
      const newOptions = statsOptions.map(option => {
        if (option.value === 'all') return { ...option, checked: false }
        if (option.value === value) return { ...option, checked }
        return option
      })
      
      const selectedStats = newOptions
        .filter(option => option.checked && option.value !== 'all')
        .map(option => option.value)
      
      const statsString = selectedStats.length > 0 ? selectedStats.join(',') : 'none'
      onParamChange('stats', statsString)
      setStatsOptions(newOptions)
    }
  }

  const handleFieldChange = (value: string, checked: boolean) => {
    if (value === 'repo') return // repo is always required

    const newOptions = fieldOptions.map(option => {
      if (option.value === value) return { ...option, checked }
      return option
    })
    
    const selectedFields = newOptions
      .filter(option => option.checked)
      .map(option => option.value)
    
    onParamChange('fields', selectedFields.join(','))
    setFieldOptions(newOptions)
  }

  const isAllStatsSelected = statsOptions.find(opt => opt.value === 'all')?.checked || false

  // Filter field options based on current mode
  const visibleFieldOptions = fieldOptions.filter(option => 
    option.mode === 'both' || option.mode === params.mode
  )

  return (
    <div className="param-section">
      <h3>Display Parameters</h3>
      
      <div className="param-group">
        <label>Stats</label>
        <div className="checkbox-group">
          <div className="checkbox-item primary">
            <input
              type="checkbox"
              id="stats-all"
              checked={isAllStatsSelected}
              onChange={(e) => handleStatsChange('all', e.target.checked)}
            />
            <label htmlFor="stats-all">All</label>
          </div>
          <div className="checkbox-subgroup">
            {statsOptions.filter(opt => opt.value !== 'all').map(option => (
              <div key={option.value} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`stats-${option.value}`}
                  checked={isAllStatsSelected || option.checked}
                  disabled={isAllStatsSelected}
                  onChange={(e) => handleStatsChange(option.value, e.target.checked)}
                />
                <label htmlFor={`stats-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="param-group">
        <label>Fields</label>
        <div className="checkbox-group single">
          {visibleFieldOptions.map(option => (
            <div key={option.value} className="checkbox-item">
              <input
                type="checkbox"
                id={`field-${option.value}`}
                checked={option.checked}
                disabled={option.disabled}
                onChange={(e) => handleFieldChange(option.value, e.target.checked)}
              />
              <label htmlFor={`field-${option.value}`}>
                {option.label}
                {option.disabled && ' (Required)'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}