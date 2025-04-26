import { useState, useEffect, useRef, useReducer } from 'react'
import { PictRunner } from './pict/pict-runner'
import { Analytics } from './components'
import {
  HeaderSection,
  NotificationMessageSection,
  ParametersSection,
  OptionsSection,
  SubModelsSection,
  ConstraintsSection,
  RunButtonSection,
  ResultSection,
  FooterSection,
} from './sections'
import { Result } from './types'
import { modelReducer, getInitialModel } from './reducers/model-reducer'
import { configReducer, getInitialConfig } from './reducers/config-reducer'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [model, dispatchModel] = useReducer(modelReducer, getInitialModel())
  const [config, dispatchConfig] = useReducer(configReducer, getInitialConfig())
  const [result, setResult] = useState<Result>({
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

  function handleClickSubModelParameters(
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModel({
      type: 'clickSubModelParameters',
      payload: { id, e },
    })
  }

  function handleChangeSubModelOrder(
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatchModel({
      type: 'changeSubModelOrder',
      payload: { id, e },
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

  function handleChangeConstraintFormula(
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    dispatchModel({
      type: 'changeConstraintFormula',
      payload: { e },
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

  function handleToggleConstraintDirectEditMode() {
    dispatchModel({
      type: 'toggleConstraintDirectEditMode',
    })
  }

  function handleChangeConfig(
    type:
      | 'enableSubModels'
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
    const fixedSubModels = config.enableSubModels
      ? model.subModels.map((s) => ({
          parameterNames: s.parameterIds.map((id) => {
            const parameter = model.parameters.find((p) => p.id === id)
            if (!parameter) {
              throw new Error(`Parameter not found: ${id}`)
            }
            return parameter.name
          }),
          order: s.order,
        }))
      : undefined
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
          subModels: fixedSubModels,
          constraintsText: model.constraintTexts.map((c) => c.text).join('\n'),
          options: pictOptions,
        })
      : pictRunner.current.run(fixedParameters, {
          subModels: fixedSubModels,
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
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <main className="bg-white">
        <ParametersSection
          parameters={model.parameters}
          messages={model.parameterErrors}
          handleChangeParameter={handleChangeParameter}
          handleClickAddRow={handleClickAddRow}
          handleClickRemoveRow={handleClickRemoveRow}
          handleClickClear={handleClickClear}
        />
        <OptionsSection
          config={config}
          handleChangeConfig={handleChangeConfig}
        />
        <SubModelsSection
          config={config}
          parameters={model.parameters}
          subModels={model.subModels}
          handleClickSubModelParameters={handleClickSubModelParameters}
          handleChangeSubModelOrder={handleChangeSubModelOrder}
        />
        <ConstraintsSection
          config={config}
          parameters={model.parameters}
          constraints={model.constraints}
          constraintTexts={model.constraintTexts}
          constraintDirectEditMode={model.constraintDirectEditMode}
          messages={model.constraintErrors}
          handleToggleCondition={handleToggleCondition}
          handleChangeCondition={handleChangeCondition}
          handleChangeConstraintFormula={handleChangeConstraintFormula}
          handleClickAddConstraint={handleClickAddConstraint}
          handleClickRemoveConstraint={handleClickRemoveConstraint}
          toggleConstraintDirectEditMode={handleToggleConstraintDirectEditMode}
        />
        <RunButtonSection
          parameters={model.parameters}
          constraints={model.constraints}
          pictRunnerLoaded={pictRunnerLoaded}
          onClickRun={runPict}
        />
        <ResultSection config={config} output={result.output} />
      </main>
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App
