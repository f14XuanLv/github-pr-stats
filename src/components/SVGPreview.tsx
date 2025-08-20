import React from 'react'
import type { SVGFetchState } from '../hooks/useSVGFetch'

interface SVGPreviewProps {
  svgState: SVGFetchState
  isValid: boolean
}

export const SVGPreview: React.FC<SVGPreviewProps> = ({
  svgState,
  isValid
}) => {
  const renderContent = () => {
    if (!isValid) {
      return (
        <div className="preview-placeholder">
          <div className="placeholder-content">
            <h3>GitHub PR Stats Preview</h3>
            <p>Enter a GitHub username and click Generate to see your PR statistics</p>
          </div>
        </div>
      )
    }

    if (svgState.loading) {
      return (
        <div className="preview-loading">
          <div className="loading-spinner"></div>
        </div>
      )
    }

    if (svgState.error) {
      return (
        <div className="preview-error">
          <div className="error-content">
            <h3>Error Loading Preview</h3>
            <p>{svgState.error}</p>
            <p className="error-hint">
              Please check your username and try again
            </p>
          </div>
        </div>
      )
    }

    if (svgState.data) {
      return (
        <div className="preview-svg">
          <div
            className="svg-container"
            dangerouslySetInnerHTML={{ __html: svgState.data }}
            // 添加 key 确保重新渲染时滚动位置重置
            key={svgState.data.substring(0, 100)}
          />
        </div>
      )
    }

    return (
      <div className="preview-placeholder">
        <div className="placeholder-content">
          <h3>Ready to Generate</h3>
          <p>Click the Generate button to create your PR statistics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="svg-preview">
      <div className="preview-content">
        {renderContent()}
      </div>
    </div>
  )
}