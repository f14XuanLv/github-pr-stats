import { useState, useCallback, useEffect } from 'react'
import type { ResizeState } from '../types'

const MIN_LEFT_WIDTH = 25
const MAX_LEFT_WIDTH = 50
const DEFAULT_LEFT_WIDTH = 30

export const useResizable = () => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    leftWidth: DEFAULT_LEFT_WIDTH,
    isResizing: false
  })

  const startResize = useCallback(() => {
    setResizeState(prev => ({ ...prev, isResizing: true }))
  }, [])

  const stopResize = useCallback(() => {
    setResizeState(prev => ({ ...prev, isResizing: false }))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeState.isResizing) return

    const containerWidth = window.innerWidth
    const newLeftWidth = (e.clientX / containerWidth) * 100

    const clampedWidth = Math.max(MIN_LEFT_WIDTH, Math.min(MAX_LEFT_WIDTH, newLeftWidth))
    
    setResizeState(prev => ({ ...prev, leftWidth: clampedWidth }))
  }, [resizeState.isResizing])

  const handleMouseUp = useCallback(() => {
    stopResize()
  }, [stopResize])

  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [resizeState.isResizing, handleMouseMove, handleMouseUp])

  return {
    leftWidth: resizeState.leftWidth,
    rightWidth: 100 - resizeState.leftWidth,
    isResizing: resizeState.isResizing,
    startResize
  }
}