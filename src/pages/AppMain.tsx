import { useState, useEffect, useRef, useReducer } from 'react'
import { PictRunner } from '../pict/pict-runner'
import {
  ParametersArea,
  OptionsArea,
  ConstraintsArea,
  RunButtonArea,
  ResultArea,
} from '../components'
import { PictOutput } from '../types'
import { getInitialModel, modelReducer } from '../reducers/model-reducer'
import { configReducer, getInitialConfig } from '../reducers/config-reducer'

// Interface for the combined output and error state
interface PictResult {
  output: PictOutput | null
  errorMessage: string
}

interface AppMainProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function AppMain({ pictRunnerInjection }: AppMainProps) {
  const [model, dispatchModel] = useReducer(modelReducer, getInitialModel())
  const [config, dispatchConfig] = useReducer(configReducer, getInitialConfig())
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

  function handleChangeParameter(
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModel({
      type: 'changeParameter',
      payload: { id, field, e },
    })
  }

  function handleClickAddRow() {
    dispatchModel({
      type: 'clickAddRow',
    })
  }

  function handleClickRemoveRow() {
    dispatchModel({
      type: 'clickRemoveRow',
    })
  }

  function handleClickClear() {
    dispatchModel({
      type: 'clickClear',
    })
  }

  function handleToggleCondition(constraintId: string, parameterId: string) {
    dispatchModel({
      type: 'toggleCondition',
      payload: { constraintId, parameterId },
    })
  }

  function handleChangeCondition(
    constraintId: string,
    parameterId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModel({
      type: 'changeCondition',
      payload: { constraintId, parameterId, e },
    })
  }

  function handleClickAddConstraint() {
    dispatchModel({
      type: 'clickAddConstraint',
    })
  }

  function handleClickRemoveConstraint() {
    dispatchModel({
      type: 'clickRemoveConstraint',
    })
  }

  function handleChangeConfig(
    type:
      | 'enableConstraints'
      | 'showModelFile'
      | 'orderOfCombinations'
      | 'randomizeGeneration'
      | 'randomizeSeed',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchConfig({
      type,
      payload: { e },
    })
  }

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    const fixedParameters = model.parameters
      .filter((p) => p.name !== '' && p.values !== '')
      .map((p) => ({ name: p.name, values: p.values }))
    const fixedConstraints = model.constraints.map((c) => ({
      conditions: c.conditions.map((cond) => {
        const parameter = model.parameters.find(
          (p) => p.id === cond.parameterId,
        )
        if (!parameter) {
          throw new Error(
            `Parameter not found for condition: ${cond.parameterId}`,
          )
        }
        return {
          ifOrThen: cond.ifOrThen,
          predicate: cond.predicate,
          parameter: parameter.name,
        }
      }),
    }))
    const pictOptions = {
      orderOfCombinations: config.orderOfCombinations,
      randomizeGeneration: config.randomizeGeneration,
      randomizeSeed:
        config.randomizeGeneration && config.randomizeSeed !== ''
          ? config.randomizeSeed
          : undefined,
    }
    const output = config.enableConstraints
      ? pictRunner.current.run(fixedParameters, {
          constraints: fixedConstraints,
          options: pictOptions,
        })
      : pictRunner.current.run(fixedParameters, {
          options: pictOptions,
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
      output: {
        header,
        body,
        modelFile: output.modelFile,
        message: output.message,
      },
      errorMessage: output.message ?? '',
    })
  }

  return (
    <main className="bg-white">
      <ParametersArea
        parameters={model.parameters}
        messages={model.parameterErrors}
        handleChangeParameter={handleChangeParameter}
        handleClickAddRow={handleClickAddRow}
        handleClickRemoveRow={handleClickRemoveRow}
        handleClickClear={handleClickClear}
      />
      <OptionsArea config={config} handleChangeConfig={handleChangeConfig} />
      <ConstraintsArea
        config={config}
        parameters={model.parameters}
        constraints={model.constraints}
        messages={model.constraintErrors}
        handleToggleCondition={handleToggleCondition}
        handleChangeCondition={handleChangeCondition}
        handleClickAddConstraint={handleClickAddConstraint}
        handleClickRemoveConstraint={handleClickRemoveConstraint}
      />
      <RunButtonArea
        parameters={model.parameters}
        constraints={model.constraints}
        pictRunnerLoaded={pictRunnerLoaded}
        onClickRun={runPict}
      />
      <ResultArea config={config} output={result.output} />
    </main>
  )
}

export default AppMain
