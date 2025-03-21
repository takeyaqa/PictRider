import { Parameter, Condition, Constraint } from './pict/pict-types'

export interface PictParameter extends Parameter {
  id: string
  isValid: boolean
}

export interface PictCondition extends Condition {
  parameterId: string
}

export interface PictConstraint extends Constraint {
  id: string
  conditions: PictCondition[]
}

export interface PictOutput {
  header: { id: number; name: string }[]
  body: { id: number; values: { id: number; value: string }[] }[]
}
