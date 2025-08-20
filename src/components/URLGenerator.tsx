import React, { useState } from 'react'
import { CopyIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon } from '../../lib/icons'

interface URLGeneratorProps {
  generateURL: (baseURL?: string) => string
  isValid: boolean
}

export const URLGenerator: React.FC<URLGeneratorProps> = ({
  generateURL,
  isValid
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const baseURL = typeof window !== 'undefined' ? `${window.location.origin}/api/github-pr-stats` : '/api/github-pr-stats'
  const fullURL = generateURL(baseURL)

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemId)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const markdownCode = `![GitHub PR Stats](${fullURL})`
  const htmlCode = `<img src="${fullURL}" alt="GitHub PR Stats" />`

  if (!isValid) {
    return (
      <div className="url-generator">
        <div className="url-placeholder">
          Enter a GitHub username to generate URLs
        </div>
      </div>
    )
  }

  return (
    <div className="url-generator">
      <div className="url-generator-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'flex-end', gap: '8px', flex: 1 }}>
          {!isExpanded && (
            <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
              Click here to show Embedding URL ➤
            </span>
          )}
          {isExpanded && <h3>Generated URLs</h3>}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="collapse-btn"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronDownIcon size={20} />
          ) : (
            <ChevronUpIcon size={20} />
          )}
        </button>
      </div>
      
      <div className={`url-generator-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="url-section">
          <div className="url-header">
            <h4>Markdown</h4>
            <button
              onClick={() => copyToClipboard(markdownCode, 'markdown')}
              className="copy-btn"
              title="Copy to clipboard"
            >
              {copiedItem === 'markdown' ? (
                <CheckIcon size={14} />
              ) : (
                <CopyIcon size={14} />
              )}
            </button>
          </div>
          <div className="url-content" style={{ overflow: 'hidden' }}>
            <code style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'auto',
              paddingRight: '10px'
            }}>{markdownCode}</code>
          </div>
        </div>

        <div className="url-section">
          <div className="url-header">
            <h4>HTML</h4>
            <button
              onClick={() => copyToClipboard(htmlCode, 'html')}
              className="copy-btn"
              title="Copy to clipboard"
            >
              {copiedItem === 'html' ? (
                <CheckIcon size={14} />
              ) : (
                <CopyIcon size={14} />
              )}
            </button>
          </div>
          <div className="url-content" style={{ overflow: 'hidden' }}>
            <code style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'auto',
              paddingRight: '10px'
            }}>{htmlCode}</code>
          </div>
        </div>

        <div className="url-section">
          <div className="url-header">
            <h4>API URL</h4>
            <button
              onClick={() => copyToClipboard(fullURL, 'url')}
              className="copy-btn"
              title="Copy to clipboard"
            >
              {copiedItem === 'url' ? (
                <CheckIcon size={14} />
              ) : (
                <CopyIcon size={14} />
              )}
            </button>
          </div>
          <div className="url-content" style={{ overflow: 'hidden' }}>
            <code style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'auto',
              paddingRight: '10px'
            }}>{fullURL}</code>
          </div>
        </div>
      </div>
    </div>
  )
}