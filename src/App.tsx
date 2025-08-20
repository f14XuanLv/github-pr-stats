import { useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { ResizableLayout } from './components/ResizableLayout'
import { ParameterDebugger } from './components/ParameterDebugger/ParameterDebugger'
import { URLGenerator } from './components/URLGenerator'
import { SVGPreview } from './components/SVGPreview'
import { useParams } from './hooks/useParams'
import { useSVGFetch } from './hooks/useSVGFetch'
import { initViewportHeightListener } from './utils/viewportHeight'
import './App.css'

function App() {
  const { params, updateParam, generateURL, isValid } = useParams()
  const svgFetch = useSVGFetch()
  
  // 初始化视口高度监听器
  useEffect(() => {
    const cleanup = initViewportHeightListener()
    return cleanup
  }, [])

  const handleGenerate = useCallback(() => {
    if (!isValid) return
    
    const url = generateURL('/api/github-pr-stats')
    svgFetch.fetchSVG(url)
  }, [isValid, generateURL, svgFetch])

  const leftPanel = (
    <div className="left-panel-content">
      <div className="parameter-section">
        <ParameterDebugger
          params={params}
          onParamChange={updateParam}
          onGenerate={handleGenerate}
          isValid={isValid}
        />
      </div>
      
      <div className="url-section">
        <URLGenerator
          generateURL={generateURL}
          isValid={isValid}
        />
      </div>
    </div>
  )

  const rightPanel = (
    <div className="right-panel-content">
      <SVGPreview
        svgState={svgFetch}
        isValid={isValid}
      />
    </div>
  )

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <ResizableLayout
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </main>
    </div>
  )
}

export default App