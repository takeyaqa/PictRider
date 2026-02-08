import { useCallback, useMemo } from 'react'
import { useImmerReducer } from 'use-immer'
import ConfigContext from './context'
import { configReducer, getInitialConfig } from './reducer'

function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, dispatch] = useImmerReducer(configReducer, getInitialConfig())

  const handleChangeConfigCheckbox = useCallback(
    (
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
    },
    [dispatch],
  )

  const handleChangeConfigInput = useCallback(
    (
      type: 'orderOfCombinations' | 'randomizeSeed',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch({
        type,
        payload: { e },
      })
    },
    [dispatch],
  )

  const value = useMemo(
    () => ({
      config,
      handlers: {
        handleChangeConfigCheckbox,
        handleChangeConfigInput,
      },
    }),
    [config, handleChangeConfigCheckbox, handleChangeConfigInput],
  )

  return <ConfigContext value={value}>{children}</ConfigContext>
}

export default ConfigProvider
