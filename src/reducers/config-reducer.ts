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
      let orderOfCombinations = state.orderOfCombinations
      try {
        if (e.target.value !== '') {
          orderOfCombinations = Number(e.target.value)
        }
      } catch {
        orderOfCombinations = 2
      }
      return {
        ...state,
        orderOfCombinations,
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
      let randomizeSeed = state.randomizeSeed
      if (e.target.value !== '') {
        randomizeSeed = Number(e.target.value)
      } else {
        randomizeSeed = ''
      }
      return {
        ...state,
        randomizeSeed,
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
