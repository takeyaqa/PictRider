import { Config } from '../types'

interface ConfigAction {
  type:
    | 'enableSubModels'
    | 'enableConstraints'
    | 'showModelFile'
    | 'orderOfCombinations'
    | 'randomizeGeneration'
    | 'randomizeSeed'
  payload: { e: React.ChangeEvent<HTMLInputElement> }
}

export function configReducer(state: Config, action: ConfigAction): Config {
  switch (action.type) {
    case 'enableSubModels': {
      return {
        ...state,
        enableSubModels: !state.enableSubModels,
      }
    }
    case 'enableConstraints': {
      return {
        ...state,
        enableConstraints: !state.enableConstraints,
      }
    }
    case 'showModelFile': {
      return {
        ...state,
        showModelFile: !state.showModelFile,
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
      return {
        ...state,
        randomizeGeneration: !state.randomizeGeneration,
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
