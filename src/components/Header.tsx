import React from 'react'
import { GitHubIcon } from '../../lib/icons'

export const Header: React.FC = () => {
  const handleGitHubClick = () => {
    window.open('https://github.com/f14XuanLv/github-pr-stats', '_blank')
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">GitHub PR Stats</h1>
        <button 
          onClick={handleGitHubClick}
          className="github-link"
          title="View on GitHub"
        >
          <GitHubIcon size={24} />
        </button>
      </div>
    </header>
  )
}