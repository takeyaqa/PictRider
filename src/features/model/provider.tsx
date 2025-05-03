import { useCallback, useMemo, useReducer } from 'react'
import ModelContext from './context'
import { getInitialModel, modelReducer } from './reducer'

function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, dispatch] = useReducer(modelReducer, getInitialModel())

  const handleChangeParameter = useCallback(
    (
      id: string,
      field: 'name' | 'values',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch({
        type: 'changeParameter',
        payload: { id, field, e },
      })
    },
    [dispatch],
  )

  const handleClickAddRow = useCallback(
    (id: string, target: 'above' | 'below') => {
      dispatch({
        type: 'clickAddRow',
        payload: { id, target },
      })
    },
    [dispatch],
  )

  const handleClickRemoveRow = useCallback(
    (id: string) => {
      dispatch({
        type: 'clickRemoveRow',
        payload: { id },
      })
    },
    [dispatch],
  )

  const handleClickClear = useCallback(() => {
    dispatch({
      type: 'clickClear',
    })
  }, [dispatch])

  const handleClickSubModelParameters = useCallback(
    (subModelId: string, parameterId: string, checked: boolean) => {
      dispatch({
        type: 'clickSubModelParameters',
        payload: { subModelId, parameterId, checked },
      })
    },
    [dispatch],
  )

  const handleChangeSubModelOrder = useCallback(
    (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'changeSubModelOrder',
        payload: { id, e },
      })
    },
    [dispatch],
  )

  const handleToggleCondition = useCallback(
    (constraintId: string, parameterId: string) => {
      dispatch({
        type: 'toggleCondition',
        payload: { constraintId, parameterId },
      })
    },
    [dispatch],
  )

  const handleChangeCondition = useCallback(
    (
      constraintId: string,
      parameterId: string,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch({
        type: 'changeCondition',
        payload: { constraintId, parameterId, e },
      })
    },
    [dispatch],
  )

  const handleChangeConstraintFormula = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({
        type: 'changeConstraintFormula',
        payload: { e },
      })
    },
    [dispatch],
  )

  const handleClickAddConstraint = useCallback(() => {
    dispatch({
      type: 'clickAddConstraint',
    })
  }, [dispatch])

  const handleClickRemoveConstraint = useCallback(() => {
    dispatch({
      type: 'clickRemoveConstraint',
    })
  }, [dispatch])

  const handleToggleConstraintDirectEditMode = useCallback(() => {
    dispatch({
      type: 'toggleConstraintDirectEditMode',
    })
  }, [dispatch])

  const handleClickResetConstraints = useCallback(() => {
    dispatch({
      type: 'clickResetConstraints',
    })
  }, [dispatch])

  const handleClickAddSubModel = useCallback(() => {
    dispatch({
      type: 'clickAddSubModel',
    })
  }, [dispatch])

  const handleClickRemoveSubModel = useCallback(() => {
    dispatch({
      type: 'clickRemoveSubModel',
    })
  }, [dispatch])

  const value = useMemo(
    () => ({
      model,
      handlers: {
        handleChangeParameter,
        handleClickAddRow,
        handleClickRemoveRow,
        handleClickClear,
        handleClickSubModelParameters,
        handleChangeSubModelOrder,
        handleToggleCondition,
        handleChangeCondition,
        handleChangeConstraintFormula,
        handleClickAddConstraint,
        handleClickRemoveConstraint,
        handleToggleConstraintDirectEditMode,
        handleClickResetConstraints,
        handleClickAddSubModel,
        handleClickRemoveSubModel,
      },
    }),
    [
      model,
      handleChangeParameter,
      handleClickAddRow,
      handleClickRemoveRow,
      handleClickClear,
      handleClickSubModelParameters,
      handleChangeSubModelOrder,
      handleToggleCondition,
      handleChangeCondition,
      handleChangeConstraintFormula,
      handleClickAddConstraint,
      handleClickRemoveConstraint,
      handleToggleConstraintDirectEditMode,
      handleClickResetConstraints,
      handleClickAddSubModel,
      handleClickRemoveSubModel,
    ],
  )

  return <ModelContext value={value}>{children}</ModelContext>
}

export default ModelProvider
