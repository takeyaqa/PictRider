export interface PictParameter {
  id: string
  name: string
  values: string
  isValid: boolean
}

export interface PictCondition {
  ifOrThen: 'if' | 'then'
  predicate: string
  parameterRef: PictParameter
}

export interface PictConstraint {
  id: string
  conditions: PictCondition[]
}

export interface PictOutput {
  header: { id: number; name: string }[]
  body: { id: number; values: { id: number; value: string }[] }[]
}
