import type { Draft } from 'immer'
import type { Config } from '../../types'

type ConfigAction =
  | {
      type:
        | 'enableSubModels'
        | 'enableConstraints'
        | 'showModelFile'
        | 'randomizeGeneration'
      payload: { checked: boolean }
    }
  | {
      type: 'orderOfCombinations' | 'randomizeSeed'
      payload: { e: React.ChangeEvent<HTMLInputElement> }
    }

export function configReducer(
  draft: Draft<Config>,
  action: ConfigAction,
): void {
  switch (action.type) {
    case 'enableSubModels': {
      const { checked } = action.payload
      draft.enableSubModels = checked
      break
    }
    case 'enableConstraints': {
      const { checked } = action.payload
      draft.enableConstraints = checked
      break
    }
    case 'showModelFile': {
      const { checked } = action.payload
      draft.showModelFile = checked
      break
    }
    case 'orderOfCombinations': {
      const { e } = action.payload

      draft.orderOfCombinations =
        e.target.value !== '' ? Number(e.target.value) : ''
      break
    }
    case 'randomizeGeneration': {
      const { checked } = action.payload
      draft.randomizeGeneration = checked
      break
    }
    case 'randomizeSeed': {
      const { e } = action.payload
      draft.randomizeSeed = e.target.value !== '' ? Number(e.target.value) : ''
      break
    }
  }
}

export function getInitialConfig(): Config {
  return {
    enableSubModels: false,
    enableConstraints: false,
    showModelFile: false,
    orderOfCombinations: 2,
    randomizeGeneration: false,
    randomizeSeed: '',
  }
}
