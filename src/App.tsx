import { useState, useEffect, useRef, useReducer } from 'react'
import { PictRunner } from '@takeyaqa/pict-browser'
import { Analytics } from './components'
import {
  HeaderSection,
  NotificationMessageSection,
  ParametersSection,
  OptionsSection,
  SubModelsSection,
  ConstraintsSection,
  ResultSection,
  FooterSection,
  MenuSection,
} from './sections'
import { Result } from './types'
import { modelReducer, getInitialModel } from './reducers/model-reducer'
import { configReducer, getInitialConfig } from './reducers/config-reducer'
import { uuidv4 } from './helpers'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [model, dispatchModel] = useReducer(modelReducer, getInitialModel())
  const [config, dispatchConfig] = useReducer(configReducer, getInitialConfig())
  const [result, setResult] = useState<Result | null>(null)
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)
  const resultSection = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (
      result !== null &&
      resultSection.current &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(width < 96rem)').matches // tailwind: 2xl, two columns layout
    ) {
      resultSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [result])

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

  function handleClickAddRow(id: string, target: 'above' | 'below') {
    dispatchModel({
      type: 'clickAddRow',
      payload: { id, target },
    })
  }

  function handleClickRemoveRow(id: string) {
    dispatchModel({
      type: 'clickRemoveRow',
      payload: { id },
    })
  }

  function handleClickClear() {
    dispatchModel({
      type: 'clickClear',
    })
  }

  function handleClickSubModelParameters(
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) {
    dispatchModel({
      type: 'clickSubModelParameters',
      payload: { subModelId, parameterId, checked },
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

  function handleChangeConfigCheckbox(
    type:
      | 'enableSubModels'
      | 'enableConstraints'
      | 'showModelFile'
      | 'randomizeGeneration',
    checked: boolean,
  ) {
    dispatchConfig({
      type,
      payload: { checked },
    })
  }

  function handleChangeConfigInput(
    type: 'orderOfCombinations' | 'randomizeSeed',
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
      ? model.subModels
          .filter((sm) => sm.parameterIds.length > 0)
          .map((s) => ({
            parameterNames: s.parameterIds.map((id) => {
              const parameter = model.parameters.find((p) => p.id === id)
              if (!parameter) {
                throw new Error(`Parameter not found: ${id}`)
              }
              return parameter.name
            }),
            order: s.order,
          }))
      : []
    const pictOptions = {
      orderOfCombinations:
        config.orderOfCombinations !== '' ? config.orderOfCombinations : 2,
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
    const messages = output.message
      ? output.message.split('\n').map((m) => ({
          id: uuidv4(),
          text: m,
        }))
      : []
    setResult({
      header,
      body,
      modelFile: output.modelFile,
      messages: messages,
    })
  }

  const containsInvalidValues = model.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = model.constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )

  return (
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <main className="grid grid-cols-1 bg-white 2xl:grid-cols-2">
        <div>
          <MenuSection
            containsInvalidValues={
              containsInvalidValues || containsInvalidConstraints
            }
            pictRunnerLoaded={pictRunnerLoaded}
            canClearResult={result !== null}
            handleClickRun={runPict}
            handleClickClear={handleClickClear}
            handleClearResult={() => {
              setResult(null)
            }}
          />
          <ParametersSection
            parameters={model.parameters}
            messages={model.parameterErrors}
            handleChangeParameter={handleChangeParameter}
            handleClickAddRow={handleClickAddRow}
            handleClickRemoveRow={handleClickRemoveRow}
          />
          <ConstraintsSection
            config={config}
            parameters={model.parameters}
            constraints={model.constraints}
            constraintTexts={model.constraintTexts}
            constraintDirectEditMode={model.constraintDirectEditMode}
            messages={model.constraintErrors}
            handleChangeConfigCheckbox={handleChangeConfigCheckbox}
            handleToggleCondition={handleToggleCondition}
            handleChangeCondition={handleChangeCondition}
            handleChangeConstraintFormula={handleChangeConstraintFormula}
            handleClickAddConstraint={handleClickAddConstraint}
            handleClickRemoveConstraint={handleClickRemoveConstraint}
            toggleConstraintDirectEditMode={
              handleToggleConstraintDirectEditMode
            }
          />
          <SubModelsSection
            config={config}
            parameters={model.parameters}
            subModels={model.subModels}
            handleChangeConfigCheckbox={handleChangeConfigCheckbox}
            handleClickSubModelParameters={handleClickSubModelParameters}
            handleChangeSubModelOrder={handleChangeSubModelOrder}
          />
          <OptionsSection
            config={config}
            handleChangeConfigCheckbox={handleChangeConfigCheckbox}
            handleChangeConfigInput={handleChangeConfigInput}
          />
        </div>
        <div ref={resultSection}>
          <ResultSection config={config} result={result} />
        </div>
      </main>
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App
