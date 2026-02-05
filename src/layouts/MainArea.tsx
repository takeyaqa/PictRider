import { PictRunner } from '@takeyaqa/pict-wasm'
import { useEffect, useReducer, useRef, useState, useCallback } from 'react'
import TopPanel from './TopPanel'
import BottomPanel from './BottomPanel'
import {
  constraintsReducer,
  getInitialConstraints,
} from '../features/constraints'
import { parametersReducer, getInitialParameters } from '../features/parameters'
import { subModelsReducer, getInitialSubModels } from '../features/sub-models'
import { uuidv4 } from '../shared/helpers'
import type { Result } from '../types'

interface MainAreaProps {
  pictRunnerInjection?: PictRunner // use for testing
}

const initialParametersState = getInitialParameters()

function MainArea({ pictRunnerInjection }: MainAreaProps) {
  const [parametersState, dispatchParameters] = useReducer(
    parametersReducer,
    initialParametersState,
  )
  const [constraintsState, dispatchConstraints] = useReducer(
    constraintsReducer,
    getInitialConstraints(initialParametersState.parameters),
  )
  const [subModelsState, dispatchSubModels] = useReducer(
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

  const handleClear = useCallback(() => {
    // Generate new parameter IDs once and use them for both parameters and constraints
    const newParameterIds = parametersState.parameters.map(() => uuidv4())
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
  }, [parametersState.parameters])

  // Constraint handlers
  const handleAddConstraint = useCallback(() => {
    dispatchConstraints({
      type: 'addConstraint',
      payload: { parameters: parametersState.parameters },
    })
  }, [parametersState.parameters])

  const handleRemoveConstraint = useCallback(() => {
    dispatchConstraints({ type: 'removeConstraint' })
  }, [])

  const handleChangeCondition = useCallback(
    (constraintId: string, parameterId: string, value: string) => {
      dispatchConstraints({
        type: 'changeCondition',
        payload: {
          constraintId,
          parameterId,
          value,
          parameters: parametersState.parameters,
        },
      })
    },
    [parametersState.parameters],
  )

  const handleToggleCondition = useCallback(
    (constraintId: string, parameterId: string) => {
      dispatchConstraints({
        type: 'toggleCondition',
        payload: {
          constraintId,
          parameterId,
          parameters: parametersState.parameters,
        },
      })
    },
    [parametersState.parameters],
  )

  const handleChangeConstraintFormula = useCallback((value: string) => {
    dispatchConstraints({
      type: 'changeConstraintFormula',
      payload: { value },
    })
  }, [])

  const handleToggleConstraintDirectEditMode = useCallback(() => {
    dispatchConstraints({ type: 'toggleConstraintDirectEditMode' })
  }, [])

  const handleResetConstraints = useCallback(() => {
    dispatchConstraints({
      type: 'resetConstraints',
      payload: { parameters: parametersState.parameters },
    })
  }, [parametersState.parameters])

  // SubModel handlers
  const handleAddSubModel = useCallback(() => {
    dispatchSubModels({ type: 'addSubModel' })
  }, [])

  const handleRemoveSubModel = useCallback(() => {
    dispatchSubModels({ type: 'removeSubModel' })
  }, [])

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

  // Update constraint texts when parameters change
  useEffect(() => {
    dispatchConstraints({
      type: 'updateConstraintTexts',
      payload: { parameters: parametersState.parameters },
    })
  }, [parametersState.parameters])

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2">
      <TopPanel
        pictRunnerInjection={pictRunnerInjection}
        result={result}
        setResult={setResult}
        parameters={parametersState}
        constraints={constraintsState}
        subModels={subModelsState}
        handleAddRow={handleAddRow}
        handleRemoveRow={handleRemoveRow}
        handleClear={handleClear}
        handleChangeParameter={handleChangeParameter}
        handleAddConstraint={handleAddConstraint}
        handleRemoveConstraint={handleRemoveConstraint}
        handleChangeCondition={handleChangeCondition}
        handleToggleCondition={handleToggleCondition}
        handleChangeConstraintFormula={handleChangeConstraintFormula}
        handleToggleConstraintDirectEditMode={
          handleToggleConstraintDirectEditMode
        }
        handleResetConstraints={handleResetConstraints}
        handleAddSubModel={handleAddSubModel}
        handleRemoveSubModel={handleRemoveSubModel}
        handleClickSubModelParameters={handleClickSubModelParameters}
        handleChangeSubModelOrder={handleChangeSubModelOrder}
      />
      <BottomPanel result={result} resultSection={resultSection} />
    </main>
  )
}

export default MainArea
