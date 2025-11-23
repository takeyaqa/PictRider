import { createContext } from 'react'
import type { Model } from '../../types'

interface ModelContextType {
  model: Model
  handlers: {
    handleClickClear: () => void
    handleChangeParameter: (
      id: string,
      field: 'name' | 'values',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void
    handleClickAddRow: (id: string, target: 'above' | 'below') => void
    handleClickRemoveRow: (id: string) => void
    handleToggleCondition: (constraintId: string, parameterId: string) => void
    handleChangeCondition: (
      constraintId: string,
      parameterId: string,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void
    handleChangeConstraintFormula: (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => void
    handleClickAddConstraint: () => void
    handleClickRemoveConstraint: () => void
    handleToggleConstraintDirectEditMode: () => void
    handleClickResetConstraints: () => void
    handleClickSubModelParameters: (
      subModelId: string,
      parameterId: string,
      checked: boolean,
    ) => void
    handleChangeSubModelOrder: (
      id: string,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void
    handleClickAddSubModel: () => void
    handleClickRemoveSubModel: () => void
  }
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export default ModelContext
