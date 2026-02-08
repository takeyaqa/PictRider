import { PictRunner } from '@takeyaqa/pict-wasm'
import { useEffect, useRef, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { OptionsSection } from '../features/config'
import {
  ConstraintsSection,
  constraintsReducer,
  getInitialConstraints,
} from '../features/constraints'
import { MenuSection } from '../features/menu'
import {
  ParametersSection,
  parametersReducer,
  getInitialParameters,
} from '../features/parameters'
import { ResultSection } from '../features/result'
import {
  SubModelsSection,
  subModelsReducer,
  getInitialSubModels,
} from '../features/sub-models'
import { uuidv4 } from '../shared/helpers'
import type { Result } from '../types'

interface MainAreaProps {
  pictRunnerInjection?: PictRunner // use for testing
}

const initialParametersState = getInitialParameters()

function MainArea({ pictRunnerInjection }: MainAreaProps) {
  const [parameters, dispatchParameters] = useImmerReducer(
    parametersReducer,
    initialParametersState,
  )
  const [constraints, dispatchConstraints] = useImmerReducer(
    constraintsReducer,
    getInitialConstraints(initialParametersState.parameters),
  )
  const [subModels, dispatchSubModels] = useImmerReducer(
    subModelsReducer,
    getInitialSubModels(),
  )
  const [result, setResult] = useState<Result | null>(null)
  const resultSection = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      result !== null &&
      resultSection.current &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(width < 80rem)').matches // tailwind: xl, two columns layout
    ) {
      resultSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [result])

  // menu handlers
  const handleClearInput = () => {
    // Generate new parameter IDs once and use them for both parameters and constraints
    const newParameterIds = parameters.parameters.map(() => uuidv4())
    const emptyParameters = newParameterIds.map((id) => ({
      id,
      name: '',
      values: '',
      isValidName: true,
      isValidValues: true,
    }))
    dispatchParameters({ type: 'clear', payload: { newParameterIds } })
    dispatchConstraints({
      type: 'clear',
      payload: { parameters: emptyParameters },
    })
    dispatchSubModels({ type: 'clear' })
  }

  // Parameter handlers
  const handleChangeParameter = (
    id: string,
    field: 'name' | 'values',
    value: string,
  ) => {
    dispatchParameters({
      type: 'changeParameter',
      payload: { id, field, value },
    })
  }

  const handleAddRow = (id: string, target: 'above' | 'below') => {
    const newParameterId = uuidv4()
    dispatchParameters({
      type: 'addRow',
      payload: { id, target, newParameterId },
    })
    dispatchConstraints({
      type: 'addCondition',
      payload: { id, target, newParameterId },
    })
  }

  const handleRemoveRow = (id: string) => {
    dispatchParameters({ type: 'removeRow', payload: { id } })
    dispatchConstraints({
      type: 'removeCondition',
      payload: { parameterId: id },
    })
    dispatchSubModels({
      type: 'removeParameter',
      payload: { parameterId: id },
    })
  }

  // Constraint handlers
  const handleToggleCondition = (constraintId: string, parameterId: string) => {
    dispatchConstraints({
      type: 'toggleCondition',
      payload: {
        constraintId,
        parameterId,
        parameters: parameters.parameters,
      },
    })
  }

  const handleChangeCondition = (
    constraintId: string,
    parameterId: string,
    value: string,
  ) => {
    dispatchConstraints({
      type: 'changeCondition',
      payload: {
        constraintId,
        parameterId,
        value,
        parameters: parameters.parameters,
      },
    })
  }

  const handleAddConstraint = () => {
    dispatchConstraints({
      type: 'addConstraint',
      payload: { parameters: parameters.parameters },
    })
  }

  const handleRemoveConstraint = () => {
    dispatchConstraints({ type: 'removeConstraint' })
  }

  const handleToggleConstraintDirectEditMode = () => {
    dispatchConstraints({ type: 'toggleConstraintDirectEditMode' })
  }

  const handleChangeConstraintFormula = (value: string) => {
    dispatchConstraints({
      type: 'changeConstraintFormula',
      payload: { value },
    })
  }

  const handleResetConstraints = () => {
    dispatchConstraints({
      type: 'resetConstraints',
      payload: { parameters: parameters.parameters },
    })
  }

  // SubModel handlers
  const handleClickSubModelParameters = (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => {
    dispatchSubModels({
      type: 'clickSubModelParameters',
      payload: { subModelId, parameterId, checked },
    })
  }

  const handleChangeSubModelOrder = (id: string, order: number) => {
    dispatchSubModels({
      type: 'changeSubModelOrder',
      payload: { id, order },
    })
  }

  const handleAddSubModel = () => {
    dispatchSubModels({ type: 'addSubModel' })
  }

  const handleRemoveSubModel = () => {
    dispatchSubModels({ type: 'removeSubModel' })
  }

  // Update constraint texts when parameters change
  useEffect(() => {
    dispatchConstraints({
      type: 'updateConstraintTexts',
      payload: { parameters: parameters.parameters },
    })
  }, [dispatchConstraints, parameters.parameters])

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2">
      <div>
        <MenuSection
          pictRunnerInjection={pictRunnerInjection}
          canClearResult={result !== null}
          parameters={parameters}
          constraints={constraints}
          subModels={subModels}
          onClearInput={handleClearInput}
          onClearResult={() => {
            setResult(null)
          }}
          setResult={setResult}
        />
        <ParametersSection
          parameters={parameters}
          onChangeParameter={handleChangeParameter}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
        />
        <ConstraintsSection
          constraints={constraints}
          parameters={parameters.parameters}
          onToggleCondition={handleToggleCondition}
          onChangeConstraintFormula={handleChangeConstraintFormula}
          onAddConstraint={handleAddConstraint}
          onRemoveConstraint={handleRemoveConstraint}
          onToggleConstraintDirectEditMode={
            handleToggleConstraintDirectEditMode
          }
          onChangeCondition={handleChangeCondition}
          onResetConstraints={handleResetConstraints}
        />
        <SubModelsSection
          subModels={subModels}
          parameters={parameters.parameters}
          onClickSubModelParameters={handleClickSubModelParameters}
          onChangeSubModelOrder={handleChangeSubModelOrder}
          onAddSubModel={handleAddSubModel}
          onRemoveSubModel={handleRemoveSubModel}
        />
        <OptionsSection />
      </div>
      <div ref={resultSection}>
        <ResultSection result={result} />
      </div>
    </main>
  )
}

export default MainArea
