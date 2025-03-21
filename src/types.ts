import { Parameter, Condition, Constraint, Output } from './pict/pict-types'

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

export interface PictOutput extends Output {
  id?: number
}
