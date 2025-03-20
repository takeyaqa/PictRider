export interface PictParameter {
  id: string
  name: string
  values: string
  isValid: boolean
}

export interface PictCondition {
  ifOrThen: 'if' | 'then'
  parameter: string
  predicate: string
}

export interface PictConstraint {
  id: string
  conditions: PictCondition[]
}

export interface PictOutput {
  header: string[]
  body: string[][]
}
