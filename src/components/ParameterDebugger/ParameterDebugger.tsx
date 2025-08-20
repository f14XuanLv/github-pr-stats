import React from 'react'
import { BasicParams } from './BasicParams'
import { FilterParams } from './FilterParams'
import { SortParams } from './SortParams'
import { DisplayParams } from './DisplayParams'
import type { APIParams } from '../../types'

interface ParameterDebuggerProps {
  params: APIParams
  onParamChange: <K extends keyof APIParams>(key: K, value: APIParams[K]) => void
  onGenerate: () => void
  isValid: boolean
}

export const ParameterDebugger: React.FC<ParameterDebuggerProps> = ({
  params,
  onParamChange,
  onGenerate,
  isValid
}) => {
  return (
    <div className="parameter-debugger">
      <BasicParams
        params={params}
        onParamChange={onParamChange}
        onGenerate={onGenerate}
        isValid={isValid}
      />
      
      <FilterParams
        params={params}
        onParamChange={onParamChange}
      />
      
      <SortParams
        params={params}
        onParamChange={onParamChange}
      />
      
      <DisplayParams
        params={params}
        onParamChange={onParamChange}
      />
    </div>
  )
}