import { PictConfig } from '../types'

interface ConfigAction {
  type:
    | 'enableConstraints'
    | 'showModelFile'
    | 'orderOfCombinations'
    | 'randomizeGeneration'
    | 'randomizeSeed'
  payload: { e: React.ChangeEvent<HTMLInputElement> }
}

export function configReducer(
  state: PictConfig,
  action: ConfigAction,
): PictConfig {
  const newConfig = { ...state }
  switch (action.type) {
    case 'enableConstraints': {
      newConfig.enableConstraints = !newConfig.enableConstraints
      return newConfig
    }
    case 'showModelFile': {
      newConfig.showModelFile = !newConfig.showModelFile
      return newConfig
    }
    case 'orderOfCombinations': {
      const { e } = action.payload
      try {
        if (e.target.value !== '') {
          newConfig.orderOfCombinations = Number(e.target.value)
        }
      } catch {
        newConfig.orderOfCombinations = 2
      }
      return newConfig
    }
    case 'randomizeGeneration': {
      newConfig.randomizeGeneration = !newConfig.randomizeGeneration
      return newConfig
    }
    case 'randomizeSeed': {
      const { e } = action.payload
      if (e.target.value !== '') {
        newConfig.randomizeSeed = Number(e.target.value)
      } else {
        newConfig.randomizeSeed = ''
      }
      return newConfig
    }
  }
}

export function getInitialConfig(): PictConfig {
  return {
    enableConstraints: false,
    showModelFile: false,
    orderOfCombinations: 2,
    randomizeGeneration: false,
    randomizeSeed: '',
  }
}
