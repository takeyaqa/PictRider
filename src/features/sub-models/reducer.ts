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
  state: SubModels,
  action: SubModelsAction,
): SubModels {
  switch (action.type) {
    case 'clickSubModelParameters': {
      const { subModelId, parameterId, checked } = action.payload
      const newSubModels = structuredClone(state.subModels)
      const target = newSubModels.find((m) => m.id === subModelId)
      if (!target) {
        // may not be reached
        return structuredClone(state)
      }
      if (checked) {
        const newParameterIds = [...target.parameterIds, parameterId]
        return {
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      } else {
        const newParameterIds = target.parameterIds.filter(
          (paramId) => paramId !== parameterId,
        )
        return {
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      }
    }

    case 'changeSubModelOrder': {
      const { id, order } = action.payload
      const newSubModels = structuredClone(state.subModels)
      const target = newSubModels.find((m) => m.id === id)
      if (!target) {
        // may not be reached
        return structuredClone(state)
      }
      return {
        subModels: newSubModels.map((m) =>
          m.id === id ? { ...m, order: order } : m,
        ),
      }
    }

    case 'addSubModel': {
      if (state.subModels.length >= 2) {
        // may not be reached
        return structuredClone(state)
      }
      return {
        subModels: [
          ...structuredClone(state.subModels),
          {
            id: uuidv4(),
            parameterIds: [],
            order: 2,
          },
        ],
      }
    }

    case 'removeSubModel': {
      if (state.subModels.length <= 1) {
        // may not be reached
        return structuredClone(state)
      }
      const newSubModels = structuredClone(state.subModels)
      newSubModels.pop()
      return {
        subModels: newSubModels,
      }
    }

    case 'removeParameter': {
      const { parameterId } = action.payload
      const newSubModels = state.subModels.map((subModel) => {
        return {
          ...subModel,
          parameterIds: subModel.parameterIds.filter((i) => i !== parameterId),
        }
      })
      return {
        subModels: newSubModels,
      }
    }

    case 'clear': {
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
