import { useImmerReducer } from 'use-immer'
import ConfigContext from './context'
import { configReducer, getInitialConfig } from './reducer'

function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, dispatch] = useImmerReducer(configReducer, getInitialConfig())

  const handleChangeConfigCheckbox = (
    type:
      | 'enableSubModels'
      | 'enableConstraints'
      | 'showModelFile'
      | 'randomizeGeneration',
    checked: boolean,
  ) => {
    dispatch({
      type,
      payload: { checked },
    })
  }

  const handleChangeConfigInput = (
    type: 'orderOfCombinations' | 'randomizeSeed',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({
      type,
      payload: { e },
    })
  }
  const value = {
    config,
    handlers: {
      handleChangeConfigCheckbox,
      handleChangeConfigInput,
    },
  }

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
