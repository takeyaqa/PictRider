import { useEffect, useRef, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { OptionsSection } from '../features/config'
import { MenuSection } from '../features/menu'
import {
  ConstraintsSection,
  ParametersSection,
  SubModelsSection,
  getInitialModel,
  modelReducer,
} from '../features/model'
import { ResultSection } from '../features/result'
import type { Result } from '../types'

function MainArea() {
  const [model, dispatch] = useImmerReducer(modelReducer, getInitialModel())
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
    dispatch({ type: 'clear' })
  }

  // Parameter handlers
  const handleChangeParameter = (
    id: string,
    field: 'name' | 'values',
    value: string,
  ) => {
    dispatch({
      type: 'changeParameter',
      payload: { id, field, value },
    })
  }

  const handleAddRow = (id: string, target: 'above' | 'below') => {
    dispatch({
      type: 'addParameterRow',
      payload: { id, target },
    })
  }

  const handleRemoveRow = (id: string) => {
    dispatch({ type: 'removeParameterRow', payload: { id } })
  }

  // Constraint handlers
  const handleToggleCondition = (constraintId: string, parameterId: string) => {
    dispatch({
      type: 'toggleCondition',
      payload: {
        constraintId,
        parameterId,
      },
    })
  }

  const handleChangeCondition = (
    constraintId: string,
    parameterId: string,
    value: string,
  ) => {
    dispatch({
      type: 'changeCondition',
      payload: {
        constraintId,
        parameterId,
        value,
      },
    })
  }

  const handleAddConstraint = () => {
    dispatch({
      type: 'addConstraint',
    })
  }

  const handleRemoveConstraint = () => {
    dispatch({ type: 'removeConstraint' })
  }

  const handleToggleConstraintDirectEditMode = () => {
    dispatch({ type: 'toggleConstraintDirectEditMode' })
  }

  const handleChangeConstraintFormula = (value: string) => {
    dispatch({
      type: 'changeConstraintFormula',
      payload: { value },
    })
  }

  const handleResetConstraints = () => {
    dispatch({
      type: 'resetConstraints',
    })
  }

  // SubModel handlers
  const handleClickSubModelParameters = (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => {
    dispatch({
      type: 'clickSubModelParameters',
      payload: { subModelId, parameterId, checked },
    })
  }

  const handleChangeSubModelOrder = (id: string, order: number) => {
    dispatch({
      type: 'changeSubModelOrder',
      payload: { id, order },
    })
  }

  const handleAddSubModel = () => {
    dispatch({ type: 'addSubModel' })
  }

  const handleRemoveSubModel = () => {
    dispatch({ type: 'removeSubModel' })
  }

  // Update constraint texts when parameters change
  useEffect(() => {
    dispatch({
      type: 'updateConstraintTexts',
    })
  }, [dispatch, model.parameters])

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2">
      <div>
        <MenuSection
          canClearResult={result !== null}
          parameters={{
            parameters: model.parameters,
            parameterErrors: model.parameterErrors,
          }}
          constraints={{
            constraints: model.constraints,
            constraintErrors: model.constraintErrors,
            constraintDirectEditMode: model.constraintDirectEditMode,
            constraintTexts: model.constraintTexts,
          }}
          subModels={{ subModels: model.subModels }}
          onClearInput={handleClearInput}
          onClearResult={() => {
            setResult(null)
          }}
          setResult={setResult}
        />
        <ParametersSection
          parameters={{
            parameters: model.parameters,
            parameterErrors: model.parameterErrors,
          }}
          onChangeParameter={handleChangeParameter}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
        />
        <ConstraintsSection
          constraints={{
            constraints: model.constraints,
            constraintErrors: model.constraintErrors,
            constraintDirectEditMode: model.constraintDirectEditMode,
            constraintTexts: model.constraintTexts,
          }}
          parameters={model.parameters}
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
          subModels={{ subModels: model.subModels }}
          parameters={model.parameters}
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
