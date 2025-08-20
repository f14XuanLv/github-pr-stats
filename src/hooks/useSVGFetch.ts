import { useState, useCallback, useRef } from 'react'

export interface SVGFetchState {
  data: string | null
  loading: boolean
  error: string | null
}

export const useSVGFetch = () => {
  const [state, setState] = useState<SVGFetchState>({
    data: null,
    loading: false,
    error: null
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchSVG = useCallback(async (url: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'image/svg+xml,*/*'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const svgText = await response.text()
      
      if (controller.signal.aborted) return

      setState({
        data: svgText,
        loading: false,
        error: null
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch SVG'
      })
    }
  }, [])

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    fetchSVG,
    reset
  }
}