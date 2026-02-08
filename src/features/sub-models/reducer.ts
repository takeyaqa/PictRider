import type { Draft } from 'immer'
import { uuidv4 } from '../../shared/helpers'
import type { SubModels } from '../../types'

export type SubModelsAction =
  | {
      type: 'clickSubModelParameters'
      payload: {
        subModelId: string
        parameterId: string
        checked: boolean
      }
    }
  | {
      type: 'changeSubModelOrder'
      payload: {
        id: string
        order: number
      }
    }
  | {
      type: 'addSubModel'
    }
  | {
      type: 'removeSubModel'
    }
  | {
      type: 'removeParameter'
      payload: {
        parameterId: string
      }
    }
  | {
      type: 'clear'
    }

export function subModelsReducer(
  draft: Draft<SubModels>,
  action: SubModelsAction,
): void {
  switch (action.type) {
    case 'clickSubModelParameters': {
      const { subModelId, parameterId, checked } = action.payload
      const target = draft.subModels.find((m) => m.id === subModelId)
      if (!target) {
        // may not be reached
        break
      }
      if (checked) {
        const newParameterIds = [...target.parameterIds, parameterId]

        draft.subModels = draft.subModels.map((m) =>
          m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
        )
        break
      } else {
        const newParameterIds = target.parameterIds.filter(
          (paramId) => paramId !== parameterId,
        )
        draft.subModels = draft.subModels.map((m) =>
          m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
        )
        break
      }
    }

    case 'changeSubModelOrder': {
      const { id, order } = action.payload
      const target = draft.subModels.find((m) => m.id === id)
      if (!target) {
        // may not be reached
        break
      }
      draft.subModels = draft.subModels.map((m) =>
        m.id === id ? { ...m, order: order } : m,
      )
      break
    }

    case 'addSubModel': {
      if (draft.subModels.length >= 2) {
        // may not be reached
        break
      }
      draft.subModels.push({
        id: uuidv4(),
        parameterIds: [],
        order: 2,
      })
      break
    }

    case 'removeSubModel': {
      if (draft.subModels.length <= 1) {
        // may not be reached
        break
      }
      draft.subModels.pop()
      break
    }

    case 'removeParameter': {
      const { parameterId } = action.payload
      const newSubModels = draft.subModels.map((subModel) => {
        return {
          ...subModel,
          parameterIds: subModel.parameterIds.filter((i) => i !== parameterId),
        }
      })
      draft.subModels = newSubModels
      break
    }

    case 'clear': {
      draft.subModels = [
        {
          id: uuidv4(),
          parameterIds: [],
          order: 2,
        },
      ]
      break
    }
  }
}

export function getInitialSubModels(): SubModels {
  return {
    subModels: [
      {
        id: uuidv4(),
        parameterIds: [],
        order: 2,
      },
    ],
  }
}
