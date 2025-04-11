import { PictConstraint, PictParameter } from './types'
import { printConstraints } from './pict/pict-helper'

export function convertConstraintWrapper(
  constraints: PictConstraint[],
  parameters: PictParameter[],
): string {
  return printConstraints(
    constraints.map((c) => ({
      conditions: c.conditions.map((cond) => ({
        ifOrThen: cond.ifOrThen,
        predicate: cond.predicate,
        parameter: cond.parameterRef.name,
      })),
    })),
    parameters.map((p) => p.name),
  )
}

export function uuidv4(): string {
  return crypto.randomUUID()
}
