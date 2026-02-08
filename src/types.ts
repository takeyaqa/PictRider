export interface Parameter {
  id: string
  name: string
  values: string
  isValidName: boolean
  isValidValues: boolean
}

export interface Parameters {
  parameters: Parameter[]
  parameterErrors: Message[]
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

export interface ConstraintText {
  id: string
  text: string
}

export interface Constraints {
  constraints: Constraint[]
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  constraintErrors: Message[]
}

export interface SubModel {
  id: string
  parameterIds: string[]
  order: number
}

export interface SubModels {
  subModels: SubModel[]
}

export interface Message {
  id: string
  text: string
}

export interface Model {
  parameters: Parameter[]
  constraints: Constraint[]
  constraintTexts: ConstraintText[]
  constraintDirectEditMode: boolean
  subModels: SubModel[]
  parameterErrors: Message[]
  constraintErrors: Message[]
}

export interface Result {
  header: { id: string; name: string }[]
  body: { id: string; values: { id: string; value: string }[] }[]
  modelFile: string
  messages: Message[]
}

export interface Config {
  enableSubModels: boolean
  enableConstraints: boolean
  showModelFile: boolean
  orderOfCombinations: number | ''
  randomizeGeneration: boolean
  randomizeSeed: number | ''
}
