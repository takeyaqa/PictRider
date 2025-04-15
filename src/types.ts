export interface PictParameter {
  id: string
  name: string
  values: string
  isValidName: boolean
  isValidValues: boolean
}

export interface PictCondition {
  ifOrThen: 'if' | 'then'
  predicate: string
  parameterRef: PictParameter
  isValid: boolean
}

export interface PictConstraint {
  id: string
  conditions: PictCondition[]
}

export interface PictOutput {
  header: { id: number; name: string }[]
  body: { id: number; values: { id: number; value: string }[] }[]
}

export interface PictConfig {
  enableConstraints: boolean
  orderOfCombinations: number
}
