export interface Parameter {
  id: string
  name: string
  values: string
  isValidName: boolean
  isValidValues: boolean
}

export interface SubModel {
  id: string
  parameterIds: string[]
  order: number
}

export interface Condition {
  ifOrThen: 'if' | 'then'
  predicate: string
  parameterId: string
  isValid: boolean
}

export interface FixedCondition {
  ifOrThen: 'if' | 'then'
  predicate: string
  parameterName: string
}

export interface Constraint {
  id: string
  conditions: Condition[]
}

export interface FixedConstraint {
  conditions: FixedCondition[]
}

export interface Model {
  parameters: Parameter[]
  constraints: Constraint[]
  subModels: SubModel[]
  parameterErrors: string[]
  constraintErrors: string[]
}

export interface Output {
  header: { id: number; name: string }[]
  body: { id: number; values: { id: number; value: string }[] }[]
  modelFile: string
  message?: string
}

export interface Result {
  output: Output | null
  errorMessage: string
}

export interface Config {
  enableSubModels: boolean
  enableConstraints: boolean
  showModelFile: boolean
  orderOfCombinations: number
  randomizeGeneration: boolean
  randomizeSeed: number | ''
}
