import { createContext } from 'react'
import type { Config } from '../../types'

interface ConfigContextType {
  config: Config
  handlers: {
    handleChangeConfigCheckbox: (
      type:
        | 'enableSubModels'
        | 'enableConstraints'
        | 'showModelFile'
        | 'randomizeGeneration',
      checked: boolean,
    ) => void
    handleChangeConfigInput: (
      type: 'orderOfCombinations' | 'randomizeSeed',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void
  }
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export default ConfigContext
