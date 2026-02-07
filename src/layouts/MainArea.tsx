import { PictRunner } from '@takeyaqa/pict-wasm'
import { useEffect, useReducer, useRef, useState, useCallback } from 'react'
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
  const [parameters, dispatchParameters] = useReducer(
    parametersReducer,
    initialParametersState,
  )
  const [constraints, dispatchConstraints] = useReducer(
    constraintsReducer,
    getInitialConstraints(initialParametersState.parameters),
  )
  const [subModels, dispatchSubModels] = useReducer(
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
  const handleClearInput = useCallback(() => {
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
  }, [parameters.parameters])

  // Parameter handlers
  const handleChangeParameter = useCallback(
    (id: string, field: 'name' | 'values', value: string) => {
      dispatchParameters({
        type: 'changeParameter',
        payload: { id, field, value },
      })
    },
    [],
  )

  const handleAddRow = useCallback((id: string, target: 'above' | 'below') => {
    const newParameterId = uuidv4()
    dispatchParameters({
      type: 'addRow',
      payload: { id, target, newParameterId },
    })
    dispatchConstraints({
      type: 'addCondition',
      payload: { id, target, newParameterId },
    })
  }, [])

  const handleRemoveRow = useCallback((id: string) => {
    dispatchParameters({ type: 'removeRow', payload: { id } })
    dispatchConstraints({
      type: 'removeCondition',
      payload: { parameterId: id },
    })
    dispatchSubModels({
      type: 'removeParameter',
      payload: { parameterId: id },
    })
  }, [])

  // Constraint handlers
  const handleToggleCondition = useCallback(
    (constraintId: string, parameterId: string) => {
      dispatchConstraints({
        type: 'toggleCondition',
        payload: {
          constraintId,
          parameterId,
          parameters: parameters.parameters,
        },
      })
    },
    [parameters.parameters],
  )

  const handleChangeCondition = useCallback(
    (constraintId: string, parameterId: string, value: string) => {
      dispatchConstraints({
        type: 'changeCondition',
        payload: {
          constraintId,
          parameterId,
          value,
          parameters: parameters.parameters,
        },
      })
    },
    [parameters.parameters],
  )

  const handleAddConstraint = useCallback(() => {
    dispatchConstraints({
      type: 'addConstraint',
      payload: { parameters: parameters.parameters },
    })
  }, [parameters.parameters])

  const handleRemoveConstraint = useCallback(() => {
    dispatchConstraints({ type: 'removeConstraint' })
  }, [])

  const handleToggleConstraintDirectEditMode = useCallback(() => {
    dispatchConstraints({ type: 'toggleConstraintDirectEditMode' })
  }, [])

  const handleChangeConstraintFormula = useCallback((value: string) => {
    dispatchConstraints({
      type: 'changeConstraintFormula',
      payload: { value },
    })
  }, [])

  const handleResetConstraints = useCallback(() => {
    dispatchConstraints({
      type: 'resetConstraints',
      payload: { parameters: parameters.parameters },
    })
  }, [parameters.parameters])

  // SubModel handlers
  const handleClickSubModelParameters = useCallback(
    (subModelId: string, parameterId: string, checked: boolean) => {
      dispatchSubModels({
        type: 'clickSubModelParameters',
        payload: { subModelId, parameterId, checked },
      })
    },
    [],
  )

  const handleChangeSubModelOrder = useCallback((id: string, order: number) => {
    dispatchSubModels({
      type: 'changeSubModelOrder',
      payload: { id, order },
    })
  }, [])

  const handleAddSubModel = useCallback(() => {
    dispatchSubModels({ type: 'addSubModel' })
  }, [])

  const handleRemoveSubModel = useCallback(() => {
    dispatchSubModels({ type: 'removeSubModel' })
  }, [])

  // Update constraint texts when parameters change
  useEffect(() => {
    dispatchConstraints({
      type: 'updateConstraintTexts',
      payload: { parameters: parameters.parameters },
    })
  }, [parameters.parameters])

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
