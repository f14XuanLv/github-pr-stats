import React from 'react'
import { useResizable } from '../hooks/useResizable'

interface ResizableLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftPanel,
  rightPanel
}) => {
  const { leftWidth, rightWidth, isResizing, startResize } = useResizable()

  return (
    <div className="resizable-layout">
      <div 
        className="left-panel"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>
      
      <div 
        className={`resize-handle ${isResizing ? 'resizing' : ''}`}
        onMouseDown={startResize}
      >
        <div className="resize-handle-line"></div>
      </div>
      
      <div 
        className="right-panel"
        style={{ width: `${rightWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}