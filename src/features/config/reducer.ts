import { Config } from '../../types'

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

export function configReducer(state: Config, action: ConfigAction): Config {
  switch (action.type) {
    case 'enableSubModels': {
      const { checked } = action.payload
      return {
        ...state,
        enableSubModels: checked,
      }
    }
    case 'enableConstraints': {
      const { checked } = action.payload
      return {
        ...state,
        enableConstraints: checked,
      }
    }
    case 'showModelFile': {
      const { checked } = action.payload
      return {
        ...state,
        showModelFile: checked,
      }
    }
    case 'orderOfCombinations': {
      const { e } = action.payload
      return {
        ...state,
        orderOfCombinations:
          e.target.value !== '' ? Number(e.target.value) : '',
      }
    }
    case 'randomizeGeneration': {
      const { checked } = action.payload
      return {
        ...state,
        randomizeGeneration: checked,
      }
    }
    case 'randomizeSeed': {
      const { e } = action.payload
      return {
        ...state,
        randomizeSeed: e.target.value !== '' ? Number(e.target.value) : '',
      }
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
