import React from 'react'
import type { APIParams } from '../../types'

interface BasicParamsProps {
  params: APIParams
  onParamChange: <K extends keyof APIParams>(key: K, value: APIParams[K]) => void
  onGenerate: () => void
  isValid: boolean
}

export const BasicParams: React.FC<BasicParamsProps> = ({
  params,
  onParamChange,
  onGenerate,
  isValid
}) => {
  return (
    <div className="param-section">
      <h3>Basic Parameters</h3>
      
      <div className="param-group">
        <label htmlFor="username">Username</label>
        <div className="input-with-button">
          <input
            id="username"
            type="text"
            value={params.username}
            onChange={(e) => onParamChange('username', e.target.value)}
            placeholder="Enter GitHub username"
            className="param-input"
          />
          <button
            onClick={onGenerate}
            disabled={!isValid}
            className="generate-btn"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="param-group">
        <label htmlFor="mode">Mode</label>
        <select
          id="mode"
          value={params.mode}
          onChange={(e) => onParamChange('mode', e.target.value as 'pr-list' | 'repo-aggregate')}
          className="param-select"
        >
          <option value="pr-list">PR List</option>
          <option value="repo-aggregate">Repository Aggregate</option>
        </select>
      </div>

      <div className="param-group">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          value={params.theme}
          onChange={(e) => onParamChange('theme', e.target.value as 'dark' | 'light')}
          className="param-select"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>
  )
}