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
import { ConfigProvider } from './features/config'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [model, dispatchModel] = useReducer(modelReducer, getInitialModel())
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

  function handleClickResetConstraints() {
    dispatchModel({
      type: 'clickResetConstraints',
    })
  }

  function handleClickAddSubModel() {
    dispatchModel({
      type: 'clickAddSubModel',
    })
  }

  function handleClickRemoveSubModel() {
    dispatchModel({
      type: 'clickRemoveSubModel',
    })
  }

  const containsInvalidValues = model.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = model.constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )

  return (
    <ConfigProvider>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <main className="grid grid-cols-1 2xl:grid-cols-2">
        <div>
          <MenuSection
            containsInvalidValues={
              containsInvalidValues || containsInvalidConstraints
            }
            pictRunnerLoaded={pictRunnerLoaded}
            canClearResult={result !== null}
            pictRunner={pictRunner}
            model={model}
            handleClickClear={handleClickClear}
            handleClearResult={() => {
              setResult(null)
            }}
            setResult={setResult}
          />
          <ParametersSection
            parameters={model.parameters}
            messages={model.parameterErrors}
            handleChangeParameter={handleChangeParameter}
            handleClickAddRow={handleClickAddRow}
            handleClickRemoveRow={handleClickRemoveRow}
          />
          <ConstraintsSection
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
            toggleConstraintDirectEditMode={
              handleToggleConstraintDirectEditMode
            }
            handleClickResetConstraints={handleClickResetConstraints}
          />
          <SubModelsSection
            parameters={model.parameters}
            subModels={model.subModels}
            handleClickSubModelParameters={handleClickSubModelParameters}
            handleChangeSubModelOrder={handleChangeSubModelOrder}
            handleClickAddSubModel={handleClickAddSubModel}
            handleClickRemoveSubModel={handleClickRemoveSubModel}
          />
          <OptionsSection />
        </div>
        <div ref={resultSection}>
          <ResultSection result={result} />
        </div>
      </main>
      <FooterSection />
      <Analytics />
    </ConfigProvider>
  )
}

export default App
