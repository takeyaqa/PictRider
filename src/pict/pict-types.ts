export interface Parameter {
  name: string
  values: string
}

export interface Condition {
  ifOrThen: 'if' | 'then'
  parameter: string
  predicate: string
}

export interface Constraint {
  conditions: Condition[]
}

export interface Output {
  header: string[]
  body: string[][]
  modelFile: string
}

export interface Options {
  orderOfCombinations: number
}
