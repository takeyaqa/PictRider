import { useState, useEffect, useRef, useReducer } from 'react'
import { PictRunner } from '../pict/pict-runner'
import {
  ParametersArea,
  OptionsArea,
  ConstraintsArea,
  RunButtonArea,
  ErrorMessageArea,
  ResultArea,
} from '../components'
import { PictOutput, PictConfig } from '../types'

// Interface for the combined output and error state
interface PictResult {
  output: PictOutput | null
  errorMessage: string
}

import { getInitialModel, modelReducer } from '../reducers/model-reducer'

interface AppMainProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function AppMain({ pictRunnerInjection }: AppMainProps) {
  const [modelState, dispatchModelState] = useReducer(
    modelReducer,
    getInitialModel(),
  )
  const [config, setConfig] = useState<PictConfig>({
    enableConstraints: false,
    showModelFile: false,
    orderOfCombinations: 2,
  })
  const [result, setResult] = useState<PictResult>({
    output: null,
    errorMessage: '',
  })
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)

  useEffect(() => {
    // Use the injected PictRunner for testing
    if (pictRunnerInjection) {
      pictRunner.current = pictRunnerInjection
      setPictRunnerLoaded(true)
      return
    }
    const loadPictRunner = async () => {
      pictRunner.current = new PictRunner()
      await pictRunner.current.init()
      setPictRunnerLoaded(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadPictRunner()
  }, [pictRunnerInjection])

  function handleParameterInputChange(
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModelState({
      type: 'CHANGE_PARAMETER',
      payload: {
        id,
        field,
        e,
      },
    })
  }

  function addConstraint() {
    dispatchModelState({
      type: 'ADD_CONSTRAINT',
    })
  }

  function removeConstraint() {
    dispatchModelState({
      type: 'REMOVE_CONSTRAINT',
    })
  }

  function handleClickCondition(constraintId: string, parameterId: string) {
    console.log('handleClickCondition', constraintId, parameterId)
    dispatchModelState({
      type: 'CLICK_CONSTRAINT',
      payload: {
        constraintId,
        parameterId,
      },
    })
  }

  function handleChangeCondition(
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModelState({
      type: 'CHANGE_CONSTRAINT',
      payload: {
        constraintId,
        parameterId,
        e,
      },
    })
  }

  function addParameterInputRow() {
    dispatchModelState({
      type: 'ADD_PARAMETER',
    })
  }

  function removeParameterInputRow() {
    dispatchModelState({
      type: 'REMOVE_PARAMETER',
    })
  }

  function clearAllParameterValues() {
    dispatchModelState({
      type: 'CLEAR',
    })
  }

  function handleChangeConfig(
    type: 'enableConstraints' | 'showModelFile' | 'orderOfCombinations',
    e?: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newConfig = { ...config }
    switch (type) {
      case 'enableConstraints': {
        newConfig.enableConstraints = !config.enableConstraints
        break
      }
      case 'showModelFile': {
        newConfig.showModelFile = !config.showModelFile
        break
      }
      case 'orderOfCombinations': {
        if (e) {
          try {
            if (e.target.value !== '') {
              newConfig.orderOfCombinations = Number(e.target.value)
            }
          } catch {
            newConfig.orderOfCombinations = 2
          }
        }
        break
      }
    }
    setConfig(newConfig)
  }

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    try {
      const fixedParameters = modelState.parameters
        .filter((p) => p.name !== '' && p.values !== '')
        .map((p) => ({ name: p.name, values: p.values }))
      const fixedConstraints = modelState.constraints.map((c) => ({
        conditions: c.conditions.map((cond) => ({
          ifOrThen: cond.ifOrThen,
          predicate: cond.predicate,
          parameter: cond.parameterRef.name,
        })),
      }))
      const output = config.enableConstraints
        ? pictRunner.current.run(fixedParameters, {
            constraints: fixedConstraints,
            options: config,
          })
        : pictRunner.current.run(fixedParameters, {
            options: config,
          })
      const header = output.header.map((h, i) => {
        return { id: i, name: h }
      })
      const body = output.body.map((row, i) => {
        return {
          id: i,
          values: row.map((col, j) => {
            return { id: j, value: col }
          }),
        }
      })
      setResult({
        output: { header, body, modelFile: output.modelFile },
        errorMessage: '',
      })
    } catch (e) {
      if (e instanceof Error) {
        setResult({
          output: null,
          errorMessage: e.message,
        })
      }
    }
  }

  return (
    <main className="bg-white">
      <ParametersArea
        parameters={modelState.parameters}
        messages={modelState.parameterError}
        onInputChange={handleParameterInputChange}
        onAddRow={addParameterInputRow}
        onRemoveRow={removeParameterInputRow}
        onClearValues={clearAllParameterValues}
      />
      <OptionsArea config={config} handleChangeConfig={handleChangeConfig} />
      <ConstraintsArea
        config={config}
        parameters={modelState.parameters}
        constraints={modelState.constraints}
        messages={modelState.constraintsError}
        onAddConstraint={addConstraint}
        onRemoveConstraint={removeConstraint}
        onClickCondition={handleClickCondition}
        onChangeCondition={handleChangeCondition}
      />
      <RunButtonArea
        parameters={modelState.parameters}
        constraints={modelState.constraints}
        pictRunnerLoaded={pictRunnerLoaded}
        onClickRun={runPict}
      />
      <ErrorMessageArea message={result.errorMessage} />
      <ResultArea config={config} output={result.output} />
    </main>
  )
}

export default AppMain
